# Rubric

How generated content gets scored. Six criteria, three of them checkable by machine, one of
them a veto. Written to be applied by a person in under a minute and by a model afterwards.

This is the human-readable source. The eval config is generated from it, not the other way
round.

## Why it looks like this

Three constraints shaped it.

**A person has to be able to score it consistently.** Two people scoring the same draft
should land on the same number without training or a calibration meeting. That rules out
five and ten point scales, which spread disagreement, and it rules out criteria phrased as
adjectives. Every criterion below is a question with an observable answer.

**Most of it has to be free.** We have $50 of API budget. Criterion 5 runs in code and costs
nothing. Criteria 1, 2 and 3 need a model. Cheap checks run first and a draft that fails them
never reaches a paid one.

**It has to match the brand evidence.** Criteria 1, 2 and 3 exist because the Lemonade
research found those specific failure modes, not because they sounded like reasonable things
to measure. See `RESEARCH.md`.

## The criteria

Each is scored **0, 1 or 2**, except criterion 6, which is pass or fail.

### 1. Register match
Is the tone right for what is at stake in this moment? Playful when nothing is at risk, flat
and functional for forms and data, careful when there is legal or financial weight.

- **0** - wrong register for the stakes
- **1** - right register but drifts
- **2** - correct and holds throughout

The most important criterion. Lemonade's voice switches by stakes rather than by content
type, and the switch can happen between two adjacent sentences.

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
mechanics fully and leaves coverage terms like "deductible" standing.

### 4. Direct address
Names the person, the pet, the car, the actual thing. Uses "you" and "we".

- **0** - generic
- **1** - direct but impersonal
- **2** - specific to this reader and their situation

### 5. Mechanics
Caps on buttons and headers only. One exclamation mark maximum. Contractions present. Em
dashes rare. Sentence length in band.

- **0** - two or more violations
- **1** - one violation
- **2** - clean

Runs in code. No model, no cost.

### 6. Compliance safety - veto
Does it promise an outcome, guarantee that a claim gets paid, or drop a disclaimer that
belongs there?

- **Pass / fail.** A fail blocks publication regardless of every other score.

Shaped as prohibition rather than positive criteria on purpose. We have thin evidence of what
Lemonade's high-stakes copy says and good evidence of what it never does.

## Scoring and thresholds

Criteria 1 to 5 give a score out of 10. Criterion 6 gates it.

| Score | What happens |
|---|---|
| 9-10 | Publishes. Low-stakes content goes out with nobody watching |
| 8 | A human reviews it |
| Below 8 | Regenerated. No human looks at it |

Two hard rules on top:

- **Any single 0 blocks**, whatever the total.
- **A compliance fail blocks**, whatever the total.

**Why nothing below 8 reaches a person.** Fixing mediocre output is the overhead this product
exists to delete. A human editing a 6 into an 8 is the exact cost we are trying to remove, and
regenerating is cheaper than their attention.

## What changes by content type

Nothing in the questions. The same six apply everywhere.

What changes is the consequence. Low-stakes content at 9 or above publishes itself. High-stakes
content never auto-publishes at any score. It arrives as a better draft and a person owns it.

One rubric you can hold in your head. Stakes decide what happens to the score, not which
questions get asked.

## Calibrating it

In order, before any of this is trusted:

1. **Two people score the same 20 pieces independently.** Where they disagree often, the
   criterion is badly worded. Fix the wording rather than averaging the disagreement away.
2. **Score the real Lemonade corpus.** Genuine Lemonade copy should come out at 9 or 10. If
   it does not, the rubric is wrong. This costs an afternoon and turns the research corpus
   into the thing that validates the scoring.
3. **Then let the model score the same set.** Its job is to reproduce the human numbers. If it
   cannot, suspect the rubric before the model.
