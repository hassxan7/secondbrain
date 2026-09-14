---
title: "Wiki Home"
type: home
updated: 2026-09-08
---

# Civly Brain Wiki

> A persistent, compounding knowledge base for Civly — maintained by LLMs.
> You curate and ask questions. The AI does the bookkeeping.

---

## What This Is

This wiki grows every time you add a source or ask a question worth keeping. Instead of re-deriving knowledge from scratch on every query, the LLM reads new sources, integrates them into existing pages, flags contradictions, and maintains cross-references — so the knowledge compounds over time.

**You own:** sourcing, exploration, asking the right questions.
**The LLM owns:** summarizing, cross-referencing, filing, bookkeeping.

---

## How to Use It

| I want to... | Do this |
|---|---|
| Add a YouTube transcript | Drop it in `raw/youtube/`, tell the AI: `"Ingest raw/youtube/filename.md"` |
| Add a contact | Drop notes in `raw/crm/`, or say `CRM <Name>` + details |
| Add a WhatsApp export | Drop the `_chat.txt` in `raw/whatsapp/` → becomes a to-do list |
| Ask a question | Just ask — AI reads [[index]] first, then relevant pages |
| Keep a good answer permanently | Ask AI to file it as a strategy/analysis page in `strategy/` |
| Build or change a tool | Work in `apps/<name>/` — see [[Apps Registry]] |
| Health-check the wiki | Tell the AI: `"Lint the wiki"` |
| See what's been added | Check [[log]] |

---

## Browse by Category

- [[index]] — full page catalog
- [[log]] — chronological history of all operations

### Entities
People, organizations, products, places → `pages/entities/`
[[Hassaan Shamshiri]] · [[Yash]] · [[Navisworks]] · [[video-use]] · [[HyperFrames]]

### Concepts
Ideas, techniques, frameworks, theories → `pages/concepts/`
[[BIM Drafting vs Coordination]] · [[Level of Development (LOD)]] · [[Data Partnership Moat]] · [[video-editing-pipeline]]

### Sources
Summaries of ingested documents → `pages/sources/` — 11 pages, see [[index]]

### Discipline knowledge
[[MEP Drafting — Schematic to LOD 200]] · [[Structural Engineering Overview for Civly]] · [[NCC 2022 Overview for Civly]] · [[Snaptrude]] · [[Archilabs]] · [[Finch]]

### Strategy & To-Do
Strategy, analyses, syntheses, roadmaps, GTM plans, pitch copy, and all to-do lists → `strategy/`

### Apps
Buildable tools that read this vault → `apps/` — see [[Apps Registry]]

### Right now
[[Deliverables — Sep 2026]] — the dated board. **PFC slides due Thu 11 Sep in `.pptx`.**

### Inbox
[[Raw Inbox]] — **19 sources waiting to be ingested**

---

## Recent Additions

_(updated by the AI on every ingest)_

| Date | What | Page |
|------|------|------|
| 2026-09-08 | **Architecture pivot recorded** (Archicad/Tapir → Revit MCP), to-do lists rebuilt from two months of WhatsApp, form filler built and run | [[Civly Revit MCP]] · [[Deliverables — Sep 2026]] · [[Civly Product Trajectory — MCP, Harness, Agentic IDE]] · [[Form Filler]] |
| 2026-09-07 | **Vault restructured** — `apps/` created (outreach engine moved in from `civly tools/`), 19 loose sources filed into `raw/youtube/`, root cleaned | [[Apps Registry]] · [[Raw Inbox]] · [[Form Filler]] |
| 2026-08-24 | Auto-ingest: 5 new source pages (1 MEP course lesson, 4 Revit tutorial transcripts) + cleanup of 2 already-processed CRM clippings | [[Engineering Drawing and Documentation (MEP Engineer Course)]] · [[Plumbing in Revit MEP Beginner Tutorial 1]] · [[REVIT 2023 FOR MEP - Lesson 1 Getting Started with an MEP Project]] · [[Lecture 14 HVAC Modelling in Progress 1 (Revit MEP Full Course)]] · [[Autodesk Revit - Full Beginner Course (Complete Project, Start to Finish)]] |
| 2026-07-14 | Ingested Reuben + reconciled both expert calls against current build | [[Reuben Roy Call — Competition Bids vs BIM Drafting]] · [[Civly Target Dilemma — MEP Drafting vs Competition Bids]] · [[Reuben Roy]] |
| 2026-06-25 | Ingested Z Fellows application → reusable pitch copy + founder profiles | [[Pitch Copy Library]] · [[Hassaan Shamshiri]] · [[Yash]] |
| 2026-06-18 | Ingested BIM mentor call → drafting-first pivot, LOD scope, data moat | [[BIM Mentor Call — Drafting vs Coordination & Data Moat]] |
| 2026-06-18 | Strategic direction synthesis + advisor bench | [[Civly Direction — Drafting-First Pivot (Jun 2026)]] · [[Advisor List & Question Routing]] |
| 2026-06-18 | Split to-do into per-owner lists | [[To-Do — Hassaan]] · [[To-Do — Yash]] |
| 2026-06-18 | MEP core path + concept pages | [[MEP Drafting — Schematic to LOD 200]] · [[BIM Drafting vs Coordination]] · [[Level of Development (LOD)]] · [[Data Partnership Moat]] |
| 2026-06-18 | Added BIM mentor (Hesh) to CRM as advisor | [[Hesh]] |
| 2026-06-14 | Wiki initialized | [[wiki]] |

---

## Architecture

```
Civly Brain/
├── CLAUDE.md / AGENTS.md   ← AI instructions (schema)
├── wiki.md                 ← this file (human home page)
├── index.md                ← machine-facing page catalog
├── log.md                  ← operation history
│
│   ── KNOWLEDGE ──────────────────────────
├── civly context/          ← company context (read-only)
├── raw/                    ← INBOX: unprocessed only. Empty = backlog clear.
│   └── youtube/  crm/  whatsapp/  assets/
├── processed/              ← sources move here after ingest
├── strategy/               ← all strategy, analyses + to-do lists
│   └── applications/       ← submitted applications
├── CRM/                    ← contacts
├── pages/                  ← knowledge
│   ├── sources/  entities/  concepts/
│   └── MEP/  Structural/  Compliance/  Competitors/
├── Excalidraw/             ← diagrams
│
│   ── APPS ───────────────────────────────
└── apps/                   ← every buildable tool. Code lives here, nowhere else.
    ├── outreach-engine/    ← LinkedIn/CRM outreach (own git repo)
    ├── form-filler/        ← URL → filled application (spec)
    ├── tapreview-site/     ← NFC review-card site
    └── ingest/             ← local Ollama pipeline
```

**The one rule:** knowledge goes in the knowledge folders, code goes in `apps/`,
and nothing lands at the root. Apps read the vault and write knowledge back
out to `strategy/` / `CRM/` / `pages/` — never into their own folder.

---

*Inspired by [Karpathy's LLM Wiki pattern](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f). The wiki is just a folder of markdown files — open in Obsidian, edit with any agent.*
