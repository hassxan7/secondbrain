---
title: "To-Do — Yash"
type: analysis
tags: [todo, civly, yash, revit-mcp, harness, ML, shipping]
created: 2026-06-18
updated: 2026-09-08
sources: 5
---

Yash's list — **technical: the Revit MCP, shipping, the learning harness, the ML path.**
Hassaan's half: [[To-Do — Hassaan]]. Dated board: [[Deliverables — Sep 2026]].
Architecture: [[Civly Architecture Reference]] · Direction:
[[Civly Product Trajectory — MCP, Harness, Agentic IDE]].

> [!note] Reconciled from the WhatsApp export — 8 Sep 2026
> Chat read through **7 Sep**. Everything below the archive fold is the June/July state.
> Top of stack: **(1) finish the repo cleanup — it blocks everything;
> (2) deploy; (3) run the four MEP lanes; (4) safety gates into C#.**

---

## 🔴 This week — 8 to 14 Sep

- [ ] **Finish the repo cleanup + latency pass.** Self-described as "a couple of hours"
      on 7 Sep. It blocks the deploy *and* blocks the four parallel lanes. Removing the
      leftover Chinese strings, testing latency after each change.
- [ ] **Deploy.** You said you figured out how, and are waiting only on the cleanup.
- [ ] **Run the four handoffs** Hassaan wrote (4 Sep): **LEARN, MECH, ELEC, PLUMB.**
      One ordering rule he set: **MECH changes the three shared files first; PLUMB and
      ELEC wait for that** before their week-2 work. ARCH still needs writing.
- [ ] **Latency** — Hassaan's 4 Sep ask: run it inside Revit, log what is slow across
      several typical task types, then cache. Currently unmeasured, and complained about.
- [ ] **PFC slides** — Hassaan is on the script; you are on slides with him.

## ⛔ The blockers that matter more than features

- [ ] **Safety gates live only in TypeScript** (PROGRESS 9.3 / D3). The desktop app's
      dispatch path does not pass through them. **Blocking for any customer** — a
      convincing approval card with nothing behind it is worse than none.
      Needs `gatePolicy.ts` as one source of truth, plus C# `GateCheck.Evaluate(payload,
      approvalToken)` beside the Transaction, plus a hash-bound approval token as its own
      type (never a reuse of `approve:true`).
- [ ] **The agent loop does not exist in any form.** It blocks every deployment shape and
      does not care which shell wins. Build it before choosing a shell (`docs/19` §6).
- [ ] **D0 Ring-2 gate has no result file** — the live plugin runs loopback + token, but
      the formal gate ("second machine on the LAN refused; local connection without token
      refused") has never been recorded. D0 stays unticked until it is.
- [ ] **`service/` never deployed**, no TLS, JSON store with a documented
      last-writer-wins race. F1: move to `node:sqlite` (Node 24.16 is installed, keeps
      the zero-dependency promise), WAL, every read-modify-write in a transaction.

## 🧠 The learning harness — the moat work

> Full reasoning: [[Civly Product Trajectory — MCP, Harness, Agentic IDE]]

- [ ] **Turn the DI loop into a pipeline.** Today it works but is manual — it needs
      someone to screenshot a tutorial's real output so the model can compare what it
      built against what the human built. Hassaan (25 Aug): *"it actually works once you
      do it, and the more it is used the more it improves."* Automate the capture.
- [ ] **An ingestion pipeline for tutorials.** Your own words, 31 Aug: *"surely an
      ingestion pipeline can be made there, else it's so painful to make the smallest
      tool."* The cladding tool was built from a tutorial — that is the proof it works.
- [ ] **Scrape plumbing and electrical logic properly** — 93 topics were ingested from an
      MEP course syllabus; plumbing and electrical are still thin.
- [ ] **Hold the line on physics-first.** The Snowdon model contains real errors (one duct
      at 66x its friction target). Anything trained to imitate learns the faults.
      **Deterministic where physics decides, learned where practice decides.**

## 🔧 Engine and tools

- [ ] **8.13 timeout root cause** — a live build that times out is the demo failure mode.
      One-variable probe: `stub_length_mm` 600 → 1200.
- [ ] **MEP routing around structure** — currently plan-view keep-out only, no vertical
      dodge. Known weak, and it is the thing that makes routing look real.
- [ ] Week-4 engine choice, decided 22 Sep from what the demo exposes: rectangular sizing
      (8.4 — both real models are rectangular) or takeoffs → `manage_schedule`
      (8.17 — the proof object an engineer actually checks).
- [ ] **F6 decision** — the three project-notes tools (`store_project_data`,
      `store_room_data`, `query_stored_data`) fail to load under Electron and hold zero
      rows. Recommendation is to exclude them from the customer profile.

## 🚢 Shipping

- [ ] **Containerise / package** so a pilot can install without TeamViewer. Your position,
      and it is right: **a server keeps control** (revoke access, monitor, update);
      **a zip loses all of it**. Do not hand out the zip.
- [ ] **Do not share the repo.** Kongwei asked. Answer is no.
- [ ] **Decide the API-key model** — BYO key (the tier PROGRESS 9.0c already names) vs
      Civly-provided. Kongwei's client having credentials or not decides the architecture.
- [ ] Desktop login + telemetry client so G2's "signs in" is real, and the audit trail
      gets its first real session.

## 💸 Spend and tooling

- [ ] **$155 Anthropic promotional credit expires Fri 19 Sep** — use it or lose it.
- [~] Claude Max — bought; Fable 5 burns roughly 10% per prompt at high reasoning.
      One task ran past the limit and cost $97. Use Fable to plan, Opus 5 to execute.
- [ ] Mistral credits ($300) sitting unused.

## ✅ Landed since mid-July

- [x] **Revit MCP shipped and pushed** — install guide, `REVIT_TEST_GUIDE.md`, `START_HERE.md`
- [x] **Ring 2 in real Revit** — 38/38 ducts, 19/19 fittings, 19/19 terminals connected;
      607 ids / 819 elements deleted in one transaction
- [x] **62 tools** (from an upstream base of 29 with zero MEP commands)
- [x] `get_api_docs` — 40,248 Revit API members, offline, ~1ms lookup
- [x] `get_linked_elements` — closed the federation gap (rooms live in the linked model)
- [x] `get_routing_preferences` — "can this firm's template actually build ductwork"
- [x] Revit help scraped — 34,714 topics, SQLite + FTS5, searchable in ms
- [x] **Duct sizing verified against Revit's own engine** — agreement to rounding
- [x] **NCC 2025 verified word-for-word** against `egress.yaml`; one citation fixed;
      21 indoor-air-quality rules added
- [x] Cladding, image processing, `get_obstacles`, `clash_detection` built
- [x] Desktop app built and tested locally; in-Revit panel cancelled (D18)
- [x] `service/` control plane — 20/20 tests green
- [x] Fleet protocol — four terminals (BUILD / AUDIT / HOST / REVIT), lane files, Ring-2 queue

---

# Archive — June/July 2026 state

> Kept per the never-delete rule. Superseded by the sections above.

## 🆕 From the SF / Sasha meeting (14 Jul)
> Context + decisions: [[Data & Credibility — Core Problem & Open Decisions (SF, 14 Jul)]]. Data + credibility is the make-or-break; your side is the **credibility demo** and the **data-collection tooling**.
- [ ] **Ship the architect-intuitive demo (~10 days)** — the stronger MCP is ~**90% done (~40 tools, 4x prior)** and "1–2 days from controlling the software fully". Turn it into a **sharp, pinpointed demo → YouTube link + pin on Hassaan's LinkedIn.** This is the #1 near-term **credibility** unlock per Sasha (resolves "who is this guy?").
- [ ] **Evaluate/build the "single mass-change" web tool** as a data-collection funnel — a genuinely useful free utility (make one change across a whole model) with **T&Cs granting training rights** (data used only to improve the model, never resold). Hair-on-fire capture, ChatGPT-style. Flag: noisy data + rides the data-privacy backlash.
- [ ] **Data cleaning / organising layer** — the "largest scan library" and family libs are bulk but disorganised/noisy; need a system that **organises + fixes data first** before training.
- [ ] **Corruption training method** — build the pipeline that takes finished models, removes elements, and trains on **before/after chunks** (materials/concrete are building-wide, so element choices must be learned in context). "Building the system is fine; the data is the hard part."
- [ ] **File the paid schematics** — Civly "paid for schematics at larger scale" (got some); confirm what they are and whether they form the first usable input→output pair for the mechanical slice.

## 🔴 This week — Jul 14–20
- [ ] **Build / extend Archicad MCP for MEP** — use Fable window; "teach MCP mechanical LOD 250" rather than jumping straight to ML (Hassaan ask 6–13 Jul). Better Tapir-style toolset with MEP features.
- [ ] **Ship one mechanical vertical slice through the MCP** — CAD/DXF schematic → application-neutral routing graph/sizes → native Archicad MEP elements → LOD 100/200 IFC exchange model/viewer. Still blocked on real paired files.
- [~] **⛔ Example input→output pair** — Sharath won't share office files directly; path = intro to someone who can under NDA. Public samples meantime.
- [ ] **Rewrite pitch deck with Hassaan** — call **14 Jul evening**; practice with Georgia **15 Jul 2pm**; then Slobodan feedback.
- [ ] **Demo video of the slice** — once slice exists → Hesh, Sharath, Michael, Ben.

## 🔴 This week / priority (ongoing)
- [~] **Deploy the IFC/feasibility tool** — **`app.civly.dev` live on Hassaan's PC** (26 Jun, Cloudflare tunnel + Docker + Ollama `gpt-oss:20b`). Still buggy; local model quality poor (Hassaan: "really shit", ~8B workable). Open decision: local Ollama vs Claude API — revisit after Michael sees it once.
- [ ] **Rebuild as Claude-branded demo** — still looks like bare Claude; Figma/custom chat UI discussed 24 Jun, not shipped.
- [ ] **Incorporate Slobodan's pitch feedback** before PFC (20–24 Jul) — fix slide 11 MRR math, call round Seed not Series A, rename "Spikes", smooth team→problem transition. Book his offer to review deck (he offered weekend/next week, 3 Jul).

## 🔬 Research questions (LIVE — partial answers from Hesh + Reuben)
The 5 questions — drafted 18 Jun. Hassaan maintains the bench/routing, **you run the interviews**. [[Advisor List & Question Routing]]. **Hesh + Reuben answers filed 14 Jul:** [[BIM Mentor Call — Drafting vs Coordination & Data Moat]], [[Reuben Roy Call — Competition Bids vs BIM Drafting]], and [[Civly Target Dilemma — MEP Drafting vs Competition Bids]].
1. [~] Where do BIM drafters come from — are they architects, and do they do the MEP drafting? *(Hesh: architectural technicians; Reuben: draftspersons hired once floor plan ~finalised)*
2. [~] Where does the *design* part come in (vs drafting)? *(Reuben: competition phase = pure design, no MEP; drafting comes post-DA/DD)*
3. [~] Are there feasibility issues / any human intuition in BIM drafting? *(Hesh: duct sizing = no intuition; human signs off)*
4. [~] How do they BIM-draft — exactly how do they go from input to output? *(Hesh: CAD schematic → LOD 200; still need Sharath walkthrough + files)*
5. [ ] How does that relate to Michael's job and his feasibility engine?
6. [ ] *(Added 25 Jun, Reuben)* Competition-bid input/output — what does a submission panel actually contain? (Answer: PDF renders + floor plans, not full BIM; MEP variable.)
- [x] Log Hesh + Reuben transcripts and reconcile their recommendations against the current build (14 Jul).
- [ ] Keep adding questions and file new answers into the relevant source/strategy page.

## 🎓 Advisor & research-interview outreach (yours — UNSW/academic + technical advisors)
- [ ] **Email Priscilla** (UNSW education program manager) — **met in person 17 Jun** (intern hiring); **architect-professor / architect-intro ask still pending**.
- [x] **Run the BVN tutor interview** — Reuben Roy, **25 Jun** (rescheduled from 22 Jun). Long recorded call — competition-bid wedge + boutique-firm ICP + Revit-copilot framing. Filed 14 Jul: [[Reuben Roy Call — Competition Bids vs BIM Drafting]].
- [ ] **Book + run the Dhanjeet Sah drafting-process interview** — best-matched for Q1–Q4. [[Dhanjeet Sah]].
- [~] **UK MEP-modeller (Sharath)** — intro via Hesh (1 Jul). Can't share office files (6 Jul) but willing to help; Hassaan to ask for **office NDA contact**. You run technical interview once files/meeting land.

## 🧱 The two technical avenues (from the call)
> Sequenced in dependency order in [[Technical Roadmap — What to Build First]] — build in that order, not all at once. Phase 0 (pin the spec) gates everything below.
- [ ] **Avenue A — codify the rules.** Nail down *exactly* how BIM drafting is done; where there's **no human intuition** (e.g. duct sizing), build it deterministically. Start with MEP **schematic → LOD 100–200** generation: [[MEP Drafting — Schematic to LOD 200]].
  - [ ] Implement **duct sizing** calcs (`calcs/`): airflow + length → duct cross-section (velocity + pressure-drop), transitions at branch reductions, aggregate → shaft/riser. Encode per-subsystem targets in `rules/` (AS 1668.2 + NCC 2022). 4–5 subsystems (straight runs, kitchen exhaust, car-park, …).
  - [ ] Keep an **application-neutral MEP graph** as the source of truth: systems, routes, segment sizes, fittings, ports, terminals, storeys/spaces.
  - [ ] Teach Claude to create native Archicad MEP elements through the stronger MCP (extend the structure-only demo to MEP), then export classified IFC.
  - [ ] Test the exported IFC in Revit: linked-reference quality, classification/properties, ports, and whether opening/conversion produces usable native content.
  - Historical/superseded: direct `mep.py` / `ifc_writer` generation was the fallback when Tapir lacked MEP support; it is not the current primary build path.
- [ ] **Avenue B — train on data.** If intuition *is* needed, build the ML path: get **~100k input/output CAD↔BIM pairs** and train a model to draft BIM. Build the **ingestion + training pipeline** now so data partnerships ([[Data Partnership Moat]], Hassaan-sourced) can flow straight in. Keep a clean schema for paired input CAD/schematic + output BIM.

## 🛠️ Product / infra
- [ ] **Fix website SEO** — Civly doesn't surface on search; tighten copy (Snaptrude's is clearer). (Noted 14 Jun.)
- [x] **Local LLM / feasibility hosting on Hassaan's PC** — Docker + Ollama `gpt-oss:20b` + Cloudflare tunnel live **26 Jun** (`app.civly.dev`). Quality still poor vs Claude API — open decision below.
- [x] **LinkedIn outreach engine** — built **3 Jul**: [Civly-outreach-engine](https://github.com/RatherN-t/Civly-outreach-engine) (LinkedIn MCP, InMail drafts, Reddit/YouTube scrape, playbook routing). Hassaan to install, approve drafts, and send. Add humanizer + per-category sales ladders (Hassaan ask, 3 Jul).

> [!question] Open decision — feasibility tool's model
> Run the Michael feasibility tool on **local Ollama (gpt-oss:20b, free)** or pay for **Claude API (better output)**? Hassaan: local is "so shit." Yash: can't judge a good vs bad architecture output yet, so test local first, revisit after Michael sees it once. Decide once there's a quality signal.

## 📦 Live costing — ship & wrap (DECIDED 18 Jun)
- [ ] **Ship the live-cost / BOQ feature to Michael** (he asked for it), then **wrap it up** — no further investment after delivery. Finish what's needed for his iteration loop, deliver, stop. Don't build out real-time cost-per-edit beyond that. (Mentor flagged it low value; we still honour Michael's ask as a one-off.)

## 📅 Upcoming deadlines
| Date | What |
|------|------|
| **14 Jul eve** | Pitch rewrite call with Hassaan |
| **15 Jul 2pm** | PFC pitch practice with Georgia (online) |
| **~16 Jul** | Slobodan second deck feedback |
| **~19 Jul** | Fable window (extended again) |
| **20–24 Jul** | PFC Pitch Fest — preferred **22 Jul 2–5pm** |
| **18 Sep** | PFC Finals ($50k) |
| *(missed)* | TechCrunch Battlefield (6 Jul); NextGen/Jerry no reply |

## ✅ Done (since 18 Jun)
- [x] Hesh call completed + recorded (16 Jun)
- [x] Reuben Roy (BVN) interview completed (25 Jun)
- [x] `app.civly.dev` deployed on Hassaan's PC (26 Jun)
- [x] Civly outreach engine shipped (3 Jul)
- [x] PFC pitch practice slot booked — 15 Jul online (3 Jul)
- [x] Option A build direction locked with Hassaan (2 Jul)
- [x] IFC comparison tool built with Fable (12–14 Jun)
- [x] Architecture.md + Civly Brain wiki set up
- [x] Booked the Hesh (BIM Accelerator) call

## Related
[[To-Do — Hassaan]] · [[Civly To-Do — Jun 2 to Jun 16]] · [[MEP Drafting — Schematic to LOD 200]] · [[Data Partnership Moat]] · [[Civly Architecture Reference]]
