---
name: score
description: Score a Contentino draft against the shared Lemonade rubric and its content-type criteria. Use for ad-hoc scoring or to explain why a draft published, entered review, regenerated or was blocked.
---

# Score Content

Scoring is the production gate's job, never yours. Submit the text through the gate (see the
`contentino` skill for the endpoint and password) with `action: "submit-draft"` and the right
`content_type`, then report every returned criterion, the score, stakes, compliance verdict
and outcome exactly as returned.

When explaining an existing score, read its stored scorecard rather than re-judging the text
yourself. Do not average away a zero, and do not treat an existing score as current when its
source hash differs from the draft.

If the gate is unreachable, say so and stop. Never present a score you produced by hand.
