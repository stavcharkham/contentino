import { z } from "zod";
import { parseMarkdown, renderMarkdown } from "@/lib/artifacts";
import { createShortId, slugify } from "@/lib/ids";
import { guidelineProposalSchema, type GuidelineProposal } from "@/lib/schemas";
import type { StorageChange } from "@/lib/storage";
import { parseCorrection, renderCorrection } from "./review";
import type { WorkflowContext } from "./common";

const clusterOutput = z.object({
  groups: z.array(z.object({ correction_ids: z.array(z.string()), rule: z.string().min(1) })),
});

export async function clusterCorrections(context: WorkflowContext): Promise<GuidelineProposal[]> {
  const files = await context.storage.list("content/corrections");
  const corrections = files.map((file) => parseCorrection(file.content)).filter((correction) => correction.status === "open");
  const buckets = new Map<string, typeof corrections>();
  for (const correction of corrections) {
    const key = `${correction.content_type}:${correction.criterion}`;
    buckets.set(key, [...(buckets.get(key) ?? []), correction]);
  }
  const proposals: GuidelineProposal[] = [];
  for (const candidates of buckets.values()) {
    if (candidates.length < 4) continue;
    const call = await context.models.complete({
      job: "clustering",
      system: "Group only corrections that express the same reusable rule. Do not combine merely adjacent feedback.",
      prompt: candidates.map((correction) => `${correction.id}: ${correction.said}\nWas: ${correction.was}\nNow: ${correction.now}`).join("\n\n"),
      schema: clusterOutput,
      maxTokens: 900,
    });
    for (const group of call.value.groups.filter((candidate) => candidate.correction_ids.length >= 4)) {
      const validIds = group.correction_ids.filter((id) => candidates.some((candidate) => candidate.id === id));
      if (validIds.length < 4) continue;
      const first = candidates.find((candidate) => candidate.id === validIds[0]) as (typeof candidates)[number];
      proposals.push(guidelineProposalSchema.parse({
        id: `guideline-${slugify(first.criterion)}-${createShortId().slice(0, 4)}`,
        created: (context.now?.() ?? new Date()).toISOString(),
        content_type: first.content_type,
        criterion: first.criterion,
        status: "proposed",
        rule: group.rule,
        correction_ids: validIds,
      }));
    }
  }
  if (proposals.length) {
    await context.storage.commit({
      message: `Propose ${proposals.length} learned guideline${proposals.length === 1 ? "" : "s"}`,
      changes: proposals.map((proposal) => ({
        type: "write" as const,
        path: `content/guidelines/${proposal.id}.md`,
        content: renderMarkdown(proposal, `# Proposed guideline\n\n${proposal.rule}`),
        expectedVersion: null,
      })),
    });
  }
  return proposals;
}

export async function approveGuideline(input: {
  storage: WorkflowContext["storage"];
  proposalPath: string;
  approvedBy: string;
  now?: Date;
}): Promise<GuidelineProposal> {
  const proposalFile = await input.storage.read(input.proposalPath);
  if (!proposalFile) throw new Error(`Guideline proposal not found: ${input.proposalPath}`);
  const proposal = parseMarkdown(proposalFile.content, guidelineProposalSchema).metadata;
  if (proposal.status !== "proposed") throw new Error("Only proposed guidelines can be approved");
  const guidelinePath = `profile/types/${proposal.content_type}/guideline.md`;
  const guideline = await input.storage.read(guidelinePath);
  if (!guideline) throw new Error(`Content type guideline not found: ${guidelinePath}`);
  const correctionFiles = await input.storage.list("content/corrections");
  const matching = correctionFiles.map((file) => ({ file, correction: parseCorrection(file.content) }))
    .filter(({ correction }) => proposal.correction_ids.includes(correction.id));
  if (matching.length < 4) throw new Error("An approved guideline still needs four source corrections");
  const approved = guidelineProposalSchema.parse({
    ...proposal,
    status: "approved",
    approved_by: input.approvedBy,
    approved_at: (input.now ?? new Date()).toISOString(),
  });
  const changes: StorageChange[] = [
    {
      type: "write",
      path: guidelinePath,
      content: `${guideline.content.trim()}\n\n## Learned guideline: ${approved.id}\n\n${approved.rule}\n`,
      expectedVersion: guideline.version,
    },
    {
      type: "write",
      path: input.proposalPath,
      content: renderMarkdown(approved, `# Approved guideline\n\n${approved.rule}`),
      expectedVersion: proposalFile.version,
    },
    ...matching.map(({ file, correction }) => ({
      type: "write" as const,
      path: file.path,
      content: renderCorrection({ ...correction, status: "resolved", resolved_by: approved.id }),
      expectedVersion: file.version,
    })),
  ];
  await input.storage.commit({ message: `Approve learned guideline ${approved.id}`, changes });
  return approved;
}
