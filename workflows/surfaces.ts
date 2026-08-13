import { parseMarkdown } from "@/lib/artifacts";
import type { GoogleDocsReviewAdapter } from "@/lib/adapters/google";
import type { GoogleDriveSource } from "@/lib/adapters/drive";
import type { SlackReviewAdapter } from "@/lib/adapters/slack";
import { runOnce } from "@/lib/idempotency";
import { briefSchema, draftSchema } from "@/lib/schemas";
import { parseCorrection } from "./review";
import { approveBrief, makeBrief } from "./brief";
import { writeExternalComms, writeMicrocopy } from "./generate";
import { interpretFeedback } from "./feedback";
import { applyReview } from "./review";
import type { WorkflowContext } from "./common";

export type SlackEnvelope = {
  event_id?: string;
  challenge?: string;
  event?: { type?: string; subtype?: string; text?: string; user?: string; ts?: string; thread_ts?: string; channel?: string; bot_id?: string };
};

export async function handleSlackEnvelope(input: {
  context: WorkflowContext;
  slack: Pick<SlackReviewAdapter, "postMessage" | "presentDraft" | "postRevision">;
  envelope: SlackEnvelope;
}): Promise<{ duplicate?: boolean; action: string }> {
  const event = input.envelope.event;
  if (!event || event.bot_id) return { action: "ignored" };
  const eventId = input.envelope.event_id ?? event.ts;
  if (!eventId) throw new Error("Slack event id is required");
  const result = await runOnce(input.context.storage, "slack", eventId, async () => {
    if (event.type === "app_mention") {
      const text = (event.text ?? "").replace(/<@[^>]+>/g, "").trim();
      const microcopy = text.match(/^microcopy:\s*([\s\S]+)/i);
      if (microcopy) {
        const generated = await writeMicrocopy({ context: input.context, request: microcopy[1], triggeredBy: event.user ?? "slack", trigger: "slack" });
        await input.slack.postMessage(`Generated ${generated.path}\nScore ${generated.scorecard.score.toFixed(1)} · ${generated.scorecard.outcome}`, event.thread_ts ?? event.ts);
        return "microcopy";
      }
      const briefRequest = text.match(/^brief:\s*([\s\S]+)/i);
      if (briefRequest) {
        const brief = await makeBrief({ context: input.context, transcript: briefRequest[1], source: `slack://${event.channel}/${event.ts}`, sourceId: eventId });
        await input.slack.postMessage(`Brief ready for approval: ${brief.path}`, event.thread_ts ?? event.ts);
        return "brief";
      }
      const approval = text.match(/^approve\s+(content\/briefs\/[a-z0-9-]+\.md)$/i);
      if (approval) {
        await approveBrief({ storage: input.context.storage, path: approval[1], approvedBy: event.user ?? "slack" });
        const generated = await writeExternalComms({ context: input.context, briefPath: approval[1], triggeredBy: event.user ?? "slack", trigger: "slack" });
        await input.slack.presentDraft({ path: generated.path, title: generated.pieceId, content: generated.content, score: generated.scorecard.score, outcome: generated.scorecard.outcome });
        return "approved-brief";
      }
      await input.slack.postMessage("Use `microcopy: …`, `brief: …`, or `approve content/briefs/<id>.md`.", event.thread_ts ?? event.ts);
      return "help";
    }
    if (event.type === "message" && event.thread_ts && event.ts && event.text) {
      const mapping = await input.context.storage.read(`content/surfaces/slack/${event.thread_ts.replaceAll(".", "-")}.json`);
      if (!mapping) return "unmapped-reply";
      const { draft_path: draftPath } = JSON.parse(mapping.content) as { draft_path: string };
      const corrections = await input.context.storage.list("content/corrections");
      if (corrections.some((file) => parseCorrection(file.content).external_id === `slack:${event.ts}`)) return "duplicate-feedback";
      const draftFile = await input.context.storage.read(draftPath);
      if (!draftFile) throw new Error(`Mapped draft not found: ${draftPath}`);
      const draft = parseMarkdown(draftFile.content, draftSchema);
      const interpreted = await interpretFeedback({ models: input.context.models, draft: draft.body, said: event.text });
      if (interpreted.clarification_needed) {
        await input.slack.postMessage(interpreted.question ?? "What exact wording should change?", event.thread_ts);
        return "clarification";
      }
      await applyReview({
        context: input.context,
        draftPath,
        surface: "slack",
        who: event.user ?? "slack",
        criterion: interpreted.criterion as string,
        was: interpreted.was as string,
        now: interpreted.now as string,
        said: event.text,
        externalId: `slack:${event.ts}`,
      });
      const revised = await input.context.storage.read(draftPath);
      await input.slack.postRevision(event.thread_ts, parseMarkdown(revised?.content ?? "", draftSchema).body, "Applied your correction and rescored the draft.");
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
  let clarifications = 0;
  for (const mappingFile of mappings) {
    const mapping = JSON.parse(mappingFile.content) as { document_id: string; draft_path: string };
    for (const feedback of await input.docs.collectFeedback(mapping.document_id)) {
      const result = await runOnce(input.context.storage, "gdocs", `${mapping.document_id}:${feedback.externalId}`, async () => {
        const draftFile = await input.context.storage.read(mapping.draft_path);
        if (!draftFile) throw new Error(`Mapped draft not found: ${mapping.draft_path}`);
        const draft = parseMarkdown(draftFile.content, draftSchema);
        const interpreted = await interpretFeedback({ models: input.context.models, draft: draft.body, said: feedback.said, quotedText: feedback.quotedText });
        if (interpreted.clarification_needed) {
          await input.docs.reply(mapping.document_id, feedback.externalId, interpreted.question ?? "What exact wording should replace the highlighted text?");
          return "clarification" as const;
        }
        await applyReview({
          context: input.context,
          draftPath: mapping.draft_path,
          surface: "gdocs",
          who: feedback.who,
          criterion: interpreted.criterion as string,
          was: interpreted.was as string,
          now: interpreted.now as string,
          said: feedback.said,
          externalId: `gdocs:${mapping.document_id}:${feedback.externalId}`,
        });
        await input.docs.replaceAndResolve(mapping.document_id, feedback.externalId, interpreted.was as string, interpreted.now as string);
        return "applied" as const;
      });
      if (!result.duplicate && result.value === "applied") applied += 1;
      if (!result.duplicate && result.value === "clarification") clarifications += 1;
    }
  }
  return { applied, clarifications };
}
