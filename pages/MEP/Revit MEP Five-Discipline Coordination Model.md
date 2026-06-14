---
title: "Revit MEP — Five-Discipline Coordination Model"
type: concept
tags: [MEP, revit, coordination, IFC, civly-product]
created: 2026-06-14
updated: 2026-06-14
sources: 1
---

How Revit MEP practitioners structure a multi-discipline project: five separate files linked into one coordination model, with each discipline responsible for its own services and coordination around the others. This is the mental model Civly must replicate in IFC form.

## The Five-Discipline Structure

In Revit MEP, a full building project has exactly five linked files:

| Discipline | File | What it contains |
|---|---|---|
| Architecture | arch.rvt | Walls, floors, ceilings, rooms, doors/windows |
| Structural | structural.rvt | Columns, beams, slabs, foundations |
| Mechanical | mechanical.rvt | HVAC: ductwork, AHUs, VAVs, HRUs, diffusers |
| Electrical | electrical.rvt | Panels, cable trays, conduit, fixtures, switches |
| Plumbing | plumbing.rvt | Domestic hot/cold water, sanitary, vent |

Each file is worked independently. A sixth blank file (the coordination model) links all five for visual checking and clash detection.

**Critical alignment setting:** Insert > Link Revit > positioning = "Auto - Internal Origin to Internal Origin" — ensures all disciplines share the same coordinate reference point automatically.

**Overlay mode:** when linking, use Overlay (not Attachment) to prevent nested links from loading twice (e.g. if electrical already links in arch, you don't want arch to load a second time when you link electrical into coordination).

## How This Maps to IFC for Civly

In IFC, the equivalent structure uses separate IFC files per discipline (or IfcProject containers with discipline-specific IfcBuilding elements), combined in an IFC coordination model. Civly's MEP generation must:

1. Generate each discipline as its own set of IFC elements (IfcFlowSegment for ducts/pipes, IfcDistributionElement for equipment, IfcElectricDistributionBoard for panels, etc.)
2. Maintain correct spatial coordination between disciplines by generating against the shared architectural coordinate origin
3. Flag clashes between Civly-generated MEP elements and the linked structural/architectural IFC model before presenting proposals to the user

## Zone-Based MEP Thinking

MEP engineers think in **zones and systems**, not individual elements:
- A zone is a bounded space with defined requirements (e.g. "Level 2 restroom core: needs fresh air exchange, domestic water, drainage")
- A system is the connected set of elements serving that zone (e.g. HRU → supply ducts → supply diffusers + return diffusers → return ducts → HRU)
- Elements outside their system cannot be connected (Revit enforces this; supply duct cannot connect to a return diffuser)

**Implication for Civly:** MEP proposals should start from zone definitions (derived from the architectural model's room/space elements), then propose the systems that serve each zone, then specify the individual elements.

## The Plenum Space Problem

The ceiling plenum (space between structural slab above and suspended ceiling below) is where all MEP services compete for space:
- Structural beams cross the plenum at fixed heights
- HVAC ducts need 400–600mm depth for main runs
- Pipes need 100–200mm depending on size
- Electrical cable trays need 100–200mm
- All services must clear the structural steel and each other

This is the core clash scenario Civly must solve at generation time. Civly should:
- Know the available plenum height (from arch ceiling height + structural slab data)
- Propose MEP routes that fit within that height budget
- Flag when a zone's MEP requirements exceed the available plenum space

## Related Sources

- [[Revit MEP Tutorial for Complete Beginners]] — full walkthrough of this structure in practice
- [[How to Learn the BIM Coordination Skillset]] — what coordinators do after this model exists
- [[BIM Coordination]] — concept page for clash detection and coordination workflows

## Open Questions

- What is the IFC equivalent of Revit's "link with overlay" for multi-discipline IFC models? IfcRelAggregates? Separate IfcProject files?
- How does Civly handle discipline-specific coordinate systems if the architectural IFC uses a different origin than the client's structural IFC?
- At what LOD (Level of Detail) should Civly generate MEP elements? LOD 200 (volume placeholders) or LOD 300 (sized, positioned elements)?
