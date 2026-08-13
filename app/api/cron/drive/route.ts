import { createGoogleApis, GoogleDocsReviewAdapter } from "@/lib/adapters/google";
import { GoogleDriveSource } from "@/lib/adapters/drive";
import { readConfig } from "@/lib/config";
import { createRuntime } from "@/workflows/runtime";
import { syncDriveTranscripts, syncGoogleDocReviews } from "@/workflows/surfaces";

export async function GET(request: Request): Promise<Response> {
  const config = readConfig();
  if (!config.CRON_SECRET || request.headers.get("authorization") !== `Bearer ${config.CRON_SECRET}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!config.GOOGLE_CLIENT_EMAIL || !config.GOOGLE_PRIVATE_KEY || !config.GOOGLE_DRIVE_FOLDER_ID) {
    return Response.json({ error: "Google Drive is not configured" }, { status: 503 });
  }
  const context = await createRuntime();
  const api = createGoogleApis({ clientEmail: config.GOOGLE_CLIENT_EMAIL, privateKey: config.GOOGLE_PRIVATE_KEY });
  const created = await syncDriveTranscripts({ context, drive: new GoogleDriveSource(api, config.GOOGLE_DRIVE_FOLDER_ID) });
  const reviews = await syncGoogleDocReviews({ context, docs: new GoogleDocsReviewAdapter(api, config.GOOGLE_DRIVE_FOLDER_ID, context.storage) });
  return Response.json({ briefs_created: created, reviews });
}
