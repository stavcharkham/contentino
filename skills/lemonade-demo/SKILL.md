---
name: lemonade-demo
description: A guided tour of Contentino for reviewers. Use when someone wants to see the system work end to end without setup - it walks them through generating real content, watching the production gate score it, and finding their own run in the live ledger.
---

# Lemonade Demo

You are giving a guided tour to someone evaluating Contentino - likely a Lemonade hiring
reviewer. The route is fixed; the execution is real. Every piece generated here goes through
the actual production gate and lands in the actual ledger. Nothing is canned.

Ground rules for the whole tour:

- Use the gate exactly as the `contentino` skill specifies (MCP tools first, endpoint
  fallback). **Never invent a score.** If the gate is unreachable, say the demo needs the
  Contentino connector and stop - a fake tour is worse than no tour.
- Keep each step short. Show, then explain in two or three sentences, then move on.
- Never show internal storage paths.

## The tour

**Open** with one paragraph: Contentino generates content from Lemonade's brand profile,
scores every piece against a rubric before any human sees it, and learns from corrections.
They are about to make real content in a real system. Then offer the first step.

**Beat 1 - micro-copy in one step.** Offer this prepared request (or let them tweak the
wording): *a button label shown when a customer finishes entering their quote details, under
24 characters.* Draft one candidate following
`${CLAUDE_PLUGIN_ROOT}/profile/base` and
`${CLAUDE_PLUGIN_ROOT}/profile/types/product-microcopy`, submit it through the gate, and
show the verdict. Then explain what just happened: the score came from the production
engine comparing the draft with real approved Lemonade copy at the same stakes level -
register, humour boundary, plain language, mechanics checked in code, plus micro-copy's own
criteria. Mention (do not demonstrate) that a compliance veto sits above all of it: a draft
promising outcomes or misusing data claims gets blocked outright, and only the content type
can raise what is allowed to auto-publish.

**Beat 2 - the full loop on real material.** Use this real excerpt from Lemonade's Q2 2026
earnings call (The Motley Fool transcript, 7 August 2026): in-force premium reached $1.43
billion, up 32.5% year over year, the eleventh straight quarter of accelerating growth;
revenue grew 79% to $294 million; the gross loss ratio improved to 60% from 67%; adjusted
EBITDA loss narrowed 54% to $19 million; management reiterated full-year guidance and
projected positive adjusted EBITDA in Q4 2026. Walk the external-comms flow exactly as the
`contentino` skill defines it: write the brief with its `Not saying` boundaries, store it,
ask the reviewer to approve it (their name goes on the approval - point that out), then
draft the announcement and submit it. Show that external comms is held for human review at
any score, because that ceiling belongs to the content type, not the model.

**Beat 3 - their fingerprint in the ledger.** Tell them to open the evidence dashboard
(Stav provides the URL and password with this demo) and find the pieces they just made in
Recent pieces - score, outcome, cost in cents, and time saved against a stated baseline
assumption. The point to land: every run is measured, and the trust argument is a number
(revisions per approval trending down), not a promise.

**Close - the rest of the system.** List what they did not tour, one line each: Slack and
Google Drive run this same loop (a transcript dropped in a folder becomes a brief in Slack
with an approve button); corrections cluster into proposed guidelines a human approves; a
proven guideline can graduate into a code-level check; new content types are added by
content owners, and a type only activates when its real examples score 9 or higher against
its own guideline.

Then the last line of the tour: *"Want to try a request of your own? Anything goes - and
somewhere in Tel Aviv, Stav is hoping this isn't his blue screen of death moment."* If they
take it, run their request through the normal `contentino` routing, gate included.
