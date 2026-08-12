# Prior art - the AI content generation space

> Research for Contentino, an open-source content generation tool built around a brand
> profile: a folder of markdown that defines how a company writes, evaluated and improved
> from human edits. This document maps the competitive space, checked 2026-08-12.
> Companion file: `research/feature-matrix.md`.

**Method note.** All research below is via web search, help documentation, pricing pages,
and public review sites - no product was logged into or trialled directly. Claims resting
only on a landing page are flagged. "Could not verify" and "paywalled" are used deliberately
rather than inferring from marketing copy.

---

## Part A - Map of the space

### Brand-voice-first tools
**Writer, Jasper, Acrolinx, Grammarly Business.** Buyer: marketing ops or content ops lead
at a mid-size-to-enterprise company, usually with a compliance or consistency problem
already in hand (regulated industry, distributed team, agency-managed content). Job hired
for: stop content drifting off-brand as more people and more AI touch it. Entry price:
Writer ~$18-39/seat/month rising to custom enterprise; Jasper has a Business tier gating
Style Guide; Grammarly Business requires Pro/Enterprise for Style Guides and Brand Tones;
Acrolinx is enterprise-quoted, no public self-serve tier found.

### Volume copy generation
**Copy.ai, Anyword, Rytr, Copysmith.** Buyer: solo marketer, small agency, or performance
marketing team. Job hired for: produce a lot of short-form variants fast (ad copy, product
descriptions, social captions) rather than fewer, longer, more considered pieces. Entry
price: Copy.ai free tier then $29-49/month; Anyword and Rytr similarly priced in that band.
Copy.ai's flagship differentiator has shifted toward GTM workflow automation (its own
positioning), not pure copywriting - worth noting as category drift.

### Marketing suites with AI bolted on
**HubSpot Content Hub, Salesforce/Marketing Cloud, Adobe Firefly + Express, Canva Magic
Write, Mailchimp.** Buyer: whoever already owns the CRM/ESP/design tool license; AI
features arrive as an add-on to a purchase decision made for other reasons. Job hired for:
generate content without leaving the tool where distribution already happens. Entry price:
bundled into existing suite pricing, hard to isolate. HubSpot's Brand Voice specifically
asks for a 500-word writing sample plus personality-trait and tone selections, then lets you
toggle it on per channel (blog, email, social) - source:
[Evenbound - How To Use the Brand Voice HubSpot AI Tool](https://evenbound.com/blog/hubspot-ai-tools-brand-voice),
checked 2026-08-12.

### Social and repurposing
**Typefully, Buffer AI, Taplio, Opus Clip, Munch.** Buyer: individual creator or small
social team. Job hired for: take one piece of long content and cut it into many
channel-native pieces. Not evaluated in depth for this brief - out of our direct competitive
set since they don't claim brand-voice consistency as their core value prop, but worth a
name-check as the "repurposing" feature row in the matrix maps to what these do full-time.

### SEO-led content
**Surfer SEO, Frase, Clearscope, MarketMuse.** Buyer: SEO or content marketing lead
optimizing for search ranking primarily, brand voice secondarily if at all. Job hired for:
hit keyword and structure targets that move rankings. Voice consistency is not these
products' selling point - they optimize for the algorithm, not the brand. Included here
because "brand voice AND ranks well" is a real, unmet combination worth naming as a gap
(see closing sections).

### Agent-shaped newcomers
No search turned up a credible, distinct "chat/agent interface for branded content"
category leader beyond the incumbents repositioning (Writer's "AI agents," Jasper's "AI
agents for marketing" homepage framing). This looks less like an empty niche and more like
the whole category converging on agent/chat framing as the current industry-wide pitch,
which is itself a finding, not a gap - see closing sections.

### Dead or acquired
No confirmed shutdowns or acquisitions surfaced in this pass specifically among the
brand-voice tier. Not confidently ruled out either - would need a dedicated pass (Crunchbase,
TechCrunch acquisition archives) to state this with confidence. Marked as an open item.

---

## Part C - How it actually works (four products, walked step by step)

### Jasper
1. **First login:** the product asks the user to either point it at a company website to
   crawl, or upload text samples/files for analysis - not a blank prompt box.
   Source: [Jasper Help Center - Brand Voice](https://help.jasper.ai/hc/en-us/articles/18618693085339-Brand-Voice), checked 2026-08-12.
2. **Empty state to finished content:** crawl or upload → Jasper produces a generated "voice
   excerpt" (its own written summary of the detected voice) → user reviews/adjusts Tone &
   Style fields (e.g. "Helpful, but not bossy") → voice becomes the default applied to every
   generation in the workspace, with per-generation override available.
   Source: same, plus [Jasper Style Guide](https://help.jasper.ai/hc/en-us/articles/25925092890011-Style-Guide), checked 2026-08-12.
3. **What's supplied each time vs remembered:** the voice profile persists and applies by
   default; the user supplies only the content brief/prompt per piece, not the voice again.
4. **Where humans intervene:** adjusting the Tone & Style text fields after seeing the
   voice excerpt, and per-piece prompt/brief writing.
5. **Interface:** a mix of chat (Jasper Chat) and structured "Apps"/templates, with a
   Canvas-style inline editor for style-guide-aware editing.

### Copy.ai
1. **First login:** onboarding leans toward the same pattern as Jasper - upload writing
   samples, brand guidelines, or a URL.
   Source: [SalesHive - Copy.ai Review 2026](https://saleshive.com/vendors/copy-ai), checked 2026-08-12.
2. **Empty state to finished content:** samples/URL → Copy.ai builds a voice profile →
   applied automatically to generations. Product positioning claims up to 40% reduction in
   editing time from this (vendor claim, unverified independently).
3. **What's supplied each time:** per-piece task/prompt via Chat by Copy.ai or a workflow.
4. **Where humans intervene:** unclear from available sources - could not verify whether
   there is a visible, editable voice artifact the way Jasper's "voice excerpt" is, or
   whether it's closer to a black box. Marked as an open question for the analysis section.
5. **Interface:** Chat-first, with "workflows" (Copy.ai's GTM automation framing) layered
   on top - the product has moved toward broader marketing-ops automation, not just
   copywriting, in its 2026 positioning.

### Grammarly Business
1. **First login:** for Brand Tones specifically - a guided flow, not free text. Users
   answer a handful of questions and select **sample phrases** that most closely match
   desired brand tones; Grammarly then returns a recommended tone profile built from those
   selections. Vendor claims this takes under a minute for existing Grammarly Business users.
   Source: [Grammarly Support - Introducing brand tones](https://support.grammarly.com/hc/en-us/articles/4403544890253-Introducing-brand-tones-from-Grammarly-Business), checked 2026-08-12.
2. **Empty state to finished content:** this product does not generate long-form content -
   it's a real-time writing checker. The "content" is whatever the user is already writing
   in any connected surface (browser, Docs, Slack, email), and Grammarly overlays live tone
   feedback as they type.
3. **What's supplied each time:** nothing extra - the tone profile is set once at the org
   level and applied passively to everyone's writing everywhere Grammarly is installed.
4. **Where humans intervene:** accepting or ignoring the real-time tone suggestions.
5. **Interface:** fundamentally a browser extension / inline writing assistant, not a
   generation surface at all. This is architecturally the most different of the four -
   worth flagging since it changes what "brand voice" even means in this product (correction
   layer, not generation layer).

### HubSpot Content Hub
1. **First login:** explicit onboarding step - HubSpot **asks for a writing sample of at
   least 500 words**, then has the user choose from a list of personality traits and tone
   options.
   Source: [Evenbound - How To Use the Brand Voice HubSpot AI Tool](https://evenbound.com/blog/hubspot-ai-tools-brand-voice), checked 2026-08-12.
2. **Empty state to finished content:** sample + trait selection → voice profile created →
   user enables/disables its use per channel (blogs, email, social independently switchable).
3. **What's supplied each time:** nothing extra once set; per-channel toggles persist.
4. **Where humans intervene:** the per-channel on/off toggle is a distinctive design choice
   worth noting - it's an admission that one voice doesn't necessarily fit every channel,
   which is directly relevant to our own "one voice or several" question for Lemonade.
5. **Interface:** embedded generation inside HubSpot's existing content editors (blog editor,
   email editor, social composer) - the AI writes into tools that already exist, rather than
   being a separate destination.

**Cross-cutting observation from Part C.** Every product that defines voice from samples
(Jasper, Copy.ai, HubSpot) uses roughly the same shape: **upload/crawl → derived summary →
optional light editing of that summary → applied by default.** None of the four surfaced
evidence of the derived voice being a fully open, freely-editable, versioned document a
customer could take with them - see Part E.

---

## Part D - What people actually think

### Most praised (with evidence)
1. **Speed and volume.** Recurring theme across G2/Capterra summaries for Jasper and Copy.ai:
   users praise how fast they can produce drafts, especially templates and workflows.
2. **Brand voice matching, when it works.** One G2 reviewer on Jasper: *"Jasper can mimic my
   voice once I write"* - a positive data point, but notably conditional on the user having
   already fed it good samples.
   Source: [G2 - AI Writing Tools Imitate Your Voice, But Aren't Quite You](https://learn.g2.com/ai-writing-tools-imitate-your-voice-but-arent-quite-you), checked 2026-08-12.
3. **Grammarly's brand-tones beta metric:** vendor-reported *"average 40% increase in the
   usage of on-brand tones among team members"* during the beta. This is a vendor claim from
   Grammarly's own materials, not independently verified, but it's the only quantified claim
   found anywhere in this research linking a product feature to a measured on-brand outcome -
   worth flagging as rare.
   Source: [Grammarly Business - Build Trust and Deliver Consistency With Brand Tones](https://www.grammarly.com/business/learn/brand-tones/), checked 2026-08-12.

### Most complained about (with evidence)
1. **Off-brand or generic output despite "brand voice" features.** Same G2 source: another
   reviewer reported *"The output quality was very very bad"* on Jasper and switched to
   plain ChatGPT because, in their words, *it could follow our brand voice perfectly* -
   i.e., a dedicated brand-voice product losing to a generic chat model on the exact
   dimension it's supposed to own. This is the single most important review-derived finding
   in this brief.
   Source: same as above, checked 2026-08-12.
2. **Needs heavy fact-checking / editing before publish.** Recurring across Jasper and
   Copy.ai review summaries - "content requiring significant fact-checking and editing"
   flagged as a common G2 concern for Copy.ai.
   Source: [G2 - Best AI Content Creation Platforms](https://www.g2.com/products/copy-ai/reviews), checked 2026-08-12.
3. **Plagiarism / originality risk.** Copy.ai reviewers specifically warn that generated
   content "might be pulled from already-published web pages and could be flagged as
   plagiarism," advising it be used as a guide rather than final copy.
   Source: same, checked 2026-08-12.
4. **Price, and the gap between marketing claims and generic-prompt output.** Broader G2/
   Capterra pattern: "price, generic output without detailed prompts, and the need to
   verify facts before publishing" are the recurring negative cluster across the category,
   not specific to one vendor.

### Why people churn
Direct, sourced cancellation narratives were hard to find for the brand-voice tier
specifically (Writer, Jasper) - review platforms in this space skew toward G2/Capterra,
which are known to under-represent churned users (they capture active customers more than
people who left). This is itself worth naming: **the review ecosystem for this category is
structurally biased toward retained, satisfied users**, which means "most complained about"
above likely understates real dissatisfaction. Flagging as a limitation of this research
rather than papering over it.

### Which features get talked about, and which never come up
Talked about constantly: speed, templates, brand voice matching (both praise and complaint),
price, output quality/fact-checking burden.

**Never came up in any review excerpt surfaced by this research:** version history of a
brand voice profile, exporting a brand voice, or a brand voice profile changing because a
human edited generated output. Zero review mentions of any of these three things were found
across all searches run for this brief. That absence, held against the "unverified" rows in
the feature matrix for the same three capabilities, is a consistent signal from two
independent angles (vendor documentation and user reviews) that these capabilities are
either absent from the category or so unused that no one talks about them either way.

### Does output actually sound like the brand?
Split testimony, not consensus. Positive: the "Jasper can mimic my voice once I write"
quote above. Negative: the ChatGPT-comparison quote above, and the general "generic output"
complaint pattern. **Reading across both:** the products that work well for users appear to
be the ones where the user did substantial manual setup (good samples, careful tone-field
editing); the complaints cluster around users who expected the "brand voice" feature to work
well from minimal input. That gap between setup effort and output quality is a real finding
about the category, not just about one vendor.

### What people do instead (manual workarounds)
This is the most direct evidence of demand for something like Contentino found in this
research. The pattern is consistent and well-documented across multiple independent sources:

- **The "paste and pray" problem**, named explicitly in workaround guides: needing to paste
  brand voice instructions into ChatGPT every single conversation, with no persistence
  between sessions, and the instructions eating into context window budget.
  Source: [Atom Writer - How to Build a Custom GPT for Your Brand Voice](https://www.atomwriter.com/blog/custom-gpt-brand-voice/), checked 2026-08-12.
- **Custom GPTs as the DIY fix**, with the style guide "baked into" the Instructions field -
  but explicitly noted that *any time you update the guide, you'll need to manually replace
  it in the GPT settings to keep it current*. This is a manual, unversioned, single-point-of-
  failure sync process - exactly the problem git would solve.
  Source: [Triple Whale / CXL - Build a custom GPT for your brand](https://cxl.com/blog/build-a-custom-gpt-for-your-brand/), checked 2026-08-12.
- **The underlying organizational problem named directly:** *"teams using personal ChatGPT
  accounts to create content means nobody's following the same guidelines and nobody's
  feeding it your brand's actual voice."* This is close to a verbatim statement of the
  problem Contentino exists to solve.
  Source: [CXL - Protect your brand voice: Build a custom GPT for marketing](https://cxl.com/blog/build-a-custom-gpt-for-your-brand/), checked 2026-08-12.
- **Storage location for the manual guide** is explicitly ad hoc: *"store your guide
  somewhere accessible like a Google Doc, Notion page, or brand portal."* No source proposed
  git or any versioned system - reinforcing that this specific idea (profile as versioned,
  diffable files) doesn't appear to already exist as common practice, even among people
  actively solving this exact problem by hand.
  Source: same, checked 2026-08-12.
- A cottage industry of paid prompt packs ("Brand Voice Custom GPT Instructions," "ChatGPT
  Prompts for Brand Marketing" on Gumroad) exists specifically to sell people ready-made
  versions of this manual workaround - evidence people will pay for a shortcut to something
  this product would give away as an open-source structure.

---

## Part E - Voice definition, in depth

Answering the eight questions from the brief for the three products where enough was found
to say something specific (Jasper, Copy.ai, HubSpot). Grammarly and Acrolinx are excluded
here because they are correction/governance layers, not generative voice engines - the
questions don't apply the same way.

| Question | Jasper | Copy.ai | HubSpot |
|---|---|---|---|
| **1. What's supplied** | Website crawl OR uploaded text/files | Uploaded samples, brand guidelines, or a URL | One 500+ word writing sample, plus trait/tone picks from a list |
| **2. What it does with it** | Analyzes sentence structure, vocabulary, "emotional resonance" (vendor's own words); outputs a written "voice excerpt" | Vendor says "analyzes existing content to learn tone and style"; mechanism beyond that not disclosed - **inference only** | Not disclosed how the sample is processed - **inference only, could not verify** |
| **3. Visible / editable result** | **Yes** - the "voice excerpt" is a readable summary, and the Tone & Style fields are directly editable | **Could not verify** - no evidence found of a visible artifact equivalent to Jasper's excerpt | **Could not verify** - trait/tone selections are visible and editable, but not clear if there's a fuller derived summary underneath |
| **4. Directly editable vs. re-feed only** | Editable via the Tone & Style text fields | Unverified | Editable via trait/tone re-selection; unclear if the underlying sample can be edited or only replaced |
| **5. Versioned** | No evidence found | No evidence found | No evidence found |
| **6. Exportable** | No evidence found | No evidence found | No evidence found |
| **7. Multiple voices per account** | Yes - multiple Brand Voice profiles, admin sets workspace default, users can override per generation | Unverified | Unverified - but the per-channel on/off toggle is adjacent evidence they've thought about "one voice doesn't fit everywhere" |
| **8. Edge-case behavior (bad news, regulated copy)** | No evidence found for any product | No evidence found | No evidence found |

**The finding that matters most here:** questions 5 and 6 - versioning and export - return
**no evidence found, for every product checked, from any source (vendor docs, help
centers, or reviews).** Combined with the "learning from edits" row in the feature matrix
also being entirely unverified/no-evidence, and the "never came up in any review" finding in
Part D, three independent research angles converge on the same gap: **nobody in this
category treats the brand voice as an inspectable, versioned artifact the customer owns.**
It is closer to a workspace setting than a document. That gap is exactly where Contentino's
git-based, folder-of-markdown approach sits, and it appears to be genuinely open rather than
already occupied.

---

## Part F - Evaluation tooling

### promptfoo
1. **Unit of evaluation:** primarily single-output grading via assertions; supports
   dataset/suite runs across many test cases in one config.
2. **Rubric format:** `llm-rubric` - "a plain-English grading instruction you give to
   another LLM when the check is too subjective for string matching." Natural language, not
   a structured scoring template.
3. **Small models as judge:** explicitly cautioned against for real use - documentation
   states a tiny model can verify the judge pipeline connects and functions, but "should not
   be used as a real judge." Local models via vLLM are supported as judges generally, but the
   guidance draws a line at trivially small ones.
4. **Cost guidance:** promptfoo tiers its checks - deterministic assertions (string match,
   regex, latency, cost thresholds) are free and instant; model-graded assertions
   (`llm-rubric`, answer-relevance) cost money because they call another LLM per test case.
   Default judge model for `llm-rubric` is GPT-5 unless overridden - a real cost
   consideration against our $50 budget, since GPT-5-tier judging on every generation would
   burn budget fast. Explicit advice found: not every test case needs an expensive judge -
   reserve model-graded checks for what deterministic checks can't catch.
   Source: [Promptfoo - LLM Rubric](https://www.promptfoo.dev/docs/configuration/expected-outputs/model-graded/llm-rubric/) and [LLM-as-a-Judge Guide](https://www.promptfoo.dev/docs/guides/llm-as-a-judge/), checked 2026-08-12.

### LangSmith
1. **Unit of evaluation:** both single-run (one output at a time against a rubric) and
   pairwise (two outputs compared side by side, reviewer picks a winner) via "Annotation
   Queues."
2. **Rubric format:** a rubric or explicit questions presented alongside the output in the
   single-run queue.
3. **Small models as judge:** not addressed directly in sources found.
4. **Cost guidance:** not addressed directly in sources found - would need a dedicated pricing-
   page pass.
   Source: [LangChain Changelog - Pairwise annotation queues](https://changelog.langchain.com/announcements/pairwise-annotation-queues-for-comparing-agent-outputs), checked 2026-08-12.

### LangFuse
1. **Unit of evaluation:** no built-in pairwise judge - the documented pattern is running
   two experiments on the same dataset and comparing per-item scores side by side in the UI,
   which is effectively a manual pairwise workflow layered on top of two absolute-scored runs.
2. **Rubric format:** not detailed in sources found beyond general "evaluation" framing.
3. **Small models as judge:** not addressed.
4. **Cost guidance:** general industry framing found rather than Langfuse-specific numbers -
   "testing at scale with human annotators gets expensive quickly, and automated approaches
   are faster but not reliable enough on their own."
   Source: [Langfuse - LLM Evaluation: Methods, Best Practices](https://langfuse.com/blog/2025-11-12-evals), checked 2026-08-12.

### OpenAI Evals
Not independently researched in this pass beyond general awareness - flagged as a gap,
would need a dedicated search to state anything specific with a source.

### Cross-cutting findings on evaluation
- **Pairwise vs. absolute:** the general reasoning found is that pairwise judgments ("which
  is better") are more reliable from human *and* model judges than absolute scores, because
  assigning a 1-10 score requires an internal calibration the judge may not have, while
  comparing two things side by side is a much easier task. This is directly relevant to our
  eval design: if we're scoring generated content against a brand profile, a **pairwise
  "which of these two drafts is more on-brand" design may be more defensible on a small
  budget than trying to get a reliable absolute 0-100 score from a small judge model.**
- **Cost discipline as an established pattern:** promptfoo's tiering (free deterministic
  checks first, expensive model-graded checks reserved for what deterministic checks can't
  catch) is a directly reusable pattern for our $50 budget - cheap/free checks (banned-word
  lists, sentence-length thresholds, contraction presence) can filter obviously-off-brand
  output before spending judge-model budget on borderline cases.
- **No source found addressing small-model-judge reliability specifically for subjective,
  brand-voice-style criteria** (as opposed to factuality or correctness, which is
  more commonly discussed). This is a real gap in available guidance, not just in this
  research - worth treating our own eval design as exploratory rather than assuming
  established best practice exists to lean on.

---

## Part G - Markdown as configuration

### Anthropic Agent Skills / CLAUDE.md
- **Structure:** a skill is a folder containing a required `SKILL.md` file, plus optional
  `scripts/`, `references/`, and `assets/` subdirectories. `CLAUDE.md` is a separate,
  project-level single file, distinct from a skill.
- **Rules vs. examples:** `SKILL.md` mixes YAML frontmatter (structured metadata) with
  markdown instructions, examples, and guidelines in the body - not a rules-only format.
- **Length handling:** explicit documented guidance to break a growing `CLAUDE.md` into
  separate markdown files referenced from the main one, once it gets large - i.e. the
  official pattern is progressive decomposition into a folder, not one ever-growing file.
- **Failure modes:** not directly documented in sources found, though the "reference when
  large" guidance implies an acknowledged failure mode of single-file bloat.
  Source: [GitHub - anthropics/skills](https://github.com/anthropics/skills/blob/main/README.md), checked 2026-08-12.

### Cursor rules
- **Structure:** legacy `.cursorrules` was a single root-level file with no scoping. Current
  structure is `.cursor/rules/`, a folder of individual `.mdc` files, each with YAML
  frontmatter for scoping (glob patterns, "always apply" flags).
- **Rules vs. examples:** frontmatter-driven scoping is the headline feature - rules are
  conditionally loaded based on which files are open/being edited, rather than always-on.
- **Length/precision handling:** explicit stated rationale for the migration is token
  efficiency and reliability - "saves tokens and makes rules far more reliable" - i.e. a
  single giant file was found to degrade reliability, not just to be inconvenient.
- **When to use which:** documented guidance is refreshingly direct - start with a single
  `.cursorrules` file if you want something working in five minutes; migrate to the folder
  structure once the project has multiple distinct layers needing different rules, or the
  single file gets unwieldy. This is a close, useful analogy for how a brand profile might
  need to scale from "one file" to "a folder" as a company's content surfaces multiply.
  Source: [WorkOS - What are Cursor Rules?](https://workos.com/blog/what-are-cursor-rules) and [Medium - How to Structure Cursor Rules in 2026](https://medium.com/@vibecodingdirectory/how-to-structure-cursor-rules-in-2026-the-5-level-system-cursor-rules-eaf0df16e8e7), checked 2026-08-12.

### Public human style guides (Mailchimp, GOV.UK, Microsoft, Google)
Not independently re-searched in this pass beyond prior general knowledge - flagged as a
genuine gap in this brief's execution. Would need dedicated searches per guide to state
anything with a fresh, dated source. **This is an honest miss, not a soft-pedaled one:** the
brief asked for these explicitly and they were not run down with the same rigor as the
software products above. Recommend a follow-up pass before this section is considered done.

---

## What the category is good at

These products genuinely deliver on producing volume quickly, and the better ones
(Writer, Jasper) genuinely reduce the manual, error-prone workaround of pasting a style
guide into a generic chat model every session - when properly set up with good samples, the
"can mimic my voice once I write" outcome is real and evidenced. Grammarly's real-time,
in-context feedback layer is a genuinely different and complementary approach to the
generation-first tools, catching drift after a human writes rather than only steering
generation before. HubSpot's per-channel toggle is a small but genuinely thoughtful design
answer to the one-voice-or-many question. The category has also converged, independently
across vendors, on roughly the same "samples in, derived summary out, editable defaults"
onboarding shape - suggesting the market has already found *a* local optimum for defining
voice from examples, even if it stops short of what we're proposing.

## Where the category fails

Three failures recur across every angle of this research - vendor docs, the feature matrix,
and user reviews independently: **no visible, versioned, exportable brand-voice artifact
anywhere in the category** (Part E); **no evidence anywhere that human edits to generated
output feed back into future generation** (feature matrix, Part D, Part E all return empty
on this); and **a real, evidenced gap between marketing promise and delivered "sounds like
us" quality for users who didn't do heavy manual setup** (Part D). The review ecosystem
itself is structurally biased toward showing this category more favorably than it may
deserve, since dissatisfied users mostly leave rather than review.

## Does our idea already exist?

**No - not as found in this research, and the evidence for that "no" is unusually
convergent.** Three independent research angles (vendor documentation, the feature matrix,
and user review mining) all return empty on the same three capabilities: a versioned brand
voice, an exportable brand voice, and generation that learns from edited output. Nobody
found in this pass treats brand voice as a customer-owned, git-style artifact - it is
uniformly treated as a workspace setting that lives inside the vendor's product. Separately,
and just as tellingly, the people who are already trying to solve this problem by hand
(Custom GPT builders) are storing their manual "brand voice" in Google Docs or Notion and
manually re-syncing it into a chat tool's settings whenever it changes - which is a
real-world, unprompted description of the exact problem git-backed profiles solve, written
by people with no awareness that a better answer might exist. That combination - the
established vendors' gap, and the DIY crowd's very specific, very solvable pain - is the
strongest available evidence that the idea is genuinely open. It should be stated plainly
rather than oversold: this is an absence-of-evidence finding, not a scan of every possible
competitor, and the "dead or acquired products" and "public style guide" sub-sections of this
brief were left thinner than the rest (see Part G note) - a committed reader should treat
this as strong but not exhaustive.

## Questions this raised

- **Is "learning from edits" actually unbuilt, or just undocumented and unmarketed?** Three
  research angles agree it's absent from public evidence, but none of them constitute
  logging into every product and testing it directly. A human with active trial access to
  Jasper or Writer could settle this in an afternoon and it would meaningfully strengthen or
  weaken our core differentiation claim.
- **Small-model-as-judge for subjective brand-voice criteria specifically** has no dedicated
  published guidance found anywhere in Part F. We may be doing genuinely novel work in our
  own eval design, which is exciting but also means we can't lean on an established recipe -
  worth deciding early whether we budget extra time for eval-design iteration.
- **The public style guide sub-section of Part G (Mailchimp, GOV.UK, Microsoft, Google) was
  not run down with the same rigor as the rest of this brief.** Should this be completed
  before RESEARCH.md is finalized, or is the Cursor/Skills evidence sufficient to write the
  "markdown as configuration" story on its own?
- **Should we look specifically for an MCP server on any of these competitors before we
  finalize our "Slack and MCP as surfaces" decision?** Zero were found in this pass, but the
  searches run were not MCP-specific enough to be confident that's a real gap rather than a
  search-term miss.
