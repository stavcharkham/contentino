import { contentHash, StorageConflictError, type ContentStorage } from "./storage";

export async function runOnce<T>(
  storage: ContentStorage,
  namespace: string,
  externalId: string,
  operation: () => Promise<T>,
): Promise<{ duplicate: true } | { duplicate: false; value: T }> {
  const safeId = contentHash(externalId).slice(0, 16);
  const markerPath = `content/events/${namespace}-${safeId}.json`;
  let marker;
  try {
    marker = await storage.create(markerPath, `${JSON.stringify({ external_id: externalId, status: "processing", claimed_at: new Date().toISOString() }, null, 2)}\n`, `Claim ${namespace} event ${safeId}`);
  } catch (error) {
    if (error instanceof StorageConflictError) return { duplicate: true };
    throw error;
  }
  try {
    const value = await operation();
    await storage.update(markerPath, `${JSON.stringify({ external_id: externalId, status: "complete", completed_at: new Date().toISOString() }, null, 2)}\n`, marker.version, `Complete ${namespace} event ${safeId}`);
    return { duplicate: false, value };
  } catch (error) {
    await storage.commit({ message: `Release failed ${namespace} event ${safeId}`, changes: [{ type: "delete", path: markerPath, expectedVersion: marker.version }] });
    throw error;
  }
}
