---
title: "Civly Direction — Drafting-First Pivot (Jun 2026)"
type: analysis
tags: [strategy, direction, pivot, drafting, lod, data-moat, gtm, mep]
created: 2026-06-18
updated: 2026-06-18
sources: 1
---

The strategic synthesis after the [[BIM Mentor Call — Drafting vs Coordination & Data Moat]] (16 Jun 2026). This page records **where Civly's direction sharpened** and **what in the existing context is now stale or contradicted**. The `civly context/` files are read-only company docs — this analysis flags the deltas; it does not edit them.

## Question / Prompt
After the mentor call, is Civly's problem too specific (one architect), or a general one? Which scope should Civly own, and what changes in our direction?

## Findings — the sharpened thesis

**Civly is the AI BIM drafter.** It takes **design intent from an architect/engineer → a first-draft coordinated BIM at LOD ~200**, eliminating the *drafting* labour of structural and MEP, and hands off to general contractors/subcontractors who raise it to LOD 300+. The wedge is **drafting in the design phase, not coordination.**

Five things became clear:

1. **Scope = drafting, not coordination.** [[BIM Drafting vs Coordination]]. Coordination (Navisworks clash assignment) is a separate, data-hungry, lower-value business — defer it. Drafting is earlier in the chain and where the money is.
2. **Buyer + input named.** ICP = **anyone involved in the LOD 0 → ~250 drafting process** — architectural draftspersons, BIM drafters/technicians, *and* MEP consultancies (who employ the drafters). _(Decided 18 Jun: not architects-vs-MEP either/or — the whole early-drafting cohort.)_ Input = **MEP schematics, usually CAD**. Output = LOD ~200 routed model. [[MEP Drafting — Schematic to LOD 200]].
3. **The hardest sub-problem is automatable.** Duct sizing (incl. mechanical's variable geometry via transitions) needs **no engineer intuition** — it's velocity/pressure-drop formulas → `calcs/` + `rules/`. Removes the "do we need to hire an engineer?" blocker.
4. **Liability is settled.** Drafters ("architectural technicians") hold no design liability; the architect/engineer signs and is liable. Civly keeps a **mandatory human sign-off** and never authors design → it cannot be blamed if a human approved it.
5. **The moat is data.** [[Data Partnership Moat]]. To not be made redundant by Autodesk, the priority is proprietary **input-CAD → output-BIM** training pairs (~100k+) via partnerships with MEP firms.

## The economic case (why this is general, not one-architect-specific)
- Firms run **3–4 drafters** (mechanical 5–10); usually **1** coordinator. Automating drafting → 1 vibe-coder → **save $300–400k/yr/firm**. That is a general, repeatable value prop across every MEP consultancy — not specific to Michael.
- Michael's feasibility engine is a *feature for one architect's iteration loop*; the drafting product is the *general* business. Keep both, but lead with drafting for MEP consultancies.

## What's now stale or contradicted in existing context
> These flag deltas for the founders to reconcile. The read-only `civly context/` docs are **not** edited here.

| Existing statement | Source | Delta after this call |
|---|---|---|
| "AI copilot for **architects** / for AEC **engineers**" (unresolved who) | [[Civly - Overview and Status]], [[Civly - Messaging Rules and Open Questions]] Q2 | ✅ **Decided 18 Jun:** buyer = **anyone in the LOD 0 → 250 drafting process** — draftspersons + BIM technicians + MEP consultancies. Not an either/or; the unifying job is "design intent → ~LOD 250 model." |
| Problem framed as **coordination** ("clashes surface late, ~30% rework") | [[Civly - Overview and Status]] | Reframe the wedge to **drafting** (modelling labour), not coordination. Coordination is later/secondary. |
| "**20–30 / 5 consultancies** per project" | pitch framing (in source) | Overstated — typically **one** MEP consultancy + per-trade subcontractors. Fix the pitch number. |
| **Live cost / quantity takeoff** feature is valuable | [[Civly To-Do — Jun 2 to Jun 16]]; Michael + Disha's dad | ✅ **Decided 18 Jun: ship to Michael, then wrap up** — no further investment. Real-time cost-per-edit is low value (fat margins; cost driven by drafting principles); honour Michael's ask as a one-off. |
| Funding partly to **buy data** | [[Civly - Traction and Funding]] | May not need to *buy* — **partnerships** can supply data for product access. Reframe the data spend toward BD/NDAs. |
| Output is a "**Revit model**" (said loosely on the call) | source transcript | Keep the messaging rule: say **IFC**, not Revit. [[Civly - Messaging Rules and Open Questions]]. |

## Limitations
- One expert (well-informed but a single data point). The thesis needs **breadth validation** — call many MEP consultancies (the mentor's own advice: "call 500, ask if they'd want this").
- Founders are non-AEC (AI engineer + journalist) — domain gaps remain; mitigated by an advisor list + the UK MEP-modeller intro, not by hiring.
- Cold-start tension: need some output to win data partners, need partners to get data. See [[Data Partnership Moat]].

## Implications (what to do)
- **Product:** prioritise the MEP **schematic → LOD 200** path and the duct-sizing calcs; **ship live costing to Michael then wrap it up**; keep human sign-off.
- **GTM:** target **everyone in the LOD 0 → 250 drafting process** (draftspersons + BIM technicians + MEP consultancies); validate by volume of outreach calls.
- **Strategy:** stand up the **data-partnership** motion as priority #1.
- **Org:** build an **advisor list + question-routing** process instead of hiring. See [[Advisor List & Question Routing]].
- Execution split into [[To-Do — Hassaan]] and [[To-Do — Yash]].

## Related pages
[[BIM Mentor Call — Drafting vs Coordination & Data Moat]] · [[BIM Drafting vs Coordination]] · [[Level of Development (LOD)]] · [[Data Partnership Moat]] · [[MEP Drafting — Schematic to LOD 200]] · [[Civly Architecture Reference]] · [[Advisor List & Question Routing]]
