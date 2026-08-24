---
title: "Plumbing in Revit MEP Beginner Tutorial 1"
type: source
tags: [source, youtube, revit, mep, plumbing, tutorial]
source_url: "https://www.youtube.com/watch?v=Mvb-lu6ivq0"
channel: "Balkan Architect"
published: 2018-05-27
created: 2026-08-24
updated: 2026-08-24
sources: 1
---

## TL;DR
A beginner Revit MEP walkthrough that builds a small bathroom's plumbing: domestic cold water supply to two water closets, then a sloped PVC sewage line taking waste away. Entirely Revit UI mechanics — view setup, family loading, pipe routing, slope settings — with no engineering method behind the choices.

## Key Claims / Techniques
- Plumbing in Revit is done from the Mechanical template/discipline, with the view's sub-discipline switched from HVAC to Plumbing.
- Workflow: link in a host project (a "bathroom" from an earlier ventilation/HVAC tutorial) → duplicate/rename a view → create a callout scoped to the bathroom → set the callout's discipline to Plumbing, view template to none → check Visibility/Graphics + Filters so piping and MEP elements show.
- Plumbing fixture connectors (domestic cold water, sanitary) are loaded via Insert → Load Family from the metric/imperial families library, then placed "on face" of a wall at a specified elevation (e.g. 500mm for the cold water connector, 0mm for the sanitary connector).
- Supply piping: placed from the fixture connector, pipe size/diameter set manually (e.g. reduced from 30mm default to 20mm), routed with a vertical drop (offset e.g. −1000mm) down through the floor to represent a below-slab connection to source. View Range is set to "unlimited" so below-floor piping remains visible while editing.
- Waste/sewage piping: new pipe type duplicated from Standard and set to PVC, with routing preferences (fittings, junctions, caps) all reassigned to PVC schedule-40 components. Pipe diameter set manually (e.g. 80mm). Sloped piping requires switching from "Slope: Off" to "Slope Down" with a percentage value (e.g. 2%) — pressurized supply piping doesn't need slope, but gravity waste piping does.
- Fixture/piping runs for a second, identical room are duplicated by copying the connector + connected system elements, then nudging position to align.
- Detail level and visual style (wireframe / realistic) are toggled during modeling to check connections and troubleshoot fitting placement (e.g. resizing a duct/pipe run when there's "no space to make the fitting").

## Civly Relevance
**Score: LOW**

This is a Revit UI operations tutorial (view setup, family loading, manual pipe placement/slope) for a discipline (plumbing/hydraulics) Civly is not currently building toward, and Civly does not develop or automate inside Revit at all — everything is IFC in, IFC out via Archicad/Tapir MCP and `ifc_writer`. The one transferable domain fact — gravity waste piping needs slope (≈2%) while pressurized supply piping doesn't — is real plumbing-design knowledge, but it's too generic and undocumented (no code citation, no pipe-size-vs-flow relationship) to seed a `rules/` or `calcs/` value. Sibling video: [[Plumbing in Revit MEP Beginner Tutorial 2]] (also LOW), which is the follow-on in this same series.

## Concepts Mentioned
None new.

## Entities Mentioned
None new.

## What Changed in the Wiki
- Created this source page.
- Injected notes into the raw file.
- Moved source to `processed/`.
- Cross-linked with [[Plumbing in Revit MEP Beginner Tutorial 2]].

## Notable Quotes
"When we're getting water towards our water closet it's pressurized and it can go just straight in a straight line, but when it's going away it's not pressurized so it needs some slope in order to just get our water away." — Balkan Architect (2018)
