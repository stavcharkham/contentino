import { createHmac } from "node:crypto";
import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it, vi } from "vitest";
import { LocalStorage } from "@/lib/storage";
import { GoogleDocsReviewAdapter, type GoogleApis } from "./google";
import { SlackReviewAdapter, verifySlackSignature } from "./slack";

describe("Slack adapter", () => {
  it("verifies a fresh signature and rejects replay", () => {
    const body = JSON.stringify({ event: { type: "app_mention" } });
    const timestamp = "1000";
    const signature = `v0=${createHmac("sha256", "secret").update(`v0:${timestamp}:${body}`).digest("hex")}`;
    expect(verifySlackSignature({ signingSecret: "secret", timestamp, signature, body, nowSeconds: 1100 })).toBe(true);
    expect(verifySlackSignature({ signingSecret: "secret", timestamp, signature, body, nowSeconds: 1400 })).toBe(false);
  });

  it("presents a draft in a mapped thread and collects human replies", async () => {
    const root = await mkdtemp(path.join(tmpdir(), "contentino-slack-"));
    const storage = new LocalStorage(root);
    const api = {
      chat: { postMessage: vi.fn().mockResolvedValue({ ts: "123.456" }) },
      conversations: { replies: vi.fn().mockResolvedValue({ messages: [
        { ts: "123.456", text: "draft", bot_id: "bot" },
        { ts: "123.457", text: "Use finish quote", user: "U1" },
      ] }) },
      reactions: { add: vi.fn().mockResolvedValue({ ok: true }) },
    };
    const adapter = new SlackReviewAdapter(api, "C1", storage);
    await adapter.acknowledge("123.455");
    expect(api.reactions.add).toHaveBeenCalledWith({ channel: "C1", timestamp: "123.455", name: "eyes" });
    const presented = await adapter.presentDraft({ path: "content/drafts/a.md", title: "Draft", content: "Copy", score: 9, outcome: "reviewed" });
    expect(presented.externalId).toBe("123.456");
    expect(await storage.read("content/surfaces/slack/123-456.json")).not.toBeNull();
    expect(await adapter.collectFeedback("123.456")).toEqual([{ externalId: "123.457", who: "U1", said: "Use finish quote" }]);
  });

  it("never posts an eyes reply when a reaction fails", async () => {
    const root = await mkdtemp(path.join(tmpdir(), "contentino-slack-ack-"));
    const api = {
      chat: { postMessage: vi.fn().mockResolvedValue({ ts: "123.457" }) },
      conversations: { replies: vi.fn() },
      reactions: { add: vi.fn().mockRejectedValue(new Error("missing_scope")) },
    };
    const adapter = new SlackReviewAdapter(api, "C1", new LocalStorage(root));
    await expect(adapter.acknowledge("123.456")).rejects.toThrow("missing_scope");
    expect(api.chat.postMessage).not.toHaveBeenCalled();
  });
});

describe("Google Docs adapter", () => {
  it("reads anchored feedback, applies the edit and resolves with a reply", async () => {
    const root = await mkdtemp(path.join(tmpdir(), "contentino-gdocs-"));
    const api = {
      docs: { documents: {
        create: vi.fn(),
        get: vi.fn().mockResolvedValue({ data: { body: { content: [{ endIndex: 12 }] } } }),
        batchUpdate: vi.fn().mockResolvedValue({ data: {} }),
      } },
      drive: {
        files: { update: vi.fn() },
        comments: { list: vi.fn().mockResolvedValue({ data: { comments: [{
          id: "comment-1",
          content: "Use Finish quote",
          resolved: false,
          quotedFileContent: { value: "Click here" },
          author: { displayName: "Stav" },
        }] } }) },
        replies: { create: vi.fn().mockResolvedValue({ data: {} }) },
      },
    } as unknown as GoogleApis;
    const adapter = new GoogleDocsReviewAdapter(api, "folder", new LocalStorage(root));
    expect(await adapter.collectFeedback("doc-1")).toEqual([{
      externalId: "comment-1",
      who: "Stav",
      said: "Use Finish quote",
      quotedText: "Click here",
    }]);
    await adapter.replaceAndResolve("doc-1", "comment-1", "Click here", "Finish quote");
    expect(api.docs.documents.batchUpdate).toHaveBeenCalledWith(expect.objectContaining({ documentId: "doc-1" }));
    expect(api.drive.replies.create).toHaveBeenCalledWith(expect.objectContaining({ requestBody: expect.objectContaining({ action: "resolve" }) }));
  });

  it("replaces a review document when publishing a full revision", async () => {
    const root = await mkdtemp(path.join(tmpdir(), "contentino-gdocs-revision-"));
    const api = {
      docs: { documents: {
        get: vi.fn().mockResolvedValue({ data: { body: { content: [{ endIndex: 12 }] } } }),
        batchUpdate: vi.fn().mockResolvedValue({ data: {} }),
      } },
      drive: {},
    } as unknown as GoogleApis;
    const adapter = new GoogleDocsReviewAdapter(api, "folder", new LocalStorage(root));
    await adapter.postRevision("doc-1", "New draft", "Rescored");
    expect(api.docs.documents.batchUpdate).toHaveBeenNthCalledWith(1, expect.objectContaining({
      requestBody: { requests: [
        { deleteContentRange: { range: { startIndex: 1, endIndex: 11 } } },
        { insertText: { location: { index: 1 }, text: "New draft" } },
      ] },
    }));
  });
});
