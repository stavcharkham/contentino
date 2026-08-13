import { google, type docs_v1, type drive_v3 } from "googleapis";
import type { ContentStorage } from "@/lib/storage";
import type { PresentedReview, ReviewAdapter, ReviewDraft, ReviewFeedback } from "./types";

export type GoogleApis = { docs: docs_v1.Docs; drive: drive_v3.Drive };

export function createGoogleApis(input: {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
}): GoogleApis {
  const auth = new google.auth.OAuth2(input.clientId, input.clientSecret);
  auth.setCredentials({ refresh_token: input.refreshToken });
  return { docs: google.docs({ version: "v1", auth }), drive: google.drive({ version: "v3", auth }) };
}

export class GoogleDocsReviewAdapter implements ReviewAdapter {
  constructor(
    private readonly api: GoogleApis,
    private readonly folderId: string,
    private readonly storage: ContentStorage,
  ) {}

  async presentDraft(draft: ReviewDraft): Promise<PresentedReview> {
    const created = await this.api.docs.documents.create({ requestBody: { title: `Contentino review: ${draft.title}` } });
    const documentId = created.data.documentId;
    if (!documentId) throw new Error("Google Docs did not return a document id");
    await this.api.docs.documents.batchUpdate({ documentId, requestBody: { requests: [{ insertText: { location: { index: 1 }, text: draft.content } }] } });
    await this.api.drive.files.update({ fileId: documentId, addParents: this.folderId, fields: "id,parents" });
    await this.storage.create(
      `content/surfaces/gdocs/${documentId}.json`,
      `${JSON.stringify({ document_id: documentId, draft_path: draft.path, created_at: new Date().toISOString() }, null, 2)}\n`,
      `Map Google Doc ${documentId}`,
    );
    return { surface: "gdocs", externalId: documentId, url: `https://docs.google.com/document/d/${documentId}/edit` };
  }

  async collectFeedback(documentId: string): Promise<ReviewFeedback[]> {
    const response = await this.api.drive.comments.list({
      fileId: documentId,
      fields: "comments(id,content,resolved,quotedFileContent,author(displayName,me))",
      includeDeleted: false,
    });
    return (response.data.comments ?? []).filter((comment) => !comment.resolved && comment.id && comment.content).map((comment) => ({
      externalId: comment.id as string,
      who: comment.author?.displayName ?? "Google Docs reviewer",
      said: comment.content as string,
      quotedText: comment.quotedFileContent?.value ?? undefined,
    }));
  }

  async postRevision(documentId: string, content: string, message: string): Promise<void> {
    const current = await this.api.docs.documents.get({ documentId });
    const endIndex = current.data.body?.content?.at(-1)?.endIndex ?? 1;
    const requests: docs_v1.Schema$Request[] = [];
    if (endIndex > 2) {
      requests.push({ deleteContentRange: { range: { startIndex: 1, endIndex: endIndex - 1 } } });
    }
    requests.push({ insertText: { location: { index: 1 }, text: content } });
    await this.api.docs.documents.batchUpdate({
      documentId,
      requestBody: { requests },
    });
    if (message) {
      await this.api.docs.documents.batchUpdate({
        documentId,
        requestBody: { requests: [{ insertText: { endOfSegmentLocation: {}, text: `\n\nReview update: ${message}` } }] },
      });
    }
  }

  async replaceAndResolve(documentId: string, commentId: string, was: string, now: string): Promise<void> {
    await this.api.docs.documents.batchUpdate({
      documentId,
      requestBody: { requests: [{ replaceAllText: { containsText: { text: was, matchCase: true }, replaceText: now } }] },
    });
    await this.api.drive.replies.create({
      fileId: documentId,
      commentId,
      fields: "id,action,content",
      requestBody: { action: "resolve", content: `Applied: ${now}` },
    });
  }

  async reply(documentId: string, commentId: string, message: string): Promise<void> {
    await this.api.drive.replies.create({ fileId: documentId, commentId, fields: "id,content", requestBody: { content: message } });
  }
}
