# Open questions

> Things needing Stav's answer before work can continue. Product decisions, anything that
> costs money, sends data outside, or is hard to reverse.
> Answered items move to `DECISIONS.md` and get deleted from here.

## Waiting on an answer

- **Add an interviews content type?** Four Benevolent Bots posts audited at exactly 6, the
  actuary interview at 2: a real voice lane (Q&A, guest tone, profanity allowed) the profile
  does not model. Adding it follows the founder-essays pattern and should move them into the
  review band. Yes/no is a product call.

- **The plugin update bug in Claude Code.** Your installed contentino-engine is stuck at
  0.8.x and cannot be removed or updated, so /audit is invisible to you. The plugin is at
  0.10.0 on GitHub. Retry the update when Claude Code lets you; then run /audit live with a
  real post, a product screenshot and competitor copy - that is the remaining live proof.

- **API budget state.** The key ran dry mid-run on 2026-08-22 and you added funds; today's
  19-post audit spend was roughly $0.60. Worth checking the console balance and deciding how
  much of the original $50 framing still applies post-submission.

- **Three real, approved internal-comms examples for the live extension demo.** The extension
  workflow is built to reject invented or unapproved examples, so internal comms cannot become an
  active third type until a content owner supplies at least three examples, their sources and the
  stakes ceiling. This does not block the engine or the two initial streams.

- **Blind-score the 20-item worksheet.** `eval/scoring-set.md` Part 3. Score each item against
  `RUBRIC.md` without reading `eval/scores.md` first, which is the hidden answer key. Every
  number in both eval documents came from one scorer, so "two people would agree on this" is
  still an assumption rather than a finding. This is step 2 of the calibration `RUBRIC.md`
  prescribes and the only part one person cannot do alone. Not blocking the build, but it is
  the weakest claim in the deliverable until it is done.

## Answered

- Live integration credentials - configured locally and in Vercel. GitHub-backed production,
  protected dashboard access, a signed Slack challenge and cron authorization were smoke-tested.

- Full $50 Anthropic budget remains available - confirmed in the implementation plan.
- Build both Google Docs and the live extension path - confirmed in the implementation plan.

- Mobbin access - yes, via MCP. In `DECISIONS.md`.
- Raw corpus in the public repo - no, gitignored. In `DECISIONS.md`.
- More research, or start building - stop researching, build with what we have. In
  `DECISIONS.md`.
- Who authors the guidelines - the content team, not us. We build the path that makes it
  safe and easy. In `DECISIONS.md`.
- Profile organised by stakes or content type - content type, with stakes as a layer inside
  each. In `DECISIONS.md`.
- Brief 02 thinner than asked, proceed or redo - proceed. The gap called load-bearing was
  denial and price-increase copy, and neither chosen stream generates it.
- Which content type sits opposite micro-copy - external comms, scoped to blog posts. The
  journalist and outlet research is cut. In `DECISIONS.md`.
- Who assigns a piece's stakes level - the content type sets a ceiling and the model can only
  lower it. In `DECISIONS.md`.
- Which model does what - settled per job, recorded with an explicit caveat that the
  non-Anthropic comparison is unverified. A day 5 task re-opens it against real usage.
  In `DECISIONS.md`.

Open as of 2026-08-15:

- Rename the claude.ai connector from "Contentino Password" to "Contentino gate" - the
  name shows in every demo transcript. (Settings -> Connectors, two minutes.)
- Update the plugin to 0.8.0 and run /lemonade-demo once end to end; expected: a four-line
  spec, then the button label 10/auto-published, then the announcement 9.29/held for review
  on the first try with its full text shown. The prompt-driven script has never been run
  live, so this run is the proof before it goes to a friend.
- Pick the submission-day moment to make the repo public (decision recorded; timing is
  yours). The README is written, so this is now only a timing call.
