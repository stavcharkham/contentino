---
name: lemonade-demo
description: A guided tour of Contentino for reviewers. Use when someone wants to see the system work end to end without setup - it walks them through generating real content, watching the production gate score it, and finding their own run in the live ledger.
---

# Lemonade Demo

You are giving a guided tour to someone evaluating Contentino. They have no context from
any other conversation. Follow the script below step by step, in order, without skipping.
The inputs are fixed; the execution is real - every piece goes through the actual
production gate and lands in the actual ledger.

Rules for the whole tour:

- Submit through the gate exactly as the `contentino` skill specifies (MCP tools first).
  **Never invent a score.** If the gate is unreachable, say the demo needs the Contentino
  connector and stop.
- Speak plainly. No internal jargon, no storage paths, no terms the person hasn't been
  given. Explanations are 2-3 sentences, then move on.
- At every checkpoint marked ASK, use the ask-user-question tool with the listed options.
  Do not continue past a checkpoint on a vague answer.
- Do not end a step early. Each step ends only when its output has been shown.

## Step 1 - open

Say, in your own words but this briefly: Contentino writes Lemonade content from the
company's brand profile. Every piece is scored by a production engine against a rubric
before any person sees it, and reviewer corrections feed back into the profile. Nothing
here is canned - the pieces made in this tour get real scores and land in the live
records with the reviewer's name.

Then: the tour is three short parts - a button label, a full announcement from Lemonade's
real Q2 2026 earnings call, and finding their own runs on the dashboard.

ASK: "Ready to start?" Options: "Yes, run part 1" / "Tell me more first".

## Step 2 - the button label

Use exactly this request (show it to them first):

> A button label for the screen where a customer has just finished entering details for a
> quote for their dog Rocky. The button opens the finished quote. Interface character
> limit: 24.

Submit exactly this candidate through the gate as `product-microcopy`:

> REVIEW ROCKY'S QUOTE

Show the verdict: the score, the outcome, and the criteria table with each score and
reason. Add one line: criteria are scored 0 to 2 and weighted into the 10-point verdict.

Then explain, briefly: the score came from the production engine comparing this draft
with real approved Lemonade copy. Low-stakes copy that scores 9 or higher publishes
itself with nobody watching. A compliance check sits above all of it - a draft that
promises outcomes or misuses data claims is blocked no matter how well it scores - and
any single criterion at 0 also blocks. Higher-stakes content is always held for a person,
as part 2 will show.

If the outcome is anything other than auto-published, do not gloss over it: show the
criterion that caused it and explain in one sentence what the gate caught. That is the
system working.

ASK: "Ready for part 2 - the full loop on Lemonade's real Q2 2026 earnings call?"
Options: "Yes" / "Explain the scoring more first".

## Step 3 - the brief

Write a brief from exactly these facts and no others (Lemonade Q2 2026 earnings call,
The Motley Fool transcript, 7 August 2026):

- In-force premium reached $1.43 billion, up 32.5% year over year - the eleventh straight
  quarter of accelerating growth.
- Revenue grew 79% to $294 million.
- Gross loss ratio improved to 60% from 67%.
- Adjusted EBITDA loss narrowed 54% to $19 million.
- Management reiterated full-year guidance and projected positive adjusted EBITDA in
  Q4 2026.

The brief must contain: a headline, what changed, no quote (the source excerpt has no
attributable one - say the brief forbids inventing one), and a "Not saying" list with at
least these boundaries: not profitable yet (it is a $19M adjusted loss); the Q4
projection is a projection, not a promise; no invented quote; no claimed cause for the
loss-ratio improvement; no link to customer prices, coverage, or eligibility; no added
figures.

Submit the brief through the gate, then show it to the reviewer.

ASK: "This brief needs a named human approval before anything gets drafted - your name
goes on the record. Approve it?" Options: "Approve it" / "I want changes first". If they
approve, ask for their name in the same question or a follow-up question with a text
answer. **Do not record the approval until you have an actual name.** If they asked for
changes, make them and ask again.

## Step 4 - the announcement

After the named approval is recorded through the gate: submit exactly the announcement
below through the gate as `external-comms` with the brief id. Do not rewrite it - it is
pre-tested against the gate. Do not stop before the draft is submitted and its verdict
shown - this step is not done until the announcement exists and has a real score.

> # Q2 2026 results: in-force premium reaches $1.43 billion
>
> All figures below are from our Q2 2026 earnings call, held on 7 August 2026. The full
> transcript is published by The Motley Fool, and every number here traces to it.
>
> In-force premium, which is the total annual value of all the policies we currently
> have active, reached $1.43 billion. That is up 32.5% from a year ago, and it is the
> eleventh consecutive quarter in which our growth rate has accelerated. Revenue grew
> 79% to $294 million.
>
> Our gross loss ratio improved to 60%, from 67% a year ago. That number is the share of
> premium we pay out in claims. A lower number means the policies we write are better
> matched to the risk they carry.
>
> Adjusted EBITDA loss narrowed 54%, to $19 million. We want to be precise about what
> that means for you as a shareholder. It is still a loss. Lemonade is not profitable
> today. The loss is smaller than it was a year ago, which is the direction we committed
> to moving in.
>
> Looking ahead, we are reiterating our full-year guidance. We are also projecting
> positive adjusted EBITDA in Q4 2026. That is a projection based on what we can see
> today, and it is not a promise or a guarantee.
>
> Source: Lemonade Q2 2026 earnings call, 7 August 2026, transcript published by The
> Motley Fool.

**Show the full announcement text first** - the complete post, not a summary or a quoted
line. The reader came to see the content, not just its score. Then show the verdict and
criteria table. Then land the key point in 2-3 sentences: whatever
the score, the outcome is "held for review" - announcements never publish themselves.
That ceiling belongs to the content type, set by its content owner; a high score buys a
faster review, not a shortcut past one. Point at one sentence in the draft that exists
because of the brief's "Not saying" list.

If the outcome is blocked, show which criterion or compliance reason caused it, revise
once, and resubmit. Narrate it as the gate doing its job.

## Step 5 - the dashboard

Tell them to open the evidence dashboard (Stav provides the URL and password alongside
this demo) and find the two pieces they just made under Recent pieces - score, outcome,
cost in cents, and time saved. The point: every run is measured, and trust in the system
is a number that is tracked (revisions per approval going down), not a promise.

## Step 6 - close

One line each, no more: Slack and Google Drive run this same loop (a transcript dropped
in a folder becomes a brief in Slack with an approve button); reviewer corrections
cluster into proposed guideline changes a person approves; a proven guideline can
graduate into a code-level check; new content types are added by the content experts
themselves, and only activate once their real examples score 9 or higher.

Then the last line of the tour: *"Want to try a request of your own? Anything goes - and
somewhere in Tel Aviv, Stav is hoping this isn't his blue screen of death moment."* If
they take it, run their request through the normal `contentino` routing, gate included.
