# Contentino

## What this is

An open-source content generation tool built around a brand profile: a folder of markdown
that defines how a company writes. The engine generates content, evaluates it against that
profile, and feeds human edits back into the profile so it improves with use.

It is being built as the deliverable for a GenAI Lead challenge (brief in `interview/ASSIGNMENT.md`,
gitignored), but it is a real open-source product, not a demo. Lemonade ships as one example
brand profile, not as the product's identity.

## Who reads this repo

Two audiences, and both change how we work.

1. **The hiring team.** They are judging product thinking, not just working code. That makes
   `README.md`, `PRD.md`, `DECISIONS.md`, and the commit history deliverables in their own
   right. Small commits with real messages. No squashing history into one dump at the end.
2. **Open-source users.** Anyone should be able to drop in their own brand profile and run
   this. Generality is structural: a profile is a folder. It is never a settings screen,
   a tenant model, or an auth system.

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

## The docs

| File | Phase | What goes in it |
|---|---|---|
| `RESEARCH.md` | discover | Prior art, brand voice findings, and questions for the Lemonade team each paired with the assumption made in its absence |
| `PRD.md` | define | Problem, users, scope, non-goals, success metrics |
| `DECISIONS.md` | design | Every product and build decision, with rejected options |
| `PLAN.md` | deliver | Task list with checkboxes, grouped by day |
| `QUESTIONS.md` | - | Open items needing Stav's answer |
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
