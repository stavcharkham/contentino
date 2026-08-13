import { randomBytes } from "node:crypto";

export function slugify(value: string): string {
  return value.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 48) || "piece";
}

export function createPieceId(title: string, now = new Date(), suffix = randomBytes(2).toString("hex")): string {
  return `${now.toISOString().slice(0, 10)}-${slugify(title)}-${suffix}`;
}

export function createShortId(bytes = randomBytes(4)): string {
  return bytes.toString("hex");
}
