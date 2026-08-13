import { Dashboard } from "./dashboard";
import { readConfig } from "@/lib/config";
import { buildDashboardData } from "@/lib/dashboard";
import { createStorage } from "@/lib/storage";

export const dynamic = "force-dynamic";

export default async function Home() {
  const data = await buildDashboardData(createStorage(readConfig()));
  return <Dashboard data={data} />;
}
