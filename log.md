# Wiki Log

Append-only chronological record of all operations.
Parse recent entries with: `grep "^## \[" log.md | tail -10`

---

## [2026-07-17] analysis | Drafting vs Coordination Strategy Shift
Captured the dilemma between operator advice ([[Hesh Dian]], [[Reuben]] — coordination-first) and Civly's working wedge (drafting-first / not a coordination tool).
Created: [[Drafting vs Coordination Strategy Shift]] (pages/analyses/).
CRM: [[Hesh Dian]] (expert, HIGH) — public BIM Accelerator teaching used as transcript base ([[How to Learn the BIM Coordination Skillset]], [[How to Learn Revit and BIM Quickly]]).
CRM: [[Reuben]] (expert, HIGH) — stub; private call transcript not yet in vault — drop into `raw/` to ingest.
Updated: [[index]], [[wiki]] Recent Additions, [[CRM/index]].
Note: `civly context/` left untouched (read-only).

## [2026-06-14] schema | Architecture-grounded relevance + Structural + Compliance folders
Read all civly context files and synthesized actual architecture (Tapir MCP + ifc_writer + YAML rule packs + calcs) into master reference.
Created: [[Civly Architecture Reference]] (pages/analyses/) — four implementation surfaces + relevance heuristic + discipline priority order.
Created: [[Structural Engineering Overview for Civly]] (pages/Structural/) — column sizing, slab depths, wall types for Tapir MCP calls.
Created: [[NCC 2022 Overview for Civly]] (pages/Compliance/) — NCC volume structure, key rates, YAML rule format, gaps.
Updated CLAUDE.md and AGENTS.md: Civly Context block now references actual MCP/IFC/rules architecture + four surfaces + discipline priority.
Updated index.md: added Structural, Compliance, and Analyses sections.

## [2026-06-14] schema | Upgraded ingest standard + MEP knowledge section
Rewrote all three processed YouTube files with full comprehensive study notes (entire transcript → structured bullet points, every section covered).
Created `pages/MEP/` knowledge folder for HIGH-relevance MEP sources.
Created: [[Revit MEP Five-Discipline Coordination Model]], [[MEP Coordination Requirements]].
Updated CLAUDE.md and AGENTS.md: YouTube ingest now requires comprehensive notes (not brief summary), plus MEP routing rule (HIGH MEP sources → pages/MEP/ page also created).

## [2026-06-14] crm | Andrew Tang-Smith
Category: customer. Relevance: HIGH. Action: created (reformatted from raw LinkedIn clip).
Principal Architect, Studio Tangara, Perth. Exact Civly ICP — independent studio, 15+ yrs tier-1 experience, mixed-use/residential projects. Follow-up: pilot outreach.

## [2026-06-14] ingest | Revit MEP Tutorial for Complete Beginners
Civly relevance: HIGH. Source: SourceCAD (YouTube). Pages created: [[Revit MEP Tutorial for Complete Beginners]].
Key insight: five-discipline linking structure in Revit maps directly to Civly's IFC multi-discipline output model. HRU/VAV zone placement logic = MEP proposal logic Civly needs to implement.
Moved to raw/processed/.

## [2026-06-14] ingest | How to Learn the BIM Coordination Skillset
Civly relevance: HIGH. Source: BIM Accelerator (YouTube). Pages created: [[How to Learn the BIM Coordination Skillset]].
Key insight: BIM coordinator persona (services, plant room, facade, precast coordination) = exact Civly automation target. Navisworks is the competing coordination tool. Market: 5–7yr stagnant modellers = potential Civly converts.
Moved to raw/processed/.

## [2026-06-14] ingest | How to Learn Revit and BIM Quickly
Civly relevance: MEDIUM. Source: BIM Accelerator (YouTube). Pages created: [[How to Learn Revit and BIM Quickly]].
Key insight: market context — Revit still dominant, IFC/coordination skills unlock career. Confirms Civly must output IFC for adoption.
Moved to raw/processed/.

## [2026-06-14] schema | Added YouTube ingest + CRM operations
Added Civly context block, YouTube/video ingest operation, CRM operation, and CRM category taxonomy to CLAUDE.md and AGENTS.md.
Created: CRM/index.md, raw/processed/ directory.

## [2026-06-14] ingest | video-use + HyperFrames (GitHub repos)
Pulled knowledge from https://github.com/browser-use/video-use and https://github.com/heygen-com/hyperframes.
Pages created: [[video-use]], [[HyperFrames]], [[video-editing-pipeline]]
Skills installed: video-use (cloned to C:\Users\hassa\Developer\video-use, symlinked to .claude\skills\video-use), HyperFrames (npx skills add).
Outstanding: ffmpeg needs install, ElevenLabs API key needed, uv sync needed.

## [2026-06-14] init
Wiki scaffolded from Karpathy's LLM Wiki pattern (https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f).
Vault: `C:\Users\hassa\OneDrive\Documents\Civly Brain`
Structure: raw/, pages/entities/, pages/concepts/, pages/sources/, pages/analyses/
CLAUDE.md, AGENTS.md, wiki.md, index.md, and log.md initialized.
