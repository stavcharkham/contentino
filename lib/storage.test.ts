import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it, vi } from "vitest";
import { GitHubStorage, type GitHubApi, LocalStorage, StorageConflictError } from "./storage";

describe("LocalStorage", () => {
  it("creates, updates, lists and moves with version checks", async () => {
    const root = await mkdtemp(path.join(tmpdir(), "contentino-storage-"));
    const storage = new LocalStorage(root);
    const created = await storage.create("content/drafts/a.md", "first");
    expect(created.version).toHaveLength(64);
    const updated = await storage.update("content/drafts/a.md", "second", created.version);
    expect((await storage.list("content/drafts"))[0].content).toBe("second");
    const moved = await storage.move("content/drafts/a.md", "content/published/a.md", updated.version);
    expect(moved.content).toBe("second");
    expect(await storage.read("content/drafts/a.md")).toBeNull();
  });

  it("refuses stale updates and path traversal", async () => {
    const root = await mkdtemp(path.join(tmpdir(), "contentino-storage-"));
    const storage = new LocalStorage(root);
    await storage.create("content/drafts/a.md", "first");
    await expect(storage.update("content/drafts/a.md", "second", "stale")).rejects.toBeInstanceOf(StorageConflictError);
    await expect(storage.read("../secret")).rejects.toThrow("escapes the root");
  });

  it("commits related files together after preflight succeeds", async () => {
    const root = await mkdtemp(path.join(tmpdir(), "contentino-storage-"));
    const storage = new LocalStorage(root);
    await storage.commit({
      message: "Record run",
      changes: [
        { type: "write", path: "content/drafts/a.md", content: "draft", expectedVersion: null },
        { type: "write", path: "content/drafts/a.score.json", content: "{}", expectedVersion: null },
      ],
    });
    expect(await storage.list("content/drafts")).toHaveLength(2);
  });

  it("allows only one concurrent create for an idempotency marker", async () => {
    const root = await mkdtemp(path.join(tmpdir(), "contentino-storage-race-"));
    const first = new LocalStorage(root);
    const second = new LocalStorage(root);
    const results = await Promise.allSettled([
      first.create("content/events/slack-one.json", "first"),
      second.create("content/events/slack-one.json", "second"),
    ]);
    expect(results.filter((result) => result.status === "fulfilled")).toHaveLength(1);
    const rejected = results.filter((result): result is PromiseRejectedResult => result.status === "rejected");
    expect(rejected).toHaveLength(1);
    expect(rejected[0].reason).toBeInstanceOf(StorageConflictError);
  });
});

describe("GitHubStorage", () => {
  it("writes a logical run as one tree and one commit", async () => {
    const api = {
      repos: { getContent: vi.fn() },
      git: {
        getRef: vi.fn().mockResolvedValue({ data: { object: { sha: "head" } } }),
        getCommit: vi.fn().mockResolvedValue({ data: { tree: { sha: "base-tree" } } }),
        getTree: vi.fn().mockResolvedValue({ data: { tree: [] } }),
        createBlob: vi.fn()
          .mockResolvedValueOnce({ data: { sha: "draft-blob" } })
          .mockResolvedValueOnce({ data: { sha: "score-blob" } }),
        createTree: vi.fn().mockResolvedValue({ data: { sha: "next-tree" } }),
        createCommit: vi.fn().mockResolvedValue({ data: { sha: "next-commit" } }),
        updateRef: vi.fn().mockResolvedValue({ data: {} }),
      },
    } as unknown as GitHubApi;
    const storage = new GitHubStorage(api, "owner", "repo");
    const result = await storage.commit({
      message: "Record run",
      changes: [
        { type: "write", path: "content/drafts/a.md", content: "draft", expectedVersion: null },
        { type: "write", path: "content/drafts/a.score.json", content: "{}", expectedVersion: null },
      ],
    });
    expect(result.version).toBe("next-commit");
    expect(api.git.createTree).toHaveBeenCalledOnce();
    expect(api.git.createCommit).toHaveBeenCalledOnce();
    expect(api.git.updateRef).toHaveBeenCalledWith(expect.objectContaining({ force: false }));
  });

  it("serves its own writes even when GitHub's read API lags behind", async () => {
    const api = {
      repos: { getContent: vi.fn().mockRejectedValue(Object.assign(new Error("Not Found"), { status: 404 })) },
      git: {
        getRef: vi.fn().mockResolvedValue({ data: { object: { sha: "head" } } }),
        getCommit: vi.fn().mockResolvedValue({ data: { tree: { sha: "base-tree" } } }),
        getTree: vi.fn()
          .mockResolvedValueOnce({ data: { tree: [] } })
          .mockResolvedValue({ data: { tree: [{ path: "content/drafts/lag.md", type: "blob", sha: "fresh-blob" }] } }),
        createBlob: vi.fn().mockResolvedValue({ data: { sha: "fresh-blob" } }),
        createTree: vi.fn().mockResolvedValue({ data: { sha: "next-tree" } }),
        createCommit: vi.fn().mockResolvedValue({ data: { sha: "next-commit" } }),
        updateRef: vi.fn().mockResolvedValue({ data: {} }),
      },
    } as unknown as GitHubApi;
    const storage = new GitHubStorage(api, "owner", "repo");
    const created = await storage.create("content/drafts/lag.md", "fresh content");
    expect(created).toEqual({ path: "content/drafts/lag.md", content: "fresh content", version: "fresh-blob" });
    expect(await storage.read("content/drafts/lag.md")).toEqual(created);
    await storage.commit({ message: "Delete", changes: [{ type: "delete", path: "content/drafts/lag.md", expectedVersion: "fresh-blob" }] });
    expect(await storage.read("content/drafts/lag.md")).toBeNull();
  });

  it("rejects a create when the branch already contains the path", async () => {
    const api = {
      repos: { getContent: vi.fn() },
      git: {
        getRef: vi.fn().mockResolvedValue({ data: { object: { sha: "head" } } }),
        getCommit: vi.fn().mockResolvedValue({ data: { tree: { sha: "base-tree" } } }),
        getTree: vi.fn().mockResolvedValue({ data: { tree: [{ type: "blob", path: "content/a.md", sha: "existing" }] } }),
      },
    } as unknown as GitHubApi;
    const storage = new GitHubStorage(api, "owner", "repo");
    await expect(storage.create("content/a.md", "new")).rejects.toBeInstanceOf(StorageConflictError);
  });

  it("retries a logical commit when an unrelated GitHub write moves the branch", async () => {
    const api = {
      repos: { getContent: vi.fn() },
      git: {
        getRef: vi.fn()
          .mockResolvedValueOnce({ data: { object: { sha: "head-1" } } })
          .mockResolvedValueOnce({ data: { object: { sha: "head-2" } } }),
        getCommit: vi.fn()
          .mockResolvedValueOnce({ data: { tree: { sha: "tree-1" } } })
          .mockResolvedValueOnce({ data: { tree: { sha: "tree-2" } } }),
        getTree: vi.fn().mockResolvedValue({ data: { tree: [] } }),
        createBlob: vi.fn().mockResolvedValue({ data: { sha: "blob" } }),
        createTree: vi.fn().mockResolvedValue({ data: { sha: "next-tree" } }),
        createCommit: vi.fn()
          .mockResolvedValueOnce({ data: { sha: "commit-1" } })
          .mockResolvedValueOnce({ data: { sha: "commit-2" } }),
        updateRef: vi.fn()
          .mockRejectedValueOnce(Object.assign(new Error("Reference update failed"), { status: 422 }))
          .mockResolvedValueOnce({ data: {} }),
      },
    } as unknown as GitHubApi;
    const storage = new GitHubStorage(api, "owner", "repo");
    expect(await storage.commit({ message: "Record run", changes: [{ type: "write", path: "content/a.md", content: "new", expectedVersion: null }] }))
      .toEqual({ version: "commit-2" });
    expect(api.git.updateRef).toHaveBeenCalledTimes(2);
  });
});
