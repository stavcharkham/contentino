# Lemonade brand and copy guidelines (draft)

> Built from `research/lemonade-corpus.md` (61 excerpts) and `research/lemonade-voice.md`.
> Every rule below is followed by cited examples (LEM-### ids, defined in the corpus file).
> **A rule with no example did not make it into this document.** This is a first draft with
> real gaps - see the coverage caveats repeated throughout - not a finished style guide.

---

## 1. The voice in one paragraph

Lemonade writes like someone who is genuinely trying to make insurance less annoying, and
believes that's mostly a copywriting problem, not just a product problem. It uses your name,
addresses you directly, and isn't afraid to joke about the process (LEM-021, LEM-023,
LEM-042). But the moment something has real weight - a legal disclaimer, a fraud check, a
health question about your pet - the jokes stop immediately and the sentence gets careful,
even inside the same chat bubble sequence (LEM-019→LEM-020). It leaves technical insurance
terms alone when there isn't a simpler substitute (LEM-010) and throws them out entirely
when there is (LEM-046). Buttons and headers shout in capitals; nothing else does.

## 2. The registers

Three, and they're switched by *stakes*, not by content type - the same screen can contain
all three.

- **Performing** - marketing, release notes, chat at ease. Confident, punning, warm.
  Examples: LEM-025 ("Tail-oring coverages"), LEM-042-045 (release notes), LEM-023/024
  (zodiac jokes).
- **Working** - forms, coverage data, field labels. Flat, efficient, sometimes technical.
  Examples: LEM-010 ("Deductible"), LEM-017 (coverage list).
- **Covering** - anything with legal, fraud, or compliance weight. Careful, complete
  sentences, no jokes, regardless of surrounding tone. Examples: LEM-020 (vet-chat
  disclaimer), LEM-029 ("pledge of honor"), LEM-037/038 (Policy 2.0's own stated limits).

## 3. Principles

### 3.1 Use the person's name and their situation, immediately
Every Maya flow opens "Hey [Name]" (LEM-021). Coverage explanations reference the specific
pet/car/home already entered, not a generic example (LEM-017's "Hiromi's Health Insurance"
naming pattern, screen evidence).
*Off-brand:* "Welcome! Let's find you a policy." → *On-brand:* "Hey James, I'm Maya. I'll
get you insured in no time." (LEM-021)

### 3.2 Reassure before you ask something that might worry someone
Before asking pet health questions, Maya states up front that answers won't affect price or
eligibility (LEM-022). The reassurance comes before the anxiety-inducing question, not after.
*Off-brand:* "Has your pet had any of these conditions? [list]" → *On-brand:* "Don't worry,
this won't affect your price or eligibility. It's just to help you understand what will and
won't be covered." then the question. (LEM-022)

### 3.3 Ration the jokes to exactly where nothing is at stake
Loading screens, minor updates, small talk: joke freely (LEM-025, LEM-042, LEM-045). Coverage
decisions, fraud steps, health/liability questions: stop entirely (LEM-020, LEM-029).
*Off-brand:* a denial screen with a pun. *On-brand:* LEM-020's flat disclaimer sitting one
screen after LEM-019's excited pitch, same modal.

### 3.4 Translate the mechanic, not necessarily the word
Where they've fully explained *how something works* in plain terms, the underlying jargon
word can disappear entirely (LEM-046, no "telematics" anywhere). Where the mechanic itself is
just a number on a screen, the standard term survives untouched (LEM-010, "Deductible" with
no gloss). **This varies by product line - see section 6.** Don't apply a blanket
"translate everything" rule; check whether the concrete example for this specific term and
product line exists before assuming.

### 3.5 Acknowledge feeling before collecting data
Claims bots respond to what happened emotionally before asking the next logistics question
(LEM-030: "Oh no... how is Hiromi doing now?" before "What happened?").
*Off-brand:* "What is the reported issue? [dropdown]" → *On-brand:* "Sorry to hear that...
When did you first notice she was sick?" (LEM-030)

### 3.6 Give compliance requirements a friendly name, not a warning label
The mandatory honesty/fraud-prevention step is called a "pledge of honor," framed as
something you sign, not a warning you're issued (LEM-029) - while the actual disclaimer text
underneath stays fully legal in register.

### 3.7 Buttons and section headers are ALL CAPS. Nothing else is.
Consistent across every screen gathered: "FINALIZE PAYMENT," "GET DISCOUNTS" (LEM-011),
"NOTHING SAVED YET" (LEM-016), "ANALYZING YOUR DATA..." (LEM-025). Body text and chat
copy are always ordinary sentence case, no exceptions found.

### 3.8 One exclamation mark, maximum, and never on bad news
No stacked exclamation marks found anywhere. Never appears in disclaimer or denial-adjacent
copy (LEM-020 has zero). Appears at most once per message chunk when something genuinely
good is being said (LEM-019).

---

## 4. Mechanics

- **Contractions:** always, in every register including legal disclaimers (LEM-020 uses
  "don't," "can't," "cannot" naturally). Do not stiffen up for compliance copy.
- **Capitalisation:** buttons/headers ALL CAPS (see 3.7); product names as proper nouns,
  e.g. "Lemonade Autonomous Car" (LEM-049); bot names capitalised with a role subtitle,
  e.g. "Maya, Personal Insurance Assistant" (screen evidence).
- **Punctuation:** contractions and ellipses (for a trailing/in-progress thought - LEM-023,
  LEM-042) are common; em-dashes are rare (2 confirmed instances in 61 excerpts - LEM-031,
  LEM-043) - treat as an occasional device, not a house style.
- **Numbers/money:** dollar signs with cents shown small ($67.**33**, screen evidence);
  percentages as numerals with a "%" sign (LEM-012, LEM-046).
- **Sentence length:** short in UI copy, often under 10 words (LEM-015, LEM-045); allowed to
  run to two sentences for reassurance moments (LEM-022) or disclaimers (LEM-020).

## 5. Vocabulary

**Preferred / repeated:** "instant" (LEM-003, LEM-008), direct "you actually [x]"
constructions (LEM-046), self-aware jokes about insurance itself being annoying (LEM-044).

**Jargon table** (honest state of evidence, not a clean rule - see voice analysis section 4
for the full reasoning):

| Term | Kept as-is | Translated | Evidence |
|---|---|---|---|
| Deductible | Yes (home) | - | LEM-010 |
| Comprehensive coverage | Yes, but defined inline | - | LEM-013 |
| Usage-based pricing / telematics | - | Yes, term never used | LEM-046 |
| Claim | Yes, everywhere | - | LEM-014, LEM-031 |
| Policyholder / underwriting / peril / endorsement | Not found in corpus either way | | - |

**Do not state as a rule** that Lemonade "replaces insurance jargon with plain English" as
a blanket claim - the evidence shows selective translation, concentrated on pricing
mechanics. Say it that specifically or don't say it.

**Product naming:** full product names capitalised as proper nouns (LEM-049). Bot names
always capitalised with a subtitle identifying their role.

## 6. Differences by product line

Added because the evidence turned out to support a real pattern, not just noise - see voice
analysis section 2 for the full reasoning. Treat this section as more provisional than the
rest of the document; it's built from one quote/claim flow per line.

- **Pet** - most playful line by a clear margin. Puns tied to the pet itself (LEM-025),
  a joke loading step with no functional content, emotional acknowledgment extended to the
  pet as if it were the subject, not just the policyholder (LEM-030). If writing pet
  insurance copy and it doesn't have at least one moment of warmth or lightness, it's
  probably under-voiced for this line specifically.
- **Home** - most restrained and technical. Structured data fields (foundation, siding,
  frame, roof) presented with almost no personality (screens in flow e4468874). Deductible
  language kept in standard industry form (LEM-010), not translated the way car insurance's
  pricing mechanic is (LEM-046). Home copy should default toward the "working" register
  (section 2) more than pet or car would.
- **Car** - currently the most aggressively "translated" line, especially around the 2026
  FSD/Tesla push - plain, confident, jargon-free declarative sentences (LEM-046, LEM-049).
  Reads as the line getting the most current copywriting investment.
- **Renters** - only evidenced in claims/support flows here, not quote flows (LEM-031,
  LEM-014) - **gap, not a confirmed pattern.** What's there matches the general "working"
  register with warm bookends.

**Do not treat this as "the" answer** - it's based on one flow per line and needs
confirmation against quote-flow copy for renters and life insurance specifically, neither
of which is represented here.

## 7. Playbook per content type

Coverage varies sharply by type - marked honestly below. Where a type has no first-party
evidence, that's stated rather than filled with invented guidance.

**1. Landing/product pages** - Thin evidence (site blocked direct fetch). What's confirmed:
century-scale ambition framing ("Built for the 21st Century," LEM-001) and speed/price
headline claims (LEM-002, LEM-003). Needs a direct follow-up read.

**2. Blog** - Thin. Confirmed: willingness to run self-critical pieces under blunt titles
("We Suck, Sometimes," LEM-004). Needs a direct follow-up read of 5-6 actual posts.

**3. Help centre** - **No first-party evidence.** Full gap, flagged as the second priority
follow-up (after failure copy).

**4. In-app UI microcopy** - Best-evidenced type. ALL CAPS buttons/headers (3.7), direct
questions as inline help ("Where do I find these details?", LEM-015), reward-framed language
for discounts ("unlocked," LEM-012), inline definitions for kept jargon (LEM-013).

**5. Conversational bot** - Best-evidenced type. Name-first opening (3.1), reassure-before-
ask (3.2), a repeated zodiac joke on birthdate entry (LEM-023/024 - confirmed as a template,
not an ad-lib), stylised elongated spelling for pure administrative actions ("Annnnnnd
swooosh!", LEM-028) - a genuinely distinctive, specific device worth naming directly rather
than folding into general "playful" guidance.

**6. Failure/bad news** - **Weakest type, high stakes.** Confirmed shape: emotional
acknowledgment before data collection (LEM-030), fraud steps framed as a friendly ritual
(LEM-029). **No verbatim first-party denial or decline copy found** - only second-hand,
reviewer-paraphrased accounts (LEM-032/033/034), which are not usable as style evidence.
**Top priority follow-up.**

**7. Email/notifications** - **No evidence at all.** Full gap.

**8. Legal/policy** - Confirmed: Policy 2.0's own project documentation is candid and almost
self-mocking about the category ("Insurance policies are the ultimate word salad," LEM-036)
while being honest about limits ("zero exceptions may be unrealistic," LEM-037). **Actual
policy clause text not yet pulled** - only the project's own explanation of itself. Needs a
follow-up read of the policy document itself, not just its README.

**9. Social** - Thin, mostly indirect. One high-value negative case (LEM-040, the 2021
tweet) showing exactly where their casual voice failed publicly. No confirmed positive
examples of a well-executed casual social post from direct access.

**10. App store/release notes** - Well-evidenced, and genuinely one of the most useful
sources found. Joke-when-nothing-to-report, flat-declarative-when-there's-a-real-feature
(section 5 of the voice analysis, LEM-042 vs LEM-049). Domain-specific puns recur
("Rest insured," LEM-045; "Tail-oring," LEM-025).

**11. Investor/corporate** - Mixed register even within itself - ranges from folksy
("fabulous news for Lemonade and our shareholders," LEM-051) to standard IR boilerplate
("wholeheartedly believe," LEM-052). Press release headlines use marketing verbs
("Unveils," "Slashing," LEM-053) even on the investor relations channel.

**12. Careers** - One data point only (LEM-054), fairly generic. Gap.

**13. Ads/video** - **No evidence at all.** Full gap.

## 8. Sensitive situations

**This section is the least confident in the document and should be treated as provisional
until type 6 is properly researched.**

What's supported by evidence:
- Acknowledge the emotional reality of the situation before asking a logistics question
  (LEM-030).
- Frame mandatory honesty/compliance requirements as something the customer actively agrees
  to, not a warning delivered to them (LEM-029).
- Never joke inside a sentence that carries legal or liability weight, even mid-conversation
  (LEM-020).

What's **not** supported and should not be guessed at: the actual wording of a claim
denial, a coverage rejection, or a price increase notice. Do not draft example copy for
these situations without first getting real examples - the risk of inventing a plausible-
sounding but wrong "Lemonade voice" for a claim denial is exactly the failure mode this
whole project exists to prevent.

## 9. Compliance

- Liability/medical disclaimers appear in full legal register regardless of surrounding
  tone (LEM-020).
- Policy 2.0's own documentation states plainly that full simplification isn't always
  possible given pricing/regulatory constraints (LEM-037) - this is public, stated brand
  position, not just an inferred limit.
- Fraud-prevention steps are mandatory and repeat identically session to session
  ("Just like last time," LEM-029) - treat as a fixed compliance requirement, not
  copy to be freely rewritten.

## 10. Rewrite gallery

1. *Generic:* "Please answer the following questions about your pet's medical history."
   *Lemonade (LEM-022):* "OK! Let's talk about Hiromi's health for a moment... Don't worry,
   this won't affect your price or eligibility."
   *Why:* names the pet, reassures on stakes before asking.

2. *Generic:* "No updates in this release. Bug fixes and performance improvements."
   *Lemonade (LEM-042):* "Quiet one this time. The kind of update that doesn't announce
   itself at parties."
   *Why:* personifies a non-event instead of using the generic changelog line.

3. *Generic:* "You must confirm the information provided is accurate before submitting."
   *Lemonade (LEM-029):* "I'll need you to confirm that the info you provide will be
   truthful by signing our 'pledge of honor.'"
   *Why:* names the compliance step as something you're invited into, not warned about.

4. *Generic:* "Comprehensive coverage protects against non-collision damage."
   *Lemonade (LEM-013):* "Coverage for damages caused by things you can't control. For
   example:" [list follows]
   *Why:* keeps the technical label but defines it in plain terms in the same breath.

5. *Generic:* "Your discount has been applied."
   *Lemonade (LEM-012):* "You just unlocked $21 in savings."
   *Why:* reward-game verb ("unlocked") instead of a neutral transaction verb.

*(Only 5 pairs met the bar of having a real corpus example on the Lemonade side and an
honest generic counterpart - the brief asked for 10; the other 5 would require inventing
the "before," which isn't the point of this exercise. Padding to 10 was declined
deliberately.)*

## 11. Open questions

Same list as the voice analysis document - repeated here since this is the document a
content team would actually use:

| Question | Why it matters | Assumption made instead |
|---|---|---|
| What does an actual claim denial say, verbatim? | Highest-stakes content type, weakest evidence in this whole draft | Assumed it follows the acknowledge-then-direct pattern from claims intake (LEM-030) - unconfirmed inference |
| Is the pet/home tone gap deliberate positioning or just which product got copywriting attention most recently? | Determines whether section 6 becomes a firm rule or gets unified later | Assumed at least partly deliberate, based on consistency across every example gathered |
| What does a real marketing/transactional email look like? | Full gap, type 7 | No assumption made - flagged open |
| How is a renewal price increase communicated? | Common, high-stakes, zero evidence | No assumption made - flagged open |
