---
title: "Level of Development (LOD)"
type: concept
tags: [bim, lod, drafting, scope, civly-core]
created: 2026-06-18
updated: 2026-06-18
sources: 1
---

## Definition
**Level of Development (LOD)** describes how complete and reliable a BIM element is — from a rough placeholder to a fully detailed, as-built object. It defines *who does what, when* in the BIM chain and pins down exactly where Civly plays.

Source: [[BIM Mentor Call — Drafting vs Coordination & Data Moat]] (16 Jun 2026).

## The ladder (as described by the BIM mentor)

| LOD | Meaning | Who produces it |
|---|---|---|
| **Brief / 0** | Design intent — sketch, spatial diagram, schematic | Architect / MEP engineer |
| **100** | Conceptual / first routed draft; sizes approximate | (Civly's target) |
| **200** | Consultant deliverable; generic elements placed, **ducts not split, units not final, no connection details** | MEP consultant |
| **300 / 350** | Subcontractor model; correct units, split ducts, construction details, accurate for commissioning | Subcontractor |
| **400** | Fully detailed / fabrication-ready | Subcontractor |
| **500** | As-built (can be done manually for small changes) | Subcontractor / site |

## Where Civly plays
**Civly's window is brief/LOD 0 → LOD ~100–200 (≈250).** It generates the first routed draft from design intent / schematics and hands off; subcontractors push it to 300+. Everything from 200→300 (unit selection, construction detailing, optimal duct splitting, ordered dimensioning) is a **future, data-dependent** scope — explicitly out of scope for now.

## Why the LOD framing matters for Civly
- **Error tolerance scales with LOD.** At LOD 0→200 (Civly's window) rough sizes and even clashes are tolerable — the subcontractor remodels anyway. Precision becomes critical only at 300+ (commissioning, airflow). So Civly's first drafts **don't need to be perfect to be useful**.
- **It de-risks the pitch.** "We take you from brief to LOD 200" is a bounded, credible claim; "end-to-end BIM" is too broad (the mentor warned against boiling the ocean).
- **It defines the handoff.** Civly's output must be a LOD ~200 model a subcontractor will *accept as a starting point* rather than rebuild from scratch — an open design question.

## Why consultants stop at LOD 200
Consultants deliberately omit construction details and final unit selection: changing units later forces a redo, so they leave it for the subcontractor, who re-selects units (often cheaper), re-sizes ducts for commissioning, swaps in their own families, and adds details — effectively remodelling. This is why **mechanical subcontractors carry the most drafters**.

## Open Questions
- Is the AU/NZ industry using the AIA LOD framework, the UK "LOD/LOI" split, or informal shorthand? Confirm the exact numbering customers expect.
- What is the minimum LOD 200 quality bar for a subcontractor to build on Civly's output instead of remodelling?

## Related
[[BIM Mentor Call — Drafting vs Coordination & Data Moat]] · [[BIM Drafting vs Coordination]] · [[MEP Drafting — Schematic to LOD 200]] · [[Civly Architecture Reference]]
