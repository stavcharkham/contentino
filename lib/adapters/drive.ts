import type { GoogleApis } from "./google";

export type DriveTranscript = { id: string; name: string; mimeType: string; source: string };

export class GoogleDriveSource {
  constructor(private readonly api: GoogleApis, private readonly folderId: string) {}

  async listTranscripts(): Promise<DriveTranscript[]> {
    const transcripts: DriveTranscript[] = [];
    let pageToken: string | undefined;
    do {
      const response = await this.api.drive.files.list({
        q: `'${this.folderId}' in parents and trashed = false`,
        fields: "nextPageToken,files(id,name,mimeType,webViewLink)",
        pageToken,
        orderBy: "createdTime asc",
      });
      for (const file of response.data.files ?? []) {
        if (file.name?.startsWith("Contentino review:")) continue;
        if (file.id && file.name && file.mimeType) transcripts.push({
          id: file.id,
          name: file.name,
          mimeType: file.mimeType,
          source: file.webViewLink ?? `drive://${file.id}`,
        });
      }
      pageToken = response.data.nextPageToken ?? undefined;
    } while (pageToken);
    return transcripts;
  }

  async readTranscript(transcript: DriveTranscript): Promise<string> {
    if (transcript.mimeType === "application/vnd.google-apps.document") {
      const response = await this.api.drive.files.export({ fileId: transcript.id, mimeType: "text/plain" }, { responseType: "text" });
      return String(response.data);
    }
    const response = await this.api.drive.files.get({ fileId: transcript.id, alt: "media" }, { responseType: "text" });
    return String(response.data);
  }
}
