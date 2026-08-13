# Plan

> Deliver. Five days, 2026-08-12 to 2026-08-17. Day 1 was the 12th, so day 5 is the 16th and
> the 17th is submission day.
> Checkboxes get ticked only after the work has been run and verified, never on "should work".

## Build checkpoints

> Approved 2026-08-13. These are the implementation checkpoints. Each one is tested and
> committed before the next begins.

- [x] Scaffold the TypeScript/Next.js project, validation command, environment contract and
      valid Contentino plugin manifest
- [ ] Build the shared Lemonade profile, both initial content types and the validation contract
- [ ] Implement the typed artifact schemas and local/GitHub storage seam
- [ ] Implement model calls, mechanics, scoring, budget guard, ledger and publish gate
- [ ] Implement all seven skills and the correction-to-guideline learning loop
- [ ] Implement Claude, Slack and Google Drive/Docs review surfaces and triggers
- [ ] Build the read-only evidence dashboard and verify it at desktop and mobile sizes
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
- [ ] Build the profile structure: shared base, one folder per content type, stakes layered
      inside each, plus a place for individual voices
- [ ] Write the base voice file from the research: registers, mechanics, vocabulary
- [ ] Seed **product micro-copy** as the first content type, with its examples and its own
      criteria
- [x] **Define the correction file format.** In `PRD.md`. The contract between all three review
      surfaces and the learning loop. Defined, not yet built.
- [x] Define the ledger row and the baseline-minutes config. In `PRD.md`. Defined, not built.
- [ ] Storage seam: one module owns reading and writing content, so pointing at a CMS later is
      a change in one file. Specced in `PRD.md` as `lib/storage.ts`, not written.
- [x] Second stream settled: external comms, scoped to blog posts. `PRD.md` written.
- [x] **Close the six build gaps.** `PRD.md` was strong on product and thin on build. Now
      settled: who assigns stakes (the content type caps it, the model can only lower it), the
      stack (TypeScript on Node, Next.js on Vercel), the model per job, the brief's structure,
      each skill's inputs and outputs, the repo layout, piece ids, and how a run actually starts.

## Day 3 - Engine and evaluation

- [ ] Seed **external comms** as the second content type: guidelines, examples, own criteria
- [ ] Building-block skills: brand voice, stakes model, mechanics, compliance, audience
- [ ] Writing skills for both content types, plus the brief-making skill
- [ ] Generation reads the base plus the type, and resolves the stakes layer from the request
- [ ] Implement criterion 5 (mechanics) as code. Free, no model, runs first
- [ ] Implement the core model-graded criteria, pairwise against corpus examples of the same
      stakes level rather than absolute 0-100 scoring
- [ ] **Wire the gate as a hook** so scoring cannot be skipped and a compliance fail blocks
- [ ] Evidence: generate micro-copy and watch it get scored without being asked; then watch a
      deliberate compliance failure get blocked
- [ ] Model reproduces the human scores from the calibration set, or the rubric gets fixed
- [ ] **The second gate: is a guideline fit to graduate?** A new content type ships with real
      examples. Score those examples against the rubric using their own guideline. If real
      approved copy does not reach 9-10, the guideline is wrong and the type is not ready.
      This is what makes the content team owning authoring safe.
- [ ] The path a content person takes to add a new type, end to end. This is the product, not
      a nice-to-have. It has to be usable by someone who does not write code

## Day 4 - Surfaces and the learning loop

- [ ] The review skill, with adapters rather than three separate builds
- [ ] Claude adapter (nearly free, it is the plugin)
- [ ] Slack adapter: the agent posts a draft in a thread, reads the replies, posts a revision
- [ ] Autonomous trigger: a transcript landing in a Google Drive folder starts a run
- [ ] Every surface writes corrections in the day 2 format
- [ ] The clustering skill: read the unresolved corrections, group them, and where four or
      more agree, propose a guideline for a human to approve or reject
- [ ] Ledger written on every run
- [ ] Google Docs adapter (comments read, answered, resolved) - **first thing to cut if the
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
- [ ] Graduate one guideline into a code-level check, by hand, as the demonstration of the
      chain from correction to guideline to skill
- [ ] Thin admin page on Vercel behind platform password protection: the ledger, the
      corrections pile, the profile, the score distribution
- [ ] Full end-to-end run recorded: transcript in, brief approved, content out, scored,
      reviewed, correction captured, guideline proposed
- [ ] `README.md`
- [ ] Write-up of the thinking, assembled from `DECISIONS.md` and `PROCESS.md`
- [ ] One-pager (`interview/`, gitignored)
- [ ] Deploy and smoke test the live URL

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
