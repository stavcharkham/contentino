import matter from "gray-matter";
import { parseLedger } from "./ledger";
import { scorecardSchema, guidelineProposalSchema, type LedgerRow } from "./schemas";
import type { ContentStorage } from "./storage";
import { parseCorrection } from "@/workflows/review";

export type FlowStage = "source" | "brief" | "draft" | "gate" | "review" | "correction" | "guideline";

export type DashboardEvidence = {
  id: string;
  stage: FlowStage;
  eyebrow: string;
  title: string;
  detail: string;
  value?: string;
  tone: "pink" | "mint" | "amber" | "ink";
};

export type DashboardData = {
  generatedAt: string;
  generatedLabel: string;
  kpis: {
    runs: number;
    averageScore: number | null;
    blocks: number;
    revisions: number;
    costUsd: number;
    minutesSaved: number;
  };
  flow: Array<{ id: FlowStage; label: string; count: number; note: string }>;
  outcomes: Array<{ label: string; count: number; percentage: number }>;
  scoreBands: Array<{ label: string; count: number; percentage: number }>;
  pieces: Array<LedgerRow & { createdLabel: string }>;
  profiles: Array<{ name: string; status: string; ceiling: string; version: string; criteria: number }>;
  corrections: Array<{ id: string; type: string; criterion: string; surface: string; status: string; who: string }>;
  rubric: { realMean: number; offBrandMean: number; gap: number; sampleSize: number; disclosure: string };
  evidence: DashboardEvidence[];
};

function percentage(count: number, total: number): number {
  return total ? Math.round((count / total) * 100) : 0;
}

function titleCase(value: string): string {
  return value.split("-").map((word) => `${word.slice(0, 1).toUpperCase()}${word.slice(1)}`).join(" ");
}

function rubricNumber(source: string, expression: RegExp, fallback: number): number {
  return Number(source.match(expression)?.[1] ?? fallback);
}

export async function buildDashboardData(storage: ContentStorage, now = new Date()): Promise<DashboardData> {
  const [ledgerFile, briefs, drafts, published, correctionFiles, guidelineFiles, typeFiles, rubricFile] = await Promise.all([
    storage.read("metrics/ledger.csv"),
    storage.list("content/briefs"),
    storage.list("content/drafts"),
    storage.list("content/published"),
    storage.list("content/corrections"),
    storage.list("content/guidelines"),
    storage.list("profile/types"),
    storage.read("eval/rubric-recheck.md"),
  ]);
  if (!ledgerFile) throw new Error("The evidence ledger is missing");
  if (!rubricFile) throw new Error("The rubric evaluation is missing");

  const rows = parseLedger(ledgerFile.content);
  const scorecards = [...drafts, ...published]
    .filter((file) => file.path.endsWith(".score.json"))
    .map((file) => scorecardSchema.parse(JSON.parse(file.content)));
  const corrections = correctionFiles.map((file) => parseCorrection(file.content));
  const proposals = guidelineFiles.map((file) => matter(file.content).data).map((data) => guidelineProposalSchema.parse(data));
  const guidelineByType = typeFiles.filter((file) => file.path.endsWith("/guideline.md"));
  const criteriaByType = new Map(typeFiles.filter((file) => file.path.endsWith("/criteria.md")).map((file) => {
    const parsed = matter(file.content).data as { content_type: string; criteria?: unknown[] };
    return [parsed.content_type, parsed.criteria?.length ?? 0] as const;
  }));
  const profiles = guidelineByType.map((file) => {
    const parsed = matter(file.content).data as { content_type: string; status: string; max_autopublish_stakes: string };
    return {
      name: titleCase(parsed.content_type),
      status: parsed.status,
      ceiling: parsed.max_autopublish_stakes,
      version: file.version.slice(0, 7),
      criteria: criteriaByType.get(parsed.content_type) ?? 0,
    };
  }).sort((a, b) => a.name.localeCompare(b.name));

  const outcomeLabels = ["auto-published", "reviewed", "regenerated", "blocked"] as const;
  const outcomes = outcomeLabels.map((label) => {
    const count = rows.filter((row) => row.outcome === label).length;
    return { label, count, percentage: percentage(count, rows.length) };
  });
  const scoreBands = [
    { label: "8–10", count: rows.filter((row) => row.score >= 8).length },
    { label: "5–7.9", count: rows.filter((row) => row.score >= 5 && row.score < 8).length },
    { label: "0–4.9", count: rows.filter((row) => row.score < 5).length },
  ].map((band) => ({ ...band, percentage: percentage(band.count, rows.length) }));
  const rubricSource = rubricFile.content;
  const rubric = {
    realMean: rubricNumber(rubricSource, /Real Lemonade mean[^\n]*\*\*(\d+\.\d+)\*\*/, 9.49),
    offBrandMean: rubricNumber(rubricSource, /Off-brand mean[^\n]*\*\*(\d+\.\d+)\*\*/, 4.5),
    gap: rubricNumber(rubricSource, /\*\*Gap\*\*[^\n]*\*\*(\d+\.\d+)\*\*/, 4.99),
    sampleSize: rubricNumber(rubricSource, /(\d+) of \d+ match/, 47),
    disclosure: "Same 47-item set; human calibration and live model scoring remain outstanding.",
  };
  const reviewCount = rows.filter((row) => row.outcome === "reviewed").length;
  const publishCount = rows.filter((row) => row.outcome === "auto-published").length;
  const evidence: DashboardEvidence[] = [
    { id: "source-count", stage: "source", eyebrow: "Source intake", title: `${briefs.length} source-backed brief${briefs.length === 1 ? "" : "s"}`, detail: briefs.length ? "Each brief retains its source id for Drive idempotency." : "No transcript has entered the live ledger yet.", value: String(briefs.length), tone: "ink" },
    { id: "brief-gate", stage: "brief", eyebrow: "Human gate", title: "Named approval required", detail: "External comms cannot start from a transcript or an unapproved brief.", value: "Hard gate", tone: "amber" },
    { id: "draft-count", stage: "draft", eyebrow: "Generated artifacts", title: `${drafts.filter((file) => file.path.endsWith(".md")).length} draft${drafts.length === 1 ? "" : "s"} waiting`, detail: "Drafts and their scorecards share the same versioned storage path.", tone: "ink" },
    { id: "rubric-gap", stage: "gate", eyebrow: "Rubric evaluation", title: `${rubric.gap.toFixed(2)} point separation`, detail: `Real Lemonade ${rubric.realMean.toFixed(2)} · off-brand ${rubric.offBrandMean.toFixed(2)} · ${rubric.sampleSize} items reproduced.`, value: `${rubric.gap.toFixed(2)} gap`, tone: "pink" },
    { id: "compliance", stage: "gate", eyebrow: "Compliance veto", title: `${scorecards.filter((score) => !score.compliance.pass).length} live block${scorecards.filter((score) => !score.compliance.pass).length === 1 ? "" : "s"}`, detail: "A veto, zero criterion, stale hash or stakes ceiling stops publication.", tone: "amber" },
    { id: "routes", stage: "review", eyebrow: "Routing", title: `${publishCount} published · ${reviewCount} reviewed`, detail: "Publishing moves an eligible artifact into Git; it never posts to a public channel.", tone: "mint" },
    { id: "correction-count", stage: "correction", eyebrow: "Learning record", title: `${corrections.length} exact correction${corrections.length === 1 ? "" : "s"}`, detail: "Claude, Slack and Google Docs write the same correction contract.", tone: "ink" },
    { id: "profile-count", stage: "guideline", eyebrow: "Active profile", title: `${profiles.filter((profile) => profile.status === "active").length} content types active`, detail: `${proposals.filter((proposal) => proposal.status === "approved").length} learned guideline${proposals.filter((proposal) => proposal.status === "approved").length === 1 ? "" : "s"} approved from corrections.`, tone: "pink" },
  ];

  return {
    generatedAt: now.toISOString(),
    generatedLabel: new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Jerusalem" }).format(now),
    kpis: {
      runs: rows.length,
      averageScore: rows.length ? Number((rows.reduce((sum, row) => sum + row.score, 0) / rows.length).toFixed(2)) : null,
      blocks: scorecards.filter((score) => !score.compliance.pass).length,
      revisions: rows.reduce((sum, row) => sum + row.revisions, 0),
      costUsd: Number(rows.reduce((sum, row) => sum + row.api_cost_usd, 0).toFixed(6)),
      minutesSaved: rows.reduce((sum, row) => sum + row.minutes_saved, 0),
    },
    flow: [
      { id: "source", label: "Source", count: briefs.length, note: "Drive or Claude" },
      { id: "brief", label: "Brief", count: briefs.length, note: "Named approval" },
      { id: "draft", label: "Draft", count: rows.length, note: "Type + voice" },
      { id: "gate", label: "Gate", count: scorecards.length, note: "Score + veto" },
      { id: "review", label: "Review / publish", count: reviewCount + publishCount, note: "Git, Slack, Docs" },
      { id: "correction", label: "Correction", count: corrections.length, note: "Exact before / after" },
      { id: "guideline", label: "Guideline", count: proposals.length, note: "Four matching edits" },
    ],
    outcomes,
    scoreBands,
    pieces: [...rows].reverse().slice(0, 8).map((row) => ({ ...row, createdLabel: new Date(row.created).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" }) })),
    profiles,
    corrections: corrections.slice(0, 8).map((correction) => ({ id: correction.id, type: titleCase(correction.content_type), criterion: titleCase(correction.criterion), surface: correction.surface, status: correction.status, who: correction.who })),
    rubric,
    evidence,
  };
}
