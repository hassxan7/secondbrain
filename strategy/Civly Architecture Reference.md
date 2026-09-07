---
title: "Civly Architecture Reference"
type: analysis
tags: [civly, architecture, MCP, revit, harness, ML, agentic-ide, reference]
created: 2026-06-14
updated: 2026-09-08
sources: 4
---

The definitive reference for evaluating source and contact relevance. Every relevance
score in this wiki must be grounded in whether the knowledge translates into one of the
four implementation surfaces below. Read this before scoring anything.

> [!WARNING] Contradiction — the platform changed, 14 Jul 2026
> Everything under **Historical / Superseded** describes Civly as **Claude + Tapir MCP +
> Archicad + a Python feasibility engine exporting IFC**. That is no longer what Civly
> is. The fork decision (`docs/00_MISSION.md`, `docs/07` D1) moved the whole product to
> **Revit**, and the feasibility-engine framing was replaced by a Revit MCP server plus a
> C# plugin. Sources scored against the old four surfaces before Sep 2026 may be
> mis-scored — re-score anything load-bearing. Old content is kept, not deleted.

---

## Where the code lives

| | path |
|---|---|
| **Main repo** | `D:\revit\civly-revit-mcp--main` (GitHub `RatherN-t/civly-revit-mcp-`) |
| Worktrees | `D:\revit\civly-mep` (`mep/next`), `D:\revit\civly-ring2` (`ring2-ops`), `D:\revit\civly-host` (`ops/hosting`) |
| Its own schema | `CLAUDE.md` in that repo — read it before touching the code |
| Progress ledger | `PROGRESS.md` (~92 KB; tick only with ring evidence pasted) |
| Decisions log | `docs/07_DECISIONS_LOG.md` |
| The current plan | `docs/30_ONE_MONTH_PLAN.md` (2 Sep to 2 Oct 2026) |

The vault does not duplicate that repo's docs. It records **what the architecture means
for strategy, pitch, and source scoring**. For implementation detail, read the repo.

---

## How Civly Actually Works (Sep 2026)

**Civly is a Revit MCP server plus a Revit plugin.** An AI client calls tools; the tools
drive Revit's API through a C# add-in; every write is a named transaction the human can
undo with one Ctrl+Z.

```
AI client  --MCP-->  TS server  --raw TCP :8080-->  C# plugin  --Revit API-->  the model
(Claude Code,        (app/server,                   (app/plugin +              (.rvt)
 Cursor, later        zod schemas)                    app/commandset)
 Civly Desktop)
```

### The stack, layer by layer

**Base:** a fork of the MIT `mcp-servers-for-revit` monorepo (241 stars). Upstream
shipped 29 tools — queries, architecture creation, tags, `send_code_to_revit` — and
**zero MEP commands**. That zero was the wedge.

**Layer 1 — TS MCP server (`app/server`).** Tool schemas in zod, registration in the
upstream `register.ts` pattern. Where safety gates currently live, and **only** here,
which is the blocking problem for shipping (see Gaps).

**Layer 2 — C# plugin + commandset (`app/plugin`, `app/commandset`).** One Command +
EventHandler + Info model per operation. **Every length crossing the boundary is
millimetres and converts with `UnitUtils` at the commandset edge** — Revit's internal
unit is decimal feet, and this is the number-one LLM failure mode, killed at the schema
rather than in prompts. Every transaction is named `MCP:<tool_name>`.

**Layer 3 — the design brain (`docs/09`, `docs/13_DESIGN_BRAIN.md`, rule packs).**
Deterministic sizing and code rules. Duct sizing is verified against Revit's own engine
(286 vs 290 FPM, 2005 vs 2010, 3438 vs 3440 — rounding-level agreement). NCC 2025 text
verified word-for-word against `egress.yaml`.

**Layer 4 — `service/` control plane.** Accounts, licence, revocation, audit trail,
telemetry, model intake. Built, 20/20 tests green, **never deployed**.

**Layer 5 — Civly Desktop (Electron).** The shell. The in-Revit panel was **cancelled**
26 Aug (`docs/07` D18) in favour of the desktop app riding the already-proven socket.

### What is proven, and at which ring

Rings are the repo's honesty gate. **Ring 0** = TS compiles; **Ring 0.5** = C# compiles;
**Ring 1** = contract tests against a mock plugin, no Revit needed; **Ring 2** = a real
session on a licensed Revit, with a result file. Harness green is not Revit green.

| claim | ring | evidence |
|---|---|---|
| Claude Code to MCP to plugin to real Revit | **Ring 2** | 38/38 ducts, 19/19 fittings, 19/19 terminals connected |
| Bulk modification at scale | **Ring 2** | 607 ids / 819 elements deleted in one transaction |
| Duct sizing physics | verified | matches Revit's own engine to rounding |
| Cladding, image processing, clash detection | built Aug | tools exist; Ring 2 thin |
| In-Revit panel | Ring 0.5 | compiles; **has never opened in Revit** |
| The agent loop | none | **does not exist in any form** |

**Ring 2 coverage is roughly 9%.** Reads, safety gates and rollback are verified in
Revit; most creation is not. Say which ring you are quoting, always.

### The honest gaps (Sep 2026)

- **The agent loop does not exist.** No shape of the product can accept a sentence and
  act on it yet. It blocks every deployment shape and does not care which shell wins.
- **Safety gates are TypeScript-only.** The desktop app's dispatch path bypasses them.
  Blocking for any customer.
- **`service/` has never been deployed**, has no TLS, and uses a JSON store with a known
  last-writer-wins race. Fly.io in `syd` is proposed (D21), awaiting Hassaan's yes.
- **Only Revit 2026 is proven.** 2027 removed API we call (`docs/20`).
- **Latency is unmeasured** and was flagged as a real complaint (4 Sep) — needs
  per-task logging and caching.

---

## The Four Implementation Surfaces

Evaluate every source by whether it helps with at least one. **These replace the
Tapir / IFC-writer / YAML / calcs surfaces of the June version.**

| Surface | What it is | Knowledge that helps |
|---|---|---|
| **1 — MCP tool schemas** (`app/server`, TS + zod) | What the AI can ask for, and in what shape | Which Revit operations matter to a drafter; sensible enum foldings; what a tool should refuse |
| **2 — C# commandset** (`app/commandset`) | The Revit API calls that do the work | Revit API entities and signatures, MEP connectors, routing preferences, family types, unit handling |
| **3 — Design brain + rule packs** (`docs/09`, `docs/13`, NCC yaml) | Deterministic sizing and compliance logic | Engineering formulas (airflow, duct sizing, pressure drop), NCC/ASHRAE rules, rules of thumb, MEP course material |
| **4 — The learning harness** (`harness/`, the diff loop) | How Civly gets better than a bare prompt | Matched architectural + MEP model pairs, worked tutorials with visible outcomes, "why 200mm and not 250mm" reasoning |

Surface 4 has no June equivalent, and it is where the moat lives. See
[[Civly Product Trajectory — MCP, Harness, Agentic IDE]].

---

## Relevance Scoring Heuristic

- **HIGH** — teaches something directly implementable in at least one surface above.
- **MEDIUM** — informs product strategy, ICP, or market context without implementable content.
- **LOW** — tangential; no clear path to any surface.
- **NOT** — aesthetics, site management, pure software-marketing content.

> [!important] Revit UI content is no longer automatically NOT relevant
> The June rule said "Revit UI operations = NOT relevant, we do not use Revit." **That is
> reversed.** Civly drives Revit. A tutorial showing *how a drafter actually does a task*
> is now Surface 1 and Surface 4 material: it tells us which tools to build and gives the
> harness a worked example. Score the **engineering and the workflow**, not the
> click-path — a video that only shows where the ribbon buttons live is still LOW.
> This re-scores the 19 sources in [[Raw Inbox]], several of which were parked under the
> old rule.

---

## Discipline Priority Order

1. **MEP (CRITICAL)** — the wedge; four lanes live (MECH, ELEC, PLUMB, LEARN — `docs/34`, `docs/35`)
2. **Compliance / NCC (HIGH)** — the differentiation claim; NCC 2025 text now verified
3. **Structural (HIGH)** — partially shipped
4. **Architectural (HIGH)** — cladding, families, floorplan ingest; ARCH lane still unwritten
5. **BIM coordination (MEDIUM)** — downstream of Civly; informs handoff quality
6. **AEC market dynamics (MEDIUM)** — GTM and ICP messaging

---

## What Civly Is NOT Doing

Not making design decisions (it drafts; the human signs off). Not using an LLM for
numbers or compliance calcs. Not replacing Navisworks or ACC. Not, for now, an in-Revit
panel (cancelled 26 Aug). Not multi-tenant cloud SaaS — the control plane is hosted, the
modelling stays local.

## What we must not say

From `docs/30` section 9 and `docs/17` section 11. These are claim guardrails, not
modesty, and they apply to pitches and form answers as much as to code:

- not "secure"; not "your data never leaves your network" (telemetry leaves)
- not "sandboxed" about `send_code_to_revit` — it is a trusted-operator tool
- not "works in Revit" without a result file
- not "supports 2020 to 2027" — **2026 is what is proven**
- not "designs HVAC" — schematic supply layout, measured at about 24% of as-built airflow
- not "routes around structure" beyond plan-view keep-out (no vertical dodge)
- not "no public Revit MCP has MEP commands" — falsified 4 Aug by an audit of
  LuDattilo/revit-mcp-server, which does create ducts (hardcoded to supply air, buried
  inside a generic tool, undocumented). The narrowed claim that survives and is the only
  one to use publicly: **no public Revit MCP ships a dedicated, documented MEP creation
  tier** — sized ducts, fittings on connectors, terminals with connection, system
  assignment — nor anything like `build_duct_network`.

## Related

[[Civly Product Trajectory — MCP, Harness, Agentic IDE]] ·
[[Deliverables — Sep 2026]] · [[Data Partnership Moat]] ·
[[MEP Drafting — Schematic to LOD 200]] ·
[[Civly Direction — Drafting-First Pivot (Jun 2026)]] · [[Apps Registry]]

---

# Historical / Superseded

> The June 2026 architecture, kept verbatim. Civly was then Archicad + Tapir MCP with a
> Python feasibility engine exporting IFC. Superseded by the Revit fork (14 Jul 2026).
> Read it for provenance, not for current fact.

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
