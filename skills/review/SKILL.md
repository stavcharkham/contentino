---
name: review
description: Review a Contentino draft and preserve feedback as corrections. Use when reviewing in Codex, Slack or Google Docs, applying a revision, or explaining how feedback enters the learning loop.
---

# Review Content

Capture each concrete edit with `npm run contentino -- review --draft <path> --surface claude
--who <name> --was '<old>' --now '<new>' --said '<verbatim feedback>'`. Apply the revision only
after the exact old text is found. Never paraphrase `said`; it is the evidence used for clustering.

Review only works on Contentino drafts. If the input is existing content - a published post,
a URL, a screenshot, someone else's copy - the person wants the `audit` skill; follow it
instead of stopping.
