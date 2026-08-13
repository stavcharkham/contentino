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
});
