import { z } from "zod";
import { parseMarkdown } from "@/lib/artifacts";
import type { GoogleDocsReviewAdapter } from "@/lib/adapters/google";
import type { GoogleDriveSource } from "@/lib/adapters/drive";
import type { SlackReviewAdapter } from "@/lib/adapters/slack";
import { extractUrls, fetchSourceText } from "@/lib/fetch-source";
import { runOnce } from "@/lib/idempotency";
import { briefSchema, draftSchema, type Scorecard } from "@/lib/schemas";
import { parseCorrection, ReviewTargetError } from "./review";
import { approveBrief, makeBrief } from "./brief";
import { writeExternalComms, writeMicrocopy } from "./generate";
import { interpretFeedback, rewriteDraft, type InterpretedFeedback } from "./feedback";
import { applyReview } from "./review";
import type { WorkflowContext } from "./common";

export type SlackEnvelope = {
  event_id?: string;
  challenge?: string;
  event?: { type?: string; subtype?: string; text?: string; user?: string; ts?: string; thread_ts?: string; channel?: string; bot_id?: string };
};

const mentionIntent = z.object({
  intent: z.enum(["microcopy", "announcement", "drive-sync", "other"]),
  request: z.string().min(1),
  has_source_material: z.boolean(),
});

export function formatMicrocopyResult(copy: string, scorecard: Scorecard, note?: string): string {
  let routing: string;
  if (note && scorecard.outcome !== "blocked") {
    routing = "*Needs review:* A person must approve this one.";
  } else if (scorecard.outcome === "auto-published") {
    routing = "*Published automatically.*";
  } else if (scorecard.outcome === "blocked") {
    routing = `*Blocked:* The compliance gate flagged this ${scorecard.stakes}-stakes wording. Revise it before publishing.`;
  } else if (scorecard.score < 9) {
    routing = "*Needs review:* The score is below the 9.0 auto-publish threshold.";
  } else if (scorecard.ceiling === "none") {
    routing = "*Needs review:* This content type always requires review.";
  } else {
    routing = `*Needs review:* ${scorecard.stakes[0].toUpperCase()}${scorecard.stakes.slice(1)} stakes exceed this type's ${scorecard.ceiling}-stakes auto-publish ceiling.`;
  }
  return `*${copy}*\nScore ${scorecard.score.toFixed(1)}\n${routing}${note ? `\n\n${note}` : ""}`;
}

export function formatMarkdownForSlack(markdown: string): string {
  return markdown
    .replace(/^# (.+)$/gm, "*$1*")
    .replace(/^## (.+)$/gm, "*$1*")
    .replace(/\*\*([^*\n]+)\*\*/g, "*$1*")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1 ($2)");
}

type SlackThreadMapping = {
  brief_path?: string;
  draft_path?: string;
};

async function applyInterpretedFeedback(input: {
  context: WorkflowContext;
  interpreted: InterpretedFeedback;
  draftBody: string;
  draftPath: string;
  surface: "slack" | "gdocs";
  who: string;
  said: string;
  externalId: string;
}): Promise<{ mode: "replace" | "rewrite"; was: string; now: string; score: number; outcome: string }> {
  const { interpreted } = input;
  const base = {
    context: input.context,
    draftPath: input.draftPath,
    surface: input.surface,
    who: input.who,
    said: input.said,
    externalId: input.externalId,
    criterion: interpreted.criterion,
  };
  if (interpreted.mode === "rewrite") {
    const revisedBody = interpreted.revised_body ?? (await rewriteDraft({ models: input.context.models, draft: input.draftBody, said: input.said })).revisedBody;
    const applied = await applyReview({ ...base, was: interpreted.was, now: interpreted.now, revisedBody });
    return { mode: "rewrite", was: interpreted.was, now: interpreted.now, score: applied.score.score, outcome: applied.score.outcome };
  }
  try {
    const applied = await applyReview({ ...base, was: interpreted.was, now: interpreted.now });
    return { mode: "replace", was: interpreted.was, now: interpreted.now, score: applied.score.score, outcome: applied.score.outcome };
  } catch (error) {
    if (!(error instanceof ReviewTargetError)) throw error;
    const rewritten = await rewriteDraft({ models: input.context.models, draft: input.draftBody, said: input.said });
    const applied = await applyReview({ ...base, was: interpreted.was, now: rewritten.summary, revisedBody: rewritten.revisedBody });
    return { mode: "rewrite", was: interpreted.was, now: rewritten.summary, score: applied.score.score, outcome: applied.score.outcome };
  }
}

export async function announceBriefs(input: {
  context: WorkflowContext;
  slack: Pick<SlackSurface, "postBriefForApproval">;
  briefPaths: string[];
}): Promise<void> {
  for (const briefPath of input.briefPaths) {
    const stored = await input.context.storage.read(briefPath);
    if (!stored) continue;
    const body = parseMarkdown(stored.content, briefSchema).body;
    await input.slack.postBriefForApproval({ body: formatMarkdownForSlack(body), briefPath });
  }
}

export type SlackSurface = Pick<SlackReviewAdapter, "acknowledge" | "mapBrief" | "mapDraft" | "postMessage" | "presentDraft" | "presentDraftInThread" | "postRevision" | "postBriefForApproval">;

export async function handleSlackEnvelope(input: {
  context: WorkflowContext;
  slack: SlackSurface;
  envelope: SlackEnvelope;
  driveSync?: () => Promise<string[]>;
  fetchSource?: (url: string) => Promise<string | null>;
}): Promise<{ duplicate?: boolean; action: string }> {
  const fetchSource = input.fetchSource ?? fetchSourceText;
  const event = input.envelope.event;
  if (!event || event.bot_id) return { action: "ignored" };
  const isThreadReply = (event.type === "message" || event.type === "app_mention")
    && Boolean(event.thread_ts && event.ts && event.text);
  const isMentionCommand = !event.thread_ts && (event.type === "app_mention"
    || (event.type === "message" && /<@[^>]+>/.test(event.text ?? "")));
  if (!isMentionCommand && !isThreadReply) return { action: "ignored" };
  const eventId = event.ts;
  if (!eventId) throw new Error("Slack event id is required");
  const result = await runOnce(input.context.storage, "slack", eventId, async () => {
    if (event.ts) await input.slack.acknowledge(event.ts).catch(() => undefined);
    if (isMentionCommand) {
      const text = (event.text ?? "").replace(/<@[^>]+>/g, "").trim();
      const threadTs = event.ts as string;
      const runMicrocopy = async (request: string) => {
        const generated = await writeMicrocopy({ context: input.context, request, triggeredBy: event.user ?? "slack", trigger: "slack" });
        const copy = parseMarkdown(generated.content, draftSchema).body.replace(/^# Product micro-copy\s*/i, "").trim();
        await input.slack.mapDraft(threadTs, generated.path);
        await input.slack.postMessage(formatMicrocopyResult(copy, generated.scorecard, generated.note), threadTs);
        return "microcopy";
      };
      const runBrief = async (transcript: string) => {
        const brief = await makeBrief({ context: input.context, transcript, source: `slack://${event.channel}/${event.ts}`, sourceId: eventId });
        const body = parseMarkdown(brief.content, briefSchema).body;
        await input.slack.postBriefForApproval({ threadTs, body: formatMarkdownForSlack(body), briefPath: brief.path });
        return "brief";
      };
      const microcopy = text.match(/^microcopy:\s*([\s\S]+)/i);
      if (microcopy) return runMicrocopy(microcopy[1]);
      const briefRequest = text.match(/^brief:\s*([\s\S]+)/i);
      if (briefRequest) return runBrief(briefRequest[1]);
      const approval = text.match(/^approve\s+(content\/briefs\/[a-z0-9-]+\.md)$/i);
      if (approval) {
        await approveBrief({ storage: input.context.storage, path: approval[1], approvedBy: event.user ?? "slack" });
        const generated = await writeExternalComms({ context: input.context, briefPath: approval[1], triggeredBy: event.user ?? "slack", trigger: "slack" });
        await input.slack.presentDraft({ path: generated.path, title: generated.pieceId, content: generated.content, score: generated.scorecard.score, outcome: generated.scorecard.outcome });
        return "approved-brief";
      }
      const routed = await input.context.models.complete({
        job: "judge",
        system: [
          "Route a message sent to Contentino, Lemonade's content tool. Pick one intent:",
          "- microcopy: a short UI string is wanted (button, label, error, tooltip, CTA).",
          "- announcement: news or a longer piece is wanted (announcement, blog post, update to share) or the message reads like meeting notes or a transcript to write up.",
          "- drive-sync: the user asks to check, sync or process the Drive folder or a transcript that was uploaded.",
          "- other: anything else, including questions about Contentino itself.",
          "`request` is the message with any greeting or addressing stripped, otherwise unchanged.",
          "`has_source_material` is true only when the message text itself carries the substance to write from - a transcript, meeting notes or concrete facts. A bare link does not count: links are fetched separately.",
        ].join("\n"),
        prompt: text,
        schema: mentionIntent,
        maxTokens: 400,
      });
      if (routed.value.intent === "microcopy") return runMicrocopy(routed.value.request);
      if (routed.value.intent === "announcement") {
        // A linked page is fetched and briefed from its actual content - the
        // link text alone carries no facts to write from.
        const urls = extractUrls(event.text ?? "");
        let fetched = "";
        for (const url of urls.slice(0, 3)) {
          const sourceText = await fetchSource(url);
          if (sourceText) fetched += `\n\n--- Source: ${url} ---\n\n${sourceText}`;
        }
        if (urls.length && !fetched && !routed.value.has_source_material) {
          await input.slack.postMessage("I couldn't read that link from here. Paste the text itself - the transcript, notes or article - and I'll build the brief from it.", threadTs);
          return "announcement-source-unreadable";
        }
        if (!urls.length && !routed.value.has_source_material) {
          await input.slack.postMessage("Happy to write that. An announcement starts from source material, and this request doesn't carry any yet. Mention me again with the topic and the source together - paste the meeting notes or transcript, or drop a link - and I'll build the brief from it.", threadTs);
          return "announcement-needs-source";
        }
        // The brief is built from the person's own words, never the router's
        // paraphrase - a summarised `request` once dropped the whole transcript.
        return runBrief(`${text}${fetched}`);
      }
      if (routed.value.intent === "drive-sync") {
        if (!input.driveSync) {
          await input.slack.postMessage("Drive isn't connected on this deployment, so I can't check the folder from here.", threadTs);
          return "drive-unavailable";
        }
        const created = await input.driveSync();
        await input.slack.postMessage(created.length
          ? `Checked the Drive folder: found ${created.length} new transcript${created.length === 1 ? "" : "s"}. Posting ${created.length === 1 ? "the brief" : "the briefs"} in the channel with an approve button.`
          : "Checked the Drive folder: nothing new since the last run. Every transcript there already has its brief.", threadTs);
        await announceBriefs({ context: input.context, slack: input.slack, briefPaths: created });
        return "drive-sync";
      }
      await input.slack.postMessage("Tell me what you need in plain words - a button label, an error message, or an announcement to write up. If you've dropped a transcript in the Drive folder, say \"check the drive folder\".", threadTs);
      return "help";
    }
    if (isThreadReply && event.thread_ts && event.ts && event.text) {
      const mapping = await input.context.storage.read(`content/surfaces/slack/${event.thread_ts.replaceAll(".", "-")}.json`);
      if (!mapping) return "unmapped-reply";
      const { brief_path: briefPath, draft_path: draftPath } = JSON.parse(mapping.content) as SlackThreadMapping;
      const reply = event.text.replace(/<@[^>]+>/g, "").trim();
      if (briefPath && !draftPath) {
        if (!/^(approve(?:d)?|write it(?: here)?|generate(?: it)?|go ahead|yes|ok(?:ay)?|looks good)[.!]?$/i.test(reply)) {
          await input.slack.postMessage("This brief is waiting for approval - press the button or reply *approve* and I'll write the draft here. Changes to the brief itself aren't supported yet; approve it and give feedback on the draft.", event.thread_ts);
          return "brief-awaiting-approval";
        }
        await approveBrief({ storage: input.context.storage, path: briefPath, approvedBy: event.user ?? "slack" });
        try {
          await input.slack.postMessage("On it - writing and scoring the draft now.", event.thread_ts);
        } catch {
          // a missing progress line must not stop the draft
        }
        const generated = await writeExternalComms({ context: input.context, briefPath, triggeredBy: event.user ?? "slack", trigger: "slack" });
        const draft = parseMarkdown(generated.content, draftSchema);
        await input.slack.presentDraftInThread(event.thread_ts, {
          path: generated.path,
          title: generated.pieceId,
          content: formatMarkdownForSlack(draft.body),
          score: generated.scorecard.score,
          outcome: generated.scorecard.outcome,
        });
        return "approved-brief";
      }
      if (!draftPath) return "unmapped-reply";
      const corrections = await input.context.storage.list("content/corrections");
      if (corrections.some((file) => parseCorrection(file.content).external_id === `slack:${event.ts}`)) return "duplicate-feedback";
      const draftFile = await input.context.storage.read(draftPath);
      if (!draftFile) throw new Error(`Mapped draft not found: ${draftPath}`);
      const draft = parseMarkdown(draftFile.content, draftSchema);
      const interpreted = await interpretFeedback({ models: input.context.models, draft: draft.body, said: reply });
      const applied = await applyInterpretedFeedback({
        context: input.context,
        interpreted,
        draftBody: draft.body,
        draftPath,
        surface: "slack",
        who: event.user ?? "slack",
        said: reply,
        externalId: `slack:${event.ts}`,
      });
      const revised = await input.context.storage.read(draftPath);
      const verdict = applied.outcome === "blocked"
        ? "*Blocked:* the revision tripped the compliance gate, so it stays held."
        : "*Needs review* before it ships.";
      await input.slack.postRevision(event.thread_ts, formatMarkdownForSlack(parseMarkdown(revised?.content ?? "", draftSchema).body), `Applied your correction and rescored the draft. Score ${applied.score.toFixed(1)} · ${verdict}`);
      return "reviewed";
    }
    return "ignored";
  });
  return result.duplicate ? { duplicate: true, action: "duplicate" } : { action: result.value };
}

export async function syncDriveTranscripts(input: {
  context: WorkflowContext;
  drive: Pick<GoogleDriveSource, "listTranscripts" | "readTranscript">;
}): Promise<string[]> {
  const existing = await input.context.storage.list("content/briefs");
  const sourceIds = new Set(existing.map((file) => parseMarkdown(file.content, briefSchema).metadata.source_id));
  const created: string[] = [];
  for (const transcript of await input.drive.listTranscripts()) {
    if (sourceIds.has(transcript.id)) continue;
    const result = await runOnce(input.context.storage, "drive", transcript.id, async () => makeBrief({
      context: input.context,
      transcript: await input.drive.readTranscript(transcript),
      source: transcript.source,
      sourceId: transcript.id,
    }));
    if (!result.duplicate) created.push(result.value.path);
  }
  return created;
}

export async function syncGoogleDocReviews(input: {
  context: WorkflowContext;
  docs: Pick<GoogleDocsReviewAdapter, "collectFeedback" | "reply" | "replaceAndResolve">;
}): Promise<{ applied: number; clarifications: number }> {
  const mappings = await input.context.storage.list("content/surfaces/gdocs");
  let applied = 0;
  const clarifications = 0;
  for (const mappingFile of mappings) {
    const mapping = JSON.parse(mappingFile.content) as { document_id: string; draft_path: string };
    for (const feedback of await input.docs.collectFeedback(mapping.document_id)) {
      const result = await runOnce(input.context.storage, "gdocs", `${mapping.document_id}:${feedback.externalId}`, async () => {
        const draftFile = await input.context.storage.read(mapping.draft_path);
        if (!draftFile) throw new Error(`Mapped draft not found: ${mapping.draft_path}`);
        const draft = parseMarkdown(draftFile.content, draftSchema);
        const interpreted = await interpretFeedback({ models: input.context.models, draft: draft.body, said: feedback.said, quotedText: feedback.quotedText });
        const applied = await applyInterpretedFeedback({
          context: input.context,
          interpreted,
          draftBody: draft.body,
          draftPath: mapping.draft_path,
          surface: "gdocs",
          who: feedback.who,
          said: feedback.said,
          externalId: `gdocs:${mapping.document_id}:${feedback.externalId}`,
        });
        if (applied.mode === "replace") {
          await input.docs.replaceAndResolve(mapping.document_id, feedback.externalId, applied.was, applied.now);
        } else {
          await input.docs.reply(mapping.document_id, feedback.externalId, `Applied across the draft and rescored: ${applied.now}`);
        }
        return "applied" as const;
      });
      if (!result.duplicate && result.value === "applied") applied += 1;
    }
  }
  return { applied, clarifications };
}
