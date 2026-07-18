---
title: "BIM Drafting vs Coordination"
type: concept
tags: [bim, drafting, coordination, scope, strategy, civly-core]
created: 2026-06-18
updated: 2026-06-18
sources: 1
---

## Definition
Two distinct activities in the BIM production chain that Civly must not conflate:

- **BIM drafting (modelling):** turning design intent / schematics into a BIM model. The tedious, monotonous, labour-intensive work done by **drafters** ("architectural/MEP technicians"). Sits **early** in the chain. This is **Civly's wedge**.
- **BIM coordination:** running clash detection (Navisworks/ACC), assigning each clash to the right discipline, triaging major vs minor vs side-coordinated. Done by a **BIM coordinator/manager**. Sits **later**. A **separate business** Civly is deferring.

Source: [[BIM Mentor Call — Drafting vs Coordination & Data Moat]] (16 Jun 2026).

## Why it matters
Civly's earlier framing ("coordination is annoying, we fix coordination") aimed at the wrong scope. The mentor reframed it sharply:

| | **Drafting (Civly's target)** | **Coordination (defer)** |
|---|---|---|
| Position in chain | Early — design intent → model | Late — models → clash resolution |
| Who does it | Drafters (3–4/firm; mechanical 5–10) | One coordinator/manager per firm |
| Economic value of automating | **High** — fire 3–4 drafters, keep 1 vibe-coder → save **$300–400k/yr** | Lower — coordinator is a facilitator still needed for final checks |
| Data needed to automate | Input CAD + output BIM pairs (collectable) | **Hundreds of thousands of labelled clashes** (much harder) |
| Tool today | Revit/Archicad (manual modelling) | Navisworks (manual filters + assignment) |

**The economic argument is the crux:** there are far more drafters than coordinators, so displacing drafting labour is where firms will pay. Coordination automation is a possible *later* scope once data and credibility exist.

## Why Navisworks doesn't already solve coordination
Navisworks makes the human do the judgement: create clash-test filters, assign each clash to a person, decide severity. Example — a hydraulics × mechanical clash test is split into drainage (gravity, sloped → mechanical) vs pressurised hot/cold (→ hydraulics); the coordinator still sets this up and triages. Automating *that decision* would need a huge labelled-clash dataset — hence deferred.

## Civly's stance
- **Build:** drafting automation, design phase, [[Level of Development (LOD)|LOD]] 0 → ~200, MEP via [[MEP Drafting — Schematic to LOD 200|schematic → model]].
- **Defer:** coordination/clash-assignment automation; construction-phase detailing.
- **Never:** hold design liability — a qualified human (architect/engineer) signs off. See liability note in the source.

## Critiques / nuance
- A coordinator is still required even with perfect drafting — Civly's output feeds *into* the coordination process (ACC/Navisworks), it doesn't replace it. Civly "sits on top of ACC, not against it" — consistent with [[Civly - Messaging Rules and Open Questions]].
- The mentor is one (well-informed) data point; validate the drafting-first thesis by calling many MEP consultancies (see [[Data Partnership Moat]] and [[To-Do — Hassaan]]).

## Open Questions
- Does the drafting product need *any* coordination awareness (e.g. avoid obvious clashes during routing) to be accepted, or is "rough draft, subcontractor fixes it" enough?
- At what point (and with what data) does coordination automation become a viable second product?

## Related
[[BIM Mentor Call — Drafting vs Coordination & Data Moat]] · [[Level of Development (LOD)]] · [[MEP Coordination Requirements]] · [[Navisworks]] · [[Civly Direction — Drafting-First Pivot (Jun 2026)]]
