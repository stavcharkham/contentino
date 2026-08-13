"use client";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return <main className="error-shell"><div className="error-card"><p className="kicker">Evidence unavailable</p><h1>The report could not be read.</h1><p>The underlying Git or filesystem source may be temporarily unavailable. No content was changed.</p><button onClick={reset}>Try again</button></div></main>;
}
