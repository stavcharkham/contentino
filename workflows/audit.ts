import { renderMarkdown } from "@/lib/artifacts";
import { createPieceId } from "@/lib/ids";
import type { AuditRecord, Scorecard } from "@/lib/schemas";
import { auditRecordSchema } from "@/lib/schemas";
import { contentHash } from "@/lib/storage";
import { recordScoredDraft } from "@/gate/publish";
import { makeLedgerRow, scoreArtifact, workflowNow, type WorkflowContext } from "./common";

// Audit existing content - a published post, copy from a screenshot, someone
// else's writing - on voice criteria only. Nothing here can publish or block;
// the result is a scorecard, a stored record under content/audits/ and a
// ledger row whose outcome is always "audited".

export type AuditResult = {
  pieceId: string;
  path: string;
  scorecard: Scorecard;
};

export async function auditContent(input: {
  context: WorkflowContext;
  contentType: string;
  body: string;
  source: string;
  triggeredBy: string;
}): Promise<AuditResult> {
  const now = workflowNow(input.context);
  const title = input.body.match(/^#\s*(.+)$/m)?.[1] ?? input.body.split("\n")[0];
  const pieceId = createPieceId(title, now);
  const path = `content/audits/${pieceId}.md`;
  const metadata: AuditRecord = auditRecordSchema.parse({
    id: pieceId,
    created: now.toISOString(),
    content_type: input.contentType,
    status: "audited",
    source: input.source,
    triggered_by: input.triggeredBy,
    trigger: "claude",
  });
  const content = renderMarkdown(metadata, input.body);
  let scorecard = await scoreArtifact({
    context: input.context,
    pieceId,
    contentType: input.contentType,
    artifact: content,
    scoringText: input.body,
    attempt: 1,
    mode: "audit",
  });
  scorecard = { ...scorecard, source_hash: contentHash(content) };
  const ledgerRow = await makeLedgerRow({
    storage: input.context.storage,
    pieceId,
    created: metadata.created,
    skill: "audit",
    contentType: input.contentType,
    triggeredBy: input.triggeredBy,
    trigger: "claude",
    scorecard,
  });
  await recordScoredDraft({ storage: input.context.storage, draftPath: path, content, scorecard, ledgerRow });
  return { pieceId, path, scorecard };
}
