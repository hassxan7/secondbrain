---
title: "Data Partnership Moat"
type: concept
tags: [strategy, moat, data, ml, gtm, partnerships, civly-core]
created: 2026-06-18
updated: 2026-06-18
sources: 1
---

## Definition
Civly's durable competitive advantage is **proprietary training data** — paired **input CAD/schematics + output BIM models** harvested from real MEP consultancies and drafting firms, used to train the ML model that drafts BIM. Without it, Civly's drafting automation is replicable; with it, Civly can do something Autodesk's generic tooling can't.

Source: [[BIM Mentor Call — Drafting vs Coordination & Data Moat]] (16 Jun 2026). This is the founders' stated **#1 strategic priority** ("the whole point of it all").

## Why it matters (the thesis)
- The drafting-automation idea isn't secret; **Autodesk could build it.** Code and prompts aren't a moat.
- What's hard to copy is a large corpus of **real input→output BIM pairs** showing *how BIM actually gets drafted* across many firms and project types.
- With ~**100,000+ file pairs**, Civly can train a model to go from schematic/design intent → LOD ~200 model reliably. *"There's no way we put this out unless it's accurate."*

## The acquisition strategy
1. **Build a target list** — spreadsheet every MEP consultancy (and BIM drafting/architectural draftsperson firm) in Australia.
2. **Pitch a data partnership** — give us your input CAD + output Revit/BIM models to train on; in return get the product **free for a period / at a discount**, plus early access.
3. **Sign agreements** — NDAs that address the real fear (**IP leakage**: their Revit families/templates reaching competitors), with "training only, never shared" terms.
4. **Scale** — aim for ~200 firms → enough pairs to train; ship only once accurate.

> *"It's just payoff and risk. Minimise the risk, show the payoff, and a lot of people will say yes."* — BIM mentor

## Why firms will share (and the objection handling)
- They **already hand models to subcontractors** at design→construction handoff, so model-sharing isn't taboo per se.
- Real objection = **intellectual property** (proprietary families, templates, detailing standards), not generic confidentiality.
- Mitigation: NDA + training-only clause + concrete payoff ("design 10× faster; a year out, run 1 drafter instead of 5 and save $X"). Position Civly as the AI play no one else in their industry is offering.
- Some will refuse or demand strict agreements — accept it and move on; enough will say yes.

## How this reframes funding
- Part of the funding ask was to **buy data**. The mentor's view: you may not need to *buy* it — **partnerships** can supply it in exchange for product access. Reframes the data-acquisition budget toward BD/outreach (NDAs, partnership ops) rather than purchasing datasets. Revisit the grant/funding narrative accordingly. See [[Civly - Traction and Funding]] and [[To-Do — Hassaan]].

## Risks / open questions
- **Data quality & consistency:** are AU MEP schematics/models consistent enough (layer conventions, family standards) to train on without heavy cleaning? See [[MEP Drafting — Schematic to LOD 200]].
- **Cold-start:** how many pairs before the model is good enough to demo? Need *some* output before firms will partner, but need partners to get data — sequencing problem. Early example files (the mentor offered some) help bootstrap.
- **Legal:** can training-only NDAs realistically be honoured and signed at volume? Who owns the trained model's outputs?
- **Defensibility horizon:** how long does the data lead hold before Autodesk or a competitor accumulates comparable data?
- **Ownership framing:** founders want data they **own** — confirm partnership terms grant a perpetual training licence, not just temporary access.

## Related
[[BIM Mentor Call — Drafting vs Coordination & Data Moat]] · [[BIM Drafting vs Coordination]] · [[Civly Direction — Drafting-First Pivot (Jun 2026)]] · [[To-Do — Hassaan]] · [[To-Do — Yash]]
