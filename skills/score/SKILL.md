---
name: score
description: Score a Contentino draft against the shared Lemonade rubric and its content-type criteria. Use for ad-hoc scoring or to explain why a draft published, entered review, regenerated or was blocked.
---

# Score Content

Run `npm run contentino -- score --draft <path>`. Report every applicable criterion, the
normalised score, stakes, veto, source hash, cost and outcome. Do not average away a zero and do
not treat an existing score as current when its source hash differs from the draft.
