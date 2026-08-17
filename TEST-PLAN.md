# Test Contentino

> **Status:** this kit was run live against production on 2026-08-15; every failure it
> surfaced was fixed and re-verified (the record is in `PROCESS.md`). The checkboxes below
> are deliberately blank - this is a reusable script for the next run, not a status report.
> What remains genuinely open at submission is listed at the bottom and in `PLAN.md`.

This is the test script for Stav. You do not need a terminal, a file path or GitHub.

Use the Slack channel that contains Contentino and the protected production dashboard. When a test
needs a system check, tell Codex to run it and report the result in product language.

## Before you start

- [ ] Contentino is in the Slack channel.
- [ ] The production dashboard opens.
- [ ] The [example transcript](https://docs.google.com/document/d/1e1u4b0QeYHyBHMStd_VH6fHFcJRj5s-6mfhRZqFJXpc/edit) opens in the watched Drive folder.

## 1. Safe microcopy

Paste this in Slack:

```text
@Contentino microcopy: CTA button shown after a customer has finished entering quote details. Keep it under 24 characters.
```

Pass when:

- [ ] An eyes reaction appears on your message.
- [ ] The actual copy is visible in its thread.
- [ ] The score and decision are visible.
- [ ] There is no `.md` path or instruction to open GitHub.

## 2. Compliance block

Paste this in Slack:

```text
@Contentino microcopy: Button promising that everyone is approved instantly and that we never use personal data.
```

Pass when:

- [ ] The result is visible in the thread.
- [ ] The reply says **Blocked** and explains that the compliance gate stopped it.
- [ ] The dashboard's blocked count increases after a refresh.

## 3. Brief, approval and external draft

Paste this as one Slack message:

```text
@Contentino brief: In the weekly claims product meeting on 12 August 2026, Maya Chen said Lemonade will test a simpler claims-status view with 200 invited renters-insurance customers in New York from 1 September. The test only changes how status and next steps are explained. It does not change coverage, claim decisions, payment timing or customer eligibility. The team will measure whether customers understand their next step without contacting support. Maya said: "The goal is to make the next step clear, not to make the claim look simpler than it is." Do not say the feature is available to everyone, that it speeds up claim decisions, that it guarantees fewer support contacts, or that the test will become a full launch.
```

Pass when:

- [ ] The full brief appears in the Slack thread.
- [ ] The brief includes the facts, the quote and the **Not saying** boundaries.
- [ ] No external draft appears before approval.
- [ ] There is no `.md` path.

Reply in the same thread:

```text
write it here
```

Pass when:

- [ ] The full external draft appears in that same thread.
- [ ] The score is visible.
- [ ] It says the draft needs review, even when the score is high.

## 4. Slack feedback

In the external-draft thread, reply:

```text
Make it shorter
```

Pass when Contentino asks what exact wording should change. A vague request must not fail and must
not silently edit the draft.

Then copy one exact sentence from the visible draft and reply using this shape:

```text
Replace “PASTE THE EXACT SENTENCE HERE” with “PASTE YOUR REPLACEMENT HERE” because the opening should be more direct.
```

Pass when:

- [ ] The revised draft is visible in the thread.
- [ ] Contentino says it applied and rescored the correction.
- [ ] The dashboard shows the correction and one more revision.

## 5. Drive transcript intake

1. Open the [ready-made example transcript](https://docs.google.com/document/d/1e1u4b0QeYHyBHMStd_VH6fHFcJRj5s-6mfhRZqFJXpc/edit). It is already in the watched folder.
2. Tell Codex: `Run the Contentino Drive intake now, then run it a second time and report both results.`

Pass when the first run creates one brief and the second creates none. Codex should give you the
brief's headline and source, not an internal file path.

## 6. Dashboard

Open the production dashboard and check:

- [ ] The runs from tests 1-5 appear under Recent pieces.
- [ ] Scores, outcomes, revisions, cost and estimated time saved contain real values.
- [ ] Selecting Source, Brief, Draft, Gate, Review/Publish, Correction and Guideline filters the evidence.
- [ ] The page works at phone width and with the Tab and Enter keys.
- [ ] There are no invented trend claims.

## Tests that are not ready for Stav yet

These are open product work, not setup you have missed:

- Google Docs review-document creation has not been connected to a user-facing action.
- Internal comms needs three real examples approved by a content owner before activation.
- The real Anthropic calibration and Stav's blind 20-item scoring are still outstanding.

Do not try to test those three until PLAN.md marks them complete.

## Ask Codex to run the technical checks

Copy this to Codex after the six tests above:

```text
Run Contentino's full technical acceptance now: code checks, production build, protected-route security, Slack signature verification, Drive idempotency, GitHub conflict protection, publication gate failures, secret scan and the $50 budget guard. Give me a pass/fail table and fix any failures before calling it done.
```

## Test record

| Test | Pass or fail | What happened |
|---|---|---|
| Safe microcopy |  |  |
| Compliance block |  |  |
| Brief and external draft |  |  |
| Slack feedback |  |  |
| Drive intake |  |  |
| Dashboard |  |  |
| Codex technical checks |  |  |
