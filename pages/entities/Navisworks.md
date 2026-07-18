---
title: "Navisworks"
type: entity
tags: [tool, autodesk, coordination, clash-detection, bim]
created: 2026-06-18
updated: 2026-06-18
sources: 1
---

## Summary
Autodesk **Navisworks** is the industry-standard tool for **BIM coordination / clash detection** — aggregating multi-discipline models and finding where elements collide. It sits **downstream** of where Civly plays (drafting). Civly is **not** a Navisworks competitor; its LOD-200 output feeds *into* the coordination process (ACC/Navisworks), not against it.

## Key facts
- Used to run **clash tests** between disciplines (e.g. hydraulics vs mechanical) inside the ceiling/services space.
- The coordinator must **manually**: build the clash-test filters, **assign each clash** to the right discipline, and triage **major vs minor vs side-coordinated**.
- That manual judgement is *why Navisworks doesn't "just solve" coordination* — and why automating it would need **hundreds of thousands of labelled clashes**. Hence Civly defers coordination. See [[BIM Drafting vs Coordination]].
- Typical assignment logic (per [[BIM Mentor Call — Drafting vs Coordination & Data Moat]]): gravity/sloped systems (drainage) → mechanical; pressurised hot/cold water → hydraulics.
- Often paired with **Autodesk ACC / BIM 360** (common data environment, ~weekly model sync, quantity takeoff).

## Relevance to Civly
- **MEDIUM** — defines the boundary of Civly's scope. Civly outputs a coordinated *draft*; clash resolution happens later in Navisworks/ACC. Knowing this keeps messaging right ("we sit on top of ACC, not against it" — [[Civly - Messaging Rules and Open Questions]]).
- A future, data-dependent Civly scope (clash-assignment automation) would compete more directly here. Not now.

## Appearances in sources
- [[BIM Mentor Call — Drafting vs Coordination & Data Moat]] (16 Jun 2026) — the drafting-vs-coordination distinction.
- [[How to Learn the BIM Coordination Skillset]] — Navisworks as the coordinator's core tool.

## Open Questions
- What exactly would an AI need to learn to auto-assign clashes, and how much labelled data? (Defer.)
- Does Civly's IFC output import cleanly into Navisworks/ACC for the coordination step?

## Related
[[BIM Drafting vs Coordination]] · [[MEP Coordination Requirements]] · [[How to Learn the BIM Coordination Skillset]] · [[Civly Architecture Reference]]
