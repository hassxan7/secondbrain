---
title: "Structural Engineering Overview for Civly"
type: concept
tags: [structural, IFC, tapir-mcp, archicad, columns, slabs, civly-product]
created: 2026-06-14
updated: 2026-06-14
sources: 0
---

Foundation page for the structural knowledge Civly needs to make correct Tapir MCP calls to Archicad. Structural is the shipped MVP discipline — columns, slabs, and walls are already being generated. This page tracks what sizing rules, formula inputs, and element relationships Claude must know to produce structurally sound output.

See [[Civly Architecture Reference]] for how this knowledge maps to implementation surfaces.

---

## What Civly Currently Generates (Structural)

From the Sydney Class 2 reference model (Archicad 29, 31 May 2026):
- **Columns:** 400×400mm RC columns on 7.2m grid (42 columns total)
- **Slabs:** 300mm ground slab, 200mm upper floor slabs
- **Walls:** 47 RC walls
- **Lifts:** 3 lift cores
- **Storeys:** Ground 0.0m, L1 +3.6m, L2 +6.8m, Roof +10.0m
- **NCC schedules:** live on the model
- **LOD:** 200–300 (not certified for construction)

These are the Tapir MCP call outputs. Claude decided these dimensions — they must be defensible for a 4-storey Class 2 residential building.

---

## Column Sizing — What Claude Must Know

### When is 400×400mm correct?
- 400×400mm RC column is a common choice for spans up to ~7–8m in low-to-medium rise (4–8 storey) residential and commercial
- At 7.2m grid: tributary area per column ≈ 7.2 × 7.2 = ~52m²; at 5 kPa (office LL) + self-weight ≈ 4–6 kPa dead load → axial load ~500–600 kN per floor; 4 storeys → ~2,000–2,400 kN total; f'c 32 MPa, 400×400 RC → capacity ~1,800–2,200 kN (roughly correct for 4-storey Class 2)
- For taller buildings or longer spans: must increase to 450×450, 500×500, or 600×600
- For steel: equivalent would be 200UC52 or 250UC73 depending on load

### Grid Logic
- 7.2m is a common Archicad/architectural grid because it fits 2× 3.6m bays or 3× 2.4m bays (NCC parking bay width × 3)
- For Class 5 office: 8.4m or 9.0m grids common (allows office furniture planning and parking below)
- For Class 2 residential: 6.0m–7.2m common (apartment unit widths)

### Column-to-Beam Relationship
- Columns support beams; beams support slabs
- Beam depth rule of thumb: span/12 to span/15 for RC; span/20 for post-tensioned
- At 7.2m span: RC beam ≈ 600mm deep (7200/12) × 300mm wide (typical)
- Post-tensioned slab: can span 7.2m at ~250mm slab depth (thinner than RC)

---

## Slab Sizing — What Claude Must Know

### RC flat plate (common Class 2 apartments)
- Rule of thumb: span/30 for flat plate (two-way); span/25 if heavily loaded
- At 7.2m span: 7200/30 = 240mm → round up to 250mm (Civly uses 200mm for upper — may be thin for 7.2m; acceptable if post-tensioned or if span is actually ~6m)
- 300mm ground slab is conservative — may include sub-base consideration

### Slab types to know
- **RC flat plate:** simple, no downstand beams, common in apartments; ~250–300mm for 6–7m spans
- **Post-tensioned flat plate:** thinner (200–225mm for 7m+), more complex; common in Class 5 and large Class 2
- **Waffle slab:** ribbed soffit, used for longer spans >8m; not common in simple residential
- **One-way slab on beams:** used when spans are rectangular; less common in modern apartment construction

---

## Wall Types — What Claude Must Know

### Load-bearing RC walls vs columns
- RC shear walls provide lateral resistance (wind, seismic); columns handle gravity loads
- Core walls (around lift shaft, stair) are typically RC shear walls — good location for all building types
- External perimeter can be RC or structural steel depending on facade type

### Wall thickness
- RC load-bearing wall (non-fire): minimum 150mm; typically 200mm for residential, 250mm for mid-rise
- RC shear wall: typically 200–300mm
- Party wall (Class 2 BCA Part F4): 200mm minimum for sound (AS 1170.4 sometimes requires 250mm for fire + acoustic)

---

## Tapir MCP Implications

When Claude places structural elements via Tapir MCP, it needs to:

1. **Choose the right element family** for each structural type (RC column family, RC wall type, slab element)
2. **Set the correct dimensions** based on the span, number of storeys, and NCC class
3. **Position elements on the correct grid** (7.2m or project-specific)
4. **Assign the correct storey** (Archicad's story structure must be set up first)
5. **Connect elements correctly** (column top to beam/slab, wall bottom to foundation or lower slab)

The critical gap: Civly currently uses fixed values (400×400 columns, 200mm slabs) regardless of project parameters. A smarter system would calculate required dimensions from span, number of storeys, and occupancy class, then pass those as MCP call parameters.

---

## Open Questions (Structural Knowledge Gaps)

- What is the rule for determining column size programmatically from span + number of storeys + NCC class?
- How does NCC 2022 D5 (structural performance requirements) reference AS 1170? Do we need to run load calcs or just size from standard tables?
- When does the Civly engine need to involve a structural engineer? (NCC: "must be designed by a registered structural engineer for anything >3 storeys")
- How should foundation type affect the structural model? (pad footings vs raft vs piles — do we need to generate these in the IFC?)
- What are the standard structural grid options Civly should offer for Class 2, Class 5, Class 6?

## Related Pages

- [[Civly Architecture Reference]] — implementation surfaces and relevance framework
- [[MEP Coordination Requirements]] — MEP knowledge that interacts with structural at penetrations and plenum space
- [[Revit MEP Five-Discipline Coordination Model]] — shows structural + MEP coordination context
