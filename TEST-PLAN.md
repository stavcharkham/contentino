# Acceptance test plan

> Run this against the production deployment and the private GitHub repository. Do not paste
> secrets, tokens or bypass URLs into screenshots. Record the GitHub commit, dashboard screenshot
> and Slack or Google link named under **Evidence** for each test.

## What counts as a pass

A test passes only when the visible result and its stored evidence agree. Every content run must
leave a ledger row with its score, outcome, revision count, API cost and estimated minutes saved.
Any content change must be traceable to one logical Git commit.

Use these statuses in the record below:

- **Pass** - result and stored evidence both checked.
- **Fail** - the result is wrong or its evidence is missing.
- **Blocked** - a named dependency prevents the test from starting.

## Before testing

- [ ] Open [the production dashboard](https://contentino-seven.vercel.app) through the protected
      link. Confirm the page shows the Contentino flow and not a Vercel error.
- [ ] In Slack Event Subscriptions, confirm the request URL starts with
      `https://contentino-seven.vercel.app/api/slack` and shows **Verified**.
- [ ] Confirm the Contentino app is installed and invited to the configured Slack channel.
- [ ] Confirm the Google OAuth user can open the watched Drive folder and create, comment on and
      edit documents there.
- [ ] Keep the private GitHub repository open. It is the source of truth for briefs, drafts,
      scorecards, corrections, guidelines and the ledger.

## 1. Dashboard and evidence baseline

1. Open the production dashboard.
2. Select each node from Source through Guideline.
3. Reload the page and check that its generated time changes.
4. Narrow the browser to a phone width, then use Tab and Enter to move through the flow.

**Pass when:** the selected node filters the evidence, real counts are shown without invented trend
claims, the phone layout does not clip, focus is visible and every control works from the keyboard.

**Evidence:** one desktop screenshot and one phone-width screenshot.

## 2. Low-stakes micro-copy auto-publication

In the configured Slack channel, send:

```text
@Contentino microcopy: CTA button shown after a customer has finished entering quote details. Keep it under 24 characters.
```

**Pass when:** Slack replies in the thread with a path, score and outcome; a safe low-stakes result
that clears 9 moves into `content/published`; the scorecard hash matches the published file; and the
dashboard gains one run with cost and time saved.

If the model scores below 8, the system may regenerate up to three times. If it still cannot clear
the gate, escalation to review is the correct result, not a test failure.

**Evidence:** Slack thread, the GitHub commit, published file, scorecard and updated dashboard row.

## 3. Compliance veto

Send:

```text
@Contentino microcopy: Button promising that everyone is approved instantly and that we never use personal data.
```

**Pass when:** the piece is blocked, nothing is added to `content/published`, the scorecard records a
failed compliance check, and the dashboard block count increases.

**Evidence:** Slack thread, blocked scorecard, ledger row and dashboard screenshot.

## 4. Transcript to approved external draft

Send this as one Slack mention:

```text
@Contentino brief: In the weekly product meeting, Maya said Lemonade is piloting a simpler claims status view with 200 invited customers in New York. The pilot begins 1 September. We are measuring whether people understand the next step without contacting support. Not saying: the feature is available to everyone, that it changes claim decisions, or that the pilot guarantees a launch.
```

1. Confirm Slack returns a brief path and does not generate a public-facing draft.
2. Open the brief in GitHub. Check that the named claims and all three “Not saying” boundaries are
   preserved and that approval is still required.
3. Send `@Contentino approve content/briefs/<the returned id>.md`.

**Pass when:** the approval names the Slack user, generation starts only after approval, and the
external-comms draft is posted for review even if it scores 9 or 10. It must never auto-publish.

**Evidence:** brief, approval commit, Slack review thread, draft, scorecard and ledger row.

## 5. Slack review and ambiguity handling

Run both checks in the external-draft review thread:

1. Reply `Make it punchier.`
2. Confirm Contentino asks what exact wording should change and does not create a correction yet.
3. Reply with a concrete edit, for example:
   `Replace “We are pleased to announce” with “Today, we’re piloting” because the opening should be direct.`

**Pass when:** the second reply creates one correction containing the exact old text, new text,
verbatim feedback, criterion, reviewer and Slack surface; the draft is revised and rescored; and the
thread receives the revision. Re-delivering the same Slack event must not create a duplicate.

**Evidence:** Slack thread, correction file, revised draft, new scorecard and ledger revision count.

## 6. Drive transcript intake and idempotency

1. Create a Google Doc in the watched folder named `Contentino test transcript` and paste the
   transcript from test 4.
2. Ask Codex to run the protected Drive sync now rather than waiting for the daily cron.
3. Check GitHub for one new brief whose source id is the Google file id.
4. Ask Codex to run the same sync again without changing the Drive file.

**Pass when:** the first sync creates one brief, the second creates none, and no duplicate ledger or
brief record appears.

**Evidence:** Drive file link, both cron responses and the one GitHub brief commit.

## 7. Claude review surface

Ask Codex:

```text
Review <draft path>. Replace “<exact old text>” with “<new text>”. My verbatim feedback is: “<feedback>”. Use the most relevant rubric criterion.
```

**Pass when:** the draft changes only after the exact old text is found, a correction is stored with
surface `claude`, and the revision is rescored through the same gate used by Slack.

**Evidence:** correction, revised draft, scorecard and logical Git commit.

## 8. Google Docs review surface

**Currently blocked:** the adapter can read anchored comments, apply a revision, reply and resolve
the comment, but no user-facing action currently creates the review document and maps it to a draft.
Complete that wiring before running this test.

After it is wired:

1. Send an external draft to Google Docs review.
2. Highlight exact text and leave `Make this warmer.` Confirm the system replies with a clarification
   and leaves the comment open.
3. Add a second anchored comment with an explicit replacement.
4. Run the protected Drive/Docs sync.

**Pass when:** the explicit comment produces one `gdocs` correction, updates the draft and document,
posts a reply, resolves the processed comment and remains idempotent on a second sync.

**Evidence:** Google Doc link, resolved comment, correction, revised draft and cron responses.

## 9. Four corrections to one learned guideline

Create four open corrections on four drafts that express the same reusable rule and use the same
content type and criterion. They may come from Claude, Slack and Google Docs.

1. Ask Codex to run the correction clustering skill.
2. Inspect the proposed guideline and its four source correction ids.
3. Approve it by name.
4. Generate a new piece whose wording would previously have needed the same correction.

**Pass when:** no proposal appears with fewer than four matching corrections; approval adds the rule
to the versioned content-type guideline, resolves its source corrections, and later generation follows
the rule.

**Evidence:** four corrections, proposal, named approval commit and before/after generation.

## 10. Add internal comms as a third type

This needs three real examples approved by a content owner, with source links and an agreed stakes
ceiling. Invented fixture copy is not acceptable.

1. Give the examples and decisions to Codex and run the add-content-type skill.
2. Inspect the generated `guideline.md`, `criteria.md` and `examples.md`.
3. Run validation.

**Pass when:** the type remains draft if any example scores below 9, fails compliance or receives a
zero criterion; all examples scoring 9-10 activates the type; and a later internal-comms generation
loads the active files.

**Evidence:** example sources, three profile files, validation scores, activation commit and one later
generation.

## 11. Technical and security checks run by Codex

Ask Codex to run this block and attach the raw results:

- [ ] `npm run check`
- [ ] `npm run test:e2e`
- [ ] `npm run build`
- [ ] `npm audit --audit-level=high`
- [ ] Signed Slack challenge returns 200 with the exact challenge.
- [ ] Unsigned Slack request returns 401.
- [ ] Drive cron without its bearer secret returns 401.
- [ ] A stale file hash, missing scorecard, compliance veto, zero criterion and ineligible stakes
      ceiling each refuse publication.
- [ ] A GitHub expected-SHA conflict refuses to overwrite newer content.
- [ ] No secret appears in Git, build output, dashboard data, Slack messages or screenshots.
- [ ] Actual model calls stop before the configured $50 project budget is exceeded.

**Pass when:** every command and protected-route check is green and the security review has no open
high-severity finding.

## 12. Calibration and cost evidence

1. Stav blind-scores the 20 items in Part 3 of `eval/scoring-set.md` before opening the answer key.
2. Codex compares those scores with `eval/scores.md` and records disagreements.
3. Codex runs the real Anthropic answer-key evaluation, including all compliance cases.
4. Read actual cost per approved piece and regeneration rate from `metrics/ledger.csv`.
5. Revisit the model allocation only from those results.

**Pass when:** human disagreement is disclosed, the model comparison is recorded rather than
asserted, all compliance cases are caught, and model/cost decisions cite actual usage.

**Evidence:** completed blind worksheet, evaluation report and ledger-based cost note.

## Final acceptance record

| Test | Status | Evidence link or commit | Notes |
|---|---|---|---|
| Dashboard |  |  |  |
| Micro-copy publication |  |  |  |
| Compliance veto |  |  |  |
| Brief and external draft |  |  |  |
| Slack review |  |  |  |
| Drive idempotency |  |  |  |
| Claude review |  |  |  |
| Google Docs review | Blocked |  | Review-document creation is not wired |
| Learned guideline |  |  |  |
| Internal comms extension | Blocked |  | Needs three approved examples |
| Technical and security |  |  |  |
| Calibration and cost |  |  |  |

