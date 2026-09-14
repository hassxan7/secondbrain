---
title: "Deliverables — Sep 2026"
type: analysis
tags: [todo, deliverables, deadlines, pfc, civly]
created: 2026-09-08
updated: 2026-09-08
sources: 2
---

The dated board. Everything with a real date, in date order, so nothing is discovered
late. Owner lists: [[To-Do — Hassaan]] · [[To-Do — Yash]]. Build plan: `docs/30_ONE_MONTH_PLAN.md`.

**Today: Tue 8 Sep 2026.**

---

## 🔴 This week

| due | what | owner | state |
|---|---|---|---|
| **Wed 9 Sep** | Hassaan flies back from India (tickets flexible) | H | booked |
| **Thu 11 Sep** | **PFC finals slides due, `.pptx` format** | H (slides) + Y | ⚠️ **3 days** |
| Thu 11 Sep | Pitch script v3 rewritten to the mentor's flow (see below) | H | in progress |
| ongoing | Repo cleanup + latency pass, then deploy | Y | in progress, blocking |
| ongoing | MECH / ELEC / PLUMB / LEARN handoffs run in parallel | Y | ⏸ waiting on cleanup |

> [!warning] The 11 Sep slide deadline is the nearest hard date
> Yash flagged it 1 Sep: *"we have until 11th to submit slides, in pptx format."*
> Hassaan's read was that the 18th was the date. **It is the 11th for slides.**
> Canva Pro is free through UNSW; a `.pptx` export is required.

## 🗓️ The rest of September

| due | what | owner |
|---|---|---|
| **Fri 18 Sep** | **PFC Finals — pitch night, $50k.** Mandatory filming day. | both |
| Fri 19 Sep | Anthropic promotional credit ($155) **expires** | Y |
| Wed 16 Sep 18:00 → Sat 19 Sep | Repo freeze for the demo — fixes only, no prod deploys | Y |
| **Sun 27 Sep** | **C-2 verdict** — "Civly hits the technically-demonstrable bar", judged against a written C-1 paragraph | both |
| **Fri 2 Oct** | Month gate — every goal marked CONFIRMED / REFUTED / UNVERIFIABLE | both |

> [!important] C-1 does not exist yet
> `docs/30` §2: the C-1 paragraph defining "technically demonstrable" **was due 2 Aug and
> exists nowhere on disk** — not in `D:\MissionOS`, not in this vault. Without it, C-2
> cannot be judged on 27 Sep. It is a one-paragraph writing job. Do it this week.

---

## The three month-goals (from `docs/30`)

| id | goal | proof that counts |
|---|---|---|
| **G1** | Control plane running at a real HTTPS address in Sydney, redeploying on every push, with a backup **that has been restored once** | `curl /healthz` returns `main` HEAD within 5 min of a push |
| **G2** | Desktop app signs in, and **every model-changing command is refused in C# unless the human approved that exact payload** — proven in real Revit | a Ring-2 result file for the D3.5 probe |
| **G3** | The 18 Sep demo is recorded from that path, every claim cites a result file | demo script with a result id per claim |

"Nearly" is REFUTED. That is the rule.

---

## 🚧 Blockers, in the order they block

1. **Yash's repo cleanup** — blocks the deploy, and blocks the four MEP lanes running in
   parallel. Was "a couple of hours" on 7 Sep.
2. **The agent loop does not exist in any form.** No shape of the product can accept a
   sentence and act on it. It blocks every deployment shape (`docs/19` §5).
3. **Safety gates are TypeScript-only.** The desktop app bypasses them. Blocking for any
   customer, not just a nice-to-have.
4. **C: drive space** — 0.76 GB free on 2 Sep. Below ~1 GB, `dotnet build` and installs
   fail with errors that read like code failures. Target 10 GB.
5. **Hosting unapproved.** Fly.io in `syd` is proposed (D21) and needs Hassaan's yes,
   a Fly account with a payment method, and `flyctl` installed in a plain PowerShell.
6. **The stale clone `D:\revit\civly-main`** is behind `main` and should be deleted by a
   human — it is how the 27 Aug install stomp became untraceable.

---

## 📋 Open applications and pitches

| what | state | action |
|---|---|---|
| **Startmate Launch Club** | **free now** (was $1,100) — "apply to everything" (4 Sep) | apply |
| **Blackbird pre-seed** | Giants alumni can request an investor meeting any time; they said "whenever you're ready" | **hold** — Hassaan: we haven't decided what the money is for |
| UNSW 10x accelerator | Sasha is the reviewer; met her 5 Aug | apply |
| UNSW Plug and Play | lecturer offered to add a background note | apply |
| Sydney Genesis | flagged 11 Aug | decide |
| Bondi Pitch Club | 26 Aug event | passed |
| S2S Summit pitch (Airtable form) | 1 Sep event | passed |
| Galactic Horizon accelerator | info session 20 Aug | decide |
| NVIDIA Inception | cloud credits | apply — cheap |

The form filler in [apps/form-filler](../apps/form-filler/) exists to make this list
cheap to clear. Feed it a URL, get a drafted application back.

---

## 💰 Pricing — the answer we still owe

$2,000 per seat per month. Asked "why that number" repeatedly and there is no clean
answer yet. The working math (4 Sep):

- Average construction project ≈ $5M; architecture ≈ $400–750k of it
- Drafting labour ≈ **$120k per project** (5 drafters at ~$120k/yr, ~5 projects/yr each)
- A 6-month project → **~$20k/month of drafting labour**
- Civly at $2k/month = **10% of the value it replaces**

Yash's objection stands: *"Yeah we're cheaper than what we're saving, but why 2k?"*
The counter that works in the room: **one seat replaces four to five drafters**, so
compare against a team's cost, not against a $30/month SaaS seat. Sasha warned the number
reads as crazy next to normal per-seat software — lead with the replacement ratio.

---

## 🎤 Pitch changes the mentor asked for (2 Sep call)

The single biggest note: **move validation and traction to the top.** Not a different
flow, a different way of addressing the same headings.

- Open with the problem *and how you know it is real*: **"we spoke to 78 architects"** —
  be specific, never "hundreds"
- *"We set out to build one of the world's best architects' dream product"* — Michael
  Westerlund near the top, not at slide 10
- Frame features by what they mean for people: architects taking joy in their work again,
  safer buildings, better spaces. Do **not** overclaim on housing crisis or the Bankstown
  Metro — too big, and it weakens rather than strengthens
- **Rebuild the timeline slide** — a real 12/18/24-month timeline. It sets up the gaps,
  and the gaps set up the ask
- **Rewrite the ask** to three concrete ways *anyone* in the room can help, not just
  architects. Website QR, not LinkedIn — architects asked for business cards and sighed
  at LinkedIn (20 Aug)
- Letters of intent may deserve their own slide
- Do not script and memorise yet — run different versions, watch which questions come back

---

## ✅ Landed since 1 Jul

- **Kongwei pilot** — 27 Aug meeting; he loved the demo and wants to be a pilot. Revenue
  share discussed; contract to sit under Civly's name (that matters more than the split)
- **PFC finals place** — announced on LinkedIn 20 Aug
- **Inner West pitch night (20 Aug)** — no slides, talked; met the **VP of Archistar.ai**
  and a **Project Director at a major AU architecture firm** who was interested in an
  on-premises shadowing arrangement. Both need follow-up
- **Architect discovery call (30 Aug)** — the deep one. Pilot agreed ("are you happy to
  be the guinea pig?"). Key intelligence: drafting QA is *terrible* across firms, most
  firms outsource drafting overseas, the pre-concept "envelope" stage is a whole job that
  is done manually in Revit, and repeating one apartment layout across a floor plate is
  entirely manual today
- **Revit MCP at 62 tools**, cladding + image processing + clash detection built
- **Ring 2 milestones** — 38/38 ducts, 19/19 fittings, 19/19 terminals; 607 ids deleted
  in one transaction
- **"Updraft"** chosen as the first flagship model name (over "Draftmate")

---

## Related pages

[[To-Do — Hassaan]] · [[To-Do — Yash]] · [[Civly Architecture Reference]] ·
[[Civly Product Trajectory — MCP, Harness, Agentic IDE]] · [[Pitch Copy Library]] ·
[[PFC Pitch — Deck, Scripts & Prompts]] · [[Slide Changes to Be Made]] · [[Form Filler]]
