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
import { handleSlackEnvelope, syncDriveTranscripts, syncGoogleDocReviews } from "./surfaces";

const usage = { model: "mock", input_tokens: 10, output_tokens: 5, cache_read_tokens: 0, cache_write_tokens: 0, cost_usd: 0.001 };

class SurfaceGateway implements ModelGateway {
  async complete<T>(request: ModelRequest<T>): Promise<ModelCall<T>> {
    let value: unknown;
    if (request.system.startsWith("Turn review feedback")) value = { clarification_needed: false, was: "Arizona drivers", now: "Drivers in Arizona", criterion: "direct-address" };
    else if (request.job === "brief") value = { headline: "Autonomous miles", story: "A sourced story.", why_now: "Available now.", what_changed: "Pricing changed.", not_saying: ["No guarantees."], sources: [{ label: "Source", url: "drive://one" }] };
    else if (request.job === "generation") value = request.prompt.includes("one UI string") ? { copy: "FINISH QUOTE", rationale: "Specific" } : { title: "Autonomous miles", body: "Arizona drivers can now use a rate described in the approved brief." };
    else if (request.job === "stakes") value = { stakes: request.prompt.includes("Arizona") ? "high" : "low", reason: "Fixture" };
    else if (request.job === "compliance") value = { pass: true, reason: "Safe" };
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
    const slack = { acknowledge: vi.fn().mockResolvedValue(undefined), postMessage: vi.fn(), presentDraft: vi.fn(), postRevision: vi.fn() };
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
    const slack = { acknowledge: vi.fn().mockResolvedValue(undefined), postMessage: vi.fn(), presentDraft: vi.fn(), postRevision: vi.fn() };
    const envelope = { event_id: "Ev3", event: { type: "message", text: "<@BOT> microcopy: CTA to finish a quote", user: "U1", ts: "2.1", channel: "C1" } };
    expect((await handleSlackEnvelope({ context: ctx, slack, envelope })).action).toBe("microcopy");
    expect(slack.postMessage).toHaveBeenCalledWith(expect.stringContaining("*FINISH QUOTE*"), "2.1");
    expect(slack.postMessage).toHaveBeenCalledWith(expect.stringContaining("content/published/"), "2.1");
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
