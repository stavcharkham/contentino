import { z } from "zod";
import { stakesSchema } from "./profile";

export const pieceIdSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}-[a-z0-9-]+-[a-f0-9]{4}$/);
export const isoDateSchema = z.string().datetime();
export const contentTypeSchema = z.string().regex(/^[a-z0-9-]+$/);

export const briefSchema = z.object({
  id: pieceIdSchema,
  created: isoDateSchema,
  source: z.string().min(1),
  source_id: z.string().min(1),
  status: z.enum(["draft", "approved", "rejected"]),
  approved_by: z.string().min(1).optional(),
  approved_at: isoDateSchema.optional(),
  api_cost_usd: z.number().nonnegative().optional(),
});

export const draftSchema = z.object({
  id: pieceIdSchema,
  created: isoDateSchema,
  content_type: contentTypeSchema,
  status: z.enum(["draft", "review", "published", "blocked"]),
  brief_id: pieceIdSchema.optional(),
  triggered_by: z.string().min(1),
  trigger: z.enum(["claude", "slack", "drive", "cli"]),
  attempt: z.number().int().min(1).max(3),
  voice: z.string().min(1).default("company"),
});

export const criterionResultSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  score: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal("N/A")]),
  reason: z.string().min(1),
  model: z.string().min(1).optional(),
});

export const usageSchema = z.object({
  model: z.string().min(1),
  input_tokens: z.number().int().nonnegative(),
  output_tokens: z.number().int().nonnegative(),
  cache_read_tokens: z.number().int().nonnegative().default(0),
  cache_write_tokens: z.number().int().nonnegative().default(0),
  cost_usd: z.number().nonnegative(),
});

export const scorecardSchema = z.object({
  piece_id: pieceIdSchema,
  source_hash: z.string().regex(/^[a-f0-9]{64}$/),
  scored_at: isoDateSchema,
  content_type: contentTypeSchema,
  stakes: stakesSchema,
  ceiling: z.enum(["low", "medium", "high", "none"]),
  criteria: z.array(criterionResultSchema).min(1),
  score: z.number().min(0).max(10),
  compliance: z.object({ pass: z.boolean(), reason: z.string().min(1) }),
  attempt: z.number().int().min(1).max(3),
  outcome: z.enum(["auto-published", "reviewed", "regenerated", "blocked", "audited"]),
  usage: z.array(usageSchema),
  cost_usd: z.number().nonnegative(),
});

export const correctionSchema = z.object({
  id: z.string().regex(/^[a-f0-9]{4,12}$/),
  created: isoDateSchema,
  content_type: contentTypeSchema,
  piece: z.string().min(1),
  surface: z.enum(["slack", "claude", "gdocs"]),
  who: z.string().min(1),
  criterion: z.string().min(1),
  status: z.enum(["open", "resolved", "dismissed"]),
  resolved_by: z.string().min(1).optional(),
  was: z.string(),
  now: z.string(),
  said: z.string().min(1),
  external_id: z.string().min(1).optional(),
});

// Existing content submitted for a voice audit. Never published, never a draft.
export const auditRecordSchema = z.object({
  id: pieceIdSchema,
  created: isoDateSchema,
  content_type: contentTypeSchema,
  status: z.literal("audited"),
  source: z.string().min(1),
  triggered_by: z.string().min(1),
  trigger: z.enum(["claude", "slack", "drive", "cli"]),
});

export const ledgerOutcomeSchema = z.enum(["auto-published", "reviewed", "regenerated", "blocked", "audited"]);
export const ledgerRowSchema = z.object({
  piece_id: pieceIdSchema,
  created: isoDateSchema,
  skill: z.string().min(1),
  content_type: contentTypeSchema,
  triggered_by: z.string().min(1),
  trigger: z.enum(["claude", "slack", "drive", "cli"]),
  score: z.number().min(0).max(10),
  outcome: ledgerOutcomeSchema,
  revisions: z.number().int().nonnegative(),
  api_cost_usd: z.number().nonnegative(),
  minutes_saved: z.number(),
});

export const guidelineProposalSchema = z.object({
  id: z.string().regex(/^guideline-[a-z0-9-]+-[a-f0-9]{4}$/),
  created: isoDateSchema,
  content_type: contentTypeSchema,
  criterion: z.string().min(1),
  status: z.enum(["proposed", "approved", "rejected"]),
  rule: z.string().min(1),
  correction_ids: z.array(z.string()).min(4),
  approved_by: z.string().min(1).optional(),
  approved_at: isoDateSchema.optional(),
});

export type Brief = z.infer<typeof briefSchema>;
export type AuditRecord = z.infer<typeof auditRecordSchema>;
export type Draft = z.infer<typeof draftSchema>;
export type Scorecard = z.infer<typeof scorecardSchema>;
export type Correction = z.infer<typeof correctionSchema>;
export type LedgerRow = z.infer<typeof ledgerRowSchema>;
export type GuidelineProposal = z.infer<typeof guidelineProposalSchema>;
