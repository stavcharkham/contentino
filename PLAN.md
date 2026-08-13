# Plan

> Deliver. Five days, 2026-08-12 to 2026-08-17. Day 1 was the 12th, so day 5 is the 16th and
> the 17th is submission day.
> Checkboxes get ticked only after the work has been run and verified, never on "should work".

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
- [x] Decided: two streams shipped deeply (product micro-copy, external comms / PR), a third
      seeded if time allows (internal comms). Not shipping customer email or creative
      marketing. Reasoning in `DECISIONS.md`.
      **Second stream reopened on 2026-08-13** - narrowed to LinkedIn, then found LinkedIn is
      not one of the five named use cases. See `QUESTIONS.md`.

## Day 2 - Foundations and core engine (2026-08-13)

> The contracts get set today. Three review surfaces and a learning loop all write into the
> same formats, and changing a format later means rewriting all of them.

- [x] Two architecture conversations reviewed (the RiseUp PR system, and Noam on how to
      structure it). 16 decisions recorded in `DECISIONS.md`, three of which reverse or revise
      what was decided on 2026-08-12.
- [ ] **Apply the two fixes to `RUBRIC.md`.** The criterion 4 fix is now subsumed by a larger
      change: the rubric splits into a shared core (register, humour boundary, plain language,
      compliance veto) plus questions belonging to each content type. Direct address moves out
      of the core, which resolves the N/A problem structurally rather than by special-casing.
      Criterion 1 still needs its own rewording, separating casual commentary *about* legal
      text from casual language *inside* it.
- [ ] Re-check against the affected items in `eval/scores.md`. Real Lemonade copy has to reach
      9-10. A full re-run should not be needed.
- [ ] **Needs Stav:** blind scores on the `eval/scoring-set.md` Part 3 worksheet (20 items),
      compared against the hidden answer key in `eval/scores.md`. This is the two-people step
      from `RUBRIC.md` and it is the only part of calibration one person cannot do alone.
- [ ] Build the profile structure: shared base, one folder per content type, stakes layered
      inside each, plus a place for individual voices
- [ ] Write the base voice file from the research: registers, mechanics, vocabulary
- [ ] Seed **product micro-copy** as the first content type, with its examples and its own
      criteria
- [ ] **Define the correction file format.** The contract between all three review surfaces
      and the learning loop. The highest-cost thing on this page to get wrong.
- [ ] Define the ledger row: skill, content type, who triggered, when, auto-published or
      reviewed, revision count, score, API cost. Plus the baseline-minutes config.
- [ ] Storage seam: one module owns reading and writing content, so pointing at a CMS later is
      a change in one file
- [ ] Answer the second-stream question in `QUESTIONS.md` before day 3 starts

## Day 3 - Engine and evaluation

- [ ] Seed the second content type once the question is answered: guidelines, examples, own
      criteria
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
