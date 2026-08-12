# Brief 03 - Does the rubric actually work?

**This is a validation pass, not research. Score, measure, report. Do not edit `RUBRIC.md`,
and do not edit any file other than the three named below.**

## Context you need

We are building an internal content tool for Lemonade. It generates content, scores it
against a brand profile, and only publishes what passes. The scoring lives in `RUBRIC.md`:
six criteria, five scored 0-2, one a pass/fail veto. 9-10 publishes on its own, 8 goes to a
human, below 8 is regenerated.

Everything downstream assumes that rubric works. Nothing has tested it. That is your job.

`research/lemonade-corpus.md` holds 54 excerpts of real Lemonade copy, each with an id
(LEM-001 and so on), a content type, a register tag, and a source. This is genuine published
copy from a company whose voice we are trying to encode. **Real Lemonade copy should score 9
or 10.** If it does not, the rubric is wrong, not the copy.

## The trap to avoid

A rubric that scores everything 9 or 10 would pass that test and be worthless. What we
actually need to know is whether the rubric **discriminates** - whether it separates
on-brand copy from off-brand copy. So you will score two populations and compare them, not
just one.

## What to produce

Three files. Create the `eval/` directory.

1. `eval/scoring-set.md` - the items you scored, before any scores
2. `eval/scores.md` - every score, criterion by criterion
3. `eval/rubric-validation.md` - the report and the verdict

Read `RUBRIC.md` in full before you start. Do not modify it. If you find a problem with a
criterion, that goes in the report as a finding.

---

## Part 1 - Build the scoring set

### 1a. Pick the real items

From `research/lemonade-corpus.md`, select the excerpts that can actually be scored.

**Exclude these:**
- Anything second-hand. LEM-032, LEM-033 and LEM-034 are reviewers paraphrasing Lemonade,
  not Lemonade's own wording. Check for others and exclude any you find.
- Excerpts marked as resting on a search summary rather than a confirmed source.
- Fragments too short to carry a voice. A single word button label cannot be scored on five
  criteria.

Aim for **35-40 real items**. Record what you excluded and why.

### 1b. Tag each item with a stakes level

Criterion 1 cannot be scored without knowing what was at stake. Assign every item one of:

- **low** - nothing at risk. Release notes, small talk, loading states
- **medium** - the user is mid-task. Forms, coverage data, confirmations
- **high** - legal, financial or compliance weight. Disclaimers, fraud steps, anything
  affecting a claim or a price

The corpus register tags (`performing`, `working`, `covering`) are a starting point, not the
answer. Judge each one.

### 1c. Write an off-brand twin for 12 of them

Pick 12 real items spread across stakes levels. For each, rewrite the same message in
generic corporate AI voice: hedged, formal, no contractions, no name, stock phrasing,
exclamation marks in the wrong places, jargon left untranslated or over-translated.

Same information, wrong voice. These are your negative controls. Give them ids OFF-001
onwards and record which real item each one twins.

Matched pairs matter here. Holding the content still while changing only the voice is the
cleanest test of whether the rubric is measuring voice or measuring something else.

### 1d. Shuffle and strip

Write all items to `eval/scoring-set.md` in random order, showing only the id, the text and
the stakes level. **No labels indicating which are real and which are off-brand.** Keep the
mapping out of that file.

You wrote the off-brand items, so you cannot be fully blind. Do it anyway. Scoring an
unlabelled shuffled list is closer to honest than scoring two labelled piles.

---

## Part 2 - Score

Score every item in `eval/scoring-set.md` against all six criteria in `RUBRIC.md`.

Score them yourself, reasoning directly. **Do not write a script that makes API calls.** We
have $50 of budget for the whole project and this pass should cost nothing.

For each item record: the six criterion scores, the total out of 10, the compliance
pass/fail, the resulting band (publish / review / regenerate), and one line of reasoning per
criterion where the score was not 2.

### When a criterion does not apply

Some criteria will not apply to some items. Direct address means little on a section header.
Mark it **N/A** rather than inventing a score, and note it.

Track how often each criterion goes N/A. If a criterion is N/A on more than 40% of items,
that is a finding about the rubric, not about the copy. Say so.

Score out of the criteria that applied, and state the denominator.

---

## Part 3 - A blind worksheet for a human

`RUBRIC.md` says two people should score independently before the model's numbers are
trusted. Set that up so it costs the human as little as possible.

At the end of `eval/scoring-set.md`, add a section listing **20 items** chosen at random,
mixing real and off-brand, with the text, the stakes level, and empty score slots for all
six criteria.

**Your own scores for those 20 must not appear anywhere in that file.** They go in
`eval/scores.md` like everything else. The point is that a person can score them without
being anchored by yours.

---

## Part 4 - The report

`eval/rubric-validation.md`. Answer these in order.

### 1. Did real Lemonade copy score high?
Mean and range for the real items. How many landed in each band. **Any real Lemonade excerpt
scoring below 8 is a finding** - list every one, with the criterion that dragged it down and
your honest read on whether the copy is unusual or the rubric is wrong.

### 2. Did the rubric separate the two populations?
Mean for real items against mean for off-brand items. The gap is the headline number in this
whole exercise. Also report the overlap: how many off-brand items scored 8 or above, and how
many real items scored below the worst off-brand item. **Overlap is the number that matters.**
A rubric with a good average gap and heavy overlap does not work.

### 3. Which criteria did the work?
Per criterion, the mean for real items and the mean for off-brand items. A criterion that
scores both populations the same is dead weight and should be named as such. A criterion that
separates them cleanly is the one carrying the rubric.

### 4. Did the veto ever fire?
How many items failed compliance, and were they the right ones. If it never fired on any
item, say so. An untested veto is not a working veto.

### 5. Where was scoring hard?
Criteria you found ambiguous, wording you had to interpret, items where you could defend two
different scores. Be specific and quote the rubric's own wording. This is the input for
rewriting criteria, and vague feedback here wastes the rewrite.

### 6. Stakes distribution
How many items at each stakes level, and whether the rubric behaved differently across them.
If high-stakes items scored systematically lower, we need to know whether that is real or an
artifact.

### 7. Verdict
Direct answer to one question: **can this rubric be trusted to gate publication?** Yes, no,
or yes with named changes. Do not hedge. If the answer is no, say what specifically has to
change.

---

## What "the rubric works" looks like

Concrete targets, so the verdict is not a matter of taste:

- Real Lemonade copy averages **9 or above**
- Off-brand twins average **5 or below**
- **Zero or one** off-brand item reaching 8 or above
- No criterion N/A on more than 40% of items
- No criterion scoring real and off-brand within 0.3 of each other

Miss any of these and say which, plainly. A failed validation caught now is worth far more
than a passed one we did not test properly, because everything we build after this trusts
the number.

## Rules

- **Do not edit `RUBRIC.md`.** Problems go in the report. A rubric quietly adjusted until it
  passes has proven nothing.
- **Do not make API calls.** Score directly.
- Show your reasoning for every score below 2. A score with no reason cannot be checked.
- If you cannot score an item, say why rather than guessing.
- Do not soften the verdict. This exercise only has value if it is capable of failing.
