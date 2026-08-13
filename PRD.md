# PRD

The problem, who has it, and what we are building, concretely. The reasoning behind every
choice is in `DECISIONS.md` and is not repeated here. If something below looks arbitrary, the
entry explaining it is there under the same date.

## The company

Lemonade is a digital insurance company. Renters, homeowners, pet and car, sold and serviced
through an app rather than through brokers and paper. It is publicly traded, which is why
investor notes and earnings material exist as public writing we can learn from.

Three things about it shape this product.

**The product is conversational, so the copy is the product.** Onboarding and claims run as
chat with named bots rather than as forms. There is no separate layer where the interface ends
and the writing begins. A badly worded sentence in a claims flow is a product defect.

**The voice is a real asset and a deliberate one.** Lemonade writes unlike the insurance
industry: plain, warm, funny where it is safe to be. That is a position, not a style
preference, and it is worth protecting precisely because it is easy to get wrong.

**It is regulated, and it has been burned.** In 2021 Lemonade published a tweet saying its AI
read non-verbal cues to detect fraud, drew a public discrimination backlash, and deleted it.
Every claims and fraud moment found in the research after that is handled carefully. The
company already knows what a tone failure costs, which is why a scoring gate is a feature here
rather than an obstacle.

## The problem

Lemonade's content team is a critical path for everything from product micro-copy to press
releases. Two different costs sit inside that one sentence.

**Low-stakes content is queuing behind people.** A designer writes a button label and waits for
someone senior in content to say whether it sounds like Lemonade. The writing took two minutes.
The wait takes days. Nothing about that wait improves the button.

**High-stakes content is slow to approve, and drafting was never the reason.** The prior-art
research found the same complaint across every tool in this market: not that drafting is slow,
but that heavy editing and fact-checking are still needed before anything can be published.
Generating drafts faster just lengthens the queue in front of the same reviewer.

And what people do today is copy and paste. They paste the style guide into ChatGPT at the
start of every session, keep a Custom GPT they update by hand, or ask a colleague whether a
draft sounds right. Nothing carries over. **We are not replacing a competitor, we are replacing
that.**

Underneath both is a third problem nobody in this market solves: when the same correction comes
back every week, nothing learns it. No product versions a brand voice, exports it, or improves
from edits. For a vendor those are lock-in problems with no reason to fix. Here they are the
point.

## Who it is for

**The content person** who owns how Lemonade sounds. Today they are the bottleneck by virtue of
being the only reliable judge. They should be setting the standard and reviewing what actually
needs them, not approving button labels. They author guidelines; we do not.

**The designer, PM or engineer** who needs a string and does not want to open a ticket for it.
They ask, they get copy that has already been scored, they ship.

**The unattended agent**, which is a user too. It reads the same profile and runs the same
skills as the people do, on things nobody had to remember to start.

## Success metrics

Detail and formulas live in `metrics/kpis.md`. What we are actually claiming:

| Goal | Metric | Why this one |
|---|---|---|
| Remove overhead | Auto-publish rate | Share of pieces that shipped with no reviewer. High for micro-copy, zero for external comms by design |
| Remove overhead | Minutes saved | Ledger against baselines. Honest only because the baselines are visible and arguable |
| Faster to approved | First-pass approval rate | Pieces approved with no revisions |
| Faster to approved | Revisions per approved piece | The direct measure of how close the first draft lands |
| The profile is learning | **Corrections per piece, over time** | The headline. Directly observed, resting on no invented baseline, and it goes down only if the loop works |
| Safe | Compliance blocks | Should not be zero. A veto that never fires is not a veto |
| Affordable | Cost per approved piece | The number that matters against a $50 budget |

**Honest limit.** In five days we can show these mechanisms working across a handful of pieces.
We cannot show a trend over months. The write-up says that rather than implying otherwise.

## In one paragraph

A brand profile lives as markdown in git. A set of skills read it to produce content. One
agent runs those skills, and the same skills serve a person working in Claude and an
unattended agent triggered by an event. Everything produced is scored automatically by a gate
wired into the plumbing rather than into the model's judgment. Content that scores well enough
and carries low enough stakes publishes with no reviewer. Everything else goes to a person,
whose corrections are saved as files. A batch job reads those corrections, finds the ones that
keep repeating, and proposes new guidelines for the profile. That is the loop: a fix applied
once instead of on every piece forever.

## The stack

TypeScript throughout, on Node. Next.js for the dashboard, deployed to Vercel, which was already
the hosting decision. One `package.json`, one toolchain. The gate's hooks are Node scripts the
harness invokes; the Slack and Google adapters use the official SDKs; the unattended runner is
built on the Agent SDK so the same hooks apply in both modes.

`eval/recheck.py` stays Python. It is a one-off analysis script, not part of the product.

**Models.** `CLAUDE.md` sets the policy: small models for evaluation and judging, larger for
generation. Left alone, Opus 5 is the default for everything; this is a deliberate departure for
cost, which is a named project constraint.

| Job | Model | Rate (per MTok) | Why |
|---|---|---|---|
| Brief-making | `claude-opus-5` | $5 / $25 | One call per event, lowest volume, highest-value artifact |
| Content generation | `claude-sonnet-5` | $2 / $10 | On introductory pricing through 2026-08-31, which covers the whole project |
| Scoring | `claude-haiku-4-5` | $1 / $5 | Runs on everything, including every regeneration. Cheapest by a wide margin |

**Scoring on the cheapest model is a hypothesis, not a decision.** The prior-art research found
small models cautioned against as judges, and nothing published covers small-model judging of
brand voice specifically. We have a 47-item answer key, so we test it: if Haiku reproduces the
human scores, it stays. If it misses the compliance veto cases in particular, that criterion
moves to Sonnet 5 and the rest stays cheap. Evidence, not a guess.

Three model gotchas worth writing down before anything is built:

- **Haiku 4.5 rejects `effort`.** It is on the older thinking API. Passing `output_config.effort`
  to it errors. Only the two larger models take it.
- **Prompt caches are per model**, so each of the three keeps its own copy of the profile. Cache
  reads cost about a tenth of input; writes cost 1.25x. This is the single biggest cost lever we
  have, since the profile is identical on every call.
- **Haiku 4.5 will not cache a prefix under 4096 tokens** (Opus 5 caches from 512). If the profile
  is small, scoring silently pays full price on every call with no error to notice.

Scoring uses structured outputs (`output_config.format` with a JSON schema) so a score parses
reliably instead of being scraped out of prose.

## Repo layout

```
profile/          the brand. Layout below
skills/           one folder per skill. This is the plugin
gate/             the hooks, and the mechanics checker that runs in code
lib/
  storage.ts      the one module that reads and writes content. The seam
  score.ts        the gate's body
  ledger.ts
  adapters/       claude.ts, slack.ts, gdocs.ts
app/              Next.js dashboard, and the routes below
  api/cron/drive/ Vercel Cron target. Polls the watched folder
  api/slack/      Slack events endpoint
content/          briefs, drafts, published, corrections
metrics/          kpis.md, ledger.csv, baselines.yml
eval/             rubric validation and re-check
```

## The layers

```
profile/          the brand, as markdown. The source of truth. Versioned, diffable, reviewable.
skills/           what the system can do. Packaged as one plugin.
gate/             scoring. Runs as a hook, not as a skill, so it cannot be skipped.
surfaces/         three adapters under one review skill. No UI of our own.
content/          drafts, briefs, published output, corrections.
metrics/          how we know it worked: the KPI definitions, the raw data, the assumptions.
```

`metrics/` holds three different kinds of thing, which should not be confused with each other:

```
metrics/
  kpis.md         what we measure and how each number is computed. The definitions
  ledger.csv      raw data. One row per piece, updated in place
  baselines.yml   the assumed manual time per content type. Assumptions, not findings
```

The ledger is the input, the baselines are what turn it into minutes, and `kpis.md` is the only
one of the three that makes a claim.

## The profile on disk

```
profile/
  base/
    voice.md          the three registers and the rule for switching between them
    stakes.md         how to tell low from medium from high for a given sentence
    mechanics.md      caps, exclamation marks, contractions, em dashes, sentence length
    vocabulary.md     what Lemonade translates, what it leaves standing
    compliance.md     the prohibitions. Feeds the veto
    audience.md       who reads, what they care about, in their language
  voices/
    company.md        the default
    <person>.md       individual voice, for content published under a name
  types/
    product-microcopy/
      guideline.md    how this type is written, keyed by stakes level
      examples.md     real approved copy with source ids
      criteria.md     this type's own scoring questions
    external-comms/
      guideline.md
      examples.md
      criteria.md
```

Adding a content type means adding a folder with those three files. That is the whole
extension mechanism, and it is why the profile is a folder rather than a settings table.

Each type's `guideline.md` carries frontmatter, and one field in it is load-bearing:

```yaml
---
content_type: product-microcopy
max_autopublish_stakes: low     # low | medium | high | none
mechanics:
  max_chars: 60
  sentence_band: [1, 12]
---
```

## Who decides the stakes level

This gates auto-publish, so a wrong answer is how something sensitive ships unreviewed.

**The content type sets a ceiling; the model can only ever lower it.** Every type declares
`max_autopublish_stakes` in its folder. Micro-copy is capped at `low`. External comms is capped at
`none`, so it never auto-publishes at any score. The model still classifies each piece against
`profile/base/stakes.md`, but that classification can only move a piece *toward* review, never away
from it: a piece auto-publishes only when its classified stakes sit at or below its type's ceiling.

The asymmetry is the point. A misjudgement downgrades a piece into human review, which costs
someone a minute. It cannot promote a piece out of review, which is the failure that matters. The
model's judgment gets used where it is useful, and is never the only thing standing between a
sensitive sentence and publication.

## Skills

Seven. The profile is data that skills read; there are no skills that only wrap a file.

| Skill | In | Out | Reads |
|---|---|---|---|
| `make-brief` | A transcript | A brief in `content/briefs/` | `base/`, `audience.md`, `voices/` |
| `write-external-comms` | An **approved** brief | A draft in `content/drafts/` | `base/`, `types/external-comms/`, the named voice |
| `write-microcopy` | A screen described, or a screenshot | Candidate strings as a draft | `base/`, `types/product-microcopy/` |
| `score` | A draft | A score sidecar plus a ledger row | The type's `criteria.md`, `compliance.md`, examples at matching stakes |
| `review` | A draft and a surface | Corrections, and a revision request | The draft, and prior corrections on the same piece |
| `cluster-corrections` | Nothing (reads the pile) | A proposed guideline, for approval | `content/corrections/` where status is open |
| `add-content-type` | A conversation with a content person | A new `types/<name>/` folder | An existing type, as the worked example |

`score` exists as a skill for ad-hoc human use. The gate does not call it: the gate runs the same
logic as infrastructure, so scoring cannot be skipped.

## The brief

The middle artifact for event-triggered content, and the thing a person approves. One file per
brief in `content/briefs/`, with frontmatter carrying `id`, `created`, `source`, `status`
(`draft` | `approved` | `rejected`), `approved_by` and `approved_at`.

```markdown
# Headline

The change in the world, in the reader's terms. Not the product's name.

**The story in one paragraph.** Who is doing what, and the two or three things it
actually does for someone.

## Why now
The condition that makes this worth saying today rather than last quarter. Every
factual claim carries a source and a link.

## What changed
What exists now that did not before, how it works, and what it replaces. Honest
about what it does not do.

## Quote
Attributed to a named person, in their voice. A scene, not a slogan.

## Not saying
The claims we are deliberately not making, and why.
```

Structure adapted from a working PR system whose briefs are entirely generated. Two parts are
doing real work. **Why now** carries cited external sources, because the evidence layer is what
makes a brief usable rather than promotional. **Not saying** is ours: it carries compliance
context forward into every piece that comes off the brief, so the fan-out inherits the boundary
instead of rediscovering it.

## The gate

Two hooks, because writing a draft and publishing it are different acts.

**On writing into `content/drafts/`** the gate scores and records. It never blocks, because a
bad draft is allowed to exist.

1. Mechanics, in code. Free, no model, runs first.
2. Compliance, model-graded. A fail is a veto.
3. Core criteria plus the content type's own criteria, model-graded, scored pairwise against
   corpus examples at the same stakes level rather than absolute scoring.

The result is written next to the draft and appended to the ledger.

**On publishing** the gate refuses unless a passing score already exists for that exact draft.
This is what makes "nothing ships unscored" a fact rather than a hope.

Routing, from the score:

| Score | Stakes vs the type's ceiling | What happens |
|---|---|---|
| 9-10 | at or below | Published. No reviewer. Audit line to Slack |
| 9-10 | above | Review |
| 8 | any | Review |
| below 8 | any | Regenerate |
| compliance fail | any | Blocked, regardless of score |
| any single 0 | any | Blocked |

A type whose ceiling is `none` never reaches the first row. External comms is that type.

**Regeneration is capped at 3 attempts**, then it escalates to a person with the scores
attached. Uncapped regeneration is the obvious way to burn $50 on one stubborn string.

## The rubric

A shared core that applies to everything, plus questions belonging to each content type.
Scores normalise to 10 so they stay comparable across types. `RUBRIC.md` holds the wording;
this is the structure.

**Core:** register match, humour boundary, plain language calibration, compliance safety (veto).

**Product micro-copy adds:** direct address where there is an addressee, character budget fit,
consistency of action verbs with the rest of the product.

**External comms adds:** direct address, is the central claim sourced, is there a clear why
now, does the quote sound like the person it is attributed to.

Mechanics is core but its *rules* come from the content type, because a sentence-length band
means nothing in twelve characters.

**The second gate.** A content type is only fit to use if its own examples score 9-10 against
its own criteria. A guideline whose examples fail is a wrong guideline. This runs when a type
is added and is what makes the content team owning authoring safe.

## The two flows

### How a run actually starts

Three entry points, two mechanisms, no daemon.

**A transcript lands in the watched Drive folder.** A Vercel Cron job hits
`app/api/cron/drive/` on a schedule. It lists the folder and, for any file with no brief already
in `content/briefs/`, starts a run. **State comes from the repo, not from a cursor** — if a brief
exists for that source, the file has been handled. Nothing to keep in sync, nothing to reset.

**Someone tags the agent in Slack, or hands over a transcript or screenshot.** Slack's Events API
posts to `app/api/slack/`, which starts the same run.

**Someone asks in Claude.** The plugin invokes the skill directly. No route involved.

**Piece ids** are `<date>-<slug>-<4 hex>`, so `2026-08-14-q2-results-a3f2`. Sortable, readable in
a file listing, and unique without a counter to store.

**Event-triggered, external comms.** A transcript lands in the watched Google Drive folder, or
someone tags the agent in a Slack channel with one.

1. `make-brief` produces a brief into `content/briefs/`
2. The brief always goes to a person. A brief is never auto-approved
3. On approval, `write-external-comms` produces the draft
4. The gate scores it
5. External comms never auto-publishes at any score. It goes to review
6. Corrections are captured, a revision runs, the ledger row updates

The approval happens once, upstream, on the brief, instead of separately on each piece that
comes off it.

**Person-triggered, micro-copy.** A designer drops a screenshot or describes a state, in Slack
or in Claude.

1. `write-microcopy` produces candidates
2. The gate scores them
3. 9 or above and low stakes: published, ledger row written, audit line to Slack, nobody
   reviews it
4. 8: review. Below 8: regenerate, up to three times

## Formats

These are the contracts. Three surfaces and the learning loop all read and write them, so they
get defined before anything is built.

**A correction.** One file per correction, in `content/corrections/`.

```markdown
---
id: a3f2
created: 2026-08-14T09:31:00Z
content_type: external-comms
piece: content/drafts/2026-08-14-q2-results.md
surface: slack | claude | gdocs
who: stav
criterion: register | humour | plain-language | mechanics | compliance | <type criterion> | none
status: open | resolved | dismissed
resolved_by: <guideline id, once folded in>
---

**Was:** the exact text before
**Now:** the exact text after
**Said:** what the person actually said, verbatim
```

`criterion` is what makes clustering possible. `Said` is kept verbatim because the reason is
the part that becomes a guideline, and paraphrasing it loses the thing worth keeping.

**A ledger row.** One row per piece in `metrics/ledger.csv`, updated in place.

```
piece_id, created, skill, content_type, triggered_by, trigger, score,
outcome, revisions, api_cost_usd, minutes_saved
```

`outcome` is one of auto-published, reviewed, regenerated, blocked.

**Baselines.** `metrics/baselines.yml`, kept separate so the assumptions read as assumptions
rather than as findings.

```yaml
external-comms:
  baseline_minutes: 75
  reviewed_multiplier: 0.5
  minutes_per_revision: 10
product-microcopy:
  baseline_minutes: 20
  reviewed_multiplier: 0.5
  minutes_per_revision: 5
```

Auto-published saves the full baseline. Reviewed saves the baseline times the multiplier. Each
revision subtracts its minutes. Numbers are illustrative until someone at Lemonade corrects
them, which is the point of keeping them in their own file.

## Surfaces

One `review` skill, three adapters. An adapter does three things: show a draft, collect
feedback, and write corrections in the format above. Nothing else differs between them.

| Surface | How review works | Cost to build |
|---|---|---|
| Claude | The conversation is the review. Precise feedback, no adapter work beyond the plugin | Nearly free |
| Slack | Agent posts the draft in a thread, reads replies, posts the revision in the same thread | About a day |
| Google Docs | Agent writes the draft as a doc; the person uses native comments; the agent replies and resolves them | Most work, first to cut |

Google Docs gives anchored comments, which are better feedback than "make it less jokey",
inside a tool the content team already uses. It is also the only one needing OAuth against a
comments API, so it is the first thing cut if day 4 runs out.

## The learning loop

Corrections pile up with no processing at write time. Then `cluster-corrections` runs, either
by hand or on a schedule in someone's own Claude:

1. Read every correction with `status: open`
2. Group ones that say the same thing, using `criterion` and the text
3. Where a group has four or more members, write a proposed guideline in plain language
4. A person approves or rejects it
5. Approved: the guideline is written into the profile and the group is marked resolved.
   Rejected: dismissed, or left open

Above that sits one more promotion, done by hand. A guideline that has proven stable becomes
part of the code-level mechanics check, where it runs for free before any model is called.
Three tiers, each more expensive than the last, and things only move up when they have earned
it: **correction, guideline, skill.**

## Storage

Git, with one exit. Every read and write of content goes through a single module, so pointing
this at a real content platform later is a change in one file rather than a rewrite.

The profile stays in git permanently, because it is configuration that has to be versioned,
reviewed, and able to graduate into code. Generated output is in git for now and is the part
that would move first.

## Out of scope

Nothing here publishes to a live external channel. Output lands in git, Slack or a Google Doc,
and a person takes it from there. No trend scanning. No automatic promotion of a guideline into
a skill. The full list, with reasoning, is in `PLAN.md`.

**On PR specifically.** A real PR agent does more than write a press release. It works out
which publications matter for this story, which reporter at each one covers this beat, and what
angle makes it interesting to *their* readers rather than to us, because a journalist does not
want your story, they want something usable. It then has to survive the fact that PR is a
relationships business and a person with contacts cannot be replaced by an agent with a media
list. That is a project on its own. We aim the external comms stream at blog posts and written
announcements, keep the brief step, which is the part that transfers, and leave outlet and
reporter research out.

## What counts as evidence

Each part has to be shown working, not asserted:

- **Gate:** generate micro-copy and watch it get scored without being asked. Then write a
  deliberate compliance failure and watch publishing get refused.
- **Rubric:** real Lemonade copy scores 9-10 against the fixed rubric. Off-brand twins stay
  low. The 2026-08-12 validation already produced a 4.38 gap; the fixes have to preserve it.
- **Loop:** a correction made in one surface changes the next generation, after a human
  approves the guideline.
- **Ledger:** a full run produces a row with a real cost and a real minutes-saved number.
- **Extension:** a third content type gets added on camera, by following `add-content-type`,
  in minutes.

## Open assumptions

Things assumed because we could not ask. Each also appears in `RESEARCH.md` as a question for
the Lemonade team.

- **What the highest-stakes copy actually says.** Claim denials, coverage rejections and
  renewal price increases were the one thing we could not find anywhere public. Assumed they
  open by acknowledging the situation before getting to the point, the way the claims bot does.
  Neither chosen stream generates this, so the assumption is not load-bearing yet.
- **Who signs off today, and how long it takes.** This product exists to shorten that path and
  we are guessing at its length. Assumed a named reviewer per content type and a wait measured
  in days. Every minutes-saved number rests on this.
- **Where approved guidelines should end up.** Assumed a skill in the company plugin and a tool
  in the agent are the right destinations.
- **The baseline minutes per content type.** Invented, and visible in `metrics/baselines.yml`
  precisely so someone at Lemonade can correct them in one place.

Live questions are tracked in `QUESTIONS.md`. Two affect this document: whether the third
content type gets demoed live, which competes with the Google Docs adapter for day 4, and how
much of the $50 budget is already spent.
