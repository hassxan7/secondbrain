---
tags: [civly, civly/decisions, civly/critical]
updated: 2026-06-14
---

# Civly — Design vs Engineering Decisions

Up: [[Civly MOC]]

> [!danger] The line Civly must never cross
> Civly makes **engineering** decisions. It never makes **design** decisions. The architect and client author and iterate the design. Civly evaluates each option they propose. Cross this line and three things break at once: the product principle, the liability shield, and the Michael relationship.

## The worry that triggered this
Framing Civly as "iterating through different designs between the architect and the client" makes it sound like Civly authors design iterations. That is the dangerous reading and it has to be corrected wherever it appears.

## Why it is dangerous

**1. It contradicts the rule the founders set.**
Yash, 23 Apr: the design decisions "AI just CANNOT make," it "can just simulate what an architect gets from an engineer." If Civly iterates designs, it is making design decisions.

**2. It breaks the liability shield.**
Yash, 23 Apr: "The liabilities do not change, we don't own anything, we are just a tool." That holds only while Civly evaluates. The moment Civly proposes or selects a design that gets built, "we're just a tool" weakens fast.

**3. It is not what Michael asked for.**
He asked for design **evaluation**, not generation. His words: parallel studies "text prompted or quickly sketched and then evaluated by an AI driven process to see which performs best, without us actually drawing and coordinating it." The 8 Jun summary the founders confirmed ("is this true?" then "Then we are going the right way"): "Not a full BIM. Just a credible comparative evaluation. Which option gives more leasable area? Which is cheaper to build structurally? Which one hits the LEED target?"

## The bright line
- The **architect and client** author the options (10 storeys vs 14, open plan vs cellular, core left vs centred). Humans iterate the design.
- **Civly** takes each option they propose and returns the engineering and feasibility readout, then visualises a comparison BIM draft.
- Roles: architect = author, client = decider, Civly = the instant engineer in the room.
- The BIM that appears is the comparison artifact, not a design proposal. Hassaan, 8 Jun: "the first draft of bim to compare," "multiple iteration technology." Yash, 8 Jun: "all 4 5 different ideas can be mapped and visualised on BIM with feasibility evaluation."

## The template for every Civly behaviour
The ventilation example (Yash, 23 Apr) is the model for everything, including feasibility:
> "this ventilation shaft made on rhino is too big, realistic calculations show 50% decrease, do you wanna apply these changes, or redesign"

Civly states the engineering reality and offers options. The redesign call stays with the architect. **Inform, never author.**

## Michael's feasibility list (what "evaluate" means concretely)
For a tower feasibility study, the figures Civly should return per option:
1. Total leasable area
2. Efficiency per floor plate
3. People per floor plate
4. Toilets per floor
5. Lifts and types (single vs double decker)
6. Fire-fighting and goods lifts
7. Egress stairs and their sizes
8. Lift lobby size
9. Risers and air-handling-unit sizes
10. Other smaller shafts

All regulated differently by country. RICS (UK) is the international standard they follow.

## Copy fix that follows from this
- Replace "Civly generates multiple BIM drafts to choose from" with **"Civly evaluates the alternatives you propose."**
- The website line "Sketch to coordinated, code-checked model" is fine, because translation is not authorship.
- Anywhere "iterate" sits next to "designs," make the human the subject of the iterating.

See [[Civly - Messaging Rules and Open Questions]] for the full copy ruleset.
