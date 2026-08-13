---
name: write-microcopy
description: Generate and automatically gate Lemonade product microcopy. Use when a designer, PM or engineer supplies a screen state, screenshot or product situation and needs candidate UI strings.
---

# Write Microcopy

1. Describe the screen, the user action, the outcome and any hard character limit.
2. Run `npm run contentino -- write-microcopy --request '<description>'`.
3. Return the candidate, score and routing outcome. A publish result means it was saved to
   `content/published`, not sent to a live product.

Never bypass a veto, a zero criterion or the content type's low-stakes ceiling.
