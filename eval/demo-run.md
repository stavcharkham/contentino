# Deterministic prototype demo

Run on 2026-08-13 with `npm run demo`. The runner uses mocked model outputs and a temporary
copy of the real profile, so it proves workflow contracts without spending API budget or
putting fixture artifacts into the live ledger.

## Result

- A Drive transcript produced a brief with source id `transcript-1`.
- Stav's named approval unlocked external generation. The result scored into review, received
  a Google Docs correction, was revised, and stayed in review.
- Low-stakes product copy scored into auto-publish and moved to
  `content/published/2026-08-14-cta-to-finish-a-quote-04ba.md` inside the temporary store.
- An unsupported claims guarantee was blocked by the compliance veto.
- Claude, Slack and Google Docs surfaces produced five correction records in the same format.
- Four matching `action-verb` corrections produced one guideline proposal. Named approval
  promoted it into the profile, and the matching corrections were resolved.
- The manually promoted `specific-action-label` mechanics rule remains the code-level form of
  that guideline.
- The internal-comms extension fixture scored 10, 10 and 10 and activated in the temporary
  store. These are explicitly fixture examples. The live profile still requires three real,
  approved examples from a content owner.
- Seven runs and five revisions reached the temporary ledger. Fixture cost was $0 by design.

## What this proves

The full application path and its safety gates work together without external services. Unit,
contract and adapter tests cover the same behavior independently.

It does not prove model quality, Slack installation, Google permissions or GitHub persistence.
Those checks require the real credentials listed in `.env.example` and are kept separate so a
mock cannot be mistaken for hosted evidence.
