import { z } from "zod";
import { describe, expect, it, vi } from "vitest";
import { readConfig } from "./config";
import { AnthropicGateway, BudgetExceededError, BudgetGuard, calculateModelCost } from "./models";

describe("model budget", () => {
  it("calculates regular and cached token cost", () => {
    expect(calculateModelCost("claude-sonnet-5", {
      input_tokens: 1_000_000,
      output_tokens: 100_000,
      cache_read_tokens: 1_000_000,
      cache_write_tokens: 1_000_000,
    })).toBe(5.7);
  });

  it("blocks before a reservation exceeds the budget", () => {
    const budget = new BudgetGuard(49.9, 50);
    expect(() => budget.reserve(0.11)).toThrow(BudgetExceededError);
    const release = budget.reserve(0.1);
    expect(budget.remainingUsd).toBeCloseTo(0);
    release();
  });

  it("disables model thinking for bounded structured workflows", async () => {
    const create = vi.fn().mockResolvedValue({
      content: [{ type: "text", text: JSON.stringify({ ok: true }) }],
      usage: { input_tokens: 10, output_tokens: 5 },
    });
    const gateway = new AnthropicGateway(
      readConfig({ ANTHROPIC_API_KEY: "test" }),
      new BudgetGuard(0, 50),
      { messages: { create } } as never,
    );
    await gateway.complete({
      job: "generation",
      system: "System",
      prompt: "Prompt",
      schema: z.object({ ok: z.boolean() }),
      maxTokens: 600,
    });
    expect(create).toHaveBeenCalledWith(expect.objectContaining({ thinking: { type: "disabled" } }));
  });

  it("retries invalid structured output and includes both calls in usage", async () => {
    const create = vi.fn()
      .mockResolvedValueOnce({ content: [{ type: "text", text: JSON.stringify({ ok: "yes" }) }], usage: { input_tokens: 10, output_tokens: 5 } })
      .mockResolvedValueOnce({ content: [{ type: "text", text: JSON.stringify({ ok: true }) }], usage: { input_tokens: 8, output_tokens: 4 } });
    const gateway = new AnthropicGateway(
      readConfig({ ANTHROPIC_API_KEY: "test" }),
      new BudgetGuard(0, 50),
      { messages: { create } } as never,
    );
    const result = await gateway.complete({
      job: "generation",
      system: "System",
      prompt: "Prompt",
      schema: z.object({ ok: z.boolean() }),
      maxTokens: 600,
    });
    expect(result.value).toEqual({ ok: true });
    expect(result.usage).toMatchObject({ input_tokens: 18, output_tokens: 9 });
    expect(create).toHaveBeenCalledTimes(2);
  });
});
