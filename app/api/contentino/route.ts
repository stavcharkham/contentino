import { z } from "zod";
import { readConfig } from "@/lib/config";
import { gateApproveBrief, gateAuditContent, gateSubmitBrief, gateSubmitDraft, recordGateFailure } from "@/workflows/gate";

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
const auditAction = z.object({
  action: z.literal("audit"),
  content_type: z.string().min(1),
  body: z.string().min(1),
  source: z.string().min(1),
  triggered_by: z.string().min(1),
});
const approveBriefAction = z.object({
  action: z.literal("approve-brief"),
  brief_path: z.string().regex(/^content\/briefs\/[a-z0-9-]+\.md$/),
  approved_by: z.string().min(1),
});
const actionSchema = z.discriminatedUnion("action", [submitDraftAction, submitBriefAction, auditAction, approveBriefAction]);

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
    if (input.action === "submit-draft") return Response.json(await gateSubmitDraft(input));
    if (input.action === "submit-brief") return Response.json(await gateSubmitBrief(input));
    if (input.action === "audit") return Response.json(await gateAuditContent(input));
    return Response.json(await gateApproveBrief(input));
  } catch (error) {
    await recordGateFailure(input.action, error);
    const message = error instanceof Error ? error.message : String(error);
    return Response.json({ error: "The gate could not finish this run", detail: message }, { status: 500 });
  }
}
