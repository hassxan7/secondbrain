---
title: "Civly Architecture Reference"
type: analysis
tags: [civly, architecture, MCP, IFC, tapir, archicad, reference]
created: 2026-06-14
updated: 2026-06-14
sources: 0
---

The definitive reference for evaluating source and contact relevance. Every relevance score in this wiki must be grounded in whether the knowledge can be translated into one of the four implementation surfaces below. Read this before scoring anything.

---

## How Civly Actually Works (June 2026)

### Layer 1 — The BIM Generator (Claude + Tapir MCP + Archicad)

The core product is: **Claude Code drives Archicad through the Tapir MCP plugin, step by step, to build a BIM model.**

- **Tapir MCP** is an Archicad plugin that exposes Archicad's API as MCP tools — place wall, place column, place slab, place opening, set storey, etc.
- **Claude Code** calls these MCP tools in sequence based on the architectural design input (sketch, CAD, Rhino geometry)
- Each engineering decision (column size, slab depth, wall type) is proposed by Claude and shown to the user for approval before execution
- Output: an Archicad model, which is then exported as IFC

**Shipped MVP (architecture + structural):**
- Reference model: Sydney Class 2 Apartments, Archicad 29, via Tapir MCP
- 4 storeys, 47 walls, 42 RC columns (400×400mm on 7.2m grid), 3 lifts
- Slabs: 300mm ground, 200mm upper
- 30 zones (16 SOUs + corridors, stairs, lift, MEP risers, terrace)
- NCC schedules live, LOD 200–300

**MEP status (NOT shipped):**
- No Tapir MCP support for MEP elements yet (Archicad may not expose MEP API)
- Parallel path: `mep.py` Python module + `ifc_writer` generates MEP IFC directly, bypassing Archicad
- Branch: `feat/p2-c3-ifc-space` — implementing `IfcSpace` per `MepZone`
- MEP currently means: the IFC writer places MEP IFC elements directly into the output file

---

### Layer 2 — The Feasibility Engine (Python + Rules + IFC)

A separate Python backend that reads IFC and runs deterministic engineering calculations. This is the compliance and feasibility layer.

```
IFC file (from Archicad or user upload)
    ↓
ingest/ (IfcOpenShell → SemanticProject Pydantic model)
    ↓
calcs/ (pure functions → ResultSet)
    ↑
rules/ (YAML packs: NCC 2022, HK CoP, generic)
    ↓
scenarios/ (JSON mutations → recompute in < 5s)
    ↓
reports/ (Jinja2 → PDF via WeasyPrint)
```

**Key architectural decisions that constrain what is relevant:**

| Decision | What it means |
|---|---|
| D1: IFC as only input | Knowledge about getting clean IFC out of Revit/ArchiCAD is useful; Revit-specific modelling UI is not |
| D2: Semantic model layer | `ingest/` converts IFC to typed Pydantic objects; calcs never read IFC entities directly |
| D4: Rules = YAML data | Adding a new jurisdiction = adding a directory of YAML files; no code change required |
| D5: Scenarios = JSON mutations | Changes are declarative ({op, selector, to}); no geometry re-draw |
| D6: LLM strictly at edges | LLM only parses plain-language intent → mutation JSON, and polishes report prose. **Numbers never go through an LLM.** Compliance calcs are deterministic. |
| D7: Local-first | docker compose up on a single machine; SQLite; no cloud; confidentiality is a feature |

**What the engine calculates today (NCC 2022):**
- Ventilation pre-sizing: occupancy → outdoor air → zone airflow → duct area → shaft size
- Parking demand vs yield
- Sanitary fixture counts
- Egress screening (PASS / REVIEW / FAIL per storey)
- Yield metrics: GFA, NLA, efficiency ratio, facade ratios, quantity roll-ups
- BOM (quantity extraction): concrete m³, steel t estimate, facade m²

---

### Layer 3 — The UI (React + Vite + @thatopen viewer)

- Upload IFC → Semantic review / space mapping → Dashboard (baseline results) → Scenario builder → Comparison → Report
- 3D viewer via @thatopen/components; coloured by function; selection syncs to result tables
- "Tables are the product, the viewer is the wow" — product works without WebGL

---

## The Four Implementation Surfaces

When evaluating any source or contact, the question is: **can this knowledge be applied to one of these four surfaces?**

### Surface 1 — Tapir MCP Calls (what Claude generates in Archicad)
Knowledge that helps Claude make better MCP calls:
- What structural element sizes are correct for a given span/load (column dimensions, slab thickness, beam depth)
- What MEP elements need to exist in a space (HRU sizing for a zone, duct cross-sections, diffuser placement)
- What the spatial relationships between elements should be (clearances, offsets, routing constraints)
- **NOT relevant:** how to click through Revit's ribbon; Revit family management; Revit-specific settings

### Surface 2 — IFC Writer (`ifc_writer`, `mep.py`)
Knowledge that helps write correct IFC output:
- Which IFC entity type corresponds to which physical element (IfcFlowSegment for ductwork, IfcDistributionElement for HRU, IfcBuildingElementProxy for complex elements)
- How IFC spatial hierarchy works (IfcProject → IfcSite → IfcBuilding → IfcBuildingStorey → IfcSpace)
- How MEP zones map to IFC elements (MepZone → IfcSpace + IfcZone; ductwork → IfcFlowSegment)
- IFC relationship types (IfcRelContainedInSpatialStructure, IfcRelAssociatesConstraint, etc.)

### Surface 3 — YAML Rule Packs (`rules/`)
Knowledge that helps write accurate rule files:
- Specific NCC 2022 ventilation rates, parking ratios, egress requirements, sanitary ratios
- How the rates vary by space function, jurisdiction, and occupancy class
- UK/EU regulations for expansion markets
- NCC 2022 XML format (ABCB published it as CC BY 4.0 — machine-readable)
- CODE-ACCORD on HuggingFace as compliance NLP base model

### Surface 4 — Calc Functions (`calcs/`)
Knowledge that helps implement the deterministic calculation logic:
- Engineering formulas: occupancy → outdoor air (L/s/person × persons), duct area from airflow (Q/v), shaft sizing
- Structural load calculations: tributary area → load → column sizing (BH² formula for column capacity)
- The intermediate values that need to be tracked (every intermediate must appear in the result tree for citation)
- Formulas from NCC 2022, AS 1668.2 (ventilation), AS/NZS 3000 (electrical), etc.

---

## Relevance Scoring Heuristic

### HIGH relevance: a source teaches something directly implementable in ≥ 1 surface
Examples:
- MEP zone sizing logic → Surface 1 (MCP call parameters) + Surface 2 (MepZone schema) + Surface 4 (airflow calcs)
- NCC 2022 ventilation rates → Surface 3 (YAML rule) + Surface 4 (calc formula)
- IFC spatial hierarchy → Surface 2 (ifc_writer)
- How structural engineers size columns → Surface 1 (what dimensions to pass to Tapir MCP)

### MEDIUM relevance: a source informs product strategy, user understanding, or market context without direct implementable content
Examples:
- BIM career market dynamics (confirms the coordinator persona)
- Revit dominance (confirms IFC must be importable)
- AEC procurement trends
- Competitor analysis

### LOW relevance: tangential; no clear path to any implementation surface
Examples:
- Revit UI operations (how to click menus) — we don't use Revit; the underlying engineering concepts are what matter
- BIM standards theory (ISO 19650 abstract principles) without specific calculation values
- General construction management (not the tech stack)

### NOT relevant: does not apply to any surface
- Building styles or aesthetics (Civly doesn't make design decisions)
- Construction site management (post-BIM phase)
- General software engineering tutorials unrelated to IFC, MCP, or AEC

---

## Discipline Priority Order

1. **MEP (CRITICAL)** — in active development, no MCP yet, mep.py + ifc_writer path is the implementation; every tutorial that shows what engineers need in MEP systems is product requirements
2. **Compliance / Code (HIGH)** — the differentiation claim; LLM can't do it; rules engine must; NCC 2022 is the immediate target
3. **Structural (HIGH, partially shipped)** — column sizing, slab depths, beam sizing for typical Australian Class 2/5/6 buildings; the Tapir MCP calls are the output
4. **IFC / Open BIM (HIGH)** — the interchange format for everything; ifc_writer correctness is load-bearing
5. **BIM Coordination workflows (MEDIUM)** — informs what coordinators (the target user) need from Civly's output
6. **AEC market dynamics (MEDIUM)** — informs go-to-market and ICP messaging

---

## What Civly Is NOT Doing

- Not a Revit plug-in (IFC, not .rvt)
- Not replacing Navisworks/ACC for clash detection (Civly sits on top of these tools)
- Not making design decisions (architect authors; Civly evaluates and proposes engineering decisions)
- Not using LLM for calculations (deterministic rule engine only)
- Not doing construction management (stops at coordinated BIM model)
- Not cloud SaaS (local-first, docker compose, no outbound network calls from engine)
