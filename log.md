# Wiki Log

Append-only chronological record of all operations.
Parse recent entries with: `grep "^## \[" log.md | tail -10`

---

## [2026-07-15] merge+push | Reconciled remote divergence, pushed clean structure
`git push` was rejected — remote had diverged (automated PR #1, "drafting vs coordination strategy shift + Hesh/Reuben CRM") on the OLDER structure (still `pages/analyses/`, top-level `Competitors/`, duplicate `Hesh-Dian.md`/`Reuben.md`).
Resolved with `merge -s ours` (kept the clean `strategy/`+`processed/` structure; remote commit preserved in history — non-destructive, no force-push). Salvaged the one unique doc → [[Drafting vs Coordination Strategy Shift]] into `strategy/` (relinked to canonical [[Hesh]] / [[Reuben Roy]]). Remote's duplicate CRM files superseded by the canonical ones (recoverable from history). Redacted phone + family PII from the repo copy before pushing.

## [2026-07-15] correction | Wiki over-narrowed Civly to "MEP-only"
User flagged that recent notes read as if Civly = MEP drafter. Corrected in [[Civly Architecture Reference]] (Sharpened-scope callout) and [[Civly Target Dilemma — MEP Drafting vs Competition Bids]] (framing correction + Bet A rewrite). Company frame per `civly context/`: **sketch / CAD / project brief → coordinated LOD ~250 BIM across all five disciplines** (arch + structural shipped, mechanical MEP is the current vertical slice, electrical + plumbing to follow). MEP is one discipline of Civly, not the product. Hesh remains a strong expert data point for the MEP slice, not an ICP redefinition. Filed as analysis: yes.

## [2026-07-14] query | How large is the IFC-to-Revit gap for the MEP MCP?
The gap is small for **coordination/reference use** but large for **native Revit MEP continuation**. Revit's recommended IFC workflow links a non-editable reference; opening IFC attempts conversion, but native duct systems, connectors, families, and reliable editability are not guaranteed. Clarified current direction: Civly is focused entirely on a stronger Archicad MCP for schematic-driven MEP; direct IFC writing is no longer the primary parallel path. Updated [[Civly Target Dilemma — MEP Drafting vs Competition Bids]], [[Technical Roadmap — What to Build First]], and [[To-Do — Yash]]. Filed as analysis: yes.

## [2026-07-14] ingest | Hesh + Reuben expert calls — target dilemma
Ingested and compared the two long transcripts embedded in `WhatsApp Chat - Yash (1).zip`: Hesh (16 Jun) and Reuben Roy (25 Jun). Hesh's existing source/processed transcript was verified and cross-linked; Reuben's transcript received comprehensive processed notes and a new source page.
**Finding:** the experts do not recommend one combined product. Hesh recommends MEP schematic→LOD 100–200 drafting; Reuben recommends competition-bid production for boutique architects, while also saying Civly's current demo is an engineering-consultant product. Current-build decision: finish/validate one mechanical MEP slice; run competition bids as a separate discovery track before building.
Pages created: [[Reuben Roy Call — Competition Bids vs BIM Drafting]], [[Reuben Roy]], [[Civly Target Dilemma — MEP Drafting vs Competition Bids]]. Updated: [[BIM Mentor Call — Drafting vs Coordination & Data Moat]], [[To-Do — Yash]], [[CRM/index]], [[index]], [[wiki]].

## [2026-07-14] crm | Reuben Roy
Category: expert. Relevance: HIGH. Action: created. Architecture workflow and competition-bid advisor; follow-up is an anonymised brief/submission pair, boutique-principal validation, and a later BVN technology-lead introduction.

## [2026-07-14] reconcile | To-do vs WhatsApp chat (through 13–14 Jul)
Read `WhatsApp Chat - Yash (1).zip` / `_chat.txt` and updated [[To-Do — Hassaan]] + [[To-Do — Yash]].
**New / done since 3 Jul:** TapReview site live + Surry Hills door-knock (4 Jul); ~10 SF MEP BIM managers contacted (6 Jul); Sharath can't share office files but will help (6 Jul); Latitude 37 interview secured (11 Jul); Reddit r/BIM pain scan (7 Jul); Fable extended again; agree to rewrite pitch before Georgia (15 Jul) + ask Slobodan next day.
**Hassaan this week:** polish LinkedIn (explicit ask); pitch rewrite + Georgia practice; reply Sharath for office NDA intro; prep Latitude; still-open Hesh/Michael chases.
**Stale:** TechCrunch Battlefield deadline (6 Jul) — no evidence of submit → missed; NextGen/Jerry — no reply.
**Yash this week:** Archicad+MEP MCP build with Fable; mechanical slice still gated on files.

## [2026-07-04] doc | NFC Review Cards — Surry Hills Target List
Created [[NFC Review Cards — Surry Hills Target List]] in `strategy/` for the tap-to-review card side hustle (separate from Civly). Curated ~35 mom-and-pop targets across barbers, nails, beauty, small eateries, trades/repair, and tattoo — grouped into 4 tiers by fit, each with Google Maps search links. Includes a Saturday walk route (Crown St 265 → 660 loop with Bourke/Oxford outliers) and a pitch cheat-sheet with cold open, demo script, price anchor, objection handling. Sources: web search across Fresha/Timeout/Corner/business directories (no Outscraper API used — user opted for manual curation).

## [2026-07-03] reconcile | To-do status vs WhatsApp chat (through 3 Jul)
Read full Hassaan×Yash chat (`_chat.txt`, through 3 Jul) and reconciled split to-do lists.
**Done since 18 Jun:** Reuben Roy interview (25 Jun); `app.civly.dev` on Hassaan's PC (26 Jun); Z Fellows written app (25 Jun); Protostars app+video (23–29 Jun); Data Partnership + LinkedIn strategy docs (25 Jun); Hesh re-engaged with WTP + Sharath intro (1 Jul); Ben Simai email (2 Jul); Option A build locked (2 Jul); outreach engine shipped (3 Jul); PFC pitch practice booked 15 Jul (3 Jul); Slobodan pitch feedback received (3 Jul).
**Still blocked:** Sharath wants payment — no CAD/Revit pair yet; Michael still silent; Priscilla architect intro not sent; Dhanjeet interview not booked; LinkedIn posting not started; Slobodan deck fixes not applied; TechCrunch Battlefield due 6 Jul.
Updated [[To-Do — Hassaan]], [[To-Do — Yash]].

Reorganised the vault for a clean, predictable structure:
- **`processed/`** is now top-level (moved out of `raw/processed/`). `raw/` holds ONLY unprocessed incoming sources + the `raw/whatsapp` & `raw/crm` drop inboxes.
- **`strategy/`** (new, flat) now holds ALL strategy, analyses, and to-do lists (moved out of `pages/analyses/`, which was removed). `pages/` is knowledge only.
- Moved top-level `Competitors/` → `pages/Competitors/` (Snaptrude, Archilabs, Finch).
- Deleted junk: empty `raw/processed.md`, empty root `BIM Coordination.md`, the VSCode installer `.exe` in `civly context/`, and orphan empty dirs. `civly context/` otherwise left as-is (per user: minimal cleanup).
- **Updated the schema** ([[CLAUDE]] + AGENTS.md): new directory layout + streamlined routing rules so every future ingest lands correctly (source → `processed/`; strategy/to-dos → `strategy/`).
- **Updated the ingest scripts** (`scripts/local_ingest.py`, `whatsapp_ingest.py`, `SETUP.md`) to write to `processed/` and `strategy/` (previously `raw/processed/` and `pages/analyses/`), so the daily auto-ingest no longer rebuilds the old folders.
- Updated index.md (Strategy + Competitors sections, stats), wiki.md (tree), and fixed live path refs in source pages. Obsidian `[[wiki-links]]` unaffected (resolve by filename).

## [2026-06-25] ingest | Z Fellows 2026 application → pitch copy + founder profiles
Captured the full submitted Z Fellows application as reusable, rule-compliant copy and founder bios.
Created: [[Pitch Copy Library]] (answer bank by question type with verified char counts, reusable fields, per-funder tailoring, submission log, open inconsistencies), [[Hassaan Shamshiri]] (founder entity: FarmVillage exit detail, full achievements list, drivers, hacking/loophole background, Abhinav Bhardwaj as dream co-founder), [[Yash]] (founder entity).
New facts: updated traction = **3 LOIs + 1 paid pilot + 10 signups** (supersedes the "5 users" bluff); Arrayah **Builder-in-Residence**; co-founder pick Abhinav Bhardwaj; heard via Blackbird VC; Hassaan personal email + phone captured.
Flagged: ⚠️ PII in a repo that auto-pushes to GitHub (redact phone/family details if public); ⚠️ exit figure inconsistency (AUD 1.6M *revenue* vs "$1.2M exit") to reconcile.
Open items added to [[To-Do — Hassaan]]: 1-min founder video (no demo), and the optional "1 thing you need help with".
Updated index, wiki, log.

## [2026-06-18] ingest | BIM Mentor Call — Drafting vs Coordination & Data Moat
Civly relevance: HIGH. Source: expert interview (BIM coordination mentor / ex-MEP drafter, likely Hesh of BIM Accelerator), 16 Jun 2026 call; raw transcript `D:\startup files\WhatsApp Chat - Yash (1)\_chat.txt`.
Direction-shaping conversation: Civly = AI BIM **drafter** (design intent → LOD 0→~200), scope is drafting not coordination; buyer = MEP consultancies; input = MEP schematics (CAD); duct sizing is automatable (no engineer intuition); liability sits with the human who signs off; the moat is proprietary input/output training data via partnerships.
Pages created: [[BIM Mentor Call — Drafting vs Coordination & Data Moat]] (source), [[MEP Drafting — Schematic to LOD 200]] (MEP), [[BIM Drafting vs Coordination]], [[Level of Development (LOD)]], [[Data Partnership Moat]] (concepts), [[Navisworks]] (entity), [[Hesh]] (CRM/expert).
Analyses: [[Civly Direction — Drafting-First Pivot (Jun 2026)]], [[Advisor List & Question Routing]]. To-do split into [[To-Do — Hassaan]] + [[To-Do — Yash]]; updated [[Civly To-Do — Jun 2 to Jun 16]] and [[Civly Architecture Reference]] (sharpened scope).
Flagged contradiction: live cost-per-edit feature de-valued by mentor vs Michael/Disha's-dad. Note: `civly context/` is read-only — stale items flagged in the direction analysis, not edited.
Saved transcript + comprehensive notes to raw/processed/. Removed empty `pages/Navisworks.md` placeholder; created proper entity at `pages/entities/Navisworks.md`.

## [2026-06-18] crm | Hesh (BIM Accelerator)
Category: expert (advisor). Relevance: HIGH. Action: created. Ongoing advisory offered (monthly call + text) + UK MEP-modeller intro. Identity confirmed by Hassaan: Hesh = BIM Accelerator founder, BIM coordinator/expert, and the voice behind the vault's BIM Accelerator YouTube sources (LinkedIn URL TBC).
Also reconciled CRM index drift: added existing [[Michael Westerlund]] (design-partner), [[Leo Chan]] (connector), [[Farzana Khan]] (other) to CRM/index.

## [2026-06-18] strategy | Two monthly bets — data outreach + LinkedIn/brand
Created [[Data Partnership Outreach Strategy]]: 30-day playbook to land MEP-consultancy data partnerships — two-funnel framing (warm-intro customers vs volume data outreach), learning-first ask ladder, channel plan (LinkedIn/email/phone), ready-to-use copy for each channel + in-call flow + NDA framing, objection handling, tracking, 30-day plan. Embeds the advisor/spec questions into the same calls.
Created [[LinkedIn & Content Strategy]]: build-in-public reframe (for Hassaan's "wait until concrete" tendency), first-demo post + launch-video plans with caption drafts, 5 content pillars, 3x/week cadence, a 2-week post calendar (protein-folding analogy, LOD explainer, Hesh learnings, LOIs, etc.), profile/SEO setup, messaging guardrails.
Wired both into [[To-Do — Hassaan]] as the two big bets; grounded copy in the launch storyboard + traction + messaging rules. Added to index.

## [2026-06-18] analysis | Technical Roadmap — What to Build First
Created [[Technical Roadmap — What to Build First]]: dependency-ordered plan (Phase 0 pin-the-spec ⛔ → Phase 1 parser → Phase 2 duct-sizing calcs → Phase 3 LOD-200 IFC out → Phase 4 firm validation → Phase 5 data pipeline/ML). Maps Avenue A (rules) to Phases 1–3, Avenue B (data/ML) to Phase 5; feasibility tool + outreach run in parallel. Linked from [[To-Do — Yash]]; added to index.

## [2026-06-18] reconcile | To-do status vs full WhatsApp chat (through 18 Jun)
Read the full Hassaan×Yash chat (`D:\...\_chat.txt`, 9867 lines) and reconciled the split to-do lists against actual progress.
Done since lists written: Hesh call (16 Jun, recorded; full name = **Hesh Dian**), PFC workshop attended (17 Jun), Protostars info session attended + framing decided (passion-project/intersections), `app.civly.dev` deployed (buggy), met Priscilla in person (17 Jun).
In progress: feasibility tool → run on Hassaan's PC (Docker + Ollama gpt-oss:20b, setup sent 18 Jun); local LLM server.
New #1 blocker surfaced (18 Jun): exact **input file → output file → in-between process** is undefined ("a billion types of CAD files") — must pin down before building; this is what the 5 research questions unblock. New open decision: local Ollama vs Claude API for the Michael tool.
Updated [[To-Do — Hassaan]], [[To-Do — Yash]], [[Hesh]] (name).

## [2026-06-18] fix | Re-split advisor/UNSW outreach to Yash
Correction: the UNSW/academic-channel outreach (Priscilla, Reuben Roy) and the research interviews (Dhanjeet drafting-process, UK MEP modeller) are **Yash's** — his contacts/network, and they answer his 5 research questions. Moved from [[To-Do — Hassaan]] to [[To-Do — Yash]]. Hassaan retains the advisor-bench artifact + business relationships (Michael, Hesh) and the routing/matching. Updated [[Advisor List & Question Routing]] (owner tags + process).

## [2026-06-18] decision | Live costing + buyer/ICP resolved (Hassaan)
Two open questions from the drafting-first pivot decided:
1. **Live costing** → ship to Michael (he asked), then wrap up — no further investment. Real-time cost-per-edit stays low priority.
2. **Buyer/ICP** → anyone involved in the LOD 0 → 250 drafting process: architectural draftspersons + BIM drafters/technicians + MEP consultancies (not architects-vs-MEP either/or).
Propagated to [[Civly Direction — Drafting-First Pivot (Jun 2026)]], [[Civly Architecture Reference]], [[To-Do — Hassaan]], [[To-Do — Yash]], [[Civly To-Do — Jun 2 to Jun 16]], and the source-page callout.

## [2026-06-18] crm | Dhanjeet Sah
Category: expert (advisor). Relevance: HIGH. Action: created from raw LinkedIn clip (met at Sydney Build Expo, gave BIM-draft-process context).
27-yr BIM/CAD veteran, Autodesk Certified Instructor + Revit alpha/beta tester, Python/Dynamo, Architecture+CS. Best-matched expert for the drafting-first questions. Wired into [[Advisor List & Question Routing]] (Q1–Q4 routing).

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
