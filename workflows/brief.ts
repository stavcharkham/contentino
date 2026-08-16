import { z } from "zod";
import { parseMarkdown, renderMarkdown } from "@/lib/artifacts";
import { createPieceId } from "@/lib/ids";
import { loadBaseProfile } from "@/lib/profile-storage";
import { briefSchema, type Brief } from "@/lib/schemas";
import { workflowNow, type WorkflowContext } from "./common";

const briefOutput = z.object({
  headline: z.string().min(1),
  story: z.string().min(1),
  why_now: z.string().min(1),
  what_changed: z.string().min(1),
  quote: z.object({ text: z.string().min(1), attribution: z.string().min(1), source_excerpt: z.string().min(1) }).optional(),
  not_saying: z.array(z.string().min(1)).min(1),
  serves: z.string().min(1),
  job: z.string().min(1),
  metric: z.string().min(1),
  shelf_life: z.string().min(1),
  sources: z.array(z.object({ label: z.string().min(1), url: z.string().min(1) })).min(1),
});

function renderBriefBody(output: z.infer<typeof briefOutput>): string {
  const quote = output.quote ? `## Quote\n\n> ${output.quote.text}\n>\n> — ${output.quote.attribution}\n\nSource excerpt: ${output.quote.source_excerpt}\n\n` : "";
  return `# ${output.headline}\n\n${output.story}\n\n## Why now\n\n${output.why_now}\n\n## What changed\n\n${output.what_changed}\n\n${quote}## Purpose\n\n- Serves: ${output.serves}\n- Job: ${output.job}\n- Metric: ${output.metric}\n- Shelf life: ${output.shelf_life}\n\n## Not saying\n\n${output.not_saying.map((item) => `- ${item}`).join("\n")}\n\n## Sources\n\n${output.sources.map((source) => `- [${source.label}](${source.url})`).join("\n")}`;
}

export async function makeBrief(input: {
  context: WorkflowContext;
  transcript: string;
  source: string;
  sourceId: string;
}): Promise<{ path: string; brief: Brief; content: string }> {
  const baseProfile = await loadBaseProfile(input.context.storage);
  const call = await input.context.models.complete({
    job: "brief",
    system: `${baseProfile}\n\nBuild an evidence-carrying brief. Do not add a claim or quote absent from the transcript. State the brief's purpose: who inside the company it serves, the job the piece does, the metric that says it worked, and its shelf life (when it goes stale and what would trigger a refresh).`,
    prompt: `Source: ${input.source}\n\nTranscript:\n${input.transcript}`,
    schema: briefOutput,
    maxTokens: 2200,
  });
  const now = workflowNow(input.context);
  const id = createPieceId(call.value.headline, now);
  const brief: Brief = {
    id,
    created: now.toISOString(),
    source: input.source,
    source_id: input.sourceId,
    status: "draft",
    api_cost_usd: call.usage.cost_usd,
  };
  const content = renderMarkdown(brief, renderBriefBody(call.value));
  const filePath = `content/briefs/${id}.md`;
  await input.context.storage.create(filePath, content, `Create brief ${id}`);
  return { path: filePath, brief, content };
}

export async function approveBrief(input: {
  storage: WorkflowContext["storage"];
  path: string;
  approvedBy: string;
  now?: Date;
}): Promise<Brief> {
  if (!input.approvedBy.trim()) throw new Error("A named person must approve the brief");
  const stored = await input.storage.read(input.path);
  if (!stored) throw new Error(`Brief not found: ${input.path}`);
  const parsed = parseMarkdown(stored.content, briefSchema);
  if (parsed.metadata.status !== "draft") throw new Error(`Only draft briefs can be approved`);
  const approved = briefSchema.parse({
    ...parsed.metadata,
    status: "approved",
    approved_by: input.approvedBy.trim(),
    approved_at: (input.now ?? new Date()).toISOString(),
  });
  await input.storage.update(input.path, renderMarkdown(approved, parsed.body), stored.version, `Approve brief ${approved.id}`);
  return approved;
}
