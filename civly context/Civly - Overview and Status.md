---
tags: [civly, civly/overview]
updated: 2026-06-14
---

# Civly — Overview and Status

Up: [[Civly MOC]]

## What it is
An AI BIM copilot. You give it any starting point (a sketch, a CAD drawing, or a Rhino model) and it builds a coordinated, building-code-compliant, editable BIM. Each engineering decision is proposed and waits for human approval. Output is IFC-exportable, with decisions logged against their code reference. Target time: under 20 minutes.

The sharpest public one-liner is the website copy: "BIM that works across disciplines. Sketch to coordinated, code-checked model in 20 minutes with no manual back-and-forth between architecture, structure, and MEP" (Civly.dev, via `info pt1`).

## Who it is for (unresolved, see below)
- Handover doc says **architects**: "AI copilot for architects."
- Public materials say **engineers**: LinkedIn tagline "AI Copilot for AEC Engineers for BIM Modelling" (note the "Enngineers" typo to fix), and applications say "copilot for AEC engineers / civil and structural engineering firms."
- The architects-first framing is the more defensible one because it matches Michael's workflow insight (the architect authors design intent first). This needs a single answer. Tracked in [[Civly - Messaging Rules and Open Questions]].

## The problem (pitch framing)
Five disciplines (architecture, structural, MEP, electrical, plumbing) work in five separate files in five tools and sync to ACC or BIM360 about once a week. Clashes surface late. Fixing late costs roughly 10x more. Around 30% of construction cost goes to rework. Existing AI cannot be trusted with building code because it reads loosely, so Civly trains on code data and keeps every decision traceable to a code reference.

## Why now
Hong Kong mandated BIM (recent), UK and EU procurement rules tightening, most small firms cannot afford Revit at roughly 5,000 EUR per seat per year, and code-aware AI is now viable.

## Competitive map
- **Finch3D**: floor-plan generation, mostly residential, stops at architecture. Sits before Civly. Potential integration partner.
- **h2x Engineering**: MEP calculation tool, starts after the engineer is already drawing. Validates the market (AECOM, Arup, WSP).
- **Autodesk Forma** (ex-Spacemaker): pre-design and massing, no engineering generation. Pitch line: "Autodesk stops at massing, we start where they stop."
- **Archilabs**: the most direct competitor. Assessed as "geometrical and bare bones," not matched to real architect workflows.
- **ACC plus Navisworks**: not a competitor, it is infrastructure Civly sits on top of. Does clash detection only.

Civly's claimed edge: everyone else either stops before the engineering layer or assumes it is already done. Civly generates the full multi-discipline model from architectural intent, compliance-first.

## Current status snapshot (14 Jun 2026)
- MVP builds architecture plus structural BIM in Archicad via Tapir. MEP in active development.
- NCC 2022 (Australia) compliance baked in.
- BOM feature shipped to a pilot customer for quantity extraction.
- 3 LOIs signed (2 from India), a 4th in pipeline. See [[Civly - Traction and Funding]].
- In Blackbird Giants. Interviewed at Startmate (~6 Jun, outcome pending) and Antler. YC rejected.
- Michael Westerlund is an unofficial design partner. See [[Civly - People]].
