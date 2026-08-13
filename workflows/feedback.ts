import { z } from "zod";
import type { ModelGateway } from "@/lib/models";

const feedbackInterpretation = z.object({
  clarification_needed: z.boolean(),
  question: z.string().optional(),
  was: z.string().optional(),
  now: z.string().optional(),
  criterion: z.string().optional(),
});

export type InterpretedFeedback = z.infer<typeof feedbackInterpretation>;

export async function interpretFeedback(input: {
  models: ModelGateway;
  draft: string;
  said: string;
  quotedText?: string;
}): Promise<InterpretedFeedback> {
  const call = await input.models.complete({
    job: "judge",
    system: "Turn review feedback into one exact edit. Ask a concise question when the intended replacement is not explicit. Never invent the reviewer’s wording.",
    prompt: `Draft:\n${input.draft}\n\nQuoted text:\n${input.quotedText ?? "none"}\n\nReviewer said:\n${input.said}`,
    schema: feedbackInterpretation,
    maxTokens: 350,
  });
  const result = call.value;
  if (!result.clarification_needed && (!result.was || !result.now || !result.criterion)) {
    return { clarification_needed: true, question: "What exact wording should replace the highlighted text?" };
  }
  return result;
}
