# Rubric

How generated content gets scored. A core that applies to everything, plus questions belonging
to each content type. Written to be applied by a person in under a minute and by a model
afterwards.

This is the human-readable source. The eval config is generated from it, not the other way
round.

## Why it looks like this

Three constraints shaped it.

**A person has to be able to score it consistently.** Two people scoring the same draft should
land on the same number without training or a calibration meeting. That rules out five and ten
point scales, which spread disagreement, and it rules out criteria phrased as adjectives. Every
criterion below is a question with an observable answer.

**Most of it has to be free.** We have $50 of API budget. Mechanics runs in code and costs
nothing. Register, humour and plain language need a model. Cheap checks run first and a draft
that fails them never reaches a paid one.

**It has to match the brand evidence.** The core criteria exist because the Lemonade research
found those specific failure modes, not because they sounded like reasonable things to measure.
See `RESEARCH.md`.

## The core

Five questions, asked of every content type. Each scored **0, 1 or 2**, except compliance,
which is a veto.

### 1. Register match
Is the tone right for what is at stake in this moment? Playful when nothing is at risk, flat
and functional for forms and data, careful when there is legal or financial weight.

- **0** - wrong register for the stakes
- **1** - right register but drifts
- **2** - correct and holds throughout

The most important criterion. Lemonade's voice switches by stakes rather than by content type,
and the switch can happen between two adjacent sentences.

**The stakes belong to the text, not to its subject.** Casual register *inside* operative legal,
compliance or claims text scores 0. Casual register in commentary *about* that text is allowed
and can score 2. "Insurance policies are the ultimate word salad" is marketing written about
legal documents; it is not a legal document. Added after the 2026-08-12 validation scored two
genuine Lemonade quotes into the regenerate band for this exact confusion.

**This criterion owns exclamation mark *placement*.** One landing on a mundane fact rather than
an emotional peak is drift. Mechanics owns the *count*.

### 2. Humour boundary
Jokes belong where nothing is at stake. They never touch how the company judges or affects
someone.

- **0** - a joke lands where it should not
- **1** - humour missing where it was safe to use
- **2** - placed correctly

Deliberately asymmetric. Too dry costs a point. Playful about a denial is a zero.

### 3. Plain language calibration
Does it translate what Lemonade translates and leave alone what Lemonade leaves alone?

- **0** - invented a folksy substitute for a term they keep, or dumped jargon they would have
  explained
- **1** - inconsistent within the same piece
- **2** - matched

Exists because over-translating is the most likely failure. Lemonade translates pricing
mechanics fully and leaves coverage terms like "deductible" standing. Validation found this the
sharpest discriminator of the five.

### 4. Mechanics
Caps on buttons and headers only, never in body copy. Contractions present. Em dashes rare.
At most one exclamation mark, never on bad news. At most one emoji; two or more stacked is a
violation.

- **0** - two or more violations
- **1** - one violation
- **2** - clean

Runs in code. No model, no cost.

**Sentence length and character budget come from the content type**, because a length band means
nothing in twelve characters. The rules above are universal; the numbers are not.

### 5. Compliance safety - veto
Does it do any of these?

- Promise an outcome, or guarantee that a claim gets paid
- Drop a disclaimer that belongs there
- Make an unsubstantiated claim about how the company judges a customer
- **Contradict what Lemonade tells the customer elsewhere at the same moment** - what their
  data is used for, what affects their price, what affects eligibility

**Pass / fail.** A fail blocks publication regardless of every other score.

Shaped as prohibition rather than positive criteria on purpose. We have thin evidence of what
Lemonade's high-stakes copy says and good evidence of what it never does. The fourth rule was
added after validation found an item that would have passed the veto while directly
contradicting known policy, which made it the most dangerous piece in the set.

## What each content type adds

Content types ask their own questions on top of the core. These live in the type's own folder
in the profile, next to its guidelines and examples.

**Product micro-copy**

- *Direct address.* Names the person, the pet, the car. Uses "you" and "we".
  0 generic, 1 direct but impersonal, 2 specific to this reader and their situation.
- *Character budget.* Fits the space the interface actually has.
- *Action verb consistency.* Matches the verb the rest of the product uses for this action.

**External comms**

- *Direct address.* Same scale as above.
- *Claim sourced.* The central factual claim traces to something real and citable.
- *Why now.* A reader can tell why this is being said today.
- *Quote fidelity.* An attributed quote sounds like the person it is attributed to.

## Scoring

Every applicable criterion scores 0, 1 or 2. **A criterion that does not apply scores N/A and
is excluded**, rather than scoring 0.

```
score out of 10  =  sum of applicable scores ÷ (2 × number of applicable criteria) × 10
```

N/A matters more than it looks. Direct address is N/A on anything with no addressee by design:
release notes, headlines, field labels, pricing lists, aphorisms. Scoring those as 0 punishes
the format rather than the writing, and before this rule existed it was single-handedly holding
genuine Lemonade copy out of the publish band.

| Score | What happens |
|---|---|
| 9-10 | Publishes. Low-stakes content goes out with nobody watching |
| 8 | A human reviews it |
| Below 8 | Regenerated. No human looks at it |

Three hard rules on top:

- **Any single 0 blocks**, whatever the total.
- **A compliance fail blocks**, whatever the total.
- **Regeneration stops after 3 attempts** and escalates to a person with the scores attached.
  Uncapped retries are how $50 gets spent on one stubborn string.

**Why nothing below 8 reaches a person.** Fixing mediocre output is the overhead this product
exists to delete. A human editing a 6 into an 8 is the exact cost we are trying to remove, and
regenerating is cheaper than their attention.

## What changes by content type

The core five never change. What changes is which extra questions get asked, what the mechanics
numbers are, and what happens to the score.

Low-stakes content at 9 or above publishes itself. High-stakes content never auto-publishes at
any score. It arrives as a better draft and a person owns it.

One core you can hold in your head. Stakes decide what happens to the score; the content type
decides which questions get added.

## Calibrating it

1. ~~**Score the real Lemonade corpus.**~~ Done 2026-08-12. Real copy 8.80 against off-brand
   4.42, a gap of 4.38. The compliance veto correctly fired on Lemonade's real deleted 2021
   AI-fraud tweet, which is the strongest single result in the exercise. Two criteria were
   named as needing fixes, and this file is the fixed version. Re-check in
   `eval/rubric-recheck.md`: real copy now scores 9.49, gap 4.99.
2. **Two people score the same 20 pieces independently.** Where they disagree often, the
   criterion is badly worded. Fix the wording rather than averaging the disagreement away. The
   worksheet is `eval/scoring-set.md` Part 3 and the answer key is `eval/scores.md`. Still
   outstanding, and it is the only part of calibration one person cannot do alone.
3. **Then let the model score the same set.** Its job is to reproduce the human numbers. If it
   cannot, suspect the rubric before the model.
