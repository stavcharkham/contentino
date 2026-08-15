---
name: write-microcopy
description: Generate and gate Lemonade product microcopy. Use when a designer, PM or engineer supplies a screen state, screenshot or product situation and needs a candidate UI string.
---

# Write Microcopy

1. Understand the screen, the user action, the outcome and any hard character limit.
2. Draft one candidate string following `${CLAUDE_PLUGIN_ROOT}/profile/base` and
   `${CLAUDE_PLUGIN_ROOT}/profile/types/product-microcopy`.
3. Submit it to the production gate (see the `contentino` skill for the endpoint and
   password): `action: "submit-draft"`, `content_type: "product-microcopy"`, body
   `# Product micro-copy` plus the string, and pass the user's original request in
   `request`.
4. Report the returned candidate, score, outcome and any note. "Published" means saved to
   the content store, not sent to a live product.

Never score by hand: if the gate is unreachable, stop and say so. Never bypass a veto, a
zero criterion or the type's low-stakes ceiling.
