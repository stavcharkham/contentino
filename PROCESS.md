# Process log

> How the work actually went, in order. `DECISIONS.md` records what we chose; this records
> how we got there, including the reasoning that never became a decision.
> The assignment write-up is assembled from both. Newest at the bottom.

---

## 2026-08-12 - Session 2: research setup

**What we did.** Split discovery into two independent research jobs and wrote a detailed
brief for each, to be run by a smaller model in forked conversations rather than in the main
thread.

**Why split it that way.** The two questions have nothing to do with each other. "What do
similar products do" is a survey of a market; "how does Lemonade write" is close reading of
a corpus. Running them together means each gets half the attention, and the second one
quietly inherits framing from the first. Running them in forks also keeps the main thread
clean for the design work that follows.

**Why a smaller model.** Gathering and tagging evidence is not the expensive part of this
project. Deciding what the evidence means is. Spending the good model on synthesis and the
cheap one on collection is the same call we are making inside the product itself - small
models for evaluation, larger ones for generation - and it is worth noting that we applied
our own architecture to our own workflow before we built it.

**The bet inside brief 01.** The prior-art brief makes one question the centre of gravity:
*how does each product let the user define their voice?* Everything else about a competitor
is context. If the answer across the market is "tone sliders and an uploaded PDF", our
folder-of-markdown claim has somewhere to stand. If someone is already doing files in git
and doing it well, we need to know on day 1, not day 4. The brief says so explicitly - it
asks the researcher to tell us plainly if our idea already exists and works.

**The bet inside brief 02.** The Lemonade brief refuses adjective-level findings. "Warm and
human" cannot be generated from and cannot be scored against, which makes it worthless to
both halves of our engine. So the brief demands measurable traits and a tagged corpus, and
it names the register question - one voice or several - as the finding that would most
change the design. It also singles out `failure` copy (errors, claim denials) as the highest
value and hardest to find, because that is where generated content usually collapses and
where a regulated insurer has the least freedom.

**Open at the end of this session.** Mobbin access, and whether a corpus of quoted Lemonade
copy belongs in a public repo. Both in `QUESTIONS.md`.

**Amendments after review.** Stav confirmed Mobbin access through MCP and chose to keep the
raw corpus out of the public repo. Both went to `DECISIONS.md`.

He also set a requirement for what comes after research: a full analysis and a brand
guidelines document with a lot of examples for everything. That reshaped brief 02 more than
it looks. The corpus target went from 40-60 excerpts to 120-150, because a guideline that
says "keep sentences short" is worth nothing and one that carries six real openings is worth
something - and those examples cannot be invented after the fact. Two new sections were
added: contrast pairs, where Lemonade says the same thing in two registers, which isolates
what actually changes with register while holding the subject still; and a pass that marks
the best two or three examples of each pattern, so whoever writes the guidelines is not
re-reading the whole corpus hunting for them.

**A risk we accepted knowingly.** The Mobbin tools return screenshots, so every in-app string
is transcribed from an image by a small model. That is the highest-probability place in this
research for a fabricated quote, and a fabricated quote in the corpus becomes a rule in the
brand profile. The brief handles it with verifiability rather than trust: every excerpt
carries its `mobbin_url`, anything not plainly legible is marked `[unclear]`, and partial
sentences may not be completed from context. Worth noting for the write-up, since the same
problem - a generated artifact that looks authoritative and cannot be checked - is the one
our own product exists to solve.

**One thing added to the brief on purpose.** The obvious story about Lemonade is that they
threw out insurance jargon for plain words. A quick check of the app shows plain "Deductible"
and "Hurricane Deductible" sitting on a coverage screen. So the brief names that story and
tells the researcher not to collect quotes that confirm it. Left alone, a small model with a
tidy hypothesis will find evidence for it every time.

**Second amendment - both briefs widened.** Stav pushed back on scope. Brief 01 was too
narrow: it treated the whole space as a single question about how tools let you set a voice.
That is our bet, but it is not the market. Rewritten into seven parts - map the space,
a ~29-column feature matrix, four walked product flows, a sentiment pass, the voice
mechanism in depth, evaluation tooling, markdown-as-config.

The addition worth naming is the sentiment pass. Marketing pages describe the product
someone hoped to build; reviews describe the one that shipped. So the brief sends the
researcher to two- and three-star reviews, churn threads, and "why I cancelled" videos, and
asks two questions we would not have got any other way: which features never come up in a
single review (nobody uses those), and who is describing a manual workaround - a prompt
document they paste in every time, a folder of examples, a custom GPT. Anyone doing that is
describing our product before it exists, and they are the closest thing to proof of demand
we can get without shipping.

Brief 02 was reorganised from register to **content type**, thirteen of them, ten to fifteen
examples each, 150-200 total. Register is still tagged, but content type is the axis a
content team actually works along and the axis the guidelines have to be organised by.
Mobbin dropped from being the backbone to being one source among many - the brief now sends
the researcher to milled.com for marketing emails, the Wayback Machine for copy that has
since been sanded down, and Reddit for screenshots of real claim denials, which is often the
only public route to genuine failure copy.

Brief 02 now also writes the guidelines itself rather than handing back raw findings. One
rule governs that document: every rule carries examples, cited by corpus ID, and a rule with
no example does not go in. That constraint is doing real work - it makes the document
checkable line by line, and it stops a small model writing confident guidance it never found
evidence for. We will rework the result, but we will be editing something evidenced rather
than starting from a blank page.

## 2026-08-12 - Session 2 close: both research briefs executed

**What happened.** Brief 01 (prior art) ran to completion in this thread - `research/prior-art.md`
and `research/feature-matrix.md`, reviewed with Stav in plain language twice (once too
narrowly focused on the voice-definition finding alone, corrected on request to cover the
full feature landscape, evaluation tooling, and markdown-as-config findings too). Brief 02
(Lemonade voice) ran in a separate fork per the original plan and returned
`research/lemonade-voice.md`, `research/lemonade-guidelines.md`, and the gitignored
`research/lemonade-corpus.md` - but has not been reviewed with Stav yet. That review is the
first item for next session.

**The headline finding from brief 01, worth carrying into any product decision:** across
every angle checked - vendor docs, the feature matrix, and user reviews - nobody in this
market treats a brand voice as something the customer can see in full, version, or export.
It lives as a workspace setting inside the vendor's product. Separately, people already
solving this by hand are pasting a style guide into ChatGPT every session or manually
re-syncing a Google Doc into a Custom GPT - unprompted, real evidence of demand for exactly
what a git-backed profile would fix. Counter-signal worth remembering: a Jasper reviewer
switched back to plain ChatGPT because it matched their brand voice better than Jasper's own
brand-voice feature did. "We have a brand voice setting" is not enough on its own, and the review evidence shows
people churn on that exact gap.

**Brief 02 came back honest about its own limits, which is the right failure mode.** It hit
61 of the 150-200 excerpt target and said so on its own front page rather than padding to
hit the number. `lemonade.com` blocked direct fetches, so several content types lean on
search-index snippets instead of full reads. Three content types - email/notifications,
ads/video, first-party failure copy - are thin to empty. Despite that, the finding it did
produce looks substantive: Lemonade's voice may split into three registers by **stakes**
(low/medium/high risk of the moment) rather than by **content type**, and the clearest
evidence is a single Maya chat modal where a punny feature pitch sits one sentence away from
a hard legal disclaimer. If that holds up on review, it argues against organizing the brand
profile by content-type folders and for organizing it by risk level instead - a real
architectural fork that should get decided deliberately, not by default.

**Not yet done, flagged rather than fudged:** RESEARCH.md is still the empty template from
day one - neither brief's findings have been folded into it. That's the actual next step
before Day 1 can be called closed.
