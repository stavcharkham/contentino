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

## 2026-08-12 - Session 3: research reviewed, product reframed, rubric set

**Reviewed both research passes.** The check that mattered was whether the Lemonade findings
were real, since the in-app copy was transcribed from screenshots by a small model. Every
LEM id cited across the analysis and the guidelines was verified against the corpus - 37
citations in each, all present, none invented. Two flaws found and left in the record rather
than quietly fixed: the corpus header claims 61 excerpts when there are 54, and around eight
entries rest on search summaries rather than a confirmed source. The pass also refused to pad
- asked for 10 rewrite pairs it delivered 5 and said why. That is the right failure mode and
worth more than hitting the number would have been.

**Dropped open source.** It bought generality we do not need and cost a neutral example
profile, a second brand to prove the point, and licensing surface, inside a five-day budget.
Naming Lemonade as the customer also sharpens every product question: "would a Lemonade
content person use this on a Tuesday" has an answer, "would anyone" does not. The old
decision is annotated as reversed rather than deleted, since the reasoning it argues against
is the interesting part.

What survives the reversal is the folder, for a better reason than before. The old argument
was portability for strangers. The new one is that an approved guideline has to graduate into
a skill in the company plugin and a tool in the agent, and a settings row cannot graduate.
Stav's framing, and it is a better product idea than the one the project started with.

**Argued against the 10x goal and won the point.** Stav wanted content produced 10x faster.
The prior-art research says the complaint across every product in the market is the editing
and checking still needed before publishing, not drafting speed. Nobody is bottlenecked on
writing. Making drafting faster produces more drafts queuing in front of the same reviewer.
Moved the 10x onto time-to-approved. This is the clearest case in the project so far of
research changing a goal rather than decorating one.

**The rubric.** Six criteria scored 0-2, with compliance as a veto. Three of them - register
match, humour boundary, plain language calibration - exist because the research found those
specific failure modes, not because they sounded measurable. Stav tightened the thresholds:
below 8 nothing reaches a human at all. His reasoning is better than the original proposal,
because a person editing a 6 into an 8 is the exact overhead the product exists to delete,
and regenerating is cheaper than their attention.

One design note worth keeping: the research said pairwise judging beats absolute scoring, and
we have 54 real Lemonade excerpts. So the subjective criteria get judged against a real
example at the same stakes level rather than scored in the abstract, and the corpus becomes
the benchmark instead of research leftovers. It also gives a free validation: real Lemonade
copy should score 9-10, and if it does not the rubric is wrong.

**On writing RESEARCH.md.** Took four passes and the corrections were all the same
correction. The first draft explained our reasoning to ourselves. Stav's note was that the
document is written for people at Lemonade, and they should not have to read our process to
understand our findings. He caught a line - "Read through one filter: the person using this
works here" - that told the reader the method instead of just writing from it. Worth
recording because the same failure will recur in the final write-up, where the temptation to
narrate the thinking is strongest.

**Verified, and not.** RESEARCH.md, RUBRIC.md and the doc reframe are written and committed.
The rubric has not been tested against anything. Until the corpus is scored, it is a
reasonable-looking document with no evidence it works.

## 2026-08-12 - Session 3 addendum: scope answered

**Checked the shortlist against the brief before acting on it.** The plan was to pick the
two or three content types with the most evidence. Reading the assignment's five named
streams changed the answer: app store release notes are our second-best-evidenced type at 8
solid excerpts and are not one of the five. Picking on evidence alone would have shipped a
stream nobody asked for. Release notes stay in the corpus as material for the base voice.

The overlap that matters: product micro-copy has ~27 excerpts and is named. External comms
has 8 and is named. Customer email has zero, and we had just decided not to research further,
so it is out. Those two also sit at opposite ends of the stakes axis, which means the two
shipped streams demonstrate both product goals rather than the same one twice.

**The reframe Stav made, which is larger than it looks.** We are not authoring Lemonade's
guidelines. The content team is. Our job is the path that makes adding a content type safe
and easy. That converts an obvious weakness into the argument: we ship two streams deeply and
show that the third takes an afternoon and belongs to the people who own the copy. A tool
whose coverage depends on us stops growing the day we stop working on it.

It also adds a gate nobody had thought about. `RUBRIC.md` scores generated content. If the
content team authors guidelines, something has to score the *guideline*. The check that falls
out of it is neat: a new content type ships with real approved examples, those examples get
scored against the rubric using their own guideline, and if genuine copy does not reach 9-10
the guideline is wrong. Same trick as validating the rubric against the Lemonade corpus,
pointed at a different target.

**Content type won over stakes, and the reason is worth keeping.** The research pointed at
stakes as the organising axis. Stav chose content type with stakes layered inside, and that
is right once the content team owns authoring, because a content person looks for "product
micro-copy" and not for "medium stakes". Structuring the file tree around a research finding
at the cost of the people who use it would have been optimising for the wrong reader.

## 2026-08-12 - Session 4: rubric validation run

**Ran the validation brief directly in-session rather than forking it.** Stav asked to run
it, and given the model switch to Sonnet mid-session, doing it here rather than spinning up
a fresh fork kept the context (RUBRIC.md, the corpus, the brief itself) already loaded rather
than re-derived. Scored all 47 items by direct reasoning, no API calls, per the brief's own
rule.

**Two process errors happened during construction, and both are disclosed in `eval/scores.md`
rather than quietly fixed.** One real item (LEM-025) was scored during planning but never
placed into the actual scoring table. One row (S-33) got a copy-paste error and duplicates
another item. Neither changes the verdict - LEM-025's would-be score barely moves the mean -
but the instinct to fix it silently and move on was there, and the point of this whole
exercise is that quiet fixes are exactly what erode trust in a number. Left both visible.

**The result is a real pass/fail, not a rubber stamp.** Real Lemonade copy scored 8.80 against
a 9+ target - a genuine miss, by a fifth of a point, not massaged into a pass. The reason
traces to one criterion (direct address) systematically scoring 0 on content that structurally
has no addressee - release notes, headlines, field labels - which is punishing the format
rather than the writing. Two real, confirmed Lemonade quotes (the "word salad" and "no document
is readable" lines from the Policy 2.0 README) landed in the regenerate band for a related
reason: the register criterion has no wording for casual commentary *about* legal text as
distinct from casual language *inside* legal text.

**The best result in the report has nothing to do with the missed target.** LEM-040 - the
real, deleted 2021 tweet about AI reading "non-verbal clues" for fraud, the one that caused
Lemonade's actual public discrimination backlash - was scored fresh against the rubric's
compliance criterion, with no prior knowledge fed in beyond what the corpus already recorded.
It failed the veto. If this rubric had existed and been applied before that tweet went out, it
would have caught it. That is the single piece of evidence worth leading with when this gets
presented, because it is not a hypothetical - it is the rubric being tested against a mistake
that actually happened and actually cost the company something.

**Verdict: the rubric works, needs two narrow wording fixes, and the fixes are queued in
`PLAN.md` rather than applied yet** - the brief's own rules said not to touch `RUBRIC.md`
during validation, so the fix is next session's first task, not this one's.
