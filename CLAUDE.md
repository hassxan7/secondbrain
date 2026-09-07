# Wiki Schema — Claude Code Configuration

You are a disciplined wiki maintainer. This document defines the structure, conventions, and workflows you follow when operating on this wiki. Read it at the start of every session.

---

## Directory Layout

```
Civly Brain/
├── CLAUDE.md          ← this file (schema for Claude Code)
├── AGENTS.md          ← same schema for other agents (Codex, OpenCode, etc.)
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

> [!important] Streamlined routing (where new files go)
> - **Incoming source** → lands in the right `raw/` subfolder (`youtube/`, `crm/`, `whatsapp/`). After you ingest/summarize it, **move the source file to `processed/`** (top-level). `raw/` only ever holds things not yet processed.
> - **Source summary page** → `pages/sources/`. **Entity/concept/MEP/Structural/Compliance/Competitor knowledge** → the matching `pages/` subfolder.
> - **Anything strategic** — analyses, syntheses, comparisons, roadmaps, GTM/outreach plans, pitch copy, **and every to-do list** → `strategy/` (flat). Strategy and to-dos do NOT go in `pages/`.
> - **Anything executable** — scripts, servers, sites, MCP tools → `apps/<name>/`. Never at the vault root, never inside `pages/` or `strategy/`.

> [!important] Rules for `apps/`
> 1. **One folder per app**, directly under `apps/`. Add a row to `apps/README.md` when you create one.
> 2. **Apps write knowledge outward.** An app that produces an analysis, a contact, or a decision writes it to `strategy/`, `CRM/`, or `pages/` — never into its own folder.
> 3. **Never commit or sync weight.** `node_modules/`, `.venv/`, `dist/`, `.vercel/`, `__pycache__` are gitignored vault-wide. Rebuild them; don't store them. This vault syncs over OneDrive — a 55 MB virtualenv is a real cost.
> 4. **Secrets never enter the vault repo.** `.env`, `*.sqlite`, and `apps/**/data/` are gitignored. Commit `.env.example` instead.
> 5. **`apps/outreach-engine/` has its own git repo** (`RatherN-t/Civly-outreach-engine`) and is gitignored by the vault. Commit and push it from inside its own folder: `git -C apps/outreach-engine ...`.
> 6. **Obsidian ignores app internals** via `userIgnoreFilters` in `.obsidian/app.json`. Add a line there when an app has code the graph shouldn't index.

---

## Civly Context (read before evaluating any source or contact)

**Full architecture reference:** [[Civly Architecture Reference]] — read it for detailed implementation surfaces and relevance heuristic. Summary below.

### How Civly Works (June 2026)

**Layer 1 — BIM Generator:** Claude Code drives Archicad through the **Tapir MCP plugin** to build BIM models step-by-step. Tapir exposes Archicad API as MCP tools (place wall, place column, place slab, etc.). Output = Archicad model → IFC export.

**Layer 2 — Feasibility Engine (Python):** Reads IFC → IfcOpenShell → SemanticProject (Pydantic) → deterministic calcs ← YAML rule packs → scenarios (JSON mutations) → PDF report. LLM is NEVER used for numbers or compliance calcs (D6).

**Layer 3 — React UI:** Upload IFC → space mapping → dashboard → scenario builder → PDF export.

**Shipped MVP:** Architecture + structural for Sydney Class 2 Apartments (Archicad 29). 4 storeys, 42 RC columns (400×400mm / 7.2m grid), 47 walls. NCC 2022 schedules live. BOM shipped.

**MEP status (NOT shipped):** No Tapir MCP MEP support yet. Parallel path: `mep.py` + `ifc_writer` generates MEP IFC directly (bypasses Archicad). Branch `feat/p2-c3-ifc-space` implements `IfcSpace` per `MepZone`.

**IFC is the ONLY format (D1).** Not .rvt, not .dwg. Everything in, everything out as IFC.

**Local-first (D7).** `docker compose up`, SQLite, no cloud, no outbound calls from engine.

### The Four Implementation Surfaces

Evaluate every source by whether it helps with ≥ 1 surface:

| Surface | What it is | Knowledge that helps |
|---|---|---|
| **1 — Tapir MCP Calls** | Claude calls MCP tools to build Archicad model | Column sizing for spans, MEP element sizing for zones, spatial relationships and clearances |
| **2 — IFC Writer** (`ifc_writer`, `mep.py`) | Python generates IFC elements directly | Which IFC entity = which physical element, IFC spatial hierarchy, MepZone → IfcSpace |
| **3 — YAML Rule Packs** (`rules/`) | NCC 2022, HK CoP, generic; YAML data files | NCC ventilation rates, parking ratios, egress rules, jurisdiction-specific values |
| **4 — Calc Functions** (`calcs/`) | Pure functions: SemanticProject → ResultSet | Engineering formulas (airflow, duct sizing, column load capacity, structural calcs) |

### Relevance Scoring

- **HIGH:** teaches something directly implementable in ≥ 1 surface above
- **MEDIUM:** informs product strategy, user understanding, or market context without direct implementable content
- **LOW:** tangential — no clear path to any implementation surface
- **NOT:** aesthetics, construction site management, Revit UI operations (we don't use Revit)

### Discipline Priority

1. **MEP (CRITICAL)** — in active dev; mep.py + ifc_writer is the implementation path
2. **Compliance / Code (HIGH)** — NCC 2022 is the live rule pack; differentiation claim
3. **Structural (HIGH, partially shipped)** — column sizing, slab depth for Class 2/5/6
4. **IFC / Open BIM (HIGH)** — ifc_writer correctness is load-bearing
5. **BIM Coordination (MEDIUM)** — informs what coordinators need from Civly's output
6. **AEC market dynamics (MEDIUM)** — go-to-market and ICP messaging

### What Civly Is NOT Doing
Not a Revit plug-in. Not replacing Navisworks/ACC. Not making design decisions (evaluates; never authors). Not using LLM for calcs. Not cloud SaaS.

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
   ```
   ## [YYYY-MM-DD] ingest | <Source Title>
   Summary of what was added/updated. Pages touched: [[page1]], [[page2]], ...
   ```
9. Report back: list every page you touched and the net change.

### Query

When answering a question:

1. Read `index.md` to find relevant pages.
2. Read those pages and synthesize an answer with `[[page]]` citations.
3. Ask: is this answer worth keeping as a permanent analysis? If yes (or if the user wants it), create a page in `strategy/`.
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

4. **Inject comprehensive notes into the processed file itself.** Before moving it, insert the following block directly after the frontmatter `---` line in the raw file, so it is the first thing visible when opened in Obsidian:

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

### <Next section>
- ...
```

5. **MEP routing rule:** if the Civly Relevance score is HIGH **and** the video is primarily about MEP system design, ductwork, plumbing, HVAC, or multi-discipline coordination, **also create a curated knowledge page in `pages/MEP/`** that extracts the most Civly-relevant concepts from the notes into a permanent reference page. MEP knowledge pages should focus on what Civly needs to implement, not on how to use Revit.

6. Update or create entity/concept pages for key things introduced.
7. Update `index.md` and `wiki.md` Recent Additions.
8. **Move the source file** from `raw/` to `processed/` (top-level; rename the file path).
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
2. Determine the person's **category** (see categories below).
3. Determine their **Civly relevance** (see scoring below).
4. Create or update their page at `CRM/<First-Last>.md`:

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
2–3 sentence bio. Role, organisation, background.

## Why They Matter to Civly
**Category:** <category>
**Relevance: HIGH / MEDIUM / LOW**

Explain in 3–5 sentences specifically how this person could help Civly:
- As a customer/user: are they the ICP? What firm size, what tools do they use?
- As an investor: what stage/cheque size, what's their thesis, AEC interest?
- As an expert: what knowledge can they validate or provide?
- As a partner: what integration, distribution, or co-sell opportunity?

## Key Details
Bullet list of what you know: projects, expertise, network, opinions shared.

## How We Met
Context: event name, date, who introduced you, what was discussed.

## Follow-up Actions
- [ ] <specific next step with date if known>

## Related Pages
Links to relevant Civly context or other CRM contacts: [[Civly - Overview and Status]], [[Name]]
```

5. Update `CRM/index.md` — add or update their row.
6. Append to `log.md`:
   ```
   ## [YYYY-MM-DD] crm | <Name>
   Category: <category>. Relevance: HIGH/MEDIUM/LOW. Action: created/updated.
   ```

**CRM Categories:**

| Category | Tag | Who |
|----------|-----|-----|
| Customer | `customer` | Architect, AEC engineer, BIM coordinator, developer/builder using or evaluating Civly |
| Design Partner | `design-partner` | Active collaborator shaping the product (like Michael Westerlund) |
| Investor | `investor` | VC, angel, family office, fund — any funding source |
| Accelerator | `accelerator` | Blackbird, Startmate, Antler, YC, etc. |
| Industry Expert | `expert` | MEP engineer, structural engineer, code consultant, BIM specialist — knowledge source |
| Integration Partner | `integration` | Tool/platform that could integrate with or alongside Civly (Finch3D type) |
| Channel Partner | `channel` | Firm that could resell, distribute, or refer Civly |
| Connector | `connector` | Person with strong network in AEC, proptech, or VC — useful for intros |
| Press / Analyst | `press` | Journalist, blogger, researcher covering AEC/proptech/AI |
| Other | `other` | Does not fit above |

**Relevance scoring:**
- **HIGH**: Direct ICP customer, active investor, or expert whose knowledge Civly urgently needs
- **MEDIUM**: Potential future customer, warm investor lead, useful validator or connector
- **LOW**: Tangentially related, worth keeping but no immediate action

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

This document should evolve as the wiki grows. When a convention proves awkward in practice, propose a change here and update both CLAUDE.md and AGENTS.md with the user's approval. Document the change in `log.md`.
