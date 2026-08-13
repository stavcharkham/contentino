import { describe, expect, it } from "vitest";
import { BudgetExceededError, BudgetGuard, calculateModelCost } from "./models";

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
});
