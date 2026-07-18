---
title: "BIM Mentor Call — Drafting vs Coordination & Data Moat"
type: source
tags: [expert-interview, mep, drafting, coordination, lod, data-moat, strategy, gtm]
source_file: "processed/BIM Mentor Call — Drafting vs Coordination, LOD Scope, Data Moat.md"
participants: ["Hassaan", "Yash", "Hesh (BIM Accelerator — BIM coordinator/expert)"]
call_date: 2026-06-16
created: 2026-06-18
updated: 2026-07-14
sources: 1
---

## TL;DR
**Hesh** — the BIM Accelerator founder, a BIM coordinator / ex-MEP drafter — gives Civly its sharpest direction to date (16 Jun call). The actionable verdict: **attack BIM *drafting*, not coordination**; target the **design phase, LOD 0/brief → LOD 100–200**; take **MEP schematics (CAD) as the input**; the value is in **replacing drafters** (3–4 per firm at ~$100k each), not coordinators; **duct sizing is fully automatable** (no engineer intuition, just velocity/pressure-drop formulas); and the only durable moat is **proprietary training data** gathered via data partnerships with MEP consultancies. He also de-values live-cost tooling, settles the liability question, and offers ongoing advisory plus a UK MEP-modeller intro.

## Key Claims / Techniques
- **Drafting and coordination are two separate scopes.** Civly is a drafting/modelling tool (earlier in the chain); coordination (Navisworks clash assignment) is a different, data-hungry business — defer it.
- **Economics favour drafting:** far more drafters than coordinators; automating drafting takes a firm from 3–4 (mechanical: 5–10) drafters to 1 → saves $300–400k/yr. Coordinators are facilitators you still need a human for.
- **Real chain:** Client → Architect (holds liability) → Structural → MEP consultant → [design-phase coordination, ~1yr] → General Contractor → Subcontractors (mechanical/electrical/hydraulic/fire, separate firms) → [construction-phase coordination, remodel to higher LOD] → build. Usually **one** MEP consultancy, not 5.
- **Drafters = "architectural technicians"** — no design liability; the architect signs and is liable. → Civly keeps a mandatory human sign-off; never authors design, never holds liability.
- **LOD ladder:** brief/0 → 100 → 200 (consultant) → 300/350 (subcontractor) → 400 → 500 (as-built). **Civly's window: 0 → ~200.**
- **MEP input = schematics (CAD):** line diagrams with airflow + sizes ("500×500, 400 L/s into this room"). Read schematic → route + size duct → LOD 100–200.
- **Mechanical is hardest** (duct size steps down along the run via transitions as airflow drops); fire/hydraulics/electrical are easier.
- **Duct sizing is automatable:** drafters use "duct sizer" tools (flow + length → size) to target velocity & pressure drop; 4–5 subsystems sized differently (straight runs, kitchen exhaust, car-park). Pure formulas → Civly `calcs/` + `rules/`.
- **Live cost-per-change is low value:** fat construction margins; cost is minimised by drafting *principles* (transitions over double bends, fewer couplings, straight runs) = 80/20. ⚠️ Tension with prior roadmap item.
- **The moat is data:** spreadsheet every AU MEP consultancy → pitch a data partnership (free/discounted product for their input-CAD + output-BIM model pairs) → NDAs addressing IP-leakage fear → ~200 firms → ~100k+ file pairs → train ML model → ship only when accurate.
- **Validate by talking, not hiring:** call 500 MEP consultancies and ask "would you want this?"; don't hire one engineer for one sample. ICP = MEP consultancies.

## Civly Relevance
**Score: HIGH.** See full reasoning and the comprehensive study notes in the processed file. This call narrows the wedge (drafting, LOD 0→200), names the buyer (MEP consultancies) and input (MEP schematics/CAD), confirms the hardest sub-problem (duct sizing) is automatable into `calcs/`/`rules/`, settles liability (human signs off), and elevates the **data-partnership moat** to the company's central priority.

> [!note] Compared with the Reuben interview (14 Jul ingest)
> [[Reuben Roy Call — Competition Bids vs BIM Drafting]] does not disprove this MEP wedge. Reuben says Civly's current demo looks like an **engineering-consultant product**, but separately recommends a competition-bid product for architects. These are different MVPs. See [[Civly Target Dilemma — MEP Drafting vs Competition Bids]] for the decision and current-build implications.

> [!check] Resolved — live-cost / quantity-takeoff feature → ship to Michael, then wrap up
> The mentor says **real-time cost-per-edit doesn't matter** (fat margins; cost governed by drafting principles, not dollar optimisation), tensioning the existing live-cost to-do (pointed at by Michael + Disha's dad, a QS). **Decision (Hassaan, 18 Jun): ship it to Michael** (he asked for it in his iteration loop) **then wrap it up — no further investment.** A one-off BOQ/feasibility output is fine; don't build out live costing as a pillar. Sources: BIM Mentor Call (16 Jun 2026) vs [[Civly To-Do — Jun 2 to Jun 16]] + Michael (BOM insight, [[Civly - People]]).

## Concepts Mentioned
[[BIM Drafting vs Coordination]] · [[Level of Development (LOD)]] · [[Data Partnership Moat]] · [[MEP Drafting — Schematic to LOD 200]] · [[MEP Coordination Requirements]] · [[Civly Target Dilemma — MEP Drafting vs Competition Bids]]

## Entities Mentioned
[[Hesh]] · [[Michael Westerlund]] · [[Navisworks]]

## What Changed in the Wiki
- This source page + the processed notes file in `processed/`.
- New MEP page [[MEP Drafting — Schematic to LOD 200]]; concept pages [[BIM Drafting vs Coordination]], [[Level of Development (LOD)]], [[Data Partnership Moat]].
- New CRM page [[Hesh]] (Industry Expert, HIGH).
- New analyses [[Civly Direction — Drafting-First Pivot (Jun 2026)]] and [[Advisor List & Question Routing]]; split [[To-Do — Hassaan]] / [[To-Do — Yash]]; updated [[Civly Architecture Reference]] and [[Civly To-Do — Jun 2 to Jun 16]].

## Notable Quotes
- "There's less BIM coordinators than there are drafters. If you can get a company from 3–4 drafters down to one, you can save $300–400,000." — BIM mentor (2026)
- "If someone gets sued, it's not the BIM modeller's fault, it's the architect's." — BIM mentor (2026)
- "You can automate it. There's a tool called duct sizer — put in the flow and length, it calculates the size." — BIM mentor (2026)
- "Call 500 MEP consultancies and ask 'would you want this?'" — BIM mentor (2026)
