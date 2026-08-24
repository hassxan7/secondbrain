---
title: "REVIT 2023 FOR MEP - Lesson 1 Getting Started with an MEP Project"
type: source
tags: [source, youtube, revit, mep, tutorial, project-setup]
source_url: "https://www.youtube.com/watch?v=PoH11nX72U4&list=PL5ZA2y2xWxRd35PHx_bO2BsmqPyuNEIvN"
channel: "Learning With Rich"
published: 2022-09-29
created: 2026-08-24
updated: 2026-08-24
sources: 1
---

## TL;DR
A Revit MEP 2023 project-setup walkthrough: choosing the "Systems" template, configuring MEP units per discipline (HVAC/Electrical/Piping), filling in project information, creating shared project parameters, setting project location, and customizing the project browser's grouping/sorting. Pure Revit administration/UI, no design or engineering content.

## Key Claims / Techniques
- New MEP project starts from the "Systems" template (combines Mechanical + Electrical + Plumbing in one project) rather than a single-discipline template, unless disciplines are intentionally kept separate.
- Project Units dialog (shortcut `UN`, or Manage → Settings → Units) is set **per discipline** (Common, HVAC, Electrical, Piping, etc.) — e.g. density, illuminance (lux vs. foot-candles), apparent power (BTU/s), coefficient of heat transfer (BTU/hr·ft²·°F) are each configured with unit + decimal-place rounding independently per discipline.
- Project Information (Manage → Settings → Project Information) holds organization, building name, author, issue date, status, client name, and address — administrative metadata, not modeled geometry.
- Shared parameters: create a shared-parameter file (stored centrally so a team can access it, BIM manager controls it) → create a parameter group (e.g. "Greenhouse Gas") → create a parameter within that group (e.g. "Carbon Footprint Factor," discipline = Energy) → then explicitly add that shared parameter into Project Parameters and bind it to a category (e.g. Project Information) as an Instance or Type parameter. Only after this multi-step binding does the value become editable on the target category.
- Project Location is set via Manage → Location, either through Internet Mapping Service (requires connectivity) or a default city list — determines site data (e.g. for downstream energy/weather analysis, not used here).
- Project Browser Organization (View tab → User Interface → Browser Organization, or right-click the browser) controls how the tree of views/schedules/sheets/families is grouped and sorted — default is Discipline → Sub-discipline → Family/Type; a custom organization can be created and applied per project.

## Civly Relevance
**Score: LOW**

Entirely Revit administrative/UI setup — template choice, units dialog, project info fields, shared-parameter creation, browser organization. None of this maps to Tapir MCP calls, `ifc_writer`, YAML rule packs, or calc functions; Civly does not operate inside Revit. The per-discipline unit-system framing (HVAC vs. Electrical vs. Piping units) is a mild reminder that IFC/NCC calculations must also track discipline-appropriate units, but that's already handled in Civly's existing pipeline and isn't new information from this video.

## Concepts Mentioned
None new.

## Entities Mentioned
None new.

## What Changed in the Wiki
- Created this source page.
- Injected notes into the raw file.
- Moved source to `processed/`.

## Notable Quotes
"Not all parameters that you needed are here on the properties... there are some instances that you really need to create a project parameter." — Learning With Rich (2022)
