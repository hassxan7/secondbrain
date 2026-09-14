---
title: "Raw Inbox"
aliases: ["Raw Inbox"]
type: analysis
tags: [infrastructure, ingest]
created: 2026-09-07
updated: 2026-09-07
sources: 0
---

# raw/ — the inbox

**Unprocessed sources only.** Everything here is waiting to be ingested.
Once a source is summarised into `pages/sources/`, the file **moves to
`processed/`**. If `raw/` is empty, the backlog is clear.

> [!note] The "never modify raw/" rule
> Source files in here are never edited — that rule is in `CLAUDE.md` and it
> holds. This README and the `.gitkeep` files are infrastructure, not sources,
> and are the only exception.

| Folder | Drop what | Becomes |
|---|---|---|
| `raw/youtube/` | YouTube transcript `.md` clippings | Source page in `pages/sources/` (+ `pages/MEP/` if HIGH + MEP) |
| `raw/crm/` | Contact notes `.md` / `.txt` | `CRM/First-Last.md` |
| `raw/whatsapp/` | WhatsApp `_chat.txt` exports | `strategy/Civly To-Do — DATE.md` |
| `raw/assets/` | Images from clipped articles | Referenced inline by source pages |

The local pipeline in [apps/ingest](../apps/ingest/) watches these folders.
See [apps/ingest/SETUP.md](../apps/ingest/SETUP.md).

---

## Current backlog — 19 unprocessed sources (as of 2026-09-07)

All moved here on 2026-09-07 from the old root-level `MEP/`, `MMEP/`, and
`Tutorials/` folders. None have been ingested — no `Civly Relevance` block,
no source page.

**Revit MEP Full Course (PTS CAD EXPERT), Lectures 1–12 + 15** — 13 files.
Lectures 13 and 14 are already in `processed/`; **13 is missing entirely**.

**Standalone courses** — 5 files:
- Complete Revit MEP Course — HVAC / Plumbing / Electrical / Fire Fighting
- Complete Revit MEP Hotel Design (10+ hrs)
- Complete Revit MEP Office Project For Beginners (4+ hrs)
- HVAC complete design & drafting in Revit
- REVIT 2023 FOR MEP — HVAC SYSTEMS COMPLETE

> [!WARNING] Broken frontmatter — `REVIT MEP Tutorial.md`
> Its frontmatter claims `title: "How to paste an image into Claude Code (in
> 40 seconds)"` with a matching `source:` URL. The actual content is a
> **10-episode Revit MEP electrical course** (linking arch models, receptacles,
> panel circuiting, lighting, site plans, PDF export — 2,457 lines).
> The clipper grabbed the wrong metadata. Left unmodified per the raw/ rule —
> **fix the frontmatter at ingest time**, and find the real source URL first.

Most of this is Revit-UI-operation content. Per `CLAUDE.md`, Revit UI
operations score **NOT** relevant on their own — Civly drives Archicad via
Tapir, not Revit. Ingest for the *engineering* content (sizing, load calcs,
system logic, code rules), not the click-paths.

## Related

[[Apps Registry]] · [[MEP Drafting — Schematic to LOD 200]] · [[Technical Roadmap — What to Build First]]
