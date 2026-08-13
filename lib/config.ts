import { z } from "zod";

const optionalSecret = z.string().min(1).optional();

export const configSchema = z.object({
  ANTHROPIC_API_KEY: optionalSecret,
  CONTENTINO_MODEL_BRIEF: z.string().min(1).default("claude-opus-5"),
  CONTENTINO_MODEL_GENERATION: z.string().min(1).default("claude-sonnet-5"),
  CONTENTINO_MODEL_JUDGE: z.string().min(1).default("claude-haiku-4-5"),
  CONTENTINO_MODEL_COMPLIANCE: z.string().min(1).default("claude-sonnet-5"),
  CONTENTINO_MAX_BUDGET_USD: z.coerce.number().positive().default(50),
  CONTENTINO_STORAGE: z.enum(["local", "github"]).default("local"),
  CONTENTINO_ROOT: z.string().min(1).default(process.cwd()),
  GITHUB_TOKEN: optionalSecret,
  GITHUB_OWNER: optionalSecret,
  GITHUB_REPO: z.string().min(1).default("contentino"),
  GITHUB_BRANCH: z.string().min(1).default("main"),
  SLACK_BOT_TOKEN: optionalSecret,
  SLACK_SIGNING_SECRET: optionalSecret,
  SLACK_CHANNEL_ID: optionalSecret,
  GOOGLE_CLIENT_EMAIL: optionalSecret,
  GOOGLE_PRIVATE_KEY: optionalSecret,
  GOOGLE_DRIVE_FOLDER_ID: optionalSecret,
  CRON_SECRET: optionalSecret,
});

export type ContentinoConfig = z.infer<typeof configSchema>;

export function readConfig(
  source: Record<string, string | undefined> = process.env,
): ContentinoConfig {
  const config = configSchema.parse(source);
  if (config.CONTENTINO_STORAGE === "github") {
    const missing = ["GITHUB_TOKEN", "GITHUB_OWNER"].filter(
      (key) => !config[key as keyof ContentinoConfig],
    );
    if (missing.length) throw new Error(`GitHub storage requires ${missing.join(", ")}`);
  }
  return config;
}
