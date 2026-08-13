---
name: review
description: Review a Contentino draft and preserve feedback as corrections. Use when reviewing in Codex, Slack or Google Docs, applying a revision, or explaining how feedback enters the learning loop.
---

# Review Content

Capture each concrete edit with `npm run contentino -- review --draft <path> --surface claude
--who <name> --was '<old>' --now '<new>' --said '<verbatim feedback>'`. Apply the revision only
after the exact old text is found. Never paraphrase `said`; it is the evidence used for clustering.
