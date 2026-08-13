import { parse as parseYaml } from "yaml";
import type { LedgerRow } from "./schemas";
import { ledgerRowSchema } from "./schemas";

export const ledgerHeader = [
  "piece_id", "created", "skill", "content_type", "triggered_by", "trigger", "score",
  "outcome", "revisions", "api_cost_usd", "minutes_saved",
] as const;

type Baseline = { baseline_minutes: number; reviewed_multiplier: number; minutes_per_revision: number };

function encodeCsv(value: unknown): string {
  const string = String(value);
  return /[",\n]/.test(string) ? `"${string.replaceAll('"', '""')}"` : string;
}

function parseCsvLine(line: string): string[] {
  const values: string[] = [];
  let value = "";
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    if (char === '"' && quoted && line[index + 1] === '"') { value += '"'; index += 1; }
    else if (char === '"') quoted = !quoted;
    else if (char === "," && !quoted) { values.push(value); value = ""; }
    else value += char;
  }
  values.push(value);
  return values;
}

export function parseLedger(csv: string): LedgerRow[] {
  const lines = csv.trim().split("\n");
  if (!lines[0] || parseCsvLine(lines[0]).join(",") !== ledgerHeader.join(",")) throw new Error("Ledger header is invalid");
  return lines.slice(1).filter(Boolean).map((line) => {
    const values = parseCsvLine(line);
    const record: Record<string, string | number> = Object.fromEntries(
      ledgerHeader.map((key, index) => [key, values[index]]),
    );
    for (const key of ["score", "revisions", "api_cost_usd", "minutes_saved"]) record[key] = Number(record[key]);
    return ledgerRowSchema.parse(record);
  });
}

export function serializeLedger(rows: LedgerRow[]): string {
  const lines = rows.map((row) => ledgerHeader.map((key) => encodeCsv(row[key])).join(","));
  return `${ledgerHeader.join(",")}\n${lines.join("\n")}${lines.length ? "\n" : ""}`;
}

export function upsertLedger(rows: LedgerRow[], row: LedgerRow): LedgerRow[] {
  const next = rows.filter((candidate) => candidate.piece_id !== row.piece_id);
  next.push(ledgerRowSchema.parse(row));
  return next.sort((a, b) => a.created.localeCompare(b.created));
}

export function readBaselines(source: string): Record<string, Baseline> {
  return parseYaml(source) as Record<string, Baseline>;
}

export function minutesSaved(
  baseline: Baseline,
  outcome: LedgerRow["outcome"],
  revisions: number,
): number {
  if (outcome === "blocked" || outcome === "regenerated") return 0;
  const gross = outcome === "auto-published" ? baseline.baseline_minutes : baseline.baseline_minutes * baseline.reviewed_multiplier;
  return Math.max(0, gross - revisions * baseline.minutes_per_revision);
}
