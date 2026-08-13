import { mkdtemp, cp } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { LocalStorage } from "./storage";
import { buildDashboardData } from "./dashboard";

describe("evidence dashboard data", () => {
  it("reports only stored evidence and preserves an honest empty state", async () => {
    const root = await mkdtemp(path.join(tmpdir(), "contentino-dashboard-"));
    await Promise.all(["metrics", "profile", "eval"].map((folder) => cp(path.join(process.cwd(), folder), path.join(root, folder), { recursive: true })));
    const data = await buildDashboardData(new LocalStorage(root), new Date("2026-08-14T08:00:00.000Z"));
    expect(data.kpis).toMatchObject({ runs: 0, averageScore: null, costUsd: 0, minutesSaved: 0 });
    expect(data.profiles.map((profile) => profile.name)).toEqual(["External Comms", "Product Microcopy"]);
    expect(data.rubric).toMatchObject({ realMean: 9.49, offBrandMean: 4.5, gap: 4.99, sampleSize: 47 });
    expect(data.evidence.find((item) => item.id === "source-count")?.title).toBe("0 source-backed briefs");
  });
});
