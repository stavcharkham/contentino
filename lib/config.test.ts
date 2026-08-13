import { describe, expect, it } from "vitest";
import { readConfig } from "./config";

describe("readConfig", () => {
  it("uses safe local defaults", () => {
    const config = readConfig({});
    expect(config.CONTENTINO_STORAGE).toBe("local");
    expect(config.CONTENTINO_MAX_BUDGET_USD).toBe(50);
  });

  it("fails early when hosted storage is incomplete", () => {
    expect(() => readConfig({ CONTENTINO_STORAGE: "github" })).toThrow(
      "GitHub storage requires GITHUB_TOKEN, GITHUB_OWNER",
    );
  });

  it("fails early when Google OAuth is incomplete", () => {
    expect(() => readConfig({ GOOGLE_CLIENT_ID: "client-id" })).toThrow(
      "Google OAuth requires GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN, GOOGLE_DRIVE_FOLDER_ID",
    );
  });

  it("accepts a complete Google OAuth configuration", () => {
    const config = readConfig({
      GOOGLE_CLIENT_ID: "client-id",
      GOOGLE_CLIENT_SECRET: "client-secret",
      GOOGLE_REFRESH_TOKEN: "refresh-token",
      GOOGLE_DRIVE_FOLDER_ID: "folder-id",
    });
    expect(config.GOOGLE_REFRESH_TOKEN).toBe("refresh-token");
  });
});
