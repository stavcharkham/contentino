import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import type { z } from "zod";
import type { ContentinoConfig } from "./config";
import type { Scorecard } from "./schemas";

export type ModelJob = "brief" | "generation" | "stakes" | "judge" | "compliance" | "type-criteria" | "clustering";

export type ModelCall<T> = {
  value: T;
  usage: Scorecard["usage"][number];
};

export type ModelRequest<T> = {
  job: ModelJob;
  system: string;
  prompt: string;
  schema: z.ZodType<T>;
  maxTokens?: number;
};

export interface ModelGateway {
  complete<T>(request: ModelRequest<T>): Promise<ModelCall<T>>;
}

export class BudgetExceededError extends Error {}

export class BudgetGuard {
  private reserved = 0;

  constructor(private spent: number, readonly maximum: number) {}

  reserve(estimatedCost: number): () => void {
    if (this.spent + this.reserved + estimatedCost > this.maximum) {
      throw new BudgetExceededError(
        `Model call would exceed the $${this.maximum.toFixed(2)} budget ($${this.spent.toFixed(4)} already spent)`,
      );
    }
    this.reserved += estimatedCost;
    return () => { this.reserved -= estimatedCost; };
  }

  record(actualCost: number): void {
    this.spent += actualCost;
  }

  get spentUsd(): number { return this.spent; }
  get remainingUsd(): number { return Math.max(0, this.maximum - this.spent - this.reserved); }
}

type Rates = { input: number; output: number };

export function modelRates(model: string): Rates {
  if (model.includes("opus-5")) return { input: 5, output: 25 };
  if (model.includes("sonnet-5")) return { input: 2, output: 10 };
  if (model.includes("haiku-4-5")) return { input: 1, output: 5 };
  throw new Error(`No price configured for model ${model}`);
}

export function calculateModelCost(
  model: string,
  usage: { input_tokens: number; output_tokens: number; cache_read_tokens?: number; cache_write_tokens?: number },
): number {
  const rates = modelRates(model);
  const cost = (
    usage.input_tokens * rates.input
    + usage.output_tokens * rates.output
    + (usage.cache_read_tokens ?? 0) * rates.input * 0.1
    + (usage.cache_write_tokens ?? 0) * rates.input * 1.25
  ) / 1_000_000;
  return Number(cost.toFixed(6));
}

function modelForJob(config: ContentinoConfig, job: ModelJob): string {
  if (job === "brief") return config.CONTENTINO_MODEL_BRIEF;
  if (job === "generation" || job === "compliance" || job === "type-criteria" || job === "clustering") {
    return job === "compliance" ? config.CONTENTINO_MODEL_COMPLIANCE : config.CONTENTINO_MODEL_GENERATION;
  }
  return config.CONTENTINO_MODEL_JUDGE;
}

export class AnthropicGateway implements ModelGateway {
  private readonly client: Anthropic;

  constructor(
    private readonly config: ContentinoConfig,
    private readonly budget: BudgetGuard,
    client?: Anthropic,
  ) {
    if (!client && !config.ANTHROPIC_API_KEY) throw new Error("ANTHROPIC_API_KEY is required for model calls");
    this.client = client ?? new Anthropic({ apiKey: config.ANTHROPIC_API_KEY });
  }

  async complete<T>(request: ModelRequest<T>): Promise<ModelCall<T>> {
    const model = modelForJob(this.config, request.job);
    const maxTokens = request.maxTokens ?? 1200;
    const estimatedInput = Math.ceil((request.system.length + request.prompt.length) / 3);
    const estimatedCost = calculateModelCost(model, { input_tokens: estimatedInput, output_tokens: maxTokens });
    const usage = {
      model,
      input_tokens: 0,
      output_tokens: 0,
      cache_read_tokens: 0,
      cache_write_tokens: 0,
      cost_usd: 0,
    };
    let lastParseError = "unknown structured-output error";
    for (let attempt = 1; attempt <= 2; attempt += 1) {
      const release = this.budget.reserve(estimatedCost);
      try {
        const message = await this.client.messages.create({
          model,
          max_tokens: maxTokens,
          thinking: { type: "disabled" },
          cache_control: { type: "ephemeral" },
          system: [{ type: "text", text: request.system, cache_control: { type: "ephemeral" } }],
          messages: [{ role: "user", content: request.prompt }],
          output_config: { format: zodOutputFormat(request.schema) },
        });
        const callUsage = {
          model,
          input_tokens: message.usage.input_tokens,
          output_tokens: message.usage.output_tokens,
          cache_read_tokens: message.usage.cache_read_input_tokens ?? 0,
          cache_write_tokens: message.usage.cache_creation_input_tokens ?? 0,
          cost_usd: 0,
        };
        callUsage.cost_usd = calculateModelCost(model, callUsage);
        this.budget.record(callUsage.cost_usd);
        usage.input_tokens += callUsage.input_tokens;
        usage.output_tokens += callUsage.output_tokens;
        usage.cache_read_tokens += callUsage.cache_read_tokens;
        usage.cache_write_tokens += callUsage.cache_write_tokens;
        usage.cost_usd = Number((usage.cost_usd + callUsage.cost_usd).toFixed(6));
        const output = message.content.filter((block) => block.type === "text").map((block) => block.text).join("");
        try {
          return { value: request.schema.parse(JSON.parse(output)), usage };
        } catch (error) {
          lastParseError = error instanceof Error ? error.message : String(error);
        }
      } finally {
        release();
      }
    }
    throw new Error(`Model ${model} returned invalid structured output for ${request.job} twice: ${lastParseError}`);
  }
}
