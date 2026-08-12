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
