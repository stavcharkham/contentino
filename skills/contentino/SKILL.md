---
name: contentino
description: The front door to Contentino. Use when someone asks for any Lemonade content - a button label, an error message, an announcement, a blog post - or pastes a transcript or meeting notes to write up. Routes to the right content type, runs the brief and approval steps when the type needs them, and gates every draft through production scoring.
---

# Contentino

You draft the content; the production engine scores it, stores it, and writes the ledger.
The two halves are non-negotiable: drafting is yours, judging is the gate's.

## The gate

Every draft is submitted to the production gate. Reach it one of two ways:

1. **The Contentino gate MCP tools** (`submit_draft`, `submit_brief`, `approve_brief`) -
   use these when the connector is available. No password needed; it lives in the
   connector.
2. **The HTTP endpoint**, when the MCP tools are not available and the environment can run
   curl (for example Claude Code). Ask the user once, up front, for the shared Contentino
   password before drafting anything, then:

```bash
curl -sf -X POST https://contentino-seven.vercel.app/api/contentino \
  -H "Authorization: Bearer <password>" -H "Content-Type: application/json" \
  -d '{"action":"submit-draft","content_type":"<type>","body":"<full markdown draft>","triggered_by":"<user name>","request":"<their original request>"}'
```

If neither way works, tell the user to add the Contentino gate connector
(Settings → Connectors → Add custom connector, URL supplied by Stav) and stop.

The response carries the real score, outcome, per-criterion reasons, and sometimes a note.
Report those numbers and reasons exactly. Hard rules:

- **Never score by hand.** If the gate is unreachable or rejects the password, say so and
  stop. A draft without a gate verdict is an unfinished draft, not a deliverable.
- Never bypass a veto, a zero criterion, or a stakes ceiling. Never present "auto-published"
  unless the gate said it.
- Do not show internal storage paths to the user; use the piece id.

## Routing

Classify the request and follow the matching flow:

- **Product micro-copy** (button, label, error, tooltip, CTA): draft one candidate string
  following `${CLAUDE_PLUGIN_ROOT}/profile/base` and
  `${CLAUDE_PLUGIN_ROOT}/profile/types/product-microcopy`, then submit with
  `content_type: "product-microcopy"`. Body format: `# Product micro-copy` heading, then the
  string.
- **External comms** (announcement, blog post, news, or a pasted transcript): brief first,
  never straight to a draft.
  1. Write the brief from the source material only - headline, the story, why now, what
     changed, a quote with attribution if the source has one, a `Not saying` list, sources.
     No claim the source does not support.
  2. Submit it: `{"action":"submit-brief","headline":"...","body":"<brief markdown>","source":"<url or description>","source_id":"<stable id>"}`.
  3. Show the user the brief and ask for approval - use the ask-user-question tool with
     options like "Approve" / "I want changes". An approval needs the person's actual
     name on record; do not record it without one. On approval:
     `{"action":"approve-brief","brief_path":"<from the submit response>","approved_by":"<their name>"}`.
  4. Draft the post from the approved brief, respecting its `Not saying` boundaries, and
     submit with `content_type: "external-comms"` and the `brief_id`. External comms never
     auto-publishes; tell the user it is held for review at any score.
- **Anything else** (questions about the system, a content type we don't have): answer
  plainly, and say which content types exist today.

## Feedback

When the user asks for changes, revise the draft yourself and submit the revision through
the gate again, referencing the same `brief_id` when there is one. Report the new score next
to the old one.
