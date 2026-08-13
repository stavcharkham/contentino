import { describe, expect, it } from "vitest";
import { createPieceId, slugify } from "./ids";

describe("piece ids", () => {
  it("creates readable sortable ids", () => {
    expect(createPieceId("Q2 Results!", new Date("2026-08-14T10:00:00Z"), "a3f2")).toBe("2026-08-14-q2-results-a3f2");
  });

  it("normalizes empty and accented titles safely", () => {
    expect(slugify("Crème & Price")).toBe("cre-me-price");
    expect(slugify("!!!")).toBe("piece");
  });
});
