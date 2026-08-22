import type { GuidelineConfig } from "@/lib/profile";
import type { Scorecard } from "@/lib/schemas";
import { promotedRules } from "./promoted-rules";

const emojiPattern = /[\p{Extended_Pictographic}]/gu;

export function checkMechanics(
  text: string,
  guideline: GuidelineConfig,
  stakes: "low" | "medium" | "high",
): Scorecard["criteria"][number] {
  const violations: string[] = [];
  const exclamations = (text.match(/!/g) ?? []).length;
  const emoji = text.match(emojiPattern) ?? [];
  const emDashes = (text.match(/—/g) ?? []).length;
  if (exclamations > guideline.mechanics.exclamation_limit) violations.push("more exclamation marks than the content type allows");
  if (stakes === "high" && exclamations > 0) violations.push("exclamation mark in high-stakes copy");
  if (emoji.length > 1) violations.push("more than one emoji");
  if (emDashes > guideline.mechanics.em_dash_limit) violations.push("more em dashes than the content type allows");

  const plainLines = text.split("\n").map((line) => line.trim()).filter((line) => line && !line.startsWith("#") && !line.startsWith("---"));
  if (guideline.content_type === "product-microcopy" && plainLines.some((line) => line.length > guideline.mechanics.max_chars)) {
    violations.push(`string exceeds ${guideline.mechanics.max_chars} characters`);
  }
  const maxWords = guideline.mechanics.sentence_band[1];
  const sentences = text.replace(/^#+\s.*$/gm, "").split(/[.!?]+/).map((sentence) => sentence.trim()).filter(Boolean);
  if (sentences.some((sentence) => sentence.split(/\s+/).length > maxWords)) {
    violations.push(`sentence exceeds ${maxWords} words`);
  }
  for (const rule of promotedRules) {
    if (rule.violation(text)) violations.push(rule.message);
  }
  const score = violations.length === 0 ? 2 : violations.length === 1 ? 1 : 0;
  return {
    id: "mechanics",
    name: "Mechanics",
    score,
    reason: violations.length ? violations.join("; ") : "No mechanical violations",
  };
}
