# Plan

> Deliver. Five days, 2026-08-12 to 2026-08-17. Day 1 was the 12th, so day 5 is the 16th and
> the 17th is submission day.
> Checkboxes get ticked only after the work has been run and verified, never on "should work".

## Build checkpoints

> Approved 2026-08-13. These are the implementation checkpoints. Each one is tested and
> committed before the next begins.

- [x] Scaffold the TypeScript/Next.js project, validation command, environment contract and
      valid Contentino plugin manifest
- [x] Build the shared Lemonade profile, both initial content types and the validation contract
- [x] Implement the typed artifact schemas and local/GitHub storage seam
- [x] Implement model calls, mechanics, scoring, budget guard, ledger and publish gate
- [x] Implement all seven skills and the correction-to-guideline learning loop
- [x] Implement Claude, Slack and Google Drive/Docs review surfaces and triggers
- [x] Build the read-only evidence dashboard and verify it at desktop and mobile sizes
- [ ] Run code and security reviews, demonstrate every acceptance criterion, deploy and close

Two build decisions supersede details written earlier in this plan and are recorded formally at
handoff after verification. Hosted writes go through the same storage interface to a private
GitHub repository because a Vercel function cannot persist its checked-out filesystem. Deployed
workflows use deterministic application code and the Anthropic TypeScript SDK; the local Claude
surface also has a hook, but the Claude Agent SDK is not embedded in an ordinary Vercel function.

## Day 1 - Discover

- [x] Write the two research briefs (`research/briefs/`)
- [x] Run brief 01, prior art - done and reviewed with Stav. `research/prior-art.md` +
      `research/feature-matrix.md`. One gap admitted in the file itself: public human style
      guides (Mailchimp, GOV.UK, Microsoft, Google) were not run down with real rigor.
- [x] Run brief 02, Lemonade voice. `research/lemonade-voice.md`,
      `research/lemonade-guidelines.md`, `research/lemonade-corpus.md` (gitignored, 54
      excerpts against a target of 150 - the files' own headers say 61, which is wrong).
      `lemonade.com` blocked direct fetches (HTTP 403) so landing, blog and help-centre
      content is reconstructed from search snippets, not full reads. Three content types are
      thin to empty: email/notifications, ads/video, and first-party failure copy. A strong
      first pass, not final.
- [x] Review brief 02's output with Stav. Citations checked: every LEM id cited in the
      analysis and the guidelines exists in the corpus, none invented. Corpus header says 61
      excerpts, actual count is 54.
- [x] Write `RUBRIC.md` - six criteria, thresholds, calibration steps
- [x] Fold both research briefs into `RESEARCH.md`. Approved by Stav before writing.
- [x] **Validate the rubric.** Run in-session rather than forked. Scored 35 real Lemonade
      excerpts + 12 off-brand twins (47 items; one real item dropped from the table by
      mistake, one row duplicated - both disclosed in `eval/scores.md` rather than fixed
      quietly). Full results: `eval/scoring-set.md`, `eval/scores.md`,
      `eval/rubric-validation.md`.
      **Verdict: works, with two named fixes.** Real mean 8.80 (target 9+, missed by 0.20),
      off-brand mean 4.42 (target ≤5, met), gap 4.38. Only one off-brand item reached the
      review band. The compliance veto correctly fired on a re-scored version of Lemonade's
      real 2021 AI-fraud tweet - the strongest single result in the report.
      Two fixes needed before this gates anything: criterion 4 (direct address) should score
      N/A rather than 0 for content with no addressee by design (release notes, headlines,
      field labels) - this is what's suppressing the real-item average; and criterion 1
      needs wording for legal-adjacent meta-commentary versus operative legal text. Neither
      touches thresholds or criteria 2/3/5.
- [x] Decided: no second research pass. Build with what we have.
- [x] Decided: profile organised by content type, stakes as a layer inside each.
- [x] Decided: two streams shipped deeply (product micro-copy, external comms), a third
      seeded if time allows (internal comms). Not shipping customer email or creative
      marketing. Reasoning in `DECISIONS.md`.
      **Second stream reopened and closed on 2026-08-13** - narrowed to LinkedIn, then found
      LinkedIn is not one of the five named use cases. Settled back to external comms, with
      the journalist and outlet research cut.

## Day 2 - Foundations and core engine (2026-08-13)

> The contracts get set today. Three review surfaces and a learning loop all write into the
> same formats, and changing a format later means rewriting all of them.

- [x] Two architecture conversations reviewed (the RiseUp PR system, and Noam on how to
      structure it). 16 decisions recorded in `DECISIONS.md`, three of which reverse or revise
      what was decided on 2026-08-12.
- [x] **Apply the fixes to `RUBRIC.md`.** Rewritten as a shared core (register, humour, plain
      language, mechanics, compliance veto) plus questions belonging to each content type.
      Direct address moved out of the core, which resolves the N/A problem structurally rather
      than by special-casing. Criterion 1 now separates casual commentary *about* legal text
      from casual language *inside* it. Third fix taken as well, which the validation had
      flagged as lower priority: the veto now catches copy that contradicts known policy on
      pricing, eligibility or data use. Both chosen streams touch that language.
- [x] Re-check the fixes against `eval/scores.md`. **Real Lemonade copy now scores 9.49 (was
      8.80, target 9+), off-brand 4.50, gap 4.99 (was 4.38).** No genuine Lemonade copy lands
      in regenerate any more, and no off-brand item out-scores a real one. Direct address
      roughly doubled its discriminating power once it stopped being asked of content with no
      addressee. Report in `eval/rubric-recheck.md`, reproduce with `python3 eval/recheck.py`.
      Caveat recorded in the report: this confirms the fixes do what they were designed to do,
      it is not an independent re-validation, and the five new per-type criteria are untested.
- [ ] **Needs Stav:** blind scores on the `eval/scoring-set.md` Part 3 worksheet (20 items),
      compared against the hidden answer key in `eval/scores.md`. This is the two-people step
      from `RUBRIC.md` and it is the only part of calibration one person cannot do alone.
- [x] Build the profile structure: shared base, one folder per content type, stakes layered
      inside each, plus a place for individual voices
- [x] Write the base voice file from the research: registers, mechanics, vocabulary
- [x] Seed **product micro-copy** as the first content type, with its examples and its own
      criteria
- [x] **Define the correction file format.** In `PRD.md`. The contract between all three review
      surfaces and the learning loop. Defined, not yet built.
- [x] Define the ledger row and the baseline-minutes config. In `PRD.md`. Defined, not built.
- [x] Storage seam: one module owns reading and writing content, so pointing at a CMS later is
      a change in one file. Specced in `PRD.md` as `lib/storage.ts`, not written.
- [x] Second stream settled: external comms, scoped to blog posts. `PRD.md` written.
- [x] **Close the six build gaps.** `PRD.md` was strong on product and thin on build. Now
      settled: who assigns stakes (the content type caps it, the model can only lower it), the
      stack (TypeScript on Node, Next.js on Vercel), the model per job, the brief's structure,
      each skill's inputs and outputs, the repo layout, piece ids, and how a run actually starts.

## Day 3 - Engine and evaluation

- [x] Seed **external comms** as the second content type: guidelines, examples, own criteria
- [x] Building-block skills: brand voice, stakes model, mechanics, compliance, audience
- [x] Writing skills for both content types, plus the brief-making skill
- [x] Generation reads the base plus the type, and resolves the stakes layer from the request
- [x] Implement criterion 5 (mechanics) as code. Free, no model, runs first
- [x] Implement the core model-graded criteria, pairwise against corpus examples of the same
      stakes level rather than absolute 0-100 scoring
- [x] **Wire the gate as a hook** so scoring cannot be skipped and a compliance fail blocks
- [x] Evidence: generate micro-copy and watch it get scored without being asked; then watch a
      deliberate compliance failure get blocked
- [ ] Model reproduces the human scores from the calibration set, or the rubric gets fixed
- [x] **The second gate: is a guideline fit to graduate?** A new content type ships with real
      examples. Score those examples against the rubric using their own guideline. If real
      approved copy does not reach 9-10, the guideline is wrong and the type is not ready.
      This is what makes the content team owning authoring safe.
- [x] The path a content person takes to add a new type, end to end. This is the product, not
      a nice-to-have. It has to be usable by someone who does not write code

## Day 4 - Surfaces and the learning loop

- [x] The review skill, with adapters rather than three separate builds
- [x] Claude adapter (nearly free, it is the plugin)
- [x] Slack adapter: the agent posts a draft in a thread, reads the replies, posts a revision
- [x] Autonomous trigger: a transcript landing in a Google Drive folder starts a run
- [x] Every surface writes corrections in the day 2 format
- [x] The clustering skill: read the unresolved corrections, group them, and where four or
      more agree, propose a guideline for a human to approve or reject
- [x] Ledger written on every run
- [x] Google Docs adapter (comments read, answered, resolved) - **first thing to cut if the
      day runs out.** Claude and Slack already cover review.

## Day 5 - Deliver

- [ ] **Review the model choices against real usage.** Deliberately scheduled after the system
      works, not before, because every number that should drive this decision only exists once
      there is a ledger to read. Do all four:
      1. **Score the answer key with the model.** Does `claude-haiku-4-5` reproduce the human
         scores on the 47 items in `eval/scores.md`? If not, the rubric is suspect before the
         model is. Separately, check the four compliance-veto cases: the veto currently sits on
         `claude-sonnet-5` on purpose and only moves down to Haiku if Haiku catches all four.
      2. **Read the real cost per approved piece** from `metrics/ledger.csv` and compare it to
         what was spent. The $50 constraint makes this the number that matters, not per-token
         rates.
      3. **Re-check the non-Anthropic prices.** Every figure in the 2026-08-13 model decision
         came from training data with a May 2026 cutoff and was never verified. Versions and
         prices will have moved.
      4. **Re-test the mixing question** with the real regeneration rate. The argument against a
         second provider assumed low scoring volume. If regeneration turns out heavy, the
         high-volume rows are worth the plumbing after all.
- [x] Graduate one guideline into a code-level check, by hand, as the demonstration of the
      chain from correction to guideline to skill
- [x] Thin admin page ready for a protected Vercel preview: the ledger, the
      corrections pile, the profile, the score distribution
- [x] Deterministic end-to-end run recorded: transcript in, brief approved, content out, scored,
      reviewed, correction captured, guideline proposed
- [x] `README.md`
- [x] Write-up of the thinking, assembled from `DECISIONS.md` and `PROCESS.md`
- [x] One-pager (`interview/`, gitignored)
- [x] Deploy and smoke test the live URL. Production renders the GitHub-backed evidence report;
      a signed Slack challenge returns 200, unsigned Slack returns 401, and the Drive cron rejects
      requests without its bearer secret.

## Acceptance and close

- [x] Make Slack self-contained: show full briefs and drafts, support conversational approval and
      feedback in the same thread, and keep internal artifact paths out of user replies.
- [x] Replace the developer-oriented acceptance plan with a copy-paste operator test kit and a
      ready-to-upload example transcript.
- [ ] Wire a reachable action that creates a Google Docs review document and maps it to a draft.
      Comment ingestion, revision, reply and resolution exist, but this entry action is missing.
- [ ] Run the live acceptance tests in `TEST-PLAN.md` for Slack, Drive, Google Docs, Claude,
      GitHub persistence, scoring, blocking and the learning loop.
- [ ] Activate internal comms with three real owner-approved examples that score 9-10.
- [ ] Complete the real Anthropic calibration, usage/cost review and Stav's blind 20-item scoring.
- [ ] Run a fresh code and security review, record the complete live demo, reconcile the final docs
      and close the project.

## Close-out additions (2026-08-14)

> From the presentation brainstorm. The build stands; these are the deltas between the
> first-principles diagram and what exists, plus the presentation work. Decisions in
> `DECISIONS.md` under 2026-08-14.

- [x] **Stav runs the operator test kit** end to end and reports results. Done 2026-08-15
      via live Slack and Claude runs; every failure found was fixed and re-verified live.
- [x] Add the single entry point: `/contentino` routes any request to the right flow and
      submits every draft to the production gate (MCP connector or HTTP). Verified live.
- [ ] Surface the trust metrics on the dashboard, computed from the existing ledger:
      cycles per approval and share of zero-feedback approvals.
- [x] Build `/lemonade-demo`: now a short prompt-driven script (the reviewer sends two
      copy-paste prompts) with pre-verified inputs, ending in the reviewer's own ledger rows
      and the bring-your-own-content option. Run live by Stav three times on 0.5.0; the
      restructured 0.6.0 script and the 0.7.0 spec addition are built, not yet re-run live.
- [ ] Record the main story on real material (latest earnings call unless Stav picks
      another): transcript into Drive, brief in Slack, approval, scored draft, one feedback,
      revision, approved. Plus two short clips: the learning loop through graduation, and
      the compliance veto with narration.
- [ ] Build the self-serve deck (read alone, not presented). Later, with Stav. The
      new-content-type flow with a domain expert is its centerpiece.
- [x] Clean the repo for reviewers, first pass (2026-08-15): history secret scan clean,
      test artifacts and ledger junk removed, AGENTS.md now points at CLAUDE.md.
- [ ] Flip the repo public on submission day, after the README exists.
- [x] Write `README.md` - rewritten 2026-08-15 as the public face: five-minute tour,
      unbypassable rules, evidence, repo map. Reviewed, not yet seen by an outside reader.
- [x] Slack fixes from Stav's live runs (2026-08-16, all verified by tests, first two also
      verified live by Stav's screenshots): a blocked draft silently retries up to three
      attempts with the failure reasons fed back, and a third failure is labelled held, not
      ready for review; a bare announcement request gets asked for topic and source instead
      of becoming a brief; the brief is built from the person's full message, never the
      router model's paraphrase (this one not yet re-verified live with a transcript);
      approving a brief posts "On it - writing and scoring the draft now." which the
      finished draft replaces.
- [x] Comms briefs now carry a Purpose section (Serves, Job, Metric, Shelf life) in all
      surfaces - server workflow, skills, demo. Approval covers the why, not just the
      facts. Tests green; not yet live-tested. Shelf-life automation is a next step,
      recorded, not built. (2026-08-16)
- [x] Product micro-copy now starts with a shown four-line spec (surface, limit, moment,
      not saying) in the same reply, no approval pause; comms briefs still need named
      approval. Demo shows the contrast. Built 2026-08-16, not yet live-tested.
- [ ] Stav: rename the claude.ai connector from "Contentino Password" to "Contentino gate",
      update the plugin to 0.7.0 and run `/lemonade-demo` once end to end - the prompt-driven
      script has never been run live.

## Audit mode (2026-08-21)

> Score existing content - real Lemonade posts, product screenshots, non-Lemonade copy - on
> voice criteria only. Spec agreed with Stav 2026-08-21: Claude surface only, audits get their
> own dashboard section, provenance criteria (claim sourced, why now, quote fidelity) and the
> missing-source compliance rule do not apply to content that never had a brief. Score reasons
> written plainly: one factual sentence, no praise words.

- [x] Mark each profile criterion as audit-applicable or pipeline-only in the type's
      criteria file, so the profile owns the distinction, not the code
- [x] Add "audited" as an outcome and an audit path through scoring: voice criteria only,
      compliance reported as a flag with the missing-source rule dropped, never publishes
- [x] Audit workflow and storage: results land in content/audits/ plus a ledger row, and
      the publish/review stats exclude audited rows
- [x] Expose audit through the gate: HTTP action and MCP tool
- [x] Plugin: an audit skill (0.9.0) that takes pasted text, a URL or a screenshot, extracts
      the copy, submits it, and reports the scorecard plainly
- [x] Dashboard: an Audits section showing what was audited, its score and verdict
- [x] Evidence, real models against temp storage (2026-08-21): the Giveback text scored 7,
      audited, compliance clear (was 5, blocked) - held down by direct-address 0, a fair read
      of that report-style rewrite; the off-brand twin scored 0 with a flagged guarantee.
      Caveat: the input was the gate's stored 08-21 rewrite, not the verbatim blog post.
- [ ] Live after deploy: audit a verbatim lemonade.com post and a product screenshot
      through the plugin (Stav)

## Calibration against the real blog (2026-08-22)

> Auditing eight real lemonade.com posts scored none above 7: the profile was built when
> lemonade.com blocked fetching, so blog rules came from snippets. Announcement-style posts
> landed at 6-7; founder essays at 1 with compliance flags. Approved by Stav: deploy audit,
> then calibrate.

- [ ] Add a founder-essays content type with real-essay examples, long-form mechanics and
      essay-fit criteria
- [ ] Make the em-dash limit per content type instead of hardcoded
- [ ] Stakes and voice: company strategy and ambition commentary is medium stakes in the
      performing register; high stays reserved for a customer's money, coverage, eligibility
      or claim
- [ ] Compliance: forward-looking company statements are not customer outcome guarantees
- [ ] Rerun the eight posts; essays and givebacks should reach the review band

## Not doing

Cut on 2026-08-12 after the prior-art research. These are the features the market sells to
win deals, and we have one company and one set of guidelines.

- Templates and template libraries
- SEO scoring, keyword targeting, SERP analysis
- Image generation
- Plagiarism and AI-detection checks
- Multi-brand support and tenant models
- Seat-based collaboration, comments, roles
- Performance analytics feeding back into generation

Also cut: shipping this open source. Reversed on 2026-08-12, reasoning in `DECISIONS.md`.

Cut on 2026-08-13:

- **A trend scanner** that watches X and Reddit for things worth writing about. For an
  insurer, "the internet suggested this" is a weaker reason to publish than "the CEO said it
  on an earnings call", and it would cost a day for the least defensible output in the system.
- **Journalist and outlet research.** Mapping publications and working out a specific
  reporter's angle is a project on its own, and it cannot replace a PR person's relationships.
  The brief step survives; the outlet research does not.
- **Posting anything externally.** Nothing this system produces gets published to a live
  channel. Output lands in git, in Slack, or in a Google Doc, and a person takes it from there.
- **Automatic promotion of a guideline into a skill.** Done by hand, once, for the demo. That
  promotion happens maybe twice a year and automating it is machinery for nothing.
