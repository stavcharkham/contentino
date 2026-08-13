# Why Contentino works this way

## The problem is approval

Drafting is cheap. Review is not.

Most content tools promise faster writing, but the draft still waits for someone senior to say
whether it sounds right, whether a claim is safe, and whether the source supports it. Producing
more drafts makes that queue longer.

Contentino moves the speed claim from time-to-draft to time-to-approved. Low-stakes work can skip
the second person. Higher-stakes work reaches that person with the decisions already made visible:
the approved brief, the stakes classification, the criterion scores and the compliance result.

## The profile is a folder for a reason

The profile is configuration that needs version history, review and ownership. More importantly,
a repeated correction should be able to become a guideline, and a proven guideline should be able
to become a free check in code. A database row or settings form makes that graduation harder to
see and harder to review.

The folder has three layers:

- Shared Lemonade rules for voice, stakes, mechanics, vocabulary, compliance and audience.
- A content-type layer for the format's mechanics, approved examples, scoring questions and
  auto-publish ceiling.
- A person layer for work published in an individual's voice.

Content type is the main navigation because that is how a content team looks for its work. Stakes
still control consequences inside each type.

## One gate, several consequences

Mechanics runs first in code. It is free and catches objective failures before paid checks.
The model then classifies stakes, applies a separate compliance veto, compares shared qualities
against approved examples, and scores the content type's own questions.

The number has one meaning:

- Below 8 regenerates, up to three attempts.
- 8 to below 9 goes to review.
- 9 or above may publish only when the type's stakes ceiling permits it.
- A compliance veto or zero criterion blocks at any score.

Product micro-copy may auto-publish at low stakes. External communications set their ceiling to
`none`, so they always enter review.

The publish API repeats the checks. A scorecard must exist, match the exact source hash and remain
eligible. This makes “nothing ships unscored” an application property rather than an instruction a
model may forget.

## Approve the brief upstream

External communications do not draft directly from a transcript. The first artifact is a brief
containing the story, why it matters now, what changed, cited sources, any supported quote and a
`Not saying` section.

A named person approves that brief before generation. This prevents five outputs from arguing
with the same source in five different ways. It also makes the human decision legible: approve the
story and its boundary once, then let the system fan out.

## Three surfaces, one correction

Claude, Slack and Google Docs are transports over the same review operation.

A correction stores the exact old text, new text, verbatim feedback, criterion, reviewer, surface,
external event id and resolution status. Slack asks a question when feedback does not identify an
exact edit. Google Docs uses the quoted anchor as the target, replies to the comment and resolves it
after applying the revision. Repeated events are claimed idempotently before work starts.

This shared record is the important interface. It means the learning loop does not care where the
review happened.

## Learning needs repetition and approval

One edit may be preference. Four matching open corrections are evidence of a rule.

The clustering workflow considers corrections within the same content type and criterion. It may
propose a guideline only when at least four semantically matching records remain. A person approves
the proposal, the rule enters the versioned profile, and its source corrections resolve together in
one logical commit.

The final promotion stays manual. The demo's “do not say click here” guideline is also a mechanics
check in code. Automating this rare transition would create more machinery than value.

## Git is enough for the prototype

The profile belongs in Git permanently. Generated artifacts use it for now because the challenge
needs an inspectable history more than it needs a content platform.

All reads and writes go through `ContentStorage`. Local development writes to the repository.
Hosted execution uses GitHub's Git Data API, expected blob SHAs and one commit per logical run.
The marked exit is the interface: a later CMS adapter changes persistence without changing the
workflows.

## What the evidence says

The rubric's 47-item re-check separates real Lemonade copy at 9.49 from off-brand copy at 4.50.
No off-brand item reaches publish. The deliberate historical Lemonade AI-fraud overclaim triggers
the veto, which is stronger evidence than a synthetic safety example.

The local suite proves schema contracts, storage conflicts, concurrent idempotency, routing,
review safety, correction clustering, type activation and all three external adapters. Browser
tests prove the dashboard at desktop and mobile sizes. The deterministic demo runs the complete
product path without presenting fixture data as live evidence.

## What is not proven yet

The implementation cannot prove account-dependent behavior without the accounts. Real Anthropic
calibration, a Slack thread, a Drive/Docs round trip, GitHub-backed hosted writes and the protected
Vercel preview remain explicit checks. The same is true of the second human calibration pass and
the real internal-comms examples.

Those gaps are kept visible because the hiring team is judging product thinking. A clean mock is
useful evidence of a contract. It is not evidence that an installation works.
