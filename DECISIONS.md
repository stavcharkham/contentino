# Decisions

Every product and build decision, with what was rejected and why. Written during `/handoff`
at the end of each session, after the work has been tested. Newest at the bottom.

Format:

```markdown
### YYYY-MM-DD - Short title
**Category:** product | build | research
**The problem:** what forced a choice. Written so someone with no context understands why
this came up at all.
**Decided:** what we're doing.
**Rejected:** what we considered and didn't do.
**Why:** the reasoning, including which constraint drove it.
**Reversible:** yes | no
```

---

### 2026-08-12 - Build it as an open-source product, not a Lemonade demo
> **Reversed later the same day.** See "Not open source. Internal product, built as if we worked at Lemonade." Kept here because the reasoning below is what the reversal argues against, and deleting it would hide the change of mind.

**Category:** product
**Decided:** Public repo, product-neutral name (Contentino). Lemonade ships as one example brand profile.
**Rejected:** A Lemonade-branded, Lemonade-only tool.
**Why:** The work is worth keeping past the interview, and "any company drops in a profile, here is Lemonade's" is a stronger demonstration of the architecture than a single-tenant toy. Keeping the product neutral also avoids publishing something that looks like an official Lemonade project.
**Reversible:** no, once public

### 2026-08-12 - Git is the only store. No database.
**Category:** build
**Decided:** Brand profiles, generated content, and captured edits are markdown files in git.
**Rejected:** A database for content and generated visuals.
**Why:** Visuals were dropped from scope, so everything left is text. Git gives versioning, diffs, review, and Obsidian compatibility for free, with no ops burden inside a 5-day budget. A pull request also doubles as the content approval and audit trail, which a regulated insurer needs. SQLite is the fallback if state appears that git cannot hold.
**Reversible:** yes

### 2026-08-12 - No authentication on the hosted demo
**Category:** product
**Decided:** The hosted demo is public and pre-loaded with example brand profiles. Switching brands means switching folders.
**Rejected:** Logged-in users with their own uploaded brand guidelines.
**Why:** Auth costs a session model, secret handling, and a user store, and buys nothing that demonstrates product thinking. Generality is proven structurally: a profile is a folder. A profile picker shows the same thing in an afternoon instead of a day and a half.
**Reversible:** yes

### 2026-08-12 - Surfaces are Slack and an MCP server
**Category:** product
**Decided:** Build for Slack and expose the engine as an MCP server. Figma goes in the plan but is not committed.
**Rejected:** A standalone web dashboard as the primary surface.
**Why:** Content work happens in Slack, in design tools, and in code, not in a tool people have to remember to open. Slack and MCP are the same engine reached two ways, which makes the platform argument without having to state it. A thin web UI still exists for the hosted demo.
**Reversible:** yes

### 2026-08-12 - Hosted on Vercel
**Category:** build
**Decided:** Vercel for the web demo and the MCP server endpoint.
**Rejected:** Self-managed hosting.
**Why:** Fastest path to a stable public URL, which is one of the deliverables. Free tier covers the demo's traffic.
**Reversible:** yes

### 2026-08-12 - Project lives outside the Obsidian vault
**Category:** build
**Decided:** Repo at `~/Desktop/cool-projects/contentino`. The interview brief and later the presentation live in a gitignored `interview/` folder inside it.
**Rejected:** Building inside the Obsidian vault at `Notebook/lemonade/`.
**Why:** The vault is itself a git repo, and a repo nested inside a repo creates a tracking mess. Keeping the brief in a gitignored subfolder means there is one working folder for everything, with nothing private reaching GitHub or Vercel.
**Reversible:** yes

### 2026-08-12 - Docs mirror the brief's own phases
**Category:** build
**Decided:** `RESEARCH.md` (discover), `PRD.md` (define), `DECISIONS.md` (design), `PLAN.md` (deliver).
**Rejected:** A generic docs layout.
**Why:** The brief asks for "an end-to-end mini-product cycle: discover, define, design, deliver". Structuring the repo the same way makes the thinking legible to the people who wrote that sentence.
**Reversible:** yes

### 2026-08-12 - Raw research corpora stay out of the public repo
**Category:** product
**Decided:** `research/*-corpus.md` is gitignored. The analysis derived from a corpus is published; the quoted excerpts are not.
**Rejected:** Publishing the Lemonade corpus with short attributed excerpts.
**Why:** Short quotes for style analysis are ordinary research and would probably be fine, but the repo goes public and the corpus file is a page of another company's copy with no upside in shipping it. The analysis is our work and is the part worth reading. Gitignoring costs nothing and removes the question.
**Reversible:** yes, though not once published

### 2026-08-12 - Lemonade's in-app copy comes from Mobbin via MCP
**Category:** research
**Decided:** Pull `ui-microcopy`, `conversational`, and `failure` copy from Mobbin's screen library through its MCP server. Confirmed the Lemonade Insurance app is present, including the Maya onboarding and the claims flow.
**Rejected:** Working from App Store screenshots and the web funnel only.
**Why:** In-app copy is a distinct register and the only place we can see how the brand behaves when a user is mid-task or being told no. Losing it would leave the profile with marketing voice and little else.
**Risk carried:** the tools return screenshots, so every string is transcribed from an image. The brief requires a `mobbin_url` on every excerpt and an `[unclear]` marker on anything not plainly legible, so a human can spot-check.
**Reversible:** yes

### 2026-08-12 - Voice is organised by stakes, not by content type
**Category:** research
**Decided:** Provisionally treat the register-switching rule in the Lemonade brand profile as keyed to the stakes of the sentence (low/medium/high - performing/working/covering), not to which content type it appears in. Evidence: the same UI modal switches from an excited feature pitch straight into a flat liability disclaimer between two adjacent sentences.
**Rejected:** Organizing the profile strictly by content type (the structure brief 02 was written around).
**Why:** Content type predicts almost nothing about register on its own - marketing, UI, and chat surfaces all contain all three registers depending on what's being said in that specific sentence. A content-type playbook is still useful for defaults, but the switching rule itself has to travel with the sentence, not the channel.
**Reversible:** yes - this is a first-pass read from 61 excerpts on one research run, not yet cross-checked

### 2026-08-12 - Not open source. Internal product, built as if we worked at Lemonade.
**Category:** product
**Decided:** Reverses the 2026-08-12 decision "Build it as an open-source product, not a Lemonade demo". The product is internal: its user is an employee, not a customer. Lemonade is who we build for, not one example among many.
**Rejected:** Shipping it public with Lemonade as one profile of several.
**Why:** Open source bought generality we do not need and cost complexity we cannot afford in 5 days - a neutral example profile, a second brand to prove the point, contribution and licensing surface. Naming Lemonade as the customer also sharpens every product question, because "would a Lemonade content person use this on a Tuesday" has an answer and "would anyone" does not.
**What survives the reversal:** the profile is still a folder. The old reason was portability for strangers. The new reason is better: an approved guideline has to graduate into a skill in the company plugin and a tool in the agent, and a settings row cannot graduate.
**Reversible:** yes

### 2026-08-12 - The product optimises time-to-approved, not time-to-draft
**Category:** product
**Decided:** Two goals, split by stakes. Low-stakes content is fully automated and publishes with no human. High-stakes content never auto-publishes; it arrives as a better draft and a person owns it.
**Rejected:** "Generate content 10x faster" as the headline goal.
**Why:** The prior-art research found the complaint cluster across every competitor is "needs heavy fact-checking and editing before publish", not "too slow to draft". Nobody is bottlenecked on writing. Optimising drafting produces more drafts queuing at the same review step. The split by stakes comes from the Lemonade research, which found the voice switches by risk of the moment rather than by content type - so the same axis that shapes the brand profile also decides what we are allowed to automate.
**Reversible:** yes

### 2026-08-12 - Six criteria, scored 0-2, nothing below 8 reaches a human
**Category:** product
**Decided:** `RUBRIC.md`. Register match, humour boundary, plain language calibration, direct address, mechanics, and compliance safety as a veto. 9-10 publishes, 8 gets a human, below 8 is regenerated. Any single 0 blocks. Same six criteria for every content type.
**Rejected:** A rubric per content type. Also rejected: sending 5-7 to a human for editing.
**Why:** Per-content-type rubrics inherit the assumption the research disproved - voice switches by stakes, and both registers can appear on one screen a sentence apart. A rubric keyed to content type would score that as one thing. On the threshold: a human editing a 6 into an 8 is the exact overhead the product exists to delete, and regeneration is cheaper than their attention. Criteria 1-3 exist because the research found those specific failure modes, not because they sounded measurable.
**Reversible:** yes

### 2026-08-12 - The content team authors guidelines. We build the machine that makes that safe.
**Category:** product
**Decided:** We do not author Lemonade's guidelines. We build the path that lets the content team add a content type, its guidelines, and its examples themselves, and we make that path enforce quality. We seed it with the two or three types we have evidence for.
**Rejected:** Us writing a complete set of guidelines for all five content streams and shipping that as the product.
**Why:** The content team understands their content better than we do, and a tool whose coverage depends on us authoring it stops growing the day we stop working on it. It also answers the obvious challenge to a partial build: we ship two or three streams deeply and show that adding the fourth takes an afternoon and belongs to the people who own the copy.
**Consequence:** there are now two gates, not one. `RUBRIC.md` scores generated content. A second, lighter check scores whether a *guideline* is fit to graduate: does it carry real examples, are they specific, do those examples score 9-10 against the rubric. A guideline whose own examples fail is a wrong guideline.
**Reversible:** yes

### 2026-08-12 - Ship two content streams deeply, seed a third
**Category:** product
**Decided:** **Product micro-copy** as the anchor (~27 excerpts: UI strings, bot flows, failure states) and **external comms / PR** as the second (8 excerpts: blog, investor notes). **Internal comms** seeded as a third if time allows. Not shipping customer emails or creative marketing as authored streams.
**Rejected:** Covering all five use cases from the brief. Also rejected: app store release notes, which is our second-best-evidenced content type but is not one of the five Lemonade named. Release notes stay in the corpus as evidence for the base voice.
**Why:** Those two sit at opposite ends of the stakes axis, which is the whole architecture in one demo. Micro-copy is high volume and mostly automatable, so it carries goal one. PR is low volume and high stakes, so it carries goal two. Customer email has zero usable evidence and we chose not to research further; generating it would mean inventing a voice we never observed.
**Reversible:** yes

### 2026-08-12 - Profile is organised by content type, with stakes as a layer inside each
**Category:** build
**Decided:** A folder per content type. Inside each, guidance keyed by stakes level. A shared base holds the rules that apply everywhere: registers, mechanics, vocabulary.
**Rejected:** Folders by stakes level, which is what the research alone would have suggested.
**Why:** The content team owns authoring, so the structure has to match how they think, and a content person looks for "product micro-copy" rather than "medium stakes". Stakes still survives as the layer inside each type, which preserves the finding that the voice switches by risk sometimes between adjacent sentences. Putting stakes on the outside would have optimised the file tree for a research finding at the cost of the people who have to use it.
**Also:** shared base plus scoped per-type files is the shape both Agent Skills and Cursor rules converged on independently, for the reason our own research turned up: one large file gets less reliable, not just less convenient.
**Reversible:** yes, though it means moving files

### 2026-08-12 - Rubric validated, not yet fixed
**Category:** build
**Decided:** `RUBRIC.md` works as a discriminator between on-brand and off-brand copy (8.80 vs 4.42 mean, gap 4.38) and its compliance veto correctly fires on a reconstruction of Lemonade's real 2021 AI-fraud tweet. It is not yet fit to gate anything, because two criteria need wording fixes first.
**Rejected:** Editing `RUBRIC.md` mid-validation to make the numbers look better. The validation brief explicitly forbade this, on the reasoning that a rubric adjusted until it passes has proven nothing.
**Why:** The real-item mean (8.80) missed the 9+ target because criterion 4 (direct address) scores 0 on content that has no addressee by design - release notes, headlines, field labels - which is a property of the format, not a voice failure. Nine of the ten items that landed in "review" instead of "publish" lost their only point here. Criterion 1 also needs to distinguish casual commentary about legal text from casual language inside legal text, which cost two genuine Lemonade quotes a point each.
**What held up without changes:** plain language calibration (near-perfect discriminator) and the compliance veto, which is the load-bearing result of the whole exercise - it caught the one real historical incident where Lemonade's own voice actually went wrong in public.
**Reversible:** yes, the fixes are narrow rewording, not a redesign

---

*Everything below came out of two conversations on 2026-08-13. The first was with Yuval,
CEO of RiseUp, who built an AI PR system: a recorded interview with an expert becomes a
brief, and the brief fans out to a press release, a LinkedIn post, and so on. The second was
with Noam, who builds AI products and argued about how the system should be put together.
Together they settled most of the open architecture questions. Where an entry below changes
something decided on 2026-08-12, it says so.*

### 2026-08-13 - One agent with many skills, not a team of agents
**Category:** build
**The problem:** Lemonade asked for one tool covering PR, internal comms, emails, marketing
and product copy. The obvious design is a separate AI agent per job, with a manager agent
directing them. We needed to know if that was right before building it.
**Decided:** One agent. Everything it can do is a separate "skill" it picks up when needed.
Writing a LinkedIn post is a skill. Writing a button label is a different skill. Scoring is a
skill. The skills are bundled together as a plugin, grouped the way the company is grouped.
**Rejected:** A main agent that calls other agents as tools.
**Why:** Noam's argument: if there is only one thing producing content, splitting it into
several agents buys nothing and costs us a whole layer of code that manages them talking to
each other. We have 5 days. Every hour spent on agents coordinating each other is an hour not
spent on the product. The bigger payoff is that the exact same skills serve two very
different users: a person working in Claude, and the unattended agent that runs by itself.
One build, both of our goals.
**Reversible:** yes

### 2026-08-13 - MCP is a delivery pipe, not the architecture
**Category:** build
**The problem:** We had been treating "should it be Slack or an MCP server" as a big
architectural decision. It was blocking thinking about everything else.
**Decided:** It was the wrong question. Skills are the thing we build. MCP is just one of the
ways a skill reaches a tool, alongside a plain API call or a command line. Where the output
appears is a separate, smaller question.
**Rejected:** Framing the whole build as "an MCP server", which is how it was written on
2026-08-12.
**Why:** Once skills are the unit, the delivery question stops being architectural and
becomes a choice of adapters. That freed us to say yes to several surfaces instead of
picking one.
**Reversible:** yes

### 2026-08-13 - Scoring runs automatically, not when the model remembers to
**Category:** build
**The problem:** `CLAUDE.md` says nothing ships unscored. But if scoring is just another
skill, the agent decides whether to use it, and sooner or later it won't.
**Decided:** Scoring is not a skill. It is wired into the plumbing as a hook, which is a
check the tool itself runs at a fixed moment, outside the model's control. When content gets
written, the hook scores it, records the result, and blocks anything that fails the
compliance check. The score then decides what happens next: publish, or hand to a person.
**Rejected:** Scoring as a skill the agent chooses to call.
**Why:** "Nothing ships unscored" has to be a fact, not a hope. A regulated insurer is
exactly the wrong place to rely on an AI remembering a rule.
**Consequence:** the unattended agent should be built on the Agent SDK rather than as a
plain script calling the API, because hooks only exist inside that harness. Same enforcement
in both modes.
**Reversible:** yes

### 2026-08-13 - Different content types get different scoring questions
**Category:** product
**The problem:** On 2026-08-12 we decided the same six questions score everything, and only
the consequence changes by content type. Then the rubric validation run found criterion 4
(direct address) scoring 0 on release notes, headlines and field labels, because those have
nobody to address. Nine of the ten items that failed to reach "publish" lost their only point
there. The rule was punishing content for its format.
**Decided:** Reverses the "same six criteria for every content type" part of the 2026-08-12
rubric decision. There is now a shared core that applies everywhere (register, humour
boundary, plain language, compliance) plus extra questions belonging to each content type. A
blog post gets asked whether its central claim is sourced. Micro-copy gets asked whether it
fits the character budget. Scores are converted to the same 10-point scale so they stay
comparable.
**Rejected:** Keeping one identical rubric and marking criteria "not applicable", which is
the same thing with more bookkeeping.
**Why:** Our own validation data forced it, and Noam made the same point independently: a
LinkedIn post and a button label are different enough that pretending one set of questions
fits both is dishonest. What does survive is the part worth keeping, the bands. 9-10
publishes, 8 gets a person, below 8 is regenerated, any zero blocks, compliance vetoes. You
still only have to remember one thing: what a number means.
**Where it lives:** each content type's questions sit in that type's folder, next to its
guidelines and examples. Same shape as the profile.
**Reversible:** yes

### 2026-08-13 - The profile holds individual people's voices, not just the company's
**Category:** product
**The problem:** A LinkedIn post published under the CEO's name does not sound like the help
centre. Our profile only had one voice, the company's.
**Decided:** The profile gets a place for individual voices alongside the company voice.
**Rejected:** One company voice for everything.
**Why:** Both conversations raised it without prompting. Yuval listed the spokesperson as one
of the three things that determine whether a brief is any good. Noam raised it as an obvious
requirement for LinkedIn. Two independent sources is enough to stop treating it as an open
question.
**Reversible:** yes

### 2026-08-13 - "Publishes itself" means no second person, not no first person
**Category:** product
**The problem:** We had been describing low-stakes content as publishing "with nobody
watching". That does not survive contact with reality. Nobody writes a button label at
random. A designer adds a screen, and then asks for copy.
**Decided:** Auto-publish means no reviewer, not no requester. A designer asks for copy, it
scores 9.4, it ships without anyone senior signing it off. There are two ways work starts: a
person asks, or an event fires (a transcript lands in a Google Drive folder, someone tags the
agent in Slack, someone hands over a transcript or a screenshot of a screen).
**Rejected:** The idea that automated content has no human trigger.
**Why:** The overhead was never someone asking for copy. It was the wait for a senior content
person to say whether it sounds like Lemonade. That wait is what we delete.
**Reversible:** no, it is a definition rather than a choice

### 2026-08-13 - For news-driven content, we approve the brief, not the output
**Category:** product
**The problem:** "Faster to approved" was a claim we had not actually earned. We still
produced a finished piece and then let a human argue with it.
**Decided:** For anything triggered by an event, the system first produces a brief: what the
story is, why now, the evidence, the angle. A person approves the brief. Only then does it
fan out into a LinkedIn post, a press release, an internal note, and so on.
**Rejected:** Generating each piece of content directly from the source material.
**Why:** Yuval's central finding after years of PR: the article is a by-product of a good
brief. Journalists do not want your story, they want something usable. The product argument
is stronger too: you approve once, upstream, instead of five times, downstream. And it is the
cheapest shape against a $50 budget, one expensive model call for the brief, several cheap
ones for the channels.
**Reversible:** yes

### 2026-08-13 - Three places to review, one review skill underneath
**Category:** product
**The problem:** Yuval's warning from experience: put a draft in Slack and it dies there,
because you cannot edit 600 words inside a Slack message. But we also refuse to build a UI.
**Decided:** Revises the 2026-08-12 "Surfaces are Slack and an MCP server" decision. One
review skill, three ways to reach it. In Claude, where a person can talk to it directly. In a
Slack thread, where the agent posts a draft and replies to comments in the thread. In a
Google Doc, where the content team leaves normal Google Docs comments and the agent answers
and resolves them. We build no interface of our own.
**Rejected:** Building the `human-review` tool into the product. It runs a small web server
on one person's laptop, which cannot be part of a hosted demo, and it means building a UI.
**Why:** Google Docs comments are already anchored to a specific line, which is far better
feedback than "make it less jokey", and the content team already lives there. We get the good
version of the review experience without building any of it.
**Consequence:** the format of a saved correction is the most important interface in the
system, because all three surfaces write it and the learning loop reads it. Get it right
before anything else is built, or we rewrite three surfaces.
**Reversible:** yes

### 2026-08-13 - The learning loop is a batch job someone runs, not a live system
**Category:** product
**The problem:** `CLAUDE.md` promises that human edits improve the profile over time. We had
no idea what that actually meant mechanically, and the ambitious version (detect patterns as
they happen, promote rules automatically) is a lot of machinery.
**Decided:** Every time a person changes something, we save it as a small file: what changed,
where, why, which content type, which criterion. Nothing clever happens at that moment. They
just pile up. Separately there is a skill someone runs, by hand or on a schedule in their own
Claude, that reads all the unresolved corrections, groups similar ones, and where four or
more say the same thing, proposes a new guideline in plain language. A person approves or
rejects it. Approved ones get written into the profile and the corrections are marked
resolved.
**Rejected:** Live pattern detection and automatic promotion of rules.
**Why:** The point of the loop is that you fix "we don't say reach out" once instead of on
every post forever. That works fine as a batch job, and the human approval step is the
feature rather than the obstacle. Simplicity is what makes it real inside 5 days instead of a
diagram on a slide.
**Reversible:** yes

### 2026-08-13 - Turning a guideline into a skill is done by hand
**Category:** build
**The problem:** `CLAUDE.md` says the whole reason the profile is a folder is that a
guideline has to be able to graduate into a skill. But building an automatic promoter for
that is real work.
**Decided:** Do it by hand, once, for the demo. Show one guideline that has proven itself
becoming part of a check that runs in code, for free, before any model is called.
**Rejected:** Automating the promotion.
**Why:** There are three levels and each costs more than the last. A correction is free to
record and harmless if it turns out to be a one-off. A guideline costs context on every
generation forever, so it should only exist if the thing keeps happening. A skill is free to
run and catches things reliably, but it is expensive to build and rigid. That last promotion
happens maybe twice a year. Automating something that rare is machinery for nothing.
**Reversible:** yes

### 2026-08-13 - We measure with one row per piece of content
**Category:** product
**The problem:** "Saves time" was a claim with no number behind it, and no way to argue with
it.
**Decided:** Every piece of content gets one row, updated as it moves: which skill ran, which
content type, who triggered it, when, whether it was auto-published or reviewed, how many
revisions it went through, its score, and what it cost in API spend. Separately, a config
file holds an assumed manual baseline per content type, so the assumptions are visible and
arguable. Say a blog post is worth 75 minutes; auto-published saves all 75; reviewed saves
half; each revision takes 10 back.
**Rejected:** A general event stream, which is more data and less answer.
**Why:** It makes the value claim something a PM can push back on rather than a slogan. Two
numbers fall out for free: cost per approved piece, which is what matters against $50, and
revisions per piece, which goes down over time if the learning loop is actually working.
**Honest limit:** in 5 days we can show the mechanism working across ten pieces, not a trend
over months. Say that in the write-up rather than implying otherwise.
**Reversible:** yes

### 2026-08-13 - Git stays the store, with one clearly marked exit
**Category:** build
**The problem:** Noam pushed back on keeping all content in a git repo: a product repo
filling up with generated drafts is pollution, and Lemonade already has content tools.
**Decided:** Refines the 2026-08-12 "Git is the only store" decision rather than reversing
it. The brand profile stays in git and that is not negotiable, because it is configuration
that has to be versioned, reviewed and able to graduate into code. Generated output also goes
to git for now, but all reading and writing of content goes through one module, so pointing
it at a real content platform later is a change in one file.
**Rejected:** Leaving "git is the only store" as a flat statement.
**Why:** The two halves have different reasons for being in git, and only one of them is
permanent. Being explicit about that is a stronger answer to a hiring team than pretending
we did not notice.
**Reversible:** yes, by design

### 2026-08-13 - The two content types are product micro-copy and external comms, scoped to blog posts
**Category:** product
**The problem:** The 2026-08-12 decision picked micro-copy plus "external comms / PR". PR then
turned out to be a much bigger job than "write a press release". A real PR agent has to work
out which publications matter for this story, which reporter at each one covers the beat, and
what angle makes it interesting to *their* readers rather than to us, because a journalist does
not want your story, they want something usable. On top of that, PR is a relationships
business: a person with contacts is not replaceable by an agent with a media list. None of that
is finishable in the days remaining.
**Decided:** Micro-copy stays as the first stream. The second stays external comms but is
scoped to blog posts and written announcements. The brief step survives, because that is the
part of the PR method that transfers. Outlet and reporter research is out.
**Rejected:** Building the full PR path. Also rejected, after briefly deciding it earlier the
same day: narrowing the second stream to LinkedIn posts. The assignment names five content
streams and LinkedIn is not cleanly one of them; the nearest match is "social captions", which
it groups with performance ads and landing-page headers, so marketing creative rather than
thought leadership. We had already rejected app store release notes on exactly that basis.
**Why:** The two streams sit at opposite ends of everything. Micro-copy is short, high volume,
started by a person, and auto-publishes. External comms is long, event-driven, and never
auto-publishes at any score. That contrast is the whole architecture visible in one demo, and
it shows both product goals at once. External comms also already has corpus evidence behind it
(8 excerpts: blog, investor notes), which LinkedIn did not.
**Reversible:** yes

### 2026-08-13 - The demo runs on real, public Lemonade material
**Category:** build
**The problem:** The event-driven path needs a real transcript to work from, and we do not
have access to Lemonade's internal meetings.
**Decided:** Use Lemonade's earnings calls and public talks. Lemonade is a public company, so
these are published and transcribed.
**Rejected:** Writing a fake internal meeting transcript.
**Why:** Real input, publicly checkable, nothing invented. A demo built on fabricated source
material proves nothing about a system whose main risk is making things up.
**Reversible:** yes

### 2026-08-13 - A thin admin dashboard, password-protected
**Category:** product
**The problem:** We decided to build no UI, but the hiring team still has to be able to see
the system working. And the 2026-08-12 decision says the hosted demo has no authentication.
**Decided:** Revises "No authentication on the hosted demo". One read-only page on Vercel
showing the ledger, the corrections pile, the profile and the score distribution. It uses
Vercel's built-in password protection, with one shared password handed to the hiring team.
**Rejected:** A fully public page, and building any login of our own.
**Why:** The original reason for no auth was that we did not want to write session handling
and a user store. We still are not writing any: this is a platform switch, not code. The page
is a window onto the system, not where work happens.
**Reversible:** yes

### 2026-08-13 - The content type caps what can auto-publish; the model can only lower it
**Category:** product
**The problem:** Auto-publishing needs to know how risky a piece is. Nothing said who decides
that. If the model judges it and gets it wrong, a sensitive piece of writing publishes with nobody
watching - the worst thing this system can do.
**Decided:** Each content type declares the highest stakes it is allowed to auto-publish, in its
own folder. Micro-copy is capped at low. External comms is capped at none, so it never
auto-publishes at any score. The model still judges each individual piece, but that judgement can
only ever move a piece *into* review, never out of it.
**Rejected:** Letting the model classify with no ceiling, which is the flexible option and the one
where a single wrong call is unrecoverable. Also rejected: making the person who asks for the copy
declare the stakes, which puts the safety judgement on whoever knows least and will always pick
whatever is fastest.
**Why:** The two failure directions are not equally bad. Judging a piece as riskier than it is
costs someone a minute of review. Judging it as safer than it is publishes something Lemonade has
to retract. The design makes only the cheap mistake possible.
**Reversible:** yes

### 2026-08-13 - TypeScript throughout
**Category:** build
**The problem:** No language or framework had been chosen. The scoring gate is a script in
*something*, and "hosted on Vercel" is not a framework.
**Decided:** TypeScript on Node, with Next.js for the dashboard, all in one repo. The existing
`eval/recheck.py` stays Python; it is an analysis script, not part of the product.
**Rejected:** Python for the engine, which would have meant a second toolchain purely for the
dashboard.
**Why:** Vercel was already the hosting decision and is TypeScript-native, so one language covers
the dashboard, the hooks, the Slack and Google adapters, and the Anthropic SDK.
**Reversible:** yes

### 2026-08-13 - A model per job, and the veto does not start cheap
**Category:** build
**The problem:** Every action in the system that needs a model was going to get whatever the
default was. With $50 total and scoring running on every single piece plus every regeneration,
that is the difference between finishing and running out.
**Decided:** Eleven distinct actions, each assigned a model by how often it runs and how bad a
wrong answer is. Full table in `PRD.md`. The shape of it: Opus 5 writes the brief (rare, and a
fabricated claim there poisons everything downstream), Sonnet 5 writes content, Haiku 4.5 handles
stakes classification and the three subjective scoring criteria, and the mechanics criterion uses
no model at all because it runs in code.
**The one that changed on review:** the compliance veto starts on Sonnet 5, not Haiku. Same
asymmetry that shapes the stakes ceiling: a veto that fires wrongly costs a minute of review, and
a veto that fails to fire publishes an unsubstantiated claim about how the company's AI judges a
customer. That is the exact failure our validation caught in Lemonade's real 2021 tweet. It gets
proven *down* to the cheap tier by matching the answer key, not assumed up.
**Rejected:** Opus 5 for everything, which is the standing default and roughly five times the
cost of Haiku on the work that runs most often. Also rejected: mixing in a second provider for
the high-volume scoring. The realistic saving is single-digit dollars, because mechanics runs
free in code first and the profile is prompt-cached, while the cost is a second API key, a second
SDK, a second set of rate limits, and a second cached copy of the profile with different cache
semantics. Bad trade inside four days.
**Why:** `CLAUDE.md` makes model choice an explicit cost decision - small models for judging,
larger for generation. Sonnet 5 is on introductory pricing through 2026-08-31, which happens to
cover the entire project.
**A hard constraint worth writing down:** anything running inside the Claude Code or Agent SDK
harness has to be Claude. The gate is a hook, hooks are a harness feature, and hooks are what make
"nothing ships unscored" structurally true rather than a hope. Only the leaf calls - scoring,
classification, generation-as-a-function - are ever swappable.
**Caveat on the comparison:** the Anthropic model IDs and prices were checked against the current
API reference. Every non-Anthropic figure came from training data with a May 2026 cutoff and was
never verified, so versions and prices will have moved. Treat them as "the right tier at that
provider", not as quotable numbers. A day 5 task re-checks all of this against real usage.
**One procurement fact, not a technical judgement:** Lemonade is a US-listed regulated insurer.
Any provider touching customer-adjacent content needs their security team's approval, and
Chinese-hosted providers are realistically a non-starter for that review regardless of how the
models perform. The open-weight ones can be self-hosted, which changes the answer, but
self-hosting is a week of infrastructure we do not have.
**Reversible:** yes, and deliberately scheduled to be revisited

### 2026-08-13 - No trend scanner
**Category:** product
**The problem:** Noam suggested an idea generator that watches X and Reddit and proposes
things to write about.
**Decided:** Not building it, anywhere.
**Rejected:** Any social listening or trend-spotting input.
**Why:** For an insurer, "the internet suggested this" is a much weaker reason to publish
than "the CEO said it on an earnings call". It would cost a day and produce the least
defensible output in the system.
**Reversible:** yes

### 2026-08-13 - Hosted artifacts use GitHub, not the Vercel filesystem
**Category:** build
**Decided:** `ContentStorage` has local and GitHub implementations. Hosted writes use expected
blob SHAs and one Git commit per logical run.
**Rejected:** Writing to a Vercel function's checked-out filesystem; adding a database for the
prototype; making each artifact update a separate Git commit.
**Why:** A Vercel function cannot provide durable local writes. Git already owns the profile and
gives the hiring team an inspectable history. One storage seam marks the later move to a content
platform without spreading persistence code through every workflow.
**Reversible:** yes

### 2026-08-13 - The hosted workflow uses deterministic application code
**Category:** build
**Decided:** Next.js routes call deterministic TypeScript workflows through the Anthropic SDK.
The repository plugin remains the Claude surface, and a local project hook blocks direct writes
to published content.
**Rejected:** Embedding the Claude Agent SDK inside an ordinary Vercel function.
**Why:** The deployed workflow is a short-lived web process, while the Agent SDK hosting model is a
separate agent process or container. The safety rules belong in the storage and publish APIs so
all surfaces share them.
**Reversible:** yes

### 2026-08-13 - The dashboard shows empty evidence honestly
**Category:** product
**Decided:** The evidence dashboard reads the real ledger, artifacts, corrections, profile and
rubric report. When the live ledger is empty it shows an empty state and keeps fixture evidence
separate.
**Rejected:** Seeding attractive demonstration trends or sample run rows into the product data.
**Why:** The dashboard is evidence for a hiring team. A polished invented trend would weaken the
argument more than an empty live ledger. The verified 47-item rubric remains visible because it is
real project evidence.
**Reversible:** no

### 2026-08-13 - New content types require real approved examples
**Category:** product
**Decided:** A new type remains draft until at least three approved examples each score 9–10 with
no veto or zero. The internal-comms fixture proves the path in a temporary store, but the live
profile waits for examples from a content owner.
**Rejected:** Inventing plausible internal messages to make the third type look complete.
**Why:** The extension gate exists to test whether genuine company copy survives its own guideline.
Invented examples would make that circular and remove the content team's ownership.
**Reversible:** no

### 2026-08-13 - Preview protection stays at the hosting layer
**Category:** build
**Decided:** Use a revocable protected Vercel preview link. Slack and cron requests use Vercel's
automation bypass mechanism in addition to their own signature or bearer-secret checks.
**Rejected:** Custom login code; the password-protection add-on; leaving the evidence dashboard
public.
**Why:** The only UI is read-only and the prototype already has platform protection available.
Custom authentication would add risk and no product evidence.
**Reversible:** yes

### 2026-08-13 - Google access uses one user's OAuth grant
**Category:** product
**Decided:** Authenticate Drive and Docs with a web OAuth client and a securely stored offline
refresh token for the Google account that owns the watched folder.
**Rejected:** A Google service account with folders and review documents shared to it.
**Why:** The project owner chose user authorization so Contentino works as the consenting person
inside Drive rather than as a separate machine identity. The runtime keeps the same adapter and
only exchanges the refresh token for short-lived access tokens.
**Reversible:** yes

### 2026-08-13 - Drive sync runs daily on the prototype host
**Category:** build
**Decided:** Run the hosted Drive transcript sync once daily at 06:00 UTC. Keep the authenticated
route available for manual runs when a transcript needs processing sooner.
**Rejected:** The original 15-minute schedule; upgrading Vercel solely for cron frequency.
**Why:** Vercel Hobby rejects cron expressions that run more than once per day. Daily automation
is enough to demonstrate the workflow without adding a hosting cost to the prototype.
**Reversible:** yes

### 2026-08-13 - Slack review stays inside one readable thread
**Category:** product
**Decided:** Show the full brief and full external draft in the original Slack thread. Approval and
feedback use ordinary replies, while repository paths remain internal evidence.
**Rejected:** Returning markdown file paths and asking a content person to open GitHub before they
can read, approve or revise the work.
**Why:** Slack is a review surface, not a notification pipe. A reviewer must be able to finish the
job where it started without understanding the storage layout.
**Reversible:** yes

---

*Everything below came out of a brainstorm on 2026-08-14, opened by Stav with a
first-principles diagram: meet people where they already work, we are not the domain
experts, skills not products, an evaluation loop on everything - and for content
specifically, nondeterministic output means trust must be built, so augmentation comes
before automation. The session was about presentation and the reviewer experience, and it
started from "I think we started developing too early".*

### 2026-08-14 - The build stands; the remaining work is the story layer
**Category:** product
**The problem:** The session opened with "we started developing too early" and a
first-principles diagram of how each content loop should work: trigger, brief, routing to
the right skills, an evaluation loop until approved, everything tracked. The question was
whether to rebuild around it.
**Decided:** No rebuild. The diagram and the built system match box for box - trigger,
brief-first, skills, layered evaluation, ledger. What the diagram has and the build lacks
is three additive things: a single entry point, trust surfaced as a number, and the
augmentation-before-automation narrative. Those get built; nothing gets torn down.
**Rejected:** Rebuilding the system to match the diagram.
**Why:** Three days to deadline, and the gap is presentation, not architecture. Tearing
down a working, deployed system to rebuild the same shape is the classic mistake.
**Reversible:** yes

### 2026-08-14 - One front door, not seven skill names
**Category:** product
**The problem:** The diagram has one entry point - you mention Contentino and it routes.
The build has seven named skills, so in Claude the routing lives in the user's head.
**Decided:** Add a single entry skill that takes a plain request, classifies it and routes
to the right content skill. This is the diagram's "assign to the relevant content agent"
box made real.
**Rejected:** Keeping skill names as the user interface.
**Why:** A content person should not need to know internal skill names. Slack and Drive
already work by just talking; Claude should too.
**Reversible:** yes

### 2026-08-14 - Trust becomes a number on the dashboard
**Category:** product
**The problem:** The whole augmentation-before-automation argument claims trust is built
over time, but nothing measured it. The ledger records every cycle; no metric read it.
**Decided:** Compute and show two numbers from the existing ledger: cycles per approval,
and the share of approvals that needed zero feedback. Time saved stays presented as an
instrument - the number next to its stated baseline assumption - never as a measured fact.
**Rejected:** Asserting "saves time" as a finding.
**Why:** The baseline minutes are a config assumption and a GenAI lead will poke that in
seconds. "Here is how we would know" is a stronger claim than "trust us". Cycles per
approval trending down is the honest, measurable version of trust.
**Reversible:** yes

### 2026-08-14 - The demo is a guided skill running the real engine
**Category:** product
**The problem:** The reviewer must be able to activate and see the system entirely alone.
Slack and Drive are bound to our accounts; the Claude plugin is the only surface that is
genuinely self-serve.
**Decided:** A `/lemonade-demo` skill in the plugin. It offers a small menu of prepared,
well-tested inputs and runs the genuine pipeline on them, against production, on our
compute and budget. The route is deterministic; the execution is real. It shows the eval
reasoning behind the score, ends with the reviewer's own run appearing in the dashboard
ledger, then lists the other skills and content types, then offers "bring your own
content" for the curious. The demo shows only success: no compliance block in the tour.
The veto is mentioned in the eval explanation and shown in a narrated recording instead.
**Rejected:** A canned replay - a GenAI hiring team would sniff it out and it would cost
more trust than a live wobble. A fully live unguided demo - at the mercy of latency and a
score landing in the wrong band with no narrator. And scripting a compliance block into
the tour - proposed and rejected, because unattended, a block reads as an error; failure
demos need someone in the room to frame them.
**Open check before it is trusted:** concurrent reviewer runs against the GitHub storage
adapter, and a loud, graceful failure message when the backend is unreachable.
**Reversible:** yes

### 2026-08-14 - One main recording, one story, real material
**Category:** product
**The problem:** The surfaces that cannot be self-served (Slack, Drive) and the flows that
need framing (the veto, the learning loop) have to be shown, not handed over.
**Decided:** One continuous recording carries the system: a real Lemonade earnings-call
transcript lands in Drive, becomes a brief in Slack, gets approved in the thread, the
draft comes back scored, one piece of feedback produces a revision, approved. No cuts.
Two short clips beside it: the learning loop from corrections to an approved guideline to
the one hand-done graduation, and the compliance veto with narration. The
new-content-type flow with a domain expert is saved for the deck, which is read alone,
not presented, and gets built later.
**Rejected:** A set of per-feature clips as the main artifact - a story is harder to
dismiss than a feature list. Forcing a regeneration into the main recording - included
only if a test run produces one naturally.
**Reversible:** yes

### 2026-08-15 - Claude drafts, production judges
**Category:** build
**Decided:** In the Claude surface the model drafts on the user's own subscription, and every draft is submitted to a production gate that scores, stores and ledgers it. The gate is reachable two ways: an MCP connector (the URL carries the secret) and an HTTP endpoint with the shared password.
**Rejected:** Running the scoring CLI on the user's machine (needs an API key nobody has); curl from claude.ai (its sandbox blocks all outbound requests); trusting the model to score itself (it awarded itself 10/10 and wrote no ledger row).
**Why:** Nothing ships unscored only holds if scoring happens where the user cannot skip it. Splitting draft from judgment also keeps API cost near zero for drafting.
**Reversible:** yes

### 2026-08-15 - Requests that ask for prohibited claims get a compliant alternative, held for review
**Category:** product
**Decided:** When the request itself demands wording compliance forbids, the system writes a compliant alternative and always holds it for human review, with a note explaining why.
**Rejected:** Refusing outright (unhelpful); auto-publishing the sanitized version (it scored 10 and shipped itself, which hides a policy conflict from the people who own the policy).
**Why:** Stav's call. The conflict is the signal; a person should see it.
**Reversible:** yes

### 2026-08-15 - Feedback is applied, not interrogated
**Category:** product
**Decided:** Reviewer feedback like "make it shorter" is interpreted and applied directly - exact replacement when the target is unambiguous, full rewrite otherwise - then rescored.
**Rejected:** Asking clarifying questions before touching the draft.
**Why:** The reviewer already said what they want. Extra questions cost the exact review time the system exists to save.
**Reversible:** yes

### 2026-08-15 - The dashboard hides behind ten lines of password middleware
**Category:** build
**Decided:** A shared password checked in Next.js middleware protects all pages; API routes keep their own signatures and secrets. One password also serves as the gate bearer token and the connector URL secret, all rotatable from one Vercel setting.
**Rejected:** Vercel's paid protection options; building real auth with users and sessions.
**Why:** The $50/5-day constraints. Auth code demonstrates nothing about content systems.
**Reversible:** yes

### 2026-08-15 - The demo is a fixed script, not an improvisation
**Category:** product
**Decided:** `/lemonade-demo` is a numbered script with pre-verified inputs: a button label tested to 10/auto-published three times, and an announcement tested to 9.29/held-for-review twice, both against production. Checkpoints use structured questions, and no approval is recorded without a real name.
**Rejected:** Letting the model draft freely inside the tour. Live runs produced different candidates every time; one tripped the zero-criterion block mid-demo with nobody there to explain it.
**Why:** A reviewer sees the tour once, alone. The execution stays real - real gate, real scores, real ledger - but the inputs stop being dice rolls.
**Reversible:** yes

### 2026-08-15 - The repo goes public at submission
**Category:** product
**Decided:** Make the GitHub repo public on submission day so any reviewer can install the plugin without an invite. First cleanup pass done: full-history secret scan (clean, assignment folder never committed), test artifacts and debugging records removed.
**Rejected:** A second public plugin-only repo (two copies drifting apart, and reviewers lose the commit history, which is a deliverable); inviting reviewers by GitHub username (identities unknown at submission time).
**Why:** The submission must work for strangers. The repo is itself a deliverable.
**Reversible:** yes

### 2026-08-15 - Reads that follow writes are served from memory
**Category:** build
**Decided:** GitHub storage keeps an in-instance overlay of everything it just wrote, so a read straight after a write returns the new content even while GitHub's read API lags.
**Rejected:** Retry loops around every read (treats the symptom, keeps the race).
**Why:** GitHub's read-after-write lag was the root cause of the intermittent "couldn't finish the run" failures across every surface.
**Reversible:** yes
