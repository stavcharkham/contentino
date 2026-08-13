---
name: add-content-type
description: Add and validate a new Contentino content type through conversation with its content owner. Use when extending the brand profile with a new stream, approved examples, scoring criteria and an auto-publish ceiling.
---

# Add Content Type

1. Collect the type name, owner, real approved examples, stakes ceiling, mechanics limits and
   observable scoring questions.
2. Run `npm run contentino -- add-content-type --spec <json-path>`.
3. Run `npm run contentino -- validate-type --type <slug>`.
4. Activate the type only when every approved example scores 9–10 with no veto or zero.

Do not invent examples or let the model raise the human-owned auto-publish ceiling.
