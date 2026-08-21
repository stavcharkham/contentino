import { createMcpHandler } from "mcp-handler";
import { z } from "zod";
import { readConfig } from "@/lib/config";
import { gateApproveBrief, gateAuditContent, gateSubmitBrief, gateSubmitDraft, recordGateFailure } from "@/workflows/gate";

export const maxDuration = 300;

// The gate as a remote MCP server, so claude.ai and the desktop app reach it as
// a connector instead of shelling out to curl (blocked in claude.ai's sandbox).
// The shared password rides in the connector URL path.

type ToolResult = { content: Array<{ type: "text"; text: string }>; isError?: boolean };

async function guarded(action: string, run: () => Promise<Record<string, unknown>>): Promise<ToolResult> {
  try {
    return { content: [{ type: "text", text: JSON.stringify(await run(), null, 2) }] };
  } catch (error) {
    await recordGateFailure(action, error);
    const message = error instanceof Error ? error.message : String(error);
    return { content: [{ type: "text", text: `The gate could not finish this run: ${message}` }], isError: true };
  }
}

const handler = createMcpHandler(
  (server) => {
    server.registerTool(
      "submit_draft",
      {
        description: "Submit a drafted piece of Lemonade content to the Contentino production gate. The gate scores it against the brand rubric, applies the compliance veto, stores it, and writes the ledger row. Returns the real score, outcome and per-criterion reasons. Every draft must go through this - never present a hand-made score.",
        inputSchema: z.object({
          content_type: z.string().describe("The content type slug, e.g. product-microcopy or external-comms"),
          body: z.string().describe("The full markdown body of the draft"),
          triggered_by: z.string().describe("Name of the person who asked for this content"),
          brief_id: z.string().optional().describe("The approved brief id, required for external-comms"),
          request: z.string().optional().describe("The user's original request, verbatim, so the gate can flag requests that demand prohibited claims"),
        }),
      },
      (args) => guarded("submit_draft", () => gateSubmitDraft(args)),
    );
    server.registerTool(
      "audit_content",
      {
        description: "Audit existing content - a published Lemonade post, copy extracted from a product screenshot, or someone else's writing - against the Lemonade voice rubric. Scores voice criteria only; brief-tracing criteria do not apply because audited content never had a brief. Never publishes or blocks anything. Returns the score, per-criterion reasons and a compliance flag.",
        inputSchema: z.object({
          content_type: z.string().describe("The closest content type slug: external-comms for posts and announcements, product-microcopy for UI copy"),
          body: z.string().describe("The content to audit, verbatim. For screenshots, the extracted copy"),
          source: z.string().describe("Where the content came from, e.g. lemonade.com blog, app screenshot, competitor site"),
          triggered_by: z.string().describe("Name of the person asking for the audit"),
        }),
      },
      (args) => guarded("audit_content", () => gateAuditContent(args)),
    );
    server.registerTool(
      "submit_brief",
      {
        description: "Store a written Contentino brief so it can be approved and drafted from. Returns the brief id and path.",
        inputSchema: z.object({
          headline: z.string().describe("The brief's headline"),
          body: z.string().describe("The full brief markdown: story, why now, what changed, quote, Not saying, sources"),
          source: z.string().describe("Where the material came from: a URL or a description"),
          source_id: z.string().describe("A stable id for the source, used for idempotency"),
        }),
      },
      (args) => guarded("submit_brief", () => gateSubmitBrief(args)),
    );
    server.registerTool(
      "approve_brief",
      {
        description: "Record a named person's approval of a stored brief. Only approved briefs can become external content.",
        inputSchema: z.object({
          brief_path: z.string().describe("The brief_path returned by submit_brief"),
          approved_by: z.string().describe("The name of the person approving"),
        }),
      },
      (args) => guarded("approve_brief", () => gateApproveBrief(args)),
    );
  },
  { serverInfo: { name: "contentino-gate", version: "1.0.0" } },
);

async function handle(request: Request, context: { params: Promise<{ secret: string }> }): Promise<Response> {
  const { secret } = await context.params;
  const config = readConfig();
  if (!config.DASHBOARD_PASSWORD) return Response.json({ error: "The gate is not configured" }, { status: 503 });
  if (secret !== config.DASHBOARD_PASSWORD) return Response.json({ error: "Wrong gate address" }, { status: 401 });
  return handler(request);
}

export { handle as GET, handle as POST, handle as DELETE };
