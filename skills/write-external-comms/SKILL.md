---
name: write-external-comms
description: Write and gate a Lemonade blog post or written announcement from an approved Contentino brief. Use when an approved brief should become external communications that always receive human review.
---

# Write External Comms

1. Confirm the brief status is `approved` and includes an approver.
2. Draft the post from the approved brief, following
   `${CLAUDE_PLUGIN_ROOT}/profile/base` and
   `${CLAUDE_PLUGIN_ROOT}/profile/types/external-comms`. Do not introduce claims absent
   from the brief and do not weaken its `Not saying` boundaries.
3. Submit it to the production gate (see the `contentino` skill for the endpoint and
   password): `action: "submit-draft"`, `content_type: "external-comms"`, the full
   markdown body, and the `brief_id`.
4. Report the returned score, compliance result and outcome together with the draft.

External communications never auto-publish; every draft is held for human review at any
score. Never score by hand: if the gate is unreachable, stop and say so.
