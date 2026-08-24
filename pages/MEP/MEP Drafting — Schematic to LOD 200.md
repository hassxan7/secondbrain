---
title: "MEP Drafting — Schematic to LOD 200"
type: concept
tags: [mep, drafting, lod, duct-sizing, ifc, calcs, rules, civly-core]
created: 2026-06-18
updated: 2026-06-18
sources: 1
---

The curated MEP knowledge page for Civly's core wedge: turning an **MEP engineer's schematic into a first-draft routed MEP BIM model at LOD 100–200**. Sourced from the [[BIM Mentor Call — Drafting vs Coordination & Data Moat]] (16 Jun 2026). This is what Civly must implement — not how to operate Revit.

## The pipeline Civly is automating

```
MEP engineer's schematic (CAD line diagram: rooms, airflow, duct sizes)
        ↓   ← Civly reads the schematic
route + size MEP elements (duct runs, transitions, branches, diffusers)
        ↓   ← deterministic duct sizing (calcs/ + rules/)
first-draft MEP BIM model @ LOD 100–200  →  IFC out
        ↓   (handed off)
subcontractor raises LOD 200 → 300/350 (units, construction details)
```

The **drafter** (an "architectural/MEP technician" with no design liability) is the labour being replaced. The engineer still authors the schematic and signs off. See [[BIM Drafting vs Coordination]] and [[Level of Development (LOD)]].

## Input — the MEP schematic
- Produced by the MEP engineer; **usually a CAD file** (sometimes drawings).
- A line diagram per the architect's spatial layout: each room annotated with **airflow** (e.g. "400 L/s") and **duct size** (e.g. "500×500"), with the engineer sizing along the run.
- Analogous to an architect's spatial/bubble diagram, but engineered.
- **Civly's read task:** parse rooms + connections + airflow + sizes → "duct goes from A to B, 400×400, 500 L/s, then splits here."

## The duct-sizing logic (Surfaces 3 + 4 — automatable, no intuition)
The mentor is explicit: **no engineer's intuition is required** — drafters already use a "duct sizer" (input flow + length → output size, or inverse). It is pure formula.

- Size to a target **velocity** and **pressure drop** inside the duct.
- These targets differ by **subsystem** — roughly **4–5 cases**, each sized differently:
  - general straight runs
  - kitchen exhaust
  - car-park ventilation
  - (plus other exhaust/supply cases)
- **Duct size steps down along the run:** at each branch where airflow leaves, a **transition** reduces the cross-section (e.g. 200×200 → 100×100 after a 50 L/s branch off a 100 L/s main). This step-down is why **mechanical is the hardest discipline** to draft (vs fire = constant-diameter main + branches; hydraulics/electrical easier).

**Civly mapping:**
- `rules/` (Surface 3): per-subsystem target velocity + pressure-drop limits; reference **AS 1668.2** (mechanical ventilation) alongside NCC 2022.
- `calcs/` (Surface 4): `airflow + length → duct cross-section` (Q/v with pressure-drop check); transition placement at each branch reduction; aggregate → shaft/riser sizing (already partly in the engine per [[Civly Architecture Reference]]).
- `ifc_writer` / `mep.py` (Surface 2): emit duct runs as `IfcFlowSegment`, transitions as `IfcFlowFitting`, terminals/diffusers as `IfcFlowTerminal`, plant/HRU as `IfcDistributionElement`, each contained in the correct `IfcSpace`/storey.

## Output target — LOD 100–200, then hand off
- Civly produces the **routed skeleton** at LOD 100–200: ducts placed and sized, branches and transitions, diffuser/terminal positions.
- It deliberately **stops before construction detailing** (flanges, steps, flex connections, optimal duct splitting, final unit selection, ordered dimensioning) — that is the subcontractor's LOD 200→300/350 work and a **future, data-dependent** Civly scope.
- Error tolerance at this stage is **forgiving**: consultant/design-phase models can have rough sizes/clashes because subcontractors remodel anyway. Precision matters later (commissioning, airflow) — not in Civly's window.

## Why mechanical first (and hardest)
- Mechanical subcontractors carry the **most drafters** (5–10 at busy firms) → biggest labour to displace → biggest willingness to pay.
- Mechanical has the **variable-geometry problem** (transitions) that fire/hydraulics/electrical largely don't → solving it is the real differentiator.

## What Civly is NOT doing here
- Not making engineering *design* decisions — the engineer's schematic sets airflow/intent; Civly routes and sizes deterministically.
- Not optimising dollar cost in real time (low value — see [[Data Partnership Moat]] note and the source's cost discussion). Drafting *principles* (transitions over double bends, fewer couplings, straight runs) capture ~80% of cost benefit anyway.
- Not Revit-UI automation — IFC in, IFC out.

## Open Questions
- Exact AS 1668.2 velocity / pressure-drop targets per subsystem to encode in `rules/` — confirm values with the UK MEP modeller intro or a mechanical engineer.
- Schematic parsing: are AU MEP schematics consistent enough (layer conventions, annotation format) to parse reliably, or will we need a vision/ML step? (Ties to the data-collection plan.)
- Diffuser/terminal placement rules — how much is codified vs drafter judgement?
- Where exactly does Civly's LOD 200 output need to sit so a subcontractor will accept it as a starting point rather than remodel from scratch?

## Related
[[BIM Mentor Call — Drafting vs Coordination & Data Moat]] · [[MEP Coordination Requirements]] · [[Revit MEP Five-Discipline Coordination Model]] · [[Level of Development (LOD)]] · [[Civly Architecture Reference]] · [[Engineering Drawing and Documentation (MEP Engineer Course)]]
