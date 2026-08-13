# Open questions

> Things needing Stav's answer before work can continue. Product decisions, anything that
> costs money, sends data outside, or is hard to reverse.
> Answered items move to `DECISIONS.md` and get deleted from here.

## Waiting on an answer

- **Blind-score the 20-item worksheet.** `eval/scoring-set.md` Part 3. Score each item against
  `RUBRIC.md` without reading `eval/scores.md` first, which is the hidden answer key. Every
  number in both eval documents came from one scorer, so "two people would agree on this" is
  still an assumption rather than a finding. This is step 2 of the calibration `RUBRIC.md`
  prescribes and the only part one person cannot do alone. Not blocking the build, but it is
  the weakest claim in the deliverable until it is done.

- **How much of the $50 API budget is spent so far?** Needed before day 3, when model-graded
  scoring starts running on every generation. There is no spend log yet and the account is
  yours, so I cannot see it. If a meaningful chunk is already gone, the model assignments in
  `PRD.md` need revisiting before we build rather than on day 5.

- **Do we build the "add a content type" path and demo it live?** The platform claim is that
  the content team extends this themselves. The way to prove it is to add a third type on
  camera in a few minutes. The way to fail is to claim it on a slide. It costs roughly half a
  day and competes with the third review surface (Google Docs) for day 4.
  Options: (a) build it and demo adding a third type, (b) claim it structurally and spend the
  time on the third surface instead.
  **Recommendation: (a).** It is the differentiator and a hiring team can verify it in the
  demo. Google Docs is the better thing to cut, because Claude and Slack already cover review.

## Needed before day 4, not blocking today

- **A Slack workspace** to install an app into, and **Google credentials** that can write
  comments on a Doc. You confirmed both exist on 2026-08-13. Flagging them again only because
  they are the kind of setup that eats half a day at the worst possible moment if it turns out
  the permissions are not right.

## Answered

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
