# Research brief 02 - Lemonade's voice

**You are doing research only. Do not write code. Do not design our product. Do not edit any
file other than the two named below.**

## Context you need

We are building an open-source content generation tool called Contentino. A **brand profile**
is a folder of markdown that defines how a company writes. Lemonade (the insurance company,
lemonade.com) ships as our first example profile.

To build that profile we need Lemonade's actual voice, with evidence. Not "friendly and
approachable" - that describes half the internet and cannot be generated from or scored
against. We need the specific, repeatable moves: sentence length, where they use humour and
where they stop, how they name things, what they refuse to say.

**The central question of this brief:** is Lemonade's voice one voice, or several? An error
message is not a shareholder letter. A claim denial is not a homepage headline. If it turns
out to be several distinct registers, that is the most important finding you can return,
because it changes the shape of the brand profile.

## What to produce

Two files. Create both.

1. `research/lemonade-corpus.md` - the raw evidence. Excerpts, each tagged with source URL,
   date checked, and register.
2. `research/lemonade-voice.md` - the analysis, built from the corpus.

Do not touch `RESEARCH.md`, `PRD.md`, `DECISIONS.md`, or `PLAN.md`.

## Sources, in priority order

**Tier 1 - go here first**

- `lemonade.com` - homepage and each product page (renters, homeowners, car, pet, life)
- `lemonade.com/blog` - read at least 6 posts across different topics
- The help centre / FAQ
- **Policy 2.0** - Lemonade's rewritten plain-language insurance policy. This is an explicit,
  deliberate voice artifact and probably the highest-signal document they have published.
  Find it and read it properly.
- The Giveback pages and any transparency / annual report content

**Tier 2 - product surfaces**

- Mobbin (mobbin.com) - Lemonade's app screens. Look for the onboarding flow with **Maya**
  (their conversational bot) and the claims flow with **AI Jim**. Capture the actual UI
  strings: button labels, field labels, empty states, confirmations.
  **Mobbin may require an account.** If you hit a login wall, stop, note it clearly in the
  output, and continue with the other sources. Do not create an account, and do not guess
  what the screens say.
- App Store and Google Play listing copy, and the **release notes** - release notes are an
  unusually honest voice sample because nobody polishes them for a campaign.

**Tier 3 - other registers**

- Investor relations: shareholder letters (Lemonade writes these in a distinctive voice)
- X/Twitter and LinkedIn
- Careers page

## The registers to tag

Every excerpt in the corpus gets one of these tags. Cover as many as you can find; flag
any you could not find evidence for.

| Tag | What it covers |
|---|---|
| `marketing` | Homepage, product pages, ads |
| `ui-microcopy` | Buttons, labels, field hints, confirmations |
| `conversational` | Maya onboarding, AI Jim claims, chat |
| `failure` | Errors, rejections, claim denials, payment failures |
| `support` | Help centre, FAQ, explainers |
| `legal` | Policy 2.0, terms, disclosures |
| `investor` | Shareholder letters, earnings commentary |
| `social` | X, LinkedIn |
| `careers` | Job posts, employer brand |
| `release-notes` | App store update text |

`failure` is the hardest to find and the most valuable. A voice is defined by what it does
when things go wrong, and it is where most generated content falls apart. Hunt for it.

## Corpus format

```markdown
### [register-tag] Short description
> The excerpt. Keep it to a sentence or two.

**Source:** URL
**Checked:** YYYY-MM-DD
**Note:** anything about context - where on the page, what the user had just done.
```

Aim for 40-60 excerpts spread across registers. Quantity matters less than spread: 10
marketing excerpts and nothing else is a failed brief.

**Keep every excerpt short - a sentence or two.** Never paste whole pages, whole posts, or
whole policy sections. Always include the URL. This is style analysis, not republication.

## Analysis format

In `research/lemonade-voice.md`, work from the corpus and answer:

### 1. Is it one voice or several?
State it plainly, with the evidence. If several, name each register and describe how it
differs from the others. Be specific about what changes between them - humour level,
sentence length, use of "we"/"you", contractions, punctuation.

### 2. Measurable traits
Things a machine could check. Give numbers where you can:
- Typical sentence length, and the range
- Paragraph length
- Reading level, if you can estimate it
- Contractions: always, never, register-dependent?
- Person: "we", "you", "Lemonade", passive voice
- Punctuation habits: em-dashes, exclamation marks, ellipses, sentence-case vs title-case
  headings, emoji
- Numbers and money: how are they formatted

### 3. Vocabulary
- Words and phrases they use repeatedly
- Words they visibly avoid (insurance jargon they replaced - find the replacements:
  what do they call a deductible, a premium, a claim, a policyholder?)
- Product and feature names, and how they are capitalised
- Anything they always capitalise or always lowercase

### 4. Structural patterns
How a Lemonade blog post opens. How a help article is shaped. Whether headings are
questions. Where they put the call to action. How long before the first full stop.

### 5. Humour - where it lives and where it stops
Find the boundary. There will be places they are playful and places they go completely
straight. Identify what triggers the switch. This is the single hardest thing to encode
and the thing that will most obviously break if we get it wrong.

### 6. Compliance and constraints
They are a regulated insurer in the US and Europe. Note any language that looks
compliance-driven: disclaimers, hedged claims, things they conspicuously never promise.
A brand profile that ignores this will generate content that cannot ship.

### 7. What a generator would get wrong
Your judgement: if a model were asked to "write like Lemonade" with no profile, what would
it produce, and how would that differ from the real thing? Be concrete.

## Rules

- **Evidence or nothing.** Every claim traces to an excerpt in the corpus. If you assert
  they never use exclamation marks, you must have looked.
- Do not describe the voice with adjectives alone. "Warm and human" is not a finding.
  "Averages 12-word sentences, opens 4 of 6 blog posts with a question, uses contractions
  in every register including legal" is a finding.
- If a source is inaccessible, say so explicitly. Never fill a gap with a guess.
- Distinguish what you observed from what you inferred. Label inferences as inferences.
- Do not design the brand profile format. Findings only - a human does the design.

## Finish with

**Questions for the Lemonade team.** Things you genuinely could not determine from public
sources, each paired with the assumption you would make in its absence. Use this format:

| Question | Why it matters | Assumption made instead |
|---|---|---|
