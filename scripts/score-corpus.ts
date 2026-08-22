import { readFile, writeFile } from "node:fs/promises";
import { loadBaseProfile, loadContentTypeFromStorage } from "@/lib/profile-storage";
import type { Scorecard } from "@/lib/schemas";
import { contentHash } from "@/lib/storage";
import { scoreDraft } from "@/gate/score";
import { createRuntime } from "@/workflows/runtime";

type Item = { id: string; content_type: string; source: string; note: string; text: string };

// The scorecard schema requires a dated piece id, so give each corpus item a synthetic one.
function pieceId(item: Item): string {
  const date = new Date().toISOString().slice(0, 10);
  const suffix = contentHash(item.id).slice(0, 4);
  return `${date}-${item.id.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${suffix}`;
}

// Scores a corpus of external texts against the Lemonade profile without touching
// the ledger or storage. Used to check that the gate discriminates off-brand writing.
async function main() {
  const [corpusPath, outPath, mode] = process.argv.slice(2);
  // "relaxed" lifts the character and sentence-length limits so a mechanical block does not
  // hide the voice criteria. Compliance and the model criteria are unchanged.
  const relaxed = mode === "relaxed";
  if (!corpusPath || !outPath) throw new Error("Usage: score-corpus <corpus.json> <out.json>");
  const items: Item[] = JSON.parse(await readFile(corpusPath, "utf8"));
  const context = await createRuntime();
  const baseProfile = await loadBaseProfile(context.storage);
  const types = new Map<string, Awaited<ReturnType<typeof loadContentTypeFromStorage>>>();
  const results: Array<{ item: Item; scorecard: Scorecard }> = [];

  for (const item of items) {
    if (!types.has(item.content_type)) {
      const type = await loadContentTypeFromStorage(context.storage, item.content_type);
      types.set(
        item.content_type,
        relaxed
          ? { ...type, guideline: { ...type.guideline, mechanics: { max_chars: 100000, sentence_band: [1, 1000], em_dash_limit: 1000 } } }
          : type,
      );
    }
    // The judge occasionally returns a malformed score; retry rather than lose the run.
    let scorecard: Scorecard | undefined;
    for (let tries = 0; tries < 3 && !scorecard; tries += 1) {
      try {
        scorecard = await scoreDraft({
          pieceId: pieceId(item),
          content: item.text,
          type: types.get(item.content_type)!,
          baseProfile,
          attempt: 1,
          models: context.models,
        });
      } catch (error) {
        if (tries === 2) throw error;
        console.log(`${item.id} retry after ${(error as Error).name}`);
      }
    }
    if (!scorecard) throw new Error(`No scorecard for ${item.id}`);
    results.push({ item, scorecard });
    const criteria = scorecard.criteria.map((c) => `${c.id}=${c.score}`).join(" ");
    console.log(
      `${item.id} score=${scorecard.score} stakes=${scorecard.stakes} outcome=${scorecard.outcome} ` +
        `compliance=${scorecard.compliance.pass ? "pass" : "FAIL"} [${criteria}] $${scorecard.cost_usd}`,
    );
  }

  const total = results.reduce((sum, row) => sum + row.scorecard.cost_usd, 0);
  console.log(`\nItems: ${results.length}  total cost: $${total.toFixed(4)}`);
  await writeFile(outPath, JSON.stringify(results, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
