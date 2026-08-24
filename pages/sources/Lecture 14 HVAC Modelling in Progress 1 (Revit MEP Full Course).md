---
title: "Lecture 14 HVAC Modelling in Progress 1 (Revit MEP Full Course) - Full Project from Start to End"
type: source
tags: [source, youtube, revit, mep, hvac, tutorial, ducting]
source_url: "https://www.youtube.com/watch?v=Z7rHOcGVx2U&list=PLjD2PC-RU6S-GoTfv6lM53zGjBXVkXAw7&index=13"
channel: "Engineering Academy (BIM Management) — Mohamed Gamal"
published: 2023-09-27
created: 2026-08-24
updated: 2026-08-24
sources: 1
---

## TL;DR
Lecture 14 of a Revit MEP full-course series: continuing HVAC ductwork modeling on a ground floor — placing/rotating mechanical equipment, drawing supply and return duct runs with branches sized in millimetres, placing diffusers and fire dampers, and copying a completed room's system to an identical room. Short, purely mechanical Revit UI steps with no formulas or sizing rationale given (dimensions appear to be arbitrary example values for this specific model).

## Key Claims / Techniques
- Mechanical equipment is placed/rotated (180° in this case) so its "in" and "out" connectors align correctly with the intended supply direction before ducts are drawn from its connector symbol.
- Duct runs are drawn directly from an equipment connector at specified cross-sections, e.g. a main run at 350×250mm, then a branch reduced to 350×150mm.
- Diffusers (supply) and returns are placed via "create similar" from an existing family instance so elevation/properties match; a flexible duct connects a diffuser/return into the system, and once connected the system highlights (turns blue in Revit's UI) to confirm connectivity.
- Insulation is applied once at the end of modeling (batch), not incrementally per element, to save rework.
- Practical troubleshooting shown: when a duct run doesn't leave enough room for a fitting at a target elevation (e.g. diffuser at 3450mm), the presenter shortens/adjusts the preceding duct segment length until the fitting fits.
- A completed room's full system (equipment + ducts + diffusers) is duplicated to an identical adjacent room via copy, then nudged into position — used because Civly Brain already has multiple rooms of the same layout in this model.

## Civly Relevance
**Score: LOW**

Pure Revit UI ductwork placement on a specific example project — no duct-sizing method, target velocity/pressure-drop rule, or code reference is given; the millimetre values shown (350×250, 350×150, 450×150, diffuser at 3450mm elevation) are arbitrary to this model, not general design rules, so they aren't usable in a `rules/` or `calcs/` pack. Civly doesn't operate inside Revit at all (IFC in/out via Archicad/Tapir MCP), so the UI mechanics themselves (rotate-to-align connectors, "create similar," batch insulation, copy-to-duplicate-room) have no implementation surface. Loosely reinforces the branch-transition modeling behaviour already captured in [[MEP Drafting — Schematic to LOD 200]] (duct steps down at each branch), but adds no new rule.

## Concepts Mentioned
[[MEP Drafting — Schematic to LOD 200]]

## Entities Mentioned
None new.

## What Changed in the Wiki
- Created this source page.
- Injected notes into the raw file.
- Moved source to `processed/`.

## Notable Quotes
"I prefer to check the 3D step by step to make sure that you are making modeling correct." — Engineering Academy, Mohamed Gamal (2023)
