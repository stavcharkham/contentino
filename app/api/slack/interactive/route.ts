import { after } from "next/server";
import { parseMarkdown } from "@/lib/artifacts";
import { readConfig } from "@/lib/config";
import { SlackReviewAdapter, verifySlackSignature } from "@/lib/adapters/slack";
import { draftSchema } from "@/lib/schemas";
import { createRuntime } from "@/workflows/runtime";
import { approveBrief } from "@/workflows/brief";
import { writeExternalComms } from "@/workflows/generate";
import { formatMarkdownForSlack } from "@/workflows/surfaces";
import { recordSurfaceFailure } from "@/workflows/slack-support";

export const maxDuration = 300;

type InteractivePayload = {
  type?: string;
  user?: { id?: string };
  container?: { thread_ts?: string; message_ts?: string };
  actions?: Array<{ action_id?: string; value?: string }>;
};

export async function POST(request: Request): Promise<Response> {
  const body = await request.text();
  const config = readConfig();
  if (!config.SLACK_SIGNING_SECRET || !config.SLACK_BOT_TOKEN || !config.SLACK_CHANNEL_ID) {
    return Response.json({ error: "Slack is not configured" }, { status: 503 });
  }
  if (!verifySlackSignature({
    signingSecret: config.SLACK_SIGNING_SECRET,
    timestamp: request.headers.get("x-slack-request-timestamp") ?? "",
    signature: request.headers.get("x-slack-signature") ?? "",
    body,
  })) return Response.json({ error: "Invalid Slack signature" }, { status: 401 });
  const payload = JSON.parse(new URLSearchParams(body).get("payload") ?? "{}") as InteractivePayload;
  const action = payload.actions?.[0];
  const threadTs = payload.container?.thread_ts ?? payload.container?.message_ts;
  if (payload.type !== "block_actions" || action?.action_id !== "approve_brief" || !action.value || !threadTs) {
    return Response.json({ ok: true, ignored: "action" });
  }
  const briefPath = action.value;
  const approvedBy = payload.user?.id ?? "slack";
  after(async () => {
    const context = await createRuntime();
    const slack = SlackReviewAdapter.fromToken(config.SLACK_BOT_TOKEN as string, config.SLACK_CHANNEL_ID as string, context.storage);
    try {
      try {
        await approveBrief({ storage: context.storage, path: briefPath, approvedBy });
      } catch (error) {
        if (error instanceof Error && error.message.includes("Only draft briefs")) {
          await slack.postMessage("This brief is already approved - the draft is on its way or in the thread above.", threadTs);
          return;
        }
        throw error;
      }
      const generated = await writeExternalComms({ context, briefPath, triggeredBy: approvedBy, trigger: "slack" });
      const draft = parseMarkdown(generated.content, draftSchema);
      await slack.presentDraftInThread(threadTs, {
        path: generated.path,
        title: generated.pieceId,
        content: formatMarkdownForSlack(draft.body),
        score: generated.scorecard.score,
        outcome: generated.scorecard.outcome,
      });
    } catch (error) {
      console.error("Slack approval failed", error);
      await recordSurfaceFailure(context, "slack-action", threadTs, error);
      await slack.postMessage("Something failed on my side while writing the draft - I logged the details. Press the button once more.", threadTs).catch(() => undefined);
    }
  });
  return Response.json({ ok: true });
}
