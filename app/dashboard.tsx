"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import type { DashboardData, FlowStage } from "@/lib/dashboard";

const outcomeLabels: Record<string, string> = {
  "auto-published": "Published",
  reviewed: "Review",
  regenerated: "Regenerated",
  blocked: "Blocked",
};

const demoVerdicts: Record<string, string> = {
  "auto-published": "Passes. Low stakes, so it would auto-publish.",
  reviewed: "Passes the bar. It would go to human review.",
  regenerated: "Below the bar. The engine would regenerate it.",
  blocked: "Blocked. A compliance veto or a zero criterion.",
};

const demoMaxChars = 12000;

const demoExamples = [
  { label: "Real Lemonade copy", text: "Quiet one this time. The kind of update that doesn't announce itself at parties." },
  { label: "Off-brand jargon", text: "Premiums are calculated utilizing telematics-based driving behavior data collected via a proprietary algorithm." },
  { label: "Overpromise (veto)", text: "Our AI is basically a lie detector — it reads your face and body language in the claim video to catch liars in real time!" },
];

type DemoResult = {
  piece_id: string;
  content_type: string;
  score: number;
  outcome: string;
  stakes: string;
  compliance: { pass: boolean; reason: string };
  criteria: Array<{ name: string; score: number | "N/A"; reason: string }>;
  runs_today: number;
  daily_limit: number;
};

function TryTheGate() {
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DemoResult | null>(null);

  async function score() {
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const response = await fetch("/api/demo/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "The gate could not score this text");
      setResult(payload as DemoResult);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : String(caught));
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="flow-section demo-section" aria-labelledby="demo-title">
      <div className="section-heading">
        <div><p className="section-index">02 / TRY THE GATE</p><h2 id="demo-title">How Lemonade is it?</h2></div>
        <p>Paste any copy and the production gate scores it against the shared Lemonade rubric: the core voice criteria, the mechanics check and the compliance veto its own drafts pass. Every run lands in the ledger below.</p>
      </div>
      <div className="demo-grid">
        <div className="demo-input">
          <textarea
            value={text}
            maxLength={demoMaxChars}
            onChange={(event) => setText(event.target.value)}
            placeholder="Paste a headline, a button label, an email, a blog post…"
            aria-label="Copy to score"
            rows={8}
            disabled={busy}
          />
          <div className="demo-controls">
            <div className="demo-examples">
              {demoExamples.map((example) => (
                <button key={example.label} type="button" className="demo-example" disabled={busy} onClick={() => { setText(example.text); setResult(null); setError(null); }}>
                  {example.label}
                </button>
              ))}
            </div>
            <span className="demo-count">{text.trim().length.toLocaleString("en-US")} / {demoMaxChars.toLocaleString("en-US")}</span>
            <button type="button" className="demo-submit" onClick={score} disabled={busy || text.trim().length < 12}>
              {busy ? "Scoring…" : "Score it"}
            </button>
          </div>
          <p className="demo-note">Text only, up to blog length. Capped at 100 scores a day. Nothing you paste is published anywhere.</p>
        </div>
        <div className="demo-output" aria-live="polite">
          {busy && <div className="empty-state compact demo-wait"><strong>The gate is scoring…</strong><span>Stakes, compliance, then every rubric criterion.</span></div>}
          {!busy && error && <div className="empty-state compact demo-error"><strong>No score this time.</strong><span>{error}</span></div>}
          {!busy && !error && !result && <div className="empty-state compact"><strong>No text scored yet.</strong><span>Paste copy or pick an example, then score it.</span></div>}
          {!busy && result && (
            <div className="demo-result">
              <div className="demo-headline">
                <strong>{result.score.toFixed(2)}</strong>
                <div>
                  <span className={`demo-band band-${result.outcome}`}>{demoVerdicts[result.outcome] ?? result.outcome}</span>
                  <small>Scored as {result.content_type.replaceAll("-", " ")} · {result.stakes} stakes · {result.compliance.pass ? "compliance passed" : `compliance veto: ${result.compliance.reason}`}</small>
                </div>
              </div>
              <ul className="demo-criteria">
                {result.criteria.map((criterion) => (
                  <li key={criterion.name}>
                    <span className={`criterion-score value-${String(criterion.score).toLowerCase().replace("/", "")}`}>{criterion.score}</span>
                    <div><strong>{criterion.name}</strong><small>{criterion.reason}</small></div>
                  </li>
                ))}
              </ul>
              <p className="demo-ledger-note">Recorded in the ledger as <strong>{result.piece_id}</strong> · demo score {result.runs_today} of {result.daily_limit} today</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function formatMoney(value: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 4 }).format(value);
}

export function Dashboard({ data }: { data: DashboardData }) {
  const [selected, setSelected] = useState<FlowStage>("gate");
  const rail = useRef<Array<HTMLButtonElement | null>>([]);
  const filteredEvidence = data.evidence.filter((item) => item.stage === selected);

  function moveFocus(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (!(["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp", "Home", "End"] as string[]).includes(event.key)) return;
    event.preventDefault();
    const max = data.flow.length - 1;
    const next = event.key === "Home" ? 0 : event.key === "End" ? max : event.key === "ArrowRight" || event.key === "ArrowDown" ? (index + 1) % data.flow.length : (index - 1 + data.flow.length) % data.flow.length;
    const stage = data.flow[next].id;
    setSelected(stage);
    rail.current[next]?.focus();
  }

  return (
    <main>
      <header className="masthead">
        <a className="brand" href="#top" aria-label="Contentino dashboard home">
          <span className="brand-mark" aria-hidden="true">C</span>
          <span>CONTENTINO</span>
        </a>
        <div className="masthead-status"><span className="status-dot" /> LIVE EVIDENCE</div>
        <div className="timestamp">UPDATED {data.generatedLabel}</div>
      </header>

      <section className="hero" id="top">
        <div>
          <p className="kicker">Brand system / build evidence</p>
          <h1>Content that gets<br /><span>better in public.</span></h1>
        </div>
        <p className="hero-copy">Contentino generates against a versioned brand profile, blocks unsafe work, and turns human review into the next rule.</p>
      </section>

      <section className="kpi-grid" aria-label="Live ledger metrics">
        <article><p>Recorded runs</p><strong>{data.kpis.runs}</strong><small>{data.kpis.runs ? "Every row has score, route, cost and time" : "Awaiting the first live workflow"}</small></article>
        <article><p>Average score</p><strong>{data.kpis.averageScore?.toFixed(2) ?? "—"}</strong><small>10-point normalized rubric</small></article>
        <article><p>Compliance blocks</p><strong>{data.kpis.blocks}</strong><small>Model vetoes in stored scorecards</small></article>
        <article className="pink-kpi"><p>API cost</p><strong>{formatMoney(data.kpis.costUsd)}</strong><small>{data.kpis.minutesSaved} estimated minutes saved</small></article>
      </section>

      <section className="flow-section" aria-labelledby="flow-title">
        <div className="section-heading">
          <div><p className="section-index">01 / SYSTEM MAP</p><h2 id="flow-title">Follow the evidence</h2></div>
          <p>Select a stage. The report below filters to the proof produced there.</p>
        </div>
        <div className="flow-rail" role="tablist" aria-label="Contentino workflow">
          {data.flow.map((node, index) => (
            <button
              key={node.id}
              ref={(element) => { rail.current[index] = element; }}
              className={selected === node.id ? "flow-node selected" : "flow-node"}
              role="tab"
              aria-selected={selected === node.id}
              aria-controls="stage-evidence"
              tabIndex={selected === node.id ? 0 : -1}
              onClick={() => setSelected(node.id)}
              onKeyDown={(event) => moveFocus(event, index)}
            >
              <span className="node-number">{String(index + 1).padStart(2, "0")}</span>
              <strong>{node.label}</strong>
              <small>{node.note}</small>
              <span className="node-count">{node.count}</span>
            </button>
          ))}
        </div>
        <div className="evidence-grid" id="stage-evidence" role="tabpanel">
          {filteredEvidence.length ? filteredEvidence.map((item) => (
            <article className={`evidence-card tone-${item.tone}`} key={item.id}>
              <p>{item.eyebrow}</p>
              <div><h3>{item.title}</h3>{item.value && <span>{item.value}</span>}</div>
              <small>{item.detail}</small>
            </article>
          )) : <div className="empty-state">No evidence is recorded for this stage yet.</div>}
        </div>
      </section>

      <TryTheGate />

      <section className="report-grid" aria-label="Evidence report">
        <div className="report-panel rubric-panel">
          <div className="panel-title"><span>03</span><div><p>Rubric evaluation</p><h2>Does the gate separate?</h2></div></div>
          <div className="separation">
            <div className="score-block real"><strong>{data.rubric.realMean.toFixed(2)}</strong><span>Real Lemonade</span></div>
            <div className="gap-marker"><span>{data.rubric.gap.toFixed(2)}</span><small>POINT GAP</small></div>
            <div className="score-block off"><strong>{data.rubric.offBrandMean.toFixed(2)}</strong><span>Off-brand</span></div>
          </div>
          <p className="disclosure">{data.rubric.disclosure}</p>
        </div>

        <div className="report-panel distribution-panel">
          <div className="panel-title"><span>04</span><div><p>Live outcomes</p><h2>What happened</h2></div></div>
          {data.kpis.runs ? data.outcomes.map((outcome) => (
            <div className="bar-row" key={outcome.label}>
              <div><span>{outcomeLabels[outcome.label]}</span><strong>{outcome.count}</strong></div>
              <div className="bar-track"><span style={{ width: `${outcome.percentage}%` }} /></div>
            </div>
          )) : <div className="empty-state compact"><strong>No live runs yet.</strong><span>The ledger is real and intentionally empty.</span></div>}
        </div>
      </section>

      <section className="table-section" aria-labelledby="recent-title">
        <div className="section-heading compact-heading"><div><p className="section-index">05 / RUN LEDGER</p><h2 id="recent-title">Recent pieces</h2></div><span>{data.kpis.revisions} revisions recorded</span></div>
        {data.pieces.length ? (
          <div className="table-wrap"><table><thead><tr><th>Piece</th><th>Type</th><th>Score</th><th>Route</th><th>Surface</th><th>Cost</th><th>Saved</th></tr></thead><tbody>
            {data.pieces.map((piece) => <tr key={piece.piece_id}><td><strong>{piece.piece_id}</strong><small>{piece.createdLabel}</small></td><td>{piece.content_type}</td><td><span className="score-pill">{piece.score.toFixed(1)}</span></td><td>{outcomeLabels[piece.outcome]}</td><td>{piece.trigger}</td><td>{formatMoney(piece.api_cost_usd)}</td><td>{piece.minutes_saved}m</td></tr>)}
          </tbody></table></div>
        ) : <div className="empty-state table-empty"><strong>No run data to display.</strong><span>Fixture tests prove the flow without writing demonstration data into the live ledger.</span></div>}
      </section>

      <section className="lower-grid">
        <div className="profile-panel">
          <div className="panel-title"><span>06</span><div><p>Versioned profile</p><h2>Active content types</h2></div></div>
          <div className="profile-list">{data.profiles.map((profile) => (
            <article key={profile.name}><div><span className="active-dot" /><strong>{profile.name}</strong></div><dl><div><dt>Status</dt><dd>{profile.status}</dd></div><div><dt>Ceiling</dt><dd>{profile.ceiling}</dd></div><div><dt>Criteria</dt><dd>{profile.criteria}</dd></div><div><dt>Version</dt><dd>{profile.version}</dd></div></dl></article>
          ))}</div>
        </div>
        <div className="corrections-panel">
          <div className="panel-title"><span>07</span><div><p>Learning loop</p><h2>Recent corrections</h2></div></div>
          {data.corrections.length ? <div className="correction-list">{data.corrections.map((correction) => <article key={correction.id}><div><span>{correction.surface}</span><strong>{correction.criterion}</strong></div><small>{correction.type} · {correction.who} · {correction.status}</small></article>)}</div> : <div className="empty-state compact"><strong>No live corrections yet.</strong><span>Four matching open corrections are required before a rule can be proposed.</span></div>}
        </div>
      </section>

      <footer><span>CONTENTINO / EVIDENCE REPORT</span><p>Git is the system of record. This page only reads it, except the gate demo, which writes its ledger row.</p><span>BUILD 0.1</span></footer>
    </main>
  );
}
