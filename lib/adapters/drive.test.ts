import { describe, expect, it, vi } from "vitest";
import { GoogleDriveSource } from "./drive";
import type { GoogleApis } from "./google";

describe("Google Drive transcript source", () => {
  it("does not turn generated review documents back into briefs", async () => {
    const api = {
      drive: { files: { list: vi.fn().mockResolvedValue({ data: { files: [
        { id: "transcript", name: "Customer call", mimeType: "text/plain", webViewLink: "drive://transcript" },
        { id: "review", name: "Contentino review: External draft", mimeType: "application/vnd.google-apps.document" },
      ] } }) } },
    } as unknown as GoogleApis;
    const source = new GoogleDriveSource(api, "folder");
    expect(await source.listTranscripts()).toEqual([{
      id: "transcript",
      name: "Customer call",
      mimeType: "text/plain",
      source: "drive://transcript",
    }]);
  });
});
