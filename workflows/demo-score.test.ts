import { mkdtemp, cp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { parseLedger, serializeLedger } from "@/lib/ledger";
import type { ModelCall, ModelGateway, ModelRequest } from "@/lib/models";
import type { LedgerRow } from "@/lib/schemas";
import { LocalStorage } from "@/lib/storage";
import { DemoRequestError, countDemoRunsToday, demoLimits, scoreDemoText } from "./demo-score";

const usage = { model: "mock", input_tokens: 10, output_tokens: 5, cache_read_tokens: 0, cache_write_tokens: 0, cost_usd: 0.001 };

class QueueGateway implements ModelGateway {
  readonly requests: ModelRequest<unknown>[] = [];
  constructor(private readonly values: unknown[]) {}
  async complete<T>(request: ModelRequest<T>): Promise<ModelCall<T>> {
    this.requests.push(request as ModelRequest<unknown>);
    return { value: request.schema.parse(this.values.shift()), usage };
  }
}

const passingMicrocopyScores = [
  { stakes: "low", reason: "navigation" },
  { pass: true, reason: "safe" },
  { criteria: [
    { id: "register", score: 2, reason: "working" },
    { id: "humour", score: 2, reason: "none needed" },
    { id: "plain-language", score: 2, reason: "plain" },
  ] },
];

function demoRow(created: string, suffix: string): LedgerRow {
  return {
    piece_id: `${created.slice(0, 10)}-demo-${suffix}`,
    created,
    skill: "gate-demo",
    content_type: "product-microcopy",
    triggered_by: "dashboard-visitor",
    trigger: "dashboard",
    score: 9,
    outcome: "reviewed",
    revisions: 0,
    api_cost_usd: 0.001,
    minutes_saved: 0,
  };
}

async function demoRoot(rows: LedgerRow[] = []): Promise<string> {
  const root = await mkdtemp(path.join(tmpdir(), "contentino-demo-"));
  await cp(path.join(process.cwd(), "profile"), path.join(root, "profile"), { recursive: true });
  await cp(path.join(process.cwd(), "metrics"), path.join(root, "metrics"), { recursive: true });
  await writeFile(path.join(root, "metrics/ledger.csv"), serializeLedger(rows));
  return root;
}

describe("gate demo scoring", () => {
  it("rejects text outside the size limits before spending anything", async () => {
    const root = await demoRoot();
    const models = new QueueGateway([]);
    const context = { storage: new LocalStorage(root), models };
    await expect(scoreDemoText({ context, text: "hi" })).rejects.toThrow(DemoRequestError);
    await expect(scoreDemoText({ context, text: "x".repeat(demoLimits.maxChars + 1) })).rejects.toThrow(/blog length/);
    expect(models.requests).toHaveLength(0);
    const ledger = await context.storage.read("metrics/ledger.csv");
    expect(parseLedger(ledger!.content)).toHaveLength(0);
  });

  it("scores short single-line text as microcopy and records a zero-minute ledger row", async () => {
    const root = await demoRoot();
    const context = {
      storage: new LocalStorage(root),
      models: new QueueGateway(passingMicrocopyScores),
      now: () => new Date("2026-08-17T09:00:00.000Z"),
    };
    const result = await scoreDemoText({ context, text: "FINISH YOUR QUOTE" });
    expect(result.contentType).toBe("product-microcopy");
    expect(result.scorecard.score).toBe(10);
    expect(result.runsToday).toBe(1);
    const rows = parseLedger((await context.storage.read("metrics/ledger.csv"))!.content);
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ skill: "gate-demo", trigger: "dashboard", triggered_by: "dashboard-visitor", minutes_saved: 0, revisions: 0 });
  });

  it("scores longer text as external comms", async () => {
    const root = await demoRoot();
    const context = {
      storage: new LocalStorage(root),
      models: new QueueGateway([
        { stakes: "low", reason: "marketing" },
        { pass: true, reason: "safe" },
        { criteria: [
          { id: "register", score: 2, reason: "working" },
          { id: "humour", score: 2, reason: "fits" },
          { id: "plain-language", score: 2, reason: "plain" },
        ] },
      ]),
      now: () => new Date("2026-08-17T09:00:00.000Z"),
    };
    const result = await scoreDemoText({ context, text: "Renters insurance from Lemonade starts at five dollars a month. Claims are handled in the app, and many are paid in minutes rather than weeks." });
    expect(result.contentType).toBe("external-comms");
  });

  it("caps demo runs at the daily limit, counting only today", async () => {
    const today = Array.from({ length: demoLimits.dailyRuns }, (_, index) => demoRow(`2026-08-17T0${index % 2}:00:00.000Z`, index.toString(16).padStart(4, "0")));
    const yesterday = [demoRow("2026-08-16T09:00:00.000Z", "ffff")];
    const root = await demoRoot([...yesterday, ...today]);
    const context = {
      storage: new LocalStorage(root),
      models: new QueueGateway(passingMicrocopyScores),
      now: () => new Date("2026-08-17T10:00:00.000Z"),
    };
    expect(countDemoRunsToday([...yesterday, ...today], new Date("2026-08-17T10:00:00.000Z"))).toBe(demoLimits.dailyRuns);
    await expect(scoreDemoText({ context, text: "FINISH YOUR QUOTE" })).rejects.toThrow(/capped/);
  });
});
