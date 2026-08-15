import { z } from "zod";
import { renderMarkdown } from "@/lib/artifacts";
import { readConfig } from "@/lib/config";
import { createPieceId } from "@/lib/ids";
import type { Brief } from "@/lib/schemas";
import { createRuntime } from "@/workflows/runtime";
import { approveBrief } from "@/workflows/brief";
import { submitDraft } from "@/workflows/generate";
import { recordSurfaceFailure } from "@/workflows/slack-support";

export const maxDuration = 300;

const submitDraftAction = z.object({
  action: z.literal("submit-draft"),
  content_type: z.string().min(1),
  body: z.string().min(1),
  triggered_by: z.string().min(1),
  brief_id: z.string().optional(),
  request: z.string().optional(),
});
const submitBriefAction = z.object({
  action: z.literal("submit-brief"),
  headline: z.string().min(1),
  body: z.string().min(1),
  source: z.string().min(1),
  source_id: z.string().min(1),
});
const approveBriefAction = z.object({
  action: z.literal("approve-brief"),
  brief_path: z.string().regex(/^content\/briefs\/[a-z0-9-]+\.md$/),
  approved_by: z.string().min(1),
});
const actionSchema = z.discriminatedUnion("action", [submitDraftAction, submitBriefAction, approveBriefAction]);

export async function POST(request: Request): Promise<Response> {
  const config = readConfig();
  if (!config.DASHBOARD_PASSWORD) return Response.json({ error: "The gate endpoint is not configured" }, { status: 503 });
  if (request.headers.get("authorization") !== `Bearer ${config.DASHBOARD_PASSWORD}`) {
    return Response.json({ error: "The shared password is missing or wrong" }, { status: 401 });
  }
  const parsed = actionSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Invalid action", detail: parsed.error.issues }, { status: 400 });
  const input = parsed.data;
  try {
    return await handleAction(input);
  } catch (error) {
    console.error("Contentino gate failed", error);
    const context = await createRuntime().catch(() => null);
    if (context) await recordSurfaceFailure(context, "claude-gate", input.action, error);
    const message = error instanceof Error ? error.message : String(error);
    return Response.json({ error: "The gate could not finish this run", detail: message }, { status: 500 });
  }
}

async function handleAction(input: z.infer<typeof actionSchema>): Promise<Response> {
  const context = await createRuntime();
  if (input.action === "submit-draft") {
    const result = await submitDraft({
      context,
      contentType: input.content_type,
      body: input.body,
      triggeredBy: input.triggered_by,
      briefId: input.brief_id,
      request: input.request,
    });
    return Response.json({
      piece_id: result.pieceId,
      score: result.scorecard.score,
      outcome: result.scorecard.outcome,
      stakes: result.scorecard.stakes,
      compliance: result.scorecard.compliance,
      criteria: result.scorecard.criteria.map((criterion) => ({ name: criterion.name, score: criterion.score, reason: criterion.reason })),
      note: result.note,
      draft_path: result.path,
    });
  }
  if (input.action === "submit-brief") {
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
    return Response.json({ brief_id: brief.id, brief_path: briefPath, status: "draft" });
  }
  const approved = await approveBrief({ storage: context.storage, path: input.brief_path, approvedBy: input.approved_by });
  return Response.json({ brief_id: approved.id, status: approved.status, approved_by: approved.approved_by });
}
