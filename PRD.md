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

## Skills

Seven. The profile is data that skills read; there are no skills that only wrap a file.

| Skill | What it does |
|---|---|
| `make-brief` | Turn a transcript into a brief: what the story is, why now, the evidence, the angle |
| `write-external-comms` | Produce a press release or blog post from an **approved** brief |
| `write-microcopy` | Produce UI strings for a described screen or state |
| `score` | Score a draft. Also the body of the gate; exists as a skill for ad-hoc human use |
| `review` | Show a draft, collect feedback, write corrections, request a revision |
| `cluster-corrections` | Read unresolved corrections, group them, propose guidelines |
| `add-content-type` | Walk a content person through adding a type, its examples and its criteria |

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

| Score | Stakes | What happens |
|---|---|---|
| 9-10 | low | Published. No reviewer. Audit line to Slack |
| 9-10 | medium or high | Review |
| 8 | any | Review |
| below 8 | any | Regenerate |
| compliance fail | any | Blocked, regardless of score |
| any single 0 | any | Blocked |

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
