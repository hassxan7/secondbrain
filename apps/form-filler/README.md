---
title: "Form Filler"
aliases: ["Form Filler"]
type: analysis
tags: [apps, outreach, applications, forms]
created: 2026-09-07
updated: 2026-09-08
sources: 4
status: runbook
---

# Form Filler

**Give it a URL. Get back a filled form and a draft you can edit.**

Every accelerator, grant and pitch competition asks the same eight questions. This vault
already contains every answer, argued and evidenced. The job is retrieval and fitting,
not invention, which is why this app lives inside the vault rather than beside it.

Mostly Airtable, sometimes Typeform, occasionally Google Forms or plain HTML.

---

## How to use it

Paste a form URL and say **"fill this"**. That is the whole interface.

```
fill this: https://airtable.com/appXXXX/pagXXXX/form
```

What happens:

1. **Read the form** in the browser. Extract every field: label, type, limit, required.
2. **Read the audience.** Forms state their own judging criteria (Startmate's asks for
   Problem, Validation, Traction, Team, and names its Spike Framework). Answer *that*,
   not a generic pitch.
3. **Draft every answer** from [answer-bank.md](answer-bank.md), in the voice defined by
   [voice.md](voice.md), inside the stated word limit.
4. **Run `/humaniser`** on each answer separately. Mandatory, never skipped.
5. **Check for em dashes.** Hard fail. Humanisers reintroduce them.
6. **Write the review file** to `strategy/applications/<org>-<YYYY-MM-DD>.md`.
7. **Fill the live form** in the browser, field by field.
8. **Stop at Submit.** Hand back to Hassaan with a list of what needs his eyes.

**Never submit.** An application sent with a wrong answer cannot be recalled. The final
click is always his.

---

## The rules, in priority order

1. **No em dashes.** Not one, anywhere, in any answer.
2. **`/humaniser` on every answer**, individually, before it is written down.
3. **Never submit, never upload a file, never enter a payment detail.** File uploads
   (pitch deck, logo, video link) are flagged for Hassaan, not attempted.
4. **Claims stay inside the guardrails** in [[Civly Architecture Reference]]. A form is a
   written record. "Works in Revit" needs a result file behind it.
5. **Numbers, not adjectives.** 78 architects, not "hundreds". 62 tools, not "many".
6. **Flag low confidence loudly.** An answer the vault cannot support says so in the
   review file. Never smooth over a gap.
7. **Fit the limit.** 100 words means 100 words. Trim by cutting clauses, not by
   compressing into an em dash.

---

## Answering *what the audience wants*

Read the form's own framing before drafting. It usually tells you exactly what it scores.

| signal in the form | what it means for the draft |
|---|---|
| Judging criteria listed | Mirror those headings in the answers, in that order |
| "Validation" as a criterion | Lead with 78 architects and Michael, not with the product |
| "Traction / rate of progress" | Emphasise **four months**. Speed is the story |
| "Founder / team" | Founder-problem fit: dad's construction company, Yash's ML at Anthrobyte |
| A named framework (e.g. Startmate's Spike) | Look it up, pick a spike, say it explicitly |
| Word limit under 50 | Cut to one claim plus one number. Nothing else fits |
| Deck or video required | Flag it. Do not attempt uploads |
| Investor audience | Lead with market and moat |
| Community or people's-choice audience | Lead with the human story. Avoid anything about AI replacing jobs |

---

## Output format

`strategy/applications/<org>-<YYYY-MM-DD>.md`

```markdown
---
title: "<Org> — <Programme>"
type: analysis
tags: [application, <org>]
url: "<form URL>"
deadline: YYYY-MM-DD
status: draft | filled-not-submitted | submitted | rejected | accepted
---

## Deadline & logistics
What is due, when, in what format, and what only Hassaan can supply.

## Q1. <question text>  *(limit: N words · N used)*
<answer>
**Sources:** [[page]], [[page]]
**Confidence:** 🟢 verified | 🟡 pitch claim | 🔴 needs a decision

## Needs Hassaan
- [ ] the specific things only he can do
```

Then update the row in [[Deliverables — Sep 2026]].

---

## Which browser — this matters

There are two browsers available and **only one of them is useful for this app.**

| | |
|---|---|
| `claude-in-chrome` | **Use this.** Your real Chrome, with your logged-in sessions. What it fills is in the browser you will submit from. |
| The in-app browser pane | A separate browser. Fine for *reading* a form to extract fields. **Anything typed into it is invisible to you** — you would open the form in Chrome and find it empty. |

So the flow is: read the form in either browser, draft and write the review file, then
**fill through `claude-in-chrome`** so the filled form is sitting in front of you, ready
to check and submit.

Learned the hard way on 8 Sep 2026: the Startmate form was filled in the in-app pane, and
those keystrokes went nowhere useful. The drafted answers in
`strategy/applications/` are the durable artefact. The browser fill is a convenience on
top of it, and it has to happen in the right browser.

The in-app pane is also cramped (roughly 400x225 usable) and sites throw cookie banners
into it, which makes clicking radio buttons and multi-selects unreliable. Another reason
the real Chrome is the right surface.

## Platform notes

**Airtable** (`airtable.com/app*/pag*/form`) — a React SPA. `get_page_text` reads the
whole form including its preamble and judging criteria, which is where the audience
signal lives. Fields are addressable with `find` by label, then `form_input` by ref.
Selects render as clickable options, not `<select>` elements. File uploads are a
drop-zone; do not attempt them.

**Typeform** — one question per screen. Read, answer, advance, repeat. There is no full
page to extract, so walk it and record as you go. Watch for the logic jumps.

**Google Forms** — closest to plain HTML; the easiest case.

**Plain HTML** — read the DOM, fill by ref.

---

## What only Hassaan can do

The app stops and lists these rather than guessing:

- Uploading the pitch deck (PDF), logo, or any file
- Recording and linking a pitch video
- Anything marked 🔴 in [answer-bank.md](answer-bank.md): the exit figure, the LOI count,
  the number of beta firms, any TAM
- Choosing a location, date, or cohort preference
- Consenting to terms, and pressing Submit

---

## Files

| file | what it holds |
|---|---|
| [voice.md](voice.md) | How Hassaan writes. The em-dash ban and the banned register |
| [answer-bank.md](answer-bank.md) | Canonical answers at three lengths, with confidence marks |
| `README.md` | This runbook |

Output goes to `strategy/applications/`. Nothing is stored in this folder.

---

## Backlog

Live applications waiting, from [[Deliverables — Sep 2026]]:

- [ ] **Startmate Pitch Night** — due **22 Sep 12pm AEST**. Drafted:
      [[Startmate Pitch Night — 2026-09-08]]
- [ ] Startmate Launch Club (free now)
- [ ] UNSW 10x · UNSW Plug and Play · NVIDIA Inception
- [ ] Sydney Genesis · Galactic Horizon (decide in or out)

## Open Questions

- Should submitted applications become a retrieval source for later ones? (Probably yes,
  once there are three or four.)
- Is there a per-funder tailoring layer worth keeping, like [[Pitch Copy Library]] has?

## Related

[[Apps Registry]] · [[Hassaan Voice Guide]] · [[Form Filler Answer Bank]] ·
[[Pitch Copy Library]] · [[Deliverables — Sep 2026]]
