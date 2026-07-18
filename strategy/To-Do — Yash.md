---
title: "To-Do — Yash"
type: analysis
tags: [todo, civly, yash, product, ml, mep, ifc, research]
created: 2026-06-18
updated: 2026-07-14
sources: 3
---

Yash's list — **technical: the AI BIM drafter, MEP generation, the ML/data pipeline, and the research questions.** Split from [[Civly To-Do — Jun 2 to Jun 16]] after the [[BIM Mentor Call — Drafting vs Coordination & Data Moat]]. Hassaan's half: [[To-Do — Hassaan]]. Direction: [[Civly Direction — Drafting-First Pivot (Jun 2026)]].

---

> [!note] Reconciled from WhatsApp chat — 14 Jul 2026
> **Option A still locked.** Sharath (6 Jul): can't share office files but happy to help → Hassaan to ask for an **office-side NDA intro**. Fable extended again (to ~19 Jul; may stick). Confirmed build focus (**14 Jul**): **the stronger Tapir-style Archicad MCP is the product path**, including schematic-driven MEP creation; direct IFC generation is not a parallel priority. Reddit r/BIM pain-point scan done (7 Jul) — useful for outreach hooks.

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
