import path from "node:path";
import { describe, expect, it } from "vitest";
import type { ModelCall, ModelGateway, ModelRequest } from "@/lib/models";
import { loadContentType } from "@/lib/profile";
import { normalizeScore, routeScore, scoreDraft } from "./score";

const usage = { model: "mock", input_tokens: 10, output_tokens: 5, cache_read_tokens: 0, cache_write_tokens: 0, cost_usd: 0.001 };

class QueueGateway implements ModelGateway {
  readonly requests: ModelRequest<unknown>[] = [];
  constructor(private readonly values: unknown[]) {}
  async complete<T>(request: ModelRequest<T>): Promise<ModelCall<T>> {
    this.requests.push(request as ModelRequest<unknown>);
    return { value: request.schema.parse(this.values.shift()), usage };
  }
}

describe("score gate", () => {
  it("normalizes applicable criteria and excludes N/A", () => {
    expect(normalizeScore([
      { id: "a", name: "A", score: 2, reason: "yes" },
      { id: "b", name: "B", score: 1, reason: "partly" },
      { id: "c", name: "C", score: "N/A", reason: "not applicable" },
    ])).toBe(7.5);
  });

  it("routes only passing low-stakes microcopy to auto-publish", () => {
    const criteria = [{ id: "a", name: "A", score: 2 as const, reason: "yes" }];
    expect(routeScore({ score: 9.5, criteria, compliancePass: true, stakes: "low", ceiling: "low", attempt: 1 })).toBe("auto-published");
    expect(routeScore({ score: 9.5, criteria, compliancePass: true, stakes: "medium", ceiling: "low", attempt: 1 })).toBe("reviewed");
    expect(routeScore({ score: 9.5, criteria, compliancePass: true, stakes: "low", ceiling: "none", attempt: 1 })).toBe("reviewed");
  });

  it("blocks a zero or veto and caps regeneration at three", () => {
    const zero = [{ id: "a", name: "A", score: 0 as const, reason: "bad" }];
    expect(routeScore({ score: 9, criteria: zero, compliancePass: true, stakes: "low", ceiling: "low", attempt: 1 })).toBe("blocked");
    const one = [{ id: "a", name: "A", score: 1 as const, reason: "weak" }];
    expect(routeScore({ score: 5, criteria: one, compliancePass: true, stakes: "low", ceiling: "low", attempt: 2 })).toBe("regenerated");
    expect(routeScore({ score: 5, criteria: one, compliancePass: true, stakes: "low", ceiling: "low", attempt: 3 })).toBe("reviewed");
  });

  it("scores against core and type criteria", async () => {
    const type = await loadContentType(path.join(process.cwd(), "profile"), "product-microcopy");
    const models = new QueueGateway([
      { stakes: "low", reason: "navigation" },
      { pass: true, reason: "safe" },
      { criteria: [
        { id: "register", score: 2, reason: "working" },
        { id: "humour", score: 2, reason: "none needed" },
        { id: "plain-language", score: 2, reason: "plain" },
      ] },
      { criteria: [
        { id: "direct-address", score: "N/A", reason: "button" },
        { id: "character-budget", score: 2, reason: "short" },
        { id: "action-verb", score: 2, reason: "consistent" },
      ] },
    ]);
    const result = await scoreDraft({
      pieceId: "2026-08-14-finish-quote-a3f2",
      content: "FINISH QUOTE",
      type,
      baseProfile: "profile",
      attempt: 1,
      models,
      now: new Date("2026-08-14T09:00:00.000Z"),
    });
    expect(result.score).toBe(10);
    expect(result.outcome).toBe("auto-published");
    expect(result.usage).toHaveLength(4);
    expect(models.requests[0].prompt).toContain("button label that only opens, displays or continues to a quote");
    expect(models.requests[1].prompt).toContain("Do not fail an isolated navigation or button label");
  });

  it("stops after the free mechanics check blocks the draft", async () => {
    const type = await loadContentType(path.join(process.cwd(), "profile"), "product-microcopy");
    const models = new QueueGateway([{ stakes: "high", reason: "eligibility" }]);
    const result = await scoreDraft({
      pieceId: "2026-08-14-price-guarantee-b4e1",
      content: "YOUR CLAIM IS GUARANTEED!! 🎉🎉 This sentence keeps going far beyond the interface limit and should never reach a paid voice judge.",
      type,
      baseProfile: "profile",
      attempt: 1,
      models,
    });
    expect(result.outcome).toBe("blocked");
    expect(result.usage).toHaveLength(1);
    expect(result.criteria[0].id).toBe("mechanics");
  });

  it("runs the hand-promoted action-label guideline for free", async () => {
    const type = await loadContentType(path.join(process.cwd(), "profile"), "product-microcopy");
    const models = new QueueGateway([{ stakes: "low", reason: "navigation" }]);
    const result = await scoreDraft({
      pieceId: "2026-08-14-click-here-c2d1",
      content: "CLICK HERE!!",
      type,
      baseProfile: "profile",
      attempt: 1,
      models,
    });
    expect(result.criteria[0].reason).toContain("generic “click here”");
    expect(result.usage).toHaveLength(1);
  });
});
