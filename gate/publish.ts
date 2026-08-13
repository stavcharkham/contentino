import type { LedgerRow, Scorecard } from "@/lib/schemas";
import { scorecardSchema } from "@/lib/schemas";
import type { ContentStorage, StorageChange } from "@/lib/storage";
import { contentHash } from "@/lib/storage";
import { parseLedger, serializeLedger, upsertLedger } from "@/lib/ledger";

export function scorePathFor(draftPath: string): string {
  if (!draftPath.endsWith(".md")) throw new Error("Draft path must end in .md");
  return draftPath.replace(/\.md$/, ".score.json");
}

export async function recordScoredDraft(input: {
  storage: ContentStorage;
  draftPath: string;
  content: string;
  scorecard: Scorecard;
  ledgerRow: LedgerRow;
}): Promise<void> {
  if (input.scorecard.source_hash !== contentHash(input.content)) throw new Error("Scorecard does not match draft content");
  const [draft, score, ledger] = await Promise.all([
    input.storage.read(input.draftPath),
    input.storage.read(scorePathFor(input.draftPath)),
    input.storage.read("metrics/ledger.csv"),
  ]);
  const rows = ledger ? parseLedger(ledger.content) : [];
  const changes: StorageChange[] = [
    { type: "write", path: input.draftPath, content: input.content, expectedVersion: draft?.version ?? null },
    { type: "write", path: scorePathFor(input.draftPath), content: `${JSON.stringify(input.scorecard, null, 2)}\n`, expectedVersion: score?.version ?? null },
    { type: "write", path: "metrics/ledger.csv", content: serializeLedger(upsertLedger(rows, input.ledgerRow)), expectedVersion: ledger?.version ?? null },
  ];
  await input.storage.commit({ message: `Record scored draft ${input.scorecard.piece_id}`, changes });
}

export async function publishScoredDraft(storage: ContentStorage, draftPath: string): Promise<string> {
  const scorePath = scorePathFor(draftPath);
  const [draft, score] = await Promise.all([storage.read(draftPath), storage.read(scorePath)]);
  if (!draft || !score) throw new Error("Draft and scorecard are both required to publish");
  const scorecard = scorecardSchema.parse(JSON.parse(score.content));
  if (scorecard.source_hash !== contentHash(draft.content)) throw new Error("Scorecard is stale for this draft");
  if (scorecard.outcome !== "auto-published" || !scorecard.compliance.pass || scorecard.criteria.some((criterion) => criterion.score === 0)) {
    throw new Error(`Draft is not eligible to publish: ${scorecard.outcome}`);
  }
  const publishedPath = draftPath.replace("content/drafts/", "content/published/");
  const publishedScorePath = scorePathFor(publishedPath);
  if (publishedPath === draftPath) throw new Error("Only content/drafts files can be published");
  await storage.commit({
    message: `Publish scored draft ${scorecard.piece_id}`,
    changes: [
      { type: "write", path: publishedPath, content: draft.content, expectedVersion: null },
      { type: "write", path: publishedScorePath, content: score.content, expectedVersion: null },
      { type: "delete", path: draftPath, expectedVersion: draft.version },
      { type: "delete", path: scorePath, expectedVersion: score.version },
    ],
  });
  return publishedPath;
}
