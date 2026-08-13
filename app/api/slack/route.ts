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
    await handleSlackEnvelope({ context, slack, envelope });
  });
  return Response.json({ ok: true });
}
