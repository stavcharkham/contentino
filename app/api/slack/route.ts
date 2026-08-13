import { after } from "next/server";
import { readConfig } from "@/lib/config";
import { SlackReviewAdapter, verifySlackSignature } from "@/lib/adapters/slack";
import { createRuntime } from "@/workflows/runtime";
import { handleSlackEnvelope, type SlackEnvelope } from "@/workflows/surfaces";

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
  const envelope = JSON.parse(body) as SlackEnvelope;
  if (envelope.challenge) return Response.json({ challenge: envelope.challenge });
  if (envelope.event?.channel && envelope.event.channel !== config.SLACK_CHANNEL_ID) {
    return Response.json({ ok: true, ignored: "channel" });
  }
  after(async () => {
    const context = await createRuntime();
    const slack = SlackReviewAdapter.fromToken(config.SLACK_BOT_TOKEN as string, config.SLACK_CHANNEL_ID as string, context.storage);
    let terminalReplyPosted = false;
    const trackedSlack: Pick<SlackReviewAdapter, "acknowledge" | "mapBrief" | "mapDraft" | "postMessage" | "presentDraft" | "presentDraftInThread" | "postRevision"> = {
      acknowledge: (messageTs) => slack.acknowledge(messageTs),
      mapBrief: (threadTs, briefPath) => slack.mapBrief(threadTs, briefPath),
      mapDraft: (threadTs, draftPath) => slack.mapDraft(threadTs, draftPath),
      postMessage: async (text, threadTs) => {
        await slack.postMessage(text, threadTs);
        terminalReplyPosted = true;
      },
      presentDraft: async (draft) => {
        const presented = await slack.presentDraft(draft);
        terminalReplyPosted = true;
        return presented;
      },
      presentDraftInThread: async (threadTs, draft) => {
        const presented = await slack.presentDraftInThread(threadTs, draft);
        terminalReplyPosted = true;
        return presented;
      },
      postRevision: async (threadTs, content, message) => {
        await slack.postRevision(threadTs, content, message);
        terminalReplyPosted = true;
      },
    };
    try {
      await handleSlackEnvelope({ context, slack: trackedSlack, envelope });
    } catch (error) {
      console.error("Slack workflow failed", error);
      const threadTs = envelope.event?.thread_ts ?? envelope.event?.ts;
      if (threadTs && !terminalReplyPosted) {
        await slack.postMessage("I saw this, but I couldn't finish the run. Please try once more.", threadTs).catch(() => undefined);
      }
    }
  });
  return Response.json({ ok: true });
}
