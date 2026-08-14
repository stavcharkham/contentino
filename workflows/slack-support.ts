import { readConfig } from "@/lib/config";
import { createGoogleApis } from "@/lib/adapters/google";
import { GoogleDriveSource } from "@/lib/adapters/drive";
import { announceBriefs, syncDriveTranscripts, type SlackSurface } from "./surfaces";
import type { WorkflowContext } from "./common";

export function buildDriveSync(context: WorkflowContext, slack: Pick<SlackSurface, "postBriefForApproval">): (() => Promise<string[]>) | undefined {
  const config = readConfig();
  if (!config.GOOGLE_CLIENT_ID || !config.GOOGLE_CLIENT_SECRET || !config.GOOGLE_REFRESH_TOKEN || !config.GOOGLE_DRIVE_FOLDER_ID) return undefined;
  return async () => {
    const api = createGoogleApis({
      clientId: config.GOOGLE_CLIENT_ID as string,
      clientSecret: config.GOOGLE_CLIENT_SECRET as string,
      refreshToken: config.GOOGLE_REFRESH_TOKEN as string,
    });
    const created = await syncDriveTranscripts({ context, drive: new GoogleDriveSource(api, config.GOOGLE_DRIVE_FOLDER_ID as string) });
    await announceBriefs({ context, slack, briefPaths: created });
    return created;
  };
}

export async function recordSurfaceFailure(context: WorkflowContext, surface: string, id: string, error: unknown): Promise<void> {
  const detail = error instanceof Error ? `${error.message}\n${error.stack ?? ""}` : String(error);
  const path = `content/events/failures/${surface}-${id.replaceAll(".", "-")}.json`;
  await context.storage.create(path, `${JSON.stringify({ surface, id, failed_at: new Date().toISOString(), error: detail.slice(0, 4000) }, null, 2)}\n`, `Record ${surface} failure ${id}`).catch(() => undefined);
}
