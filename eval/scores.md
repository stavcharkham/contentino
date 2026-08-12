# Rubric validation - scores

> Every item in `eval/scoring-set.md`, scored against `RUBRIC.md`, with the id mapping back
> to `research/lemonade-corpus.md` (LEM-###) or the off-brand twins (OFF-###) written for
> this pass. Scored directly, no API calls. This file is the answer key - it should not be
> consulted before an independent human score of the Part 3 worksheet.

## Two process errors, disclosed rather than fixed

**S-33 is an invalid, duplicated row.** While assembling `eval/scoring-set.md` I mis-pasted a
fragment of S-01's text ahead of S-33's intended content, and S-33's actual text ends up
identical to S-38 (both are OFF-006, "This update contains minor bug fixes..."). S-33 is
excluded from every statistic below. OFF-006 is scored once, at S-38.

**LEM-025 was dropped from the table by mistake.** It was selected and scored during planning
(the "ANALYZING YOUR DATA... Tail-oring coverages... Feeding Fluffy" loading screen) but never
placed into `eval/scoring-set.md`. Rather than quietly re-inserting it after the fact, I'm
reporting the scored population as it actually exists in the table: **35 real items, 12
unique off-brand items, 47 valid rows total.** For the record, LEM-025's score would have
been Register 2, Humour 2, Plain language N/A, Direct address 1, Mechanics 2 - total 9,
publish band - which would not have changed any conclusion below. Recomputing the aggregates
with it included versus excluded moved the real-item mean by less than 0.01, so nothing here
turns on this error, but it's a real slip in following my own instructions and it's recorded
as one.

**Effective scored population: 47 items (35 real, 12 off-brand).**

---

## Scores

Scale: 0/1/2 per criterion, or **N/A**. Compliance is Pass/Fail. Total is rescaled to /10
when one or more criteria are N/A (sum of applicable scores ÷ max possible for applicable
criteria × 10, rounded). Band: 9-10 publish, 8 review, below 8 regenerate, or **VETO** if
compliance fails (overrides the score).

| id | source | type | stakes | C1 Reg | C2 Hum | C3 Plain | C4 Addr | C5 Mech | Total/10 | Compliance | Band |
|---|---|---|---|---|---|---|---|---|---|---|---|
| S-01 | LEM-042 | real | low | 2 | 2 | N/A | 0 | 2 | 8 | pass | review |
| S-02 | OFF-007 | off | medium | 0 | 2 | 1 | 0 | 1 | 4 | pass | regenerate |
| S-03 | LEM-002 | real | low | 2 | 2 | N/A | 0 | 2 | 8 | pass | review |
| S-04 | LEM-037 | real | high | 2 | 2 | 2 | 1 | 2 | 9 | pass | publish |
| S-05 | OFF-003 | off | low | 0 | 1 | N/A | 0 | 1 | 3 | pass | regenerate |
| S-06 | LEM-021 | real | low | 2 | 2 | 2 | 2 | 2 | 10 | pass | publish |
| S-07 | LEM-045 | real | low | 2 | 2 | N/A | 0 | 2 | 8 | pass | review |
| S-08 | OFF-010 | off | medium | 1 | 2 | 0 | 0 | 1 | 4 | pass | regenerate |
| S-09 | LEM-013 | real | medium | 2 | 2 | 2 | 2 | 2 | 10 | pass | publish |
| S-10 | LEM-030 | real | high | 2 | 1 | 2 | 2 | 2 | 9 | pass | publish |
| S-11 | LEM-009 | real | medium | 2 | 2 | 2 | 2 | 2 | 10 | pass | publish |
| S-12 | OFF-001 | off | low | 0 | 1 | 0 | 1 | 2 | 4 | pass | regenerate |
| S-13 | LEM-046 | real | medium | 2 | 2 | 2 | 2 | 2 | 10 | pass | publish |
| S-14 | LEM-020 | real | high | 2 | 2 | 2 | 1 | 2 | 9 | pass | publish |
| S-15 | OFF-005 | off | medium | 2 | 2 | 0 | N/A | 2 | 8 | pass | review |
| S-16 | LEM-004 | real | low | 2 | 2 | N/A | 0 | 2 | 8 | pass | review |
| S-17 | LEM-027 | real | low | 2 | 2 | N/A | 1 | 2 | 9 | pass | publish |
| S-18 | OFF-011 | off | medium | 0 | 1 | 2 | 1 | 1 | 5 | pass* | regenerate |
| S-19 | LEM-036 | real | medium | 1 | 2 | 2 | 0 | 2 | 7 | pass | regenerate |
| S-20 | LEM-018 | real | low | 2 | 2 | 2 | 2 | 2 | 10 | pass | publish |
| S-21 | OFF-002 | off | high | 0 | 0 | 1 | 2 | 1 | 4 | **FAIL** | VETO |
| S-22 | LEM-031 | real | medium | 2 | 2 | N/A | 2 | 2 | 10 | pass | publish |
| S-23 | LEM-008 | real | low | 2 | 2 | 2 | 1 | 2 | 9 | pass | publish |
| S-24 | LEM-053 | real | low | 2 | 2 | 2 | 0 | 2 | 8 | pass | review |
| S-25 | OFF-008 | off | medium | 1 | 2 | 0 | 0 | 1 | 4 | pass | regenerate |
| S-26 | LEM-023 | real | low | 2 | 2 | N/A | 1 | 1 | 8 | pass | review |
| S-27 | LEM-040 | real | high | 0 | N/A | 2 | 0 | 2 | 5 | **FAIL** | VETO |
| S-28 | OFF-012 | off | high | 0 | 0 | 2 | 1 | 2 | 5 | **FAIL** | VETO |
| S-29 | LEM-017 | real | medium | 2 | 2 | 2 | 1 | 2 | 9 | pass | publish |
| S-30 | LEM-001 | real | low | 2 | 2 | N/A | 1 | 2 | 9 | pass | publish |
| S-31 | OFF-004 | off | high | 1 | 2 | 0 | 0 | 1 | 4 | pass* | regenerate |
| S-32 | LEM-028 | real | medium | 1 | 2 | N/A | 2 | 2 | 9 | pass | publish |
| S-33 | (invalid - duplicate of S-38, excluded from all statistics) | | | | | | | | | | |
| S-34 | OFF-009 | off | high | 1 | 2 | 0 | 0 | 1 | 4 | pass* | regenerate |
| S-35 | LEM-024 | real | low | 2 | 2 | N/A | 1 | 1 | 8 | pass | review |
| S-36 | LEM-015 | real | medium | 2 | 2 | N/A | 1 | 2 | 9 | pass | publish |
| S-37 | LEM-049 | real | low | 2 | 2 | 2 | 0 | 2 | 8 | pass | review |
| S-38 | OFF-006 | off | low | 1 | 1 | N/A | 0 | 1 | 4 | pass | regenerate |
| S-39 | LEM-022 | real | medium | 2 | 2 | 2 | 2 | 2 | 10 | pass | publish |
| S-40 | LEM-012 | real | medium | 2 | 2 | 2 | 2 | 2 | 10 | pass | publish |
| S-41 | LEM-038 | real | medium | 1 | 2 | 2 | 0 | 2 | 7 | pass | regenerate |
| S-42 | LEM-029 | real | high | 2 | 2 | 2 | 2 | 2 | 10 | pass | publish |
| S-43 | LEM-003 | real | low | 2 | 2 | 2 | 1 | 2 | 9 | pass | publish |
| S-44 | LEM-019 | real | low | 1 | 2 | 2 | 2 | 2 | 9 | pass | publish |
| S-45 | LEM-010 | real | medium | 2 | 2 | 2 | N/A | 2 | 10 | pass | publish |
| S-46 | LEM-043 | real | low | 2 | 2 | N/A | 0 | 2 | 8 | pass | review |
| S-47 | LEM-044 | real | low | 2 | 2 | N/A | 0 | 2 | 8 | pass | review |
| S-48 | LEM-026 | real | medium | 2 | 2 | 2 | 2 | 2 | 10 | pass | publish |

`pass*` marks a compliance call I judged as a genuine borderline case rather than a clean
pass. See the reasoning notes for S-18, S-31 and S-34.

---

## Reasoning, every score that wasn't a clean 2

**S-01 / LEM-042** (real, publish region). C4=0: pure changelog copy, no reader address at
all - structurally can't score higher, not a quality problem.

**S-02 / OFF-007** (off). C1=0: skips the required emotional acknowledgment entirely and
opens with bureaucratic data collection at a claims-adjacent moment - the opposite of the
documented pattern. C3=1: "nature of the incident being reported" is stiffer than Lemonade's
plain style, though not clean jargon. C4=0: no pet name, fully impersonal. C5=1: no
contractions, passive construction.

**S-03 / LEM-002** (real). C4=0: a pricing list has no addressee to speak of.

**S-04 / LEM-037** (real, high stakes). C4=1: the quoted fragment doesn't carry a visible
"we"/"you" frame, though the surrounding document does elsewhere.

**S-05 / OFF-003** (off). C1=0: stiff, formal, wrong register for what should be a zero-stakes
greeting. C2=1: warmth missing where the real pattern is a named, friendly opener. C4=0: no
name, "our platform" instead. C5=1: no contractions ("Please proceed to complete").

**S-07 / LEM-045** (real). C4=0: pun-based release note, no reader address, structural.

**S-08 / OFF-010** (off). C1=1: broadly the right explanatory register, executed with the
wrong vocabulary. C3=0: uses "telematics" - the exact term the real corpus (LEM-046) confirms
Lemonade deliberately never uses for this mechanic - the cleanest single failure in the set.
C4=0: "Premiums are calculated" passive, versus the real "how you actually drive." C5=1: no
contractions, passive voice.

**S-09 / LEM-013** (real) - clean 10, no notes.

**S-10 / LEM-030** (real, high stakes). C2=1: "Oh good!" reads as slightly chipper for what
may be a sick-pet claims moment - kept the score conservative rather than call it a clean 2,
genuinely arguable either way.

**S-12 / OFF-001** (off). C1=0: buzzword-laden ("Forward-Thinking Insurance Solutions
Provider") - wrong register entirely. C2=1: flat, no personality where the real tagline has
confidence. C3=0: invents the kind of generic corporate phrasing Lemonade's real copy never
uses.

**S-14 / LEM-020** (real, high stakes) - the anchor example for the covering register. C4=1:
mostly procedural ("the team"), only "ASAP" reads personal.

**S-15 / OFF-005** (off) - **the weakest separation in the whole set.** C3=0: adds
"Named Storm / Hurricane Peril," real insurance-industry phrasing Lemonade's actual version
never includes. Everything else scored clean, because the surface form (two field labels) is
otherwise mechanically identical to the real LEM-010. This is the one off-brand item that
reached the review band (8) - see the report, Part 2.

**S-16 / LEM-004** (real). C4=0: blog title, third-person "We," no direct address.

**S-17 / LEM-027** (real). C4=1: a menu of generic buttons, weak address.

**S-18 / OFF-011** (off). C1=0: cold, bureaucratic register at a moment the real pattern is
warm reassurance. C2=1: missing warmth rather than a badly placed joke. C4=1: uses "your" but
never the pet's name. C5=1: no contractions. **C6 marked pass\*, genuinely uncertain**: this
item states that responses "may be used to determine coverage eligibility and pricing," which
directly contradicts what real Lemonade tells the customer at this exact moment (LEM-022:
"won't affect your price or eligibility"). It isn't a promise or a dropped disclaimer in the
rubric's literal sense, so I scored it a narrow pass, but it's arguably the most dangerous
item in the set precisely because it would pass the veto. See Part 5 of the report.

**S-19 / LEM-036** (real) - **a genuine, confirmed Lemonade quote landing in the regenerate
band.** C1=1: casual/mocking tone about "the ultimate word salad," applied to legal/policy
subject matter - defensible as meta-commentary about the plain-language mission rather than
operative legal text, but the criterion as worded doesn't have room for that distinction. C4=0:
no direct address, third-person about "insurance policies" generally. See Part 1 of the report.

**S-21 / OFF-002** (off, high stakes) - **veto fires, correctly.** C1=0, C2=0: playful,
reassuring tone dropped directly onto medical-liability content. C3=1: not really a jargon
problem, more that vague reassurance replaces the actual disclaimer. C5=1: exclamation mark
and an emoji on content that should carry none. Compliance FAILS: drops the required
liability disclaimer and implies false trust ("basically vet-level experts").

**S-24 / LEM-053** (real). C4=0: a press headline, no address, structural.

**S-25 / OFF-008** (off) - **the cleanest single pairing in the set for criterion 3.** C1=1:
same communicative structure as the real LEM-013, wrong vocabulary. C3=0: "indemnifies,"
"policyholder," "perils as enumerated below" is precisely the jargon the real version drops
in favour of "things you can't control." C4=0: "the policyholder," third-person, versus the
real "things you can't control." C5=1: no contractions, dense clause.

**S-26 / LEM-023** (real). C4=1: exclamatory but not addressed to the reader by name. C5=1:
three stacked emoji - the rubric doesn't explicitly rule on emoji stacking, I judged it as a
minor departure from the "ration exclamation marks" spirit. Flagged as a genuine ambiguity in
the report.

**S-27 / LEM-040** (real, high stakes) - **the most important single test case in this whole
exercise.** This is the deleted 2021 tweet the corpus itself flags as the moment Lemonade's
real voice actually went wrong in public. C1=0: overconfident, promotional tone on a claim
about how AI judges a customer's honesty - the exact register failure the corpus documents.
C2 marked N/A: this isn't a joke, it's an overclaim, and forcing it into the humour criterion
would double-count the same failure that C1 and C6 already catch. C4=0: no direct address,
third-person about "our AI." Compliance **FAILS**: reads as an unsubstantiated capability
claim about judging people, which is exactly what caused the real backlash. **The veto firing
here, on the real historical incident, is the single strongest piece of evidence that the
rubric works** - see Part 4 of the report.

**S-28 / OFF-012** (off, high stakes) - an intentionally worse escalation of S-27, veto fires
again. C1=0, C2=0: boastful "basically a lie detector" framing, exclamation mark on the most
sensitive claim in the set. Compliance **FAILS**, more clearly than S-27 - overclaims real-time
lie detection via facial/body reading.

**S-29 / LEM-017** (real). C4=1: technical heading plus plain list, moderate address.

**S-30 / LEM-001** (real). C4=1: brand-positioning statement, no explicit "you."

**S-31 / OFF-004** (off, high stakes). C1=1: broadly the right formality level for high
stakes, but overshoots into invented severity - "penalty of policy voidance" is harsher than
anything in real Lemonade legal copy. C3=0: invents generic-insurer legal jargon the real
LEM-029 never uses (which says "confirm" and "truthful," not "certify" and "herein"). C4=0:
"you are legally required," no name, versus the real "Nice to see you again, James." C5=1: no
contractions. **C6 marked pass\*:** doesn't promise anything false or drop a disclaimer, so it
narrowly passes on the rubric's literal wording, but the tonal harshness alone might warrant
review in practice - a limit of the veto's reach, not a bug exactly, noted in Part 5.

**S-32 / LEM-028** (real). C1=1: genuinely ambiguous whether "Annnnnnd swooosh!" for routing
an administrative request sits in performing or working register - I judged some drift.

**S-34 / OFF-009** (off, high stakes). C1=1: dense and formal is arguably right for high
stakes in the abstract, but "shall be subject to," "set forth herein" reads more like a
generic insurer than Lemonade even in its most careful mode. C3=0: "actuarial soundness,"
"enumeration" - jargon absent from the real LEM-037, which stays plain even while hedging
("unrealistic," "unattractive"). C4=0: no first-person acknowledgment at all. C5=1: no
contractions, archaic construction. **C6 marked pass\*** for the same reason as S-31: nothing
false is promised, the failure is pure register/vocabulary, not compliance in the narrow
sense.

**S-35 / LEM-024** (real). C4=1, C5=1: same reasoning as S-26 (its structural twin, different
zodiac sign) - exclamatory but unaddressed, stacked emoji.

**S-36 / LEM-015** (real). C4=1: a question implies "you" without using the word.

**S-37 / LEM-049** (real). C4=0: feature-announcement copy, no direct address, structural.

**S-38 / OFF-006** (off). C1=1: not wrong exactly, just generic - lacks the personality real
Lemonade keeps even in mundane release notes. C2=1: this is precisely the "quiet one this
time" moment (its real twin, S-01) where Lemonade chose a joke and this version chose the
industry-standard line instead. C4=0: "your part" is the only trace of address, weak. C5=1:
no contractions. **Notably the smallest real-vs-off gap in the set** (S-01 scored 8, this
scored 4) - a gap of 4 rather than the 5-6 seen elsewhere, because C4 penalised both the real
and the off-brand version similarly. See Part 3 of the report.

**S-41 / LEM-038** (real) - the second confirmed real quote landing in regenerate, same
pattern as S-19/LEM-036. C1=1: aphoristic, borders on clever for legal-adjacent
meta-commentary. C4=0: third-person, no direct address.

**S-43 / LEM-003** (real). C4=1: "our app" implies the reader without naming them directly.

**S-44 / LEM-019** (real). C1=1: the corpus's own note flags the single exclamation mark as
landing on a fairly mundane fact rather than the emotional peak - real, if minor, register
drift.

**S-46 / LEM-043**, **S-47 / LEM-044** (real): both C4=0, no direct address, structural -
same pattern as most release notes in this set.
