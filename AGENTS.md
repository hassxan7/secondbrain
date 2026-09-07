# Wiki Schema — Agents Configuration

You are a disciplined wiki maintainer. This document defines the structure, conventions, and workflows you follow when operating on this wiki. This file is the equivalent of CLAUDE.md for non-Claude agents (e.g. OpenAI Codex, OpenCode, Pi, etc.).

---

## Directory Layout

```
Civly Brain/
├── CLAUDE.md          ← schema for Claude Code
├── AGENTS.md          ← this file (schema for all other agents)
│
│   ── KNOWLEDGE ──────────────────────────────────────────────
├── civly context/     ← Civly company context files (read-only, never modify the .md content)
├── raw/               ← INBOX: unprocessed sources ONLY. Empty = backlog clear.
│   ├── youtube/       ← YouTube transcript clippings awaiting ingest
│   ├── crm/           ← contact notes awaiting a CRM page
│   ├── whatsapp/      ← WhatsApp exports awaiting a to-do list
│   └── assets/        ← images downloaded from clipped articles
├── processed/         ← sources move here after ingest/summarization (top-level, NOT under raw/)
├── pages/             ← KNOWLEDGE pages only
│   ├── sources/       ← one summary page per ingested source
│   ├── entities/      ← named things: people, organizations, products, places (incl. founders)
│   ├── concepts/      ← ideas, techniques, frameworks, theories
│   ├── MEP/           ← curated MEP knowledge pages (HIGH-relevance MEP sources only)
│   ├── Structural/    ← curated structural knowledge
│   ├── Compliance/    ← curated building-code / NCC knowledge
│   └── Competitors/   ← competitor profiles
├── strategy/          ← ALL strategy, analyses, syntheses, AND to-do lists (flat folder)
│   └── applications/  ← one file per submitted application (written by apps/form-filler)
├── CRM/               ← one page per person, indexed at CRM/index.md
├── Excalidraw/        ← diagrams
│
│   ── APPS ───────────────────────────────────────────────────
├── apps/              ← ALL buildable tools. Code lives here and nowhere else.
│   ├── README.md      ← app registry — every app has a row
│   ├── outreach-engine/ ← LinkedIn/CRM outreach (own git repo + GitHub remote)
│   ├── form-filler/   ← fill an application form from a URL (spec stage)
│   ├── tapreview-site/← NFC review-card landing page
│   └── ingest/        ← local Ollama pipeline (transcripts / WhatsApp / CRM notes)
│
├── wiki.md            ← human-facing home page (you update Recent Additions)
├── index.md           ← machine-facing page catalog (you maintain this)
└── log.md             ← append-only chronological record (you maintain this)
```

> **Streamlined routing:** incoming source → the right `raw/` subfolder (`youtube/`, `crm/`, `whatsapp/`); after ingest **move the source to `processed/`** (top-level). Source summaries → `pages/sources/`; knowledge → the matching `pages/` subfolder; **all strategy, analyses, and to-do lists → `strategy/`** (flat, never in `pages/`); **anything executable → `apps/<name>/`** (never at the root).

> **Rules for `apps/`:** one folder per app, registered in `apps/README.md`. Apps write knowledge outward to `strategy/`/`CRM/`/`pages/`, never into their own folder. `node_modules/`, `.venv/`, `dist/`, `.vercel/`, `__pycache__`, `.env`, `*.sqlite` and `apps/**/data/` are gitignored vault-wide — this vault syncs over OneDrive, so weight is a real cost. `apps/outreach-engine/` is its own git repo (`RatherN-t/Civly-outreach-engine`), gitignored by the vault; commit it with `git -C apps/outreach-engine ...`. App internals are hidden from Obsidian via `userIgnoreFilters` in `.obsidian/app.json`.

---

## Civly Context (read before evaluating any source or contact)

**Full architecture reference:** [[Civly Architecture Reference]] — read it for the stack,
the ring system, the honest gaps, and the claim guardrails. Direction and horizon:
[[Civly Product Trajectory — MCP, Harness, Agentic IDE]]. Dated commitments:
[[Deliverables — Sep 2026]]. Summary below.

### How Civly Works (Sep 2026)

> [!WARNING] This replaced the Archicad/Tapir description on 14 Jul 2026
> Civly used to be Claude + Tapir MCP + Archicad + a Python feasibility engine exporting
> IFC. **It is now a Revit MCP server plus a Revit plugin.** Anything in this vault
> scored before Sep 2026 against Tapir/IFC-writer/YAML/calcs surfaces may be mis-scored.

**Civly is a Revit MCP server plus a C# Revit plugin.** An AI client (Claude Code, Cursor,
soon Civly's own desktop app) calls MCP tools; the tools drive Revit's API through the
add-in; every write is a named transaction the human can undo with one Ctrl+Z.

```
AI client  --MCP-->  TS server  --raw TCP :8080-->  C# plugin  --Revit API-->  the .rvt
```

Code lives at `D:\revit\civly-revit-mcp--main` (GitHub `RatherN-t/civly-revit-mcp-`).
That repo has its own `CLAUDE.md`, `PROGRESS.md`, and `docs/`. This vault does not
duplicate them.

**Base:** a fork of the MIT `mcp-servers-for-revit` monorepo — 29 tools and **zero MEP
commands**. That zero is the wedge. Civly is now at **62 tools**.

**Proven in real Revit (Ring 2):** 38/38 ducts, 19/19 fittings, 19/19 terminals
connected; 607 ids / 819 elements deleted in one transaction. Duct sizing verified
against Revit's own engine to rounding. NCC 2025 verified word-for-word.

**Not proven:** Ring 2 coverage is ~9%. **The agent loop does not exist in any form.**
Safety gates are TypeScript-only, so the desktop app bypasses them. `service/` (the
hosted control plane) has never been deployed. Only Revit **2026** is proven.

**Units are millimetres at every tool boundary**, converted with `UnitUtils` at the
commandset edge. Revit's internal unit is decimal feet. This is the number-one LLM
failure mode and it is killed at the schema, not in prompts.

**The rings** (the honesty gate — always say which one you are quoting):
Ring 0 = TS compiles · Ring 0.5 = C# compiles · Ring 1 = contract tests against a mock,
no Revit · Ring 2 = a real licensed-Revit session **with a result file**.
Harness green is not Revit green.

### The trajectory — MCP now, harness next, agentic IDE later

Civly is not trying to be an MCP. The MCP is the hands and the credibility instrument.

1. **MCP (now)** — proves capability, earns pilots, earns data.
2. **Learning harness + ML (in progress, the moat)** — the DI/diff loop: take a matched
   architectural + MEP model pair, delete the MEP, ask Civly to rebuild it, diff against
   what the engineer actually built, iterate. The moat is **matched input/output pairs at
   volume**, not the code.
3. **Agentic IDE (later)** — a modeller-agnostic application with Civly's own interface
   and the intelligence behind it, driving Revit today and other modellers later.
   Civly Desktop (Electron) is its first concrete step. **No design, no spec, no date —
   a direction, not a commitment. Never put it on a slide as one.**

> **Deterministic where physics decides. Learned where practice decides.**
> Sizing, pressure drop and code clearances are calculated, never predicted. The learned
> layer chooses among valid options; it never produces a number. Evidence: the Snowdon
> reference model contains real engineering errors (one duct at 66x its friction target),
> so anything trained to imitate it learns the faults.

### The Four Implementation Surfaces

Evaluate every source by whether it helps with at least one:

| Surface | What it is | Knowledge that helps |
|---|---|---|
| **1 — MCP tool schemas** (`app/server`, TS + zod) | What the AI can ask for, and in what shape | Which Revit operations matter to a drafter; enum foldings; what a tool should refuse |
| **2 — C# commandset** (`app/commandset`) | The Revit API calls that do the work | Revit API signatures, MEP connectors, routing preferences, family types, unit handling |
| **3 — Design brain + rule packs** | Deterministic sizing and compliance logic | Airflow and duct-sizing formulas, pressure drop, NCC/ASHRAE rules, rules of thumb |
| **4 — The learning harness** | How Civly beats a bare prompt | Matched arch + MEP model pairs, worked tutorials with visible outcomes, "why 200mm not 250mm" |

### Relevance Scoring

- **HIGH:** teaches something directly implementable in at least one surface above
- **MEDIUM:** informs product strategy, ICP, or market context without implementable content
- **LOW:** tangential — no clear path to any surface
- **NOT:** aesthetics, construction site management, pure software marketing

> [!important] Revit UI content is NO LONGER automatically irrelevant
> The old rule said "Revit UI operations = NOT relevant, we don't use Revit." **Reversed
> — Civly drives Revit.** A tutorial showing *how a drafter actually does a task* is
> Surface 1 and Surface 4 material: it says which tools to build and gives the harness a
> worked example. Score the **engineering and the workflow**, not the click-path. A video
> that only shows where the ribbon buttons are is still LOW.

### Discipline Priority

1. **MEP (CRITICAL)** — the wedge; four lanes live (MECH, ELEC, PLUMB, LEARN)
2. **Compliance / NCC (HIGH)** — the differentiation claim; NCC 2025 text verified
3. **Structural (HIGH)** — partially shipped
4. **Architectural (HIGH)** — cladding, families, floorplan ingest
5. **BIM coordination (MEDIUM)** — downstream; informs handoff quality
6. **AEC market dynamics (MEDIUM)** — GTM and ICP messaging

### What Civly Is NOT Doing

Not making design decisions (it drafts; the human signs off). Not using an LLM for numbers
or compliance calcs. Not replacing Navisworks/ACC. Not an in-Revit panel (cancelled
26 Aug). Not multi-tenant cloud SaaS — the control plane is hosted, the modelling is local.

### What we must NOT say — claim guardrails

These bind pitch copy, LinkedIn posts and application answers as much as code:

- not "secure"; not "your data never leaves your network" (telemetry leaves)
- not "sandboxed" about `send_code_to_revit` — it is a trusted-operator tool
- not "works in Revit" without a result file
- not "supports 2020–2027" — **2026 is what is proven**
- not "designs HVAC" — schematic supply layout, ~24% of as-built airflow measured
- not "routes around structure" beyond plan-view keep-out (no vertical dodge)
- not "no public Revit MCP has MEP commands" — falsified 4 Aug. The claim that survives:
  **no public Revit MCP ships a dedicated, documented MEP creation tier.**
- say **"we spoke to 78 architects"**, never "hundreds" — be specific, it is stronger

---

## Page Conventions

### Frontmatter (YAML, required on every page)

```yaml
---
title: "Page Title"
type: entity | concept | source | analysis
tags: [tag1, tag2]
created: YYYY-MM-DD
updated: YYYY-MM-DD
sources: 0          # number of raw sources this page draws from
---
```

### Body structure

- **Summary** (2–4 sentences at the top, after frontmatter)
- **Sections** with `##` headings relevant to the page type (see below)
- **Cross-references**: link liberally with `[[Page Name]]` (Obsidian wiki-link style). Every page should link to at least 2–3 others.
- **Contradictions**: if newer sources conflict with what's written, add a `> [!WARNING] Contradiction` callout block noting the conflict and both sources.
- **Open questions**: end every substantive page with a `## Open Questions` section listing things still unknown or worth investigating.

### Page types

**Entity page** (`pages/entities/`): a named thing.
Sections: Overview · Key facts · History/Timeline · Relationships · Appearances in sources · Open Questions

**Concept page** (`pages/concepts/`): an idea, technique, or framework.
Sections: Definition · Why it matters · Variants/Related · Examples · Critiques · Open Questions

**Source page** (`pages/sources/`): summary of one raw document.
Sections: TL;DR · Key claims · Notable quotes · Entities mentioned · Concepts mentioned · What changed in the wiki

**Analysis / strategy page** (`strategy/`): a comparison, synthesis, roadmap, GTM/outreach plan, pitch copy, or answer worth keeping. **All to-do lists also live in `strategy/`.**
Sections: Question/Prompt · Methodology · Findings · Limitations · Related pages

---

## Operations

### Ingest

When told to ingest a new source:

1. Read the source file from `raw/`.
2. Discuss key takeaways briefly with the user.
3. Create a source page in `pages/sources/` named after the source file.
4. Update or create entity pages for any named entities introduced.
5. Update or create concept pages for any key ideas introduced.
6. Update `index.md` — add the new source page and any new entity/concept pages.
7. Update `wiki.md` — add the new source to the Recent Additions table.
8. Append an entry to `log.md`:
9. move the source file from the root raw/ directory to the top-level processed/ directory
   ```
   ## [YYYY-MM-DD] ingest | <Source Title>
   Summary of what was added/updated. Pages touched: [[page1]], [[page2]], ...
   ```
10. Report back: list every page you touched and the net change.

### Query

When answering a question:

1. Read `index.md` to find relevant pages.
2. Read those pages and synthesize an answer with `[[page]]` citations.
3. Ask: is this answer worth keeping as a permanent analysis? If yes, create a page in `strategy/`.
4. Append to `log.md`:
   ```
   ## [YYYY-MM-DD] query | <Question summary>
   Answer summary. Filed as analysis: yes/no.
   ```

### Ingest YouTube / Video Source

When a file in `raw/` is a YouTube transcript (has a `source:` YouTube URL in frontmatter or contains a transcript):

1. Read the Civly context block above. Keep it in mind for step 5.
2. Read the full raw file (title, description, transcript).
3. Produce a **source page** in `pages/sources/` with this structure:

```markdown
---
title: "<Video Title>"
type: source
tags: [youtube, <topic-tags>]
source_url: "<YouTube URL>"
channel: "<Channel Name>"
published: YYYY-MM-DD
created: YYYY-MM-DD
updated: YYYY-MM-DD
sources: 1
---

## TL;DR
2–4 sentence summary of what this video teaches.

## Key Claims / Techniques
Bullet list of the most important points, facts, or methods covered.

## Civly Relevance
**Score: HIGH / MEDIUM / LOW / NONE**

Explain in 3–5 sentences exactly why this is or isn't useful to Civly. Be specific:
- Which part of Civly's product or roadmap does it inform?
- Which workflows, user types, or technical decisions does it shed light on?
- Are there specific timestamps or sections that are most relevant?

## Concepts Mentioned
Links to concept pages this video touches: [[concept1]], [[concept2]]

## Entities Mentioned
Links to entity pages: [[entity1]], [[entity2]]

## What Changed in the Wiki
List any pages created or updated as a result of this ingest.

## Notable Quotes
Timestamped quotes worth referencing: "quote" — <Channel> (<timestamp>)
```

4. **Inject comprehensive notes into the processed file itself.** Before moving it, insert the following block directly after the frontmatter `---` line in the raw file:

```markdown
> [!tip] Civly Relevance — **HIGH / MEDIUM / LOW**
> <2–3 sentences on why this is or isn't useful to Civly — specific, not generic>

## Notes

<Full transcript condensed into structured bullet points, organized by section/topic.
Cover EVERY meaningful point, technique, example, and insight from the entire video.
The user should be able to read these notes instead of watching the video.
Do NOT write a brief summary — write comprehensive study notes.>

### <Section heading from video>
- <specific point>
- <specific point>
```

5. **MEP routing rule:** if the Civly Relevance score is HIGH **and** the video is primarily about MEP system design, ductwork, plumbing, HVAC, or multi-discipline coordination, **also create a curated knowledge page in `pages/MEP/`** extracting the most Civly-relevant concepts as a permanent reference. MEP knowledge pages focus on what Civly needs to implement, not on how to use Revit.

6. Update or create entity/concept pages for key things introduced.
7. Update `index.md` and `wiki.md` Recent Additions.
8. **Move the source file** from `raw/` to `processed/` (top-level).
9. Append to `log.md`:
   ```
   ## [YYYY-MM-DD] ingest | <Video Title>
   Civly relevance: HIGH/MEDIUM/LOW. Pages touched: [[page1]], [[page2]], ...
   Moved to processed/.
   ```
8. Report back with the relevance score and reasoning.

### CRM — Add or Update a Contact

When told `CRM <Name>` followed by details about a person:

1. Read the Civly context block above.
2. Determine the person's **category** and **Civly relevance**.
3. Create or update their page at `CRM/<First-Last>.md`.

**Page format:**
```markdown
---
title: "<Full Name>"
type: crm
category: <category>
civly_relevance: HIGH | MEDIUM | LOW
tags: [crm, <category-tag>, <topic-tags>]
linkedin: "<URL if known>"
organisation: "<Company / Firm>"
location: "<City, Country>"
met: "<Event or context where you met>"
met_date: YYYY-MM-DD
created: YYYY-MM-DD
updated: YYYY-MM-DD
follow_up: "<Next action, if any>"
---

## Who They Are
2–3 sentence bio.

## Why They Matter to Civly
**Category:** <category>
**Relevance: HIGH / MEDIUM / LOW**
3–5 sentences on specifically how they can help.

## Key Details
Bullet list: projects, expertise, network, opinions shared.

## How We Met
Context: event, date, who introduced you, what was discussed.

## Follow-up Actions
- [ ] <next step>

## Related Pages
[[Civly - Overview and Status]], other related contacts
```

4. Update `CRM/index.md`.
5. Append to `log.md`:
   ```
   ## [YYYY-MM-DD] crm | <Name>
   Category: <category>. Relevance: HIGH/MEDIUM/LOW. Action: created/updated.
   ```

**CRM Categories:** customer · design-partner · investor · accelerator · expert · integration · channel · connector · press · other

**Relevance:** HIGH = direct ICP/active investor/urgent expert; MEDIUM = potential lead/warm contact; LOW = tangential but worth keeping.

### Lint

When asked to lint the wiki:

1. Read `index.md` and all pages it references.
2. Check for:
   - Pages with no inbound links (orphans)
   - Contradiction callouts that reference unresolved conflicts
   - Frontmatter `updated` dates that are stale relative to `log.md`
   - Concepts mentioned in body text but lacking their own page
   - Missing cross-references between clearly related pages
   - Data gaps the user could fill with a web search
3. Produce a lint report and propose fixes. Do not auto-fix without user approval.
4. Append to `log.md`:
   ```
   ## [YYYY-MM-DD] lint
   Issues found: N. Fixed: M. Deferred: K.
   ```

---

## Style Rules

- Write in third person for entity/concept pages; first-person is fine in analysis pages.
- Be concise. Prefer bullet points over prose paragraphs for factual claims.
- Always date-stamp quotes: `"quote" — Source Title (YYYY)`.
- Never delete content — if something is superseded, move it to a `### Historical / Superseded` subsection.
- Keep page titles short and consistent — use the same name everywhere it's referenced.
- Do not modify anything in `raw/`. Ever.

---

## Evolving This Schema

When a convention proves awkward, propose a change here and update both CLAUDE.md and AGENTS.md with user approval. Document in `log.md`.
