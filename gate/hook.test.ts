import { spawn } from "node:child_process";
import path from "node:path";
import { describe, expect, it } from "vitest";

function runHook(input: object): Promise<{ code: number | null; stderr: string }> {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, [path.join(process.cwd(), ".claude/hooks/protect-published.mjs")]);
    let stderr = "";
    child.stderr.on("data", (chunk) => { stderr += String(chunk); });
    child.on("close", (code) => resolve({ code, stderr }));
    child.stdin.end(JSON.stringify(input));
  });
}

describe("Claude publish hook", () => {
  it("blocks direct published writes", async () => {
    const result = await runHook({ tool_input: { file_path: "/repo/content/published/example.md" } });
    expect(result.code).toBe(2);
    expect(result.stderr).toContain("Direct writes");
  });

  it("allows ordinary edits", async () => {
    expect((await runHook({ tool_input: { file_path: "/repo/profile/base/voice.md" } })).code).toBe(0);
  });
});
