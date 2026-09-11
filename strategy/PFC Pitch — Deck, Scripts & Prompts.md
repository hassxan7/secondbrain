---
title: "PFC Pitch — Deck, Scripts & Prompts"
type: analysis
tags: [pitch, pfc, deck, canva, nano-banana, business-model, gtm]
created: 2026-07-15
updated: 2026-09-11
sources: 1
---

Self-contained handoff for rebuilding the **Peter Farrell Cup (PFC)** deck. Everything needed to (re)build the three missing slides in Canva and match the existing design language. Built off the current 12-slide deck (`CIVLY PFC.pdf`) and the UNSW Founders "Pitch Builder" 12-box framework (Why → How → Next).

> [!tip] How to use this in a fresh chat (recommended — this thread got long)
> Start a new chat, connect **Canva** (already connected at the account level), and say: *"Read `strategy/PFC Pitch — Deck, Scripts & Prompts.md` in my Civly Brain vault and help me build these slides in Canva."* If the new chat can't see the vault (plain claude.ai), paste this file's contents + upload `CIVLY PFC.pdf`. Canva MCP can generate presentations, autofill your brand templates, upload image assets, and export — see the Canva workflow notes at the bottom.

---

## 1. Design language (paste this as the style block in every image prompt)

The real deck is **cinematic, not flat-vector-minimal**:

- **Matte black background** (near #0A0A0A / true black).
- **Huge white Helvetica-style bold headline, sentence case, ending with a period** — e.g. "Architects are Drowning in Work.", "Manual Drafting is now Obsolete.", "The Solution:".
- **Photorealistic collage + real software screenshots** (Revit, Archicad, BIM model renders). Never flat vector icons.
- **Stats live in cream / off-white rounded pill badges with black bold text** — e.g. "-2 Months Lost", "68% of hours spent", "~2000 man hours lost".
- **Thin orange (#E8804C) connector lines** tie elements together.
- **Feature callouts = orange-outlined skewed parallelogram cards** on black: white bold caps title, orange body text (e.g. "AN ENGINE THAT LEARNS YOU").
- **Green rounded "Pass" / "NCC Code Verified" badges** for verification moments.
- Tagline: **"Make the design. Leave the rest to us."**

> When generating images (Nano Banana Pro), **attach slides 2, 3, 4 as reference images** and open the prompt with: "Match the exact visual style, typography and color language of the attached reference slides." Description alone drifts.

---

## 2. Deck coverage map (PFC builder → your deck) + running order

Current deck has 12 slides; missing PFC boxes were **9 Business Model, 10 Timeline, 11 Ask** (now built below).

| PFC box | Covered by | Status |
|---|---|---|
| 1 Context/Problem | S2 "Architects are Drowning" + S3 (68% hours, 2 months) | ✅ |
| 2 User/Customer | implicit — **fix in script** (patch below) | ⚠️ |
| 3 Need/Opportunity | S3 + **"why now" missing** (patch below) | ⚠️ |
| 4 Solution/Product | S4 (input→ML→BIM, approval loop) + S5 (2mo→20min) | ✅ |
| 5 Efficacy/Traction | S7 + S10 — **update to 3 LOIs + 1 paid pilot + 10 signups** | ✅ |
| 6 UVP | S6 (30x faster, 5x cheaper) | ✅ |
| 7 Team | S8 founders + S9–S11 mentors | ✅ (over-weighted, 4 slides) |
| 8 Marketing Plan | S11 funnel + data-partnership flywheel (BM slide) | ✅ |
| 9 Business Model | **NEW (below)** | ✅ |
| 10 Timeline | **NEW (below)** | ✅ |
| 11 Ask | **NEW (below)** | ✅ |
| 12 Vision | S12 (Engineering Intelligence, Data Is Our Monopoly) | ✅ |

**Recommended order (15 slides):** 1 Title → 2–3 Problem → 4–5 Solution → 6 UVP/cost → 7 Traction → 8 Team → 9–10 Mentors *(consider merging to one)* → 11 Funnel → **12 Business Model** → **13 Timeline** → **14 Ask** → 15 Vision. Matches Why → How → Next; ends on Vision.

---

## 3. Business model (the recommendation)

**"Paid in data first. Then in seats."** — a flywheel that turns the data-partnership strategy into the revenue story:

1. **Data partnerships (now, CAC ≈ $0):** firms hand over schematic + model pairs under NDA for free early access. Every project compounds the moat.
2. **Studio SaaS (revenue engine):** **US$1,300/seat/month · min 5 seats ≈ US$78k/firm/yr.** Anchor against labour, not software: a drafter in a high-cost market costs ~US$65–90k/yr loaded → one Civly seat delivers **a drafter's output at ~1/4 the cost, 30x faster.** (Pricing against a drafter is what makes US$1,300 land — don't let judges compare it to a $199 tool.)
3. **Enterprise + government later**, riding the HK BIM mandate / EU procurement wave; long-term the data layer is the product.

**TAM / SAM / SOM (global, USD — rebuilt 11 Sep 2026, see [[TAM SAM SOM — Global Rebuild (Sep 2026)]]):**

| | Number | Math |
|---|---|---|
| **TAM** | **US$60B/yr** | global AEC drafting + BIM modelling labour: ~2M drafters/BIM technicians worldwide × ~US$30k blended fully-loaded cost. Cross-check: 180,200 US drafters (BLS, May 2025) ≈ US$16B ÷ the US's ~25% share of the US$1.59T global AE consulting market ≈ US$64B |
| **SAM** | **US$9B/yr** | ~600,000 MEP + structural **design-phase** drafting seats worldwide (LOD 0→250, BIM-capable markets) × US$15,600/seat/yr |
| **SOM** | **US$20M ARR by 2030** | 250 firms × ~US$78k ACV = **0.2% of SAM**; ramp 10 firms (2027) → 40 → 120 → 250 |

> [!important] Say it in this order or the numbers look inconsistent
> TAM is the **labour being displaced**. SAM and SOM are **revenue at Civly's price**. Those 600,000 SAM seats cost ~US$33B/yr in wages; Civly's price across them is ~US$9B — a 28% ratio, which is the same "a drafter's output at ~1/4 the cost" claim arriving from the market side. Never state TAM in labour and SAM in revenue without naming the switch.

> [!warning] Pricing must be quoted in USD
> **US$1,300/seat/mo · min 5 seats ≈ US$78k/firm/yr.** An AUD price on a global slide reintroduces the AU/NZ signal this rebuild removes. Replace A$1,999 / A$120k everywhere they appear.

### Historical / Superseded
The pre-11-Sep-2026 figures, kept for reference. Retired because they framed Civly as an AU+NZ company and because the layer labelled SAM was beachhead-sized (SOM-scale), not serviceable-market-scale.

| | Number | Math |
|---|---|---|
| **TAM** | **US$40B+** | global BIM/CAD drafting labour |
| **SAM** | **A$1.8B/yr** | ~15,000 AU+NZ small-mid AEC firms (80% have <10 people) × A$120k/firm/yr |
| **SOM** | **A$6M ARR by 2029** | 50 firms = **<0.5% of SAM**; stepping stone already stated: 10 pilots → $10k MRR |

> ⚠️ Coherence note: at $1,999 × 5 seats ≈ A$10k/mo per firm, the slide's "10 pilot firms, $10k MRR" reads inconsistent (10 paying firms ≈ A$100k+ MRR). Reconcile: pilots are free/discounted; "$10k MRR" ≈ the first ~1 firm at full price. Say it cleanly so a judge doesn't catch the mismatch.

---

## 4. The three new slides — on-slide copy + script

### Slide 12 — BUSINESS MODEL
**On-slide:** Headline "Paid in data first. Then in seats." · Flywheel: DATA PARTNERSHIPS → free access for schematic+model pairs (NDA) → engine compounds → STUDIO seats · Pricing card **STUDIO · US$1,300/seat/mo · min 5 · ≈US$78k/firm/yr · = a drafter's output at 1/4 cost** · TAM/SAM/SOM figures · Footer "Customers indicated they would pay — 3 LOIs · 1 paid pilot".

**Script (~30s):** "We get paid twice. First in data: firms hand us schematic and model pairs under NDA in exchange for early access. Zero acquisition cost, and every project trains the engine. Then in seats: Studio is thirteen hundred US dollars a seat a month, five minimum. That sounds steep until you price a drafter — one seat is a drafter's output at a quarter of the cost, thirty times faster. Customers already said they'd pay: three letters of intent, one paid pilot. Drafting labour is a sixty-billion-dollar market globally. The MEP and structural slice we serve is six hundred thousand seats — nine billion dollars at our price. Two hundred and fifty firms makes us twenty million a year by 2030, two tenths of one percent of it."

### Slide 13 — TIMELINE
**On-slide:** Headline "The next twelve months." · NOW→SEP '26: mechanical slice live (schematic→LOD 250) · 10 data partnerships · PFC Finals — OCT→DEC '26: 10 pilot firms · NCC rule pack complete · first revenue $10k MRR — JAN→JUN '27: Studio launch · full multi-discipline MEP · seed round.

**Script (~20s):** "In the next twelve months: by September the mechanical slice is live — schematic in, LOD 250 model out — with ten data partnerships signed. By December, ten pilot firms and first revenue at ten thousand monthly. By mid-2027, Studio launches with full multi-discipline MEP, and we raise our seed."

### Slide 14 — ASK
**On-slide:** Headline "The ask." · **$50K** → 40% compute + model training · 30% data-partnership program (NDAs, onboarding) · 20% pilot conversion · 10% company setup · "Just as valuable:" intros to Sydney AEC + MEP firms · architects/engineers to break it · a mentor in AEC enterprise sales.

**Script (~20s):** "Our ask. The fifty-thousand-dollar grant goes straight into compute and model training, our data-partnership program, and converting pilots into paying firms. Just as valuable: introductions. If you know a Sydney architecture or MEP firm, put them in front of us — we want them to try to break it, because every break makes it smarter."

---

## 5. On-brand Nano Banana Pro prompts

> Attach reference slides 2, 3, 4 with each. All three open with: "Match the exact visual style, typography and color language of the attached reference slides (matte black, big white Helvetica-bold sentence-case headline with a period, real screenshots, cream rounded stat pills with black text, thin orange #E8804C connector lines, orange-outlined skewed parallelogram cards)."

**Business Model:**
> …16:9 pitch slide. Headline top-left: "Paid in data first. Then in seats." One continuous left-to-right flow connected by thin orange lines: START a fanned stack of realistic architectural CAD schematic sheets + a Revit model screenshot, tagged with a cream pill "Schematic + model pairs · under NDA"; flowing THROUGH a glowing translucent prism (same motif as the solution slide) tagged "Every project trains the engine"; INTO a dark pricing panel with thin orange border — "STUDIO" in orange caps, "US$1,300" huge white, "per seat / month · min 5 seats" grey, divider, "One seat = a drafter's output at 1/4 the cost", green badge "30x faster". An orange return arrow loops from pricing back to the schematic stack, tagged "Early access for data · CAC ≈ $0". Right edge: a photorealistic night city skyline rising from the bottom in three progressively brighter layers, thin orange leader lines to three cream pills: "TAM · US$60B global AEC drafting labour", "SAM · US$9B · 600,000 seats worldwide", "SOM · US$20M ARR by 2030 · 250 firms". Footer small white: "Customers indicated they would pay — 3 Letters of Intent · 1 paid pilot". Cinematic, dramatic lighting, crisp legible text, 4K.

**Timeline:**
> …16:9, matte black. Headline "The next twelve months." One photorealistic building at three construction stages left-to-right along a thin orange baseline: (1) concrete structural skeleton, (2) frame filling with colorful MEP ductwork/pipes like a BIM render, (3) completed glowing tower with a green "NCC Verified" badge. Above each: white bold date labels "Now → Sep 2026", "Oct → Dec 2026", "Jan → Jun 2027". Below each: three cream rounded pill badges, black bold text. Stage 1: "Mechanical slice live: schematic → LOD 250", "10 data partnerships", "PFC Finals". Stage 2: "10 pilot firms", "NCC rule pack complete", "First revenue: $10k MRR". Stage 3: "Studio launch", "Full multi-discipline MEP", "Seed round". Thin orange connectors. Cinematic, dramatic lighting, 4K.

**Ask:**
> …16:9, matte black. Headline "The ask." Left half: huge white "$50K" with a photorealistic construction crane lowering four glowing translucent building blocks into place, each labeled with a cream pill: "Compute + model training · 40%", "Data partnership program · 30%", "Pilot conversion · 20%", "Company setup · 10%". Thin orange guide lines crane→blocks. Right half: three orange-outlined skewed parallelogram cards (same style as the solution-slide callouts), white bold caps titles + orange body: "INTROS / Sydney AEC + MEP firms", "BREAKERS / architects and engineers to stress-test the product", "A MENTOR / in AEC enterprise sales". Bottom-right: small white Civly cube logo + grey tagline "Make the design. Leave the rest to us." Cinematic, dramatic lighting, 4K.

---

## 6. Script patches for the two thin boxes (no new slides)

- **User/Customer (over S2/S3):** "This lands on everyone between the design and the build — architects, draftspersons, BIM technicians, and the MEP consultancies that employ three to four drafters each."
- **Why now (closing the problem):** "And the pressure is rising: Hong Kong has mandated BIM, the UK and EU now demand it in procurement, and firms without it are already losing contracts."

---

## 7. Fixes to make on the existing deck
1. **S7 traction:** "2 Letters of Intent" → **3 LOIs + 1 paid pilot + 10 signups** (you're underselling).
2. **S8 exit claim:** "Exited at $1.6M valuation" + "$1.6M ARR" reads inconsistently, and conflicts with the Z Fellows copy ("exited for $1.2M USD"). Pick one story — see [[Pitch Copy Library]] "open inconsistencies". (Likely: scaled FarmVillage to ~A$1.6M revenue, exited for a separate amount — confirm.)
3. **Typos:** Obsolute→Obsolete, perferences→preferences, Ediitng→Editing, Structualy→Structurally, Businsess→Business, aquistion→acquisition, Engireering→Engineering.

## 8. Timing warning
PFC pitches are typically **~3 minutes**. 15 slides ≈ 12s each — the scripts above run long. Rough budget: Problem 30s · Solution 45s · UVP+Traction 30s · Team 20s · Funnel+BM 40s · Timeline 15s · Ask 15s · Vision 15s ≈ 3:00 (mentor slides get ~5s). **Confirm the exact time limit before the Georgia practice run and cut to fit.** If 5 minutes, comfortable.

## 9. Canva workflow notes (what the MCP can/can't do)
- **Best path:** build **one branded master slide** in Canva (matte-black + your type/pills/cards), publish it as a **brand template**, then the MCP can **autofill** it across slides with the content above — most faithful to the design language.
- **Also works:** `generate-design` / `generate-design-structured` (presentation) from the recommended order + copy; **upload the Nano Banana slide images as assets** and place them; **import-design-from-url**; **export** to PDF/PNG/PPTX.
- **Limit:** the MCP cannot pixel-clone an arbitrary image into fully-editable native Canva elements. Use images as reference + the structured copy → generate/autofill → fine-tune in the Canva UI.

## Related
[[Pitch Copy Library]] · [[Data Partnership Outreach Strategy]] · [[LinkedIn & Content Strategy]] · [[Civly Direction — Drafting-First Pivot (Jun 2026)]] · [[Civly - Traction and Funding]]
