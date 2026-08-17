"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import type { DashboardData, FlowStage } from "@/lib/dashboard";

const outcomeLabels: Record<string, string> = {
  "auto-published": "Published",
  reviewed: "Review",
  regenerated: "Regenerated",
  blocked: "Blocked",
};

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
        <div className="masthead-status"><span className="status-dot" /> READ-ONLY EVIDENCE</div>
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

      <section className="report-grid" aria-label="Evidence report">
        <div className="report-panel rubric-panel">
          <div className="panel-title"><span>02</span><div><p>Rubric evaluation</p><h2>Does the gate separate?</h2></div></div>
          <div className="separation">
            <div className="score-block real"><strong>{data.rubric.realMean.toFixed(2)}</strong><span>Real Lemonade</span></div>
            <div className="gap-marker"><span>{data.rubric.gap.toFixed(2)}</span><small>POINT GAP</small></div>
            <div className="score-block off"><strong>{data.rubric.offBrandMean.toFixed(2)}</strong><span>Off-brand</span></div>
          </div>
          <p className="disclosure">{data.rubric.disclosure}</p>
        </div>

        <div className="report-panel distribution-panel">
          <div className="panel-title"><span>03</span><div><p>Live outcomes</p><h2>What happened</h2></div></div>
          {data.kpis.runs ? data.outcomes.map((outcome) => (
            <div className="bar-row" key={outcome.label}>
              <div><span>{outcomeLabels[outcome.label]}</span><strong>{outcome.count}</strong></div>
              <div className="bar-track"><span style={{ width: `${outcome.percentage}%` }} /></div>
            </div>
          )) : <div className="empty-state compact"><strong>No live runs yet.</strong><span>The ledger is real and intentionally empty.</span></div>}
        </div>
      </section>

      <section className="table-section" aria-labelledby="recent-title">
        <div className="section-heading compact-heading"><div><p className="section-index">04 / RUN LEDGER</p><h2 id="recent-title">Recent pieces</h2></div><span>{data.kpis.revisions} revisions recorded</span></div>
        {data.pieces.length ? (
          <div className="table-wrap"><table><thead><tr><th>Piece</th><th>Type</th><th>Score</th><th>Route</th><th>Surface</th><th>Cost</th><th>Saved</th></tr></thead><tbody>
            {data.pieces.map((piece) => <tr key={piece.piece_id}><td><strong>{piece.piece_id}</strong><small>{piece.createdLabel}</small></td><td>{piece.content_type}</td><td><span className="score-pill">{piece.score.toFixed(1)}</span></td><td>{outcomeLabels[piece.outcome]}</td><td>{piece.trigger}</td><td>{formatMoney(piece.api_cost_usd)}</td><td>{piece.minutes_saved}m</td></tr>)}
          </tbody></table></div>
        ) : <div className="empty-state table-empty"><strong>No run data to display.</strong><span>Fixture tests prove the flow without writing demonstration data into the live ledger.</span></div>}
      </section>

      <section className="lower-grid">
        <div className="profile-panel">
          <div className="panel-title"><span>05</span><div><p>Versioned profile</p><h2>Active content types</h2></div></div>
          <div className="profile-list">{data.profiles.map((profile) => (
            <article key={profile.name}><div><span className="active-dot" /><strong>{profile.name}</strong></div><dl><div><dt>Status</dt><dd>{profile.status}</dd></div><div><dt>Ceiling</dt><dd>{profile.ceiling}</dd></div><div><dt>Criteria</dt><dd>{profile.criteria}</dd></div><div><dt>Version</dt><dd>{profile.version}</dd></div></dl></article>
          ))}</div>
        </div>
        <div className="corrections-panel">
          <div className="panel-title"><span>06</span><div><p>Learning loop</p><h2>Recent corrections</h2></div></div>
          {data.corrections.length ? <div className="correction-list">{data.corrections.map((correction) => <article key={correction.id}><div><span>{correction.surface}</span><strong>{correction.criterion}</strong></div><small>{correction.type} · {correction.who} · {correction.status}</small></article>)}</div> : <div className="empty-state compact"><strong>No live corrections yet.</strong><span>Four matching open corrections are required before a rule can be proposed.</span></div>}
        </div>
      </section>

      <footer><span>CONTENTINO / EVIDENCE REPORT</span><p>Git is the system of record. This dashboard cannot change it.</p><span>BUILD 0.1</span></footer>
    </main>
  );
}
