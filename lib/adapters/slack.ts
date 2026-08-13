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

  private mappingPath(threadTs: string): string {
    return `content/surfaces/slack/${threadTs.replaceAll(".", "-")}.json`;
  }

  private async updateMapping(threadTs: string, values: { brief_path?: string; draft_path?: string }): Promise<void> {
    const filePath = this.mappingPath(threadTs);
    const existing = await this.storage.read(filePath);
    const current = existing ? JSON.parse(existing.content) as Record<string, unknown> : {};
    const content = `${JSON.stringify({
      ...current,
      thread_ts: threadTs,
      channel: this.channel,
      ...values,
      posted_at: current.posted_at ?? new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }, null, 2)}\n`;
    if (existing) {
      await this.storage.update(filePath, content, existing.version, `Update Slack thread ${threadTs}`);
    } else {
      await this.storage.create(filePath, content, `Map Slack thread ${threadTs}`);
    }
  }

  async mapBrief(threadTs: string, briefPath: string): Promise<void> {
    await this.updateMapping(threadTs, { brief_path: briefPath });
  }

  async mapDraft(threadTs: string, draftPath: string): Promise<void> {
    await this.updateMapping(threadTs, { draft_path: draftPath });
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
    await this.mapDraft(message.ts, draft.path);
    return { surface: "slack", externalId: message.ts };
  }

  async presentDraftInThread(threadTs: string, draft: ReviewDraft): Promise<PresentedReview> {
    await this.mapDraft(threadTs, draft.path);
    await this.api.chat.postMessage({
      channel: this.channel,
      thread_ts: threadTs,
      text: `*Draft ready for review*\nScore ${draft.score.toFixed(1)}\n*Needs review:* External communications always require approval.\n\n${draft.content}\n\nReply with feedback in this thread.`,
    });
    return { surface: "slack", externalId: threadTs };
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
