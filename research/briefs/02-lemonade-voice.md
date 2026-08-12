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

**Tier 2 - product surfaces, via the Mobbin MCP server**

You have Mobbin access through MCP tools. Use them. The app is listed as **Lemonade
Insurance** and the library is confirmed to hold the conversational onboarding with **Maya**
and the claims flow. This is our only source for `ui-microcopy` and much of our `failure`
copy, so give it real time.

Tools available:

- `search_screens` - single screens. Use `platform: "ios"`, `mode: "deep"`, and name the app
  in the query.
- `search_flows` - multi-step journeys. Better than `search_screens` when you want to see
  how copy changes across the steps of one task.
- `search_sections` - website sections, no platform parameter.

Run **separate searches per flow**. Do not combine intents in one query - the tools are
explicit that this degrades results. Suggested queries, and add your own:

| Query | Platform | Looking for |
|---|---|---|
| `Lemonade Insurance onboarding chat with Maya assistant` | ios | conversational, ui-microcopy |
| `Lemonade Insurance filing a claim step by step` | ios | conversational, failure |
| `Lemonade Insurance quote and price summary with coverage options` | ios | ui-microcopy |
| `Lemonade Insurance policy details and coverage explanation` | ios | support, legal |
| `Lemonade Insurance payment and billing screens` | ios | ui-microcopy |
| `Lemonade Insurance empty state or error message` | ios | failure |
| `Lemonade Insurance settings and account management` | ios | ui-microcopy |
| `Lemonade Insurance Giveback and charity selection` | ios | marketing |
| `Lemonade insurance homepage hero with quote form` | web (sections) | marketing |
| `Lemonade insurance pricing and plan comparison` | web (sections) | marketing |

**Transcription discipline - read this twice.** These tools return *images*. You are reading
copy off screenshots, which is the single most likely place in this whole brief for you to
write down something that was never on the screen. Our brand profile is built from these
strings, so an invented one poisons the product.

- Transcribe only text you can actually read in the image. Character for character,
  including capitalisation, punctuation, and ellipses.
- If a string is cut off, too small, or ambiguous, mark it `[unclear]` and transcribe what
  you can. Never complete a partial sentence from context.
- Every screen excerpt must carry its `mobbin_url` so a human can open the screen and check
  you. No URL, no excerpt.
- Note capitalisation exactly as shown. Button and section-header casing is a real voice
  signal and it is easy to normalise by accident.
- Do not describe a screen from its metadata. Look at the image.

**One warning against a lazy conclusion.** The obvious story about Lemonade is "they threw
out insurance jargon and replaced it with plain words". There is counter-evidence to that
sitting in the app. Do not assume the story and then collect quotes that fit it. Check which
technical terms actually survive, where they survive, and what sits next to them when they
do. If the real pattern is more mixed than the story, that is a better finding.

**Also in tier 2**

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

**Source:** URL - for Mobbin screens this is the `mobbin_url`, always
**Checked:** YYYY-MM-DD
**Note:** anything about context - where on the page, what the user had just done.
```

**Volume target: 120-150 excerpts, with at least 8 in every register you can find.**

That is deliberately a lot, and here is why. This corpus is not the deliverable - it is the
raw material for a full brand guidelines document that has to carry worked examples for
every rule it states. A guideline that says "keep sentences short" is worth nothing; one
that says "keep sentences short - here are six real openings, here are three we rewrote to
match" is worth something. Every rule we end up writing needs examples behind it, and we
cannot invent those later. Collect generously now.

Spread beats volume where the two conflict. 120 marketing excerpts and nothing else is a
failed brief; 60 well spread across nine registers is a good one. If a register is genuinely
thin in public sources, say so rather than padding it.

Where you find the same move repeated - the same greeting shape, the same way of softening
bad news - collect several instances rather than one. Repetition is the evidence that it is
a pattern and not an accident, and the guidelines will need to show it.

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

### 7. Contrast pairs
Find places where Lemonade says **the same thing in two different registers** - a concept
explained on the marketing site and again in the policy, or a number shown in the app and
described in a help article. Line them up side by side.

These pairs are the most useful single artifact you can hand us. They isolate what changes
with register while holding the subject matter still, which is exactly the distinction the
brand profile has to encode. Collect as many as you find, even imperfect ones.

### 8. Worked examples for the guidelines
For each significant pattern you identified in sections 2-6, name the **two or three
excerpts that demonstrate it best** and say in one line why each is the clearest case. Do
not write the guidelines - just mark the evidence, so whoever writes them is not re-reading
the whole corpus to find the good examples again.

### 9. What a generator would get wrong
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
