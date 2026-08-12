# Research brief 01 - The AI content generation space

**You are doing research only. Do not write code. Do not design our product. Do not edit any
file other than the two named below.**

## Context you need

We are building an open-source content generation tool called Contentino. Its central idea:
a **brand profile is a folder of markdown** that defines how a company writes. The engine
generates content, evaluates that content against the profile, and feeds human edits back
into the profile so it improves with use. No database, no auth, no settings screens.

We need to understand the space properly before we commit to that. Not a sales-sheet
comparison - a real picture of what these products do, which parts people actually use,
which parts they ignore, and where they lose customers.

**The output has to survive a hostile reader.** Someone who knows this market should read it
and find nothing lazy in it. If our idea already exists and works, this brief is where we
find out, and saying so plainly is the most valuable thing you can do.

## What to produce

Two files. Create both. Write incrementally - finish a part, save it, then move on, so
nothing is lost if you run out of room.

1. `research/feature-matrix.md` - the comparison table (Part B)
2. `research/prior-art.md` - everything else

Do not touch `RESEARCH.md`, `PRD.md`, `DECISIONS.md`, or `PLAN.md`.

---

## Part A - Map the space

Establish who is actually in this market. Group them, because they are not all the same
kind of thing:

- **Brand-voice-first tools:** Writer.com, Jasper, Acrolinx, Grammarly Business
- **Volume copy generation:** Copy.ai, Anyword, Rytr, Copysmith
- **Marketing suites with AI bolted on:** HubSpot Content Hub, Salesforce/Marketing Cloud,
  Adobe Firefly + Express, Canva Magic Write, Mailchimp
- **Social and repurposing:** Typefully, Buffer AI, Taplio, Opus Clip, Munch
- **SEO-led content:** Surfer SEO, Frase, Clearscope, MarketMuse
- **Agent-shaped newcomers:** anything launched recently that generates content through a
  chat or agent interface rather than a form

For each group answer: who buys it, what job they hire it for, and roughly what it costs to
start. Add any serious product you find that is not listed. Note anything that has shut
down or been acquired - dead products are evidence too.

## Part B - Feature inventory

Build a matrix in `research/feature-matrix.md`. Rows are products (at least the 8-10 most
significant). Columns are features. Mark each cell yes / no / partial / unverified, and keep
a short note where "partial" needs explaining.

Features to check for every product:

| Feature | What you are checking |
|---|---|
| Brand voice definition | Can you tell it how you write, and how |
| Voice applied automatically | Or must the user re-specify it every time |
| Multi-brand / multi-product voices | One voice per account, or many |
| Style guide enforcement | Hard rules, banned terms, terminology lists |
| Templates | Pre-built content types, and how many |
| Long-form generation | Full articles, not just snippets |
| Repurposing | One input, many channel outputs |
| Tone adjustment on existing text | Rewrite rather than generate |
| Scoring / grading of output | Does it tell you how good the result is |
| Brand-compliance checking | Flags off-brand copy specifically |
| Learning from edits | Does user editing change future output |
| Approval / review workflow | Multi-person sign-off before publish |
| Collaboration | Comments, shared drafts, roles |
| Version history | Can you see and revert changes |
| Integrations | Which ones, and which are most promoted |
| API | Public, documented |
| MCP server | Do they have one |
| Browser extension | Write-anywhere surface |
| Slack / Teams | Generate from chat |
| CMS publishing | Direct to WordPress, Webflow, etc |
| Analytics / performance feedback | Does published performance loop back |
| SEO features | Keywords, briefs, SERP analysis |
| Image generation | Included or not |
| Fact checking / citations | Hallucination handling |
| Plagiarism / AI detection | Included or not |
| Localisation | Multi-language, and is voice preserved |
| Compliance guardrails | Regulated-industry features |
| Data / privacy posture | Training on customer data, opt-outs |
| Export / lock-in | Can you take your brand definition with you |

Two columns matter more than the rest and deserve extra detail in `prior-art.md`:
**"Brand voice definition"** and **"Learning from edits"**. Those are our two bets.

## Part C - How it actually works

Pick the **four most significant products** and walk through their real flow. Use product
documentation, onboarding guides, demo videos, YouTube walkthroughs, and free trials where
one exists without payment.

For each, describe:
1. What happens on first login. What does it ask for before it will generate anything?
2. The path from empty state to a finished piece of content, step by step.
3. What the user has to supply each time versus what the product remembers.
4. Where the human intervenes, and what they typically change.
5. What the interface is fundamentally - a form, a chat, a document editor, a workflow
   builder? This shapes everything else.

Be concrete. "You describe your brand" is not an answer; "a six-field form asking for
audience, tone from a list of 12, and up to three sample URLs" is.

## Part D - What people actually think

This is the part most competitive research skips, and it is where the truth lives. Marketing
pages describe the product someone hoped to build. Reviews describe the one that shipped.

Sources:
- G2, Capterra, TrustRadius - read the 2 and 3 star reviews first, they are the honest ones
- Reddit: r/marketing, r/content_marketing, r/SaaS, r/copywriting, r/Entrepreneur
- Hacker News threads on any of these products
- Product Hunt comments
- YouTube reviews, especially "X months later" and "why I cancelled" videos
- App store reviews where a mobile app exists

Answer:
1. **What do people praise most?** Rank the top three things, with evidence.
2. **What do people complain about most?** Rank the top three, with evidence.
3. **Why do people churn?** Find actual cancellation stories and say what drove them.
4. **Which features get talked about, and which never come up?** A feature nobody mentions
   in a single review is a feature nobody uses. That is a strong signal and worth naming.
5. **Does the output actually sound like the brand?** Find direct testimony either way. This
   is the closest thing to a verdict on whether the whole category delivers its core promise.
6. **What do people do instead?** Anyone describing a manual workaround - a prompt document
   they paste in every time, a Google Doc of examples, a custom GPT - is describing our
   product before it exists. Collect every instance of this you find.

Quote reviewers briefly and link the source. Distinguish a one-off gripe from a pattern you
saw repeated.

## Part E - Voice definition, in depth

For every product in Part B that claims a brand voice feature, get to the bottom of the
mechanism:

1. **What the user supplies:** uploaded documents? pasted samples? a URL to analyse? tone
   sliders? a dropdown of adjectives? free text? Be exact, including how many samples and
   what file types.
2. **What the product does with it:** does it extract a description, build a prompt, fine-tune
   a model, retrieve examples at generation time? Say what you can verify and label the rest
   as inference.
3. **Can the user see the result?** Is the derived voice shown back to them as something
   readable and editable, or is it a black box?
4. **Can it be edited directly?** If the tool gets the voice slightly wrong, can a human
   correct it, or only feed it more samples?
5. **Is it versioned?** Can you see what changed and when, or roll back?
6. **Is it exportable?**
7. **How many voices per account?** A brand with a legal register and a social register -
   can the product hold both?
8. **What happens at the edges?** Any evidence about how the voice holds up on unusual
   content types, bad news, or regulated copy.

Questions 3, 4, and 5 are the ones we care about most. Our whole claim is that a brand
voice should be a readable, editable, versionable artifact the customer owns. Find out how
close anyone comes.

## Part F - Evaluation tooling

We have to score "on-brand" and defend the number, on a $50 total API budget.

Cover promptfoo, Braintrust, LangSmith, LangFuse, OpenAI Evals, and any published guidance
on LLM-as-judge. For each:
1. Unit of evaluation - single output, pairwise, whole test set?
2. How the scoring criterion is written down. Rubric format.
3. Small models as judges - is it done, when is it safe, what breaks?
4. Known failure modes: positional bias, verbosity bias, self-preference, score clustering.
5. What they say about cost per eval run.
6. How they handle subjective criteria, which "on-brand" certainly is.

## Part G - Markdown as configuration

The pattern our brand profile belongs to. Naming it correctly is a strong signal.

Cover Anthropic's Agent Skills and `CLAUDE.md`, Cursor rules, `copilot-instructions.md`,
and public human style guides: Mailchimp Content Style Guide, GOV.UK content design,
Microsoft Writing Style Guide, Google developer documentation style guide.

For each:
1. Single file or folder? If a folder, what are the files and how are they named?
2. Rules versus examples - which does it lean on, and in what ratio?
3. How long is it, and is there guidance on length limits?
4. How does it handle conflicts and precedence between rules?
5. Known failure modes: sections that get ignored, staleness, contradictions.

---

## Entry format

For products, in `prior-art.md`:

```markdown
### <Product name>
**What it is:** one line.
**Who buys it:** and for what job.
**Price:** entry point, and what tier unlocks brand voice.
**Sources:** URLs, each with the date you checked it.
**How voice is defined:** the specific mechanism, in detail.
**Voice is visible / editable / versioned / exportable:** four answers.
**Evaluates its own output:** yes / no / partial, with detail.
**Learns from edits:** yes / no, with detail.
**Most praised:** with a linked example.
**Most complained about:** with a linked example.
**Where it breaks down:** the honest limitation.
**What we take:** or "nothing".
**What we reject:** and why.
```

## Rules

- **Evidence or nothing.** Every claim carries a URL and the date checked. If you cannot
  verify something, write "could not verify". Never infer a feature from marketing copy.
- **Prefer documentation, changelogs, help centres, and pricing pages to landing pages.**
  If a claim rests only on a landing page, say so.
- Behind a signup wall you cannot pass? Write "paywalled, could not verify". That is a
  finding, not a failure.
- Quote briefly and always attribute with a URL. Never paste large blocks of anyone's copy.
- Separate what you observed from what you inferred. Label inferences.
- Do not recommend an architecture. Findings only.

## Finish with these four sections

**What the category is good at.** Where these products genuinely deliver. Be generous here -
a competitive review that finds no strengths is not credible.

**Where the category fails.** The repeated complaints and the gaps nobody fills.

**Does our idea already exist?** Direct answer. If something already does folder-based,
inspectable, versioned brand definitions with an evaluation loop, name it and describe how
well it works. Do not soften this.

**Questions this raised.** What you could not resolve that a human should decide.
