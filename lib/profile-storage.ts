import { parseContentTypeFiles, type ContentTypeProfile } from "./profile";
import type { ContentStorage } from "./storage";

const baseFiles = ["voice.md", "stakes.md", "mechanics.md", "vocabulary.md", "compliance.md", "audience.md"];

async function requireFile(storage: ContentStorage, filePath: string): Promise<string> {
  const file = await storage.read(filePath);
  if (!file) throw new Error(`Required profile file is missing: ${filePath}`);
  return file.content;
}

export async function loadBaseProfile(storage: ContentStorage): Promise<string> {
  return (await Promise.all(baseFiles.map(async (file) => {
    const content = await requireFile(storage, `profile/base/${file}`);
    return `<!-- ${file} -->\n${content}`;
  }))).join("\n\n");
}

export async function loadContentTypeFromStorage(
  storage: ContentStorage,
  slug: string,
): Promise<ContentTypeProfile> {
  const root = `profile/types/${slug}`;
  const [guidelineRaw, criteriaRaw, examples] = await Promise.all([
    requireFile(storage, `${root}/guideline.md`),
    requireFile(storage, `${root}/criteria.md`),
    requireFile(storage, `${root}/examples.md`),
  ]);
  return parseContentTypeFiles(slug, { guidelineRaw, criteriaRaw, examples });
}
