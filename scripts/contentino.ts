import { readFile } from "node:fs/promises";
import { parseMarkdown } from "@/lib/artifacts";
import { readConfig } from "@/lib/config";
import { createStorage } from "@/lib/storage";
import { draftSchema } from "@/lib/schemas";
import { publishScoredDraft, recordScoredDraft } from "@/gate/publish";
import { makeLedgerRow, scoreArtifact } from "@/workflows/common";
import { approveBrief, makeBrief } from "@/workflows/brief";
import { auditContent } from "@/workflows/audit";
import { addContentType, validateContentType } from "@/workflows/content-type";
import { writeExternalComms, writeMicrocopy } from "@/workflows/generate";
import { approveGuideline, clusterCorrections } from "@/workflows/learning";
import { applyReview } from "@/workflows/review";
import { createRuntime } from "@/workflows/runtime";

function argumentsMap(args: string[]): { command: string; flags: Record<string, string> } {
  const [command = "", ...rest] = args;
  const flags: Record<string, string> = {};
  for (let index = 0; index < rest.length; index += 2) {
    const key = rest[index];
    const value = rest[index + 1];
    if (!key?.startsWith("--") || value === undefined) throw new Error(`Expected --name value, received ${key ?? "nothing"}`);
    flags[key.slice(2)] = value;
  }
  return { command, flags };
}

function required(flags: Record<string, string>, key: string): string {
  if (!flags[key]) throw new Error(`--${key} is required`);
  return flags[key];
}

async function main() {
  const { command, flags } = argumentsMap(process.argv.slice(2));
  if (command === "publish") {
    const storage = createStorage(readConfig());
    return { path: await publishScoredDraft(storage, required(flags, "draft")) };
  }
  if (command === "approve-brief") {
    const storage = createStorage(readConfig());
    return approveBrief({ storage, path: required(flags, "path"), approvedBy: required(flags, "by") });
  }
  if (command === "add-content-type") {
    const storage = createStorage(readConfig());
    return { path: await addContentType(storage, JSON.parse(await readFile(required(flags, "spec"), "utf8"))) };
  }
  if (command === "approve-guideline") {
    const storage = createStorage(readConfig());
    return approveGuideline({ storage, proposalPath: required(flags, "path"), approvedBy: required(flags, "by") });
  }
  const context = await createRuntime();
  if (command === "make-brief") {
    const source = required(flags, "source");
    return makeBrief({ context, transcript: await readFile(source, "utf8"), source, sourceId: flags["source-id"] ?? source });
  }
  if (command === "write-microcopy") {
    return writeMicrocopy({ context, request: required(flags, "request"), triggeredBy: flags.by ?? "cli", trigger: "cli" });
  }
  if (command === "write-external") {
    return writeExternalComms({ context, briefPath: required(flags, "brief"), triggeredBy: flags.by ?? "cli", trigger: "cli" });
  }
  if (command === "score") {
    const draftPath = required(flags, "draft");
    const file = await context.storage.read(draftPath);
    if (!file) throw new Error(`Draft not found: ${draftPath}`);
    const draft = parseMarkdown(file.content, draftSchema);
    const scorecard = await scoreArtifact({ context, pieceId: draft.metadata.id, contentType: draft.metadata.content_type, artifact: file.content, scoringText: draft.body, attempt: draft.metadata.attempt });
    const ledgerRow = await makeLedgerRow({ storage: context.storage, pieceId: draft.metadata.id, created: draft.metadata.created, skill: "score", contentType: draft.metadata.content_type, triggeredBy: flags.by ?? "cli", trigger: "cli", scorecard });
    await recordScoredDraft({ storage: context.storage, draftPath, content: file.content, scorecard, ledgerRow });
    return scorecard;
  }
  if (command === "review") {
    return applyReview({
      context,
      draftPath: required(flags, "draft"),
      surface: (flags.surface ?? "claude") as "claude" | "slack" | "gdocs",
      who: required(flags, "who"),
      criterion: required(flags, "criterion"),
      was: required(flags, "was"),
      now: required(flags, "now"),
      said: required(flags, "said"),
    });
  }
  if (command === "audit") {
    const source = required(flags, "source");
    return auditContent({
      context,
      contentType: required(flags, "type"),
      body: await readFile(required(flags, "body"), "utf8"),
      source,
      triggeredBy: flags.by ?? "cli",
    });
  }
  if (command === "cluster-corrections") return clusterCorrections(context);
  if (command === "validate-type") return validateContentType(context, required(flags, "type"));
  throw new Error(`Unknown Contentino command: ${command || "none"}`);
}

main().then((result) => process.stdout.write(`${JSON.stringify(result, null, 2)}\n`)).catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
});
