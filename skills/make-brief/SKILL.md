---
name: make-brief
description: Turn a transcript or sourced event into a Contentino brief. Use for external communications when source material needs claim tracing, a why-now, a quote, explicit boundaries, and human approval before drafting.
---

# Make Brief

1. Identify the transcript path or Drive source id and preserve every usable source link.
2. Run `npm run contentino -- make-brief --source <path-or-id>`.
3. Present the generated brief for a named person to approve or reject. Never approve it yourself.
4. On approval, run `npm run contentino -- approve-brief --path <brief-path> --by <name>`.

Do not write external content from a draft or rejected brief. Keep unsupported claims and anything
the source explicitly rules out under `Not saying`.
