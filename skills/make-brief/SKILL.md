---
name: make-brief
description: Turn a transcript or sourced event into a Contentino brief. Use for external communications when source material needs claim tracing, a why-now, a quote, explicit boundaries, and human approval before drafting.
---

# Make Brief

1. Read the source material and preserve every usable source link.
2. Write the brief from the source only: headline, the story, why now, what changed, a
   quote with attribution when the source has one, a `Purpose` section (Serves: which
   team, Job: what the piece is for, Metric: what says it worked, Shelf life: when it
   goes stale), a `Not saying` list, and sources. No claim the source does not support.
3. Store it through the production gate (see the `contentino` skill for the endpoint and
   password): `action: "submit-brief"` with the headline, the brief markdown, the source
   and a stable `source_id`.
4. Present the brief for a named person to approve or reject. Never approve it yourself.
   On approval: `action: "approve-brief"` with the `brief_path` from step 3 and
   `approved_by`.

Do not write external content from a draft or rejected brief. Keep unsupported claims and
anything the source explicitly rules out under `Not saying`.
