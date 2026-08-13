import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("Vercel deployment configuration", () => {
  it("keeps the Drive sync within the Hobby daily cron limit", () => {
    const config = JSON.parse(readFileSync("vercel.json", "utf8")) as {
      crons: Array<{ path: string; schedule: string }>;
    };

    expect(config.crons).toEqual([
      { path: "/api/cron/drive", schedule: "0 6 * * *" },
    ]);
  });
});
