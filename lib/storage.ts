import { createHash, randomUUID } from "node:crypto";
import { mkdir, readFile, readdir, rename, rm, rmdir, stat, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import { Octokit } from "@octokit/rest";
import type { ContentinoConfig } from "./config";

export type StoredFile = { path: string; content: string; version: string };
export type StorageChange =
  | { type: "write"; path: string; content: string; expectedVersion: string | null }
  | { type: "delete"; path: string; expectedVersion: string };
export type StorageCommit = { message: string; changes: StorageChange[] };

export class StorageConflictError extends Error {}

export interface ContentStorage {
  read(filePath: string): Promise<StoredFile | null>;
  list(prefix: string): Promise<StoredFile[]>;
  commit(change: StorageCommit): Promise<{ version: string }>;
  create(filePath: string, content: string, message?: string): Promise<StoredFile>;
  update(filePath: string, content: string, expectedVersion: string, message?: string): Promise<StoredFile>;
  move(source: string, destination: string, expectedVersion: string, message?: string): Promise<StoredFile>;
}

export function contentHash(content: string): string {
  return createHash("sha256").update(content).digest("hex");
}

function normaliseStoragePath(filePath: string): string {
  const normalised = path.posix.normalize(filePath.replaceAll("\\", "/"));
  if (normalised.startsWith("../") || normalised === ".." || path.posix.isAbsolute(normalised)) {
    throw new Error(`Storage path escapes the root: ${filePath}`);
  }
  return normalised;
}

abstract class StorageConvenience implements ContentStorage {
  abstract read(filePath: string): Promise<StoredFile | null>;
  abstract list(prefix: string): Promise<StoredFile[]>;
  abstract commit(change: StorageCommit): Promise<{ version: string }>;

  async create(filePath: string, content: string, message = `Create ${filePath}`): Promise<StoredFile> {
    await this.commit({ message, changes: [{ type: "write", path: filePath, content, expectedVersion: null }] });
    const stored = await this.read(filePath);
    if (!stored) throw new Error(`Storage did not create ${filePath}`);
    return stored;
  }

  async update(filePath: string, content: string, expectedVersion: string, message = `Update ${filePath}`): Promise<StoredFile> {
    await this.commit({ message, changes: [{ type: "write", path: filePath, content, expectedVersion }] });
    const stored = await this.read(filePath);
    if (!stored) throw new Error(`Storage did not update ${filePath}`);
    return stored;
  }

  async move(source: string, destination: string, expectedVersion: string, message = `Move ${source}`): Promise<StoredFile> {
    const stored = await this.read(source);
    if (!stored || stored.version !== expectedVersion) throw new StorageConflictError(`Stale source ${source}`);
    await this.commit({
      message,
      changes: [
        { type: "write", path: destination, content: stored.content, expectedVersion: null },
        { type: "delete", path: source, expectedVersion },
      ],
    });
    const moved = await this.read(destination);
    if (!moved) throw new Error(`Storage did not move ${source}`);
    return moved;
  }
}

export class LocalStorage extends StorageConvenience {
  constructor(private readonly root: string) { super(); }

  private resolve(filePath: string): string {
    return path.join(this.root, normaliseStoragePath(filePath));
  }

  async read(filePath: string): Promise<StoredFile | null> {
    const storagePath = normaliseStoragePath(filePath);
    try {
      const content = await readFile(this.resolve(storagePath), "utf8");
      return { path: storagePath, content, version: contentHash(content) };
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
      throw error;
    }
  }

  async list(prefix: string): Promise<StoredFile[]> {
    const storagePrefix = normaliseStoragePath(prefix);
    const start = this.resolve(storagePrefix);
    try {
      const info = await stat(start);
      if (info.isFile()) return [await this.read(storagePrefix) as StoredFile];
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
      throw error;
    }
    const walk = async (directory: string): Promise<string[]> => {
      const entries = await readdir(directory, { withFileTypes: true });
      const nested = await Promise.all(entries.map((entry) => {
        const target = path.join(directory, entry.name);
        return entry.isDirectory() ? walk(target) : [target];
      }));
      return nested.flat();
    };
    return Promise.all((await walk(start)).sort().map(async (absolute) => {
      const relative = path.relative(this.root, absolute).split(path.sep).join("/");
      return await this.read(relative) as StoredFile;
    }));
  }

  private async acquireWriteLock(): Promise<() => Promise<void>> {
    await mkdir(this.root, { recursive: true });
    const lockPath = path.join(this.root, ".contentino-write-lock");
    for (let attempt = 0; attempt < 500; attempt += 1) {
      try {
        await mkdir(lockPath);
        return async () => { await rmdir(lockPath); };
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== "EEXIST") throw error;
        await delay(10);
      }
    }
    throw new StorageConflictError("Timed out waiting for the local storage write lock");
  }

  async commit(commit: StorageCommit): Promise<{ version: string }> {
    const release = await this.acquireWriteLock();
    try {
      return await this.commitLocked(commit);
    } finally {
      await release();
    }
  }

  private async commitLocked(commit: StorageCommit): Promise<{ version: string }> {
    if (!commit.changes.length) throw new Error("Storage commit needs at least one change");
    const changes = commit.changes.map((change) => ({ ...change, path: normaliseStoragePath(change.path) }));
    const originals = new Map<string, StoredFile | null>();
    for (const change of changes) {
      const current = await this.read(change.path);
      originals.set(change.path, current);
      const expected = change.expectedVersion;
      if (expected === null && current) throw new StorageConflictError(`${change.path} already exists`);
      if (expected !== null && current?.version !== expected) throw new StorageConflictError(`Stale version for ${change.path}`);
    }
    const tempFiles = new Map<string, string>();
    try {
      for (const change of changes) {
        if (change.type === "write") {
          const destination = this.resolve(change.path);
          await mkdir(path.dirname(destination), { recursive: true });
          const temporary = `${destination}.contentino-tmp-${randomUUID()}`;
          await writeFile(temporary, change.content, "utf8");
          tempFiles.set(change.path, temporary);
        }
      }
      for (const change of changes) {
        const destination = this.resolve(change.path);
        if (change.type === "write") await rename(tempFiles.get(change.path) as string, destination);
        else await unlink(destination);
      }
    } catch (error) {
      for (const [filePath, original] of originals) {
        const destination = this.resolve(filePath);
        if (original) await writeFile(destination, original.content, "utf8");
        else await rm(destination, { force: true });
      }
      throw error;
    } finally {
      await Promise.all([...tempFiles.values()].map((temporary) => rm(temporary, { force: true })));
    }
    return { version: contentHash(`${commit.message}:${Date.now()}`) };
  }
}

export type GitHubApi = Pick<Octokit, "repos" | "git">;

export class GitHubStorage extends StorageConvenience {
  // GitHub's content read API is eventually consistent: a read straight after a
  // commit can return stale or missing. Files written by this instance are served
  // from this overlay so every read-after-write within one run sees its own writes.
  private readonly overlay = new Map<string, StoredFile | null>();

  constructor(
    private readonly api: GitHubApi,
    private readonly owner: string,
    private readonly repo: string,
    private readonly branch = "main",
  ) { super(); }

  async read(filePath: string): Promise<StoredFile | null> {
    const storagePath = normaliseStoragePath(filePath);
    if (this.overlay.has(storagePath)) {
      const cached = this.overlay.get(storagePath) ?? null;
      return cached ? { ...cached } : null;
    }
    try {
      const response = await this.api.repos.getContent({ owner: this.owner, repo: this.repo, path: storagePath, ref: this.branch });
      if (Array.isArray(response.data) || response.data.type !== "file" || !("content" in response.data)) return null;
      const content = Buffer.from(response.data.content, "base64").toString("utf8");
      return { path: storagePath, content, version: response.data.sha };
    } catch (error) {
      if ((error as { status?: number }).status === 404) return null;
      throw error;
    }
  }

  async list(prefix: string): Promise<StoredFile[]> {
    const storagePrefix = normaliseStoragePath(prefix).replace(/\/$/, "");
    const ref = await this.api.git.getRef({ owner: this.owner, repo: this.repo, ref: `heads/${this.branch}` });
    const tree = await this.api.git.getTree({ owner: this.owner, repo: this.repo, tree_sha: ref.data.object.sha, recursive: "true" });
    const paths = tree.data.tree
      .filter((entry) => entry.type === "blob" && entry.path && (entry.path === storagePrefix || entry.path.startsWith(`${storagePrefix}/`)))
      .map((entry) => entry.path as string)
      .sort();
    return (await Promise.all(paths.map((filePath) => this.read(filePath)))).filter((file): file is StoredFile => Boolean(file));
  }

  async commit(commit: StorageCommit): Promise<{ version: string }> {
    for (let attempt = 1; attempt <= 4; attempt += 1) {
      try {
        return await this.commitAtHead(commit);
      } catch (error) {
        const status = (error as { status?: number }).status;
        const retryable = status === 409 || status === 422 || (typeof status === "number" && status >= 500);
        if (!retryable) throw error;
        if (attempt === 4) throw new StorageConflictError("GitHub branch changed during the logical commit");
        await delay(200 * attempt + Math.floor(Math.random() * 150));
      }
    }
    throw new StorageConflictError("GitHub branch changed during the logical commit");
  }

  private async commitAtHead(commit: StorageCommit): Promise<{ version: string }> {
    if (!commit.changes.length) throw new Error("Storage commit needs at least one change");
    const changes = commit.changes.map((change) => ({ ...change, path: normaliseStoragePath(change.path) }));
    const ref = await this.api.git.getRef({ owner: this.owner, repo: this.repo, ref: `heads/${this.branch}` });
    const head = ref.data.object.sha;
    const headCommit = await this.api.git.getCommit({ owner: this.owner, repo: this.repo, commit_sha: head });
    const tree = await this.api.git.getTree({ owner: this.owner, repo: this.repo, tree_sha: headCommit.data.tree.sha, recursive: "true" });
    const versions = new Map(tree.data.tree.filter((entry) => entry.type === "blob").map((entry) => [entry.path, entry.sha]));
    for (const change of changes) {
      const current = versions.get(change.path) ?? null;
      if (change.expectedVersion === null && current) throw new StorageConflictError(`${change.path} already exists`);
      if (change.expectedVersion !== null && current !== change.expectedVersion) throw new StorageConflictError(`Stale version for ${change.path}`);
    }
    const entries = await Promise.all(changes.map(async (change) => {
      if (change.type === "delete") return { path: change.path, mode: "100644" as const, type: "blob" as const, sha: null };
      const blob = await this.api.git.createBlob({ owner: this.owner, repo: this.repo, content: Buffer.from(change.content).toString("base64"), encoding: "base64" });
      return { path: change.path, mode: "100644" as const, type: "blob" as const, sha: blob.data.sha };
    }));
    const nextTree = await this.api.git.createTree({ owner: this.owner, repo: this.repo, base_tree: headCommit.data.tree.sha, tree: entries });
    const nextCommit = await this.api.git.createCommit({ owner: this.owner, repo: this.repo, message: commit.message, tree: nextTree.data.sha, parents: [head] });
    await this.api.git.updateRef({ owner: this.owner, repo: this.repo, ref: `heads/${this.branch}`, sha: nextCommit.data.sha, force: false });
    for (let index = 0; index < changes.length; index += 1) {
      const change = changes[index];
      const entry = entries[index];
      if (change.type === "write") this.overlay.set(change.path, { path: change.path, content: change.content, version: entry.sha as string });
      else this.overlay.set(change.path, null);
    }
    return { version: nextCommit.data.sha };
  }
}

export function createStorage(config: ContentinoConfig): ContentStorage {
  if (config.CONTENTINO_STORAGE === "github") {
    return new GitHubStorage(new Octokit({ auth: config.GITHUB_TOKEN }), config.GITHUB_OWNER as string, config.GITHUB_REPO, config.GITHUB_BRANCH);
  }
  return new LocalStorage(config.CONTENTINO_ROOT);
}
