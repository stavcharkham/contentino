# Decisions

Every product and build decision, with what was rejected and why. Written during `/handoff`
at the end of each session, after the work has been tested. Newest at the bottom.

Format:

```markdown
### YYYY-MM-DD - Short title
**Category:** product | build | research
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
