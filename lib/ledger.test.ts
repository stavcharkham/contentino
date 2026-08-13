import { describe, expect, it } from "vitest";
import { minutesSaved, parseLedger, serializeLedger, upsertLedger } from "./ledger";
import type { LedgerRow } from "./schemas";

const row: LedgerRow = {
  piece_id: "2026-08-14-finish-quote-a3f2",
  created: "2026-08-14T09:00:00.000Z",
  skill: "write-microcopy",
  content_type: "product-microcopy",
  triggered_by: "stav",
  trigger: "claude",
  score: 10,
  outcome: "auto-published",
  revisions: 0,
  api_cost_usd: 0.01,
  minutes_saved: 20,
};

describe("ledger", () => {
  it("round trips rows and updates one row per piece", () => {
    const updated = upsertLedger([row], { ...row, revisions: 1, outcome: "reviewed", minutes_saved: 5 });
    expect(updated).toHaveLength(1);
    expect(parseLedger(serializeLedger(updated))[0].revisions).toBe(1);
  });

  it("keeps baseline assumptions explicit", () => {
    const baseline = { baseline_minutes: 20, reviewed_multiplier: 0.5, minutes_per_revision: 5 };
    expect(minutesSaved(baseline, "auto-published", 0)).toBe(20);
    expect(minutesSaved(baseline, "reviewed", 1)).toBe(5);
    expect(minutesSaved(baseline, "blocked", 0)).toBe(0);
  });
});
