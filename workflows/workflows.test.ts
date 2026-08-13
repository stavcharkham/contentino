import { cp, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import type { ModelCall, ModelGateway, ModelRequest } from "@/lib/models";
import { parseLedger, serializeLedger } from "@/lib/ledger";
import { LocalStorage } from "@/lib/storage";
import { approveBrief, makeBrief } from "./brief";
import { addContentType, validateContentType } from "./content-type";
import { writeExternalComms, writeMicrocopy } from "./generate";
import { approveGuideline, clusterCorrections } from "./learning";
import { applyReview, renderCorrection } from "./review";
import type { WorkflowContext } from "./common";

const usage = { model: "mock", input_tokens: 10, output_tokens: 5, cache_read_tokens: 0, cache_write_tokens: 0, cost_usd: 0.001 };

class PerfectGateway implements ModelGateway {
  async complete<T>(request: ModelRequest<T>): Promise<ModelCall<T>> {
    let value: unknown;
    if (request.job === "brief") value = {
      headline: "A clearer way to insure autonomous miles",
      story: "Lemonade introduced coverage priced around autonomous driving.",
      why_now: "The product is now available in Arizona.",
      what_changed: "Tesla FSD miles receive a different rate.",
      quote: { text: "This changes how risk is priced.", attribution: "Daniel Schreiber", source_excerpt: "This changes how risk is priced." },
      not_saying: ["Do not claim autonomous driving eliminates risk."],
      sources: [{ label: "Transcript", url: "drive://call-1" }],
    };
    else if (request.job === "generation") {
      if (request.prompt.includes("one UI string")) {
        expect(request.maxTokens).toBe(600);
        value = { copy: "FINISH QUOTE", rationale: "Matches the established action verb." };
      } else {
        value = { title: "A clearer price for autonomous miles", body: "Arizona drivers using Tesla FSD can now get a rate that reflects those miles. The launch follows the product announcement in the approved brief." };
      }
    }
    else if (request.job === "stakes") value = { stakes: request.prompt.includes("Arizona") ? "high" : "low", reason: "Fixture stakes" };
    else if (request.job === "compliance") {
      expect(request.maxTokens).toBe(600);
      value = request.prompt.includes("guaranteed to save money")
        ? { pass: false, reason: "Unsupported guarantee" }
        : { pass: true, reason: "Every claim is sourced" };
    }
    else if (request.job === "judge") value = { criteria: [
      { id: "register", score: 2, reason: "Matched" },
      { id: "humour", score: 2, reason: "Safe" },
      { id: "plain-language", score: 2, reason: "Plain" },
    ] };
    else if (request.job === "type-criteria") {
      const ids = request.prompt.includes("claim-sourced")
        ? ["direct-address", "claim-sourced", "why-now", "quote-fidelity"]
        : request.prompt.includes("character-budget")
          ? ["direct-address", "character-budget", "action-verb"]
          : ["audience-fit"];
      value = { criteria: ids.map((id) => ({ id, score: 2, reason: "Matched" })) };
    } else if (request.job === "clustering") {
      const ids = [...request.prompt.matchAll(/^([a-f0-9]+):/gm)].map((match) => match[1]);
      value = { groups: [{ correction_ids: ids, rule: "Use a specific action instead of “click here”." }] };
    } else throw new Error(`Unhandled model job ${request.job}`);
    return { value: request.schema.parse(value), usage };
  }
}

async function testContext(): Promise<WorkflowContext> {
  const root = await mkdtemp(path.join(tmpdir(), "contentino-workflow-"));
  await cp(path.join(process.cwd(), "profile"), path.join(root, "profile"), { recursive: true });
  await cp(path.join(process.cwd(), "metrics"), path.join(root, "metrics"), { recursive: true });
  await writeFile(path.join(root, "metrics/ledger.csv"), serializeLedger([]));
  return { storage: new LocalStorage(root), models: new PerfectGateway(), now: () => new Date("2026-08-14T09:00:00.000Z") };
}

describe("content workflows", () => {
  it("auto-publishes passing low-stakes microcopy and records its value", async () => {
    const context = await testContext();
    const result = await writeMicrocopy({ context, request: "CTA to finish a quote", triggeredBy: "stav", trigger: "claude" });
    expect(result.path).toContain("content/published/");
    expect(result.scorecard.outcome).toBe("auto-published");
    expect((await context.storage.read(result.path))?.content).toContain("status: published");
    const ledger = await context.storage.read("metrics/ledger.csv");
    expect(parseLedger(ledger?.content ?? "")).toEqual([expect.objectContaining({ minutes_saved: 20 })]);
  });

  it("requires brief approval and always routes external comms to review", async () => {
    const context = await testContext();
    const brief = await makeBrief({ context, transcript: "This changes how risk is priced.", source: "drive://call-1", sourceId: "call-1" });
    await expect(writeExternalComms({ context, briefPath: brief.path, triggeredBy: "drive", trigger: "drive" })).rejects.toThrow("approved brief");
    await approveBrief({ storage: context.storage, path: brief.path, approvedBy: "Stav", now: new Date("2026-08-14T10:00:00.000Z") });
    const result = await writeExternalComms({ context, briefPath: brief.path, triggeredBy: "drive", trigger: "drive" });
    expect(result.scorecard.score).toBe(10);
    expect(result.scorecard.outcome).toBe("reviewed");
    expect(result.path).toContain("content/drafts/");
  });

  it("turns an exact human edit into a correction and revised ledger row", async () => {
    const context = await testContext();
    const brief = await makeBrief({ context, transcript: "This changes how risk is priced.", source: "drive://call-1", sourceId: "call-1" });
    await approveBrief({ storage: context.storage, path: brief.path, approvedBy: "Stav", now: new Date("2026-08-14T10:00:00.000Z") });
    const draft = await writeExternalComms({ context, briefPath: brief.path, triggeredBy: "drive", trigger: "drive" });
    const reviewed = await applyReview({
      context,
      draftPath: draft.path,
      surface: "claude",
      who: "Stav",
      criterion: "direct-address",
      was: "Arizona drivers using Tesla FSD",
      now: "Drivers in Arizona who use Tesla FSD",
      said: "Lead with the people, then the location.",
    });
    expect(reviewed.correction.said).toBe("Lead with the people, then the location.");
    expect((await context.storage.list("content/corrections"))).toHaveLength(1);
    const ledger = parseLedger((await context.storage.read("metrics/ledger.csv"))?.content ?? "");
    expect(ledger[0]).toEqual(expect.objectContaining({ revisions: 1, outcome: "reviewed" }));
  });

  it("blocks a reviewed revision that introduces a compliance violation", async () => {
    const context = await testContext();
    const brief = await makeBrief({ context, transcript: "This changes how risk is priced.", source: "drive://call-1", sourceId: "call-1" });
    await approveBrief({ storage: context.storage, path: brief.path, approvedBy: "Stav", now: new Date("2026-08-14T10:00:00.000Z") });
    const draft = await writeExternalComms({ context, briefPath: brief.path, triggeredBy: "drive", trigger: "drive" });
    const reviewed = await applyReview({
      context,
      draftPath: draft.path,
      surface: "claude",
      who: "reviewer",
      criterion: "compliance",
      was: "can now get a rate that reflects those miles",
      now: "are guaranteed to save money",
      said: "Make the saving absolute.",
    });
    expect(reviewed.score.outcome).toBe("blocked");
    expect((await context.storage.read(draft.path))?.content).toContain("status: blocked");
    expect(parseLedger((await context.storage.read("metrics/ledger.csv"))?.content ?? "")[0]).toMatchObject({ outcome: "blocked", minutes_saved: 0 });
  });

  it("proposes and applies a guideline only from four corrections", async () => {
    const context = await testContext();
    const ids = ["a001", "a002", "a003", "a004"];
    await context.storage.commit({
      message: "Seed correction evidence",
      changes: ids.map((id) => ({
        type: "write" as const,
        path: `content/corrections/2026-08-14-${id}.md`,
        expectedVersion: null,
        content: renderCorrection({
          id,
          created: "2026-08-14T09:00:00.000Z",
          content_type: "product-microcopy",
          piece: `content/drafts/${id}.md`,
          surface: "claude",
          who: "reviewer",
          criterion: "action-verb",
          status: "open",
          was: "Click here",
          now: "Finish quote",
          said: "Name the action instead of saying click here",
        }),
      })),
    });
    const proposals = await clusterCorrections(context);
    expect(proposals).toHaveLength(1);
    const proposalPath = `content/guidelines/${proposals[0].id}.md`;
    await approveGuideline({ storage: context.storage, proposalPath, approvedBy: "Stav", now: new Date("2026-08-14T11:00:00.000Z") });
    const guideline = await context.storage.read("profile/types/product-microcopy/guideline.md");
    expect(guideline?.content).toContain("Use a specific action");
    const corrections = await context.storage.list("content/corrections");
    expect(corrections.every((file) => file.content.includes("status: resolved"))).toBe(true);
  });

  it("activates a new type only after its examples pass", async () => {
    const context = await testContext();
    await addContentType(context.storage, {
      slug: "internal-comms",
      owner: "people-team",
      max_autopublish_stakes: "low",
      mechanics: { max_chars: 1000, sentence_band: [1, 30] },
      guideline: "State the change, who it affects, when it starts and where questions go.",
      criteria: [{ id: "audience-fit", name: "Audience fit", question: "Does the note tell employees what changes for them?" }],
      examples: [1, 2, 3].map((number) => ({ id: `approved-${number}`, stakes: "low", content: `Team update ${number}: the office closes at 4 PM Friday.`, source: `internal://approved-${number}` })),
    });
    expect((await context.storage.read("profile/types/internal-comms/guideline.md"))?.content).toContain("status: draft");
    const result = await validateContentType(context, "internal-comms");
    expect(result.active).toBe(true);
    expect(result.scores).toEqual([10, 10, 10]);
    expect((await context.storage.read("profile/types/internal-comms/guideline.md"))?.content).toContain("status: active");
  });
});
