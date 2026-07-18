---
title: "BIM Mentor Call — Drafting vs Coordination, LOD Scope, Data Moat"
type: source
tags: [whatsapp, expert-interview, mep, drafting, coordination, lod, data-moat, strategy]
source_file: "C:\\Users\\hassa\\Downloads\\WhatsApp Chat - Yash (1).zip::_chat.txt"
participants: ["Hassaan", "Yash", "Hesh (BIM Accelerator — BIM coordinator/expert)"]
call_date: 2026-06-16
created: 2026-06-18
updated: 2026-07-14
sources: 1
---

> [!tip] Civly Relevance — **HIGH**
> The single most direction-shaping conversation in the vault so far. An experienced BIM coordinator / MEP drafter (runs the BIM Accelerator mentorship brand, ex-MEP drafter at Croft Contracting) tells Civly exactly which scope to attack: **BIM drafting, not coordination**, in the **design phase, LOD 0/brief → LOD 100–200**, with **MEP schematics (CAD) as the input**. He confirms duct sizing is fully automatable (no engineer's intuition needed), that the economic value is in replacing drafters (3–4 per firm at ~$100k each) not coordinators, and that the only durable moat is **proprietary training data** harvested via data partnerships with MEP consultancies. He also offers ongoing advisory (monthly call + text) and a UK MEP-modeller contact.

## Notes

### Who is on the call
- **Hassaan** (business co-founder, second-time founder) and **Yash** (AI engineer) pitching Civly to an experienced BIM coordination expert.
- The expert: **Hesh**, the **BIM Accelerator** founder — a BIM coordinator/expert (confirmed by Hassaan). Runs a **BIM mentorship brand + YouTube tutorial channel** ("that's why my brand even exists — for people to get into BIM coordination / BIM management and get out of drafting"). Former **MEP drafter at Croft Contracting** (owner Darren wanted him to explore automating modelling with AI). Now mostly coaches; works with one company part-time. UK-connected; has a client who does MEP modelling at a UK MEP consultancy. He is the voice behind the already-ingested **BIM Accelerator** YouTube sources in the vault.

### Civly's pitch (as presented on the call)
- The problem: an architect's **design intent gets eroded** as structural and MEP engineers each add caveats; everyone runs back and forth. A brief → complete BIM → handover to contractor is **2–4 months per project**, with too many inefficiencies. A national BIM manager claimed **20–30 consultancies** touch a national project (expert later disputes this number — see below).
- The solution: **"a civil engineer in a box"** — an agentic BIM modeller. Architect inputs a CAD model / Rhino sketch / any design intent → Civly converts it to a **first-draft BIM model automatically**; architect then edits via text prompts ("turn this open floor plan into an office floor plan based on my previous project data"); also auto-drafts a **first-pass MEP** layout (iterative — generate multiple drafts, pick one, hand to engineers).
- Compliance baked in (NCC Australia now; geo-scanning local building codes next) so compliance is not an afterthought.
- Working with **Archicad** now. Demo: input a picture → generates a full building (structure only, not MEP). Feasibility engine built specifically for **Michael Westerlund** so he can see design feasibility as he iterates. **2 LOIs from major developers.** Validated across multiple structural engineers.
- Self-described as **"vibe coding for BIM."** Expert agrees: *"if you can solve that problem for the industry, it's one of the biggest problems you're solving."*

### The core reframing — Drafting ≠ Coordination (two separate scopes)
- **Drafting** (modelling) sits **earlier** in the chain than coordination. Civly is a *modelling/drafting* tool, not a coordination tool.
- **Coordination** = a BIM coordinator runs clash tests in Navisworks, assigns clashes to the right discipline, triages major vs minor vs side-coordinated. That is **a separate business idea**.
- Why Navisworks doesn't already "do it all": Navisworks makes *you* build the clash filters, assign each clash to a person, and judge severity. Example: a hydraulics-vs-mechanical clash test → split into drainage (gravity, sloped → assign to mechanical) vs pressurised hot/cold water (→ assign to hydraulics). The **decision-making is still manual** — that's what would need automating, and it would need **hundreds of thousands of labelled clashes** to train. Defer.

### Why drafting is the higher-value bet (economics)
- There are **far more drafters than BIM coordinators**. A firm runs **3–4 drafters** (mechanical alone can be **5–10** at busy firms); usually only **one** BIM coordinator/manager (often a combined role).
- Automating drafting → a firm goes from 3–4 drafters to **1** "vibe coder" → saves **$300–400k/year**. *"Companies will pay for that. I know for a fact."*
- Automating coordination saves less: the coordinator is a **facilitator** you still need a human for (final checks, side coordination, keeping the process running). Lower economic value, harder data problem.
- Verdict: **build the drafting automation first.** Coordination is a later/secondary scope.

### The real AEC workflow chain (corrected by the expert)
1. **Client** → hires **Architect** (designs, *holds the liability* — gets sued if the design is wrong).
2. Architect brings on **Structural Engineer**, then **MEP consultant**. Some design-phase BIM coordination happens here. **Design phase ≈ 1 year.**
3. **General Contractor** comes on board → employs **subcontractors** (mechanical, electrical, hydraulic, fire — *separate companies*, specialist trades).
4. Each subcontractor **takes the consultant model and largely remodels it** to a higher LOD: re-selects units (often cheaper alternatives), re-sizes ducts for correct commissioning/airflow, swaps in their own Revit families, adds construction details. Then they do **construction-phase coordination** (model changes again) → 100% accurate → build.
- Correction to the pitch: it's **not 5 consultancies** — typically **one** MEP consultancy, then the individual subcontractors. The "20–30 consultancies" figure is overstated for a normal project.

### BIM drafters = "architectural technicians" (the liability answer)
- Drafters did an architecture degree but **hold no design liability**; the label "architectural technician" gives them identity without responsibility. *"If someone gets sued, it's the architect's fault — they designed it."*
- **Implication for Civly:** the human in the loop (architect/engineer) **signs off and owns liability**. Civly *helps* draft; it never authors the design and never holds design liability. This directly answers the "can we be blamed if it's wrong?" question — no, as long as a qualified human signs off. Keep a mandatory human approval step.

### LOD progression and where Civly fits
- LOD ladder: **brief/0 → 100 → 200 (consultant deliverable) → 300/350 (subcontractor) → 400 (detailed) → 500 (as-built)**.
- Consultant models are **lower LOD** (~200): ducts not split, units not final, no connection details (consultants omit construction details because changing units later forces a redo).
- **Civly's target window: design phase, brief/LOD 0 → LOD 100–200 (~250).** Generate the first routed draft; hand to engineers/subcontractors who push it to 300+. Going 200→300+ (detailing, unit swaps) is a **future, data-dependent** scope.

### MEP specifics
- **Input = MEP schematics**, usually a **CAD file** (sometimes drawings). Engineers draw line diagrams with airflow + sizes, e.g. *"500×500 duct, 400 L/s into this room,"* splitting and sizing along the run. Civly reads the schematic → routes duct from A→B at the stated size/flow → produces LOD 100–200.
- **Mechanical is the hardest discipline:** duct size **changes along the run** — transitions step the size down as airflow drops (e.g. 200×200 → 100×100 after a 50 L/s branch leaves). Contrast: **fire** = constant-diameter main + branches; **hydraulics** = manageable; **electrical** = easy (move cable trays). Mechanical subcontractors carry the most drafters.

### Duct sizing IS automatable — no engineer's intuition required
- Drafters already use a **"duct sizer" tool**: input airflow + length → it returns the duct height/width (or solve the inverse). It's just **formulas** — many free duct-sizing calculators exist online.
- Mechanical engineers size to target **velocity** and **pressure drop**, which differ by subsystem — **4–5 subsystems each sized differently** (straight runs, kitchen exhaust, car-park ventilation, etc.).
- **Civly mapping:** this is pure calc-function + rule-pack work (Surfaces 3 & 4). No human intuition needed → automatable. *"You can automate it."* (Ties to AS 1668.2 already noted in the architecture reference.)

### Cost / live-costing is NOT valuable (challenges a prior plan)
- Expert flatly: **live cost-per-change doesn't matter.** Construction margins are fat; drafters minimise cost via **principles**, not dollar optimisation: use a **transition instead of two bends** (2 pieces not 3), **avoid bends** (fire), keep runs **straight**, minimise couplings. Those principles do **~80%** of the cost saving (80/20).
- *"They don't care how much it costs in dollars. They care about the principles."*
- ⚠️ This **contradicts** the existing to-do item "Live cost / quantity takeoff feature" (which Michael + Disha's dad pointed at). See contradiction note in the source page and direction analysis. Resolution: a one-off BOQ/quantity takeoff may still be useful as a feasibility output, but **real-time cost-per-edit is low value** — don't over-invest.

### Future expansion scopes (defer; data-dependent)
1. **Auto-detailer / shop-drawing generator:** after modelling, auto-add construction details (flanges, steps, flex connections), **split ducts optimally**, swap/resize units (change intake/outtake sizes, keep the rest), and **auto-dimension** everything (height, length, size). *"Companies will pay for that."*
2. **Consultant-model → subcontractor-model converter:** drag-drop to swap a unit/family, auto-resize connections, vibe-code duct edits in 3D, raise LOD 200→300+.
- Both are **smaller niche scopes** and require lots of data — later.

### THE MOAT = DATA (the whole point)
- To avoid being made redundant by **Autodesk** building this, the only durable edge is **proprietary training data**.
- Strategy the expert endorses: **spreadsheet every MEP consultancy in Australia → pitch a data partnership** — give us your Revit models (input CAD + output BIM pairs) and in return get the product free for a period / a future discount. Get ~**200 firms** → sign **confidentiality/IP agreements** → train the ML model → ship only once accurate. *"There's no way we're putting this out unless it's accurate."*
- Firms' real fear is **IP leakage** (their Revit families/templates reaching competitors), **not** confidentiality per se — they already hand models to subcontractors. Mitigate with NDAs + "training only, never shared" terms; minimise their perceived risk, maximise the payoff. *"It's just payoff and risk."* Most will say yes.
- Need on the order of **100,000+ input/output file pairs** to teach the model to draft BIM.

### GTM + how to validate without hiring an engineer
- **Don't hire an architect/engineer** for a single sample. Instead **talk to many people** until the problem is unmistakable, then build. *"Call 500 MEP consultancies and ask 'would you want this?' — if they say yes, do it."*
- **ICP for the drafting product = MEP consultancies.** Pitch: *"Fire your drafters, keep one person to vibe-code; your engineers do schematics, we generate the model."*
- The expert is one data point but a knowledgeable one — use him as an **ongoing advisor**: open to a **monthly call + ad-hoc text**, and to **introducing a UK-based MEP modeller** (his coaching client) for deeper mechanical-drafting detail. He'd advise for free-ish (his coaching business is his priority).

### Side note — Hassaan's reciprocal offer
- Hassaan offered to build the expert **AI automation systems** (local, OpenClaude/Codex-style job systems on his machine; LinkedIn inbound/outbound; Obsidian second-brain) in exchange. Expert already runs **Claude Code + Fathom** (AI note-taker) for meeting context and is "managing pretty well," but stayed open: *"You never know what you don't know — I'll reach out."*

## Civly Relevance
**Score: HIGH**

This call resets Civly's positioning. It (1) **narrows the wedge** to BIM *drafting* in the design phase (LOD 0→200), explicitly de-scoping coordination; (2) **names the buyer** (MEP consultancies) and the **input format** (MEP schematics in CAD); (3) confirms the **hardest sub-problem (mechanical duct sizing) is automatable** with formulas → direct work for `calcs/` (Surface 4) and `rules/` (Surface 3); (4) settles the **liability question** (human signs off, Civly never authors); and (5) crystallises the **data-partnership moat** as the company's central strategic priority. It also flags that **live-cost tooling is low value**, qualifying an existing roadmap item.

Compared with [[Reuben Roy Call — Competition Bids vs BIM Drafting]], this remains the better fit for Civly's current engineering/IFC build. Reuben identifies a separate competition-bid opportunity for architects rather than disproving the MEP wedge. Full reconciliation: [[Civly Target Dilemma — MEP Drafting vs Competition Bids]].

## Concepts Mentioned
[[BIM Drafting vs Coordination]] · [[Level of Development (LOD)]] · [[Data Partnership Moat]] · [[MEP Coordination Requirements]] · [[Revit MEP Five-Discipline Coordination Model]]

## Entities Mentioned
[[Hesh]] (BIM Accelerator) · [[Michael Westerlund]] · [[Navisworks]] · Croft Contracting · h2x Engineering · Autodesk (ACC)

## What Changed in the Wiki
- Created source page [[BIM Mentor Call — Drafting vs Coordination & Data Moat]] (this file's summary).
- Created MEP knowledge page [[MEP Drafting — Schematic to LOD 200]].
- Created concept pages [[BIM Drafting vs Coordination]], [[Level of Development (LOD)]], [[Data Partnership Moat]].
- Created CRM page [[Hesh]] (Industry Expert / advisor, HIGH).
- Created analysis [[Civly Direction — Drafting-First Pivot (Jun 2026)]] and [[Advisor List & Question Routing]].
- Split the master to-do into [[To-Do — Hassaan]] and [[To-Do — Yash]]; updated [[Civly To-Do — Jun 2 to Jun 16]] and [[Civly Architecture Reference]].

## Notable Quotes
- "If you can solve that problem for the industry, it's one of the biggest problems you're solving." — BIM mentor
- "There's less BIM coordinators than there are drafters. If you can get a company from 3–4 drafters down to one, you can save $300–400,000." — BIM mentor
- "If someone gets sued, it's not the BIM modeller's fault, it's the architect's — they designed it." — BIM mentor
- "You can automate it. There's a tool called duct sizer — put in the flow and length, it calculates the size." — BIM mentor
- "That's gonna be the biggest roadblock you have to overcome… it's just payoff and risk. Minimise the risk, show the payoff, and a lot of people will say yes." — BIM mentor (on getting training data)
- "You don't need to hire someone who's only giving you one sample. Call 500 MEP consultancies and ask 'would you want this?'" — BIM mentor

---

## Verbatim Transcript

> Source: `C:\Users\hassa\Downloads\WhatsApp Chat - Yash (1).zip::_chat.txt`. Lightly punctuated voice-to-text; preserved as the source of record.

…of and where we are right now. And I guess where you could assist us and maybe we could help you in whatsoever way we possibly can. I'm not sure how. But we'd also let you know our progress. So currently, the main problem that we're trying to solve within BIM is that the coordination problem is pretty annoying. An architect creates a design and the design intent often gets ruined within the process. The structural engineer says you might have to shift some things around, this might not work; the MEP guy also has his own caveats. So there are all these people running back and forth, and on average we think a brief to complete BIM and handing it to the contractor is a 2-to-4-month process for a single project. That's too long and there are too many inefficiencies. I talked to a national BIM manager and he said there are 22–30 consultancies involved in a national project. We think that's ridiculous — why should so many people be involved? So we set out to make Civly — what we call a "civil engineer in a box." A way for anybody, mostly architects (and also engineers), to design a BIM — a persicline / agentic BIM modeller. We've fed it compliance rules — right now NCC for Australia — and we're trying to do building codes locally by geo-scanning whatever site they're working on. We make every design compliant with the laws intentionally, so they don't have to do compliance as an afterthought.

So right now the progress is: we're working with Archicad, we have our agentic chat, and after an architect inputs his CAD model, or even a Rhino sketch, or basically any design intent, it tries to convert it to a first draft of a BIM model automatically by reading all the inputs. (A Revit file, exactly.) From there an architect can put in a text prompt like "make this open floor plan into an office floor plan based on my previous project data," because architects have lots of projects and want to reuse things. Or it tries to automate MEP in a first-draft runaway. MEP is complicated and there are engineering calculations behind it, but it's an iterative way to do it — you can get multiple drafts, go ahead with whichever one you like, then give it to the engineers to work on from there.

Where are you based, by the way? Melbourne, Australia. Okay. I'm not sure if you know 3XN — it's an architectural firm, they designed the city fish market — and we're working with one of the senior architects, Michael Westerlund. We've onboarded him as a design partner to navigate the challenges an architect faces for BIM modelling, and we've validated across multiple structural engineers to see that our system works. We also have a beta demo and a feasibility engine — specifically for Michael, that feasibility agent, because what he wanted was, as he's editing and iterating along the way, he wants to know how feasible the design is. So we made that possible. We also have 2 LOIs from major developers. That's the progress right now.

Okay. So you're doing a generative model based on inputs of Rhino or CAD or Revit, for architecture as well as MEP systems, trying to get it to spit out a Revit model and optimising for that to be faster and faster — your intention is to remove how long it takes to model something. Someone comes up with a CAD or a sketch and all of a sudden it's modelled as close to instantly as possible. Yes, that's our main idea.

What we're looking into right now is the feasibility-engine part. For an office, say you want to decide open-plan or not. What I've created is: you upload your IFC file, it opens up, and it shows you the feasibility of the change you'd possibly make. Right now we're concerned the problem we're solving might be very specific to just one architect, not a general solution. That's where we were looking for help — to understand whether this is a general problem, what concerns you'd have, and whether it can integrate into a BIM coordinator's current workflow.

So you can get someone with a CAD file or an Archicad thing, put that into your thing, and it comes out as a Revit model quickly, right? Yeah, and from there you can edit it however you want with text prompts or with the modeller. Say you want to change one door and apply the change to all the doors — you put in a text prompt and it does it automatically. Removing redundancies in design. It's like vibe coding, but… Exactly. I mean, if you can solve that problem for the industry, it's one of the biggest problems you're solving.

When I was working as a drafter for an MEP company — Croft Contracting — the owner Darren wanted me to look into ways to do all this modelling with AI, because the coordination stuff is going to happen regardless. From a coordination perspective, I get models, I coordinate, I create issues, and they get solved. From a drafting perspective, that is the tedious, monotonous thing. That's why my brand even exists — for people to get into BIM coordination / BIM management, get out of drafting, because drafting is monotonous, tedious, takes a long time. If you solved that problem with a really good solution, that's one of the biggest things — because companies would find it cheaper: instead of hiring 4 drafters, they get this generative AI model, get someone to vibe-code the whole thing, and bring it down to one person.

When you say coordination, do you mean between disciplines — structural vs architect — or MEP coordination? MEP coordination within the ceiling space, seeing if it clashes with beams/slabs between disciplines. Oh, that's a separate scope. If you can create an AI model that handles a BIM coordinator's decision of who to assign clashes to — that can be its own business idea. But what you're doing is from a modelling perspective, which is earlier in the chain. Yes, the initial design stage — an architect talking to a client, figuring out what design to use, then drafting.

One thing I'd like to understand: what software do you use? We've seen Navisworks for coordination, and ACC. Have you heard of h2x? No. h2x does pump sizing — also to do with coordination. We want to capture both sides. Initially we're going for the BIM drafting side — initial drafts to iterations — because that's an easier problem. Later we want to tackle coordination too, because there are softwares doing specific automations for parts of the industry, and we'd want to integrate from draft to coordinated BIM.

Why doesn't Navisworks just do 100% already? Because in Navisworks you run clash tests where you create the filters yourself and assign each to a specific person — you make the decisions. If I do a clash test between hydraulics and mechanical, I split it: hydraulics drainage vs mechanical; hydraulics gravity vs hot-and-cold water — pressurised systems vs mechanical. Pressurised systems mostly assigned to hydraulics; gravity-based mostly to mechanical because they have slopes. I still have to set those two things up, look at the clashes, assign to the correct person, identify what's a major clash, a minor clash, what isn't worth flagging because it can be side-coordinated. Those are the things that need automating. But you'd need probably hundreds of thousands of clashes fed in so the model can understand and train. We'd require a lot of data. So we're trying to create data partnerships with firms to get a ton of data, because there's no way we put this out unless it's accurate.

One of our pilot firms asked if we can create a live cost feasibility engine. You know bill of materials and quantity takeoff — can that be done on the fly in BIM software already? Yes, you can do it with ACC; it already has a feature to do quantity takeoffs. So if there could be live costing where every person working on it sees in real time how much the cost is, or when they make a small change how much it increased — does that matter? I don't think that matters too much. In construction the margins are fat. Whether you run a duct this way or a more optimal way with less duct that reduces cost — that's not considered much. The principle is: do anything as long as it solves the problem and we don't have to lower ceilings or move things around. Everything is like Tetris in the ceiling space — if it works, it works. Good drafters know how to minimise cost: use a transition instead of two bends (2 pieces instead of 3); fire guys avoid bends; keep pipe straight, fewer couplings. That 80/20 does 80% of the work. So live costing won't have as much impact as the other two things you mentioned — vibe-coding drafting and vibe-coding coordination.

In coordination using Navisworks, how much is redundant work? If you could make a tool where coordination redundancies are cut by ~50%, that helps everyone. But the bigger problem is the first one — vibe-coding drafting. There are fewer BIM coordinators than drafters. If you get a company from 3–4 drafters down to one, you save $300–400k. Companies usually have one BIM coordinator/manager, sometimes combined. Even if you automate my job, you still need me to check everything, do some side coordination, make sure it's running. So you can optimise coordination, but you still need a manager. Solving coordination is lower economic value than automating drafting. Companies will pay for that — I know for a fact.

What would you love to exist for BIM drafting itself? If you take an MEP consultant model into the construction phase — say a mechanical subcontractor takes the MEP consultant model — it's lower LOD: ducts haven't been split, units aren't correct, no proper connection details. An AC unit has a flex connection, a step, a transition, a duct piece; same on the other side. Consultants don't add these. Because the families differ and the level of detailing differs, mechanical subcontractors in particular redo the model. Electrical is easy (move cable trays); fire isn't too hard; hydraulics isn't the end of the world; mechanical is the biggest — they redo their modelling and have the most drafters. Going from one LOD to another: construction detailing, splitting ducts optimally, then changing units correctly so the correct units get placed. You have a skeleton MEP layout; I want to instantly change what the units are. If I drag-drop this Revit family, it replaces the unit and changes the intake/outtake sizes, the rest stays the same, then adds construction details — flange, step, flex, connects to the thing, splits and cuts all the duct. Then it ordered-dimensions everything: height, length, size. Every piece ordered-dimensioned. So there are several scopes: just creating shop drawings; or a plugin that details the whole thing after modelling. Companies will pay for that. Another: consultant model → subcontracting model, changing ducts, adding construction details all in 3D, vibe-coded. Those are smaller scopes.

Why involve consultancies at all — can the initial plan be done directly? You need a consultant and a subcontractor. There aren't 5 consultancies — for every project I've done it's one MEP consultancy, then each individual subcontractor. The consultant does the MEP model; subcontractors take it and make it better (higher LOD). Consultants don't go on site, don't have plumbers/electricians. Subcontractors do their own in-house engineering, make sure commissioning works (airflow), do their own duct sizing, re-select units (sometimes cheaper), change units, add construction details (consultants never add them because changing units forces a redo). That happens at a lower LOD then gets passed on and increased. I've only ever dealt with one consultant, then the subcontractors.

How much error tolerance is there in BIM drafting? If you manufacture some duct/pipe and can install it, no problem. But if it clashes you have to remake it — that's the problem. The margin of error matters at BIM coordination/management, because you can't remake it. In the design/consultant phase, if you clash or have wrong duct sizes it's not a big deal — the subcontractor will take the model and make it better. Subcontractors can't mess up: wrong dimensions → airflow wrong → too loud or not enough pressure/velocity. So subcontractors have less margin to mess up than designers. It depends where you are in the chain.

The process: client → architect (architects do the design and get sued if it's wrong) → the BIM drafters. Architects are the ones who design and hold liability. BIM drafters don't get sued — they're called "architectural technicians," a nice name; they did an architecture degree but don't have design liability, so the label gives them identity. They're drafting an architectural design without the design responsibility. If someone gets sued it's the architect's fault, not the BIM modeller's. One of our main questions: if you use ours and things mess up, can we put the blame on you? No — there always has to be a human in the loop. You sign off on it. We just help you do the design; we don't do the design.

So: architect/architectural technician → everyone uploads onto ACC → clash detection → the BIM coordinator manages it. You have the client, the architect, the structural engineer, the MEP consultant on board; BIM coordination happens — that's the design phase, ~1 year — then the general contractor comes on, employs subcontractors who take each model, split them, all individual companies (mechanical, electrical, hydraulic subcontractors; two can be in one company because they're specialist trades), do coordination between their things, make it 100% accurate, and build. Mechanical guys remodel everything from scratch — same overall layout, but their own families, their own duct sizing for commissioning.

We want to work on one part of the process — not end to end, that's too big. The latest stage where you'd refine LOD — a subcontractor goes 200 to 300/350, then 350 to 400, and 500 is as-built (can be manual for small changes). What we want: project brief / LOD 0 to LOD ~200, then hand off. In future, with enough data, the model could learn the detailed changes and we could go further. For now, solve the design phase: approach MEP companies and say "how would you like to fire all your drafters and just get one guy to vibe-code? Your engineers do the schematics, we feed them into our AI model, it produces the model — you don't need drafters." They'll fire the drafters and use it.

What input would we take? MEP engineers make schematics — like architects' spatial diagrams. Engineers do schematics: "this room, this airflow, 400 litres per second," a line, sized accordingly — 500×500, 400 L/s into this room. They lay out the whole model. If you can read that — duct from this location to that location, 400×400, 500 L/s, splits — and generate it, you go from 0 to LOD 100/200 straight away. The schematics are usually a CAD file (could be drawings, usually CAD).

Our demo: input a picture, it makes a building on its own (a Revit file) — but only structure, not MEP. For LOD 100 MEP I'm trying to teach Claude to do that; we have an ML model with the compliance stuff and we're trying to increase its scope so Claude can make changes into Revit via an MCP server. The MEP part has been tough. I've been using your YouTube tutorials to build an information base of what's possible. How would you teach AI to do MEP — the only thing left to go from 0 to 100? Get a spreadsheet. List every MEP consultancy in Australia, go to them and say "can you give us access to your models to train our model? In return you get it free for a time / a discount." Get ~200 companies, get all their Revit models, sign an agreement that you won't share with anyone else — just to develop your thing — train your model, put it into Claude. That's what I'd do.

Would they share, given confidentiality? Architects and MEP consultants already give their models to subcontractors, design phase to construction phase. Some are weird about it and send an agreement saying you can't use it for anything else; you sign it and don't. That's the biggest roadblock to overcome, but it's just payoff and risk — tell them the payoff, minimise the risk (measures, agreement), and most will say yes. What are they scared of? Intellectual property — if an MEP company's template/families/templates get sent to another company. So we say: NDA, we won't share, we only use it to train so you can design 10× faster, and a year down the line you can fire your drafters and save X. They'll pay up because AI is big and no one else in the industry is doing it.

Is mechanical the hardest part of MEP? Yes — both drafting and specialist. Going 0 to LOD 100, duct sizes have to change: 100 L/s out, then 50 L/s out, reduce the duct (200×200 → 100×100). A fire main is the same diameter throughout with branches; air is different. Mechanical is more complex because transitions change duct dimension and it's bigger. Can we automate those calculations? Yes — it doesn't need an engineer's intuition. Drafters use a tool called "duct sizer": put in the flow and length, it calculates the height (or the inverse), tells you the size. Search "duct sizer tool" on Google — many exist. How do you design a duct? Target velocity and pressure drop inside the duct — for straight runs one way, kitchen exhaust another, car-park ventilation another — 4–5 subsystems sized differently. It's just a formula; many calculators out there.

We're both foreign to the industry — Yash is an AI engineer, I'm a journalist. Can we figure it out without an engineer's intuition, or do we need to hire an architect? You don't need to hire an architect — speak to so many people that the problem becomes clear, then solve it. Call 500 MEP consultancies and tell them what you're doing — "would you want this?" If enough say yes, go. Don't hire someone who gives you one sample. Even me — I'm one guy, but I have experience, a general understanding of the industry. Go to MEP consultancies; if they say no, find a different thing; if yes, do it.

Talking to you gave us a lot of clarity — exactly which problem to address. We'll focus on LOD 0 to 100–150, design phase, MEP consultancies. Want to see what we've built? Send me a demo or short video after — I don't have much time, but I'll look. If you want my advice on an ongoing basis, you can always ask — once a month a call like this, or text me questions; a million things I could tell you, rapid-fire. Where are you based / working? It's based in Sydney. I'm part of an accelerator, and we've applied for funding to market and buy data — though maybe we don't need to buy data anymore. My background: I started and sold a company for $1.6M; Yash is a great engineer; we're solving a problem we find intellectually stimulating with a lot of future scope.

What's the bottleneck right now? After speaking to you, we have a good direction. Along the way it's hard to know exactly what an architect needs. I'd need some example files to try building something, so when we talk to engineering firms we can show a rough idea: "if you give us these files, we can create something like this." Just to build the software you need a certain level of BIM know-how, and it's a lot of guesswork — it'd help if I could text you, or every couple of months have a call, to steer us and not wander off. Is that something you'd want? Coaching is so profitable for me that I don't like to veer off, but if you want my guidance — once a month a call, or text me — I'm open to it.

Do you have anyone deep in mechanical / MEP drafting? Yes — I work with people in my program; just got off a call with a client at an MEP consultancy who does MEP modelling; he's from the UK. Could you connect us and put in a good word? Yeah, I can send you his information. That's great — put in a good word and we'll take it from there.

A side offer: from your community, free of charge — are there redundancies you wish you didn't have to do? I make AI systems for founders and high-agency people so they can be hands-off and focus on one thing. Local on your computer (Codex / OpenClaude / Postinger running OpenClaw locally), Obsidian for the knowledge graph / second brain, LinkedIn inbound + outbound automation that drafts summaries you approve. I already have Claude Code connected to my AI note-taker (Fathom), so when I ask questions it has all the context of everyone I've spoken to. Managing pretty well — but you never know what you don't know, so I'll reach out if there's something. Sure — if there are redundancies you wish you didn't have, let me know and I can help.

That was everything. We'll text you, and it'd be nice to get the mechanical MEP consultancy contact. Very fruitful conversation — we'll keep you updated with any big news. Good — we'll chat soon. Thank you so much. All good, guys. Good luck. See you.

---

## Post-call founder notes (Hassaan + Yash, 18 Jun 2026)

**Our refined understanding:** Civly is becoming the **AI BIM drafter** — taking design intent from an architect to **LOD ~250** by eliminating the structural and MEP *drafting* labour, getting the model ready for handoff to general contractors who change it from there. We need to **ingest a lot of CAD + BIM file pairs** (input CAD and the respective output BIM) so our ML model learns how to make BIM in the first place — making it such that a firm needs **1 BIM drafter instead of 5**.

**Questions to route to the right person (Yash's list):**
1. Where do BIM drafters come from — are they architects, and do they do the MEP drafting?
2. Where does the design part come in?
3. Are there feasibility issues / any human intuition in BIM drafting?
4. How do they BIM-draft — how do they go from input to output?
5. How does that relate to Michael's job and his feasibility engine?

**Technical avenues:**
- Know exactly how BIM drafting is done; if there's no intuition / human intervention needed, we can automate it.
- If intuition is needed, get ~100,000 input/output file pairs and train an ML model to make BIM.

**Three orders of business** (expanded into [[To-Do — Hassaan]], [[To-Do — Yash]], and [[Advisor List & Question Routing]]):
1. Ingest & internalise this call; route Yash's questions to advisors.
2. Hassaan builds an **advisor list** (Michael, Dhanjeet Sah, Andrew later, Priscilla → professor) + a question-routing process; message Michael again with results and ask for a meeting.
3. **Data partnerships = the moat** — sell ourselves to BIM drafters / technicians / architectural draftspersons to collect data we own, to train the ML model, so we're not made redundant by Autodesk.
