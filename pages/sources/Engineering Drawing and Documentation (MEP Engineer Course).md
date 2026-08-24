---
title: "Engineering Drawing and Documentation (MEP Engineer Course)"
type: source
tags: [source, mep, drawings, schedules, documentation]
source_url: "https://app.elevify.com/slider/c29436b8-9a5b-4be0-a762-69bea0b89688/slide/0955eee46d1a67de7ef08575e558bcaf2bb077ef"
channel: "Elevify — MEP Engineer Course, Lesson 1 (Foundations of MEP Engineering)"
published:
created: 2026-08-24
updated: 2026-08-24
sources: 1
---

## TL;DR
Lesson 1 of Elevify's "MEP Engineer Course" teaches how to read a construction drawing set: sheet organization and numbering, MEP symbols/legends, equipment schedules, general notes, and the revision/as-built lifecycle. It's a documentation-literacy lesson, not a design or sizing lesson — no formulas, no code values.

## Key Claims / Techniques
- Drawing sets follow a fixed discipline order: General → Architectural → Mechanical → Plumbing → Electrical. MEP engineers live in M/P/E but must cross-reference Architectural for walls/ceilings/floor elevations that constrain routing.
- Sheet numbering is structured: letter prefix = discipline, first digit = floor/category, last two digits = sequence (e.g. `M-201` = mechanical, level 2).
- Every sheet has a title block (bottom-right): project name, sheet number, scale, revision history, engineer-of-record stamp — the stamp is what makes it a legal document.
- Three view types, used together: **plan** (top-down equipment/system location), **section** (vertical cut showing elevations/clearances/stacking), **detail** (zoomed-in connection/assembly).
- Symbols are a discipline-specific visual language, decoded via a project-specific **legend sheet** (first sheet in each discipline group). Firms customize symbols — never assume one project's legend matches another's.
- **Equipment schedules** are the authoritative data source: a tag on the plan (e.g. `AHU-1`) cross-references a schedule row containing capacity, voltage, flow rate, model number, and notes.
- **General notes** set discipline-wide baseline rules (applicable codes, installation standards, contractor testing requirements) and link out to written specifications for detail that won't fit on a drawing.
- Revision lifecycle: for-coordination → issued-for-construction → revision (marked with a **revision cloud** + numbered triangle keyed to the title block's revision history) → **as-built** (contractor red-lines of actual field deviations, becomes the permanent record for future maintenance/renovation).
- Practical 5-step reading sequence: title block → legend → general notes → cross-reference equipment tags against schedule → scan for revision clouds. Recommended for any MEP drawing.

## Civly Relevance
**Score: MEDIUM**

This lesson doesn't touch Tapir MCP calls, IFC entities, YAML rule packs, or calc functions directly, so it isn't HIGH — there's no numeric formula or NCC value here. But it's useful product/domain context: it describes exactly the tag → schedule → property data model (`AHU-1` on a plan resolving to capacity/flow/voltage in a schedule) that Civly's [[MEP Drafting — Schematic to LOD 200]] pipeline has to reconstruct when it reads an MEP schematic and again when it writes IFC (an IFC `IfcFlowSegment`/`IfcDistributionElement` carries the equivalent of a schedule row as property sets). It also reinforces that a "schematic" in this industry is a legally-referenced, revision-controlled document, not a casual sketch — worth keeping in mind when scoping how forgiving Civly's schematic parser needs to be. Low-priority, but useful background for whoever designs the schematic-parsing / IFC property-mapping logic.

## Concepts Mentioned
[[MEP Drafting — Schematic to LOD 200]]

## Entities Mentioned
None new.

## What Changed in the Wiki
- Created this source page.
- Injected comprehensive notes into the raw file.
- Moved source to `processed/`.
- Added a cross-link from [[MEP Drafting — Schematic to LOD 200]] (Related section).

## Notable Quotes
"An MEP drawing is a legal contract — but drawn in lines and symbols, not words." — Elevify, MEP Engineer Course (2026)
"As-built drawings capture what was actually built, not what was originally designed." — Elevify, MEP Engineer Course (2026)
