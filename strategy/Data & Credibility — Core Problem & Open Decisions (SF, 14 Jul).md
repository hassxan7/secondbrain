---
title: "Data & Credibility — Core Problem & Open Decisions (SF, 14 Jul)"
type: analysis
tags: [strategy, data-moat, credibility, gtm, funding, advisors, pitch, decisions]
created: 2026-07-14
updated: 2026-07-14
sources: 1
---

Formalised from the **Sasha meeting** (program manager, SF — the accelerator Civly is in), 14 Jul 2026. Sasha's blunt verdict: **the data-partnership + credibility problem is the brick wall. Everything else Civly has done is "above and beyond for PFC." The company does not really exist until this is cracked, or a pivot is found.** This page turns the meeting into named problems, decision tables, and a short list of decisions to actually make.

## Executive summary
- **The one thing that matters:** cracking **data acquisition**, which is gated by **credibility**. Solve it and "you'll have a defensible moat and you'll have customers, because the relationships will already be deep."
- **The funnel is backwards.** Normal SaaS: free → trust → pay. Civly: must build **deep trust first**, then get **data** (more precious to firms than money), then convert to customer. Trust cannot be bought; a paid endorsement reads as an influencer, not a champion.
- **Firms love the idea, but it "sounds too good to be true"** and their schematics/models are treated as **design identity / IP** (even an MEP consultancy guards *how they do their bends*). Two students with no credibility asking for precious files is a hard ask.
- **Counter-signal (Hesh):** MEP schematics are actually passed around loosely between 5+ consultancies for work, so firms may share more readily than architects fear. Worth testing.

---

## Problem A — Data acquisition (the brick wall)
Need on the order of **100k–200k paired input→output files** to train a usable model. A single architect has ~50 files; a firm has ~100–200k; a few firms clears the bar. Avenues and trade-offs:

| Avenue | How it works | Upside | Risk / cost |
|---|---|---|---|
| **1. Direct firm data partnerships** (primary) | Firms give schematic+model pairs under NDA for free/early access | Real, on-domain data; deepest moat | IP/identity fear; credibility gap; slow trust-building |
| **2. Enterprise private model** | Train only on one firm's data, stays in their walls, enterprise pricing (compute-cost) | Removes the "our data leaks" objection; premium revenue | Needs ~100k files from **one** firm; expensive compute; a big firm could build its own |
| **3. Website "single mass-change" tool** | Free utility (make one change across a model) with T&Cs granting training rights; ChatGPT-style hair-on-fire capture | Ingests files at volume; low-friction | Noisy data; rides into the data-privacy backlash ("don't train on my data") |
| **4. Paid schematics** | Buy files outright | Fast; already done once ("we paid, at larger scale") | Costs cash; limited volume |
| **5. Scan libraries / marketplaces** | Largest scan library in the world (paid); CAD-Bull / family libs | Bulk availability | Disorganised → needs a cleaning/organising layer first; families are mostly noise/incomplete |
| **6. BIM coordinators as aggregators** | Coordinators sit at the "final line" and receive data from 10+ consultancies; partner with a coordinator's "startup arm" (Hesh) | One relationship unlocks many firms' data | Whose data is it to give? Purview/consent unclear |
| **7. Retiring architects / council ex-presidents / advisory boards** | Elder statesmen with the best networks and less to protect | Warm intros + goodwill + credibility | Slower; relationship-led |
| **8. Academics / professors** | Many have data or worked at firms that do; also a credibility unlock | Data + credibility together | Superficial help without a credibility hook (see Problem B) |

**Technical note (regardless of source):** training needs the **"corruption" method** — take finished models, remove elements, feed before/after chunks so the model learns each element in context (material/concrete choices are building-wide, not per-element). Building that system is fine; **the data is the hard part.**

---

## Problem B — Credibility (what unlocks the data)
Firms won't share with "two uni students." Credibility is the key, and it compounds. Levers:

- **Accelerator / institutional badge** — but frame it for the audience. Most professors won't know "10X"; say **"UNSW backs us / UNSW Founders"** instead. External accelerators (Startmate, Z Fellows, Latitude) add more.
- **A genuinely architect-intuitive demo** — a sharp, pinpointed demo on **YouTube**, pinned on LinkedIn, so "who is this guy?" resolves to "oh, that's really cool." The stronger MCP (~90% done, ~40 tools, ~10 days out) enables it. **Highest-leverage near-term credibility move.**
- **An industry champion** — a respected professional who vouches. Michael is the candidate. Ask him directly: *"what would you need to see from us to trust us / to vouch?"*
- **Thought leadership** — founder LinkedIn/Instagram presence as the "go-to" voice on AI-in-BIM.
- **Grants / investment** — external validation dollars.
- Trust is the currency you **cannot buy**; a paid mouthpiece is discounted. Build it through real relationships and let architect advisors carry the language to other architects.

---

## Problem C — The Hesh relationship (decision needed)
Hesh asked for money within a couple of weeks. That reframes him: **not a "champion" (unpaid, trust-based), but a paid operator.**
- **Why he's still valuable:** he's **monetary, capable, and networked** — runs a BIM-coordination course (the exact people we automate away from), and is confident MEP consultants will hand over schematics ("they go everywhere, people are loose with them"). He already gave one contact (who said it wasn't his purview to share office files).
- **The structure to use:** a **bounty** — pay Hesh $X **per data partnership he actually secures** (outcome-based, verifiable), once there is cash. Not equity (paid + equity = worst of both), not a standing retainer (tap-off risk).
- **Decision:** ⏳ *hold the bounty until there's grant/pre-seed cash; then run a small Hesh bounty pilot.* Do **not** give equity for a paid relationship.

## Problem D — Advisor equity hygiene (rule, per Sasha's warning)
- **Rule:** advisors are **0% equity, "onboarded advisor."** Do **not** give 10% for occasional chats. Question every advisor equity ask.
- **Michael:** 0% equity onboarded advisor. Equity only **if** he provides data (a real, outcome-tied consideration). Don't state equity in the pitch; only discuss if asked.
- Money vs equity trade-off to remember: **equity ties people to the company; money doesn't.** Prefer equity for people you want long-term aligned, money for transactional help.

## Problem E — Funding path (options + criteria)
Open to VC / angel / bootstrap / grants / strategic. **Criteria:** money in the pocket, **fair** equity given up, and **credibility** (a big cheque from a nobody is worth less than a smaller one that signals).
- **VC path** = defined, bigger cheque, ~10–20% per round, but expects a clean/legible structure.
- ⚠️ **Creative "data-for-equity" structures scar VC-ability.** Giving every data contributor a tiny equity slice (a "data funding" crowdfund) is clever and could win goodwill, but a messy cap table makes VCs walk. **Decision:** don't lock any data-for-equity structure now; keep the VC path open; if used, keep it off the cap table (revenue share / credits, not equity).

## Problem F — Product sequencing (soft features vs the full model)
The full ML product is data-gated and slow/expensive to train even once data lands. Sasha: **"the building-they-will-come is a fallacy"** — keep shipping non-big-model value to get people in the door and build trust in the meantime.
- **Ship-now, door-opening value:** compliance checks (NCC 2022) and **feasibility / live-cost** (architects want to keep a running budget tally while designing). These work today via the MCP without the trained model.
- **Decision:** **parallel.** Keep the main product (schematic → LOD 250) as the north star, but ship one genuinely useful architect-facing sub-feature + a strong demo to open doors and earn early trust/pilots. Don't deviate the *goal*; do generate momentum.

---

## Decisions to actually make (short list)
1. **Hesh** → bounty-per-partnership once cash exists; no equity. *(Owner: Hassaan.)*
2. **Michael** → confirm 0% equity onboarded advisor; ask him what he needs to become the champion. *(Hassaan.)*
3. **Data-for-equity** → do not adopt now; protect VC-ability. Revisit only as revenue-share. *(Both.)*
4. **Product sequencing** → parallel: north-star product + one door-opening sub-feature + demo. *(Both.)*
5. **Which warm contacts are customer-stream vs data-stream** → e.g. Andrew Tang-Smith (friend's brother, Perth Airport, Studio Tangara) is earmarked **customer**, not data. Allocate the rest. *(Hassaan.)*

## Leads / intros from Sasha (need a blurb + website to trigger)
- **Howdger / "Hydra" — founder of Plannerverse** (planoverse.?): retail-data startup, ex-accelerator, ex-Dial consulting; freemium-to-get-in-the-door + enterprise-data-trust model that rhymes with ours. Advisory chat offered.
- **PhD student, ADA / built environment** — working on **3D models → code**; possibly adjacent competitor or ally. Intro offered ("if you're willing").
- **Action:** send Sasha a 1–2 sentence blurb + the website so she can double-opt-in intro both.

## Pitch changes (PFC-specific, from Sasha)
- **Compress the compliance explanation** — it doesn't land in the first bit; get to the "wow" faster.
- **Keep the coding analogy** — "software devs don't write from scratch anymore; this hasn't translated to 3D" is a strong simile. (Aligns with the new hook.)
- **Traction is strong** — hundreds of architect interviews, undercover build-expo research. But **finals = memorable on stage > proving the work**; if you add traction, cut something (balancing act).
- **Update headshots** — current ones "look like you're 12"; use current photos, ideally the two of you with growth/technical/next labels.
- **Per-seat price** — $199 (fix the $1999 typo) reads high vs the ~$30/seat norm; **explain "one seat replaces 4–5 drafters,"** so effectively one seat per firm.
- **Do not touch the "AI replacing jobs" fear** — you didn't in the pitch; keep it that way (people's-choice vote sensitivity).

## Related pages
[[Data Partnership Moat]] · [[Data Partnership Outreach Strategy]] · [[Civly Direction — Drafting-First Pivot (Jun 2026)]] · [[To-Do — Hassaan]] · [[To-Do — Yash]] · [[Hesh]] · [[Michael Westerlund]] · [[Andrew Tang-Smith]] · [[Advisor List & Question Routing]]
