---
title: "PFC Appendix — Common Questions After the Pitch"
type: analysis
tags: [pitch, pfc, appendix, competitors, pricing, liability, moat, gtm, canva]
created: 2026-09-11
updated: 2026-09-11
sources: 1
---

The appendix that sits after the last slide of the PFC deck (`CIVLY PFC` in Canva). It answers the questions that get asked in the Q&A after a 3-minute pitch and could not fit inside it. Seven questions, one slide each, plus a "Common questions" divider that replaces the old Table of Content slide.

## Question / Prompt
What do people actually ask after we pitch Civly, and what is the tightest, most defensible answer to each, with a visual that lands in five seconds?

## Methodology
- Mined the founders' WhatsApp export (Aug 2025 to 11 Sep 2026) for every question, objection and piece of feedback from investors, judges, mentors, architects and engineers after a pitch or demo.
- Cross-checked answers against the wiki: [[BIM Mentor Call — Drafting vs Coordination & Data Moat]], [[Reuben Roy Call — Competition Bids vs BIM Drafting]], [[Data & Credibility — Core Problem & Open Decisions (SF, 14 Jul)]], [[Data Partnership Moat]], [[Civly - Design vs Engineering Decisions]], [[Pitch Copy Library]], [[PFC Pitch — Deck, Scripts & Prompts]].
- Kept only questions that were asked more than once or by someone who decides money (investor, judge, accelerator manager).

### Where each question came from (evidence)
| # | Question | Who asked / where | Date |
|---|---|---|---|
| 01 | Competition, where do you sit? | Airwallex / Latitude 37 investor call ("Competition, market/growth plan, GTM not clear. Have slides ready for these even if not in the pitch"); LinkedIn commenters ("unsure how this challenges Autodesk, seems like a Revit add-on. Snaptrude is the main challenger") | 21 Jul; 23 Apr |
| 02 | Why $1,999? How do you enforce 5 seats? MRR maths? | Slobodan (mentor, written deck feedback: "10 studios × 5 seats × $2,000 = $100k MRR, you are missing a zero"; "you might get questioned on how you enforce the 5-seat minimum") | 3 Jul |
| 03 | Who is liable if it is wrong? | Michael Westerlund (22 Apr meeting, "the legal liability point you raised"); Hesh (16 Jun: "if someone gets sued it is the architect, not the modeller") | Apr, Jun |
| 04 | Why won't Autodesk build this? | LinkedIn thread on the launch post; the founders' own 20 Jul research ("single biggest strategic risk is Autodesk": Revit 2027 shipped Autodesk Assistant + a Revit MCP server on 7 Apr 2026) | Apr, Jul |
| 05 | No defensible moat | Airwallex / Latitude investor; Sasha (accelerator PM, 14 Jul: "data partnership + credibility is the brick wall"); Yash himself ("moat is such a weird thing", 12 Aug) | Jul, Aug |
| 06 | Who is the customer, GTM unclear, go to Hong Kong directly | Airwallex / Latitude investor; Reuben Roy ("one target market, one client, one sales cycle"); lecturer ("Australia as the addressable market") | Jun, Jul |
| 07 | What does compliance actually cover? Materials? Ceiling heights? | Investor / mentor call transcript, 5 Aug ("is it also doing compliance in terms of how thick windows have to be, the type of concrete, how tall ceilings are?") | 5 Aug |
| (framing) | "So what? What does that mean for all of us?" | PFC industry mentor, 18 Aug, and "spell out MEP and BIM on the slides" | 18 Aug |

## Findings: the seven slides

### Divider: "Common questions."
Replaces the Table of Content slide. Lists the seven questions in two columns.

### 01 Where does Civly sit against other tools?
**Answer in one line:** every tool does one half. A human does both, slowly. Civly does both, in days.

**Visual:** a four-column band table. Civly column outlined in orange, manual column in red.

| | Compliance checkers | Geometry generators | Manual drafting | Civly |
|---|---|---|---|---|
| Who | Archistar AI Precheck, Solibri, UpCodes-style checkers | Archilabs (YC), Snaptrude, Finch, Autodesk Forma, SWAPP | Revit + 5 drafters, often offshore | |
| Produces the BIM model | ✗ | ✓ | by hand | ✓ |
| Checks NCC clause by clause | ✓ | ✗ | by hand | ✓ |
| Learns your firm's past projects | ✗ | ✗ | ✓ (slowly) | ✓ |
| Engineer approves each decision | ✗ | ✗ | ✓ | ✓ |

**Talk track:** "Compliance tools check a model somebody else drew. Geometry tools draw a model nobody has checked, and most stop at architecture or massing. Firms bridge the gap with drafters. We draw and check in the same pass, and the engineer approves each decision."

### 02 Why $1,999 a seat?
**Answer in one line:** one seat costs a fifth of a drafter and removes four of them.

**Derivation (all figures AUD, loaded cost):**
| Step | Number |
|---|---|
| One drafter, loaded cost | $120k / yr |
| Projects per drafter per year | 5 |
| Drafter time per project | $24k |
| Drafters per project | 5 |
| Drafting cost per project today | **$120k** (slide 9) |
| With Civly: drafters per project | 1 |
| One seat, $1,999 × 12 | $24k / yr = a fifth of a drafter |
| Seat cost spread over 5 projects | **~$4.8k per project** (slide 9's ~$5k) |

**Visual:** left card (red) with five person icons and "5 drafters × $24k = $120k per project". Right card (orange) with one person icon plus the Civly cube and "1 drafter $24k + 1 seat $4.8k". Two pills underneath carry the seat maths.

**Footer to defend the inputs:** loaded drafter cost from Australian job ads (Revit documenter ~A$82k, Revit modeller ~A$110k base, per SEEK/Jora, July 2026 research) plus on-costs; 5 projects and 5 drafters per project are averages from our customer conversations. Say that on the slide so a judge does not have to ask.

**If asked about the 5-seat minimum (Slobodan's point):** pilots start at one seat at a discount; the 5-seat minimum applies to Studio after the pilot converts. Do not claim pilots pay $10k a month.

### 03 Who is liable if a compliance check is wrong?
**Answer in one line:** the same person as today, the architect or engineer who signs.

**Visual:** four pills joined by orange connectors: Civly proposes → cites the NCC clause → engineer approves each decision → architect signs, as today. Three cards underneath.

- **Drafters never held liability.** They are architectural technicians. The signing professional carries it. Civly replaces drafting hours, not the signature.
- **Every decision is auditable.** Each element is logged against its clause ID and reasoning, and the export carries it.
- **AI never does the numbers.** Codes live as data in a deterministic engine. The language model reads, it never calculates.

**Footer:** standard tool terms (architect remains professional of record, liability capped at fees) and Tech E&O cover before the first paid seat.

### 04 Why won't Autodesk just build this?
**Answer in one line:** Autodesk sells Revit seats. We remove the drafter hours spent inside them.

**Visual:** two columns.

| What Autodesk shipped (Revit 2027, Apr 2026) | Where we go deep |
|---|---|
| Autodesk Assistant: tagging, views, schedules | NCC 2022 clause by clause, as rule packs |
| A public Revit MCP server, the same open standard we build on | Trained on your firm's own past projects |
| Generic, global, Revit-only | IFC-neutral: Archicad and Revit both |
| | An approval loop built for 5 to 10 person firms |

**Talk track:** "Autodesk's AI does the generic layer: tags, views, schedules. Their MCP server is a door we walk through, not a wall. What they are slowest to do is Australian code depth and firm-specific training, and that is all we do. And frontier chat models read building codes loosely and get them wrong, which is why we keep them away from the numbers."

### 05 What's the moat?
**Answer in one line:** a corpus of Australian schematic-to-model pairs that does not exist anywhere else, feeding an engine that never lets the AI touch the numbers.

**Visual:** a four-step flywheel. Firms share schematic + model pairs under NDA → the engine learns how they draft → output matches their standards → they keep using it and more pairs come in. Three pills: "No public corpus of AU input→output BIM pairs exists", "Rules-as-data NCC engine", "Every project run compounds".

**Numbers if pushed:** target ~100k paired files from ~200 Australian firms; the first pairs come from data partnerships (free access in exchange for files) at zero acquisition cost.

### 06 Who buys it, and how do we reach them?
**Answer in one line:** small architecture and MEP firms running 3 to 5 drafters, reached through warm intros and data partnerships, then Hong Kong where BIM is mandated.

**Visual:** a five-step ladder: Warm intro → Data partnership (free access for files) → Paid pilot → Studio seats (5 minimum) → Enterprise and Hong Kong. Side card: buyer profile (80% of AU firms have fewer than 10 people; drafting is often outsourced offshore, with QA problems). Traction pill: 3 LOIs, 1 paid pilot, 10 signups.

**Why Hong Kong:** BIM mandated for public works; Leo Chan's compliance business is the route in. Say "Sydney first, Hong Kong second", not both at once.

### 07 What does "code-compliant" actually cover today?
**Answer in one line:** the NCC 2022 rules that decide geometry, run as data with a clause cited for each. Not final certification.

**Visual:** three columns.

| Live now (NCC 2022, Class 2 apartments) | Next | Never |
|---|---|---|
| Egress and stair rules | Fire resistance levels | Design decisions |
| Ventilation rates | Energy / BASIX | Final certification |
| Parking ratios | Hydraulics and electrical detail | Anything without a human approval |
| Structural sizing (columns, slabs) | | |
| Space and area schedules | | |

**How it works (one line under the table):** geolocate the site → load the jurisdiction rule pack (NCC 2022 today, HK CoP next) → every element evaluated by deterministic calcs → clause cited on the element. Output is marked "not certified for construction"; a registered practitioner signs.

## Deck inconsistencies to fix before PFC (found while building this)
1. **MRR maths on slide 9.** "5 pilot firms, $10k MRR" does not reconcile with $1,999 × 5 seats: five firms at Studio price is ~$50k MRR. Either say pilots are discounted single seats, or change the number. Slobodan flagged the same thing on 3 Jul.
2. **LOI count.** Traction slide says 2 LOIs; the messaging rules say lead with 3 LOIs + 1 paid pilot. Pick one.
3. **Headline mismatch.** Slide 9 says "10x Cheaper"; the index said "5x Cheaper". The pricing maths supports about 4 to 5x on drafting cost per project ($120k → $28.8k) or 25x if you count only the seat.
4. **Team slide labels.** Hassaan is labelled "Technical Co-Founder, AI/ML, UNSW, Ex-Anthrobyte" and Yash "Commercial Co-Founder, built and exited a startup valued at $1.6M". The wiki says the reverse (Yash is the AI engineer). Check the slide.
5. **Typos still live:** "perferences", "STRUCTUALY".

## Limitations
- The PFC judges' written feedback (30 Jul) and the accelerator interview feedback (8 Sep) were shared as images in the chat and could not be read here. Check them against this list.
- Salary and project-count inputs are averages from conversations, not a survey. The slide says so.
- Competitor placements are from public websites and the founders' own demos; SWAPP and Augmenta have no public product to test.

## Related pages
[[PFC Pitch — Deck, Scripts & Prompts]] · [[Pitch Copy Library]] · [[Data Partnership Moat]] · [[Civly - Design vs Engineering Decisions]] · [[BIM Mentor Call — Drafting vs Coordination & Data Moat]] · [[Data & Credibility — Core Problem & Open Decisions (SF, 14 Jul)]] · [[Archilabs]] · [[Snaptrude]] · [[Finch]]
