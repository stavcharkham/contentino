# Rubric re-check, after the fixes

> The 2026-08-12 validation (`eval/rubric-validation.md`) said the rubric works but named two
> fixes. `RUBRIC.md` has been rewritten. This is what the fixes do to the same 47 items.
> Reproduce with `python3 eval/recheck.py`.

## What changed in the rubric

Three changes. Two were named by the validation. The third was flagged in it as lower priority
and is included because both chosen content streams touch pricing and eligibility language.

**1. Direct address is N/A where the format has no addressee.** Release notes, headlines, field
labels, pricing lists, aphorisms. Previously these scored 0, which punished the format rather
than the writing. This arrived as part of a larger change: the rubric now has a core that
applies everywhere plus questions belonging to each content type, and direct address moved out
of the core into the types.

**2. Register distinguishes commentary about legal text from legal text itself.** Casual
register inside operative legal or compliance text still scores 0. Casual register in
commentary about it is allowed.

**3. The compliance veto now catches contradicting known policy.** A statement can fail without
promising anything or dropping a disclaimer, if it contradicts what Lemonade tells the customer
elsewhere at the same moment about pricing, eligibility, or what their data is used for.

Two ambiguities the validation raised are also now written down, neither of which changes any
score: mechanics explicitly covers emoji stacking, and register owns exclamation mark
*placement* while mechanics owns the *count*.

## Method, and what it does not prove

The fixes are deterministic rules applied to the per-criterion scores already in
`eval/scores.md`. Nothing was re-scored by hand. Before recomputing, the script recomputes each
item's original total from its original criterion scores and checks it against the total
recorded in `eval/scores.md`: **47 of 47 match**, so the encoding is faithful to the original
pass and the deltas below are attributable to the fixes rather than to a transcription error.

**This is not an independent re-validation.** It confirms the fixes do what they were designed
to do, on the same items, using the same human judgments. It cannot tell us whether the fixes
introduced a new blind spot, because that would need fresh scoring.

**The new per-type criteria are entirely untested.** Character budget, action-verb consistency,
claim sourced, why now, and quote fidelity were added to `RUBRIC.md` and have never been scored
against anything. Only direct address, which already existed, moved. Everything below is
evidence about the core, not about the additions.

## Results

| | Before | After | Target |
|---|---|---|---|
| Real Lemonade mean | 8.80 | **9.49** | 9+ |
| Real mean, excluding the deliberate LEM-040 outlier | 8.91 | **9.56** | - |
| Off-brand mean | 4.42 | **4.50** | 5 or below |
| **Gap** | 4.38 | **4.99** | wide |

**Real items now band 32 publish (91%), 2 review (6%), 0 regenerate, 1 veto.** Before it was 22
publish (63%), 10 review, 2 regenerate, 1 veto. No genuine Lemonade copy lands in regenerate
any more.

**Off-brand items band 0 publish, 1 review, 8 regenerate, 3 veto.** Nothing off-brand reaches
publish, which was true before and still is.

### Per criterion

| Criterion | Real | Off-brand | Gap | Gap before |
|---|---|---|---|---|
| 1. Register match | 1.89 | 0.58 | 1.30 | 1.25 |
| 2. Humour boundary | 1.97 | 1.33 | 0.64 | 0.64 |
| 3. Plain language | 2.00 | 0.60 | 1.40 | 1.40 |
| 4. Direct address | 1.57 | 0.50 | **1.07** | 0.55 |
| 5. Mechanics | 1.94 | 1.25 | 0.69 | 0.61 |

Direct address roughly doubled its discriminating power, from 0.55 to 1.07. That is the
clearest evidence the fix was right: the criterion was not weak, it was being asked of content
that had no way to answer it. Given a population where the question makes sense, it separates.

**One disclosure.** The original report gives the off-brand mechanics mean as 1.33. Recomputing
from its own score table gives 1.25. The 15 individual mechanics scores in `eval/scores.md` sum
to 15, not 16. This is a small arithmetic slip in the original report, reported rather than
quietly corrected. It changes no conclusion in either document.

## Every item that moved

| Item | Source | Was | Now | Why |
|---|---|---|---|---|
| S-01 | LEM-042 | 8 review | 10 publish | release note, no addressee |
| S-03 | LEM-002 | 8 review | 10 publish | pricing list, no addressee |
| S-07 | LEM-045 | 8 review | 10 publish | release note, no addressee |
| S-16 | LEM-004 | 8 review | 10 publish | blog title, no addressee |
| S-24 | LEM-053 | 8 review | 10 publish | press headline, no addressee |
| S-37 | LEM-049 | 8 review | 10 publish | feature announcement, no addressee |
| S-46 | LEM-043 | 8 review | 10 publish | release note, no addressee |
| S-47 | LEM-044 | 8 review | 10 publish | release note, no addressee |
| S-19 | LEM-036 | 7 regenerate | 10 publish | register fix + no addressee |
| S-41 | LEM-038 | 7 regenerate | 10 publish | register fix + no addressee |
| S-27 | LEM-040 | 5 veto | 7 veto | score rose, still correctly vetoed |
| S-18 | OFF-011 | 5 regenerate | 5 **veto** | new compliance rule |
| S-38 | OFF-006 | 4 regenerate | 5 regenerate | release note, no addressee |

Two results worth pulling out.

**S-18 / OFF-011 now vetoes.** The original report called it "arguably the most dangerous item
in the whole set," because it told a customer their answers "may be used to determine coverage
eligibility and pricing" while real Lemonade says at that exact moment that it "won't affect
your price or eligibility." It passed the old veto on a technicality. It fails the new one.

**The inversion is gone.** Before, an off-brand rewrite (OFF-005, scoring 8) out-scored two
genuine Lemonade quotes (LEM-036 and LEM-038, both 7). Now no off-brand item out-scores any
real item. OFF-005 remains the single off-brand item in the review band, for the same honest
reason as before: it is two field labels, so almost nothing about it can go wrong except the
one inserted piece of jargon that plain language correctly catches.

## What is still outstanding

**The two-person calibration has not happened.** `eval/scoring-set.md` Part 3 is a 20-item
worksheet and `eval/scores.md` is its hidden answer key. Every number in both documents comes
from one scorer, so "two people would agree" is still an assumption. This is the only part of
calibration that one person cannot do alone.

**The model has not scored anything.** Step 3 of calibration is that a model reproduces the
human numbers. Until then, everything here is evidence about a rubric a person applies, not
about the gate we are going to build.

**The five new per-type criteria are unvalidated**, as above.
