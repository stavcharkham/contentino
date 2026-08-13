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

type GenerationResult = { pieceId: string; path: string; scorecard: Scorecard; content: string };

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
  let feedback = "";
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    const generation = await input.context.models.complete({
      job: "generation",
      system: `${baseProfile}\n\n${type.guidelineBody}`,
      prompt: `Write one UI string for this request. Respect the declared character limit.\n\nRequest: ${input.request}${feedback}`,
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
    content = renderMarkdown({ ...metadata, status: statusFor(scorecard) }, body);
    if (scorecard.source_hash !== contentHash(content)) {
      scorecard = { ...scorecard, source_hash: contentHash(content) };
    }
    const ledgerRow = await makeLedgerRow({ storage: input.context.storage, pieceId, created: metadata.created, skill: "write-microcopy", contentType: metadata.content_type, triggeredBy: input.triggeredBy, trigger: input.trigger, scorecard });
    await recordScoredDraft({ storage: input.context.storage, draftPath, content, scorecard, ledgerRow });
    if (scorecard.outcome === "auto-published") {
      const published = await publishScoredDraft(input.context.storage, draftPath);
      return { pieceId, path: published, scorecard, content };
    }
    if (scorecard.outcome !== "regenerated") return { pieceId, path: draftPath, scorecard, content };
    feedback = `\n\nThe previous attempt failed:\n${scorecard.criteria.map((criterion) => `- ${criterion.name}: ${criterion.score} (${criterion.reason})`).join("\n")}`;
  }
  throw new Error("Microcopy regeneration loop ended unexpectedly");
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
    if (scorecard.outcome !== "regenerated") return { pieceId, path: draftPath, scorecard, content };
    feedback = `\n\nThe previous attempt failed:\n${scorecard.criteria.map((criterion) => `- ${criterion.name}: ${criterion.score} (${criterion.reason})`).join("\n")}`;
  }
  throw new Error("External generation loop ended unexpectedly");
}
