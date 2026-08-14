import { z } from "zod";
import type { ModelGateway } from "@/lib/models";

const feedbackInterpretation = z.object({
  mode: z.enum(["replace", "rewrite"]),
  was: z.string().min(1),
  now: z.string().min(1),
  revised_body: z.string().optional(),
  criterion: z.string().min(1),
});

export type InterpretedFeedback = z.infer<typeof feedbackInterpretation>;

const interpreterSystem = [
  "Apply reviewer feedback to a draft decisively. Never ask a question back; choose the most reasonable reading and act on it.",
  "Use mode \"replace\" when the feedback targets specific wording: set `was` to the exact text copied character-for-character from the draft (it must appear in the draft exactly once) and `now` to the replacement.",
  "Use mode \"rewrite\" when the feedback applies to the draft as a whole (shorten it, change the tone, restructure, cut a percentage): set `revised_body` to the complete revised draft, keeping every factual claim, source and boundary intact, and set `was`/`now` to one-line summaries of what changed.",
  "`criterion` names the rubric criterion the feedback is about (register, humour, plain-language, mechanics, or a type criterion).",
].join("\n");

export async function interpretFeedback(input: {
  models: ModelGateway;
  draft: string;
  said: string;
  quotedText?: string;
}): Promise<InterpretedFeedback> {
  const call = await input.models.complete({
    job: "judge",
    system: interpreterSystem,
    prompt: `Draft:\n${input.draft}\n\nQuoted text:\n${input.quotedText ?? "none"}\n\nReviewer said:\n${input.said}`,
    schema: feedbackInterpretation,
    maxTokens: 3000,
  });
  return call.value;
}

const rewriteOutput = z.object({ revised_body: z.string().min(1), summary: z.string().min(1) });

export async function rewriteDraft(input: {
  models: ModelGateway;
  draft: string;
  said: string;
}): Promise<{ revisedBody: string; summary: string }> {
  const call = await input.models.complete({
    job: "generation",
    system: "Revise the draft exactly as the reviewer asked. Keep every factual claim, source and stated boundary intact unless the feedback removes it. Return the complete revised draft.",
    prompt: `Draft:\n${input.draft}\n\nReviewer said:\n${input.said}`,
    schema: rewriteOutput,
    maxTokens: 3000,
  });
  return { revisedBody: call.value.revised_body, summary: call.value.summary };
}
