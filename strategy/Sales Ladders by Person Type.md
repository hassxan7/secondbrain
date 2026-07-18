---
title: "Sales Ladders by Person Type"
type: analysis
tags: [gtm, outreach, sales-ladder, advisor, data-partnership, customer, hassaan, civly-core]
created: 2026-07-03
updated: 2026-07-03
sources: 1
---

Before you write to anyone, sort them into one of three buckets. Each bucket has its own sales ladder, channel rules, and copy. Do not mix them.

Related: [[Data Partnership Outreach Strategy]] · [[Advisor List & Question Routing]] · [[Civly - Traction and Funding]] · [[Civly - Messaging Rules and Open Questions]] · [[CRM/index]]

Outreach engine playbooks: `civly-advisor`, `civly-data-partnership`, `civly-customer-warm` (in Civly-outreach-engine repo).

---

## Step 0: Which bucket is this person?

| Bucket | One-line test | What you want | How you reach them |
|--------|---------------|---------------|-------------------|
| **Advisor** | Do we need their expertise and intros? | Answers to spec questions, connector intros | Warm only |
| **Data partner** | Do we need training data from this firm? | Schematic-to-model pairs under NDA | Volume (LinkedIn, email, phone) |
| **Customer** | Would they pay or sign an LOI? | Pilot, LOI, Studio seats | Warm intro only |

**Quick examples**

| Person / type | Bucket |
|---------------|--------|
| Michael, Hesh, Dhanjeet, UK MEP modeller, Reuben, professor via Priscilla | Advisor |
| BIM Manager at MEP consultancy (LinkedIn cold) | Data partner |
| Principal architect at small studio (Michael intro) | Customer |
| Andrew Tang-Smith | Customer, but **hold** until more proof |

> [!note] Two different funnels
> Customer GTM is **warm-intro only** (Michael/Leo's networks). Data partnerships are a **separate volume motion**. The data ask is lower-stakes (early access for data), so cold outreach is appropriate there.

---

## Bucket A: Advisor ladder

**Goal:** Route open questions to the right expert, log answers, turn advisors into connectors.

**Who:** [[Michael Westerlund]], [[Hesh]], [[Dhanjeet Sah]], UK MEP modeller (via Hesh), Reuben Roy, Priscilla/UNSW professor channel.

**Owners:** Hassaan maintains relationships and matches questions. Yash runs technical interviews (especially UNSW/academic channel).

### The ladder

```
1. Warm touch          → one concrete update (demo clip, thing you learned)
2. Specific ask        → one question from the batch of five, not a list
3. Short call          → Yash technical; Hassaan relationship
4. Log the answer      → write back into this vault
5. Connector ask       → "who else should we talk to about [topic]?"
6. Cadence lock        → monthly (Hesh), bi-weekly informal (Michael), etc.
```

### Open questions to route

| # | Question | Route to |
|---|----------|----------|
| 1 | Where do BIM drafters come from? Do architects do MEP drafting? | Dhanjeet / Hesh / UK MEP modeller |
| 2 | Where does design come in vs drafting? | Michael / Dhanjeet / Hesh |
| 3 | Feasibility issues or human intuition in BIM drafting? | Dhanjeet / Hesh / UK MEP modeller |
| 4 | Exactly how do they go from input to output? | Dhanjeet + UK MEP modeller, Hesh |
| 5 | How does that relate to Michael's job and feasibility engine? | Michael |

### Copy (warm touch)

> Hi [Name], quick update from our side. [Concrete update: demo clip, thing you learned, specific blocker].
>
> [Optional one line:] Could I grab 15 minutes this week to sanity-check [one specific topic]?

### Rules

- Peer to peer. Never pitch them on buying Civly.
- **Do not** call Michael a formal advisor in public copy.
- **Hold** Andrew Tang-Smith as customer prospect until credibility is built.

### Stages to track

`Warm → Question sent → Call booked → Call done → Answer logged → Intro made → On cadence`

---

## Bucket B: Data partnership ladder

**Goal:** Sign MEP consultancies into schematic-to-model training pairs under NDA. Same calls answer advisor/spec questions.

**Who:** MEP consultancies Australia (Sydney first), BIM drafting firms, mechanical subs with in-house drafting.

**Roles in order:** BIM Manager → MEP Engineer → Director (small firms) → Drafters (candid, not decision makers).

**Owner:** Hassaan (BD, calls, NDA closing). Yash (technical depth on calls, data ingestion).

### The ladder

```
1. Connect (LinkedIn) or short email     → compliment + one line on Civly. No data ask
2. 15-min "learn from you" call          → listen first; answer spec + advisor questions
3. Show demo / value                     → making their team faster, not replacing people
4. Float the partnership                 → early access in exchange for training data
5. NDA + first data drop                 → training only, never shared
```

### Core insight

Lead with learning, not "send us your models." A cold data ask gets ignored. A warm expert ask gets replies and opens the data door naturally.

### Channels

| Channel | Volume | When |
|---------|--------|------|
| LinkedIn | 15–20 connects/day | First touch at scale |
| Email | 5–10/day | When you have the address |
| Phone | 3–5/day | Warm leads, small firms, half-replies |

**Sequence:** LinkedIn connect → message on accept → call if engaged → partnership ask. Phone for warm or local. **No pitch in the connection note.**

### Copy

**Connection note (<300 chars, no ask)**

> Hi [Name], I'm building Civly, an AI tool that turns an MEP engineer's schematic into a first-draft BIM model. You've spent years in [firm/discipline] and I'd genuinely value learning how drafting really works on the ground. Would love to connect.

**First message after accept**

> Thanks for connecting [Name]. Quick context: my co-founder and I are building Civly, an AI BIM drafter. We take a design or an MEP schematic and produce a first-draft, code-compliant model, so a small team can do the drafting of a much bigger one.
>
> We're not from the industry, so we're talking to experienced people like you to get it right. Could I borrow 15 minutes to hear how your team takes a schematic to a model today, and where the time actually goes? Happy to work around your schedule.

**Cold email subject:** 15 minutes on how MEP drafting really works?

(Same body as first message, signed Hassaan, Civly link.)

**Phone opener**

> "Hi [Name], this is Hassaan from Civly. I'll be quick. We're building AI that turns an MEP schematic into a first-draft BIM model, and rather than guess how the work is done, we're calling people who actually do it. Could I ask you a couple of questions about how your team drafts, and share what we're building? Five minutes, and if it's not useful you can hang up on me."

### On the call (15 min) — SPIN sequence

Use **SPIN** (Neil Rackham): Situation → Problem → Implication → Need-payoff. In major sales, questions beat closing tricks.

| Phase | Time | What to do |
|-------|------|------------|
| **Problem** | 5 min | Where does time go schematic to model? Where does rework creep in? |
| **Implication** | 3 min | How does delay hit program, margin, or senior review load? |
| **Need-payoff** | 2 min | Would a faster first-draft workflow help? What would that free your team to do? |
| **Show value** | 3 min | Demo. Benefits tied to what they said, not feature dump. Say IFC, not "plugs into Revit." |
| **Float partnership** | 2 min | Only after **explicit** need. Early access for training pairs, NDA. |

**Close for an Advance**, not an Order: booked next call, demo with BIM director, or NDA scoping — not "let's stay in touch." Treat vague positives as Continuation (failure) and propose two specific slots.

Full ingested guide: `Civly-outreach-engine/data/context/spin-selling-for-civly.md`

### Data ask framing

> What we're asking for: past projects as input CAD/schematic plus the output model.
>
> What you get: early access while we build, a say in the product, faster drafting workflow.
>
> How we protect you: signed NDA, training only, never shared or resold, start with anonymised projects.

### Objection handling

| They say | You say |
|----------|---------|
| Can't share client CAD | Sign NDA, anonymise, training-only. Same trust as handing models to subs, with paperwork. |
| What's in it for us? | Early access, faster workflow, shape the tool. You're shaping it, not buying it. |
| We're too busy | Even 15 minutes helps. Data ask can be one old project when ready. |
| Won't this replace drafters? | Makes a small team do more, like Cursor for developers. Engineer still signs off. |
| Does it work? | Early and improving. Real projects make it accurate before anyone relies on it. |

### 30-day targets

- 50–100 firms contacted
- 5+ agreeing in principle
- First signed NDAs + data drops by week 4

### Stages to track

`Connected → Replied → Call booked → Call done → Partnership interest → NDA signed → Data received`

Full detail: [[Data Partnership Outreach Strategy]] · [[Data Partnership Moat]]

---

## Bucket C: Customer ladder (warm only)

**Goal:** Warm intros → scoped pilot → LOI or paying Studio customer.

**Who:** Principal architects, small independent studios, structural firms via [[Leo Chan]], Michael's EU network, developers in LOI pipeline.

**Not cold LinkedIn volume.** First customers through Michael (Copenhagen, Malmo, Gothenburg, Berlin, Zurich) and Leo (Hong Kong, Asia Pacific).

### The ladder

```
1. Warm intro              → Michael, Leo, Hesh, Dhanjeet, or LOI network
2. Credibility share         → 3 LOIs, Blackbird Giants, app.civly.dev demo
3. Problem validation call → design intent lost in 2–4 month brief-to-BIM handover?
4. Scoped pilot offer      → one real project, clear success criteria, time-boxed
5. Pilot run               → close support on a real brief
6. LOI or paid conversion  → Studio seats, not free forever
7. Reference + intro       → one peer intro if pilot went well
```

### Copy (after warm intro)

> Hi [Name], [Michael/Leo] suggested we connect. I'm Hassaan, co-founder of Civly. We turn a sketch or CAD file into a first-draft, code-compliant BIM model in minutes, with an engineer approving every decision.
>
> [Michael/Leo] thought your studio might be a fit because [specific reason]. We have 3 LOIs and are running a small number of pilots with firms like yours.
>
> Would a 20-minute call to see if a scoped pilot makes sense?

**Principal architect angle:** frame around design intent surviving coordination, not MEP drafting mechanics.

### Stages to track

`Intro made → First call → Pilot scoped → Pilot active → LOI signed → Paying → Reference given`

### Hold list

- **[[Andrew Tang-Smith]]:** exact ICP. Onboard later once credibility built. Keep warm, no hard sell yet.

---

## Messaging rules (all buckets)

From [[Civly - Messaging Rules and Open Questions]]:

- No em dashes in any copy
- Say **IFC**, not "plugs into Revit"
- Frame as fastest way to a BIM draft, not a coordination tool
- Show control via approval mechanic. Do not say "you stay in control"
- Lead with **3 LOIs + BOM pilot**, never "5 users"
- Do not present Michael as formal advisor publicly
- One clear CTA per message
- Forbidden: "30% workload", "free forever", "biggest VC", "wrapper", fake metrics

---

## One tracking sheet

Columns: `Name | Firm | Bucket | Role | Channel | Date | Stage | Notes | Next action`

Review weekly. Watch funnel ratios per bucket.

| Bucket | Key ratio to watch |
|--------|-------------------|
| Advisor | Questions answered / intros received |
| Data partner | Connect → reply → call → NDA |
| Customer | Intro → call → pilot → LOI |

---

## Playbook mapping (outreach engine)

| User intent | Playbook ID |
|-------------|-------------|
| Advisor bench, route questions, warm follow-ups | `civly-advisor` |
| MEP consultancy data partnerships, volume outreach | `civly-data-partnership` |
| Warm customer / pilot / LOI funnel | `civly-customer-warm` |
| Legacy MEP discovery interviews | `civly-mep-validation` (subset of data partnership top of funnel) |
| Principal architects (research angle) | `civly-principal-architects` (use customer-warm if intro exists) |
| Investors, accelerators | `civly-investor-followup` |
| Reddit/YouTube PMF research | `pmf-research` |
