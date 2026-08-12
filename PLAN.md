# Plan

> Deliver. Five days, 2026-08-12 to 2026-08-17.
> Checkboxes get ticked only after the work has been run and verified, never on "should work".

## Day 1 - Discover

- [x] Write the two research briefs (`research/briefs/`)
- [x] Run brief 01, prior art - done and reviewed with Stav. `research/prior-art.md` +
      `research/feature-matrix.md`. One gap admitted in the file itself: public human style
      guides (Mailchimp, GOV.UK, Microsoft, Google) were not run down with real rigor.
- [x] Run brief 02, Lemonade voice - done, **not yet reviewed with Stav**. Files exist:
      `research/lemonade-voice.md`, `research/lemonade-guidelines.md`,
      `research/lemonade-corpus.md` (gitignored, 61 excerpts). The brief targeted 150-200
      excerpts; this pass reached 61 and says so on its own front page. `lemonade.com`
      blocked direct fetches (HTTP 403) so landing/blog/help-centre content is reconstructed
      from search-index snippets, not full reads. Three content types are thin-to-empty:
      email/notifications, ads/video, and first-party failure copy. Treat as a strong first
      pass, not final.
- [x] Review brief 02's output with Stav. Citations checked: every LEM id cited in the
      analysis and the guidelines exists in the corpus, none invented. Corpus header says 61
      excerpts, actual count is 54.
- [x] Write `RUBRIC.md` - six criteria, thresholds, calibration steps
- [x] Fold both research briefs into `RESEARCH.md`. Approved by Stav before writing.
- [ ] **Score the Lemonade corpus against `RUBRIC.md`.** Not started. Real Lemonade copy
      should come out at 9-10. If it does not, the rubric is wrong, not the copy. Do this
      before the rubric gates anything. Two people score 20 pieces independently first, then
      fix the wording of any criterion where they disagree often.
- [ ] Decide whether to run a second pass on brief 02 to close the three gaps
      (denial/rejection/price-increase copy, email, ads) or proceed with what exists.
      Waiting on Stav - see `QUESTIONS.md`.
- [ ] Decide the brand profile format. The open question is **stakes vs content type** as the
      organising axis. The research found the voice switches by stakes, sometimes between
      adjacent sentences on one screen, which argues against content-type folders.

## Day 2 - Core engine

- [ ] <!-- generation + brand profile format -->

> Note on ordering: the guidelines get written before the profile format is fixed, not
> after. Designing the file structure first and then filling it means inventing a shape and
> forcing real content into it. Writing the guidelines first tells us what a profile has to
> hold - and if Lemonade turns out to have several distinct voices, that changes the
> structure rather than just the contents.

## Day 3 - Evaluation

- [ ] Implement criterion 5 (mechanics) as code. Free, no model, runs first
- [ ] Implement criteria 1-3 as model-graded checks, pairwise against corpus examples of the
      same stakes level rather than absolute 0-100 scoring
- [ ] Model reproduces the human scores from the calibration set, or the rubric gets fixed

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
