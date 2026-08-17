import { readBaselines, minutesSaved } from "@/lib/ledger";
import type { ModelGateway } from "@/lib/models";
import { loadBaseProfile, loadContentTypeFromStorage } from "@/lib/profile-storage";
import type { LedgerRow, Scorecard } from "@/lib/schemas";
import type { ContentStorage } from "@/lib/storage";
import { scoreDraft } from "@/gate/score";

export type WorkflowContext = {
  storage: ContentStorage;
  models: ModelGateway;
  now?: () => Date;
};

export function workflowNow(context: WorkflowContext): Date {
  return context.now?.() ?? new Date();
}

export async function scoreArtifact(input: {
  context: WorkflowContext;
  pieceId: string;
  contentType: string;
  artifact: string;
  scoringText: string;
  attempt: number;
}): Promise<Scorecard> {
  const [baseProfile, type] = await Promise.all([
    loadBaseProfile(input.context.storage),
    loadContentTypeFromStorage(input.context.storage, input.contentType),
  ]);
  return scoreDraft({
    pieceId: input.pieceId,
    content: input.artifact,
    scoringText: input.scoringText,
    type,
    baseProfile,
    attempt: input.attempt,
    models: input.context.models,
    now: workflowNow(input.context),
  });
}

export async function makeLedgerRow(input: {
  storage: ContentStorage;
  pieceId: string;
  created: string;
  skill: string;
  contentType: string;
  triggeredBy: string;
  trigger: LedgerRow["trigger"];
  scorecard: Scorecard;
  revisions?: number;
  extraCostUsd?: number;
}): Promise<LedgerRow> {
  const baselineFile = await input.storage.read("metrics/baselines.yml");
  if (!baselineFile) throw new Error("metrics/baselines.yml is required");
  const baseline = readBaselines(baselineFile.content)[input.contentType];
  if (!baseline) throw new Error(`No baseline configured for ${input.contentType}`);
  const revisions = input.revisions ?? 0;
  return {
    piece_id: input.pieceId,
    created: input.created,
    skill: input.skill,
    content_type: input.contentType,
    triggered_by: input.triggeredBy,
    trigger: input.trigger,
    score: input.scorecard.score,
    outcome: input.scorecard.outcome,
    revisions,
    api_cost_usd: Number((input.scorecard.cost_usd + (input.extraCostUsd ?? 0)).toFixed(6)),
    minutes_saved: minutesSaved(baseline, input.scorecard.outcome, revisions),
  };
}
