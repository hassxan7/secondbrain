---
title: "Intern Onboarding & Task Menu — Aadi Jain"
type: analysis
tags: [intern, onboarding, tasks, revit, scan-to-bim, mep, ifc, grunt-work]
created: 2026-09-15
updated: 2026-09-15
sources: 2
---

Onboarding pack + task menu for the trial intern (Aadi Jain, B.Tech AI & DS, n8n/Python/automation, NDA signed 2026-09). Purpose is twofold: **(1)** get real grunt work off Yash's and Hassaan's plates — tutorial grinding, tool building, output comparison; **(2)** see how he actually works before we commit to anything longer. He will use Claude, and that is fine — **so every task below is specified as a deliverable we can verify, not a document he can generate in one prompt.** Anything that is "write a fact sheet about X" has been deliberately excluded: he'd just Claude it, he'd learn nothing, we'd teach nothing, and we'd get nothing we couldn't have generated ourselves.

**Hard constraint: zero spend.** No Polycam Pro, no paid exports, no subscriptions, no "just $10". Every task below has a free path specified. If he hits a paywall, the task *is* to find the free route or build the missing piece — that's the point.

Related: [[To-Do — Yash]] · [[To-Do — Hassaan]] · [[Civly Architecture Reference]] · [[Architect Call — Design Process, Polycam & Drafting Automation (Sep 2026)]] · [[Aadi Jain]]

---

# PART 1 — SETUP (do this before picking tasks)

Budget: **one evening, ~3–4 hours.** Don't skip to the tasks. Everything in Part 2 assumes you've done this.

## 1.1 What Civly actually is (read this first, in this order)

Civly turns an architectural/MEP **design input** into a real, coordinated **BIM model** — automatically. Not a renderer, not a chatbot on top of Revit. The concrete claim we make to customers: *a job that takes 4–5 drafters weeks should take one person a day.*

Read, in order:
1. `strategy/Civly Architecture Reference.md` — the master technical picture. Read all of it.
2. `strategy/Technical Roadmap — What to Build First.md` — what order we're building in.
3. `pages/MEP/MEP Drafting — Schematic to LOD 200.md` — the exact slice we're building right now.
4. `pages/concepts/Level of Development (LOD).md` — LOD 100 / 200 / 300 / 350. You will use these numbers constantly; know what they mean.
5. `pages/sources/BIM Mentor Call — Drafting vs Coordination & Data Moat.md` and `pages/sources/Architect Call — Design Process, Polycam & Drafting Automation (Sep 2026).md` — two practitioner calls. These are where the tasks below come from. The second one is the one that generated half this list.

## 1.2 The three layers (memorise this — it's how we'll talk to you)

| Layer | What it is | Where it lives |
|---|---|---|
| **L1 — BIM Generator** | Claude Code drives Archicad step-by-step through the **Tapir MCP plugin** (`place wall`, `place column`, `place slab`, ~40 tools). This is the main product path. | Archicad + MCP server |
| **L2 — Feasibility Engine** | Python. Reads IFC → IfcOpenShell → `SemanticProject` (Pydantic) → deterministic calcs ← YAML rule packs → scenarios → PDF report. **The LLM never computes a number or a compliance result.** | `calcs/`, `rules/`, `ifc_writer`, `mep.py` |
| **L3 — React UI** | Upload IFC → map spaces → dashboard → scenario builder → PDF export. | web app |

Two rules that are not negotiable:
- **IFC is the only interchange format.** Not `.rvt`, not `.dwg`. Everything in and out is IFC.
- **Local-first.** `docker compose up`, SQLite, no cloud dependency in the engine.

## 1.3 What is already shipped vs not

- **Shipped:** architecture + structure for a Sydney Class 2 apartment building in Archicad 29 — 4 storeys, 42 RC columns (400×400 on a 7.2m grid), 47 walls, NCC 2022 schedules, BOM. Plus an image/floor-plan processor that takes a floor plan and builds it up in Revit.
- **Not shipped:** **MEP.** No Tapir MCP MEP support yet. This is the active build. Nearly every task below exists because MEP is the gap.
- **Blocked:** we do not yet have a real paired example — *someone's actual schematic + the actual model they drafted from it.* Firms won't hand files over without an NDA and an internal champion. Tasks 2 and 4 exist to manufacture that pair ourselves.

## 1.4 Accounts and installs (all free, all legitimate)

- **Revit** — free 1-year **education licence** with your university email (`autodesk.com/education`). Takes ~30 min including the eligibility check. We do **not** build on Revit (we use Archicad), but the entire industry drafts in it, so you need to be able to read, open and export from it.
- **Archicad** — free **student/education licence** (Graphisoft "My Archicad"). Needed only if you pick a task that touches L1.
- **Claude Code** — you'll be using it constantly. Use it.
- **Python 3.11+ with `uv`**, and **IfcOpenShell** (`uv pip install ifcopenshell`). This is how we read IFC. Also `networkx` (we use A* for MEP routing), `numpy`, `shapely`.
- **A phone with a LiDAR sensor if you have one** (iPhone Pro / iPad Pro). If you don't, say so immediately — Task 1 changes shape (photogrammetry instead of LiDAR) and that's fine, but we need to know.
- **Repo access** — ask Yash for invites to the engine repo and the MCP repo. Don't start Task 4 or 6 before you have them.

## 1.5 How we work with you

- **Deliverables live in a Git branch + a short Markdown write-up.** No slide decks. No "here's my research". A tool that runs, or a table of measured numbers, or both.
- **Every claim gets a number or a screenshot.** "It worked well" is not a result. "14 of 17 rooms within ±40mm of tape measure, 3 failed and here's why" is a result.
- **Batch your questions.** Save them up and send one message a day rather than five. If you're blocked >2 hours on something we could unblock in 2 minutes, that rule is void — ask immediately.
- **Timebox and report.** If a task is going to blow past its estimate, tell us at the halfway mark with what you've learnt. Discovering "this is impossible for free, here's the evidence" is a valid, useful, *paid-in-trust* outcome. Quietly running out of time is not.
- **NDA is signed and it is real.** Do not put any Civly file, screenshot, model, transcript or client name into a public repo, a public Claude share link, LinkedIn, or a Discord. Your own scans of your own room are yours — those you can show.
- **Use Claude hard, but own the output.** We assume you'll generate 80% of the code with Claude. That's the job. What we're assessing is whether you can tell when Claude's output is wrong — because in this domain it very often is (it will invent IFC entity names, invent NCC clause numbers, and confidently size ducts wrong).

## 1.6 Glossary you'll need in week one

**IFC** — the open BIM exchange format (ISO 16739). **LOD** — how detailed/reliable a model element is (100 = symbolic, 200 = approximate size/shape/location, 300 = accurate, 350 = with connections). **MEP** — Mechanical (HVAC), Electrical, Plumbing. **Schematic** — the consultant's 2D line diagram of an MEP system, the input we want to turn into a model. **NCC 2022** — National Construction Code, Australia's building code; 3 volumes, ~900 pages. **Class 2** — apartment buildings under NCC classification. **Clash detection** — finding where a duct runs through a beam. **Tapir** — the Archicad MCP plugin we drive. **Family / Library part** — a reusable parametric component (Revit calls it a family, Archicad a library part).

---

# PART 2 — TASK MENU (pick 2 for this week)

Read all six. Pick **two** and tell us which, with a one-line reason each. Rough guide: pick one that plays to what you already have (Python/automation) and one that forces you into the BIM software, because the second kind is where we most need hands that aren't ours.

Estimates assume heavy Claude use. They're honest estimates for someone who has never opened Revit.

---

## TASK 1 — Free room-scan → floor plan → Revit pipeline

**Estimated: 8–12 hours. No BIM experience needed to start. Needs a phone.**

### Why this matters
An architect we interviewed (see the source page) walks into an existing building for a renovation job, scans the rooms with **Polycam**, and works off that scan as reference. When he wants an actual *model* out of it, Polycam sells him one for ~US$100 — and he strongly suspects it's not AI at all, but a human drafter offshore doing it by hand overnight. We already have an image processor that takes a floor plan and builds it in Revit. **If the front half of that chain (phone scan → clean floor plan) can be done for free, we own the whole pipeline and that $100 job becomes a button.** Nobody here has sat down and actually tested whether the free tier gets us there.

### What to find out (the actual questions)
1. Which free scanning apps give you geometry you can export **without paying and without a watermark**? Candidates to test: **Polycam free tier**, **Scaniverse** (Niantic — fully free, exports OBJ/PLY/LAS), **Apple RoomPlan** sample app (free, iOS, outputs parametric walls/doors/windows *natively* — this one may be the shortcut), **Canvas**, **Magicplan free tier**, plus anything you find. If you're on Android: **ARCore**-based apps, or photogrammetry from a video via **Meshroom** / **COLMAP** (both free, desktop).
2. For each: what exactly comes out (point cloud? mesh? parametric room boundaries?), in what format, at what scale, and is the export actually free or free-until-you-click-export?
3. **How accurate is it really?** Tape-measure at least 10 real dimensions in a real room (wall lengths, door widths, ceiling height, window head height) and compare. The architect's line was that a phone scan is "maybe 70% of the way to survey grade" — we want the actual number.

### What to build
A script or small pipeline: **scan output → floor plan raster/vector** suitable as input to our existing floor-plan→Revit processor. If no free app exports a floor plan directly, build it: load the mesh/point cloud in Python (`open3d` or `trimesh` + `numpy`), **slice a horizontal section at ~1.2m above floor level**, project to 2D, clean up the noise, and output a clean black-on-white PNG plus an SVG/DXF of the wall lines. That's ~150 lines of Python and Claude will get you most of the way. Getting the *slice height and noise threshold* right so that furniture and clutter don't become walls is the real work.

### Deliverables
1. **Comparison table**: app · platform · output formats · export free? · watermark? · file size · scan time for one room · setup friction · accuracy (mean and worst-case error in mm vs tape).
2. **Working script** in a branch, with a README, that takes a scan file and emits a floor plan image + line drawing.
3. **One end-to-end run on a real room**, with the raw scan, the generated floor plan, and side-by-side against a photo.
4. **A one-page verdict**: which free stack do we standardise on, and what breaks (glass, mirrors, dark surfaces, ceilings, tight bathrooms — test these deliberately; the architect specifically works in bathrooms).

### Done means
Yash can hand you a scan of a room he's never seen and get a usable floor plan out, with no payment and no manual tracing.

### Gotchas
Polycam's free tier historically allows scanning but restricts export formats — verify by *actually exporting*, not by reading the pricing page. RoomPlan is likely the highest-leverage option because it emits walls/doors/windows as objects, not just a mesh — but it's iOS-only and needs Xcode (free) to build the sample app. Scan quality collapses in dark rooms and against white walls; note it, don't hide it.

---

## TASK 2 — Grind the Revit MEP tutorial and produce our first golden pair

**Estimated: 14–20 hours. This is the tutorial-grinding task. Highest value to us right now.**

### Why this matters
Our biggest blocker is not code — it's that **we don't own a single example of "here is the 2D schematic that went in, and here is the BIM model that came out."** Firms won't share theirs (NDA problems, confidentiality, internal politics). So we'll manufacture one ourselves from a public tutorial project. Additionally: **none of us have actually drafted MEP by hand, step by step, start to finish.** Until someone has, we're guessing at the workflow we claim to automate. That someone is you.

Our vault already contains ~15 ingested transcripts of full Revit MEP courses (`MEP/`, `processed/`) — you have the notes; what's missing is somebody who has done the clicks.

### What to do
1. Work through a full free Revit MEP mechanical (HVAC) tutorial project, start to finish — there are complete free ones on YouTube (10h+ hotel/office projects); several are already transcribed in `MEP/` if you want to read ahead at 10× speed. Build the model. Actually build it, don't watch it.
2. **Log the workflow as you go, click by click**, at the level of "linked the architectural model → copy/monitor levels and grids → set up view templates → placed air terminals per room → connected to ducts → sized ducts via system → added fittings/transitions → tagged → exported". Timestamp each stage — **we need to know how long each stage actually takes a human**, because that's our savings claim and right now it's a guess.
3. Identify and write down **every moment where you had to make a judgement call** rather than follow a rule. Those are the points where deterministic automation fails and where the hard part of our product lives. Our advisor's claim is that duct sizing has *no* intuition in it — it's a lookup. Test that claim against your own experience.
4. **Export the result to IFC** (IFC4, with MEP systems and properties included). Also export the input schematic / CAD underlay separately.

### Deliverables
1. The **completed Revit model** + the **IFC export** + the **input schematic**, committed to the repo (or shared internally per NDA rules). This trio is our first golden pair.
2. **`workflow-spec.md`** — the click-by-click drafting sequence, with per-stage timings and a total. This becomes the spec the MCP tool sequence has to reproduce.
3. **`judgement-calls.md`** — every decision that wasn't a lookup, and what you based it on.
4. A short **"what surprised me"** list. You are the only person in the company seeing this workflow for the first time; that perspective is worth something exactly once, so write it down before it wears off.

### Done means
We can point at a file pair and say "this schematic produced this model", and we have a timed, ordered spec of how a human gets from one to the other.

### Gotchas
Do a *mechanical* project first — don't try to do all five disciplines. Use the tutorial's own dataset, not a made-up building. When you export IFC, check the export settings: the default settings drop MEP system data and property sets, and an IFC without systems is useless to us. Open the IFC in a free viewer (BIMcollab Zoom / usBIM / Blender+BlenderBIM — all free) to confirm the elements survived before you call it done.

---

## TASK 3 — IFC round-trip fidelity test (Archicad → IFC → Revit)

**Estimated: 8–12 hours. Needs both Archicad and Revit installed.**

### Why this matters
Everything we produce leaves as IFC. Our customers open things in Revit. **Nobody has verified what actually survives that journey.** If our beautifully generated Archicad model opens in Revit as dumb geometry with no parameters, no system assignments and no connectivity, our product is a picture, not a model — and we'd rather find that out from an intern this week than from a customer in a demo. This is an open item on Yash's list that has sat there for two months because it's tedious.

### What to do
1. Get a source model — the shipped Archicad Class 2 demo (ask Yash) and/or your own Task 2 output going the other way.
2. Export to **IFC4** and to **IFC2x3**, with several export-setting profiles (at minimum: default, "general translator", and one with all property sets and classifications forced on). Record the exact settings each time.
3. Open each export in Revit (link *and* import — they behave differently), and in a free IFC viewer as a control, so you can tell "Revit lost it" from "the export never had it".
4. **Score what survived**, element by element and property by property: element counts by type · geometry accuracy (spot-check dimensions) · does it come in as native Revit categories or as generic `DirectShape` blobs? · property sets / Psets · classification codes · levels & grids · spaces/zones (`IfcSpace`) · MEP system assignment · **ports and connectivity** (does a duct still know it's connected to the next duct?) · materials · naming.
5. Repeat the same scoring for at least one more receiving tool (free viewer, Blender+BlenderBIM, or Solibri Anywhere free) so we know whether a loss is Revit-specific.

### Deliverables
1. **A fidelity scorecard** — a real table, one row per property/feature, one column per export profile and receiving tool, marked survived / degraded / lost, with a note on each degraded or lost cell.
2. **`export-settings-recommendation.md`** — the exact export configuration we should ship as our default, and why.
3. **`known-losses.md`** — what we cannot preserve through the round trip today, and for each one whether the fix lives in our exporter or is an inherent format/tool limitation.
4. A **repeatable test script**: point it at an IFC and get element/property counts out (IfcOpenShell makes this ~80 lines), so we can re-run this scorecard on every future build instead of redoing it by hand.

### Done means
We can answer, with a table rather than a shrug, "what does a Revit user actually get when we hand them our IFC?"

### Gotchas
Revit's *link* vs *import* behaviours differ substantially — test both, the answer matters commercially. IFC2x3 and IFC4 handle MEP ports very differently. Don't trust visual inspection alone: two models can look identical in the viewport and differ completely in their data.

---

## TASK 4 — Output comparison harness ("delete the MEP, regenerate it, score it")

**Estimated: 12–16 hours. Python-heavy — plays to your strengths. Needs repo access.**

### Why this matters
This is the evaluation loop the whole ML path depends on. The method: take a finished model that already has MEP in it → **delete the MEP** → have our system regenerate it → **compare what we produced against what the human actually did.** Run that hundreds of times and the diff is our training signal and our progress metric. Right now we have no harness, so "is the output any good?" is answered by squinting at a screenshot.

We need this to be **someone else's job** so Yash can keep building the generator itself.

### What to build
A Python tool: `compare.py --truth human.ifc --candidate generated.ifc --report out.html`

It should:
1. **Parse both IFCs** with IfcOpenShell and extract a normalised MEP graph: segments (with size, length, system, storey), fittings, terminals, equipment, ports, and the connectivity between them. (`networkx` — we already use it with A* for routing, so match that representation; ask Yash for the existing graph schema before inventing your own.)
2. **Compute a scorecard**, and be opinionated about the metrics:
   - element counts by type and by system (missing / extra / matched)
   - total duct or pipe length per system, and the ratio vs truth
   - **size agreement** on matched runs — exact match, within one standard size, way off
   - **terminal coverage** — does every room that has a terminal in the truth model have one in ours? (this is the one that actually matters — a missed room is a failed model)
   - **routing efficiency** — our path length vs the human's path length between the same endpoints
   - clearance/clash count against the architectural + structural model
   - connectivity integrity — any orphaned segment that connects to nothing
3. **Emit an HTML report** with the numbers plus a simple 2D plan overlay (matplotlib is fine): human routes in one colour, ours in another, mismatches highlighted.
4. Handle the obvious real-world mess: different GUIDs, different naming conventions, elements split differently between the two models (one 10m duct vs five 2m ducts must score as equivalent — **this normalisation is the hard part of the task, don't hand-wave it**).

### Deliverables
Working CLI tool + tests + README, a sample report generated from at least one real pair (use the Task 2 pair, or ask Yash for a model), and **`metrics-rationale.md`** explaining what each metric measures, what a good score looks like, and which metrics you think are misleading and why.

### Done means
`compare.py` runs on two IFCs and prints a scorecard we trust enough to quote in a standup.

### Gotchas
Do **not** compare geometry blindly — two topologically identical duct runs will differ by millimetres everywhere. Compare at the graph/topology level with tolerances. Talk to Yash before you finalise the graph schema; if it diverges from the existing one the tool is half-useless.

---

## TASK 5 — Space-planning clearance checker

**Estimated: 10–14 hours. Half code, half careful code-reading.**

### Why this matters
Straight from the architect interview. When he lays out three renovation options, he checks by eye and by memory: clearance around dining chairs, gap between couches, kitchen bench to island distance, whether a bathtub fits in a two-bedroom, **"you need to be more than six metres from an apartment entry door to a fire stair."** His words: *"I can tell if it works by looking at it — but you could just measure the distances... and then you just want to test every time you change it."* That is a checker, not an AI. It's deterministic, it's the exact shape of our L2 engine, and it's the thing that turns "here are three options" from a day of manual thought into a re-run.

### What to build
1. **A rule set in YAML** (match the existing `rules/` pack format — read it first, don't invent a schema) covering two groups:
   - **Fire/egress and code rules** from NCC 2022 and the NSW Apartment Design Guide — both are free downloads (ABCB requires a free registration). Start with: travel distance to an exit, minimum distance from an apartment entry door to a fire-isolated stair, corridor widths, door swing clearances, minimum room dimensions and ceiling heights for Class 2.
   - **Ergonomic/space-planning rules** for residential: kitchen work-triangle and bench-to-island clearance, circulation space around a dining table, clearance in front of appliances, bathroom fixture clearances, wheelchair turning circle where applicable.
   - **Every single rule needs a citation** — document, clause number, page. A rule without a source is worse than no rule, because it will quietly poison a compliance claim we make to a customer. Where a value is a convention rather than a code requirement, label it as such.
2. **A checker** that loads an IFC (spaces, walls, doors, fixtures) and evaluates the rules, outputting pass/fail per rule per space with the measured value, the required value, and the location.
3. **Hand-verify it.** Take at least 5 rules and check the tool's answer against your own measurement in Revit. Include the verification in the write-up — this is the part we're actually grading.

### Deliverables
YAML rule pack with citations · checker script · a report run against a real model · **`verification.md`** showing tool output vs hand-measured for your sample · **`gaps.md`** listing rules you *couldn't* implement because the geometry isn't in the IFC (that list tells us what our generator must start emitting).

### Done means
Point the checker at an apartment floor plate IFC and get a defensible pass/fail report.

### Gotchas
**Claude will invent NCC clause numbers with total confidence.** Every value must be read out of the actual PDF by you, with the page recorded. Any rule you can't source, drop it and say so. Also: measuring "distance from door to stair" means path distance along circulation, not straight-line — decide which one the code means and say which one you implemented.

---

## TASK 6 — Library/content organiser and metadata extractor

**Estimated: 10–14 hours. Pure data engineering — closest to your n8n/automation background.**

### Why this matters
We've been told repeatedly that the moat is data, and that the data we can get our hands on — scan libraries, manufacturer family/library-part collections, sample models — arrives as a **disorganised, inconsistently named, duplicate-ridden pile.** Before any of it can be trained on or served, it has to be organised, deduplicated and tagged. This is unglamorous and it is genuinely blocking, and it's the kind of job that is enormously faster with an automation-minded person and Claude than doing it by hand.

### What to build
A pipeline that walks a directory of BIM content (free sources: manufacturer Revit family libraries, BIMobject/NBS free downloads, Archicad library parts, sample IFC models from buildingSMART, open datasets) and produces a clean, queryable catalogue.

1. **Extract metadata without opening the authoring app.** For IFC, IfcOpenShell. For `.rfa` Revit families, the trick is that the thumbnail and some metadata live in the OLE compound-file structure — `olefile` in Python will get you in; find out how far that gets you and document the limit. Pull: category/type, manufacturer, key parameters and their ranges, units, dimensions, file size, version, date.
2. **Normalise and classify** — map inconsistent vendor naming onto one taxonomy (e.g. everything that is a diffuser is `air_terminal/diffuser` regardless of whether the file says "Supply Diffuser 4-way", "SD-4W" or "Air Term Sq"). This is where an LLM pass is legitimately the right tool; build it as a pass over extracted metadata with a deterministic schema and a confidence flag, **not** as a free-text summary.
3. **Deduplicate** — the same component turns up five times with different filenames. Detect by parameter fingerprint and geometry hash, not by name.
4. **Output** a SQLite database + a JSON index + a small CLI to query it (`find --category air_terminal --flow 200-400 l/s`). SQLite specifically, because the engine is local-first and already uses it.
5. **Flag the junk**: corrupt files, missing parameters, wrong units (mm vs m mixups are everywhere), placeholder geometry.

### Deliverables
The pipeline + CLI + README · a catalogue built from **at least 200 real free-sourced components** · **`data-quality-report.md`** (how many were duplicates, how many had missing/wrong metadata, how many were unusable, and the top failure patterns) · **`taxonomy.md`** — the classification scheme you settled on and why.

### Done means
`find --category ... ` returns the right components from a pile that was previously unnavigable, and we know the quality profile of that pile.

### Gotchas
Don't hand-classify — if it doesn't scale to 10,000 files it isn't the deliverable. Respect licences on anything you download; note the licence per source in the catalogue. Never let the LLM invent a parameter value that wasn't in the file — classification only, never fabrication.

---

## How to choose

| Task | Skill lean | Needs Revit | Needs Archicad | Needs phone | Unblocks |
|---|---|---|---|---|---|
| 1 — Scan → floor plan | Python/CV | to verify | no | **yes** | a free version of a $100 paid product, straight into our existing Revit processor |
| 2 — MEP tutorial + golden pair | BIM hands-on | **yes** | no | no | our #1 blocker: no paired input→output data, and no timed workflow spec |
| 3 — IFC round-trip | BIM + Python | **yes** | **yes** | no | whether our output is usable by the industry at all |
| 4 — Comparison harness | Python (heavy) | no | no | no | the evaluation loop for everything we generate |
| 5 — Clearance checker | Python + code-reading | helpful | no | no | the deterministic compliance layer we sell on |
| 6 — Library organiser | Data engineering | no | no | no | the data-cleaning layer the ML path sits on |

**Recommended pairing for week one:** Task 2 + Task 1. Task 2 because it forces the domain into your head and produces the asset we most need; Task 1 because it's self-contained, needs nobody else, and gives you a shippable win inside a few days. If you have no LiDAR phone, take Task 2 + Task 4.

## What we're actually assessing
1. Do you verify, or do you trust the first plausible answer Claude gives you? (This domain punishes the second one hard.)
2. Do you report the bad news early?
3. Are your numbers real — measured, not estimated?
4. Can we hand you something ambiguous and get back something usable without five rounds?

## Open Questions
- Does he have a LiDAR-capable phone? Task 1 depends on it.
- Which repos does he get access to, and do we want a separate read-only mirror rather than the main repo during the trial?
- Who reviews his PRs — Yash by default, but that's a real time cost; is a weekly review block better than ad-hoc?
- Do we pay a stipend if the trial converts, and what's the trigger to decide?
- Task 2 produces a golden pair from a public tutorial dataset — check the tutorial's terms before we treat that pair as training data rather than just a spec source.
