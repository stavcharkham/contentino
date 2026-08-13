import { describe, expect, it } from "vitest";
import { briefSchema, correctionSchema, pieceIdSchema } from "./schemas";

describe("artifact schemas", () => {
  it("accepts sortable readable piece ids", () => {
    expect(pieceIdSchema.parse("2026-08-14-q2-results-a3f2")).toBe("2026-08-14-q2-results-a3f2");
    expect(() => pieceIdSchema.parse("q2-results")).toThrow();
  });

  it("requires human approval metadata on approved briefs at the workflow boundary", () => {
    const parsed = briefSchema.parse({
      id: "2026-08-14-q2-results-a3f2",
      created: "2026-08-14T09:00:00.000Z",
      source: "drive://call",
      source_id: "call",
      status: "approved",
    });
    expect(parsed.approved_by).toBeUndefined();
  });

  it("preserves verbatim review evidence", () => {
    const correction = correctionSchema.parse({
      id: "a3f2",
      created: "2026-08-14T09:31:00.000Z",
      content_type: "external-comms",
      piece: "content/drafts/example.md",
      surface: "slack",
      who: "stav",
      criterion: "register",
      status: "open",
      was: "Old",
      now: "New",
      said: "This sounds too corporate",
    });
    expect(correction.said).toBe("This sounds too corporate");
  });
});
