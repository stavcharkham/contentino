# Feature matrix - AI content generation and brand voice tools

> Part B of `research/briefs/01-prior-art.md`. Cells: yes / no / partial / unverified.
> Checked 2026-08-12 via web search (search results, help docs, pricing pages) - no product
> was logged into directly, so anything gated behind an active trial is marked accordingly.

| Feature | Writer | Jasper | Copy.ai | Anyword | Grammarly Business | Acrolinx | HubSpot Content Hub | Canva (Magic Write/Brand Hub) | Mailchimp |
|---|---|---|---|---|---|---|---|---|---|
| Brand voice definition | yes | yes | yes | yes | partial (tone, not full voice) | partial (governance, not generative voice) | yes | partial (Brand Kit, not generative voice) | unverified |
| Voice applied automatically | yes (workspace default) | yes (workspace default) | yes | yes | yes (real-time feedback) | yes (sidebar, real-time) | yes (per channel toggle) | unverified | unverified |
| Multi-brand / multi-product voices | yes ("departmental brand voice profiles" on Enterprise) | yes (multiple Brand Voice profiles, admin sets default) | unverified | unverified | yes (up to 50 style guides per org) | unverified | unverified | unverified | unverified |
| Style guide enforcement | yes (Knowledge Graph + guardrails) | yes (Style Guide, Business plan+) | partial | yes (banned-term replacement) | yes (Style Guides, Pro/Enterprise) | yes (core product) | unverified | unverified | unverified |
| Templates | yes (100+ prebuilt agents) | yes | yes | yes | no (not a generation tool) | no | yes | yes | unverified |
| Long-form generation | yes | yes | yes | partial (leans short-form/ads) | no | no (checks, doesn't generate) | yes | partial | unverified |
| Repurposing (one input, many outputs) | yes (Playbooks) | yes | yes | unverified | no | no | unverified | unverified | unverified |
| Tone adjustment on existing text | yes | yes | yes | yes | yes (core feature) | yes (core feature) | unverified | unverified | unverified |
| Scoring / grading of output | unverified | unverified | unverified | yes (Performance Boost predictive score) | yes (tone alignment feedback) | yes (clarity/style scores) | unverified | no | unverified |
| Brand-compliance checking | yes (guardrails) | partial (Style Guide auto-apply) | unverified | yes (banned terms) | yes (brand tone alignment) | yes (core product) | unverified | unverified | unverified |
| Learning from edits | unverified - no evidence found | unverified - no evidence found | unverified - no evidence found | unverified - no evidence found | unverified - no evidence found | unverified - no evidence found | unverified | unverified | unverified |
| Approval / review workflow | yes (Enterprise) | unverified | unverified | unverified | unverified | unverified | yes | unverified | unverified |
| Collaboration | yes (Lite seats) | yes | partial (G2 reviewers flag as limited) | unverified | yes | unverified | yes | yes | unverified |
| Version history | unverified | unverified | unverified | unverified | unverified | unverified | unverified | unverified | unverified |
| Integrations | yes (unrestricted on Enterprise) | yes | unverified | unverified | yes | yes (50+ authoring tools) | yes (native, it's a CRM) | unverified | yes |
| API | yes | unverified | unverified | unverified | unverified | unverified | yes | unverified | yes |
| MCP server | unverified - not found in search | unverified - not found in search | unverified - not found in search | unverified - not found in search | unverified | unverified | unverified | unverified | unverified |
| Browser extension | unverified | unverified | unverified | unverified | yes (Grammarly's core product surface) | unverified | unverified | unverified | unverified |
| Slack / Teams | unverified | unverified | unverified | unverified | unverified | unverified | unverified | unverified | unverified |
| CMS publishing | unverified | unverified | unverified | unverified | no | unverified | yes (native) | unverified | yes (native, it's ESP) |
| Analytics / performance feedback | unverified | unverified | unverified | yes (2B+ data point performance model) | unverified | unverified | yes | unverified | yes |
| SEO features | unverified | yes | unverified | unverified | no | no | yes | no | unverified |
| Image generation | unverified | unverified | unverified | no | no | no | unverified | yes (core product) | unverified |
| Fact checking / citations | unverified | unverified | unverified | unverified | unverified | unverified | unverified | unverified | unverified |
| Plagiarism / AI detection | yes (separate AI detector product) | unverified | no - reviewers warn of plagiarism risk | unverified | unverified | unverified | unverified | unverified | unverified |
| Localisation | unverified | unverified | unverified | unverified | unverified | unverified | unverified | unverified | unverified |
| Compliance guardrails | yes (HIPAA BAA, SOC 2, finance/healthcare models) | unverified | unverified | unverified | unverified | unverified | unverified | unverified | unverified |
| Data / privacy posture | SOC 2 Type II, HIPAA BAA on Enterprise | unverified | unverified | unverified | unverified | unverified | unverified | unverified | unverified |
| Export / lock-in | unverified - no evidence of exporting the "Personality profile" itself | unverified - no evidence of exporting the "voice excerpt" | unverified | unverified | unverified | unverified | unverified | unverified | unverified |

## Notes on "partial" and "unverified" cells

- **Grammarly Business - brand voice definition:** marked partial. Brand Tones is built from
  picking sample phrases that match a desired tone (a guided selection, not free-text voice
  description), producing a "recommended tone profile." This is closer to tone sliders than
  to a full brand-voice engine like Jasper's or Copy.ai's. Source: [Grammarly Business - Set
  brand tones](https://support.grammarly.com/hc/en-us/articles/4403544890253), checked
  2026-08-12.
- **Acrolinx - brand voice definition:** marked partial deliberately. Acrolinx is a writing
  *governance* and compliance checker embedded in existing authoring tools, not a generator.
  It checks terminology, clarity, and tone against rules you define; it does not write
  content for you. Source: [Acrolinx - What is Content
  Governance](https://www.acrolinx.com/what-is-content-governance/), checked 2026-08-12.
- **"Learning from edits" is unverified across every product checked.** This is the single
  most consequential empty row in this matrix - see `prior-art.md` Part E and the "Does our
  idea already exist?" section.
- **"MCP server" returned no hits for any product searched.** Worth treating as a real signal,
  not just an artifact of search terms - see prior-art.md's closing sections.
- Learning from edits, version history, and export/lock-in are unverified for nearly every
  row. That is itself the finding - none of these products' marketing or documentation
  volunteers this information, which suggests either it doesn't exist or it isn't considered
  a selling point. Both are worth knowing.
