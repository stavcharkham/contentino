import { cp, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it, vi } from "vitest";
import type { ModelCall, ModelGateway, ModelRequest } from "@/lib/models";
import { parseLedger, serializeLedger } from "@/lib/ledger";
import { LocalStorage } from "@/lib/storage";
import type { WorkflowContext } from "./common";
import { approveBrief, makeBrief } from "./brief";
import { writeExternalComms } from "./generate";
import { formatMicrocopyResult, handleSlackEnvelope, syncDriveTranscripts, syncGoogleDocReviews } from "./surfaces";

const usage = { model: "mock", input_tokens: 10, output_tokens: 5, cache_read_tokens: 0, cache_write_tokens: 0, cost_usd: 0.001 };

class SurfaceGateway implements ModelGateway {
  async complete<T>(request: ModelRequest<T>): Promise<ModelCall<T>> {
    let value: unknown;
    if (request.system.startsWith("Apply reviewer feedback")) value = request.prompt.includes("Make it shorter")
      ? { mode: "rewrite", was: "the full draft", now: "a shorter draft", revised_body: "Drivers can now use a rate described in the approved brief.", criterion: "plain-language" }
      : { mode: "replace", was: "Arizona drivers", now: "Drivers in Arizona", criterion: "direct-address" };
    else if (request.system.startsWith("Revise the draft")) value = { revised_body: "Drivers can now use a rate described in the approved brief.", summary: "Shortened the draft" };
    else if (request.system.startsWith("Route a message")) value = {
      intent: request.prompt.toLowerCase().includes("drive folder") ? "drive-sync"
        : request.prompt.toLowerCase().includes("button") || request.prompt.toLowerCase().includes("cta") ? "microcopy"
        : request.prompt.toLowerCase().includes("announce") || request.prompt.toLowerCase().includes("meeting") ? "announcement" : "other",
      request: request.prompt,
    };
    else if (request.job === "brief") value = { headline: "Autonomous miles", story: "A sourced story.", why_now: "Available now.", what_changed: "Pricing changed.", not_saying: ["No guarantees."], sources: [{ label: "Source", url: "drive://one" }] };
    else if (request.job === "generation") value = request.prompt.includes("one UI string") ? { copy: "FINISH QUOTE", rationale: "Specific" } : { title: "Autonomous miles", body: "Arizona drivers can now use a rate described in the approved brief." };
    else if (request.job === "stakes") value = { stakes: request.prompt.includes("Arizona") ? "high" : "low", reason: "Fixture" };
    else if (request.job === "compliance") value = request.prompt.startsWith("Judge the REQUEST")
      ? { pass: !/approved instantly|never use personal data/i.test(request.prompt.split("Request:")[1] ?? ""), reason: "Request demands a prohibited promise" }
      : { pass: true, reason: "Safe" };
    else if (request.job === "judge") value = { criteria: [
      { id: "register", score: 2, reason: "Matched" }, { id: "humour", score: 2, reason: "Safe" }, { id: "plain-language", score: 2, reason: "Plain" },
    ] };
    else if (request.job === "type-criteria") {
      const ids = request.prompt.includes("claim-sourced") ? ["direct-address", "claim-sourced", "why-now", "quote-fidelity"] : ["direct-address", "character-budget", "action-verb"];
      value = { criteria: ids.map((id) => ({ id, score: 2, reason: "Matched" })) };
    } else throw new Error(`Unhandled ${request.job}`);
    return { value: request.schema.parse(value), usage };
  }
}

async function context(): Promise<WorkflowContext> {
  const root = await mkdtemp(path.join(tmpdir(), "contentino-surfaces-"));
  await cp(path.join(process.cwd(), "profile"), path.join(root, "profile"), { recursive: true });
  await cp(path.join(process.cwd(), "metrics"), path.join(root, "metrics"), { recursive: true });
  await writeFile(path.join(root, "metrics/ledger.csv"), serializeLedger([]));
  return { storage: new LocalStorage(root), models: new SurfaceGateway(), now: () => new Date("2026-08-14T09:00:00.000Z") };
}

describe("surface orchestration", () => {
  it("processes a Slack request once", async () => {
    const ctx = await context();
    const slack = { acknowledge: vi.fn().mockResolvedValue(undefined), mapBrief: vi.fn(), mapDraft: vi.fn(), postMessage: vi.fn(), presentDraft: vi.fn(), presentDraftInThread: vi.fn(), postRevision: vi.fn(), postBriefForApproval: vi.fn(async (input) => input.threadTs ?? "9.9") };
    const envelope = { event_id: "Ev1", event: { type: "app_mention", text: "<@BOT> microcopy: CTA to finish a quote", user: "U1", ts: "1.1", channel: "C1" } };
    expect((await handleSlackEnvelope({ context: ctx, slack, envelope })).action).toBe("microcopy");
    expect(slack.acknowledge).toHaveBeenCalledWith("1.1");
    const duplicateMessageEvent = { event_id: "Ev2", event: { ...envelope.event, type: "message" } };
    expect(await handleSlackEnvelope({ context: ctx, slack, envelope: duplicateMessageEvent })).toEqual({ duplicate: true, action: "duplicate" });
    expect(slack.acknowledge).toHaveBeenCalledOnce();
    expect(parseLedger((await ctx.storage.read("metrics/ledger.csv"))?.content ?? "")).toHaveLength(1);
  });

  it("accepts a top-level mention delivered as a channel message event", async () => {
    const ctx = await context();
    const slack = { acknowledge: vi.fn().mockResolvedValue(undefined), mapBrief: vi.fn(), mapDraft: vi.fn(), postMessage: vi.fn(), presentDraft: vi.fn(), presentDraftInThread: vi.fn(), postRevision: vi.fn(), postBriefForApproval: vi.fn(async (input) => input.threadTs ?? "9.9") };
    const envelope = { event_id: "Ev3", event: { type: "message", text: "<@BOT> microcopy: CTA to finish a quote", user: "U1", ts: "2.1", channel: "C1" } };
    expect((await handleSlackEnvelope({ context: ctx, slack, envelope })).action).toBe("microcopy");
    expect(slack.postMessage).toHaveBeenCalledWith(expect.stringContaining("*FINISH QUOTE*"), "2.1");
    expect(slack.postMessage).toHaveBeenCalledWith(expect.stringContaining("*Published automatically.*"), "2.1");
    expect(slack.postMessage).not.toHaveBeenCalledWith(expect.stringContaining("content/"), "2.1");
    expect(slack.mapDraft).toHaveBeenCalledWith("2.1", expect.stringMatching(/^content\/published\//));
  });

  it("shows the full brief in Slack and generates the full external draft after a thread approval", async () => {
    const ctx = await context();
    const slack = {
      acknowledge: vi.fn().mockResolvedValue(undefined),
      mapBrief: vi.fn(),
      mapDraft: vi.fn(),
      postMessage: vi.fn(),
      postBriefForApproval: vi.fn(async (input: { threadTs?: string; body: string; briefPath: string }) => {
        const threadTs = input.threadTs ?? "9.9";
        await ctx.storage.create(`content/surfaces/slack/${threadTs.replaceAll(".", "-")}.json`, JSON.stringify({ thread_ts: threadTs, brief_path: input.briefPath }));
        return threadTs;
      }),
      presentDraft: vi.fn(),
      presentDraftInThread: vi.fn(async (threadTs: string, draft: { path: string }) => {
        const mappingPath = `content/surfaces/slack/${threadTs.replaceAll(".", "-")}.json`;
        const current = await ctx.storage.read(mappingPath);
        await ctx.storage.update(mappingPath, JSON.stringify({ ...JSON.parse(current?.content ?? "{}"), draft_path: draft.path }), current?.version ?? "", "Map draft");
        return { surface: "slack" as const, externalId: threadTs };
      }),
      postRevision: vi.fn(),
    };
    const request = { event: { type: "app_mention", text: "<@BOT> brief: a sourced transcript", user: "U1", ts: "3.1", channel: "C1" } };
    expect((await handleSlackEnvelope({ context: ctx, slack, envelope: request })).action).toBe("brief");
    expect(slack.postBriefForApproval).toHaveBeenCalledWith(expect.objectContaining({
      threadTs: "3.1",
      body: expect.stringContaining("*Autonomous miles*"),
      briefPath: expect.stringMatching(/^content\/briefs\//),
    }));

    const approval = { event: { type: "app_mention", text: "<@BOT> write it here", user: "U1", ts: "3.2", thread_ts: "3.1", channel: "C1" } };
    expect((await handleSlackEnvelope({ context: ctx, slack, envelope: approval })).action).toBe("approved-brief");
    expect(slack.presentDraftInThread).toHaveBeenCalledWith("3.1", expect.objectContaining({
      content: expect.stringContaining("Arizona drivers can now use a rate"),
      score: expect.any(Number),
    }));
  });

  it("treats an ordinary reply to a generated piece as feedback instead of a failed command", async () => {
    const ctx = await context();
    const slack = { acknowledge: vi.fn().mockResolvedValue(undefined), mapBrief: vi.fn(), mapDraft: vi.fn(), postMessage: vi.fn(), presentDraft: vi.fn(), presentDraftInThread: vi.fn(), postRevision: vi.fn(), postBriefForApproval: vi.fn(async (input) => input.threadTs ?? "9.9") };
    const brief = await makeBrief({ context: ctx, transcript: "Source", source: "drive://feedback", sourceId: "feedback" });
    await approveBrief({ storage: ctx.storage, path: brief.path, approvedBy: "Stav" });
    const generated = await writeExternalComms({ context: ctx, briefPath: brief.path, triggeredBy: "test", trigger: "slack" });
    await ctx.storage.create("content/surfaces/slack/4-1.json", JSON.stringify({ thread_ts: "4.1", draft_path: generated.path }));
    const feedback = { event: { type: "message", text: "Make it shorter", user: "U1", ts: "4.2", thread_ts: "4.1", channel: "C1" } };
    expect((await handleSlackEnvelope({ context: ctx, slack, envelope: feedback })).action).toBe("reviewed");
    expect(slack.postRevision).toHaveBeenCalledWith("4.1", expect.stringContaining("Drivers can now use a rate"), expect.stringContaining("rescored"));
    expect(await ctx.storage.list("content/corrections")).toHaveLength(1);
  });

  it("routes a plain mention to the right skill without a prefix", async () => {
    const ctx = await context();
    const slack = { acknowledge: vi.fn().mockResolvedValue(undefined), mapBrief: vi.fn(), mapDraft: vi.fn(), postMessage: vi.fn(), presentDraft: vi.fn(), presentDraftInThread: vi.fn(), postRevision: vi.fn(), postBriefForApproval: vi.fn(async (input: { threadTs?: string }) => input.threadTs ?? "9.9") };
    const envelope = { event: { type: "app_mention", text: "<@BOT> I need a CTA button for the end of the quote flow", user: "U1", ts: "5.1", channel: "C1" } };
    expect((await handleSlackEnvelope({ context: ctx, slack, envelope })).action).toBe("microcopy");
    expect(slack.postMessage).toHaveBeenCalledWith(expect.stringContaining("*FINISH QUOTE*"), "5.1");
  });

  it("holds a compliant alternative for review when the request demands prohibited claims", async () => {
    const ctx = await context();
    const slack = { acknowledge: vi.fn().mockResolvedValue(undefined), mapBrief: vi.fn(), mapDraft: vi.fn(), postMessage: vi.fn(), presentDraft: vi.fn(), presentDraftInThread: vi.fn(), postRevision: vi.fn(), postBriefForApproval: vi.fn(async (input: { threadTs?: string }) => input.threadTs ?? "9.9") };
    const envelope = { event: { type: "app_mention", text: "<@BOT> microcopy: Button promising everyone is approved instantly", user: "U1", ts: "6.1", channel: "C1" } };
    expect((await handleSlackEnvelope({ context: ctx, slack, envelope })).action).toBe("microcopy");
    const message = slack.postMessage.mock.calls[0][0] as string;
    expect(message).toContain("held for your review");
    expect(message).not.toContain("Published automatically");
    expect(slack.mapDraft).toHaveBeenCalledWith("6.1", expect.stringMatching(/^content\/drafts\//));
  });

  it("explains blocked routing without exposing a storage path", () => {
    const message = formatMicrocopyResult("SEE MY PRICE", {
      piece_id: "piece",
      source_hash: "hash",
      scored_at: "2026-08-13T20:00:00.000Z",
      content_type: "product-microcopy",
      stakes: "medium",
      ceiling: "low",
      criteria: [{ id: "mechanics", name: "Mechanics", score: 2, reason: "Pass" }],
      score: 9,
      compliance: { pass: false, reason: "Pricing requires review" },
      attempt: 1,
      outcome: "blocked",
      usage: [],
      cost_usd: 0,
    });
    expect(message).toContain("*Blocked:* The compliance gate flagged this medium-stakes wording.");
    expect(message).not.toContain("content/");
  });

  it("creates one brief per Drive source id", async () => {
    const ctx = await context();
    const drive = {
      listTranscripts: vi.fn().mockResolvedValue([{ id: "file-1", name: "Call", mimeType: "text/plain", source: "drive://file-1" }]),
      readTranscript: vi.fn().mockResolvedValue("A sourced transcript"),
    };
    expect(await syncDriveTranscripts({ context: ctx, drive })).toHaveLength(1);
    expect(await syncDriveTranscripts({ context: ctx, drive })).toHaveLength(0);
    expect(drive.readTranscript).toHaveBeenCalledOnce();
  });

  it("applies a Google comment once even when polling returns it again", async () => {
    const ctx = await context();
    const brief = await makeBrief({ context: ctx, transcript: "Source", source: "drive://one", sourceId: "one" });
    await approveBrief({ storage: ctx.storage, path: brief.path, approvedBy: "Stav", now: new Date("2026-08-14T09:30:00.000Z") });
    const draft = await writeExternalComms({ context: ctx, briefPath: brief.path, triggeredBy: "drive", trigger: "drive" });
    await ctx.storage.create("content/surfaces/gdocs/doc-1.json", JSON.stringify({ document_id: "doc-1", draft_path: draft.path }));
    const docs = {
      collectFeedback: vi.fn().mockResolvedValue([{ externalId: "comment-1", who: "Stav", said: "Lead with the people", quotedText: "Arizona drivers" }]),
      reply: vi.fn(),
      replaceAndResolve: vi.fn(),
    };
    expect(await syncGoogleDocReviews({ context: ctx, docs })).toEqual({ applied: 1, clarifications: 0 });
    expect(await syncGoogleDocReviews({ context: ctx, docs })).toEqual({ applied: 0, clarifications: 0 });
    expect(docs.replaceAndResolve).toHaveBeenCalledOnce();
  });
});
