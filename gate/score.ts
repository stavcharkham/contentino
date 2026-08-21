import { z } from "zod";
import type { ModelGateway } from "@/lib/models";
import type { ContentTypeProfile } from "@/lib/profile";
import { scorecardSchema, type Scorecard } from "@/lib/schemas";
import { contentHash } from "@/lib/storage";
import { checkMechanics } from "./mechanics";

const stakesResult = z.object({ stakes: z.enum(["low", "medium", "high"]), reason: z.string().min(1) });
const complianceResult = z.object({ pass: z.boolean(), reason: z.string().min(1) });
const modelCriterion = z.object({
  id: z.string().min(1),
  score: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal("N/A")]),
  reason: z.string().min(1),
});
const criteriaResult = z.object({ criteria: z.array(modelCriterion) });

const coreCriteria = [
  { id: "register", name: "Register match", question: "Is the tone right for what is at stake?" },
  { id: "humour", name: "Humour boundary", question: "Is humour used only where nothing is at stake?" },
  { id: "plain-language", name: "Plain language calibration", question: "Does it translate only what Lemonade translates?" },
];

export function normalizeScore(criteria: Scorecard["criteria"]): number {
  const applicable = criteria.filter((criterion) => criterion.score !== "N/A");
  if (!applicable.length) throw new Error("At least one scoring criterion must apply");
  return Number(((applicable.reduce((sum, criterion) => sum + Number(criterion.score), 0) / (2 * applicable.length)) * 10).toFixed(2));
}

function withinCeiling(stakes: "low" | "medium" | "high", ceiling: Scorecard["ceiling"]): boolean {
  if (ceiling === "none") return false;
  const order = { low: 0, medium: 1, high: 2 };
  return order[stakes] <= order[ceiling];
}

export function routeScore(input: {
  score: number;
  criteria: Scorecard["criteria"];
  compliancePass: boolean;
  stakes: "low" | "medium" | "high";
  ceiling: Scorecard["ceiling"];
  attempt: number;
}): Scorecard["outcome"] {
  if (!input.compliancePass || input.criteria.some((criterion) => criterion.score === 0)) return "blocked";
  if (input.score < 8) return input.attempt < 3 ? "regenerated" : "reviewed";
  if (input.score < 9 || !withinCeiling(input.stakes, input.ceiling)) return "reviewed";
  return "auto-published";
}

function criteriaPrompt(
  draft: string,
  examples: string,
  criteria: Array<{ id: string; name: string; question: string }>,
  audit = false,
): string {
  const style = audit
    ? "\n\nWrite each reason as one plain factual sentence naming what the text does. No praise adjectives, no hedging, no summary phrases."
    : "";
  return `Compare the draft with the approved examples at the same stakes level. Score only the listed criteria 0, 1, 2 or N/A.${style}\n\nCriteria:\n${criteria.map((criterion) => `- ${criterion.id}: ${criterion.question}`).join("\n")}\n\nApproved examples:\n${examples}\n\nDraft:\n${draft}`;
}

function requireExactCriteria(
  expected: Array<{ id: string; name: string }>,
  actual: z.infer<typeof criteriaResult>["criteria"],
  model: string,
): Scorecard["criteria"] {
  const byId = new Map(actual.map((criterion) => [criterion.id, criterion]));
  return expected.map((criterion) => {
    const result = byId.get(criterion.id);
    if (!result) throw new Error(`Model omitted criterion ${criterion.id}`);
    return { ...result, name: criterion.name, model };
  });
}

export async function scoreDraft(input: {
  pieceId: string;
  content: string;
  scoringText?: string;
  type: ContentTypeProfile;
  baseProfile: string;
  attempt: number;
  models: ModelGateway;
  now?: Date;
  // "audit" scores existing content that never had a brief: pipeline-only
  // criteria drop out, the missing-source compliance rule does not apply,
  // and nothing blocks or publishes - the outcome is always "audited".
  mode?: "gate" | "audit";
}): Promise<Scorecard> {
  const audit = input.mode === "audit";
  const scoringText = input.scoringText ?? input.content;
  const stakesCall = await input.models.complete({
    job: "stakes",
    system: input.baseProfile,
    prompt: `Classify the highest stakes touched by the wording itself as low, medium or high. Never lower stakes because the surrounding tone is casual. A navigation or button label that only opens, displays or continues to a quote, price, coverage or claim screen remains low stakes; it becomes high only when the wording makes or explains the actual financial, coverage, eligibility or claim decision.\n\n${scoringText}`,
    schema: stakesResult,
    maxTokens: 180,
  });
  const mechanics = checkMechanics(scoringText, input.type.guideline, stakesCall.value.stakes);
  if (mechanics.score === 0 && !audit) {
    const score = normalizeScore([mechanics]);
    return scorecardSchema.parse({
      piece_id: input.pieceId,
      source_hash: contentHash(input.content),
      scored_at: (input.now ?? new Date()).toISOString(),
      content_type: input.type.slug,
      stakes: stakesCall.value.stakes,
      ceiling: input.type.guideline.max_autopublish_stakes,
      criteria: [mechanics],
      score,
      compliance: { pass: true, reason: "Paid checks skipped after mechanical block" },
      attempt: input.attempt,
      outcome: "blocked",
      usage: [stakesCall.usage],
      cost_usd: stakesCall.usage.cost_usd,
    });
  }
  const compliancePrompt = audit
    ? `Apply the compliance prohibitions to this existing content: a guarantee of an outcome or claim payment, an unsupported claim about how the company judges a customer, or a contradiction of what Lemonade tells customers about data use, pricing or eligibility. This content never had a brief, so do not fail it for a missing source or missing disclaimer. Judge only claims present in the supplied text. State the reason as one plain factual sentence.\n\n${scoringText}`
    : `Apply every compliance prohibition to this draft. A missing source, unsupported judgement claim, guarantee or contradiction fails. Judge only claims present in the supplied text. Do not fail an isolated navigation or button label because surrounding copy, a source or a disclaimer is not included.\n\n${scoringText}`;
  const complianceCall = await input.models.complete({
    job: "compliance",
    system: input.baseProfile,
    prompt: compliancePrompt,
    schema: complianceResult,
    maxTokens: 600,
  });
  const coreCall = await input.models.complete({
    job: "judge",
    system: input.baseProfile,
    prompt: criteriaPrompt(scoringText, input.type.examples, coreCriteria, audit),
    schema: criteriaResult,
    maxTokens: 600,
  });
  const typeCriteria = audit ? input.type.criteria.filter((criterion) => criterion.audit) : input.type.criteria;
  const typeCall = typeCriteria.length
    ? await input.models.complete({
        job: "type-criteria",
        system: `${input.baseProfile}\n\n${input.type.guidelineBody}\n\n${input.type.criteriaBody}`,
        prompt: criteriaPrompt(scoringText, input.type.examples, typeCriteria, audit),
        schema: criteriaResult,
        maxTokens: 700,
      })
    : null;
  const criteria = [
    ...requireExactCriteria(coreCriteria, coreCall.value.criteria, coreCall.usage.model),
    mechanics,
    ...(typeCall ? requireExactCriteria(typeCriteria, typeCall.value.criteria, typeCall.usage.model) : []),
  ];
  const score = normalizeScore(criteria);
  const usage = [stakesCall.usage, complianceCall.usage, coreCall.usage, ...(typeCall ? [typeCall.usage] : [])];
  return scorecardSchema.parse({
    piece_id: input.pieceId,
    source_hash: contentHash(input.content),
    scored_at: (input.now ?? new Date()).toISOString(),
    content_type: input.type.slug,
    stakes: stakesCall.value.stakes,
    ceiling: input.type.guideline.max_autopublish_stakes,
    criteria,
    score,
    compliance: complianceCall.value,
    attempt: input.attempt,
    outcome: audit
      ? "audited"
      : routeScore({
          score,
          criteria,
          compliancePass: complianceCall.value.pass,
          stakes: stakesCall.value.stakes,
          ceiling: input.type.guideline.max_autopublish_stakes,
          attempt: input.attempt,
        }),
    usage,
    cost_usd: Number(usage.reduce((sum, item) => sum + item.cost_usd, 0).toFixed(6)),
  });
}
