---
title: "MEP Coordination Requirements"
type: concept
tags: [MEP, coordination, clash-detection, civly-product, plant-room, precast]
created: 2026-06-14
updated: 2026-06-14
sources: 1
---

The four coordination types a BIM coordinator handles in the field. Each is a concrete product requirement for Civly's MEP generation — if Civly generates a model that satisfies all four, the coordinator's manual clash-hunting work is eliminated.

## 1. Services Coordination (most common)

**What it is:** MEP services (ductwork, pipes, cable trays) must be routed without clashing with each other, with structural elements (beams, columns, slabs), or with architectural elements (walls, windows, ceilings).

**The cascade pattern:** services are hierarchical — some can move, some can't:
- Structural elements are fixed (can't move a column for a duct)
- Architectural elements are near-fixed (ceilings can be lowered, but only with architect approval)
- Gravity-driven services (sanitary drainage) have strict slope constraints
- Everything else adjusts around those constraints

**Real example:** a toilet drain's U-bend (trap) must be a minimum depth below the floor slab; this forces the mechanical duct below it to drop; the duct dropping forces the ceiling to drop in that zone.

**What Civly must do:** generate MEP routes that respect structural/architectural constraints from the start, avoiding clashes at generation time rather than flagging them post-generation.

**Tools in practice:** Revit (modelling) + ACC/BIM 360 (automated clash detection, clash assignment to trades)

## 2. Plant Room Access Coordination

**What it is:** equipment rooms (plant rooms) contain pumps, chillers, AHUs, fan coil units; they must be navigable by maintenance workers, with enough headroom and access paths around all equipment.

**Primary rule:** minimum 2100mm (2.1m) walking clearance anywhere a maintenance worker needs to pass underneath services.

**Exceptions to the 2100mm rule:**
- Services running along a wall where no one walks underneath → can be below 2100mm
- Equipment sitting on the floor against a wall → no underpass risk, below 2100mm acceptable
- A "ductwork wall" (services running as a dense stack along a perimeter) → no one walks through the stack, so below 2100mm acceptable

**Real example:** fan coil unit couldn't hang from the ceiling because all ceiling services would drop below 1900mm; solution was to place the fan coil on the floor against a wall — removes the headroom hazard entirely.

**What Civly must do:** when generating MEP in zones with multiple services, calculate the resulting clearance heights and flag any zones where headroom falls below 2100mm. Plant room layout proposals should include access path verification.

## 3. Louvre and Facade Coordination

**What it is:** HVAC intake and exhaust ducts penetrate the building facade through louvres (grilles). These louvre positions must be aesthetically coordinated with the architectural facade design.

**The problem:** mechanical contractors place louvres where the ducts land, not where the architect intended them to appear on the facade. Result: louvres at random heights, misaligned with windows, creating a chaotic facade appearance.

**Good coordination:** louvres aligned symmetrically with windows; fake/dummy louvres added to complete an architectural pattern (real function: intake on left, exhaust on right; decorative louvres fill the rest of the grille strip).

**Mechanical sizing cascade:** extra bends in the duct route to reach a better-looking louvre position → increased resistance → potentially need to upsize the unit → larger unit may lower the ceiling height → ceiling height coordination issue.

**What Civly must do:** when generating HVAC ducts that terminate at the building facade, propose louvre positions that align with architectural openings or establish a defined grid. Present the proposed louvre positions to the user before finalising duct routing.

## 4. Precast Panel Coordination

**What it is:** precast concrete panels are cast off-site with penetration holes pre-formed; MEP services (ducts, pipes, cable trays) must pass through the holes exactly as modelled, because drilling through precast after casting risks structural failure.

**Why 2D coordination fails:** to verify a duct fits through its hole using 2D drawings, you must: calibrate the PDF scale, measure from datums, calculate offsets, account for duct wall thickness — extremely error-prone and slow.

**Why 3D coordination works:** in Revit or ACC, you can visually see in 3D whether a duct passes through its hole or misses it. Misses are obvious at a glance.

**The timing problem:** precast is often cast early in construction; MEP coordination must be finalised before casting, not after. Late coordination changes are physically impossible without replacing entire panels.

**What Civly must do:** identify where precast panels exist in the structural model (or structural IFC input), flag all MEP services that must penetrate those panels, and verify that penetration positions are structurally permissible (not through reinforced zones at panel edges).

## 5. Structural Steel Model Coordination

**What it is:** the structural engineer's model (used for initial coordination) is often replaced or updated by the steel detailer's model (the actual shop drawings with real connections, cross-bracing, and gusset plates). If MEP is coordinated against the old structural model, clashes appear when the detailer's model is finally published.

**The timing problem:** MEP fabrication (ductwork manufactured at a factory) often happens before the steel detailer's model is finalised. When the detailer's model arrives and shows new steel, the ductwork is already made and must be cut and rerouted on site.

**What Civly must do:** flag when the linked structural model is a design-phase model vs a construction-phase detailer model. Require the detailer model before finalising MEP routes. If the detailer model is not available, note this as a coordination risk on all output.

## Related Pages

- [[Revit MEP Five-Discipline Coordination Model]] — how the five-discipline structure is set up in Revit
- [[Revit MEP Tutorial for Complete Beginners]] — source showing services coordination in practice (interference check)
- [[How to Learn the BIM Coordination Skillset]] — source defining all five coordination types with real examples

## Open Questions

- What is the NCC 2022 minimum clearance height requirement for plant rooms? (2100mm is the industry standard but may differ in Australian code)
- Can Civly automatically extract precast panel boundaries from the structural IFC to identify required penetrations?
- How should Civly handle the steel detailer model timing issue — should it block MEP finalisation until the detailer model is uploaded, or just flag the risk?
