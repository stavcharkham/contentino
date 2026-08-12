# Research brief 01 - Prior art

**You are doing research only. Do not write code. Do not design our product. Do not edit any
file other than the one named below.**

## Context you need

We are building an open-source content generation tool called Contentino. Its central idea:
a **brand profile is a folder of markdown** that defines how a company writes. The engine
generates content, evaluates that content against the profile, and feeds human edits back
into the profile so it improves with use. No database, no auth, no settings screens - the
profile is files in git.

This research exists so that when we explain our design, we can say what already exists,
where it breaks down, and what we deliberately took or rejected. A reader should finish it
believing we designed against the state of the art rather than from a blank page.

## What to produce

Write your findings to `research/prior-art.md`. Create the file. Do not touch `RESEARCH.md`,
`PRD.md`, `DECISIONS.md`, or `PLAN.md` - a human folds your output into those later.

## The three categories to cover

Cover all three. They map to the three halves of our product (generate, evaluate, learn),
and category C is the one most people miss.

### A. Commercial brand-voice and content generation tools

Products a marketing team would actually buy today. Start with this list, and add any
serious one you find:

- Writer.com - the closest commercial analog, has style guide + terminology enforcement
- Jasper - "Brand Voice" feature
- Copy.ai
- Anyword
- Typeface
- Persado
- Grammarly Business - style guide / brand tones
- Acrolinx - enterprise content governance, older and worth a look

For each, answer:
1. How does the user tell it their brand voice? (upload documents? fill a form? pick tone
   sliders? paste examples?) **Be specific - this is the single most important question in
   this brief.** Our whole bet is that a folder of markdown beats a settings UI, and we
   need to know precisely what the alternatives do.
2. Does it evaluate or score its own output against that voice, or only generate?
3. Does anything the user edits flow back and change future output? If yes, how, and is it
   automatic or manual?
4. Where does the brand definition live - is it exportable, versionable, inspectable by the
   customer, or locked inside the vendor?
5. Pricing model and rough entry price, if public.

### B. Evaluation tooling for LLM output

We have to score "on-brand" and defend the number. Look at how the eval ecosystem does it:

- promptfoo
- Braintrust
- LangSmith / LangFuse evals
- OpenAI Evals
- Published work on LLM-as-judge: what makes judges unreliable, positional bias, whether
  small models are usable as judges, rubric design, pairwise vs absolute scoring

For each, answer:
1. What is the unit of evaluation - a single output, a pair, a whole test set?
2. Rubric format. How is the scoring criterion actually written down?
3. Do they use a small model as judge? Any published guidance on when that is safe?
4. What do they say about the cost of running evals? (We have a $50 total API budget, so
   this matters.)

### C. Markdown-as-configuration prior art

This is the pattern our brand profile belongs to, and naming it correctly is a strong
signal. Cover:

- Anthropic's Agent Skills and `CLAUDE.md`
- Cursor rules files, `.github/copilot-instructions.md`, and similar
- Public human style guides written as documents: Mailchimp Content Style Guide,
  GOV.UK content design guidance, Microsoft Writing Style Guide, Google developer
  documentation style guide

For each, answer:
1. What structure does it use - single file or folder of files? If a folder, what are the
   files and how are they named?
2. How does it handle the tension between rules ("never say X") and examples ("here is a
   good one")? Which does it lean on more?
3. Anything about how these documents fail: sections that get ignored, length limits,
   contradictions between rules, staleness.

## Format for each entry

```markdown
### <Product or artifact name>
**What it is:** one line.
**Source:** URL, and the date you checked it.
**How voice/config is defined:** the specific mechanism.
**Evaluates its own output:** yes / no / partially - with detail.
**Learns from edits:** yes / no - with detail.
**Where it breaks down:** the honest limitation.
**What we take:** what Contentino should borrow, or "nothing".
**What we reject:** what we should deliberately not do, and why.
```

## Rules

- **Evidence or nothing.** Every claim needs a URL and the date you checked it. If you
  cannot verify a feature exists, write "could not verify" - do not infer it from marketing
  copy or from what the product probably does.
- **Marketing pages lie by omission.** Prefer documentation, changelogs, developer docs,
  and pricing pages over landing pages. If you only had the landing page, say so.
- **Quote sparingly.** Short excerpts only, always attributed with the URL. Never paste
  large blocks of anyone's copy.
- If a product is behind a signup wall and you cannot see the actual mechanism, say that
  explicitly rather than guessing. "Paywalled, could not verify" is a useful finding.
- Do not recommend an architecture. Findings only.

## Finish with these two sections

**Gaps in the market.** Three to five sentences. What does nothing in category A do well?
Be specific and be honest - if our idea already exists and works, that is the most valuable
thing you can tell us, and you should say so plainly.

**Questions this raised.** Anything you could not resolve that a human should decide.
