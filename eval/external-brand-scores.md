# Scoring other companies' content

> Run on 2026-08-16 against the production gate (`gate/score.ts`) and the live Lemonade
> profile. Corpora: `eval/external-corpus.json` (10 Oura iOS strings from Mobbin) and
> `eval/empathy-corpus.json` (10 Empathy blog posts, verbatim first ~650 words).
> Runner: `scripts/score-corpus.ts`. Nothing was written to the ledger or to `content/`.
> Total API cost: $0.47.

Neither corpus is Lemonade content, so a low score is the expected result. The question was
whether the gate can tell, and on which criteria.

Every item was scored twice:

- **Gate pass** - exactly what production does.
- **Voice pass** - the same run with the mechanical character and sentence limits lifted, so
  a mechanical block does not hide the voice criteria underneath. Compliance and the model
  criteria are unchanged.

## Oura micro-copy, scored as `product-microcopy`

| id | screen | gate score | gate outcome | voice score | voice outcome |
|---|---|---|---|---|---|
| OURA-01 | First Sleep Score explainer | 0 | blocked | 9.00 | reviewed |
| OURA-02 | First Readiness Score explainer | 7.00 | regenerated | 7.50 | regenerated |
| OURA-03 | Body clock sleep alignment | 0 | blocked | 8.75 | reviewed |
| OURA-04 | Body temperature contributor | 0 | blocked | 8.00 | reviewed |
| OURA-05 | Sleep health headline | 0 | blocked | 8.00 | reviewed |
| OURA-06 | Sleep regularity guidance | 0 | blocked | 8.33 | reviewed |
| OURA-07 | Home screen readiness message | 4.17 | blocked | 5.83 | blocked |
| OURA-08 | Biometric sign-in opt-in | 0 | blocked | 7.00 | blocked |
| OURA-09 | Apple Health permission | 0 | blocked | 8.33 | reviewed |
| OURA-10 | Health study opt-in | 0 | blocked | 6.67 | regenerated |

Voice-pass median 8.0. Nothing auto-published.

**What blocked them.** Eight of ten were blocked on mechanics before a single paid call ran,
on the same two rules every time: the 60-character string limit and the 12-word sentence
limit. Oura writes explanatory paragraphs inside a card; the micro-copy type is written for
labels and single lines. That is a profile-scope finding, not a voice judgment.

**What the voice pass found.** Oura's register is genuinely close to Lemonade's on calm
health copy - the judge gave register 2 to six of ten. The recurring deductions were:

- `plain-language` on product jargon carried without explanation ("contributor", "baseline").
- `action-verb` on generic labels. OURA-07 scored 0 there for "Learn more", which the
  mechanics guide names explicitly.
- `direct-address` capped at 1 almost everywhere because there is no named subject on screen.
  This is the same N/A-vs-1 problem the earlier rubric validation flagged; the judge keeps
  scoring it 1 instead of N/A when the interface provides no addressee.

OURA-10 was classified medium stakes on the gate pass and high on the voice pass. Same text,
same prompt. Stakes classification is not stable at the boundary.

## Empathy blog posts, scored as `external-comms`

| id | post | gate score | gate outcome | voice score | compliance |
|---|---|---|---|---|---|
| EMP-01 | Standing with bereaved parents | 0 | blocked | 5.00 | FAIL |
| EMP-02 | Life insurance customer journey | 3.57 | blocked | 4.17 | FAIL |
| EMP-03 | AI in wealth management | 0 | blocked | 3.75 | FAIL |
| EMP-04 | Bereavement leave policy guide | 0 | blocked | 0.83 | FAIL |
| EMP-05 | Claims as a marketing channel | 0 | blocked | 3.13 | FAIL |
| EMP-06 | Dealing with loss in the workplace | 0 | blocked | 3.57 | FAIL |
| EMP-07 | 22 estate planning questions | 5.71 | blocked | 3.57 | FAIL |
| EMP-08 | 2026 life insurance trends | 0 | blocked | 2.14 | FAIL |
| EMP-09 | Racial estate planning gap | 0 | blocked | 3.57 | FAIL |
| EMP-10 | Are digital estate planning tools worth it | 0 | blocked | 2.14 | FAIL |

Voice-pass median 3.57, range 0.83 to 5.00. Every one failed compliance and every one was
blocked. Not one reached the review band.

**What blocked them.** Two things, consistently:

- **Compliance fails on unsourced claims.** These posts are dense with statistics ($124
  trillion, 46% anxiety, 3x reinvestment) with no traceable source. The external-comms type
  requires every factual claim to trace to an approved brief's source list, and these were
  scored with no brief at all. Some of that is structural: the type assumes a brief exists.
  But the judge also caught real problems that are not structural, including a statistic in
  EMP-05 formatted as a quotation with no speaker attached.
- **`register` 0 on nine of ten, and `direct-address` 0 on six.** Both for the same reason:
  these are B2B posts written to carriers, advisors and HR leaders about their customers.
  Lemonade's profile is written for the customer. The judge named this each time - "reads as
  a B2B whitepaper", "framed almost entirely in industry terms".
- **`why-now` 0 on seven of ten.** Evergreen thought leadership with no timing hook.
- On the gate pass, eight of ten also tripped mechanics on em dashes as house style plus
  sentences over 28 words.

## The read

The gate separates the two corpora cleanly: median 8.0 for Oura against 3.57 for Empathy.
The separation is not an accident of length - it comes from register and direct address,
which is what the profile is actually about.

Two things this exposes about our own setup, both worth fixing:

1. The micro-copy mechanics rules block anything longer than a label. Real product copy
   includes explanatory cards. Either the limit needs a per-string interpretation or the
   type needs a second format.
2. `direct-address` should return N/A when no addressee exists, and the judge does not do
   that reliably. Same defect the rubric validation found.
