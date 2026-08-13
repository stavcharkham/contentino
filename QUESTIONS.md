# Open questions

> Things needing Stav's answer before work can continue. Product decisions, anything that
> costs money, sends data outside, or is hard to reverse.
> Answered items move to `DECISIONS.md` and get deleted from here.

## Waiting on an answer

- **Which content type sits opposite micro-copy?** On 2026-08-13 we narrowed the second
  stream from "external comms / PR" to LinkedIn posts, on the reasoning that the full PR path
  (mapping publications, finding the right journalist, working out their angle) is not
  finishable in the time left. Reading the assignment afterwards showed the problem: it names
  five content streams and LinkedIn is not cleanly one of them. The closest match is "social
  captions", which it groups with performance ads and landing-page headers, so marketing
  creative rather than thought leadership. We already rejected app store release notes on
  exactly this basis, that they are not one of the five named.
  Options: (a) **external comms** - keep the brief step, produce a press release or blog post,
  cut only the journalist research; (b) **internal comms** - a Slack announcement built from a
  transcript, which is named use case 1 and lands in a surface we are building anyway;
  (c) keep LinkedIn and argue it as external comms.
  **Recommendation: (a).** It is a named use case, it already has corpus evidence (8 excerpts:
  blog, investor notes), and it keeps the brief-then-fan-out step, which is the interesting
  part. The only thing we lose is the outlet research, which was never finishable. Nothing
  else in the plan changes: same pipeline, different content-type folder.

- **Do we build the "add a content type" path and demo it live?** The platform claim is that
  the content team extends this themselves. The way to prove it is to add a third type on
  camera in a few minutes. The way to fail is to claim it on a slide. It costs roughly half a
  day and competes with the third review surface (Google Docs).
  Options: (a) build it and demo adding a third type, (b) claim it structurally and spend the
  time on the third surface instead.
  **Recommendation: (a).** It is the differentiator and a hiring team can verify it in the
  demo. Google Docs is the better thing to cut, because Claude and Slack already cover review.

- **How much of the $50 API budget is spent so far?** Needed before day 3, when model-graded
  scoring starts running on every generation. There is no spend log yet and the account is
  yours, so I cannot see it.

## Answered

- Mobbin access - yes, via MCP. In `DECISIONS.md`.
- Raw corpus in the public repo - no, gitignored. In `DECISIONS.md`.
- More research, or start building - stop researching, build with what we have. In
  `DECISIONS.md`.
- Who authors the guidelines - the content team, not us. We build the path that makes it
  safe and easy. In `DECISIONS.md`.
- Profile organised by stakes or content type - content type, with stakes as a layer inside
  each. In `DECISIONS.md`.
- Brief 02 thinner than asked, proceed or redo - proceed. Covered by "more research, or start
  building". The gap called load-bearing was denial and price-increase copy, and neither
  chosen stream generates it. Revisit only if a chosen stream turns out to need it.
