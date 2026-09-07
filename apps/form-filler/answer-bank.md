---
title: "Form Filler Answer Bank"
aliases: ["Form Filler Answer Bank"]
type: analysis
tags: [apps, form-filler, pitch, applications]
created: 2026-09-08
updated: 2026-09-08
sources: 6
---

# Answer Bank

Canonical answers, already in [[Hassaan Voice Guide]]'s voice, at three lengths. Fit to
the form's limit, then run `/humaniser`, then hand to Hassaan.

**Every claim carries a confidence mark:**
🟢 verified · 🟡 stated in a pitch, not independently checked · 🔴 needs a decision or a source before use

**Currency:** written 8 Sep 2026. Re-check traction numbers before every submission.

---

## Identity block (fill without thinking)

| field | value |
|---|---|
| Startup name | **Civly** |
| Website | civly.dev |
| First / Last | Hassaan / Shamshiri |
| Co-founder | Yash Mittal |
| Email | civlyvibe@gmail.com *(confirm the right one per form)* |
| Location | Sydney, Australia |
| Stage | Pre-seed, pre-revenue, pilots in progress |
| Team size | 2 founders |
| Founded | ~May 2026 (4 months as of Sep) |
| Flagship model name | **Updraft** (chosen 2 Sep over "Draftmate") |

---

## One-liners

**Shortest (under 12 words)**
> Civly is the fastest way from a brief to a compliant 3D BIM model.

**Punchier, for a software-literate audience**
> Claude Code for BIM. Give it a sketch, get back a drafted, compliant model.

**Tagline**
> Stop Drafting. Start Designing.

🔴 *Do not use "Civly is the fastest way from sketch to 3D BIM Model" alone with a
non-AEC audience. Yash's objection stands: nobody outside the industry understands it.
Say "for architects" or "3D building" in general-audience forms.*

---

## Problem (three lengths)

**~25 words**
> Architects spend two thirds of their time drafting their designs instead of creating
> them. Sixty-eight percent of that is compliance, not design.

**~60 words**
> A software engineer writes one line and AI finishes the function. An architect draws one
> wall, then the next, for two months. Sixty-eight percent of that time isn't design, it's
> compliance. Two thousand hours a project, chasing code. We spoke to 78 architects to
> check we weren't imagining it, and every one of them described the same thing.

**~120 words, with the personal open**
> An architect almost made my dad go bankrupt. It was 2024. He runs a construction company
> and he took me to the biggest client pitch of his life. Three days out, the architect
> said the first draft wouldn't be ready. We walked in empty-handed.
>
> That is not one bad architect. Architects everywhere miss deadlines and lose bids for
> the same reason: turning a design into something buildable is still manual. A software
> engineer writes one line and AI finishes the function. An architect draws one wall, then
> the next, for two months. Sixty-eight percent of that time isn't design, it's
> compliance. We spoke to 78 architects to check, and every one described the same two
> thousand hours of chasing code.

🟡 *68% and 2,000 hours come from the pitch deck. 🔴 Find the source before a form that
will be diligenced. "$240,000 lost per project" appeared in the 2 Sep LinkedIn draft and
has no source in this vault. Do not use it until it does.*

---

## Solution

**~30 words**
> Give Civly a CAD file, a sketch or a Rhino model, and it returns a drafted BIM with the
> structure and MEP routed to the architect's original design. Then you edit it in plain
> English.

**~80 words**
> Give Civly a CAD file, a sketch or a Rhino model, and our agent returns a drafted BIM
> with structure and MEP routed to the architect's original design. Then you iterate in
> plain English: "make every window on this floor uniform." You can mass edit an existing
> file with a single prompt, and check an existing design against the building code
> instead of reading it line by line. We baked the National Construction Code into the
> engine, so compliance stops being the thing you do at the end.

🟡 *"LOD 250" is used in the pitch. It is a defensible claim for architecture and
structure. Do not attach it to MEP without saying schematic.*

---

## Why now / why us

> I grew up inside this problem. My dad runs a construction company and I watched a
> drafting delay nearly cost him the business. Yash built production ML for construction
> at Anthrobyte. I exited my last company at $1.6 million. Between us we know the workflow
> and we can build the thing, and we have been in this space full time for four months.

🟢 Anthrobyte, $1.6M exit. 🔴 *Reconcile the exit figure before a diligenced form. The
July to-do flags "AUD 1.6M revenue vs $1.2M exit" as unresolved. Pick one and be able to
defend it.*

---

## Product status, at three honesty levels

**For a pitch (accurate, not over-precise)**
> Civly runs today as a plugin on top of Revit. It has 62 tools covering read, create,
> modify, document and export, including a mechanical MEP tier that no other public Revit
> integration ships. It builds native, editable geometry that an engineer can drag, undo
> and check.

**For a technical reviewer**
> Civly is an MCP server plus a C# Revit plugin, forked from the open-source
> mcp-servers-for-revit monorepo, which had 29 tools and zero MEP commands. We are at 62.
> In a real Revit session we have built 38 of 38 ducts, 19 of 19 fittings and 19 of 19
> terminals connected, and modified 819 elements in a single undoable transaction. Our
> duct sizing agrees with Revit's own engine to rounding. Every write is a named
> transaction with a dry run and an approval gate.

**What we do not claim** 🟢 — copy this into any form that asks about limitations:
> Real-Revit verification covers about 9% of the tool surface. Reads, safety gates and
> rollback are proven there; most creation is proven against a contract harness, not a
> live model. Only Revit 2026 is verified. We lay out schematic supply, we do not design
> HVAC.

---

## Validation

> We spoke to 78 architects. I went to build expos as an outsider and interviewed
> architects on the floor. Michael Westerlund, the architect behind Quay Quarter Tower and
> the new Sydney Fish Market, is our design partner. Hesh, who teaches BIM coordination to
> 27,000 followers, started telling them about us unprompted. Engineers at Robert Bird,
> BVN and Gilcon have checked our workflow against how they actually work.

🟡 Robert Bird / BVN / Gilcon. 🟢 Michael, Hesh, 78 architects.

**The best single validation quote**, from the 30 Aug architect call:
> "Go and talk to 10 architecture firms and ask what the QA is like, how many drafting
> errors people make. It'll be way too many errors. Every single firm."

---

## Traction

> Four months in. Blackbird Giants and Arrayah. Finalists in the Peter Farrell Cup.
> A working product that builds real geometry in Revit, demoed to firms. Two signed
> letters of intent, five firms beta testing, and a pilot agreed with a practising Sydney
> architect who works on Mirvac and Sydney Fish Market projects.

🟡 *"Two LOIs" and "five firms beta-testing" are pitch claims. 🔴 Verify both before a
form that will be diligenced, and be ready to name them.*
🟢 The 30 Aug pilot agreement is real and recent. 🟢 PFC finals is real.

---

## Business model and pricing

> Studio licence at $2,000 per seat per month. That sounds high next to normal software
> until you see what a seat replaces: one Civly seat does the work of four to five
> drafters. Drafting labour on a typical $5 million project runs about $120,000, roughly
> $20,000 a month across a six-month job. We price at ten percent of the cost we remove.
>
> Before seed: five paid pilots and $10,000 MRR.

🟡 the unit economics. 🔴 *the $120k figure is a founder estimate, not sourced.*

**If asked "why not $30 a seat":** lead with the replacement ratio, never with the
absolute number. Sasha's warning (5 Aug) was that $2,000 reads as crazy against $30/month
SaaS unless you frame it against a team's cost.

---

## Moat / defensibility

> The code is not the moat. Anyone can wrap a modelling API. The moat is the data: matched
> pairs of an architect's input and the finished, coordinated model an engineer actually
> produced. We get those through data partnerships, and we use them to train the layer
> that decides where things go, not just how to place them.
>
> There is a real constraint we found early. We tested against Autodesk's own reference
> model and it contains genuine engineering errors, including a duct running at 66 times
> its friction target. Anything trained to imitate that data learns the faults. So we
> calculate everything physics decides, and only learn what practice decides.

🟢 The Snowdon finding is verified and it is the strongest technical answer in this bank.
Use it whenever a form asks about defensibility or technical depth. It shows judgment,
not just capability.

---

## Market

> Architecture and engineering drafting, starting with Australian practices. Every project
> passes through it, every firm pays for it, and most firms outsource it overseas because
> it is expensive and slow. The architects we talked to described the same thing
> independently: too many drafting errors, too much rework, no way to automate it.

🔴 *No TAM/SAM/SOM figure exists in this vault. If a form demands one, it needs to be
built, not invented.*

---

## Ask / what we need

Three ways to help, per the mentor's note (2 Sep). Adapt the third to the form's audience:

> 1. Introductions to architecture and engineering firms that draft BIM. We take it from there.
> 2. Data partnerships. If you know a practice sitting on past project files, that is the
>    single most valuable thing anyone can give us.
> 3. If you just want to follow along, the site is civly.dev.

---

## Risks and what could go wrong

> The hard part is not the software, it is trust. We are asking firms to share files they
> treat as their design identity, and we are two founders with four months of history. We
> know that. It is why we are doing this in the wrong order on purpose: build the deep
> relationship first, convert to a customer second. Michael and Hesh exist for exactly
> that reason.

🟢 This is Sasha's framing from 5 Aug and it is honest. Forms that ask about risk reward
this kind of answer.

---

## Vision (only after receipts)

> We are not replacing architects. We are giving them superpowers. Architecture became a
> field about compliance and manual drafting and arguing with your structural engineer. We
> would like to give it back to design.

---

## Do not say

Full list in [[Civly Architecture Reference]]. The ones that bite hardest in applications:

- ❌ "secure" · ❌ "your data never leaves your network"
- ❌ "works in Revit" without a result file · ❌ "supports Revit 2020 to 2027" (2026 only)
- ❌ "designs HVAC" (it lays out schematic supply, ~24% of as-built airflow)
- ❌ "no public Revit MCP has MEP commands" (falsified 4 Aug). Say: **no public Revit MCP
  ships a dedicated, documented MEP creation tier**
- ❌ "hundreds of architects" → **78**
- ❌ anything about AI replacing jobs. Sasha's warning: audiences are already scared of it,
  and the people's-choice vote punishes it

---

## Related

[[Form Filler]] · [[Hassaan Voice Guide]] · [[Pitch Copy Library]] ·
[[Civly Architecture Reference]] · [[Deliverables — Sep 2026]] ·
[[Civly - Messaging Rules and Open Questions]]
