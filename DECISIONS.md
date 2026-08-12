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
