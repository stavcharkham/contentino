import { mkdtemp, mkdir, cp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { LocalStorage } from "./storage";
import { buildDashboardData } from "./dashboard";
import { serializeLedger } from "./ledger";

describe("evidence dashboard data", () => {
  it("reports only stored evidence and preserves an honest empty state", async () => {
    const root = await mkdtemp(path.join(tmpdir(), "contentino-dashboard-"));
    await Promise.all(["metrics", "profile", "eval"].map((folder) => cp(path.join(process.cwd(), folder), path.join(root, folder), { recursive: true })));
    await writeFile(path.join(root, "metrics/ledger.csv"), serializeLedger([]));
    const data = await buildDashboardData(new LocalStorage(root), new Date("2026-08-14T08:00:00.000Z"));
    expect(data.kpis).toMatchObject({ runs: 0, averageScore: null, costUsd: 0, minutesSaved: 0 });
    expect(data.profiles.map((profile) => profile.name)).toEqual(["External Comms", "Product Microcopy"]);
    expect(data.rubric).toMatchObject({ realMean: 9.49, offBrandMean: 4.5, gap: 4.99, sampleSize: 47 });
    expect(data.evidence.find((item) => item.id === "source-count")?.title).toBe("0 source-backed briefs");
  });

  it("lists audits separately and keeps them out of the gate stats", async () => {
    const root = await mkdtemp(path.join(tmpdir(), "contentino-dashboard-"));
    await Promise.all(["metrics", "profile", "eval"].map((folder) => cp(path.join(process.cwd(), folder), path.join(root, folder), { recursive: true })));
    const base = { created: "2026-08-21T08:00:00.000Z", triggered_by: "Stav", trigger: "claude" as const, revisions: 0, api_cost_usd: 0.02 };
    await writeFile(path.join(root, "metrics/ledger.csv"), serializeLedger([
      { ...base, piece_id: "2026-08-21-a-button-a1b2", skill: "submit-product-microcopy", content_type: "product-microcopy", score: 10, outcome: "auto-published", minutes_saved: 20 },
      { ...base, piece_id: "2026-08-21-giveback-review-62d8", skill: "audit", content_type: "external-comms", score: 8.75, outcome: "audited", minutes_saved: 0 },
    ]));
    await mkdir(path.join(root, "content/audits"), { recursive: true });
    await writeFile(path.join(root, "content/audits/2026-08-21-giveback-review-62d8.md"), "---\nid: 2026-08-21-giveback-review-62d8\nsource: lemonade.com blog\n---\n# Giveback");
    const data = await buildDashboardData(new LocalStorage(root), new Date("2026-08-21T09:00:00.000Z"));
    expect(data.kpis.runs).toBe(1);
    expect(data.kpis.averageScore).toBe(10);
    expect(data.audits).toEqual([expect.objectContaining({ pieceId: "2026-08-21-giveback-review-62d8", source: "lemonade.com blog", score: 8.75, compliancePass: true })]);
    expect(data.pieces.map((piece) => piece.piece_id)).toEqual(["2026-08-21-a-button-a1b2"]);
  });
});
