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

## Where it stands (2026-08-17, submission day)

Production runs at contentino-seven.vercel.app; the runtime commits into this same repo,
so always `git pull --rebase origin main` before pushing. All three surfaces are live and
were verified by Stav: Slack (buttons, feedback, on-demand Drive sync), Claude (the
`contentino-engine` plugin; drafts on the user's subscription, judged by the production
gate over an MCP connector or the HTTP endpoint, shared password in Vercel's
`DASHBOARD_PASSWORD`), and the password-gated dashboard. `/lemonade-demo` is a short
prompt-driven script with pre-verified inputs; the plugin is at 0.8.0 (micro-copy shows
a four-line spec before the draft, comms briefs carry a Purpose section and need named
approval). The demo script versions since 0.6.0 have not been run live - Stav's
end-to-end run is the outstanding proof. Slack was fixed against Stav's 2026-08-16 live
runs (blocked drafts retry silently, bare requests get asked for source material, briefs
use the person's full message, approvals post a progress line). README is written.
Remaining before the 2026-08-17 deadline:
making the repo public at submission, trust metrics on the dashboard, the recordings
and the deck. `PLAN.md` has the full list.

## Constraints that bound every decision

- **5 days.** Deadline is 2026-08-17. Depth on one path beats breadth across five.
- **$50 of API budget.** Model choice is a real cost decision, settled per job in `PRD.md`:
  Opus 5 for the brief, Sonnet 5 for content and the compliance veto, Haiku 4.5 for
  classification and the other scored criteria, and no model at all for mechanics. Cache
  aggressively - the profile is identical on every call and caches are per model.
- **Git is the only store, with one marked exit.** The brand profile stays in git permanently
  because it is configuration that has to be versioned, reviewed, and able to graduate into
  code. Generated output is in git for now, and all reading and writing goes through one
  module so pointing at a real content platform later is a change in one file.
- **Ship where people already work. No UI.** Three surfaces, one review skill underneath:
  Claude, a Slack thread, and comments on a Google Doc. MCP is a transport, not the
  architecture. The only page we build is a read-only admin view of the system, on Vercel
  behind its built-in password protection - so no auth code, but not public either.
- **Nothing ships unscored.** `RUBRIC.md` gates it, wired in as a hook so it cannot be
  skipped. Below 8 out of 10 no human looks at it, it gets regenerated, capped at three
  attempts before it escalates to a person.
- **Only the content type may raise the stakes ceiling.** Each type declares the highest
  stakes it can auto-publish. The model classifies each piece, but that classification can
  only ever move a piece into review, never out of it.

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
