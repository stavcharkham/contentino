let input = "";
for await (const chunk of process.stdin) input += chunk;

const event = JSON.parse(input || "{}");
const target = `${event.tool_input?.file_path ?? ""}\n${event.tool_input?.command ?? ""}`;

if (target.includes("content/published")) {
  process.stderr.write("Direct writes to content/published are blocked. Use `npm run contentino -- publish --draft <path>` so the score and source hash are verified.\n");
  process.exit(2);
}
