---
title: "Civly Revit MCP"
type: entity
tags: [civly, revit, mcp, product, entity]
created: 2026-09-08
updated: 2026-09-08
sources: 3
---

The product as it actually exists in September 2026: a Revit MCP server plus a C# Revit
plugin, forked from the MIT `mcp-servers-for-revit` monorepo. It is Civly's hands — the
thing that makes real, native, editable Revit geometry from a sentence.

## Overview

An AI client calls MCP tools; a TypeScript server translates them onto a raw TCP socket
on `localhost:8080`; a C# add-in executes them against Revit's API inside a named
transaction. **62 tools** as of 27 Aug 2026, up from an upstream base of 29 that had zero
MEP commands.

## Key facts

| | |
|---|---|
| Repo | `D:\revit\civly-revit-mcp--main` · GitHub `RatherN-t/civly-revit-mcp-` |
| Fork base | `mcp-servers-for-revit` monorepo (MIT, 241★) — 29 tools, zero MEP commands |
| Tool count | **62** (27 Aug 2026) |
| Transport | raw TCP on `localhost:8080` — **not** WebSocket |
| Units | millimetres at every tool boundary; `UnitUtils` converts at the commandset edge |
| Proven Revit version | **2026 only.** 2027 removed API Civly calls |
| Language split | TS server (`app/server`), C# plugin + commandset (`app/plugin`, `app/commandset`) |
| Clients today | Claude Code, Cursor. Civly Desktop (Electron) in progress |

### Tools worth knowing by name

- `build_duct_network` — the flagship. Nothing comparable exists publicly
- `get_api_docs` — 40,248 Revit API members, offline, ~1 ms lookup
- `get_linked_elements` — closed the federation gap (rooms live in the linked arch model)
- `get_routing_preferences` — a preflight verdict: *can this firm's template actually
  build ductwork?*
- `send_code_to_revit` — the long-tail escape hatch. A **trusted-operator** tool, never a
  sandbox; its output is always shown to the human before execution
- `get_obstacles`, `clash_detection`, cladding and image-processing tools — built Aug 2026

## What is proven, and at which ring

Ring 0 = TS compiles · Ring 0.5 = C# compiles · Ring 1 = contract tests against a mock
plugin · **Ring 2 = a real licensed-Revit session with a result file.**

| result | ring | date |
|---|---|---|
| 38/38 ducts, 19/19 fittings, 19/19 terminals connected | **2** | Aug 2026 |
| 607 ids / 819 elements deleted in one transaction | **2** | Aug 2026 |
| Duct sizing matches Revit's own engine (286 vs 290 FPM, 3438 vs 3440) | verified | 7 Aug |
| NCC 2025 text matches `egress.yaml` word-for-word | verified | 7 Aug |
| Revit help corpus: 34,714 topics, SQLite + FTS5 | built | 7 Aug |

**Ring 2 coverage is roughly 9%.** Reads, safety gates and rollback are verified in real
Revit. Most creation is not. Always name the ring.

## Known limits

- **The agent loop does not exist in any form.** The MCP cannot yet accept a sentence and
  act on it by itself — a human-driven client does that today
- **Safety gates are TypeScript-only.** The desktop app's dispatch path bypasses them
- Routing does plan-view keep-out only — **no vertical dodge around structure**
- Latency is unmeasured and was raised as a real complaint (4 Sep)
- The three project-notes tools fail to load under Electron (43 vs 46 tools)

## The competitive claim, stated precisely

The 14 Jul claim *"no public Revit MCP has MEP commands"* was **falsified on 4 Aug** by an
audit of `LuDattilo/revit-mcp-server`. That fork does create ducts — hardcoded to supply
air, buried inside a generic `create_line_based_element` tool, undocumented as MEP, with
no pipe/tray creation, no fittings and no connector logic.

> The narrowed claim, which is true and is the only one to use publicly:
> **no public Revit MCP ships a dedicated, documented MEP creation tier** — sized ducts,
> fittings on connectors, terminals with connection, system assignment — nor anything
> like `build_duct_network`.

Also true and worth saying out loud: that fork ships ~48 tools of architect breadth Civly
does not have, and real in-process Revit API tests Civly does not have. Civly is ahead on
MEP creation, safety gates and the Civly bridge — not uniformly ahead.

## History / Timeline

- **6 Jul 2026** — "make our own MCP" thread. ArchiCAD-flavoured at the time
- **14 Jul 2026** — **Revit wins the fork decision** (`docs/07` D1). Every validator in
  the record lives in Revit: Hesh, Sharath, the Reddit pain scan, the Aurecon/Arcadis/WSP
  targets. ArchiCAD MEP MCP parked
- **15 Jul** — M1 base reality gate passed
- **19 Jul** — 7 MEP tools Ring-1 green
- **4 Aug** — the competitive claim narrowed after the LuDattilo audit
- **5 Aug** — first handoff to Hassaan: `REVIT_TEST_GUIDE.md`, `START_HERE.md`, 13 tests
- **7 Aug** — `get_api_docs`, `get_linked_elements`, `get_routing_preferences`; Revit help
  scraped; sizing physics verified; Snowdon model found to contain real errors
- **21 Aug** — the agentic-IDE conversation. *"All we technically are is a harness"*
- **26 Aug** — in-Revit panel **cancelled** (D18); tool-count cap removed (D19)
- **27 Aug** — 62 tools; Kongwei demo; he wants to pilot
- **2 Sep** — the one-month plan: 2 Sep → 2 Oct, four parallel terminals
- **4 Sep** — four handoffs written: LEARN, MECH, ELEC, PLUMB

## Relationships

- Drives **Revit** (2026). Reads models linked from **[[Navisworks]]**-adjacent workflows
- Competes with **[[Archilabs]]** (also now targeting MEP firms) and GeoPogo's
  Claude-to-Revit plugin
- Feeds the learning harness described in
  [[Civly Product Trajectory — MCP, Harness, Agentic IDE]]
- Built by **[[Yash]]** and **[[Hassaan Shamshiri]]**

> [!WARNING] Contradiction — `civly context/Civly - Product and Tech.md` is stale
> That file (updated 14 Jun 2026, marked read-only by the schema) still describes Civly
> as **Tapir MCP + Archicad** with a Python codebase at
> `/Users/yashmittal/CivHub/BIMStudio/`, IFC as the only export, and MEP "not shipped".
> All four statements are now wrong. It was not edited because `civly context/` is
> read-only. **This page supersedes it.** Same applies to the Archicad sections of
> [[Civly Architecture Reference]], which are kept under Historical / Superseded.

## Open Questions

- Does Civly Desktop embed Revit, or sit beside it? (`docs/19` defers this deliberately)
- Which Revit versions does the pilot actually run? Only 2026 is proven
- Does the MEP tier stay in the fork, or go upstream? (`docs/07` D3 says stay, for now)
- What is the real latency profile per task type? Nobody has measured it

## Related

[[Civly Architecture Reference]] · [[Civly Product Trajectory — MCP, Harness, Agentic IDE]] ·
[[MEP Drafting — Schematic to LOD 200]] · [[Deliverables — Sep 2026]] · [[Data Partnership Moat]]
