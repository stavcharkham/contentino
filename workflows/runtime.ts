import { parseLedger } from "@/lib/ledger";
import { AnthropicGateway, BudgetGuard } from "@/lib/models";
import { readConfig } from "@/lib/config";
import { createStorage } from "@/lib/storage";
import type { WorkflowContext } from "./common";

export async function createRuntime(): Promise<WorkflowContext> {
  const config = readConfig();
  const storage = createStorage(config);
  const ledger = await storage.read("metrics/ledger.csv");
  const spent = ledger ? parseLedger(ledger.content).reduce((sum, row) => sum + row.api_cost_usd, 0) : 0;
  const budget = new BudgetGuard(spent, config.CONTENTINO_MAX_BUDGET_USD);
  return { storage, models: new AnthropicGateway(config, budget) };
}
