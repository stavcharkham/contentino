import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";

export const stakesSchema = z.enum(["low", "medium", "high"]);
export const ceilingSchema = z.enum(["low", "medium", "high", "none"]);

export const criterionSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(1),
  question: z.string().min(1),
});

export const guidelineSchema = z.object({
  content_type: z.string().regex(/^[a-z0-9-]+$/),
  status: z.enum(["draft", "active"]),
  owner: z.string().min(1),
  max_autopublish_stakes: ceilingSchema,
  mechanics: z.object({
    max_chars: z.number().int().positive(),
    sentence_band: z.tuple([z.number().int().positive(), z.number().int().positive()]),
  }),
});

export const criteriaFileSchema = z.object({
  content_type: z.string().regex(/^[a-z0-9-]+$/),
  criteria: z.array(criterionSchema).min(1),
});

export type GuidelineConfig = z.infer<typeof guidelineSchema>;
export type ContentCriterion = z.infer<typeof criterionSchema>;

export type ContentTypeProfile = {
  slug: string;
  guideline: GuidelineConfig;
  criteria: ContentCriterion[];
  guidelineBody: string;
  criteriaBody: string;
  examples: string;
};

const requiredBaseFiles = [
  "voice.md",
  "stakes.md",
  "mechanics.md",
  "vocabulary.md",
  "compliance.md",
  "audience.md",
];

export function approvedExampleCount(markdown: string): number {
  return [...markdown.matchAll(/^\*\*Approved:\*\* true$/gim)].length;
}

export function parseContentTypeFiles(
  slug: string,
  files: { guidelineRaw: string; criteriaRaw: string; examples: string },
): ContentTypeProfile {
  const guidelineFile = matter(files.guidelineRaw);
  const criteriaFile = matter(files.criteriaRaw);
  const guideline = guidelineSchema.parse(guidelineFile.data);
  const criteria = criteriaFileSchema.parse(criteriaFile.data);
  if (guideline.content_type !== slug || criteria.content_type !== slug) {
    throw new Error(`Content type folder ${slug} does not match its frontmatter`);
  }
  if (guideline.mechanics.sentence_band[0] > guideline.mechanics.sentence_band[1]) {
    throw new Error(`${slug} sentence band must be ordered`);
  }
  if (approvedExampleCount(files.examples) < 3) {
    throw new Error(`${slug} needs at least three approved examples`);
  }
  return {
    slug,
    guideline,
    criteria: criteria.criteria,
    guidelineBody: guidelineFile.content.trim(),
    criteriaBody: criteriaFile.content.trim(),
    examples: files.examples,
  };
}

export async function loadContentType(profileRoot: string, slug: string): Promise<ContentTypeProfile> {
  const typeRoot = path.join(profileRoot, "types", slug);
  const [guidelineRaw, criteriaRaw, examples] = await Promise.all([
    readFile(path.join(typeRoot, "guideline.md"), "utf8"),
    readFile(path.join(typeRoot, "criteria.md"), "utf8"),
    readFile(path.join(typeRoot, "examples.md"), "utf8"),
  ]);
  return parseContentTypeFiles(slug, { guidelineRaw, criteriaRaw, examples });
}

export async function validateProfile(profileRoot: string): Promise<ContentTypeProfile[]> {
  await Promise.all(requiredBaseFiles.map((file) => readFile(path.join(profileRoot, "base", file), "utf8")));
  const entries = await readdir(path.join(profileRoot, "types"), { withFileTypes: true });
  const slugs = entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name).sort();
  if (!slugs.length) throw new Error("Profile needs at least one content type");
  return Promise.all(slugs.map((slug) => loadContentType(profileRoot, slug)));
}
