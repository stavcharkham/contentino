import assert from "node:assert/strict";
import { cp, mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import type { ModelCall, ModelGateway, ModelRequest } from "@/lib/models";
import { parseLedger } from "@/lib/ledger";
import { LocalStorage } from "@/lib/storage";
import { parseMarkdown } from "@/lib/artifacts";
import { briefSchema } from "@/lib/schemas";
import { approveBrief } from "@/workflows/brief";
import { addContentType, validateContentType } from "@/workflows/content-type";
import { writeExternalComms, writeMicrocopy } from "@/workflows/generate";
import { approveGuideline, clusterCorrections } from "@/workflows/learning";
import { applyReview } from "@/workflows/review";
import { syncDriveTranscripts } from "@/workflows/surfaces";
import type { WorkflowContext } from "@/workflows/common";

const usage = { model: "fixture-model", input_tokens: 10, output_tokens: 5, cache_read_tokens: 0, cache_write_tokens: 0, cost_usd: 0 };

class DemoGateway implements ModelGateway {
  async complete<T>(request: ModelRequest<T>): Promise<ModelCall<T>> {
    let value: unknown;
    if (request.job === "brief") value = {
      headline: "A clearer way to insure autonomous miles",
      story: "Lemonade introduced coverage priced around autonomous driving.",
      why_now: "The product is available in Arizona.",
      what_changed: "Tesla FSD miles receive a different rate.",
      quote: { text: "This changes how risk is priced.", attribution: "Daniel Schreiber", source_excerpt: "This changes how risk is priced." },
      not_saying: ["Autonomous driving eliminates risk."],
      sources: [{ label: "Drive transcript", url: "drive://transcript-1" }],
    };
    else if (request.job === "generation" && request.prompt.includes("one UI string")) {
      const copy = request.prompt.includes("generic action") ? "Click here" : request.prompt.includes("guarantee") ? "YOUR CLAIM IS GUARANTEED" : "FINISH QUOTE";
      value = { copy, rationale: "Deterministic fixture output" };
    } else if (request.job === "generation") value = {
      title: "A clearer price for autonomous miles",
      body: "Arizona drivers using Tesla FSD can now get a rate that reflects those miles. The launch follows the approved source brief.",
    };
    else if (request.job === "stakes") value = { stakes: /Arizona|GUARANTEED/.test(request.prompt) ? "high" : "low", reason: "Fixture stakes" };
    else if (request.job === "compliance") value = request.prompt.includes("GUARANTEED")
      ? { pass: false, reason: "Unsupported claims guarantee" }
      : { pass: true, reason: "No prohibited claim" };
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
      value = { criteria: ids.map((id) => ({ id, score: id === "direct-address" && request.prompt.includes("Click here") ? 1 : 2, reason: "Fixture comparison" })) };
    } else if (request.job === "clustering") {
      const ids = [...request.prompt.matchAll(/^([a-f0-9]+):/gm)].map((match) => match[1]);
      value = { groups: [{ correction_ids: ids, rule: "Name the action instead of using ‘click here’." }] };
    } else throw new Error(`Unhandled demo model job: ${request.job}`);
    return { value: request.schema.parse(value), usage };
  }
}

async function runDemo() {
  const root = await mkdtemp(path.join(tmpdir(), "contentino-demo-"));
  await Promise.all(["profile", "metrics"].map((folder) => cp(path.join(process.cwd(), folder), path.join(root, folder), { recursive: true })));
  const context: WorkflowContext = { storage: new LocalStorage(root), models: new DemoGateway(), now: () => new Date("2026-08-14T09:00:00.000Z") };

  const drive = {
    listTranscripts: async () => [{ id: "transcript-1", name: "Launch call", mimeType: "text/plain", source: "drive://transcript-1" }],
    readTranscript: async () => "This changes how risk is priced.",
  };
  const [briefPath] = await syncDriveTranscripts({ context, drive });
  await approveBrief({ storage: context.storage, path: briefPath, approvedBy: "Stav", now: new Date("2026-08-14T09:30:00.000Z") });
  const approvedBrief = parseMarkdown((await context.storage.read(briefPath))?.content ?? "", briefSchema).metadata;
  const external = await writeExternalComms({ context, briefPath, triggeredBy: "drive", trigger: "drive" });
  const externalReview = await applyReview({
    context,
    draftPath: external.path,
    surface: "gdocs",
    who: "Stav",
    criterion: "direct-address",
    was: "Arizona drivers using Tesla FSD",
    now: "Drivers in Arizona who use Tesla FSD",
    said: "Lead with the people, then the location.",
    externalId: "gdocs:demo:comment-1",
  });

  const published = await writeMicrocopy({ context, request: "CTA to finish a quote", triggeredBy: "claude", trigger: "claude" });
  const blocked = await writeMicrocopy({ context, request: "guarantee a claim payment", triggeredBy: "claude", trigger: "claude" });

  const correctionSurfaces = ["claude", "slack", "gdocs", "slack"] as const;
  for (const [index, surface] of correctionSurfaces.entries()) {
    const generic = await writeMicrocopy({ context, request: `generic action ${index + 1}`, triggeredBy: surface, trigger: surface === "gdocs" ? "drive" : surface });
    await applyReview({
      context,
      draftPath: generic.path,
      surface,
      who: `reviewer-${index + 1}`,
      criterion: "action-verb",
      was: "Click here",
      now: "Finish quote",
      said: "Name the action instead of saying click here.",
      externalId: `${surface}:demo-${index + 1}`,
    });
  }
  const proposals = await clusterCorrections(context);
  const guideline = await approveGuideline({
    storage: context.storage,
    proposalPath: `content/guidelines/${proposals[0].id}.md`,
    approvedBy: "Stav",
    now: new Date("2026-08-14T12:00:00.000Z"),
  });

  await addContentType(context.storage, {
    slug: "internal-comms",
    owner: "people-team",
    max_autopublish_stakes: "low",
    mechanics: { max_chars: 1000, sentence_band: [1, 30] },
    guideline: "State the change, who it affects, when it starts and where questions go.",
    criteria: [{ id: "audience-fit", name: "Audience fit", question: "Does the note tell employees what changes for them?" }],
    examples: [1, 2, 3].map((number) => ({ id: `fixture-${number}`, stakes: "low", content: `Fixture team update ${number}: the office closes at 4 PM Friday.`, source: `fixture://internal-${number}` })),
  });
  const extension = await validateContentType(context, "internal-comms");
  const ledger = parseLedger((await context.storage.read("metrics/ledger.csv"))?.content ?? "");
  const corrections = await context.storage.list("content/corrections");

  const summary = {
    source_to_brief: { source_id: approvedBrief.source_id, approved_by: approvedBrief.approved_by },
    external_comms: { initial_route: external.scorecard.outcome, review_surface: externalReview.correction.surface, revised_route: externalReview.score.outcome },
    low_stakes_microcopy: { outcome: published.scorecard.outcome, location: published.path },
    compliance_demo: { outcome: blocked.scorecard.outcome, reason: blocked.scorecard.compliance.reason },
    learning_loop: { correction_count: corrections.length, matching_corrections: guideline.correction_ids.length, guideline_status: guideline.status, promoted_mechanics_rule: "specific-action-label" },
    extension_fixture: { content_type: "internal-comms", active: extension.active, scores: extension.scores, caveat: "Fixture examples prove the contract; real approved examples are still required for the live profile." },
    ledger: { runs: ledger.length, revisions: ledger.reduce((sum, row) => sum + row.revisions, 0), recorded_cost_usd: ledger.reduce((sum, row) => sum + row.api_cost_usd, 0) },
  };

  assert.equal(summary.source_to_brief.approved_by, "Stav");
  assert.equal(summary.external_comms.initial_route, "reviewed");
  assert.equal(summary.low_stakes_microcopy.outcome, "auto-published");
  assert.equal(summary.compliance_demo.outcome, "blocked");
  assert.equal(summary.learning_loop.matching_corrections, 4);
  assert.equal(summary.learning_loop.guideline_status, "approved");
  assert.deepEqual(summary.extension_fixture.scores, [10, 10, 10]);
  return summary;
}

console.log(JSON.stringify(await runDemo(), null, 2));
