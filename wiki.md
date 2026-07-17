---
title: "Wiki Home"
type: home
updated: 2026-07-17
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
| Add a new article/doc/note | Drop it in `raw/`, tell the AI: `"Ingest raw/filename.md"` |
| Ask a question | Just ask — AI reads [[index]] first, then relevant pages |
| Keep a good answer permanently | Ask AI to file it as an analysis in `pages/analyses/` |
| Health-check the wiki | Tell the AI: `"Lint the wiki"` |
| See what's been added | Check [[log]] |

---

## Browse by Category

- [[index]] — full page catalog
- [[log]] — chronological history of all operations

### Entities
People, organizations, products, places → `pages/entities/`
_(none yet — will populate as sources are ingested)_

### Concepts
Ideas, techniques, frameworks, theories → `pages/concepts/`
_(none yet)_

### Sources
Summaries of ingested documents → `pages/sources/`
_(none yet)_

### Analyses
Comparisons, syntheses, answered questions → `pages/analyses/`
_(none yet)_

---

## Recent Additions

_(updated by the AI on every ingest)_

| Date | What | Page |
|------|------|------|
| 2026-07-17 | Strategy: drafting vs coordination (Hesh + Reuben dilemma) | [[Drafting vs Coordination Strategy Shift]] |
| 2026-07-17 | CRM: Hesh Dian (BIM Accelerator) | [[Hesh Dian]] |
| 2026-07-17 | CRM: Reuben (transcript pending) | [[Reuben]] |
| 2026-06-14 | Wiki initialized | [[wiki]] |

---

## Architecture

```
Civly Brain/
├── CLAUDE.md / AGENTS.md   ← AI instructions (schema)
├── wiki.md                 ← this file (human home page)
├── index.md                ← machine-facing page catalog
├── log.md                  ← operation history
├── raw/                    ← your source documents (immutable)
│   └── assets/
└── pages/
    ├── entities/
    ├── concepts/
    ├── sources/
    └── analyses/
```

---

*Inspired by [Karpathy's LLM Wiki pattern](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f). The wiki is just a folder of markdown files — open in Obsidian, edit with any agent.*
