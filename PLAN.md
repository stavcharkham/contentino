# Plan

> Deliver. Five days, 2026-08-12 to 2026-08-17.
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
- [ ] Apply the two fixes to `RUBRIC.md`, then re-check against `eval/scores.md`'s affected
      items (should not require a full re-run)
- [ ] Get Stav's blind scores on the `eval/scoring-set.md` Part 3 worksheet (20 items) and
      compare to `eval/scores.md`'s hidden answer key
- [x] Decided: no second research pass. Build with what we have.
- [x] Decided: profile organised by content type, stakes as a layer inside each.
- [x] Decided: two streams shipped deeply (product micro-copy, external comms / PR), a third
      seeded if time allows (internal comms). Not shipping customer email or creative
      marketing. Reasoning in `DECISIONS.md`.

## Day 2 - Core engine

- [ ] Build the profile structure: shared base, one folder per content type, stakes layered
      inside each
- [ ] Write the base voice file from the research: registers, mechanics, vocabulary
- [ ] Seed **product micro-copy** as the first content type, with its examples
- [ ] Seed **external comms / PR** as the second
- [ ] Generation reads the base plus the type, and resolves the stakes layer from the request
- [ ] The path a content person takes to add a new type, end to end. This is the product, not
      a nice-to-have. It has to be usable by someone who does not write code

> Note on ordering: the guidelines get written before the profile format is fixed, not
> after. Designing the file structure first and then filling it means inventing a shape and
> forcing real content into it. Writing the guidelines first tells us what a profile has to
> hold.

## Day 3 - Evaluation

- [ ] Implement criterion 5 (mechanics) as code. Free, no model, runs first
- [ ] Implement criteria 1-3 as model-graded checks, pairwise against corpus examples of the
      same stakes level rather than absolute 0-100 scoring
- [ ] Model reproduces the human scores from the calibration set, or the rubric gets fixed
- [ ] **The second gate: is a guideline fit to graduate?** A new content type ships with real
      examples. Score those examples against the rubric using their own guideline. If real
      approved copy does not reach 9-10, the guideline is wrong and the type is not ready.
      This is what makes the content team owning authoring safe.

## Day 4 - Surfaces and the learning loop

- [ ] <!-- Slack, MCP, capture edits back into the profile -->

## Day 5 - Deliver

- [ ] <!-- README, write-up, one-pager, deploy, demo -->

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
