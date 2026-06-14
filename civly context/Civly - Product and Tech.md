---
tags: [civly, civly/product, civly/tech]
updated: 2026-06-14
---

# Civly — Product and Tech

Up: [[Civly MOC]]

## The build, in plain terms
Civly today is **Tapir MCP connected inside Claude to Archicad**. You put in a sketch, and through the MCP it builds the BIM step by step (Hassaan and Yash, this is the current architecture as of Jun 2026). Behind it is a real Python codebase at `/Users/yashmittal/CivHub/BIMStudio/`, including `mep.py` and an `ifc_writer` with a `feat/p2-c3-ifc-space` branch implementing `IfcSpace` per `MepZone`. The branch naming (P2.C3) shows a phased build (`info pt1`, image 17).

## Verified output (proof it works)
The reference model is the **Sydney Class 2 Apartments**, Archicad 29 via API (31 May 2026 compliance handover):
- 4 storeys (Ground 0.0, L1 +3.6, L2 +6.8, Roof +10.0)
- 47 walls, 42 RC columns (400 x 400) on a 7.2 m grid, 3 lifts
- Slabs: 300 mm ground, 200 mm upper
- 30 zones (16 SOUs plus corridors, stairs, lift, MEP risers, terrace)
- NCC schedules live
- LOD roughly 200 to 300, marked "NOT certified for construction"

This is a coordinated architectural plus structural shell generated from the design, not a hand-built file.

## MEP status
Not shipped, in progress. Yash, 31 May: "Ok rn what's happening is everything but MEP. There's no MCP for that yet, I'll see if archicad even supports it." The IFC writer work (`mep.py`, `IfcSpace` per `MepZone`) is the start of it. Do not describe MEP as live in any demo or pitch yet.

## Export format: IFC, not Revit
The interchange format is **IFC**. The old line "plugs straight into Revit" (13 Apr pitch script) is stale. Yash, 1 Jun: ".rvt is not readable by any software other than Revit," so an IFC pipeline is needed. Michael confirmed it bluntly in the 22 Apr meeting: "the collaborative format is IFC, you just can't get away from that." Say IFC.

## Compliance engine
NCC 2022 (Australia) baked in. The plan is a machine-learning layer trained on partner firms' past project data so generation happens "through a lens of compliance" (applications). Useful free resource found in research: ABCB published NCC 2022 as machine-readable XML under CC BY 4.0, and CODE-ACCORD on HuggingFace is a transfer-learning base for compliance NLP.

## BOM feature
Shipped to a pilot for quantity extraction. Positioned as the near-term data-and-revenue play and the thing that actually demos today. Note Michael's caution: the hard BOM problem is not initial quantity extraction, it is maintaining consistency and traceability through continuous design iterations across disciplines (`info pt2`).

## Practical constraints to remember
- The Archicad integration was Windows-leaning early on; a plugin "can't be for macs... but it can for windows" (Yash, 15 Apr). Confirm current state before promising platform support.
- The product is the model generator. The early-design **feasibility panel** (Michael's tower list) may still be spec, not built. Tracked in [[Civly - Messaging Rules and Open Questions]].

Related: [[Civly - Design vs Engineering Decisions]] for what the product is allowed to decide.
