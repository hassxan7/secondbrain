---
title: "Architect Call — Design Process, Polycam & Drafting Automation (Sep 2026)"
type: source
tags: [call, architect, drafting, polycam, scan-to-bim, space-planning, ncc, rhino, offshore-drafting]
channel: "Founder interview (Yash + Hassaan)"
published: 2026-09-15
created: 2026-09-15
updated: 2026-09-15
sources: 1
---

## TL;DR
A practising Sydney architect (residential renovations + developer apartment work; Mirvac / New Sydney Fish Market on his CV) walked through his whole process end to end. The repeated, automatable unit of work is **generating and re-checking 2–3 layout options per project** — each a full 3D Revit model, each re-verified by eye against dimensional and NCC rules he holds in his head. He scans existing spaces with **Polycam** and notes that Polycam will sell him a Revit model for ~US$100, which he believes is fulfilled by offshore human drafters, not AI. He offered to be a pilot.

## Key Claims / Techniques
- **The errors that matter are code errors, not clashes.** "You need to be more than six metres away from an apartment entry door to a fire stair." The NCC is ~900 pages over 3 volumes; nobody holds it all.
- **Option generation is the repetitive work.** Three options differentiated by extent of demolition; each is a separate full 3D Revit model; the cheapest option must still deliver most of the brief.
- **Space planning is measurable, and he wants it measured.** Kitchen-to-bench distance, couch spacing, dining-chair clearance, "can I fit a new stair" — *"I can tell if it works by looking at it, but you could just measure the distances... you just want to test every time you change it."*
- **Apartment typologies are categorised like car trim levels** — 3-bed → double sink + bathtub always; 2-bed → 1.5 sink, bathtub if it fits; 1-bed → single sink. Applying a resolved room across a whole floor plate of slightly different layouts is **entirely manual**: *"There's no way to do it in Revit. It's not automated."*
- **But every site is unique** (area, boundary angles, elevation, soil, orientation), which is why copy-paste across projects fails — *"every building is bespoke, in the truest sense of the word."*
- **Pre-concept / envelope generation** (proving a buildable yield before site acquisition) is a whole job done in Revit and is an obvious automation target.
- **Polycam:** used as reference for existing conditions; wobbly geometry is acceptable because it's only reference. The paid Revit-model conversion (~US$100) is probably offshore human drafting. A phone scan is ~70% of survey grade; ~95% is claimed reachable with a cheap phone attachment. Limitation: the scan covers only the inside of the unit, so drainage/structure behind walls and below floors stays unknown.
- **Offshore drafting fails on code knowledge, time zones, and print culture.** Reading comprehension and error detection are far better on paper; firms that never print miss gross errors — *"the title of the drawing is not on the sheet", "half the drawing is missing"*. QA across the industry: *"way too many errors. Every single firm."*
- **Grad-architect loop:** principal holds a near-complete model in his head (chess-pattern compression), grad models it in Revit, returns it, gaps appear, refine, repeat. Drafting a stage of a substantial project ≈ one week to one month.
- **Design time varies 10×** by firm culture: a design-led practice may spend 6 months and compare ten 3D options a thousand times in Enscape; a volume practice does a house DA in 2–3 weeks from the owner's sketch.
- **Tooling:** Revit + Enscape; **Grasshopper** alive, **Dynamo** dead ("haven't heard of people using Dynamo in eight years"); **Rhino.Inside.Revit** runs all of Rhino inside Revit — a possible expansion surface. Proposals still laid out by hand in InDesign.
- **Deliberate under-polish at sketch stage:** architects avoid showing 3D models early (clients assume everything is resolved) and historically traced over prints to make output look hand-drawn — partly to preserve the perceived value jump, and the fee, at the next stage.
- **Explicitly not wanted:** automating flammable-cladding replacement. *"That's super simple — flam comes off, non-flam goes on."* Corrects the assumption Boris raised.
- **Accepted our MEP framing:** routing as a multi-target graph/A* problem ("Google Maps, but hitting every room, supply and return") — *"now I actually understand that the laying out is a graph problem."* Chip-design/EDA analogy landed; he agreed architecture is ~a year behind the same shift, and said he started his business partly because he saw it coming.

## Civly Relevance
**Score: HIGH**

Three directly implementable things. **(1)** A deterministic **clearance / space-planning checker** that re-tests a layout on every change is exactly our L2 shape (`rules/` + `calcs/`), and he asked for it unprompted — this became Task 5 in [[Intern Onboarding & Task Menu — Aadi Jain]]. **(2)** A **free scan → floor plan → model** path attacks a product Polycam already charges ~US$100 for, and we already own the back half (floor plan → Revit image processor) — Task 1. **(3)** Confirmation that **option variation across a floor plate** is the unit of repeated manual work, which sharpens the pitch away from "we draft faster" toward "we re-test every variant instantly". Two cautions land as well: he does **not** want everything automated (cladding), and **speed can threaten the billing model** — the architect quoted in the call who said *"we still have to tell our clients it's taking this much time... we don't make enough money"* is a pricing objection we have now heard twice.

## Concepts Mentioned
[[BIM Drafting vs Coordination]] · [[Level of Development (LOD)]] · [[Data Partnership Moat]] · [[MEP Drafting — Schematic to LOD 200]]

## Entities Mentioned
[[Michael Westerlund]] (referenced — same envelope pain) · [[Yash]] · [[Hassaan Shamshiri]] · Mirvac · New Sydney Fish Market · Polycam · Revit · Enscape · Grasshopper · Rhino.Inside.Revit · NCC 2022

## What Changed in the Wiki
- Created this source page and `processed/Architect Call — Design Process, Polycam & Drafting Automation (Sep 2026).md` (notes + full transcript).
- Created [[Intern Onboarding & Task Menu — Aadi Jain]] — Tasks 1 and 5 derive directly from this call.
- Created [[Aadi Jain]] in CRM.

## Notable Quotes
- "I can tell if it works by looking at it, but... you could just measure the distances. You just want to test every time you change it." — Architect (2026)
- "You need to be more than six metres away from an apartment entry door to a fire stair. That's a rule." — Architect (2026)
- "They offer you a Revit model, but you have to pay for it — like a hundred bucks. I reckon they get draftspeople in India to do it. It's not AI." — Architect, on Polycam (2026)
- "Wow, there's no way to do it in Revit. It's not automated." — Architect, on repeating a resolved room across a floor plate (2026)
- "Drafting mistakes times like 100 when you're just looking at a screen." — Architect, on why offshore drafting without printing fails (2026)
- "Every building is bespoke. In the truest sense of the word bespoke, it is bespoke." — Architect (2026)
- "I haven't heard of people using Dynamo in eight years." — Architect (2026)
- "Okay, but we still have to tell our clients it's taking this much time... we don't make enough money." — an architect shown the Civly demo, relayed in this call (2026)

## Open Questions
- Will he share a real project pair (his Polycam scan + the Revit model he built from it)? That's a golden pair we could get without a firm-level NDA.
- Which of his steps does he most want built first — the clearance checker, or scan → model? Ask directly at the pilot kickoff.
- What is the "cheap phone attachment" path to ~95% survey accuracy, concretely, and what does it cost?
- How do we answer the billing-model objection (speed erodes hourly fees) in the pitch?
- He offered to walk through the remaining ~"98%" of his process another time — book the follow-up.
