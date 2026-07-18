---
title: "Civly To-Do — Jun 2 to Jun 16"
type: analysis
tags: [todo, civly, action-items]
created: 2026-06-16
updated: 2026-06-16
sources: 0
---

Extracted from Hassaan × Yash WhatsApp chat, 2 Jun – 16 Jun 2026. Grouped by area. Tick off as done.

> [!note] Now split by owner (18 Jun 2026)
> After the [[BIM Mentor Call — Drafting vs Coordination & Data Moat]], this master list is split into per-owner lists. Work from those going forward:
> - [[To-Do — Hassaan]] — advisors, outreach, data partnerships, funding, registration.
> - [[To-Do — Yash]] — the AI BIM drafter, MEP generation, ML/data pipeline, research questions.
> Strategy context: [[Civly Direction — Drafting-First Pivot (Jun 2026)]] · [[Advisor List & Question Routing]]. This file is kept as the historical Jun 2–16 record plus the 18 Jun update below.

---

## 🆕 18 Jun update — drafting-first pivot (new items)

Folded into the split lists above; summarised here for the record.

- [ ] **Pivot the wedge to BIM *drafting*** (design phase, LOD 0 → ~200), not coordination. [[BIM Drafting vs Coordination]] · [[Level of Development (LOD)]].
- [ ] **MEP: schematic (CAD) → LOD 200 model** + automate **duct sizing** (no engineer intuition needed). [[MEP Drafting — Schematic to LOD 200]]. (Yash)
- [ ] **Data partnerships = the moat** — spreadsheet AU MEP consultancies → pitch data-for-product → NDAs → ~100k input/output pairs → train ML model. [[Data Partnership Moat]]. (Hassaan BD + Yash pipeline)
- [ ] **Build the advisor bench + question routing** (Michael, Hesh, UK MEP modeller, Dhanjeet Sah, Priscilla→professor, Reuben, Andrew later). [[Advisor List & Question Routing]]. (Hassaan)
- [ ] **Message Michael** with results; **send Hesh** a demo + lock advisory; **get UK MEP-modeller intro**. (Hassaan)
- [ ] **Validation by volume** — call many MEP consultancies ("would you want this?"). (Both)
- ✅ **Live costing → ship & wrap** (decided 18 Jun): deliver to Michael, then stop — no further investment.
- ✅ **Buyer = anyone in the LOD 0 → 250 process** (decided 18 Jun): architectural draftspersons + BIM drafters/technicians + MEP consultancies, not architects-vs-MEP either/or.

---

## Product

- [ ] **Rebrand the demo UI** — Claude chat colours are too close; make it clearly Civly-branded, not bare Claude (Hassaan 16 Jun)
- [ ] **IFC option/comparison tool** — Yash built this with Fable: upload IFC files, text prompt to compare feasibility of multiple design choices; needs security review before sharing with architects (Yash, in progress)
- [ ] **Deploy the IFC tool** — Decision: host as open link with auth portal (not local install); get it in front of Michael and the BVN tutor
- [ ] **MEP** — no Tapir MCP support; mep.py + ifc_writer path; next milestone is IfcSpace per MepZone (feat/p2-c3-ifc-space). Keep ingesting BIM Accelerator tutorials to teach Claude MEP rules
- [ ] **Live cost / quantity takeoff feature** — Michael and Disha's dad both pointed here; IFC stores materials, run live cost sync per design iteration (BOQ → low/med/high estimate). ✅ **Decided 18 Jun: ship to Michael, then wrap up** — no further investment (mentor de-valued real-time costing; honour Michael's ask as a one-off). See [[BIM Mentor Call — Drafting vs Coordination & Data Moat]].
- [ ] **Fix website SEO** — Civly doesn't show up when you search for it; website copy isn't clear (Yash noted Snaptrude's is clearer)
- [ ] **Local LLM server on Hassaan's PC** — RX 5700 XT + Ryzen 3700X can run a chunkier model; set up Ollama server so Civly pulls from it instead of paying API credits (Yash to set up when needed)

---

## Outreach / Sales

- [ ] **Reply to Michael Westerlund** — he hasn't responded; send updated demo link (YouTube channel was hacked/suspended; new upload on civlyvibe@gmail); ask for 2nd meeting; show him the IFC comparison tool (Hassaan)
- [ ] **Onboard Andrew Tang-Smith** — LOI signed, Perth architect; move to active pilot (Hassaan)
- [ ] **Set up meeting with BVN tutor** (Reuben Roy — Yash's entrepreneurship lecturer's contact, ex-BVN architect) — in person at UNSW if possible; Hassaan free 13–15 Jun or after exams (17 Jun+); booked for 22 Jun (Mon)
- [x] **Meeting with Hesh (BIM Accelerator Instagram guy)** — today 16 Jun 4pm; prep mostly technical questions; compile question list NOW (Yash)
- [x] **PFC mentor meeting** — today 16 Jun 9pm; mentor vouches for top 10 during voting; build good rapport
- [ ] **Reach out to Priscilla (UNSW education program manager)** — she knows architects at Michael's level and offered intros; Yash to email and ask her to connect (Yash)
- [ ] **fjcstudio outreach** — architect firm, set up meeting (Hassaan noted 12 Jun)
- [ ] **Rey's brother (Studio Tangara founder, designed Perth Airport)** — first call to introduce Civly and interview him; Yash to prep interview questions doc before calling (Yash)
- [ ] **Disha's dad (quantity surveyor contact)** — he responded; send him actual output (BOQ/BOM from IFC); text asking for proper call

---

## Traction / Funding

- [ ] **Protostars grant application** — for API credits; info session 17 Jun (tomorrow); Yash to attend in person then both apply after (deadline TBC); Hassaan to join if not exam-clashing
- [ ] **PFC (Proto First Cohort)** — workshops 3 Jun–8 Jul; Pitch Fest 20–24 Jul; Finals 18 Sep; $50k grant; attend workshops in person to set impression (Yash going tomorrow 17 Jun, 1pm in-person or 11am online)
- [ ] **Register the business** — not yet a registered entity; needed before making formal claims in meetings (flagged 12 Jun)
- [ ] **LinkedIn outreach blitz** — Yash has a 2-month LinkedIn Premium trial (redeem before 29 Jun); use it to max-connect with architects and firms (Yash/Hassaan, as soon as possible)
- [ ] **AirTree Frontier** — Yash shared link (4 Jun); check eligibility and apply

---

## Investor / Accelerator Follow-up

- [ ] **Ben Simai (Startmate)** — ben@startmate.com.au / bensimai@startmate.com.au; email already sent with LOIs + demo video; follow up if no response this week
- [ ] **Startmate application outcome** — decisions were supposed to come out this month (Jun); check / follow up

---

## Meetings This Week (Jun 16–22)

| Date | Who | What |
|------|-----|-------|
| 16 Jun (today) 4pm | Hesh (BIM Accelerator Instagram) | BIM product questions — prep technical Qs NOW |
| 16 Jun (today) 9pm | PFC mentor | Relationship building; mentor votes for top 10 |
| 17 Jun (tomorrow) 1pm in-person / 11am online | PFC workshop | Attend in person if possible |
| 17 Jun (tomorrow) | Protostars info session | 12–1pm; apply after |
| 22 Jun (Mon) | BVN tutor (Reuben Roy) | In-person UNSW; interview on BIM product needs |

---

## Open / Deprioritised

- [ ] **Hire BIM modellers to work alongside Civly** — data collection strategy; deferred until a clearer product direction is set
- [ ] **India outreach (quantity surveyors / architects)** — paused; Indian firms mostly interior architects or unwilling to share CAD files; revisit after Australian pilots established
- [ ] **BOM accuracy validation** — Disha's dad sent BOQ (fire system); Yash converted to comparable format; needs a cleaner output before next push to customers

---

## Done (this period)

- [x] Startmate first-round interview (5 Jun) — attended; waiting on outcome
- [x] Two LOIs secured — City Heights + Disha's dad's firm (Hassaan, 4–5 Jun)
- [x] Demo video made and sent to Ben Simai (5 Jun)
- [x] Arrayah Chapter 4 showcase pitch (11 Jun)
- [x] IFC comparison tool built with Fable (Yash, 12–14 Jun)
- [x] Architecture.md + Civly Brain wiki set up (14–16 Jun)
- [x] Booked Hesh (BIM Accelerator) call via Calendly (Yash, 8 Jun)
- [x] UNSW Education Program Manager meeting (Yash, 11 Jun) — she offered architect intros; good for PFC
