# Research brief 02 - Lemonade's voice, by content type

**You are doing research only. Do not write code. Do not design our product's architecture.
Do not edit any file other than the three named below.**

## Context you need

We are building an open-source content generation tool called Contentino. A **brand profile**
is a folder of markdown that defines how a company writes. Lemonade (the insurance company,
lemonade.com) ships as our first example profile.

To build that profile we need Lemonade's real voice, evidenced, and organised by the kind of
content it appears in. Not "friendly and approachable" - that describes half the internet,
and you can neither generate from it nor score against it.

**Two questions run through everything below.**

1. **Is it one voice or several?** A claim denial is not a homepage headline. If Lemonade
   turns out to have distinct registers, that changes the structure of the brand profile,
   not just its contents. It is the highest-value finding available to you.
2. **What are the repeatable moves?** Specific, countable things: sentence length, where
   humour starts and stops, what they call a deductible, how they deliver bad news.

## What to produce

Three files. Create all three. Write incrementally - finish a section, save, continue.

1. `research/lemonade-corpus.md` - the raw examples, organised by content type. This file is
   gitignored and stays local.
2. `research/lemonade-voice.md` - the analysis, built from the corpus.
3. `research/lemonade-guidelines.md` - a detailed brand and copy guidelines document.

Do not touch `RESEARCH.md`, `PRD.md`, `DECISIONS.md`, or `PLAN.md`.

---

## Part 1 - The corpus

### Content types, and how many of each

**Collect at least 10 examples of every content type below. Aim for 15.** Total target
150-200 excerpts. If a type is genuinely thin in public sources, say so explicitly rather
than padding it with near-duplicates.

| # | Content type | Where to find it |
|---|---|---|
| 1 | Landing and product pages | lemonade.com - renters, homeowners, car, pet, life, each has its own page |
| 2 | Blog posts | lemonade.com/blog - read across categories, not six from one |
| 3 | Help centre articles | their help / FAQ section |
| 4 | In-app UI microcopy | Mobbin - buttons, labels, field hints, confirmations, empty states |
| 5 | Conversational bot | Mobbin - Maya onboarding, AI Jim claims |
| 6 | Failure and bad news | errors, claim denials, payment failures, rejections, price increases |
| 7 | Email and notifications | marketing emails, transactional emails, push notifications |
| 8 | Legal and policy | **Policy 2.0** especially, plus terms and disclosures |
| 9 | Social posts | X/Twitter, LinkedIn, Instagram, TikTok |
| 10 | App store listing and release notes | App Store and Google Play |
| 11 | Investor and corporate | shareholder letters, earnings commentary, press releases |
| 12 | Careers | job posts, employer brand pages |
| 13 | Ads and video scripts | YouTube channel, any campaign work you can find |

Two of these deserve extra effort:

**Policy 2.0** is Lemonade's rewritten plain-language insurance policy. It is a deliberate,
public voice artifact and probably the highest-signal document they have ever published.
Read it properly and take more than ten excerpts from it.

**Failure copy (#6)** is the hardest to find and the most valuable. A voice is defined by
what it does when things go wrong, it is where generated content usually collapses, and it
is where a regulated insurer has the least freedom. Hunt for it deliberately.

### Where to look, beyond the obvious

Do not stop at the website and Mobbin. Use web search aggressively and try these:

- **milled.com** - archives brands' marketing emails. Search Lemonade. This is the best
  available source for content type #7 and most people never think of it.
- **Wayback Machine** - older versions of lemonade.com. Useful for seeing what changed, and
  sometimes for copy that has since been sanded down.
- **Reddit** - r/Insurance, r/personalfinance, r/RenterInsurance and similar. People post
  screenshots of real claim denials, real emails, and real chat transcripts. This is often
  the only public route to genuine failure copy. Search "Lemonade denied", "Lemonade claim",
  "Lemonade email".
- **Trustpilot, BBB, and app store reviews** - reviewers frequently quote the exact message
  they received. Quote the quoted message, and note clearly that it is second-hand.
- **Lemonade's investor relations site** - shareholder letters, press releases.
- **Their YouTube channel** - ad scripts and explainer narration are a distinct register.
- **News coverage and interviews** - founders describing their own voice principles is
  useful, but tag it as stated intent, not as observed practice. The two often differ, and
  where they differ is interesting.

### Mobbin, via MCP

You have Mobbin access through MCP tools. The app is listed as **Lemonade Insurance** and
the library is confirmed to hold the Maya onboarding and the claims flow.

Tools: `search_screens` (use `platform: "ios"`, `mode: "deep"`), `search_flows` (better for
seeing how copy shifts across the steps of one task), `search_sections` (web, no platform
parameter).

Run **separate searches per flow** - the tools degrade when you combine intents. Suggested
queries, and add your own:

| Query | Platform |
|---|---|
| `Lemonade Insurance onboarding chat with Maya assistant` | ios |
| `Lemonade Insurance filing a claim step by step` | ios |
| `Lemonade Insurance quote and price summary with coverage options` | ios |
| `Lemonade Insurance policy details and coverage explanation` | ios |
| `Lemonade Insurance payment and billing screens` | ios |
| `Lemonade Insurance empty state or error message` | ios |
| `Lemonade Insurance settings and account management` | ios |
| `Lemonade Insurance Giveback and charity selection` | ios |
| `Lemonade insurance homepage hero with quote form` | sections |
| `Lemonade insurance pricing and plan comparison` | sections |

**Transcription discipline - read this twice.** These tools return *images*. You are reading
copy off screenshots, which is the single most likely place in this whole brief to write
down something that was never on the screen. The brand profile is built from these strings,
so an invented one becomes a false rule in a shipped product.

- Transcribe only text you can actually read. Character for character, including
  capitalisation, punctuation and ellipses.
- Cut off, too small, or ambiguous? Mark it `[unclear]` and transcribe what you can. Never
  complete a partial sentence from context.
- Every screen excerpt carries its `mobbin_url`. No URL, no excerpt.
- Capitalisation exactly as shown. Button and header casing is real voice signal and it is
  easy to normalise by accident.
- Look at the image. Never describe a screen from its metadata.

### Corpus entry format

Give every excerpt an ID. The guidelines document cites these IDs, so they have to be stable.

```markdown
### LEM-001
**Type:** 4 - in-app UI microcopy
**Register:** ui-microcopy
> The excerpt. A sentence or two.

**Source:** URL - for Mobbin screens the `mobbin_url`, always
**Checked:** 2026-08-12
**Context:** where it appeared, what the user had just done, what was on screen around it.
```

Register tags: `marketing` `ui-microcopy` `conversational` `failure` `support` `legal`
`investor` `social` `careers` `release-notes` `email` `ads`

Keep every excerpt short - a sentence or two. Never paste whole pages, posts, or policy
sections. Always include the URL. This is style analysis, not republication.

Where you find the same move repeated - the same greeting shape, the same way of softening
bad news - collect several instances rather than one. Repetition is what proves a pattern
is a pattern and not an accident, and the guidelines will need to show it.

---

## Part 2 - The analysis

In `research/lemonade-voice.md`, working from the corpus and citing IDs throughout:

### 1. One voice or several
State it plainly with evidence. If several, name each and describe exactly what changes
between them: humour level, sentence length, person, contractions, punctuation, formality.

### 2. Measurable traits
Things a machine could check. Numbers wherever possible, and note where they differ by
content type:
- Sentence length: typical and range
- Paragraph length
- Reading level, estimated
- Contractions: always, never, or type-dependent
- Person: "we", "you", "Lemonade", passive voice
- Punctuation: em-dashes, exclamation marks, ellipses, emoji
- Headings: sentence case or title case, questions or statements
- Buttons and labels: casing convention
- Numbers, money, dates, percentages: how formatted

### 3. Vocabulary
- Words and phrases used repeatedly
- Words visibly avoided
- **Jargon table:** for each insurance term - deductible, premium, claim, policyholder,
  underwriting, coverage, peril, endorsement - what do they actually call it, and does the
  answer change by content type? Do not assume they replaced everything. Check.
- Product and feature names, and their capitalisation
- Anything always capitalised or always lowercase

### 4. Structural patterns
How a blog post opens and closes. How a help article is shaped. Where the call to action
sits. How a chat message is chunked. How long before the first full stop.

### 5. Humour - where it lives and where it stops
Find the boundary and name what triggers the switch. There will be places they are playful
and places they go completely straight. This is the hardest thing to encode and the most
obvious thing to get wrong.

### 6. Bad news and sensitive moments
How do they deliver a denial, a price increase, a rejection, an outage? Structure, ordering,
what comes first, whether humour survives, whether they apologise. Treat this as its own
finding, not a footnote.

### 7. Compliance and constraints
They are a regulated insurer in the US and Europe. Note compliance-driven language:
disclaimers, hedged claims, things they conspicuously never promise. A profile that ignores
this generates content that cannot ship.

### 8. Contrast pairs
Find places where Lemonade says **the same thing in two registers** - a concept on the
marketing site and again in the policy, a number in the app and again in a help article.
Line them up side by side.

These are the most useful single artifact you can produce. They isolate what changes with
register while holding the subject still, which is exactly what the profile has to encode.

### 9. What a generator would get wrong
If a model were told "write like Lemonade" with no profile, what would it produce, and how
would that differ from the real thing? Be concrete and specific.

---

## Part 3 - The guidelines

`research/lemonade-guidelines.md`. This is a working brand and copy guidelines document -
the kind a content team would actually use. A human will rework it afterwards, so aim for
complete and evidenced rather than polished.

**The one rule that governs this whole document: every rule carries examples.** A guideline
that says "keep sentences short" is worth nothing. One that says "keep sentences short -
here are six real openings, here are three off-brand versions and their corrections" is
worth something. Cite corpus IDs for every example. If you cannot find an example for a rule
you want to state, the rule does not go in.

Structure:

1. **The voice in one paragraph.** What a new writer needs before anything else.
2. **The registers.** Each one named, described, with when to use it and three examples.
   If Part 2 found a single voice, say so here and explain how it flexes.
3. **Principles.** Five to eight. Each with a short statement, why it exists, three real
   examples, and two off-brand versions with corrections.
4. **Mechanics.** Grammar, punctuation, capitalisation, numbers, dates, currency,
   abbreviations, emoji. Each with examples.
5. **Vocabulary.** Preferred terms, avoided terms, the jargon table from Part 2 section 3,
   product name capitalisation.
6. **Playbook per content type.** One section for each of the 13 types. Purpose, typical
   length, structure, opening pattern, closing and CTA, and at least three real examples.
   This is the longest part of the document and the most useful.
7. **Sensitive situations.** Claim denial, price increase, service outage, complaint
   response, coverage rejection. What the rules are and what they never say.
8. **Compliance.** Required disclaimers, claims they never make, regulated language.
9. **Rewrite gallery.** Ten before-and-after pairs. Take generic AI-sounding copy and show
   the Lemonade version, with one line on what changed and why.
10. **Open questions.** Where the evidence was thin and you had to infer.

---

## Rules

- **Evidence or nothing.** Every claim traces to a corpus ID. If you assert they never use
  exclamation marks, you must have looked.
- Adjectives are not findings. "Warm and human" fails. "Averages 12-word sentences, opens 4
  of 6 blog posts with a question, uses contractions in every register including legal"
  works.
- Inaccessible source? Say so. Never fill a gap with a guess.
- Separate observed from inferred, and label inferences.
- Second-hand quotes - a reviewer reporting what an email said - are usable but must be
  labelled as second-hand.

**One warning against a lazy conclusion.** The obvious story about Lemonade is that they
threw out insurance jargon and replaced it with plain words. There is counter-evidence
sitting in the app. Do not assume the story and then collect quotes that fit it. Check which
technical terms actually survive, where, and what sits next to them when they do. If the
real pattern is messier than the story, that is the better finding.

## Finish with

**Questions for the Lemonade team.** What you genuinely could not determine from public
sources, each paired with the assumption you would make instead:

| Question | Why it matters | Assumption made instead |
|---|---|---|
