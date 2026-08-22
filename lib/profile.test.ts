import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { loadContentType, validateProfile } from "./profile";

const profileRoot = path.join(process.cwd(), "profile");

describe("profile", () => {
  it("loads both active content types", async () => {
    const types = await validateProfile(profileRoot);
    expect(types.map((type) => type.slug)).toEqual(["external-comms", "founder-essays", "product-microcopy"]);
    expect(types.every((type) => type.guideline.status === "active")).toBe(true);
  });

  it("keeps external communications out of auto-publish", async () => {
    const type = await loadContentType(profileRoot, "external-comms");
    expect(type.guideline.max_autopublish_stakes).toBe("none");
  });

  it("marks provenance criteria as pipeline-only and voice criteria as auditable", async () => {
    const comms = await loadContentType(profileRoot, "external-comms");
    const auditFlags = Object.fromEntries(comms.criteria.map((criterion) => [criterion.id, criterion.audit]));
    expect(auditFlags).toEqual({
      "direct-address": true,
      "claim-sourced": false,
      "why-now": false,
      "quote-fidelity": false,
    });
    const microcopy = await loadContentType(profileRoot, "product-microcopy");
    expect(microcopy.criteria.every((criterion) => criterion.audit)).toBe(true);
  });

  it("rejects a content type with too few approved examples", async () => {
    const root = await mkdtemp(path.join(tmpdir(), "contentino-profile-"));
    const typeRoot = path.join(root, "types", "test-type");
    await mkdir(typeRoot, { recursive: true });
    await writeFile(path.join(typeRoot, "guideline.md"), `---\ncontent_type: test-type\nstatus: draft\nowner: test\nmax_autopublish_stakes: none\nmechanics:\n  max_chars: 10\n  sentence_band: [1, 2]\n---\n# Test`);
    await writeFile(path.join(typeRoot, "criteria.md"), `---\ncontent_type: test-type\ncriteria:\n  - id: useful\n    name: Useful\n    question: Is it useful?\n---\n# Test`);
    await writeFile(path.join(typeRoot, "examples.md"), "# Examples\n\n**Approved:** true");
    await expect(loadContentType(root, "test-type")).rejects.toThrow(
      "test-type needs at least three approved examples",
    );
  });
});
