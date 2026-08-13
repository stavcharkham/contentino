import { createHmac, timingSafeEqual } from "node:crypto";
import { WebClient } from "@slack/web-api";
import type { ContentStorage } from "@/lib/storage";
import type { PresentedReview, ReviewAdapter, ReviewDraft, ReviewFeedback } from "./types";

type SlackApi = {
  chat: { postMessage(args: Record<string, unknown>): Promise<{ ts?: string }> };
  conversations: { replies(args: Record<string, unknown>): Promise<{ messages?: Array<{ ts?: string; text?: string; user?: string; bot_id?: string }> }> };
  reactions: { add(args: Record<string, unknown>): Promise<unknown> };
};

export function verifySlackSignature(input: {
  signingSecret: string;
  timestamp: string;
  signature: string;
  body: string;
  nowSeconds?: number;
}): boolean {
  const timestamp = Number(input.timestamp);
  const now = input.nowSeconds ?? Math.floor(Date.now() / 1000);
  if (!Number.isFinite(timestamp) || Math.abs(now - timestamp) > 300) return false;
  const expected = `v0=${createHmac("sha256", input.signingSecret).update(`v0:${input.timestamp}:${input.body}`).digest("hex")}`;
  const left = Buffer.from(expected);
  const right = Buffer.from(input.signature);
  return left.length === right.length && timingSafeEqual(left, right);
}

export class SlackReviewAdapter implements ReviewAdapter {
  constructor(
    private readonly api: SlackApi,
    private readonly channel: string,
    private readonly storage: ContentStorage,
  ) {}

  static fromToken(token: string, channel: string, storage: ContentStorage): SlackReviewAdapter {
    return new SlackReviewAdapter(new WebClient(token) as unknown as SlackApi, channel, storage);
  }

  async acknowledge(messageTs: string): Promise<void> {
    await this.api.reactions.add({ channel: this.channel, timestamp: messageTs, name: "eyes" });
  }

  async presentDraft(draft: ReviewDraft): Promise<PresentedReview> {
    const message = await this.api.chat.postMessage({
      channel: this.channel,
      text: `Review: ${draft.title}\nScore ${draft.score.toFixed(1)} · ${draft.outcome}`,
      blocks: [
        { type: "section", text: { type: "mrkdwn", text: `*${draft.title}*\nScore ${draft.score.toFixed(1)} · ${draft.outcome}` } },
        { type: "section", text: { type: "mrkdwn", text: draft.content.slice(0, 2900) } },
      ],
    });
    if (!message.ts) throw new Error("Slack did not return a thread timestamp");
    await this.storage.create(
      `content/surfaces/slack/${message.ts.replaceAll(".", "-")}.json`,
      `${JSON.stringify({ thread_ts: message.ts, channel: this.channel, draft_path: draft.path, posted_at: new Date().toISOString() }, null, 2)}\n`,
      `Map Slack thread ${message.ts}`,
    );
    return { surface: "slack", externalId: message.ts };
  }

  async collectFeedback(threadTs: string): Promise<ReviewFeedback[]> {
    const response = await this.api.conversations.replies({ channel: this.channel, ts: threadTs });
    return (response.messages ?? []).slice(1).filter((message) => message.ts && message.text && !message.bot_id).map((message) => ({
      externalId: message.ts as string,
      who: message.user ?? "slack-user",
      said: message.text as string,
    }));
  }

  async postRevision(threadTs: string, content: string, message: string): Promise<void> {
    await this.api.chat.postMessage({ channel: this.channel, thread_ts: threadTs, text: `${message}\n\n${content}` });
  }

  async postMessage(text: string, threadTs?: string): Promise<void> {
    await this.api.chat.postMessage({ channel: this.channel, thread_ts: threadTs, text });
  }
}
