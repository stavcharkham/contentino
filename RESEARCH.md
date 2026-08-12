# Research

What we found before building, and what we couldn't find.

Two research passes ran on 2026-08-12: one on the tools already in this market, one on
Lemonade's own writing. Full output is in `research/`.

Both passes required a source and a date on every claim, and allowed "could not verify" as an
answer. Every quote from Lemonade carries an id linking it to the excerpt it came from.

## What already exists

### Every tool defines brand voice the same way

Jasper, Copy.ai and HubSpot have arrived at the same shape without copying each other. You
upload writing samples or point at a website, the tool writes its own summary of your voice,
you lightly edit that summary, and it applies to everything you generate. HubSpot asks for 500
words and a list of personality traits. Grammarly has you pick sample phrases that match the
tone you want. Acrolinx checks writing against rules but doesn't write anything.

It works when someone does the setup carefully. It's a reasonable answer to the problem.

### Four things no tool does

Checked three ways: vendor documentation, a feature comparison across nine products, and user
reviews. All three came back empty on the same list.

- You can't see the voice it built, in full.
- You can't version it or see what changed.
- You can't export it.
- Nothing learns from your edits. You fix the same thing every week and the tool never notices.

Version history, exporting a voice, and learning from edits appeared in zero user reviews
across every search run. A feature nobody discusses either way is a feature nobody uses.

Brand voice in these products is a setting inside a vendor's tool, not a document a customer
owns.

### What users complain about

Not speed. The recurring complaint is the editing and fact-checking still needed before
anything can be published, plus generic output and price.

One reviewer left Jasper for plain ChatGPT because it matched their brand voice better than
Jasper's brand voice feature did.

Across positive and negative reviews the split is consistent: these products work for people
who did heavy setup, and disappoint people who expected the voice feature to work from thin
input. Review sites also over-represent customers who stayed, so the real picture is likely
worse.

### What people do instead

The clearest evidence of demand. People solving this by hand today are:

- Pasting brand voice instructions into ChatGPT at the start of every session, with nothing
  carrying over between conversations.
- Building a Custom GPT with the style guide in its instructions, then manually replacing it
  every time the guide changes.
- Keeping the guide in a Google Doc, a Notion page, or a brand portal.

One guide describes the problem almost exactly: teams on personal ChatGPT accounts means
nobody follows the same guidelines and nobody feeds it the brand's actual voice.

Nobody suggested version control. People actively solving this by hand haven't reached for the
obvious fix.

### How the evaluation world scores things

- **Comparing beats scoring.** Asking which of two drafts is better is more reliable, from
  people and models alike, than asking for a mark out of ten. An absolute score needs a
  calibration the judge may not have.
- **Run the free checks first.** promptfoo runs mechanical checks before paid model-graded
  ones, and reserves the expensive judgement for what the cheap checks can't catch.
- **Small models are cautioned against as judges**, though that guidance is about factual
  accuracy rather than subjective questions like tone.
- **Nothing published covers small-model judging of brand voice specifically.** There's no
  established recipe to follow here.

### Guidelines as folders

Anthropic's Agent Skills are a folder with a required `SKILL.md` and optional subfolders, and
the guidance for a growing instructions file is to split it into separate referenced files.
Cursor moved from one rules file to a folder of scoped files, and gives the reason plainly:
one large file was less reliable, not just less convenient.

Both landed in the same place. Start with a file, split into a folder as it grows.

Not covered: the public human style guides from Mailchimp, GOV.UK, Microsoft and Google.
Still open.

## How Lemonade writes

From 54 excerpts across app screens, release notes, policy documentation, blog posts, investor
material and second-hand reports. The target was 150. `lemonade.com` blocked direct access, so
landing pages, blog and help centre content rest on search snippets rather than full reads.

### The voice changes with what's at stake, not with the channel

Three modes:

- **Performing** - marketing, release notes, chat when nothing is wrong. Punning, warm,
  confident.
- **Working** - forms, coverage data, field labels. Flat, efficient, sometimes technical.
- **Covering** - anything carrying legal, fraud or compliance weight. Careful and complete,
  whatever the tone around it.

They aren't tied to a channel. All three can appear on one screen. In the vet chat, an
exclamation-marked feature pitch is followed in the same window by a flat medical liability
disclaimer.

This is the finding that changes the most. The switch travels with the sentence, not the page
it sits on.

### "They replaced the jargon" isn't true

Translation is selective. Usage-based pricing is explained fully in plain English and the word
telematics never appears. "Deductible" and "Hurricane Deductible" sit untranslated and
unexplained on a homeowners screen. "Comprehensive coverage" keeps its name but is defined in
the same breath. "Claim" survives everywhere.

Pricing gets translated. Coverage terms mostly don't.

### The voice flexes by product line

Pet is the most playful: puns on the pet itself, a joke loading step with no function. Home is
the most restrained, walking through foundation type, siding and roof material with almost no
personality. Car sits between, and is currently the plainest-spoken of the three.

Based on about one flow per line, so treat it as a pattern rather than a rule.

### Rules a machine can check

- Buttons and section headers are ALL CAPS. Body copy never is.
- One exclamation mark per message at most, and never on bad news.
- Contractions appear everywhere, including inside legal disclaimers.
- Em dashes are rare. Two in 54 excerpts.
- Ellipses mark a thought in progress, not general informality.
- Interface copy often runs under ten words.

### Where the humour stops

Jokes are safe about process and stop the moment they touch how the company judges or affects
someone. The evidence is a deleted 2021 tweet saying their AI reads non-verbal cues to detect
fraud, which drew a public discrimination backlash. Every claims and fraud moment found after
that is handled carefully.

Release notes show the same switch: a joke when there's nothing to announce, flat and
declarative when there's a real feature.

### What we couldn't find

- **Claim denials, coverage rejections and price increase notices.** Only reviewers
  paraphrasing them. This is the highest-stakes writing an insurer does.
- **Marketing and transactional email.** Nothing usable.
- **Ads and video scripts.** Nothing.

## What this means for what we build

**We're not replacing a competitor. We're replacing copy and paste.** Nobody here is choosing
between this and Jasper. They paste the style guide into ChatGPT at the start of each session,
keep a Custom GPT they update by hand, or ask a colleague whether a draft sounds right. That's
what we have to beat.

**Most of what these products sell, we don't need.** Templates, SEO scoring, image generation,
plagiarism checks, multi-brand support, seat-based collaboration. They exist to win deals. We
have one company and one set of guidelines.

**What the market ignores is what we need most.** No product versions a brand voice, exports
it, or learns from edits. For a vendor those are lock-in problems with no reason to solve.
Here they're the point. We need to see what changed in a guideline and who approved it. We
need approved guidelines to reach the tools people already work in. And when the same
correction comes back every week, the profile should learn it.

**The bottleneck is approval, not writing.** Every product in this market draws the same
complaint: the editing and checking still needed before anything goes out. Here that's
compliance and legal review. So we shorten the path to approved. Drafting faster only
lengthens the queue in front of the same reviewer.

**Stakes decide what runs unattended.** Lemonade's voice changes with what's at risk, not with
the channel. That same line decides what we automate. Release notes, social posts and internal
comms publish on their own. Denials, price increases and anything a regulator reads never
publish automatically. They arrive as a better draft, and a person owns them.

**A score has to do something.** Ours decides one of three things: publish, review, or
rewrite. A guideline becomes a skill in the company plugin and a tool in the agent once it
passes. The criteria come from what the research found actually goes wrong: the wrong tone for
the moment, a joke where nothing is funny, and jargon translated that Lemonade keeps.

Full scoring detail is in `RUBRIC.md`.

## Questions for the Lemonade team

Three, with what we assumed in the meantime.

**Can we see real examples of your highest-stakes copy?** Claim denials, coverage rejections,
renewal price increases. It's the writing that matters most, and the only kind we couldn't
find anywhere public. We assumed it opens by acknowledging the situation before getting to the
point, the way the claims bot does.

**Who signs off on content today, and how long does it take?** This product exists to shorten
that path. We assumed a named reviewer per content type, and a wait measured in days.

**Where should approved guidelines end up?** We plan to turn them into a skill in the company
plugin and a tool in the agent. We assumed those are the right destinations.

## What this research doesn't cover

- No competing product was logged into or trialled. Everything rests on documentation, pricing
  pages and reviews.
- The Lemonade corpus reached 54 excerpts against a target of 150, and three content types are
  thin or empty.
- The public style guides from Mailchimp, GOV.UK, Microsoft and Google weren't researched.
- Around eight excerpts rest on search summaries rather than a confirmed source. Those are
  marked in the corpus.
