import { parseMarkdown, renderMarkdown } from "@/lib/artifacts";
import { createShortId } from "@/lib/ids";
import { parseLedger, readBaselines, serializeLedger, upsertLedger, minutesSaved } from "@/lib/ledger";
import { correctionSchema, draftSchema, scorecardSchema, type Correction } from "@/lib/schemas";
import { contentHash, type StorageChange } from "@/lib/storage";
import { scorePathFor } from "@/gate/publish";
import { scoreArtifact, type WorkflowContext } from "./common";

export function renderCorrection(correction: Correction): string {
  const { was, now, said, ...metadata } = correction;
  return renderMarkdown(metadata, `**Was:** ${was}\n\n**Now:** ${now}\n\n**Said:** ${said}`);
}

export function parseCorrection(source: string): Correction {
  const parsed = parseMarkdown(source, correctionSchema.omit({ was: true, now: true, said: true }));
  const field = (name: string) => parsed.body.match(new RegExp(`\\*\\*${name}:\\*\\* ([\\s\\S]*?)(?=\\n\\n\\*\\*|$)`))?.[1]?.trim();
  return correctionSchema.parse({ ...parsed.metadata, was: field("Was") ?? "", now: field("Now") ?? "", said: field("Said") ?? "" });
}

export async function applyReview(input: {
  context: WorkflowContext;
  draftPath: string;
  surface: Correction["surface"];
  who: string;
  criterion: string;
  was: string;
  now: string;
  said: string;
  externalId?: string;
}): Promise<{ correction: Correction; score: ReturnType<typeof scorecardSchema.parse> }> {
  const [draftFile, scoreFile, ledgerFile, baselineFile] = await Promise.all([
    input.context.storage.read(input.draftPath),
    input.context.storage.read(scorePathFor(input.draftPath)),
    input.context.storage.read("metrics/ledger.csv"),
    input.context.storage.read("metrics/baselines.yml"),
  ]);
  if (!draftFile || !scoreFile || !ledgerFile || !baselineFile) throw new Error("Review requires a stored draft, score, ledger and baselines");
  const draft = parseMarkdown(draftFile.content, draftSchema);
  const occurrences = draft.body.split(input.was).length - 1;
  if (occurrences !== 1) throw new Error(`Review target must occur exactly once; found ${occurrences}`);
  const revisedBody = draft.body.replace(input.was, input.now);
  const revisedContent = renderMarkdown({ ...draft.metadata, status: "review" }, revisedBody);
  let score = await scoreArtifact({
    context: input.context,
    pieceId: draft.metadata.id,
    contentType: draft.metadata.content_type,
    artifact: revisedContent,
    scoringText: revisedBody,
    attempt: 1,
  });
  score = { ...score, outcome: "reviewed", source_hash: contentHash(revisedContent) };
  const previousScore = scorecardSchema.parse(JSON.parse(scoreFile.content));
  const rows = parseLedger(ledgerFile.content);
  const previousRow = rows.find((row) => row.piece_id === draft.metadata.id);
  if (!previousRow) throw new Error(`Ledger row missing for ${draft.metadata.id}`);
  const revisions = previousRow.revisions + 1;
  const baseline = readBaselines(baselineFile.content)[draft.metadata.content_type];
  const nextRow = {
    ...previousRow,
    score: score.score,
    outcome: "reviewed" as const,
    revisions,
    api_cost_usd: Number((previousRow.api_cost_usd + score.cost_usd).toFixed(6)),
    minutes_saved: minutesSaved(baseline, "reviewed", revisions),
  };
  const correction: Correction = {
    id: createShortId(),
    created: (input.context.now?.() ?? new Date()).toISOString(),
    content_type: draft.metadata.content_type,
    piece: input.draftPath,
    surface: input.surface,
    who: input.who,
    criterion: input.criterion,
    status: "open",
    was: input.was,
    now: input.now,
    said: input.said,
    external_id: input.externalId,
  };
  const correctionPath = `content/corrections/${correction.created.slice(0, 10)}-${correction.id}.md`;
  const changes: StorageChange[] = [
    { type: "write", path: input.draftPath, content: revisedContent, expectedVersion: draftFile.version },
    { type: "write", path: scorePathFor(input.draftPath), content: `${JSON.stringify(score, null, 2)}\n`, expectedVersion: scoreFile.version },
    { type: "write", path: correctionPath, content: renderCorrection(correction), expectedVersion: null },
    { type: "write", path: "metrics/ledger.csv", content: serializeLedger(upsertLedger(rows, nextRow)), expectedVersion: ledgerFile.version },
  ];
  await input.context.storage.commit({ message: `Apply correction ${correction.id} to ${draft.metadata.id}`, changes });
  return { correction, score: { ...score, cost_usd: Number((score.cost_usd + previousScore.cost_usd).toFixed(6)) } };
}
