---
title: "Civly Target Dilemma — MEP Drafting vs Competition Bids"
type: analysis
tags: [strategy, product, target-market, mep, architecture, competition-bids, dilemma]
created: 2026-07-14
updated: 2026-07-15
sources: 2
---

> [!important] Framing correction (15 Jul 2026) — read this first
> The earlier draft of this doc read as if Civly = MEP drafter. It isn't. Civly is the **multi-discipline BIM drafter**: sketch / CAD / project brief → coordinated **LOD ~250 BIM across architecture, structural, MEP, electrical, plumbing**. Architecture + structural already ship through Tapir MCP + Archicad; **mechanical MEP is the current vertical slice** to complete the multi-discipline product, not the whole company. Full context: [[Civly Architecture Reference]] and [[Civly - Product and Tech]].

Hesh and Reuben each recommend a different early wedge that sits inside Civly's broader "sketch → LOD 250" mission but doesn't share an MVP with the other. Hesh's advice is one important expert view for the **MEP slice** and the MEP-consultancy sales motion. Reuben's advice describes a **different product entirely** — competition-bid generation for boutique architecture practices — with a different user, project phase, output, and demo. The near-term move is to finish and validate the current mechanical MEP slice inside the broader drafting product, while treating competition-bid production as a separate discovery track.

## Question / Prompt
What exactly should Civly target now, given Hesh's MEP-drafting recommendation, Reuben's competition-bid recommendation, and Civly's current build?

## Methodology
- Compared the full 16 June Hesh transcript with the full 25 June Reuben transcript.
- Separated each recommendation by project phase, user, input, output, value metric, technical requirements, and sales motion.
- Mapped both against [[Civly Architecture Reference]], the four implementation surfaces, [[Technical Roadmap — What to Build First]], and the 14 July build status in [[To-Do — Yash]].
- Treated expert estimates as hypotheses, not established market facts.

## Findings

### What both calls actually agree on
- **Do not target “AEC” or “BIM” broadly.** Choose one narrow job and one buyer.
- **Do not replace Revit wholesale.** Preserve interoperability or work at a phase where Revit is not yet required.
- **The earliest useful output need not be construction-ready.** Both wedges tolerate rougher early-stage output that a human later refines.
- **Human judgement remains.** Hesh keeps engineering sign-off; Reuben keeps the principal architect's creative control.
- **Labour reduction alone is awkward messaging.** Hesh frames hard savings for MEP firms; Reuben warns architecture firms may resist tools that reduce billable hours or disrupt graduate training. Sell throughput/outcomes for architects.
- **Current validation is too thin.** Each thesis is largely one expert's view and needs direct buyer interviews plus real input/output examples.

### Where the recommendations differ

#### Bet A — Finish the multi-discipline drafter (mechanical MEP is the next slice)
- **Where this sits:** natural continuation of the shipped product. Architecture + structural already generate through the Archicad MCP; adding mechanical MEP is the next discipline layer toward the full multi-discipline LOD ~250 output. Electrical and plumbing follow.
- **Product frame:** *"the fastest way from sketch/brief to a coordinated LOD 250 BIM"* — unchanged from the Civly context docs.
- **Buyer for the broader product:** anyone in the LOD 0 → 250 drafting process (architectural draftspersons, BIM drafters/technicians, mixed practices, MEP consultancies). **For the current MEP slice specifically:** mechanical/MEP consultancies (Hesh's ICP) are the sharpest early buyer.
- **User for the current slice:** MEP engineer + BIM/MEP drafter, and any BIM drafter working through the multi-discipline flow.
- **Project phase for the current slice:** after architectural intent is substantially set; consultant / design-development phase.
- **Input for the current slice:** MEP schematic, usually CAD/DXF, containing routes, airflow, sizes, and room relationships. (Broader product still accepts sketch / CAD / Rhino / IFC as it does today for arch + structural.)
- **Output for the current slice:** routed and sized mechanical model around LOD 100–200, contained in the coordinated model, exported as IFC and reviewed by an engineer.
- **Value:** completes the multi-discipline promise for real projects and removes drafting labour on the discipline with the most drafters per firm.
- **Current evidence:** Hesh strongly supports the MEP slice specifically; Reuben says Civly's existing demo already looks like an engineering-consultant product.
- **Current build fit:** high. Civly already has Tapir MCP + Archicad generation, deterministic calcs/rules, `mep.py`/`ifc_writer`, IFC spaces, a viewer, and an active Archicad MEP MCP effort.

#### Bet B — competition-bid production
- **Buyer/user:** principal architect or competition lead at a boutique/mid-sized architecture practice.
- **Project phase:** before development approval, consultants, detailed BIM, and coordination.
- **Input:** competition brief, hand sketch, scaled CAD plan, and firm style/context.
- **Output:** concept floor plans, distinctive 3D design, renders, narrative, and submission-ready PDF panels.
- **Value:** reduce unbillable speculative labour, submit more bids, and win more projects.
- **Current evidence:** Reuben strongly supports it; Hesh did not discuss or validate this workflow.
- **Current build fit:** low-to-medium. Civly has geometry generation and a React viewer, but not a competition-brief parser, creative option generator, rendering pipeline, layout/panel composer, or style-differentiation system.

### The dilemmas in the context of Civly's current build

1. **Engineering automation vs creative authorship**
   - Civly's architecture says it does not make design decisions and keeps deterministic calculations separate from the LLM.
   - MEP drafting fits: the engineer supplies intent and signs off.
   - Competition production requires Civly to generate architectural options, plans, and presentation choices. That is design authorship, not merely evaluation or drafting.
   - Pursuing competition bids therefore changes a core product boundary, not just the target customer.

2. **Current technical momentum vs possibly cleaner market pain**
   - The active build is mechanical: CAD/DXF → duct sizing → LOD 100/200 IFC, plus MEP MCP work.
   - Competition bids may have a cleaner commercial story because firms cannot bill the speculative time, but almost none of the output pipeline has been built.
   - Switching now would discard or pause the most concrete technical path before it has been tested once.

3. **High-value promise vs missing ground truth**
   - Hesh's strongest claim—saving $300–400k by reducing drafters—is unverified.
   - Civly still lacks one real schematic → accepted model pair; Sharath cannot share office files directly.
   - Without that pair, the team cannot tell whether routing is deterministic enough, whether IFC output is usable, or whether firms would accept it rather than remodel.

4. **Fast adoption claim vs file-format reality**
   - Civly's policy is IFC-only, while Hesh repeatedly describes the expected output as a Revit model and Reuben stresses Revit libraries/worksharing.
   - Revit's recommended IFC workflow is to **link the IFC as a non-editable reference**. Opening an IFC attempts conversion into Revit families, but Autodesk describes design-transfer/editing capability as limited; connected MEP systems, native families, and reliable connectors are not guaranteed.
   - IFC is therefore strong enough for visual review, coordination, and discipline exchange, but potentially weak as the model a Revit drafter must continue editing.
   - This is a go/no-go validation question for Bet A, not a minor implementation detail: does the buyer want an exchange/coordination model, or native Revit MEP production content?

5. **Archicad MEP MCP solves generation, not Revit nativeness**
   - **Clarified 14 Jul:** Civly is now focused entirely on building a stronger Tapir-style **Archicad MCP**, including schematic-driven MEP creation. The direct `mep.py`/`ifc_writer` path is not the primary product path.
   - This is coherent: the MCP can create connected, native Archicad MEP elements, while Archicad exports classified IFC (`IfcFlowSegment`, `IfcFlowFitting`, ports, properties) for exchange.
   - However, a native Archicad duct exported to IFC does not become an equally native Revit duct network on import. In Revit it is normally a linked reference; conversion can lose system connectivity, connectors, family behaviour, and editability.
   - The safest architecture is to keep the **schematic interpretation, routing graph, sizes, system IDs, and ports application-neutral**, then use the MCP as the Archicad adapter. If native Revit becomes mandatory, Civly can add a Revit-side adapter later without rebuilding the reasoning layer.

6. **Rules-first product vs ML/data-moat story**
   - Hesh says duct sizing is deterministic but also recommends roughly 100k paired files.
   - The current roadmap correctly separates them: rules/calcs for the first golden path, ML later for messier routing and generalisation.
   - Training a broad model before one accepted mechanical example would hide an undefined product spec behind a data strategy.

7. **One platform vision vs two incompatible MVPs**
   - Both bets can eventually share agents, geometry representations, firm context, approval loops, and document generation.
   - They cannot initially share a buyer, demo, success metric, or output.
   - Calling both “design intent → LOD 250” obscures the difference and recreates the exact ambiguity both experts warned about.

### Recommendation
**Continue building Bet A now; validate Bet B without building it yet.**

Company frame (unchanged, per [[Civly - Overview and Status]] and [[Civly - Product and Tech]]):

> **The fastest way from sketch / CAD / project brief to a coordinated, code-compliant, editable LOD ~250 BIM across all five disciplines.**

For the *next milestone* inside that frame, the target is the mechanical MEP vertical slice:

> **Mechanical schematic CAD/DXF → native Archicad MEP model through Civly's MCP, sitting inside the same coordinated model that already carries architecture + structural, exported as IFC.**

This is not a permanent company limit. It is the narrowest test that matches the current assets and can falsify the core assumptions quickly.

The competition thesis should run as a separate two-week discovery track:
- interview 5–10 boutique/mid-sized practice principals who bid regularly;
- collect one anonymised competition brief + final submission set;
- verify Reuben's frequency estimate, team size, hours, win rate, and budget;
- show a static concept of brief → options → panels, not the current engineering demo;
- ask for a paid pilot or specific willingness-to-pay before changing the build.

### Decision gates
Continue MEP only if a real firm confirms all three:
1. its schematic format can be parsed or constrained;
2. an Archicad-authored IFC is acceptable for its intended handoff—or the firm explicitly requires native Revit MEP;
3. the generated mechanical slice saves meaningful drafting time.

Pivot toward competition bids only if:
1. at least several principals confirm repeated, material speculative spend;
2. one firm provides a real brief/submission pair;
3. a buyer commits to a paid or tightly defined pilot;
4. the founders explicitly accept that Civly will author creative design options and presentation output.

## Limitations
- Hesh and Reuben are each one expert; neither represents a statistically meaningful buyer sample.
- Reuben's “80% through competitions” estimate may depend heavily on firm type, geography, and project class.
- Hesh's headcount and savings estimates are not verified.
- The analysis compares the documented Civly architecture with WhatsApp build status, not a fresh inspection of the product codebase.

## Related Pages
[[BIM Mentor Call — Drafting vs Coordination & Data Moat]] · [[Reuben Roy Call — Competition Bids vs BIM Drafting]] · [[Civly Direction — Drafting-First Pivot (Jun 2026)]] · [[Technical Roadmap — What to Build First]] · [[MEP Drafting — Schematic to LOD 200]] · [[Civly Architecture Reference]] · [[Hesh]] · [[Reuben Roy]]
