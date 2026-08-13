import matter from "gray-matter";
import type { z } from "zod";

export function renderMarkdown(metadata: object, body: string): string {
  const cleanMetadata = JSON.parse(JSON.stringify(metadata)) as object;
  return matter.stringify(`${body.trim()}\n`, cleanMetadata);
}

export function parseMarkdown<T>(source: string, schema: z.ZodType<T>): { metadata: T; body: string } {
  const parsed = matter(source);
  return { metadata: schema.parse(parsed.data), body: parsed.content.trim() };
}
