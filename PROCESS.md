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
