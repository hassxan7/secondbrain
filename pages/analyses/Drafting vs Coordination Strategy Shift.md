---
title: "Drafting vs Coordination Strategy Shift"
type: analysis
tags: [strategy, drafting, coordination, positioning, hesh, reuben, go-to-market]
created: 2026-07-17
updated: 2026-07-17
sources: 2
---

The core product dilemma after talking to industry operators ([[Hesh Dian]], [[Reuben]]): they push **BIM coordination** as the high-value skill and market. Civly's sharper read is to **shift the wedge from coordination to drafting** — generate the first credible BIM draft, and stay out of the clash-detection / Navisworks / ACC coordination war.

## Question / Prompt

Hesh and Reuben recommended leaning into coordination. Why is Civly instead shifting to drafting — and what does that change in product, messaging, and competitive stance?

## Methodology

- Industry advice from [[Hesh Dian]] (BIM Accelerator public teaching + operator worldview) and [[Reuben]] (practitioner conversation)
- Existing Civly positioning rules in [[Civly - Messaging Rules and Open Questions]]
- Product reality in [[Civly Architecture Reference]] and [[Civly - Product and Tech]]
- Competitive boundary already stated: do not compete with ACC / Navisworks on clash detection ([[Civly - Overview and Status]])

## Findings

### What Hesh and Reuben recommended (coordination)

Both operators treat **coordination as the scarce, career-defining layer** of BIM work:

- **Hesh's thesis (public + teaching):** Revit modelling alone stalls careers; the unlock is the BIM coordinator skillset — Navisworks, multi-discipline clash workflows, services / plant room / facade / precast coordination. Market signal: people spend 5–7 years as modellers before crossing into coordination. See [[How to Learn the BIM Coordination Skillset]], [[How to Learn Revit and BIM Quickly]].
- **Reuben's thesis (conversation):** same industry gravity — value and pain sit in getting disciplines to fit together late; coordination is where firms feel the fire and where tools get budget.
- **Implication if Civly followed them literally:** position as an AI coordination / clash / multi-trade sync product; compete on the same board as Navisworks, ACC clash, and BIM coordinator labour.

That advice is directionally true about *where industry pain is felt*. It is the wrong wedge for *what Civly can uniquely own early*.

### The new understanding (shift to drafting)

Civly's updated strategy: **sell and build the draft, not the coordination suite.**

| Lens | Coordination wedge (old pull) | Drafting wedge (new stance) |
|------|-------------------------------|-----------------------------|
| Job to be done | Find and resolve clashes across trades | Produce a first editable, code-aware BIM draft from sketch / CAD / Rhino |
| Buyer moment | Mid/late design, already modelling | Early design / feasibility — before weeks of manual modelling |
| Competitive set | Navisworks, ACC clash, coordinator headcount | Manual draughting labour, slow Archicad/Revit setup, Archilabs-class generators |
| Civly strength today | Weak — no shipped clash platform; messaging forbids ACC competition | Strong — Tapir MCP + Archicad already produces arch + structural shell; MEP via `ifc_writer` path |
| Liability / principle | Temptation to "own" multi-trade decisions | Aligns with evaluate-don't-author ([[Civly - Design vs Engineering Decisions]]): draft is a comparison artifact |

Concrete implications already encoded in messaging:

- Frame as **"AI copilot for architects / fastest way to a BIM draft,"** not a **"coordination tool."**
- Do **not** compete with ACC on clash detection; Civly sits on top of that stack.
- Avoid "automatically generates a complete coordinated BIM" — too stacked, and it re-opens the coordination claim.

### How to reconcile expert advice without ignoring it

Coordination knowledge is still **load-bearing for generation quality** (see [[MEP Coordination Requirements]], [[Revit MEP Five-Discipline Coordination Model]]). The shift is about **GTM and product surface**, not about discarding coordination physics:

1. **Internal / engine:** keep learning coordination constraints so the *draft* comes out clash-aware.
2. **External / pitch:** lead with speed-to-draft and feasibility evaluation, not "we replace your coordinator."
3. **Roadmap:** coordination features (clash reports, assignment workflows) are later, if ever — and never the entry narrative.

> [!WARNING] Contradiction
> Expert operators ([[Hesh Dian]], [[Reuben]]) say the money and status are in coordination. Civly messaging says do not sell coordination. Both can be true: coordination is the industry's scar tissue; drafting is Civly's insertable wedge given current architecture and competitive map. Revisit if a design partner proves buyers will only pay for clash workflows first.

## Limitations

- Full call transcripts for Reuben (and any private Hesh conversation beyond public BIM Accelerator material) were not in the vault at write time. Public Hesh teaching is filed under [[How to Learn the BIM Coordination Skillset]] and [[How to Learn Revit and BIM Quickly]]. Drop private transcripts into `raw/` and re-ingest to tighten quotes.
- Reuben's full name, firm, and exact wording need confirmation on [[Reuben]].
- Architects-first vs engineers-first ICP remains an open messaging fork ([[Civly - Messaging Rules and Open Questions]]).

## Decision (working)

**Ship and sell drafting.** Use coordination expertise as generation quality, not as category claim. Keep the one-liner in the draft lane until product proof forces a revisit.

## Related pages

- [[Civly - Messaging Rules and Open Questions]]
- [[Civly - Design vs Engineering Decisions]]
- [[Civly - Overview and Status]]
- [[Civly Architecture Reference]]
- [[Hesh Dian]] · [[Reuben]]
- [[MEP Coordination Requirements]]
- [[How to Learn the BIM Coordination Skillset]]

## Open Questions

- When private Reuben / Hesh transcripts land, do any quotes force a harder product bet (e.g. buyers refuse drafts without clash UI)?
- Does "draft" language confuse architects who already hear "coordination" as the prestige problem — and if so, what demo sequence converts them?
- At what shipped capability (MEP routes? feasibility panel?) does coordination become an honest secondary claim without fighting ACC?
