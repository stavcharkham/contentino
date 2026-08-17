import { createPieceId } from "@/lib/ids";
import { parseLedger, serializeLedger, upsertLedger } from "@/lib/ledger";
import type { LedgerRow, Scorecard } from "@/lib/schemas";
import { StorageConflictError } from "@/lib/storage";
import { scoreArtifact, workflowNow, type WorkflowContext } from "./common";

// The dashboard's "try the gate" demo: score pasted text against the profile
// without generating, publishing or claiming saved minutes. Every run still
// lands in the ledger so the spend counts against the budget guard and the
// visitor can find their own row.

export const demoLimits = { minChars: 12, maxChars: 12000, dailyRuns: 100 } as const;
export const demoSkill = "gate-demo";

export class DemoRequestError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
  }
}

export type DemoScoreResult = { pieceId: string; contentType: string; scorecard: Scorecard; runsToday: number };

function demoContentType(text: string): string {
  return text.length <= 60 && !text.includes("\n") ? "product-microcopy" : "external-comms";
}

export function countDemoRunsToday(rows: LedgerRow[], now: Date): number {
  const today = now.toISOString().slice(0, 10);
  return rows.filter((row) => row.skill === demoSkill && row.created.slice(0, 10) === today).length;
}

async function appendLedgerRow(context: WorkflowContext, row: LedgerRow, retry = true): Promise<void> {
  const ledger = await context.storage.read("metrics/ledger.csv");
  if (!ledger) throw new Error("The evidence ledger is missing");
  try {
    await context.storage.commit({
      message: `Record gate demo ${row.piece_id}`,
      changes: [{
        type: "write",
        path: "metrics/ledger.csv",
        content: serializeLedger(upsertLedger(parseLedger(ledger.content), row)),
        expectedVersion: ledger.version,
      }],
    });
  } catch (error) {
    if (retry && error instanceof StorageConflictError) return appendLedgerRow(context, row, false);
    throw error;
  }
}

export async function scoreDemoText(input: { context: WorkflowContext; text: string }): Promise<DemoScoreResult> {
  const text = input.text.trim();
  if (text.length < demoLimits.minChars) {
    throw new DemoRequestError(`Paste at least ${demoLimits.minChars} characters of copy to score`, 400);
  }
  if (text.length > demoLimits.maxChars) {
    throw new DemoRequestError(`The demo scores up to ${demoLimits.maxChars.toLocaleString("en-US")} characters - blog length, not book length`, 400);
  }
  const now = workflowNow(input.context);
  const ledger = await input.context.storage.read("metrics/ledger.csv");
  if (!ledger) throw new Error("The evidence ledger is missing");
  const runsBefore = countDemoRunsToday(parseLedger(ledger.content), now);
  if (runsBefore >= demoLimits.dailyRuns) {
    throw new DemoRequestError(`The demo is capped at ${demoLimits.dailyRuns} scores a day and today's are used up. It resets at midnight UTC.`, 429);
  }
  const contentType = demoContentType(text);
  const pieceId = createPieceId(text, now);
  const scorecard = await scoreArtifact({
    context: input.context,
    pieceId,
    contentType,
    artifact: text,
    scoringText: text,
    attempt: 1,
    criteriaScope: "core",
  });
  await appendLedgerRow(input.context, {
    piece_id: pieceId,
    created: now.toISOString(),
    skill: demoSkill,
    content_type: contentType,
    triggered_by: "dashboard-visitor",
    trigger: "dashboard",
    score: scorecard.score,
    outcome: scorecard.outcome,
    revisions: 0,
    api_cost_usd: scorecard.cost_usd,
    minutes_saved: 0,
  });
  return { pieceId, contentType, scorecard, runsToday: runsBefore + 1 };
}
