import { renderMarkdown } from "@/lib/artifacts";
import { createPieceId } from "@/lib/ids";
import type { Brief } from "@/lib/schemas";
import { createRuntime } from "./runtime";
import { approveBrief } from "./brief";
import { submitDraft } from "./generate";
import { recordSurfaceFailure } from "./slack-support";

// The gate actions shared by the REST endpoint and the MCP server. Claude
// surfaces draft on the user's subscription and submit here; scoring, storage
// and the ledger always run on the production engine.

export type GateDraftInput = {
  content_type: string;
  body: string;
  triggered_by: string;
  brief_id?: string;
  request?: string;
};

export async function gateSubmitDraft(input: GateDraftInput): Promise<Record<string, unknown>> {
  const context = await createRuntime();
  const result = await submitDraft({
    context,
    contentType: input.content_type,
    body: input.body,
    triggeredBy: input.triggered_by,
    briefId: input.brief_id,
    request: input.request,
  });
  return {
    piece_id: result.pieceId,
    score: result.scorecard.score,
    outcome: result.scorecard.outcome,
    stakes: result.scorecard.stakes,
    compliance: result.scorecard.compliance,
    criteria: result.scorecard.criteria.map((criterion) => ({ name: criterion.name, score: criterion.score, reason: criterion.reason })),
    note: result.note,
    draft_path: result.path,
  };
}

export type GateBriefInput = {
  headline: string;
  body: string;
  source: string;
  source_id: string;
};

export async function gateSubmitBrief(input: GateBriefInput): Promise<Record<string, unknown>> {
  const context = await createRuntime();
  const now = new Date();
  const brief: Brief = {
    id: createPieceId(input.headline, now),
    created: now.toISOString(),
    source: input.source,
    source_id: input.source_id,
    status: "draft",
    api_cost_usd: 0,
  };
  const briefPath = `content/briefs/${brief.id}.md`;
  await context.storage.create(briefPath, renderMarkdown(brief, input.body), `Create brief ${brief.id}`);
  return { brief_id: brief.id, brief_path: briefPath, status: "draft" };
}

export type GateApproveInput = { brief_path: string; approved_by: string };

export async function gateApproveBrief(input: GateApproveInput): Promise<Record<string, unknown>> {
  const context = await createRuntime();
  const approved = await approveBrief({ storage: context.storage, path: input.brief_path, approvedBy: input.approved_by });
  return { brief_id: approved.id, status: approved.status, approved_by: approved.approved_by };
}

export async function recordGateFailure(action: string, error: unknown): Promise<void> {
  console.error("Contentino gate failed", error);
  const context = await createRuntime().catch(() => null);
  if (context) await recordSurfaceFailure(context, "claude-gate", action, error);
}
