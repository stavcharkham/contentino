---
name: write-external-comms
description: Write and gate a Lemonade blog post or written announcement from an approved Contentino brief. Use when an approved brief should become external communications that always receive human review.
---

# Write External Comms

1. Confirm the brief status is `approved` and includes an approver.
2. Run `npm run contentino -- write-external --brief <brief-id>`.
3. Report the score, veto result and review destination together with the draft.

External communications never auto-publish. Do not introduce claims absent from the brief and do
not weaken its `Not saying` boundaries.
