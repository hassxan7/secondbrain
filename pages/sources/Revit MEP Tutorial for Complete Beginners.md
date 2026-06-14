---
title: "Revit MEP Tutorial for Complete Beginners"
type: source
tags: [youtube, MEP, revit, BIM, HVAC, plumbing, electrical, coordination]
source_url: "https://www.youtube.com/watch?v=gO0tjfUKDPU"
channel: "SourceCAD"
published: 2024-06-23
created: 2026-06-14
updated: 2026-06-14
sources: 1
---

## TL;DR

A project-based walkthrough of Revit MEP from scratch, covering the full system setup workflow: linking all five disciplines (architecture, structural, mechanical, electrical, plumbing) into a coordination model, then building MEP systems in each discipline's own file. The tutorial focuses on a real office building — modelling HVAC (HRU, VAV units), hot/cold plumbing, electrical, and wet/sanitary systems for a restroom core on Level 2.

## Key Claims / Techniques

- **Multi-discipline model setup:** Each discipline (architecture, structural, MEP, electrical, plumbing) lives in its own Revit file. A blank "coordination.rvt" links all five via `Insert → Link Revit` with "auto internal origin to internal origin" positioning — this is how clash detection works.
- **Overlay vs. Attachment:** Use "overlay" link reference type to avoid bringing in nested links (e.g. when linking electrical.rvt, you don't also re-import the architectural model it already contains).
- **Visibility / Graphics Overrides:** Standard workflow to hide annotation categories in 3D coordination views for clarity.
- **Section Box:** Core tool for cutting through the 3D model at decision points — restrooms on L2, plenum space, structural steel clearances.
- **MEP disciplines covered:**
  - **Mechanical (HVAC):** Heat Recovery Unit (HRU) for fresh/stale air exchange in restrooms, Variable Air Volume (VAV) units, rooftop AHU, boiler/pump/hot water tank in systems room
  - **Plumbing:** Hot and cold water supply, wet and sanitary systems
  - **Electrical:** Electrical room layout, lighting circuits
- **Workflow:** Each discipline works in its own file with architecture/structural linked → coordination model aggregates all for clash checking
- **Plenum space** (space above ceiling tiles) is where HVAC runs — structural steel coordination is critical here

## Civly Relevance

**Score: HIGH**

This is directly relevant to Civly's active MEP development work. The video exposes the exact mental model and workflow that Revit MEP practitioners use — five separate discipline files, linked via a coordination model, each system authored independently before clash checking. Civly needs to replicate this separation-of-concerns model (each discipline has its own IFC elements) while automating the coordination step that currently requires manual linking and visual inspection. Specific high-value sections: the multi-file linking setup (0:00–5:00) reveals the data structure Civly must output for IFC coordination; the HRU/VAV placement logic (5:00+) shows how MEP engineers make zone-level decisions that Civly will need to propose automatically. The restroom core use case is a good benchmark: small, bounded MEP scope with clear HVAC + plumbing + electrical requirements.

**Most relevant timestamps for Civly team:**
- 0:00–2:40 — five-discipline linking structure (maps to Civly's IFC multi-discipline output)
- 5:00+ — HRU/VAV decision-making in a bounded zone (MEP zone proposal logic)

## Concepts Mentioned

[[MEP Coordination]] · [[BIM Multi-Discipline Model]] · [[HVAC]] · [[IFC]]

## Entities Mentioned

[[SourceCAD]] · [[Revit]]

## What Changed in the Wiki

- Created: this source page
- To create: [[MEP Coordination]] concept page, [[HVAC]] concept page

## Notable Quotes

"I'm going to link in the architectural, and the positioning is always going to be set to auto internal origin to internal origin. This allows all of the different disciplines to line up." — SourceCAD (1:20)

"What I'd like to work on is the mechanical system in particular. So, I need to open the mechanical link by itself... the mechanical systems rely upon [the architectural and structural models]." — SourceCAD (5:54)
