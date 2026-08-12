# Rubric validation - report

> Scored `eval/scoring-set.md` against `RUBRIC.md`. Full scores and reasoning in
> `eval/scores.md`. `RUBRIC.md` was not edited. Two process errors are disclosed in
> `eval/scores.md` rather than fixed after the fact - a duplicated row (S-33) and one real
> item (LEM-025) dropped from the table by mistake during construction. The effective scored
> population is **47 items: 35 real Lemonade excerpts, 12 off-brand rewrites.**

## 1. Did real Lemonade copy score high?

**Mean: 8.80. Range: 5-10** (the 5 is the deleted 2021 AI-fraud tweet, LEM-040, deliberately
included as the corpus's own worst case - see Part 4). Excluding that one intentional
outlier, the range is **7-10**.

Band split: 22 of 35 (63%) publish outright, 10 (29%) land in review, 2 (6%) would be
regenerated, 1 is vetoed.

**This misses the 9+ target, by 0.20.** Every item below 9 is accounted for and none of it
looks like noise:

- **Ten items scored exactly 8**, and nine of those ten lost the point on the same
  criterion: direct address, on content that structurally has no addressee - release notes
  (LEM-042, 043, 044, 045, 049), a pricing list (LEM-002), a blog title (LEM-004), a zodiac
  joke (LEM-023, 024), and a press headline (LEM-053). These are all genuine, confirmed
  Lemonade copy that a person would call on-brand without hesitation. The rubric is
  penalising a structural property of the format, not a voice failure.
- **Two items, both real, scored 7 and land in regenerate:** LEM-036 ("Insurance policies
  are the ultimate word salad") and LEM-038 ("No document is 'readable' if it's so long that
  no one actually reads it"). Both are aphoristic, meta-commentary about Lemonade's own
  plain-language mission rather than operative legal text. Register criterion scored them 1
  rather than 2, because they read as casual/clever applied to a legal-adjacent subject, and
  the criterion's wording doesn't have room for "this specific kind of legal-adjacent
  commentary is allowed to be casual." My honest read: **the copy is fine, the criterion's
  wording is too coarse for this edge case.** See Part 5.
- **One item is correctly vetoed** (LEM-040) - discussed in Part 4, this is the strongest
  result in the whole exercise, not a problem.

## 2. Did the rubric separate the two populations?

**Real mean 8.80 vs off-brand mean 4.42 - a gap of 4.38 out of 10.** That's the number that
matters most, and it's a wide, clean gap.

**Overlap: exactly one off-brand item reached the review band (8) - OFF-005, the "Deductible
Amount (Standard) / (Named Storm / Hurricane Peril)" rewrite.** Its only real difference from
the genuine LEM-010 is one inserted phrase of industry jargon ("Named Storm / Hurricane
Peril") that Lemonade's actual copy doesn't carry. Everything else about it - flat working
register, no jargon substitution error elsewhere, clean mechanics - is structurally identical
to the real item, because the real item is itself just two short field labels with very
little surface to get wrong. **This is informative, not alarming:** it shows the plain-
language criterion catching a genuinely subtle over-jargon insertion correctly (it's the only
reason this item didn't score higher), while also showing that thin, label-length content
gives every other criterion almost nothing to work with. The target was "zero or one" - we
landed exactly on the boundary.

Two real items (LEM-036, LEM-038, both scoring 7) sit below OFF-005's 8. That means a
generic-corporate rewrite of a real Lemonade message can, in one case, out-score a genuine
Lemonade quote. That's a real finding and it should inform the fix in Part 7, not be
smoothed over.

## 3. Which criteria did the work?

| Criterion | Real mean | Off-brand mean | Gap |
|---|---|---|---|
| 1. Register match | 1.83 | 0.58 | **1.25** |
| 2. Humour boundary | 1.97 | 1.33 | 0.64 |
| 3. Plain language calibration | 2.00 | 0.60 | **1.40** |
| 4. Direct address | 1.00 | 0.45 | 0.55 |
| 5. Mechanics | 1.94 | 1.33 | 0.61 |

**Plain language calibration and register match are carrying the rubric.** Plain language in
particular is close to a perfect discriminator among the items it applies to (real mean a
clean 2.00, meaning every applicable real item scored maximum) - it's the criterion doing the
most precise work, largely because it was the easiest to write off-brand twins against: every
off-brand rewrite that reintroduced jargon Lemonade avoids, or invented jargon Lemonade never
uses, got caught.

**Direct address is the weakest of the five, on both ends.** Its real-item mean is only 1.00
out of 2 - not because the copy is bad, but because most content types in this corpus
(release notes, headlines, field labels, legal fragments) have no reader to address at all.
It still separates the populations (real 1.00 vs off-brand 0.45), so it isn't dead weight,
but it's doing the least discriminating work per point of ceiling, and it's the single
biggest reason the real-item average missed 9+. See Part 7.

**Humour boundary is weaker than expected**, and the reason is informative: most of the
off-brand twins failed by going flat and generic rather than by cracking an inappropriate
joke. The rubric's humour criterion is built to catch a joke landing where it shouldn't (a 0)
more cleanly than it catches warmth being absent where it was safe (a 1) - and "generic
corporate AI voice," which is the actual failure mode we're trying to catch in practice,
mostly presents as absence rather than misplaced presence. It still separates the
populations, just not as sharply as register or plain language.

## 4. Did the veto ever fire?

**Yes, three times: once on real copy, twice on off-brand.** All three look correct on
inspection.

**LEM-040 is the one that matters most in this whole report.** It's the real, deleted 2021
tweet where Lemonade claimed its AI "can pick up non-verbal clues" of fraud that traditional
insurers can't - the exact statement that caused a public discrimination backlash, still
indexed and citable five years later. **The rubric's compliance criterion fails it, correctly,
for exactly the reason it actually failed in public: an unsubstantiated claim about how the
company's AI judges a customer.** If this rubric had existed and been applied before that
tweet went out, it would have caught it. That's the single strongest piece of evidence in
this whole exercise that the rubric is measuring something real rather than a proxy for it.

The two off-brand vetoes (OFF-002, dropping the vet-chat liability disclaimer in favour of
false reassurance; OFF-012, an exaggerated "lie detector" rewrite of the same AI-fraud claim)
both fail for the reasons they were written to fail.

**A related item did not trip the veto and arguably should have:** OFF-011 states that
answering pet-health questions "may be used to determine coverage eligibility and pricing,"
which directly contradicts what real Lemonade tells the customer at that exact moment
(LEM-022: "won't affect your price or eligibility"). It isn't a promise, an overclaim, or a
missing disclaimer in the rubric's literal wording, so I scored it a narrow pass - but it's
arguably the most dangerous item in the whole set, because it would clear the veto while
contradicting known policy. **This is a real gap in criterion 6's coverage, named in Part 5
and Part 7.**

## 5. Where was scoring hard

- **Register vs. mechanics boundary.** LEM-019's single exclamation mark lands on a fairly
  mundane fact rather than an emotional peak. That's clearly a real (if minor) drift, but it
  isn't a hard mechanics violation - one exclamation mark satisfies the "maximum one" rule.
  I ended up scoring it under register, but the rubric doesn't say which criterion owns
  "correct exclamation *placement*" versus "correct exclamation *count*."
- **Legal-adjacent meta-commentary.** LEM-036 and LEM-038 are both real, confirmed quotes
  that are casual/aphoristic about the *idea* of legal documents rather than being operative
  legal text themselves. The register criterion, as worded, doesn't distinguish "casual about
  a legal document" from "casual inside a legal document" - and those are genuinely different
  things. Both real items lost a point here and landed in regenerate as a result.
- **Emoji stacking.** LEM-023 and LEM-024 both use two or three stacked emoji on a zodiac
  joke. The mechanics criterion's wording covers exclamation marks explicitly and doesn't
  mention emoji at all. I scored these as a minor mechanics violation by analogy to the
  "ration exclamation marks" spirit, but that's an inference, not something the rubric states.
- **Compliance's blind spot for factual contradiction.** Covered in Part 4 - OFF-011
  contradicts known Lemonade policy without technically promising or omitting anything, and
  the veto as worded doesn't catch that.
- **Harsh-but-not-false legal language** (OFF-004, OFF-009). Both invent generic-insurer
  legal severity Lemonade's real copy doesn't carry ("penalty of policy voidance," "actuarial
  soundness"), but neither one promises anything false or drops a required disclosure. I
  passed both on compliance and let register and plain-language calibration catch the
  failure instead, which they did - but it's worth naming that "tonally harsh but technically
  accurate" sits outside what the veto is built to catch.

## 6. Stakes distribution

35 real items: **17 low, 13 medium, 5 high.**

| Stakes | Mean score |
|---|---|
| Low | 8.53 |
| Medium | 9.31 |
| High | 8.4 (9.25 excluding the LEM-040 veto case) |

**The worry that high-stakes content would score worst was not borne out.** Medium-stakes
content actually scored highest, and high-stakes content, when handled the way real Lemonade
evidence shows it usually is, scores just as well (9.25 excluding the one deliberate failure
case). Low-stakes content scored *lowest* on average, and for a specific, identifiable
reason: it's dominated by release notes, headlines and taglines, which is exactly the content
that structurally can't score well on direct address (Part 3). This is a reassuring result
for the product: the area of highest business risk is not where the rubric currently
struggles.

## 7. Verdict

**Yes, with two named changes.**

The rubric does its core job. It separates real Lemonade voice from generic off-brand
rewrites by a wide, clean margin (8.80 vs 4.42), the criterion built to catch over-jargoning
is nearly a perfect discriminator, and the compliance veto correctly fires on the one item in
this entire exercise with a real, historical, public consequence attached to it. That last
result on its own is enough to trust the shape of this rubric.

It misses one of the five numeric targets, and both misses trace to the same criterion:

1. **Direct address structurally penalises content with no addressee** - release notes,
   headlines, field labels, legal fragments. Nine of the ten real items that landed in
   review rather than publish lost their only point here, on copy nobody would call
   off-brand. **Fix: criterion 4 should score N/A rather than 0 for content types that don't
   address a reader by design**, the same way plain language already goes N/A when no
   jargon is present. Scoring absence-of-addressee as a defect is punishing the format, not
   the writing.

2. **The register criterion has no room for legal-adjacent meta-commentary.** LEM-036 and
   LEM-038 are genuine Lemonade copy that reads casually about legal documents without being
   legal documents themselves, and both lost a point they arguably shouldn't have. **Fix:
   criterion 1's wording should distinguish "casual register applied to the operative legal
   or compliance text itself" (should score low) from "casual register applied to
   commentary about that text" (should be allowed).**

A smaller, lower-priority note: the compliance veto has a blind spot for content that
contradicts known policy without technically promising or omitting anything (OFF-011). That
didn't cost this validation any of its five targets, but it's worth a rule addition before
the rubric gates anything that touches pricing or eligibility language specifically.

None of this requires touching criteria 2, 3 or 5, and none of it changes the thresholds in
`RUBRIC.md`. The core mechanism - especially plain-language calibration and the compliance
veto - is validated and should not be touched. The two fixes above are narrow, and I'd expect
the real-item mean to clear 9.0 once they land, since nine of the ten review-band items and
both regenerate-band items would move up.
