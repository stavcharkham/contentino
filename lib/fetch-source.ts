const MAX_SOURCE_CHARS = 40000;

export function extractUrls(slackText: string): string[] {
  const urls = new Set<string>();
  for (const match of slackText.matchAll(/<(https?:\/\/[^>|\s]+)(?:\|[^>]*)?>/g)) urls.add(match[1]);
  for (const match of slackText.replace(/<[^>]*>/g, " ").matchAll(/https?:\/\/[^\s<>()"']+/g)) urls.add(match[0]);
  return [...urls];
}

// Fetch a linked source and reduce it to readable text. Returns null when the
// page cannot be fetched or carries no usable text, so the caller can ask the
// person for the material instead of briefing from nothing.
export async function fetchSourceText(url: string): Promise<string | null> {
  try {
    const response = await fetch(url, {
      headers: { "user-agent": "Mozilla/5.0 (compatible; Contentino/1.0)", accept: "text/html,application/xhtml+xml,text/plain" },
      signal: AbortSignal.timeout(15000),
      redirect: "follow",
    });
    if (!response.ok) return null;
    const raw = await response.text();
    const text = raw
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<(?:br|\/p|\/div|\/h[1-6]|\/li)[^>]*>/gi, "\n")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&#39;|&apos;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/[ \t]+/g, " ")
      .replace(/\n\s*\n\s*/g, "\n\n")
      .trim();
    if (text.length < 200) return null;
    return text.slice(0, MAX_SOURCE_CHARS);
  } catch {
    return null;
  }
}
