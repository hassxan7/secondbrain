---
title: "Pitch Copy Library"
type: analysis
tags: [pitch, applications, copy, gtm, fundraising, reusable]
created: 2026-06-25
updated: 2026-06-25
sources: 1
---

Reusable, rule-compliant answers for accelerator / grant / investor applications. Pull from here, then tailor per funder (see [[#Per-funder tailoring]]). First populated from the **Z Fellows 2026** application (25 Jun 2026). Respects [[Civly - Messaging Rules and Open Questions|the messaging rules]].

> [!note] Privacy
> Phone number and the personal "what drives you" family details were **redacted from the repo** (kept locally / on file) before pushing to GitHub (`secondbrain.git`). Personal + Civly emails and the public LinkedIn URL are retained. Keep any new PII out of this file, or redact before the next push.

## Messaging guardrails (apply to every answer)
- **No em dashes** in any copy.
- Say **IFC**, not "plugs into Revit." (Mention Revit only as "we work with Revit and ArchiCAD through IFC.")
- Lead with **traction**: 3 LOIs, 1 paid pilot, 10 signups, Blackbird Giants. Never the old "5 users" (that was a bluff).
- **Michael = "informal guidance from a senior architect"**, never a formal advisor/partner publicly.
- **Exit figure:** use **$1.2M USD** for US funders (Z Fellows, YC), **AUD 1.6M** locally. ⚠️ See [[#Open inconsistencies to reconcile]] — clarify revenue vs exit value.
- Frame Civly as "the fastest way to a BIM draft / design intent to a buildable model," not a coordination tool.

## Reusable application fields
| Field | Value |
|---|---|
| Founder | Hassaan Shamshiri (co-founder); Yash (co-founder, AI engineer) |
| Company | Civly |
| Personal email | hassaanshamshiri536@gmail.com |
| Civly email | civlyvibe@gmail.com |
| Phone | [redacted from repo — on file locally] |
| Location | Sydney, Australia |
| School | University of Sydney (B.Com, Finance & Management) |
| Technical? | Yes |
| LinkedIn | https://www.linkedin.com/in/hassaanshamshiri/ |
| Civly repo (brain) | https://github.com/hassxan7/secondbrain.git |

---

## Answer bank (by question type)
All char counts verified. Lengths noted so you can match a form's limit.

### What are you building? (non-jargon, ~50 words)
> An architect gives us a sketch or rough design, and we turn it into the detailed, buildable plans that normally take a team of engineers months to draw by hand. Automatically, in minutes, already checked against local building codes. The engineer approves every decision, so nothing happens without them.

### Project + why (Z Fellows, 466 chars)
> We're building Civly. You give it a sketch, a CAD file, or a model, and it returns a detailed, code-compliant building model in minutes, the work that normally takes a team of engineers months. I grew up around my dad's construction company, watching architects and engineers fight while designs got gutted and projects broke. Yash is an AI engineer. We think the knowledge of how buildings get made should become a model anyone can use, and we're going to build it.

### Problem (478 chars)
> Turning a building design into a coordinated, code-compliant model that can actually be built takes a team of engineers two to four months of manual work, passing files back and forth. By the end, the original design is often gutted, and projects still break at construction. The software costs around $5,000 per seat, yet 80% of firms have fewer than ten people and can't afford it. And AI can't be trusted to do it, because it reads building codes loosely and gets them wrong.

### Expertise / why us (475 chars)
> Yash is an AI engineer who has built AI tools for construction. I'm a second-time founder; I started my first company at 15 and exited my last for $1.2M. In a few months we've built a working product that turns a CAD file into a structural model, signed 3 letters of intent from developers, got into Blackbird Giants, interviewed with Startmate, and earned informal guidance from a senior architect behind the New Sydney Fish Market. We move fast and learn industries faster.

### Competitors + insight they don't have (496 chars)
> The closest are Snaptrude, Archilabs, Finch, and Autodesk Forma. Almost all stop at architecture or massing and never generate the engineering, or they assume it's already done, and most expect firms to switch tools. What we understand that they don't: the real bottleneck isn't design, it's the manual drafting between design and construction. Automating that needs proprietary project data to train on and an architecture that keeps AI away from the building codes. That's the moat, not the UI.

### What have you worked on in the past? (426 chars)
> Hassaan started his first startup at 15, then built and sold an agricultural trading business for $1.2M, using the proceeds to fund his own move to Australia to chase a bigger problem. He's also a classical pianist. Yash is an AI engineer who built an AI tool for the construction industry at Anthrobyte, and studies computer science at UNSW. We've both been shipping things, technical and commercial, since we were teenagers.

### Nerdiest thing about you? (Hassaan's submitted version, ~250 cap)
> almost every system in my life is supported with an app I built myself, I have an AI app to automate and optimise everything; buying groceries, finding clients through outbound, building a second brain for my life's entire context.

### What drives you? (~250 cap)
> [Personal/family-motivation answer redacted from the repo for privacy — keep the private submitted version for applications.]
>
> Generic-safe alternative if needed publicly: "A responsibility to provide for my family, and to prove that where you start doesn't decide where you end up."

### Non-traditional things growing up? (submitted version)
> I have hacked almost every game I've played since childhood, from Minecraft x-ray mods to Roblox glitches. I always tried to find loopholes in systems and made YouTube tutorials on them, which got me banned from YouTube.

### Risk / challenge + character (479 chars)
> To find market gaps, we go undercover. We book demos with competitors posing as customers, in my last company and again for Civly, to learn exactly what they do, where they stop, and what they charge. We pair it with grilling insiders, like a BIM coordinator who showed us how the work really happens. It is uncomfortable but it is the fastest path to truth, and how we found the gap: rivals stop at the design, so we own the engineering after it. We do whatever it takes to win.

### How are you using AI / your architecture? (98 words)
> Our system has two layers. A machine-learning layer reads design intent, a CAD file, sketch, or Revit model exported to IFC, and proposes structural and MEP elements, learning from real project data how engineers make decisions. Critically, no numbers or building codes pass through the language model. Those run through a separate deterministic engine with the rules written as data, so every output traces back to a code citation. We work with Revit and ArchiCAD through IFC, the open standard they both export, so firms keep their workflow. What we learned: trust AI to read, never to calculate.

### Meaningful progress (100 words)
> We have 3 signed letters of intent from developers and firms, we're in Blackbird Giants, and we interviewed with Startmate. Our working demo turns a sketch or CAD file into a structural building model in minutes, and a pilot firm tested our automatic cost-and-quantity output against a real project. We've interviewed structural engineers, a quantity surveyor, and a BIM coordinator, plus take informal guidance from a senior architect behind the New Sydney Fish Market. The biggest lesson: the real bottleneck is the manual drafting between design and construction, so we've focused there and on building the data to train it.

---

## Current traction snapshot (as submitted, 25 Jun 2026)
- **3 LOIs** (developers/firms) + **1 paid pilot** + **10 signups**.
- **Blackbird Giants** Cohort 11; **Arrayah Builder-in-Residence**; **Startmate** interviewed (outcome pending).
- Working demo: design intent (CAD/sketch/picture) → structural BIM model. Feasibility tool at `app.civly.dev`. MEP in development.
- _(Supersedes the old "5 users" bluff — now 10 signups + 1 paid pilot is the real number.)_

## Per-funder tailoring
- **Z Fellows (US, founder-bet):** lead with founders, velocity, ambition. No passion-project softening. USD. Concise, no fluff. ✅ done 25 Jun.
- **Protostars (Blackbird):** frame as a **passion project, not a business expense**; they like **"intersections"** (AI × the built world). Soften commercial tone. AUD.
- **Startmate / VCs:** lead with the **3 LOIs + paid pilot**; frame the ask as "going after VCs," not "applying to Startmate." Don't conflate Blackbird (program we're in) with Startmate (a target).
- **Local AU grants:** AUD 1.6M, Sydney-based, USyd student.

## Submission log
### Z Fellows 2026 — submitted 25 Jun 2026 (under hassaanshamshiri536@gmail.com)
- All answers above used as the Z Fellows versions. "Somewhat joint" application; submitted under Hassaan.
- **Co-founder pick (un-recruitable hire):** Abhinav Bhardwaj — https://www.linkedin.com/in/abhinavbhardwaj-/
- **Heard about Z Fellows via:** Blackbird VC.
- **Achievements field:** see [[Hassaan Shamshiri]] (full list pasted there).
- **Open / not yet done:**
  - [ ] **1-min founder video** (optional but recommended) — intro + a brag + what you're building; **no demo**; include all founders; YouTube link.
  - [ ] **"1 thing you need help with"** (optional, left blank) — suggested: "Warm intros to AEC operators or MEP-consultancy leaders in Australia, and a senior architect willing to be a design partner."

## Open inconsistencies to reconcile
1. **Exit figure: revenue vs exit value.** Application copy says "exited my last for $1.2M ($1.6M AUD)." The achievements field says "scaled FarmVillage to **AUD 1.6M revenue**... exited." These are different claims (1.6M revenue vs 1.6M exit). Pick one consistent story before a sharp reader catches it. (Likely: scaled to ~1.6M AUD revenue, exited for an undisclosed/other amount — confirm.)
2. **Pricing** still inconsistent across materials (299/199 per month vs 2,000/seat/year). See [[Civly - Traction and Funding]].
3. **Buyer/messaging** — drafting-first pivot ([[Civly Direction — Drafting-First Pivot (Jun 2026)]]) vs older "copilot for architects/engineers" copy. Most application copy here uses the safe "design intent → buildable model" framing, which works for both.

## Related pages
[[Hassaan Shamshiri]] · [[Yash]] · [[Civly - Messaging Rules and Open Questions]] · [[Civly - Traction and Funding]] · [[LinkedIn & Content Strategy]] · [[Civly Direction — Drafting-First Pivot (Jun 2026)]]
