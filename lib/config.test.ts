import { describe, expect, it } from "vitest";
import { readConfig } from "./config";

describe("readConfig", () => {
  it("uses safe local defaults", () => {
    const config = readConfig({});
    expect(config.CONTENTINO_STORAGE).toBe("local");
    expect(config.CONTENTINO_MAX_BUDGET_USD).toBe(50);
  });

  it("fails early when hosted storage is incomplete", () => {
    expect(() => readConfig({ CONTENTINO_STORAGE: "github" })).toThrow(
      "GitHub storage requires GITHUB_TOKEN, GITHUB_OWNER",
    );
  });
});
