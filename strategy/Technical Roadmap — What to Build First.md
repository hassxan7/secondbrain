---
title: "Technical Roadmap — What to Build First"
type: analysis
tags: [roadmap, technical, mep, drafting, sequencing, yash, civly-core]
created: 2026-06-18
updated: 2026-07-14
sources: 1
---

The ordered build plan that turns the 18 Jun blocker into a sequence. Yash, 18 Jun: *"I don't know what the input exactly is, the output expected, or the steps in between… there are a billion types of CAD files. We need the actual input file, output file and process."* This page exists so we build in dependency order instead of a scattered list. Primary owner: **Yash** (technical); Hassaan supplies the spec answers + data via advisors/partnerships.

## Question / Prompt
Given the drafting-first pivot ([[Civly Direction — Drafting-First Pivot (Jun 2026)]]), what is the minimum ordered path from "we don't know the spec" to "schematic in → LOD-200 model out," and what is gating what?

## The gating principle
**Nothing technical gets built until the spec is pinned for ONE discipline.** The mistake to avoid is generalising over "a billion CAD files" before nailing a single golden path. Pick **mechanical** (hardest + most drafters + the variable-geometry/duct-sizing problem that is the real differentiator) and drive one example end-to-end.

## Phased milestones (in dependency order)

### Phase 0 — Pin the spec  ⛔ GATES EVERYTHING
- **Goal:** for **one discipline (mechanical)**, write down the precise **input file (which CAD/schematic format) → output file (LOD 200 model) → the steps in between.**
- **How:** the 5 research questions → Hesh (follow-up message), Michael, [[Dhanjeet Sah]], UK MEP modeller. Get **example files** from Hesh (a real MEP schematic + the BIM it becomes).
- **Owner:** Hassaan secures the answers/files via advisors; Yash turns them into a written spec.
- **Exit criteria:** a one-page spec + **one worked example pair** (schematic CAD → target LOD 200 model). Until this exists, Phases 1–3 are blocked.

### Phase 1 — Narrow the input, build one parser
- **Goal:** constrain input to the **single most common MEP schematic format** (decided in Phase 0), and parse it into an internal representation: rooms + connections + airflow (L/s) + duct sizes.
- **Exit:** parse one real schematic into structured data reliably.

### Phase 2 — Duct-sizing calcs (the automatable core — no intuition)
- **Goal:** deterministic sizing. `calcs/`: airflow + length → duct cross-section (target velocity + pressure-drop); transitions at branch reductions; aggregate → shaft/riser. `rules/`: per-subsystem targets (**AS 1668.2** + NCC 2022) for the 4–5 subsystems (straight runs, kitchen exhaust, car-park, …). [[MEP Drafting — Schematic to LOD 200]].
- **Why here:** Hesh confirmed this needs **no engineer intuition** — pure formula. It's the highest-confidence build.
- **Exit:** given parsed schematic, produce correctly sized duct runs + transitions.

### Phase 3 — Build through the Archicad MEP MCP; export LOD-200 IFC
- **Goal:** use the stronger Tapir-style MCP to create native Archicad MEP elements from an application-neutral routing graph (systems, routes, sizes, fittings, ports, terminals, spaces/storeys). Export a classified IFC with the expected `IfcFlowSegment`, `IfcFlowFitting`, `IfcFlowTerminal`, and distribution-system semantics.
- **Exit:** **one schematic in → native Archicad MEP model → routed LOD-200 IFC out**, fully automated. This is the demoable milestone.
- **Historical / superseded:** direct `mep.py` / `ifc_writer` generation was the fallback while Tapir lacked MEP support. As clarified 14 Jul, the stronger MCP is now the primary build path.

### Phase 4 — Validate the output with a real firm
- **Goal:** show the LOD-200 output to Hesh / a MEP consultancy: would it accept the IFC as a coordination/reference model or an editable starting point? For Revit firms, explicitly test linked IFC and opened/converted IFC; determine whether native Revit MEP is mandatory. Tune to clear that bar ([[Level of Development (LOD)]] open question).
- **Exit:** one external "yes, I'd start from this."

### Phase 5 — Data pipeline + ML (Avenue B / the moat)
- **Goal:** build the **ingestion + training pipeline** with a clean schema for paired **input CAD/schematic + output BIM**; feed it the partnership data ([[Data Partnership Moat]], Hassaan-sourced) toward ~100k pairs; train to **generalise beyond the rules-coded path** (more disciplines, messier inputs).
- **Exit:** model drafts beyond the hand-coded mechanical golden path.

## Avenue A vs Avenue B (how they fit)
- **Avenue A (codify rules)** = Phases 1–3. Use where there's **no intuition** (duct sizing). Fast, high-confidence, gets a demo.
- **Avenue B (train on data)** = Phase 5. Use where intuition *is* needed and to generalise. Depends on the data partnerships.
- **Phase 0 decides the split:** the research questions reveal how much of drafting is rule-codifiable vs needs learned judgement. Build A now; stand up B's pipeline in parallel so partnership data isn't wasted.

## Runs in parallel (not gated by the spec)
- **Feasibility tool for Michael** (`app.civly.dev`) — get it on Hassaan's PC (Docker + Ollama), show Michael. Separate from the drafting engine. _Decision pending: Ollama vs Claude API ([[To-Do — Yash]])._
- Demo rebrand, website SEO, LinkedIn outreach, funding/registration — independent of the technical path.

## Dependencies at a glance
```
Phase 0 (spec + example files)  ⛔
   └─► Phase 1 (parser)
          └─► Phase 2 (duct-sizing calcs)
                 └─► Phase 3 (IFC out, end-to-end demo)
                        └─► Phase 4 (firm validation)
Phase 5 (data pipeline/ML) ── build pipeline in parallel; train after Phase 3 + partnership data
Parallel track: feasibility tool, rebrand, SEO, outreach, funding  (no dependency)
```

## Limitations
- The whole sequence is **stalled at Phase 0** until the spec answers land — that's why messaging Hesh/Michael and getting example files is urgent (it's on both to-do lists).
- Mechanical-first is a bet; if Phase 0 shows another discipline is a faster win, re-pick.

## Related pages
[[Civly Direction — Drafting-First Pivot (Jun 2026)]] · [[MEP Drafting — Schematic to LOD 200]] · [[Data Partnership Moat]] · [[Level of Development (LOD)]] · [[To-Do — Yash]] · [[To-Do — Hassaan]] · [[Civly Architecture Reference]]
