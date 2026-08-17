import { z } from "zod";
import { readConfig } from "@/lib/config";
import { createRuntime } from "@/workflows/runtime";
import { DemoRequestError, demoLimits, scoreDemoText } from "@/workflows/demo-score";

export const maxDuration = 120;

const requestSchema = z.object({ text: z.string().min(1).max(demoLimits.maxChars * 2) });

// The middleware excludes /api, so this route repeats the dashboard's Basic
// auth check. The browser already holds the credentials from loading the page.
function authorized(request: Request, password: string): boolean {
  const header = request.headers.get("authorization") ?? "";
  if (header === `Bearer ${password}`) return true;
  const encoded = header.startsWith("Basic ") ? header.slice(6) : "";
  const supplied = Buffer.from(encoded, "base64").toString("utf8").split(":").slice(1).join(":");
  return supplied === password;
}

export async function POST(request: Request): Promise<Response> {
  const config = readConfig();
  if (!config.DASHBOARD_PASSWORD) return Response.json({ error: "The demo endpoint is not configured" }, { status: 503 });
  if (!authorized(request, config.DASHBOARD_PASSWORD)) {
    return Response.json({ error: "The shared password is missing or wrong" }, { status: 401 });
  }
  const parsed = requestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Send { text } with the copy to score" }, { status: 400 });
  try {
    const context = await createRuntime();
    const result = await scoreDemoText({ context, text: parsed.data.text });
    return Response.json({
      piece_id: result.pieceId,
      content_type: result.contentType,
      score: result.scorecard.score,
      outcome: result.scorecard.outcome,
      stakes: result.scorecard.stakes,
      compliance: result.scorecard.compliance,
      criteria: result.scorecard.criteria.map((criterion) => ({ name: criterion.name, score: criterion.score, reason: criterion.reason })),
      runs_today: result.runsToday,
      daily_limit: demoLimits.dailyRuns,
    });
  } catch (error) {
    if (error instanceof DemoRequestError) return Response.json({ error: error.message }, { status: error.status });
    console.error("Contentino gate demo failed", error);
    const message = error instanceof Error ? error.message : String(error);
    return Response.json({ error: "The gate could not score this text", detail: message }, { status: 500 });
  }
}
