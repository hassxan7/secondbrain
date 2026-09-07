---
title: "Form Filler"
aliases: ["Form Filler"]
type: analysis
tags: [apps, outreach, applications]
created: 2026-09-07
updated: 2026-09-07
sources: 0
status: spec
---

# Form Filler

**Status: spec only — not built yet.**

Given a URL to an application form (accelerator, grant, competition, pitch
comp, partner programme), draft every answer from what the vault already
knows about Civly, and hand back a reviewable draft.

The whole reason this belongs *inside* the vault: the answers already exist.
Every accelerator asks the same eight questions, and this vault has each
answer written and argued somewhere. The app's job is retrieval and fitting,
not invention.

---

## Flow

```
URL
 └─ 1. fetch      → render the form, extract every field
 └─ 2. classify   → question type + word/char limit per field
 └─ 3. retrieve   → map each question to vault sources (table below)
 └─ 4. draft      → answer within the limit, in Civly's voice
 └─ 5. review     → write strategy/applications/<org>-<date>.md
 └─ 6. fill       → human approves, then type into the live form
        ■ NEVER auto-submit. The human clicks submit. ■
```

Steps 1 and 6 use the browser tools. Step 6 stops at the submit button every
time — an application sent with a wrong answer cannot be recalled.

---

## Answer bank — where each question type gets sourced

| Question the form asks | Vault source |
|---|---|
| What does the company do? | [[Civly - Overview and Status]], [[Pitch Copy Library]] |
| What's the problem? | [[Civly Direction — Drafting-First Pivot (Jun 2026)]] |
| Why now / why you? | [[Civly Startup Script]], [[Civly - People]] |
| Product & tech, architecture | [[Civly - Product and Tech]], [[Civly Architecture Reference]], [[Software Architecture]] |
| Traction, revenue, users | [[Civly - Traction and Funding]] |
| Market size, ICP, competition | [[Archilabs]], [[Finch]], [[Snaptrude]], [[Sales Ladders by Person Type]] |
| Team, founders, roles | [[Civly - People]], [[Hassaan Shamshiri]], [[Yash]] |
| Moat / defensibility | [[Data Partnership Moat]], [[Data Partnership Outreach Strategy]] |
| Roadmap, use of funds | [[Technical Roadmap — What to Build First]] |
| Risks, open questions | [[Civly - Messaging Rules and Open Questions]], [[Data & Credibility — Core Problem & Open Decisions (SF, 14 Jul)]] |

Tone and the do-not-say list come from [[Civly - Messaging Rules and Open Questions]].
Claims about what is shipped must match [[Civly - Overview and Status]] — the
MEP-not-shipped distinction in `CLAUDE.md` matters here. Do not let a form
answer claim MEP ships today.

---

## Output

One file per application at `strategy/applications/<org>-<YYYY-MM-DD>.md`:

```markdown
---
title: "<Org> Application — <Programme>"
type: analysis
tags: [application, <org>]
url: "<form URL>"
deadline: YYYY-MM-DD
status: draft | submitted | rejected | accepted
---

## Q1. <question text>  *(limit: 200 words)*
<drafted answer>
**Sources:** [[page]], [[page]]
**Confidence:** high | needs-a-human
```

Marking low-confidence answers is the point. An answer the vault can't
support should say so loudly, not be smoothed over.

---

## To build

- [ ] Field extraction — Typeform, Google Forms, Airtable, plain HTML all differ
- [ ] Word/char limit detection and enforcement
- [ ] Retrieval over the answer bank above
- [ ] Draft writer that respects [[Civly - Messaging Rules and Open Questions]]
- [ ] `strategy/applications/` writer
- [ ] Browser fill step, hard-stopped before submit
- [ ] Reuse log — which answers got used where, so repeats stay consistent

## Open Questions

- Which form platforms actually matter first? (Which programmes are you applying to?)
- Should past submitted applications become a retrieval source for later ones?
- Does this share the outreach engine's MCP server, or stand alone?

## Related

[[Apps Registry]] · [[Pitch Copy Library]] · [[PFC Pitch — Deck, Scripts & Prompts]]
