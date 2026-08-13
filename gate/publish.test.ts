import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { LocalStorage, contentHash } from "@/lib/storage";
import type { Scorecard } from "@/lib/schemas";
import { publishScoredDraft } from "./publish";

function scorecard(content: string, outcome: Scorecard["outcome"] = "auto-published"): Scorecard {
  return {
    piece_id: "2026-08-14-finish-quote-a3f2",
    source_hash: contentHash(content),
    scored_at: "2026-08-14T09:00:00.000Z",
    content_type: "product-microcopy",
    stakes: "low",
    ceiling: "low",
    criteria: [{ id: "mechanics", name: "Mechanics", score: 2, reason: "clean" }],
    score: 10,
    compliance: { pass: true, reason: "safe" },
    attempt: 1,
    outcome,
    usage: [],
    cost_usd: 0,
  };
}

describe("publish gate", () => {
  it("moves an exact passing draft and scorecard together", async () => {
    const root = await mkdtemp(path.join(tmpdir(), "contentino-publish-"));
    const storage = new LocalStorage(root);
    const draftPath = "content/drafts/finish.md";
    const content = "FINISH QUOTE";
    await storage.create(draftPath, content);
    await storage.create("content/drafts/finish.score.json", `${JSON.stringify(scorecard(content))}\n`);
    expect(await publishScoredDraft(storage, draftPath)).toBe("content/published/finish.md");
    expect(await storage.read(draftPath)).toBeNull();
    expect((await storage.read("content/published/finish.md"))?.content).toBe(content);
  });

  it("refuses stale and review-only scorecards", async () => {
    const root = await mkdtemp(path.join(tmpdir(), "contentino-publish-"));
    const storage = new LocalStorage(root);
    await storage.create("content/drafts/stale.md", "changed");
    await storage.create("content/drafts/stale.score.json", JSON.stringify(scorecard("original")));
    await expect(publishScoredDraft(storage, "content/drafts/stale.md")).rejects.toThrow("stale");
    await storage.create("content/drafts/review.md", "review me");
    await storage.create("content/drafts/review.score.json", JSON.stringify(scorecard("review me", "reviewed")));
    await expect(publishScoredDraft(storage, "content/drafts/review.md")).rejects.toThrow("not eligible");
  });
});
