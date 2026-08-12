# Lemonade voice - analysis

> Built from `research/lemonade-corpus.md` (61 excerpts, gitignored). Every claim below cites
> a LEM-### id. Coverage gaps are stated plainly rather than papered over - see the corpus
> file's own coverage note for what's thin.

## Coverage caveat, read first

This pass reached 61 of the 150-200 excerpts targeted, and three content types are full or
near-total gaps: email/notifications (type 7), ads/video (type 13), and first-party failure
copy (type 6 - I have the *shape* of failure content but almost no verbatim first-party
wording). `lemonade.com` itself blocked every direct fetch attempt (HTTP 403), so landing
pages, blog posts, and the help centre are reconstructed from search-index snippets rather
than full reads. Everything below is real and cited, but it leans harder on Mobbin
(in-app copy, chat) and App Store release notes than the brief intended, simply because
those were the sources my tools could actually reach. Treat this as a strong first pass that
needs a second one with normal browser access to close three specific gaps, not as done.

---

## 1. One voice or several

**Several, organised less by "register" in the abstract and more by *what the reader needs
at that moment*.** The clearest three-way split in the evidence:

- **The performing voice** - marketing, release notes, the chat bots at ease (Maya/Jim when
  nothing has gone wrong). Playful, punning, first-person-plural confident. LEM-042 through
  LEM-046, LEM-023/024/025.
- **The working voice** - UI labels, coverage data, form fields. Flat, technical, sometimes
  unedited jargon. LEM-010, LEM-013, LEM-017.
- **The covering voice** - anything with legal, compliance, or fraud-prevention weight, even
  inside a chat bubble. Reverts to careful, hedged, or disclaimer-shaped language regardless
  of which surface it appears on. LEM-020, LEM-029, LEM-037, LEM-038.

The important finding is that **these three aren't tied to content type** - they can all
appear on the same screen, sometimes in adjacent sentences (LEM-019 into LEM-020 is the
cleanest example: an exclamation-marked feature pitch followed immediately, same modal, by
"chats are not a replacement for in-person vet visits... cannot prescribe, diagnose, or
provide treatment"). So the brand profile should not be organised as "voice per content
type" so much as "voice per *stakes*, checked at the sentence level." A content-type
playbook is still useful for defaults, but the switching rule itself needs to travel with
the content, not the channel.

## 2. Differences by insurance line (added per request)

This is worth calling out as its own finding, because the evidence is more consistent than
expected: **the working voice flexes hard by product line, the performing voice barely
does.**

- **Pet** is where the performing voice is most unrestrained. The onboarding flow puns on
  the pet itself ("Tail-oring coverages," LEM-025), includes a joke loading step with no
  functional content ("Feeding Fluffy," LEM-025), and uses a dog/cat illustration mid-flow
  (screen evidence, `mobbin_url` in flow ed00a1b5). Bad-news moments in the pet claim flow
  still open with emotional acknowledgment before data collection ("Oh no... how is Hiromi
  doing now?", LEM-030) - the only line of business where I found the bot performing concern
  for a *third party* (the pet) rather than the policyholder directly.
- **Home** is the most data-heavy and technical of the four. The homeowners quote flow walks
  through foundation type, siding, frame, roof age and material as structured data fields
  with almost no personality in the copy - "Concrete Slab," "Brick Veneer," "Tar or Gravel"
  (flow e4468874, screens ~14-17). "Deductible" and "Hurricane Deductible" survive as
  unedited technical labels here (LEM-010) - notably, *not* redefined inline the way car
  insurance's "comprehensive coverage" is (LEM-013). Home is the line where the working
  voice is most dominant and the performing voice is thinnest.
- **Car** sits in between, and is the line most visibly being repositioned right now. The
  2026 FSD/Tesla push (LEM-046, LEM-049, LEM-053) uses the plainest, most declarative
  language in the whole corpus - "We price it by how you actually drive" has zero jargon and
  zero jokes. That's notable next to home's untranslated "Deductible": car insurance appears
  to be the current flagship for the "translate everything" ambition, possibly because it's
  the newest/most actively marketed product line, while home has had less recent copy
  attention and still carries older, more conventional insurance labels.
- **Renters** shows up mostly in claims and support flows rather than quote flows in what I
  gathered (LEM-031, LEM-014), so I can't say much about its quote-flow voice specifically -
  flagged as a gap. What I do have (the claim-closing sequence, LEM-031) matches the general
  "working voice" pattern - efficient, checklist-like, warmly bookended ("Nearly there!" ...
  "Amazing! Thanks so much").

**Practical implication for the brand profile:** if the profile ends up holding per-product
guidance at all, home and pet should probably be treated as opposite ends of a spectrum
(most restrained vs. most playful) with car and renters in between, rather than assuming one
"Lemonade voice" applies evenly across all five product lines. This needs more evidence
before it's a confident rule - it's currently based on one quote flow per line - but the
pattern was consistent enough across everything gathered that it's very unlikely to be
noise.

## 3. Measurable traits

Numbers are only as good as 61 excerpts allow - treat ranges as directional, not
statistically solid.

- **Sentence length:** UI copy runs short, often under 10 words ("Where do I find these
  details?", LEM-015; "Rest insured, there are major changes in this release," LEM-045 -
  9 words). Chat copy runs slightly longer when reassuring ("Don't worry, this won't affect
  your price or eligibility. It's just to help you understand what will and won't be
  covered," LEM-022 - two sentences, ~26 words total). Legal/compliance sentences are the
  longest in the corpus (LEM-020's disclaimer runs two sentences, ~30 words, dense with
  clauses).
- **Contractions:** used freely and consistently across every register I have evidence for,
  including legal - "don't," "won't," "it's," "can't," "they're" all appear inside
  disclaimer text (LEM-020), not just casual copy. This is a genuine finding: contraction use
  does **not** track formality here the way it typically would.
- **Person:** heavy direct address ("your price," "your policy," LEM-018/020) and heavy
  first-person-plural ("We gave the app a quiet tune-up," LEM-043; "We price it by how you
  actually drive," LEM-046). I found no clear passive-voice example in the corpus - worth
  checking specifically in a follow-up pass, since its absence might itself be a rule.
- **Punctuation:** exclamation marks appear but are rationed - one per message chunk at most
  in every example I have (LEM-019, LEM-023/024), never stacked. Em-dashes are rare - only
  two confirmed instances in 61 excerpts (LEM-031, LEM-043) - so "no em-dashes" is close to
  true but not absolute. Ellipses are a real, repeated device for trailing/thinking beats
  ("Let me crunch some numbers...", LEM-023; "Quiet one this time...", LEM-042 uses a full
  stop instead, so ellipses specifically mark *in-progress* or *casual aside* moments, not
  general informality).
- **Capitalisation:** buttons and section headers are consistently ALL CAPS (LEM-009,
  LEM-011, LEM-016, LEM-027) regardless of how casual the surrounding chat is - this is a
  strong, simple, checkable rule. Body copy is ordinary sentence case throughout.
- **Numbers/money:** dollar amounts shown as "$21," "$67.33," with cents rendered small/
  superscript in the UI (visual convention, not text) - LEM-012, screen evidence. Percentages
  spelled as numerals with "%" (LEM-012's "10% discount," LEM-046's implied "50% off").

## 4. Vocabulary

- **Repeated words/phrases:** "instant" (LEM-003, LEM-008 "Instant Everything"), the "you
  actually [do X]" construction (LEM-046), self-aware "insurance is annoying" framing
  (LEM-044).
- **Jargon table** (from what I could verify - several cells are genuinely mixed rather than
  clean):

  | Term | What I found | Evidence |
  |---|---|---|
  | Deductible | Kept as-is, unexplained, in home flow | LEM-010 |
  | Comprehensive coverage | Kept as the label, but defined inline in the same sentence | LEM-013 |
  | Usage-based/telematics pricing | Fully translated, term itself never appears | LEM-046 |
  | Claim | Kept as-is everywhere, no substitute found | LEM-014, LEM-031, LEM-035 |
  | Pre-existing condition | Kept as-is in denial context (second-hand only, LEM-034) |
  | Policyholder, underwriting, peril, endorsement | **Not found anywhere in this corpus** - absence noted, not confirmed as deliberate avoidance |

  **The honest conclusion:** the "they replaced all the jargon" story is false as a blanket
  claim. What the evidence actually shows is *selective* translation - concentrated on
  pricing mechanics (fully plain-English) and least present on coverage/deductible
  terminology (still industry-standard), with claims vocabulary sitting in between. This
  should be stated exactly this way in the guidelines, not softened back into "they use
  plain language."
- **Product naming:** "Lemonade Autonomous Car" (LEM-049) - full product name capitalised
  as a proper noun. Bot names "Maya" and "Jim" always capitalised, always given a role
  subtitle ("Personal Insurance Assistant," "Claims Center" - screen evidence).

## 5. Structural patterns

- Release notes that contain no real change lean on a joke or a metaphor as the entire
  content (LEM-042, LEM-044, LEM-045); release notes that announce a real feature drop the
  joke entirely and go flat-declarative (LEM-049). This is a clean, checkable switch: **joke
  density is inversely proportional to how much the reader actually needs to know.**
- Chat flows follow a consistent shape: acknowledge → reassure/joke → ask the next question.
  Seen in LEM-021/022 (onboarding), LEM-030 (claims). The reassurance step is not optional -
  it appears even when nothing was said that needed reassuring (LEM-022 pre-empts a worry
  the user hasn't voiced yet).
- Legal/compliance content interrupts the surrounding flow rather than blending into it -
  LEM-020 and LEM-029 both read as a register shift the reader is meant to notice, not one
  that's smoothed over.

## 6. Humour - where it lives and stops

**Confirmed boundary:** humour is safe when it's about *process* (loading screens, minor
software updates, zodiac small talk) and unsafe the moment it touches *how the company
judges or affects the customer*. The clearest evidence for the unsafe side isn't from this
corpus's happy-path screens - it's LEM-040, the 2021 deleted tweet about AI reading
"non-verbal clues" for fraud, which triggered a public discrimination backlash serious enough
to still be indexed and cited five years later. That one incident is worth more to the
guidelines than a dozen safe examples, because it's the one place I have hard evidence of
where their own casual, confident voice went wrong when applied past its safe zone. Within
this corpus, they never repeat that mistake - every claims/fraud-adjacent moment I found
after that point (LEM-029's "pledge of honor," LEM-020's disclaimer) treats the same subject
carefully, not playfully. That contrast (2021 miss vs. later care) is itself evidence the
boundary is a hard-learned rule, not an accident.

Also confirmed: jokes never appear inside anything with legal/liability weight, even when
the surrounding chat is playful (LEM-019 → LEM-020 in the same modal is the clean minimal
pair).

## 7. Bad news and sensitive moments

Weakly evidenced - see corpus type 6 caveat. What I can say with the evidence available:
- Claims bots open bad-news-adjacent moments with emotional acknowledgment before the
  transactional question (LEM-030), consistently.
- Fraud-prevention/honesty requirements are reframed as a positive ritual with a friendly
  name ("pledge of honor," LEM-029) rather than presented as a legal warning, even though the
  underlying requirement is a legal one.
- Actual denial reasons, actual decline screens, actual "we're sorry, this claim is not
  covered" copy: **not found**, second-hand accounts only (LEM-032/033/034), and those are
  reviewer paraphrase, not Lemonade's wording. **This is the single most important gap to
  close before the guidelines' "sensitive situations" section can be trusted.**

## 8. Compliance and constraints

- Liability disclaimers appear in full, unshortened legal register even mid-chat (LEM-020).
- The honesty/fraud-prevention step is mandatory and repeats identically across sessions
  ("Just like last time," LEM-029), suggesting it's a fixed compliance requirement rather
  than adaptive copy.
- Policy 2.0's own project documentation is explicit that plain language has a hard limit -
  "zero exceptions may be unrealistic" (LEM-037) - i.e. they've stated publicly that
  simplification is bounded by what regulators/actuaries will allow, not just an
  editorial choice.

## 9. Contrast pairs

1. **LEM-019 vs LEM-020** (same modal): excited feature pitch with an exclamation mark,
   immediately followed by a flat, clause-dense liability disclaimer. Cleanest single example
   of the register switch in the whole corpus.
2. **LEM-010 vs LEM-046**: "Deductible" (home, untranslated jargon) vs "We price it by how
   you actually drive" (car, fully translated). Same underlying goal - explain a pricing/cost
   mechanic - handled in opposite ways depending on product line.
3. **LEM-001/LEM-050**: "21st century" framing recurs in both the homepage title and a CEO
   podcast quote - a rare case of the same specific phrase surviving from marketing into
   investor-adjacent commentary.
4. **LEM-044 vs LEM-049**: same channel (App Store release notes), joke-first when there's
   nothing to announce, flat-declarative when there's a real feature - see section 5.

## 10. What a generator would get wrong

Told simply "write like Lemonade" with no profile, a model would very likely:
- **Overuse the zodiac-joke/pun pattern everywhere**, including in claims and coverage
  copy, because it's the single most distinctive and memorable thing in the corpus - and
  that is exactly the mistake the 2021 tweet shows they've already made and moved past.
- **Flatten the jargon story into "always translate,"** producing copy that removes
  "deductible" from a home insurance context where the real brand evidence says they leave
  it alone.
- **Miss the ALL CAPS button convention** and the ellipsis-as-thinking-beat convention,
  since both are easy to drop when writing in prose rather than working in a UI mockup.
- **Add an exclamation mark to actual bad news**, following the general "friendly, upbeat"
  impression, exactly the move their own liability disclaimers and fraud-step copy
  deliberately avoid.
- **Apply the same "voice" evenly to all five product lines**, missing that pet is where
  they're most playful and home is where they're most restrained (section 2).

---

## Questions for the Lemonade team

| Question | Why it matters | Assumption made instead |
|---|---|---|
| What does an actual claim denial message say, verbatim? | This corpus has only second-hand, reviewer-paraphrased accounts (LEM-032/033/034) - the single biggest gap in the whole analysis, and the highest-stakes content type to get wrong | Assumed denial copy follows the same "acknowledge, then be direct" pattern seen in the claims-intake bot (LEM-030), but this is an inference, not evidence |
| Is the pet/home voice gap (section 2) deliberate positioning, or just an artifact of pet insurance being a newer, more actively-copywritten product? | Changes whether the brand profile should encode "vary tone by product line" as a rule or treat it as something to eventually unify | Assumed it's at least partly deliberate, since the pattern held consistently across every pet vs. home example gathered |
| What does a real marketing email look like? | Full gap in this corpus (type 7) - milled.com and other archives didn't surface anything usable | Assumed email sits somewhere between release-notes-casual and UI-neutral, based on nothing but adjacency; flagged as unconfirmed |
| How does Lemonade talk about a *rate increase* specifically (not a denial - a renewal price going up)? | High-stakes, common, and completely unevidenced here | No assumption made - flagged as fully open |
