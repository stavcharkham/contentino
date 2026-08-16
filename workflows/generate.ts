import { z } from "zod";
import { parseMarkdown, renderMarkdown } from "@/lib/artifacts";
import { createPieceId } from "@/lib/ids";
import { loadBaseProfile, loadContentTypeFromStorage } from "@/lib/profile-storage";
import { briefSchema, type Draft, type Scorecard } from "@/lib/schemas";
import { contentHash } from "@/lib/storage";
import { publishScoredDraft, recordScoredDraft } from "@/gate/publish";
import { makeLedgerRow, scoreArtifact, workflowNow, type WorkflowContext } from "./common";

const microcopyOutput = z.object({ copy: z.string().min(1), rationale: z.string().min(1) });
const externalOutput = z.object({ title: z.string().min(1), body: z.string().min(1) });

type GenerationResult = { pieceId: string; path: string; scorecard: Scorecard; content: string; note?: string };

const requestCompliance = z.object({ pass: z.boolean(), reason: z.string().min(1) });

function regenerationFeedback(scorecard: Scorecard): string {
  const compliance = scorecard.compliance.pass ? "" : `\n- Compliance veto: ${scorecard.compliance.reason}`;
  return `\n\nThe previous attempt failed:${compliance}\n${scorecard.criteria.map((criterion) => `- ${criterion.name}: ${criterion.score} (${criterion.reason})`).join("\n")}`;
}

function statusFor(scorecard: Scorecard): Draft["status"] {
  if (scorecard.outcome === "blocked") return "blocked";
  if (scorecard.outcome === "reviewed") return "review";
  if (scorecard.outcome === "auto-published") return "published";
  return "draft";
}

function withGenerationUsage(scorecard: Scorecard, usage: Scorecard["usage"][number], extraCost = 0): Scorecard {
  const allUsage = [usage, ...scorecard.usage];
  return {
    ...scorecard,
    usage: allUsage,
    cost_usd: Number((allUsage.reduce((sum, item) => sum + item.cost_usd, 0) + extraCost).toFixed(6)),
  };
}

export async function writeMicrocopy(input: {
  context: WorkflowContext;
  request: string;
  triggeredBy: string;
  trigger: Draft["trigger"];
}): Promise<GenerationResult> {
  const [baseProfile, type] = await Promise.all([
    loadBaseProfile(input.context.storage),
    loadContentTypeFromStorage(input.context.storage, "product-microcopy"),
  ]);
  const now = workflowNow(input.context);
  const pieceId = createPieceId(input.request, now);
  const draftPath = `content/drafts/${pieceId}.md`;
  const requestCheck = await input.context.models.complete({
    job: "compliance",
    system: baseProfile,
    prompt: `Judge the REQUEST below, not any draft. Does it ask for wording that compliance prohibits: guarantees of approval or outcomes, promises about pricing, eligibility or claim decisions, or claims about how personal data is or is not used? pass=false when the request demands such wording, with the reason naming the prohibited claim.\n\nRequest: ${input.request}`,
    schema: requestCompliance,
    maxTokens: 300,
  });
  const requestFlagged = !requestCheck.value.pass;
  let feedback = "";
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    const generation = await input.context.models.complete({
      job: "generation",
      system: `${baseProfile}\n\n${type.guidelineBody}`,
      prompt: `Write one UI string for this request. Respect the declared character limit. Preserve the requested action and object; do not replace quote with price, coverage, approval or another concept. Use second-person “your” for user-facing result and navigation labels unless the request explicitly requires first person.\n\nRequest: ${input.request}${feedback}`,
      schema: microcopyOutput,
      maxTokens: 600,
    });
    const metadata: Draft = {
      id: pieceId,
      created: now.toISOString(),
      content_type: "product-microcopy",
      status: "draft",
      triggered_by: input.triggeredBy,
      trigger: input.trigger,
      attempt,
      voice: "company",
    };
    const body = `# Product micro-copy\n\n${generation.value.copy}`;
    let content = renderMarkdown(metadata, body);
    let scorecard = await scoreArtifact({ context: input.context, pieceId, contentType: metadata.content_type, artifact: content, scoringText: generation.value.copy, attempt });
    scorecard = withGenerationUsage(scorecard, generation.usage);
    scorecard = attempt === 1 ? withGenerationUsage(scorecard, requestCheck.usage) : scorecard;
    if (requestFlagged && scorecard.outcome === "auto-published") {
      scorecard = { ...scorecard, outcome: "reviewed" };
    }
    content = renderMarkdown({ ...metadata, status: statusFor(scorecard) }, body);
    if (scorecard.source_hash !== contentHash(content)) {
      scorecard = { ...scorecard, source_hash: contentHash(content) };
    }
    const ledgerRow = await makeLedgerRow({ storage: input.context.storage, pieceId, created: metadata.created, skill: "write-microcopy", contentType: metadata.content_type, triggeredBy: input.triggeredBy, trigger: input.trigger, scorecard });
    await recordScoredDraft({ storage: input.context.storage, draftPath, content, scorecard, ledgerRow });
    const note = requestFlagged
      ? `The request asked for wording the policy does not allow (${requestCheck.value.reason}). This is a compliant alternative, held for your review.`
      : undefined;
    if (scorecard.outcome === "auto-published") {
      const published = await publishScoredDraft(input.context.storage, draftPath);
      return { pieceId, path: published, scorecard, content };
    }
    // A blocked attempt gets the same silent retries as a low score; only the
    // third failure reaches a person.
    const retryable = scorecard.outcome === "regenerated" || (scorecard.outcome === "blocked" && attempt < 3);
    if (!retryable) return { pieceId, path: draftPath, scorecard, content, note };
    feedback = regenerationFeedback(scorecard);
  }
  throw new Error("Microcopy regeneration loop ended unexpectedly");
}

// The Claude surface drafts on the user's subscription and submits here, so the
// gate that scores and records the piece is the same one Slack and Drive use.
export async function submitDraft(input: {
  context: WorkflowContext;
  contentType: string;
  body: string;
  triggeredBy: string;
  briefId?: string;
  request?: string;
}): Promise<GenerationResult> {
  const now = workflowNow(input.context);
  const title = input.body.match(/^#\s*(.+)$/m)?.[1] ?? input.body.split("\n")[0];
  const pieceId = createPieceId(title, now);
  const draftPath = `content/drafts/${pieceId}.md`;
  let requestCheck: Awaited<ReturnType<typeof input.context.models.complete<z.infer<typeof requestCompliance>>>> | undefined;
  if (input.request) {
    const baseProfile = await loadBaseProfile(input.context.storage);
    requestCheck = await input.context.models.complete({
      job: "compliance",
      system: baseProfile,
      prompt: `Judge the REQUEST below, not any draft. Does it ask for wording that compliance prohibits: guarantees of approval or outcomes, promises about pricing, eligibility or claim decisions, or claims about how personal data is or is not used? pass=false when the request demands such wording, with the reason naming the prohibited claim.\n\nRequest: ${input.request}`,
      schema: requestCompliance,
      maxTokens: 300,
    });
  }
  const requestFlagged = requestCheck ? !requestCheck.value.pass : false;
  const metadata: Draft = {
    id: pieceId,
    created: now.toISOString(),
    content_type: input.contentType,
    status: "draft",
    brief_id: input.briefId,
    triggered_by: input.triggeredBy,
    trigger: "claude",
    attempt: 1,
    voice: "company",
  };
  let content = renderMarkdown(metadata, input.body);
  let scorecard = await scoreArtifact({ context: input.context, pieceId, contentType: input.contentType, artifact: content, scoringText: input.body, attempt: 1 });
  if (requestCheck) scorecard = withGenerationUsage(scorecard, requestCheck.usage);
  if (requestFlagged && scorecard.outcome === "auto-published") scorecard = { ...scorecard, outcome: "reviewed" };
  content = renderMarkdown({ ...metadata, status: statusFor(scorecard) }, input.body);
  scorecard = { ...scorecard, source_hash: contentHash(content) };
  const ledgerRow = await makeLedgerRow({ storage: input.context.storage, pieceId, created: metadata.created, skill: `submit-${input.contentType}`, contentType: input.contentType, triggeredBy: input.triggeredBy, trigger: "claude", scorecard });
  await recordScoredDraft({ storage: input.context.storage, draftPath, content, scorecard, ledgerRow });
  const note = requestFlagged && requestCheck
    ? `The request asked for wording the policy does not allow (${requestCheck.value.reason}). This is a compliant alternative, held for your review.`
    : undefined;
  if (scorecard.outcome === "auto-published") {
    const published = await publishScoredDraft(input.context.storage, draftPath);
    return { pieceId, path: published, scorecard, content };
  }
  return { pieceId, path: draftPath, scorecard, content, note };
}

export async function writeExternalComms(input: {
  context: WorkflowContext;
  briefPath: string;
  triggeredBy: string;
  trigger: Draft["trigger"];
}): Promise<GenerationResult> {
  const storedBrief = await input.context.storage.read(input.briefPath);
  if (!storedBrief) throw new Error(`Brief not found: ${input.briefPath}`);
  const brief = parseMarkdown(storedBrief.content, briefSchema);
  if (brief.metadata.status !== "approved" || !brief.metadata.approved_by) throw new Error("External communications require an approved brief");
  const [baseProfile, type] = await Promise.all([
    loadBaseProfile(input.context.storage),
    loadContentTypeFromStorage(input.context.storage, "external-comms"),
  ]);
  const now = workflowNow(input.context);
  let pieceId = "";
  let draftPath = "";
  let feedback = "";
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    const generation = await input.context.models.complete({
      job: "generation",
      system: `${baseProfile}\n\n${type.guidelineBody}`,
      prompt: `Write a blog post from this approved brief. Preserve its sources and Not saying boundaries.\n\n${brief.body}${feedback}`,
      schema: externalOutput,
      maxTokens: 2600,
    });
    pieceId ||= createPieceId(generation.value.title, now);
    draftPath ||= `content/drafts/${pieceId}.md`;
    const metadata: Draft = {
      id: pieceId,
      created: now.toISOString(),
      content_type: "external-comms",
      status: "draft",
      brief_id: brief.metadata.id,
      triggered_by: input.triggeredBy,
      trigger: input.trigger,
      attempt,
      voice: "company",
    };
    const body = `# ${generation.value.title}\n\n${generation.value.body}`;
    let content = renderMarkdown(metadata, body);
    let scorecard = await scoreArtifact({ context: input.context, pieceId, contentType: metadata.content_type, artifact: content, scoringText: body, attempt });
    scorecard = withGenerationUsage(scorecard, generation.usage, brief.metadata.api_cost_usd ?? 0);
    content = renderMarkdown({ ...metadata, status: statusFor(scorecard) }, body);
    scorecard = { ...scorecard, source_hash: contentHash(content) };
    const ledgerRow = await makeLedgerRow({ storage: input.context.storage, pieceId, created: metadata.created, skill: "write-external-comms", contentType: metadata.content_type, triggeredBy: input.triggeredBy, trigger: input.trigger, scorecard });
    await recordScoredDraft({ storage: input.context.storage, draftPath, content, scorecard, ledgerRow });
    const retryable = scorecard.outcome === "regenerated" || (scorecard.outcome === "blocked" && attempt < 3);
    if (!retryable) return { pieceId, path: draftPath, scorecard, content };
    feedback = regenerationFeedback(scorecard);
  }
  throw new Error("External generation loop ended unexpectedly");
}
