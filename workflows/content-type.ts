import matter from "gray-matter";
import { z } from "zod";
import { renderMarkdown } from "@/lib/artifacts";
import { createPieceId } from "@/lib/ids";
import { parseContentTypeFiles } from "@/lib/profile";
import { loadBaseProfile, loadContentTypeFromStorage } from "@/lib/profile-storage";
import { contentHash } from "@/lib/storage";
import { scoreDraft } from "@/gate/score";
import type { WorkflowContext } from "./common";

export const contentTypeSpecSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  owner: z.string().min(1),
  max_autopublish_stakes: z.enum(["low", "medium", "high", "none"]),
  mechanics: z.object({ max_chars: z.number().int().positive(), sentence_band: z.tuple([z.number().int().positive(), z.number().int().positive()]) }),
  guideline: z.string().min(20),
  criteria: z.array(z.object({ id: z.string().regex(/^[a-z0-9-]+$/), name: z.string().min(1), question: z.string().min(1) })).min(1),
  examples: z.array(z.object({ id: z.string().min(1), stakes: z.enum(["low", "medium", "high"]), content: z.string().min(1), source: z.string().min(1) })).min(3),
});

export type ContentTypeSpec = z.infer<typeof contentTypeSpecSchema>;

function filesForSpec(spec: ContentTypeSpec) {
  const guidelineRaw = renderMarkdown({
    content_type: spec.slug,
    status: "draft",
    owner: spec.owner,
    max_autopublish_stakes: spec.max_autopublish_stakes,
    mechanics: spec.mechanics,
  }, `# ${spec.slug}\n\n${spec.guideline}`);
  const criteriaRaw = renderMarkdown({ content_type: spec.slug, criteria: spec.criteria }, `# ${spec.slug} criteria\n\nScore each applicable question 0, 1 or 2.`);
  const examples = `# Approved examples\n\n${spec.examples.map((example) => `## ${example.id}\n**Stakes:** ${example.stakes}  \n**Approved:** true\n**Source:** ${example.source}\n\n> ${example.content.replaceAll("\n", "\n> ")}`).join("\n\n")}`;
  return { guidelineRaw, criteriaRaw, examples };
}

export async function addContentType(storage: WorkflowContext["storage"], rawSpec: unknown): Promise<string> {
  const spec = contentTypeSpecSchema.parse(rawSpec);
  const files = filesForSpec(spec);
  parseContentTypeFiles(spec.slug, files);
  const root = `profile/types/${spec.slug}`;
  await storage.commit({
    message: `Add draft content type ${spec.slug}`,
    changes: [
      { type: "write", path: `${root}/guideline.md`, content: files.guidelineRaw, expectedVersion: null },
      { type: "write", path: `${root}/criteria.md`, content: files.criteriaRaw, expectedVersion: null },
      { type: "write", path: `${root}/examples.md`, content: files.examples, expectedVersion: null },
    ],
  });
  return root;
}

function exampleBlocks(examples: string): Array<{ id: string; content: string }> {
  return examples.split(/^## /m).slice(1).map((block) => {
    const [idLine, ...rest] = block.split("\n");
    const quoted = rest.filter((line) => line.startsWith("> ")).map((line) => line.slice(2)).join("\n");
    return { id: idLine.trim(), content: quoted };
  });
}

export async function validateContentType(context: WorkflowContext, slug: string): Promise<{ active: boolean; scores: number[] }> {
  const [baseProfile, type] = await Promise.all([loadBaseProfile(context.storage), loadContentTypeFromStorage(context.storage, slug)]);
  const now = context.now?.() ?? new Date();
  const scores: number[] = [];
  for (const example of exampleBlocks(type.examples)) {
    const artifact = renderMarkdown({ example: example.id, content_type: slug }, example.content);
    const score = await scoreDraft({
      pieceId: createPieceId(example.id, now, contentHash(example.id).slice(0, 4)),
      content: artifact,
      scoringText: example.content,
      type,
      baseProfile,
      attempt: 1,
      models: context.models,
      now,
    });
    scores.push(score.score);
    if (score.score < 9 || !score.compliance.pass || score.criteria.some((criterion) => criterion.score === 0)) return { active: false, scores };
  }
  const guidelinePath = `profile/types/${slug}/guideline.md`;
  const stored = await context.storage.read(guidelinePath);
  if (!stored) throw new Error(`Guideline not found for ${slug}`);
  const parsed = matter(stored.content);
  parsed.data.status = "active";
  await context.storage.update(guidelinePath, matter.stringify(parsed.content, parsed.data), stored.version, `Activate content type ${slug}`);
  return { active: true, scores };
}
