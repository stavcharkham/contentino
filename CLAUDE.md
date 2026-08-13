# Contentino

## What this is

An internal content tool built around a brand profile: a folder of markdown that defines how
a company writes. The engine generates content, scores it against that profile, and feeds
human edits back in so the profile improves with use.

We build it as if we worked at Lemonade, for Lemonade's own people. It is the deliverable for
a GenAI Lead challenge (brief in `interview/ASSIGNMENT.md`, gitignored).

## What it is for

Two goals, and they are not the same goal.

1. **Remove overhead.** Low-stakes content should produce and publish itself with nobody
   watching.
2. **Make people faster on the work that matters.** Not faster at drafting. Faster to
   *approved*. Drafting was never the bottleneck; review and the wait for someone senior to
   say "that's not how we sound" is.

The chain that makes both work: a guideline is written, scored, approved, and then graduates
into a skill in the company plugin and a tool in the agent. The profile is a folder because
it has to graduate. A settings row cannot.

## Who reads this repo

**The hiring team.** They are judging product thinking, not just working code. That makes
`README.md`, `PRD.md`, `DECISIONS.md`, and the commit history deliverables in their own
right. Small commits with real messages. No squashing history into one dump at the end.

## Constraints that bound every decision

- **5 days.** Deadline is 2026-08-17. Depth on one path beats breadth across five.
- **$50 of API budget.** Model choice is a real cost decision. Small models for evaluation
  and judging, larger models for generation. Cache aggressively.
- **Git is the only store.** No database. Content, brand profiles, and generated output are
  markdown in git: versioned, diffable, reviewable. If state appears that git genuinely
  cannot hold, SQLite is the next step, not a hosted DB.
- **No auth.** The hosted demo is public and pre-loaded.
- **Ship where people already work.** Slack and an MCP server are the surfaces. A dashboard
  exists to show the system, not as the place work happens.
- **Nothing ships unscored.** `RUBRIC.md` gates it. Below 8 out of 10 no human looks at it,
  it gets regenerated.

## The docs

| File | Phase | What goes in it |
|---|---|---|
| `RESEARCH.md` | discover | Prior art, brand voice findings, and questions for the Lemonade team each paired with the assumption made in its absence |
| `PRD.md` | define | Problem, users, success metrics, and what we are building concretely: structures, formats, flows. No reasoning, that lives in `DECISIONS.md` |
| `DECISIONS.md` | design | Every product and build decision, with rejected options |
| `RUBRIC.md` | design | The scoring criteria, the thresholds, and what happens at each band |
| `PLAN.md` | deliver | Task list with checkboxes, grouped by day |
| `QUESTIONS.md` | - | Open items needing Stav's answer |
| `PROCESS.md` | - | Running log of how the work went. Feeds the write-up alongside `DECISIONS.md` |
| `README.md` | - | Public face. Written last. |

The four phases mirror the brief's own words: discover, define, design, deliver.

`interview/` holds the brief and, later, the presentation and one-pager. It is gitignored
and must never be published, referenced by path in public docs, or deployed.

## How decisions get recorded

Decisions are written to `DECISIONS.md` at the end of a session, during `/handoff`, after
the work has been tested. During the session, keep a rough running note of choices as they
are made. The chosen option is easy to reconstruct later; the rejected ones are not, and
they are the part that shows how the thinking went.

Entry format:

```markdown
### YYYY-MM-DD - Short title
**Category:** product | build | research
**Decided:** what we're doing.
**Rejected:** what we considered and didn't do.
**Why:** the reasoning, including which constraint drove it.
**Reversible:** yes | no
```

At the end of the project, the write-up for the hiring team is assembled from this file.
It only works if the entries are honest, including the ones where the first attempt was wrong.

## How we work

Stav is the PM, Claude is the developer and tech lead. The global rules in `~/.claude/CLAUDE.md`
apply in full: evidence before "done", report in product language, checkpoint commits, technical
choices decided by Claude and product choices escalated to Stav, tests as we go.

Flows: `/feature` to build something new, `/debug` when broken, `/ship` to deploy,
`/handoff` to close a session and write decisions, `/recap` to start one, `/stuck` when
going in circles, `/brainstorm` to think without building.

## Writing style

Plain and direct, in the docs and in the product's own copy. No filler, no dramatic section
names, no em-dashes. Say it once. The full style rules are in the global `CLAUDE.md`.
