---
title: "How to learn the BIM Coordination Skillset [FULL GUIDE]"
source: "https://www.youtube.com/watch?v=yVmKk7adJ1w"
author:
  - "[[BIM Accelerator]]"
published: 2024-07-03
created: 2026-06-14
description: "Work with me to become a BIM Coordinator: https://bimaccelerator.com/applicationDM me \"BIM\" on Instagram and I'll send you my 3-phase BIM Blueprint: https://www.instagram.com/bimaccelerator0:00 -"
tags:
  - "clippings"
---

> [!tip] Civly Relevance — **HIGH**
> Precisely defines the BIM coordinator persona Civly is automating, and names every coordination type Civly's MEP output must handle. Services, plant room access, louvre/facade, precast, and structural steel coordination are all concrete product requirements. Also contains the go-to-market insight: the pain is not just the work, it's 5–7 years of career cost. Civly's pitch: "we generate the coordinated model — skip the clash hunt."

## Notes

### Career Path and Why Coordination Matters (0:00–10:25)

- **Stuck modellers:** most architects/engineers spend 5–7 years as Revit modellers before even attempting the coordinator jump — not because they can't do it, but because no one shows them the path
- **Presenter's career:** went from modeller to BIM coordinator in 6 months by learning the coordination skill set early; directly opened the path to project management
- **Three-step growth model:** (1) level up skills by learning → (2) opportunity naturally presents itself → (3) take the opportunity → career advances; you CANNOT jump directly from modeller to coordinator without the skills
- **The stagnation trap:** modellers who don't make the jump after 6–12 months feel like they're growing (they're doing more complex models) but are actually becoming increasingly irrelevant as the industry grows around them; colleagues 10 years older who are still modellers confirm what your career will look like without the jump
- **Why people feel stuck:** they look at older colleagues who are still modellers and realise those colleagues have more tenure — so there's no promotion pathway unless they move companies OR learn the skill set that qualifies for a higher role

---

### What BIM Coordination Actually Is (13:44–26:35)

- **Core definition:** before a building is constructed physically, it's constructed virtually in the computer; BIM coordination = ensuring that all the virtual discipline models work together without conflicts before construction begins
- **Disciplines involved:** architecture, civil, MEP (mechanical/HVAC, electrical, hydraulics/plumbing), structural; each built separately, then coordinated together
- **Two coordination phases:**
  - **Design phase:** architect-led; ensures MEP/structure work with the architectural intent; ceiling heights, structural penetrations, MEP routing all checked at this stage; changes are cheap here
  - **Construction phase:** contractor-led (mechanical, electrical, hydraulic contractors); much higher stakes — services have been designed, sometimes partially fabricated; changes are expensive; this is where most real coordination work happens
- **Two types of coordinators by scope:**
  - **Single-discipline coordinator:** works at one contractor (e.g. a mechanical company); only coordinates that company's ductwork — ensures their duct doesn't clash with anything else; doesn't care if hydraulics clashes with electrical (not their scope)
  - **Cross-discipline coordinator:** coordinates all trades for the whole project; may sit at an architectural firm (design phase) or at a BIM consultancy (both phases)
- **BIM consultancy role:** relatively new; an external company engaged to coordinate the whole project — runs clash detection between all disciplines, assigns responsibilities; not every project has one; traditionally the mechanical HVAC contractor and architect share coordination responsibility

**What coordination is NOT (what 95% of people think it is):**
- Creating parametric Revit families
- Learning Dynamo scripting
- Mastering BIM standards (ISO 19650) — you need to know standards, but they don't teach you how to coordinate; learn the basics of coordination first, then learn the standards on top
- Building complex Revit templates
- Becoming a Navisworks expert (Navisworks is being superseded by ACC)

**What coordination IS:**
- Understanding the spatial requirements between different services
- Knowing how much clearance is needed in front of equipment
- Knowing headroom requirements inside plant rooms
- Making sure services are correctly routed relative to structure and architectural elements
- Flagging clashes and working with other trades to resolve them

---

### Programs Stack — What You Need to Learn (26:43–38:30)

**1. AutoCAD (still needed, declining):**
- Not needed for your own work — needed because some electrical/fire contractors still use it and submit 2D AutoCAD drawings
- Use case: create overlays (layer multiple 2D PDFs/DWGs) to find clashes manually when 3D models aren't available from every trade
- To check clash: overlay hydraulics on mechanical, zoom in to conflict area, measure heights from soffit, calculate when sloping pipe would intersect with duct
- Prediction: will be fully replaced by 3D Revit/ACC within a few years; already rare for new projects in 2024

**2. Revit:**
- Model your own discipline; link other discipline files into your model for visual clash checking
- Minimum coordination responsibility when modelling: ensure your services don't go through structural slabs, windows, or walls (architectural + structural are usually fixed; don't move those)
- If headroom or space is critically short: only then is it acceptable to negotiate ceiling height changes with the architect
- All modelling now happens on the cloud (ACC/BIM 360) — changes sync live across all linked models; no more weekly email exchanges of .rvt files

**3. Bluebeam:**
- PDF editor with full overlay, annotation, and mark-up capability — not just a viewer
- Use cases: overlay architectural vs MEP drawings for RCP coordination; add revision clouds around clashes; export annotated PDF to send to trades for resolution
- Why it's not obsolete: some workflows (especially RCP) work well in 2D; Bluebeam is much faster than loading full 3D models for these cases
- Some residential/small firms use Bluebeam exclusively instead of ACC
- Cost: ~$500/seat/year

**4. ACC (Autodesk Construction Cloud) / BIM 360:**
- BIM 360 = older version; ACC = successor with more features (auto specs, AI document parsing) but functionally very similar
- **The Google Docs of BIM:** models live on the cloud; every team member always has the latest version; no manual syncing of files
- Key features for coordination:
  - **Permission-based model publishing:** when modelling in-progress (e.g. changing 100 doors over 3 days), keep it in work-in-progress state; only click Publish when done → other trades then see the updated model
  - **Clash detection:** run automated clash detection between any two models (e.g. mechanical contractor vs electrical contractor); results shown in a table, each clash assigned to a responsible party; emails sent automatically
  - **Cloud clash assignment:** unlike Navisworks (local), clashes in ACC are assigned to people and tracked — much better for multi-party coordination
  - **Model packages:** create a package of published models for formal distribution; e.g. issue arch package to MEP consultants at a specific milestone

**5. Navisworks:**
- Local clash detection tool; no cloud collaboration; no clash assignment to other parties
- Analogy: Word document on your computer vs Google Docs — Navisworks = local Word file, ACC = Google Docs
- Still listed in the programs stack because the industry knows it; some firms still use it; but ACC is the modern replacement
- Navisworks does NOT send emails when you assign a clash — recipients never get notified; entire process is manual

---

### Coordination Examples — Real-World Scenarios (38:31–59:54)

**1. Services Coordination** (most common, bread-and-butter):
- MEP services (ducts, pipes, cable trays) must not clash with each other, with structural elements, or with architectural elements
- **Real example:** siphonics pipe (high-pressure drainage, carries toilet waste at high velocity) goes under duct; a hydraulics pipe goes above the siphonics; duct goes underneath them all — each service stacked with its own zone
- **Cascade example:** hydraulics toilet waste pipe requires a U-bend below the floor slab (standard for trap); the U-bend forces the duct below it to drop lower; the duct dropping lower forces the ceiling height to drop in that area — coordination cascade: hydraulics dictates mechanical placement; mechanical dictates ceiling height
- Done in Revit (modelling) + ACC (clash flagging and assignment)
- Revit Structure is sometimes used by specialist structural coordinators; normally ACC or BIM 360 is sufficient

**2. Louvre/Facade Coordination:**
- Louvres = grilles on building facade where HVAC intake/exhaust ducts penetrate the building envelope
- **Bad coordination example:** louvres placed at random positions on facade, not aligned with windows or other architectural elements; looks chaotic; blame falls on architect even though it was the coordinator's fault for not flagging it
- **Good coordination example:** louvres aligned symmetrically beneath windows; fake/dummy louvres used to fill the remaining facade area for aesthetic consistency (real function: HVAC intake on left, exhaust on right; fake louvres in between complete the pattern)
- **Fake louvre strategy:** common in car parks and facades where the architect wants a uniform look — coordinator and architect agree on a full louvre strip; only some of it functions, the rest is decorative
- **Mechanical sizing cascade from coordination:** adding bends to route ductwork around constraints increases resistance → unit may need to be upsized → larger unit may lower ceiling heights → ceiling height coordination issue
- Done with Revit (3D clash) or Bluebeam (2D overlay of architectural elevation with mechanical elevation drawing)

**3. Plant Room Access Coordination:**
- Plant room = dedicated equipment room (pumps, chillers, AHUs, condensers, heat exchangers); typically on roof or lower levels; often has equipment lifted in by crane before walls are built (equipment too large to move through doors)
- **Primary rule:** walking clearance height must be ≥ 2100mm (2.1m) anywhere people need to walk under services
- **Exception:** services against a wall where no walking occurs can be below 2100mm; if it's at hip height or lower against a wall, there's no risk of head impact
- **Example 1:** fan coil unit relocated to floor level because ceiling services were too low; floor placement removes the walking-under-it risk; perfectly acceptable because you walk beside it, not under it
- **Example 2:** three ducts originally routed through the centre of the room at 1600mm height (below head level); solution — run them as a "ductwork wall" along the perimeter; walking path remains clear; ducts along the wall can be below 2100mm
- **BIM 360 measure tool:** in-model measurement shows distance from bottom of duct to floor — quick headroom checks in 3D view; no need to create sections

**4. RCP (Reflected Ceiling Plan) Coordination:**
- Looking up at the ceiling: ensure lights, diffusers, sprinkler heads, access panels, smoke detectors, and other ceiling-mounted elements don't overlap or clash with each other
- 2D coordination — RCP only has one plane (the ceiling surface), so 2D is sufficient (unlike services coordination which requires 3D)
- **Via BIM 360:** run clash detection between electrical ceiling elements and mechanical ceiling elements; assign clashes to respective trades
- **Via Bluebeam (preferred for speed):** export each discipline's RCP as PDF; overlay them with reduced opacity; use revision clouds to mark clashes; annotate which trade must move which element; send PDF to all parties
- Common owners of this work: architect (usually sets up the initial RCP layout), mechanical contractor (diffusers), or BIM coordinator (if engaged)

**5. Precast Panel Coordination:**
- Precast = concrete panels cast off-site with penetration holes pre-formed; lifted to site and bolted/welded in place; cannot easily add holes after casting without compromising structural integrity
- Penetrations are needed for MEP services (HVAC ductwork, hydraulics pipes, electrical cable trays) passing through the precast panels
- **The core problem:** MEP penetrations must match the holes in the precast panels exactly; if they don't, on-site the duct or pipe must be redesigned and re-fabricated → expensive and slow
- **Why 2D coordination fails:** measuring penetration locations from 2D drawings requires calibrating the drawing scale, manually measuring from datums, calculating duct sizes and positions — extremely error-prone
- **3D coordination solution:** get precast detailer to model panels in Revit with the holes included; then in ACC or Revit, you can visually see instantly if a duct passes through its hole or misses it (as clear as looking at a 3D model)
- **Civly relevance:** this is the structural-MEP interface — Civly must know where precast panels are (from structural model) and generate MEP penetrations that actually align with panel holes, or flag misalignments at generation time

**6. Structural Steel Model Coordination:**
- **Two steel models exist simultaneously:**
  - Structural engineer's model (design phase): shows designed steel layout; used for initial coordination
  - Steel detailer's model (construction phase): the actual shop drawings; shows the real final steel with connections, cross-bracing, gusset plates
- **The timing problem:** MEP is coordinated against the structural model → steel detailer's model is published later (sometimes after MEP is already fabricated) → new clashes appear that didn't exist in the original coordination
- **Real hospital example:** X-ray room steel support beams appeared in the steel detailer's model after MEP was already coordinated and ductwork was at the factory; 5 duct segments clashed with the new steel:
  - Result: had to cut and remanufacture duct on site
  - Had to relocate a ceiling diffuser and add an extra diffuser to cover the gap
  - Rework on site is extremely expensive vs catching it during coordination
- **Best practice:** insist on steel detailer model being finalized and linked before MEP fabrication begins; coordinate against steel detailer model, not just structural engineer model

---

### Career Identity and Growth (1:00:20–1:07:20)

- **Identity precedes opportunity:** you can't take an opportunity you can't see; you can't see the opportunity until your identity (what you believe you're capable of) catches up to the skill level required
- **Three blocker questions at a coordinator interview:** (1) Can you set up ACC? (2) Can you do clash detection? (3) Do you understand MEP basics? Without the skill set: three "no" answers → not hired. With the skill set: three "yes" answers → experience carries the rest
- **Compound effect:** 0 × 1,000,000 = 0; skill = the 1 that makes everything else compound; without it, years of experience multiply nothing
- **Strategy:** learn skills in your current role → apply to coordinator roles → even if refused, file is kept on record → companies hire from that record months or years later
- **Once coordinator:** naturally interface with project managers → absorbs project management skills → pathway to PM opens without needing to start over

![](https://www.youtube.com/watch?v=yVmKk7adJ1w)

Work with me to become a BIM Coordinator: https://bimaccelerator.com/application  
  
DM me "BIM" on Instagram and I'll send you my 3-phase BIM Blueprint: https://www.instagram.com/bimaccelerator  
  
0:00 - Intro  
04:43 - You currently  
10:25 - Agenda  
13:44 - What is BIM coordination  
26:43 - BIM Coordinator programs  
38:31 - Examples of BIM Coordination  
1:00:20 - Key to growth

## Transcript

### Intro

**0:00** · In this video, what I'm going to do is tell you every single program you need to learn to become a BIM coordinator.

**0:06** · And once I've done that, I'm going to tie that into exact examples, real-life examples of BIM coordination, so that you know how do these programs actually impact the real world, right? Not only like services coordination, but plant room access coordination, louver facade coordination, precast coordination, right? I'm going to tell you each of these examples tied into the programs, so that you can see, okay, these are the programs, this is the outcome. This is what I'm going to use programs for. Cuz it's one thing to know the theory, but we want to know the actual practical examples of what it's going to how it's going to work, right?

**0:37** · So, the purpose of this video is to shed light on the industry, so you know when you start to work what it's actually going to be like. Or you know, if I want to actually start to learn these things, what do I need to research on Google?

**0:49** · What do I need to research on YouTube, right? What do I need to educate myself with? And once you can start to educate yourself with these things, it becomes much easier for you to see the path in order to get to this outcome, okay? So, let's start.

**1:03** · So, explaining every single program you need to learn to become a BIM coordinator, and then I'll show you the examples at the end, right? So, this is for architects and engineers who have been stuck as draft people for 5 plus years. I work with a lot of architects and engineers who've been 5, 6, 7 years in the industry, and they realize they look back at their lives and they're like, okay, I've been I've been a modeler for 5, 6, 7 years now. I should have actually made the switch to coordination recently in the last 2 years. Why haven't I been able to do that? And so, that is what I'm going to explain to you in this video, and then tie it in to how you can make the switch really quickly, okay?

**1:33** · So, the reason I'm making this video is cuz I only had to work as a Revit modeler for the first 6 months of my career. I didn't do Revit after that. Like, I used Revit on a day-to-day basis, but I didn't do it for like detailing and all these things that I would have used for the first 6 months, and what you're probably using it for right now, probably for the past 5, 6, 7 years, right?

**1:54** · So, I was actually able to transition over to BIM coordinator, and that opened up my pathway to learn project management. So, I'm trying to get to project manager as fast as possible, but that's only opening up because I learned BIM coordination, right? So, the only way I was able to do that was through learning BIM coordinate the BIM coordination skill set ahead of time, so that I was able to level up my skill set before I leveled up my opportunity, okay? So, you first there's three levels.

**2:17** · You level up your skill set by learning, and then the opportunity naturally starts to present itself, and you take those opportunities, and then officially you can become a BIM coordinator. But, you can't just go from knowing Revit to becoming a BIM coordinator overnight like this. Just because you have experience in the industry, it's not going to happen. So, first level up your skills, the opportunity will present itself, take the opportunity, and grow with your career, right? That is the whole process, and that's what a lot of people fail to do cuz they just don't learn the skill early on.

**2:44** · So, this graph, which I have over here, is like a visual representation. I've talked about this a few times in in the past in past videos, but this is my approach to looking at your career, right? Trying to understand when to take the new approach, like when to take the new jump in your career. For me, this is around 6 months to 1 year in your career after you've learned Revit modeling.

**3:03** · Like, you learn a lot when you're a Revit modeler. You become good at it, you become good at the program. It's a good program. You learn coordination slightly, but you're not really making the key decisions. You're getting information on how to model, and then you're modeling, okay? You want to get after this, you start to diminish. Like, the the industry is growing, it's becoming better, but you're always doing Revit modeling. Now, when you get to this stage, you want to then jump onto the next curve, and then move with that curve forward, upwards, right?

**3:29** · The only way that's going to happen, what's the next natural transition?

**3:33** · Revit modeler, BIM coordinator, BIM manager, project manager, right? Or you can just skip BIM manager and go to project manager, it doesn't matter. But, once you learn the coordination skill set, everything opens. So, after 6 months, you can then start progressing really quick in your career if you get into the coordination boat, right? You just need to get into the right opportunity. The skill takes you to the opportunity, and the opportunity will take you up on this graph. But, what a lot of people do is after 6 months, they stay as a modeler. This isn't going all the way down, but it's sort of like just like stays like this, and then you're stagnant. And this is what people they come to me on these calls.

**4:03** · I have a lot of calls with people that want to grow in their career cuz I work one-on-one with everyone. So, they tell me that they feel stagnant. They ask me, why is that? Why do I feel stagnant? It's cuz of this. This is the illusion. Like, you you go to a certain level, and you feel like you're learning, but then you realize you only realize after a couple months, a couple of years, 5 years when you look back, oh, I should have probably taken that opportunity and learned earlier on, taken that risk of maybe learning and spending a bit more time, so that now I'm probably going to be would've been a manager. And so, as you grow older, your responsibilities only increase.

**4:33** · So, if you don't grow in your career, you will regret it. So, this is this is the graphical representation of how I think so that this will never happen to me, okay? So, this is you currently. Like, you're working as a Revit draftsperson. You're quite good at your job. You enjoy it, but you feel like you've hit a ceiling in your career, right? You know that BIM coordination and management is the skill set that you're interested in learning because it's the next logical step in your career, which unlocks the pathway to management. That's what you always wanted to get to, but you haven't been able to get there, and you you you sort of only you're starting to realize that now, or it's been in the back of your mind for a for some time, right?

### You currently

**5:06** · This is what you think. You think that your personality suits more of a management role, and so you want to get there. You think that you have no time to be going back to uni to learn all these new things. Like, you are you going to really go back to uni and do another course in order to get into BIM management? Like, you know that courses are like there's people becoming coordinators, managers, and project managers without courses. Why do you have to get into debt going into uni and spending like 50 grand on a course again when like there there should be a way to do it, right? Without having to do that.

**5:34** · You think that with the experience you currently have, you should be able to give advice and manage a team, but you're not cuz you see younger people actually starting to overtake you now.

**5:42** · It's been 5, 6 years, and then you're thinking, oh, this guy that's my manager is like sort of similar age to me now.

**5:47** · Like, why like he seems to know a lot more about the industry, but I've been in the industry for the same amount of time. Why is that, right?

**5:55** · You've seen younger, less experienced people get roles and responsibilities higher than you, for example, me, and you think that you should be able to be in those positions as well, right? You think that you have great potential, but your position has not allowed you to bring this to life.

**6:07** · It's been stifling you, and you've been feeling this for months now, okay? You know it's been going for years, but you've only started to feel this for like the last couple of months, like this year. This is when you started to realize, ah, sort of been doing the same thing.

**6:18** · You might feel wrong for even wanting to grow from your current position if that means getting hired as a coordinator in another company. Like, a lot of people come to me and they say, like, I I want to grow, but I like my job. I'm good at what I'm doing, but and then they also feel a little bit of guilt that they they want to grow, and they they can't grow cuz they have to leave their current company, but this is the feeling. They they feel, how did I get so stagnant? And so, that that's what pushes them to to move, right?

**6:47** · You might even look at other people in your office, but this is what happens, right? You look at other people in your office who are 10, 15 years older than you, and you're thinking, they're okay. They're Revit modelers.

**6:56** · They're draft people. I'm also a draftsperson. I'm a Revit modeler.

**7:02** · 10, 15 years is going to go, and I'm going to be in their position because there's no way that they've been in a company longer than me, and I'm going to get the promotion before them, right?

**7:09** · Because they have more experience, so they should get the promotion. So, what does that mean? That means that if you think about your colleague who is 10 years older than you and also a Revit draftsperson, that person has to get promoted before you. So, what does that mean? You're not going to get a promotion unless you learn the skill set first, okay? So, what does that mean?

**7:24** · That means that if I project my life for the next 10 years, that means that I'm going to be a Revit modeler for the next 10 years unless I move my company, but if I move my company, I'm also going to be a Revit modeler again because I don't have the experience or like the skills in order to become a coordinator. I've never done it before, and so I'm just going to be stuck as a modeler. So, if you look at your colleagues and you think there's people 10 years ahead of me that are doing Revit modeling, you're probably right. Like, you are going to be in that position unless you learn the skill, and that's what I'm trying to teach you here.

**7:50** · Even if you think cuz a lot of people come to me and they say, okay, I want to start my own company, and that's why I want to learn the BIM coordination skill set. That's absolutely amazing reason to learn the skill set because think about it. If you start a company later on, you're going to need to know how to run the whole show before you even delegate and hire more people unless you have the capital, the $200,000 in order to hire someone and hire a small team that's going to do the coordination, and then you're the manager, right? But, like, you want to be able to learn all of the skills, so that you know everything, so that you can act as everyone when you start your own company. That is the process, right?

**8:22** · So, you think that you should learn the BIM skill set and apply to companies, so that you have so like here's the thing.

**8:29** · If you learn the BIM skill set now, you learn how to coordinate, this is the best opportunity for you because you can start applying it to your current company or the company you're going to work in next as a coordinator. You can learn you can use their resources in their company, right? They have projects that are big. If you're the BIM coordinator, you get to work on those projects. You get so much experience in 2, 3 years, then you can start to do your own company later on.

**8:51** · But, if you don't learn this, and then you start thinking, okay, later on I'm going to start my company, by the time you then get to the age, let's just say like 29, 30 when you want to start your own company, you can't even do that because you don't have the experience cuz you've never done the coordination cuz you don't you've never been put in the position to learn that. So, if you do it now, then you can start to think about how do I apply this into my current company? You learn the skills, and then you're on the right trajectory to exit, and then start your own company.

**9:15** · So, this is the best way to start your own company is by learning the skills early, so you can apply it when you actually have the opportunity cuz later when you start your company, you're not going to have the opportunity. You're going to have to create your own opportunity. So, when you have the opportunity, don't take it for granted. Use it to the maximum capacity. That's what I'm trying to do is I'm trying to learn as quick as possible, apply it in my current company, get all the knowledge that you can from your current company because you're never going to be able to have that opportunity when you start your own company later, right?

**9:45** · So, personally, I was able to engage in the design and coordination of hospitals, prisons, aged care schools, luxury apartments, and houses over $500 million probably in the first like year and a half of my career. And the only reason that I was able to do that is because I leveraged another company. I was able to work as a coordinator on their projects.

**10:01** · Do you think that I would be able to do that by myself? If I started my own company, it's impossible, right? So, if you learn the skills, you can apply them. Sound like a broken tape recorder here, but learn the skills, apply them into a company, and then you learn quicker. That's how you accelerate your learning, right?

**10:16** · So, I'm just going to skip this bit because I talked about this, but in this video, I'm going to show you what 95% of people do wrong when they try to become a coordinator or what they think coordination is, which is complete misunderstanding, and how to avoid spending time on the wrong things. Most people have the wrong idea of what coordination is, so they're not clear what it is, and they don't know what to work on, and then they just too much information, they just don't know what to do, and they don't ever get there. So, purpose of this video is to show you what it is, right?

### Agenda

**10:46** · What are all the programs and skills you need to know in the BIM industry to make sure you are not capped by your skill set.

**10:54** · I'm going to explain all the programs.

**10:55** · Like, even like 2D programs, I'm going to talk about like AutoCAD and how you use that as a BIM coordinator. Like, even like um PDF uh documents, like PDF softwares. I'm going to show you how to use that as a BIM coordinator in this video, okay? Examples of different types of coordinations you need to know as a BIM coordinator so you can go and learn them. You go research these a after me.

**11:15** · Like, I'll I'm There's nothing. I'm going to hold back nothing. I'm going to tell you everything you need to know.

**11:18** · And then you just need to do a bit of hard work after this, go research everything, and then um and then learn it so then you can actually become a coordinator, okay? And the special bonus at the end is I will tell you one psychological hack that I use cuz I do a lot I One of my passions is learning psychology and trying to implement that into life. So, I do a lot of research about psychology. I've always been interested in it.

**11:38** · And so, I try to implement psychological stuff into my career and into my life so I can understand how to grow quicker and what are the mental blocks which I have so I can grow quickly in my life, in my finance, in my career, and everything, all right? So, I will show you why growth in your career is based on your beliefs and how you present yourself rather than your actual experience, okay?

**11:57** · I'm the best example of this because this is why that I was able to put my self into a position where I was able to learn more and then grow quicker, right?

**12:05** · It easiest example, like think of a think of a person that There's people that are 40 years old and they have like 40 million, 50 million dollar companies, but then there's people that are 70 year olds that have like a $2 million net worth.

**12:23** · Why is that?

**12:25** · Well, if you say experience, well, you you might have a 70 year old working in a company for their whole life and retired now, but their net worth is only like a million. Um but then or like 500,000 or whatever because of all the money they accrued in their life, but then you have someone that's 40 years old and that's making $40 million a year cuz they started a company. Why is that?

**12:41** · It's not because of experience because experience time would mean that the 70 year old is richer, right? It's not because of experience, it's because of skill. So, psychological hack, I'm going to show you that at the end, but it's you're not going to understand it unless you watch the whole video. So, that's why I try to put everything in a in like a sequence so it hits the right trigger psychologically so that you are pre-framed with the correct information.

**13:01** · So, by the time you get to the end, that's why I have most of the in most important relevant information at the end. So, those of you that actually listen to the end get the most value out of it because like it builds on top of each other and on top of each other.

**13:13** · It's like you your primary school teacher taught you math, like simple addition, so that you could learn calculus when you're in uni, right? So, like if you don't really learn simple addition, you can't learn calculus. So, if So, like you need to go in a proper sequential step in order to get to the final outcome. So, don't be lazy, watch the whole video is what I'm trying to tell you.

**13:32** · And um so, yeah, let's get started. So, here's exactly what the BIM coordinator does that you don't get to do. And so, this is I'm going to talk to you about the what 95% of people do wrong, what they think BIM coordination is, and what it actually is so that you actually understand what it is. So, you already know that in terms of coordination, there is different models.

### What is BIM coordination

**13:49** · There's a design model, there's the MEP model, there's a structural model.

**13:53** · And before we construct a building on site, we actually instruct construct it in the computer.

**14:00** · We construct it virtually. And this is why we use Revit, AutoCAD. This is why we use um Autodesk Construction Cloud, BIM 360. These are all tools we use to create the construction process of this whole thing on the computer, in the computer, in a model so we can see what it's going to look like. And then after we're like, "Okay, this is all good." we go and construct it in real life, right?

**14:20** · So, like you have architects, you have civil engineers, you have MEP consultants, mechanical contractors, electrical contractors, hydraulics contractors.

**14:27** · And so, what does a BIM manager do? The BIM manager will make sure your model does not clash with other models and will take care and be in charge of a whole entire project's coordination. So, you can have BIM managers that are within specific companies. Like, I personally work at a mechanical contracting company. So, there's two things I can do. I can do the coordination of a project that that mechanical contracting company has. So, I can just take care of coordinating the ductwork, okay? If I was working at an electrical company, which I have before, I was in charge of coordinating all the electrical cable trays and the lighting and all of that, right?

**14:59** · So, like you can be a BIM coordinator for your specific engineering niche or like your architectural niche, okay? So, like mechanical engineers, you become the coordinator of the ductwork. Electrical engineers, you're coordinating the like the electrical trays, making sure it's not clashing with anything else. When you're doing that type of coordination, you're actually only considering your own service most of the time, okay?

**15:20** · So, like if there is a BIM coordinator who is working at a electrical company as electrical BIM coordinator, he's just making sure for his company, the company that I work for, let's just say like Hash Electrical.

**15:35** · Do the Does the electrical trays in Hash Electrical company, do they clash with anything else? Okay, I don't care if the duct is clashing with the hydraulics pipe. I just care is the electrical crate clashing? No, it's not clashing, good, okay? That's my job as a coordinator. Same thing with mechanical, that's my job as mechanical coordinator.

**15:52** · But sometimes when you work as a coordinator in specific companies, like architects, when they do coordination in their architectural company, they make sure that the MEP is not clashing with their architectural elements, and they have to do more coordination because in the design in the design phase, the MEP has a big impact on the ceiling heights and and the structure and all these things, right? So, like when you're specific coordinators in specific companies, you have to look at a wider scope of things.

**16:20** · So, for example, sometimes I personally as a mechanical engineer do the coordination just for mechanical, but then sometimes I also do the coordination for the whole entire project, right? I do the coordination between mechanical, hydraulics, electrical, um site phonetics, all these different cool all these different sort of disciplines.

**16:39** · But that really depends on what the contract is, right? What did the company win over?

**16:46** · So, those are the two types of things like the BIM coordinator comes in, and then the BIM coordinator can be coordinating like all the contractors, like mechanical MEP services with the electrical, with the hydraulics, with the steel, and also with the architect, and also with the MEP consultant, and making sure that everything is going well, right?

**17:07** · But remember, there's two phases of a project. There's the design phase and then the construction phase. I personally work mostly on the construction phase. I don't I don't work too much on the design phase. So, but I mean the um What do you call?

**17:22** · I'm losing the word here. The the the skill set, there we go. The skill set is actually very identical. Like, whether you do coordination in the design phase or construction phase, the construction phase is a bit harder cuz you're dealing with actual like you can't you you have to make sure everything is perfect, but in the design phase, you don't really have to make sure all everything's properly coordinated cuz like later on the like someone like me will have to take care of everything, right? As the coordinator in the construction phase.

**17:45** · So, you can be a coordinator working in one of these companies, and you can either coordinate individually M, individually E, individually P, plumbing, or individually steel detailer, or you can work as a BIM coordinator in a BIM consultancy. You can start your own consultancy, and that BIM coordinator usually can get engaged in order to coordinate throughout the whole entire project. And so, in this case, what they do is they set up the whole entire project for like in during the design phase, and they make sure the architect's coordinating with the MEP, and then everything's good there.

**18:13** · Then when we go into the construction phase, which is like a like 6 months, 12 months after this whole process is finished, then he makes sure or she makes sure that everything is properly coordinated in the the construction phase, like between like the contractors, right? So, like you can be working, again, just to be very clear, you can work as a BIM coordinator in each one of these companies, right? Or you can work as a BIM coordinator in a BIM consultancy, which is going to be doing the whole thing, or you can work as a BIM coordinator in a architectural company.

**18:43** · If you work as an architect in a coordinate in the architectural company, they'll be doing a lot of the coordination between the whole like setting up setting up the whole ACC Autodesk Construction Cloud for this whole design phase because the the architect is the person that sets up the the Autodesk Construction Cloud with proper permission settings and make sure that the whole um everything is properly coordinated in that stage of the project, like MEP, making sure it's coordinated with architectural, right? So, two very high stake coordinators are the coordinators in a BIM consultancy, which is not always engaged, by the way.

**19:13** · Not every time we get a BIM coordination um consultancy engaged on a project.

**19:21** · Usually, the coordination happens it by the architect, okay? In this phase, and then by the mechanical contractor in this phase. This is a very new concept that we have BIM consultancies coming in. Um and it's been happening recently. But so, one of the projects which I'm working on right now, we have a BIM coordinator from a consultancy doing the thing.

**19:40** · But in pre previous projects, the mechanical HVAC contractor is the person that took care of this part of the coordination, and then the architect is the person that took care of this part of the coordination. And we don't actually have this BIM coordinator. But the BIM coordinator consultancy now comes in and says, "Okay, we're going to take care of this. We're going to take care of this. You just make sure your own trade is coordinated." So, it's like a second um like a double-checking sort of thing, okay?

**20:03** · Hopefully, that makes sense because it it can get confusing where coordinators get engaged. It really depends on how the client has decided they want to coordinate the whole thing. But typically, traditionally, this is what you'll see, the architect takes care of this coordination. The HVAC or mechanical guy takes care of this coordination, okay?

**20:21** · So, what did I talk about all this time?

**20:23** · I talked about coordination between services. That is the the money-making task, right? It's not like creating templates. It's coordination. Like you want to make sure that this duct is not clashing with the tray. You want to make sure that these pipes are not clashing with this, right? You want to make sure this is going in between those pipes.

**20:37** · You want to make sure that this duct is not going in a uh in a wall like this and when it's turning, like things like that, right?

**20:44** · So, you'll need to learn how to coordinate services, how to do coordination between architectural, steel, and structure. Like sometimes, the steel is correct on the steel model, but there's also steel in the structural model. And then so like which one is correct? Right? And then sometimes, there's also concrete columns and in the architectural model and concrete slabs, but there's also concrete slabs in the structural model. So like then which one is correct?

**21:07** · And so it really depends on which phase of the project you're in. And so the BIM coordinator needs to keep an eye on every single time what is the correct updated model because the contractor or the MEP people are dealing and working with what they see in the model. So, if they see something on the structural model saying that this is what the slab thickness is going to be and it's not actually the slab thickness cuz it was in the architectural model, then they're doing the completely wrong thing, right?

**21:29** · This is why a BIM coordinator is important because if you model a whole entire building with the wrong assumptions, then you have to remodel the whole entire building. And modeling buildings takes months, especially if it's like a 50-story building, right?

**21:42** · So, another thing, how to ensure that the plant room has correct access?

**21:45** · Because like when you you know plant rooms, right? A plant room is pretty much a room inside a building. Let's just say a hospital. You have a room probably on the roof level where you have like all the units. Like you have pumps there, you have chillers there, you have um coolers there, you have air handling units which are just like big tanks of like they pump air into the building and they have this huge ductwork. You've probably seen. When you go in your car and you're driving down a road and you look in the like just look around, right? You see like fans and like big plants on top of like the roofs of buildings. Like that is a plant room.

**22:17** · Some plant rooms are open to the environment. Some plant rooms are closed within the building. And so this is where a lot of the equipment gets lifted up from a crane and put on top of the building or like lifted through a crane and put inside the building before the walls are even built around it. Like sometimes, we build walls. The building gets built around the plant room because of how big this equipment is, right? So, in this case, we want to make sure that we have proper access inside the plant room. Because as you can see, a plant room which looks like this, like if you're walking down here, you want to make sure your head's not hitting anywhere here. And because there's so much services in the ceiling, right?

**22:47** · So like if there's not enough space, it gets lower and lower and people model lower. And then when you model lower, if it's below like 2100, 2100 mm, 2.1 m, then you can hit your head. And so you have certain standards like making sure that everything is above 2100 in order to make sure that you have proper access. And also, if you have like a chiller or a pump, you want to make sure you can walk around the whole area, right? You want to be able to access through the door, around equipment, all all this stuff, right?

**23:16** · Making sure that the roof elements such as the fans and ductwork are going through the roof and not going to clash with things like solar panels. Like you want to make sure that you're coordinating properly so that like you don't want to have solar panels installed on the roof first when you're constructing a building and then the mechanical guys go, "Oh, we actually have like four fans which we need to go through the the the roof. Like the solar panels are now you can't be put there." And so now you have to like rearrange the solar panels. Like it's just work that has to happen twice.

**23:41** · Making sure that the louvers on the facade of a building are not clashing with any architectural elements. Like sometimes, you'll have louvers which are clashing with specific architectural elements and sometimes, they'll look really ugly and you need to coordinate them, right? If this doesn't happen at the start of the project properly, it will look really bad at the end of the project and the architect will get the blame. But because when you look at a building, you think, "Oh, it's not been designed properly." But the thing is it was the coordinator's fault. So, like the coordinator needs to bring these things up early on.

**24:06** · The way we coordinate this is through a combination of 2D and 3D programs, right? So like you will notice that the bread and butter of coordination is to do with making sure services do not clash with each other and they are placed as per the initial intent, okay?

**24:24** · And so, what do we need to learn? We need to learn the skills of managing the platform and the coordination of all environments and the workspace associated with collaboration, okay? After you've learned that, you'll have the skills and I will go over each of the programs you'll need to learn later in the video. But now, it's just important that you understand what a BIM coordinator does. When I talked about all this, did I did I talk about creating parametric families and then creating using Dynamo to create scripts? Like do you think that's going to help?

**24:53** · Honestly, tell me. It's probably not going to help, right? And that's what a lot of people think it is. Or like even the BIM standards. Like some people try to like learn the BIM standards very well, like the ISO 1950 or whatever. But like is it like what's the what's the basics here? The basics are just making sure you understand what's going on, right? So like don't jump to trying to learning the standards, which you need to learn the standards, of course. But don't try to jump to learning calculus before you haven't learned simple addition is what I'm trying to say here.

**25:20** · So, if you're trying to learn coordination, try to learn the basics of MEP and how like everything goes together. What are the like how how to coordinate? What are the coordination requirements? How much space do you need in front of like a plant room? How much space do you need inside a plant room?

**25:33** · How much space do you need in to on top of your head? Um these things you need to learn, right?

**25:39** · And so, this is what 95% of people try to do when they want to learn to become a BIM coordinator. And this is the wrong approach. Like you're trying to hit it you're trying to hit something that you're meant to twist with a hammer and then you're trying to you're trying to do something you're meant to hit with a one of these. I don't know what this thing's called, but using the wrong approach, right? It's too early for this. So, it's too late for this, right? A lot of people think that the way to get into management or coordination is through learning one of these things. Like how to manage a library. How to create nice parametric families. How to create templates. How to resolve Oops.

**26:07** · How to resolve issues on Revit, right?

**26:09** · Learning Dynamo Oh, like becoming a Revit expert. Like I want to learn how to use like filters and like advanced things. How to Let's learn Dynamo and then integrate Dynamo into Revit and then everything is on a BIM manager. Or like learn Navisworks. Like yeah, Navisworks is really good, but it it's not used anymore because Navisworks on the cloud is ACC. So, learning BIM standards. You might be surprised by that, but like you don't want to learn BIM standards before you don't have the basics, which is you want to learn coordination, right? Like coordination is the bread and butter.

**26:35** · Don't learn BIM standards yet.

**26:37** · So, what are the exact programs that you need to learn to become a BIM coordinator? So, AutoCAD.

### BIM Coordinator programs

**26:43** · What did I say? AutoCAD, right? It's 2D software. I don't know um AutoCAD I don't know AutoCAD because I need it for my job. I have to learn it because other people in industry are still stuck in 2011. So, what I do with AutoCAD personally is I do CAD overlays.

**26:57** · Sometimes, contractors like electrical and fire are still transitioning into 3D cuz it's still 2024. They're still transitioning. It will be fully transitioned in a couple of years, I believe. But like some people are still using it.

**27:08** · I actually haven't seen this happen this year at all. This happened last year, but not this year. Because of this, we might have to do overlays in order to see problem areas and then do a manual clash detection by checking how far from underneath the slab the cable tray or pipework is when clashing. So, I'll give you an example, right? So like this is this is this is an example of things that I used to do. Like you would go on AutoCAD and then you would create an overlay. So like you'll see all these different services over here. You'd have to do it one by one cuz I put this all together at the end. But like you do like an overlay of like mechanical and then hydraulics.

**27:40** · And then you'd see, "Okay, where is it clashing?" Like you try to zoom in and be like, "Okay, it's clashing over here." Then you'd put it you put a note here and say, "This is clashing with here."

**27:50** · In order to do this, you'd have to open the hydraulics models and then you'd have to see like how far away from the soffit is the hydraulics model. What's the slope? And then calculate when it's coming down and then see what is the height of the duct. And then okay, it's just nicking the end of that. So, we have to lower the duct or we have to So, it's it's a pain. But this is how some people used to do it when they were doing it in AutoCAD. This is why BIM 360 is so good is cuz we don't have to do any overlays like this in order to find area issues with problems. Like we don't have to use that anymore. We can see everything.

**28:18** · So, that is why we might need to use AutoCAD. Not because of you, but because of other people. Because other contractors like electrical people still use AutoCAD sometimes. Good thing that they're shifting over, but I see a lot of people still stuck in 2011 um and are still using AutoCAD. But that is you still need to know the skill of this.

**28:36** · Like overlaying on auto it's it's simple. Like just Google it, right?

**28:39** · YouTube. How to overlay on AutoCAD and then um and then just understand how to read basic drawings of hydraulics, find the slope, understand the basics of that, and then see how is it clashing, right?

**28:51** · Revit.

**28:52** · Well, you know how you know how to use Revit, right? We we model our own discipline in here and then we link all other files by the contractors and we just see it in like a 3D aspect what needs what sort of coordination needs to be done. We can do a rough coordination with this. So, usually if you're like a mechanical contractor, if you're a fire contractor, or hydraulics, or electrical, when you're modeling with Revit, you're modeling your own service, you want to make sure that you're at least missing structural steel and architectural elements, right? You need to be coordinating around those three. You don't want to be going through slabs.

**29:22** · You don't want to be um going through windows. You don't want to be going down dropping into walls that have windows, right? You want to make sure you are at least coordinating around the major things like electric like architectural, steel, structure, which are usually set in place. Like you don't can't really change them unless you need to really lower ceiling height because there is no other space. Because for example, a unit might be too big to fit in the ceiling. So, you have to lower the ceiling, right?

**29:49** · So, like when you're modeling Revit, um you can link in other projects like this. Like you can link it in. Like you know how to link projects in. And we all use this We do this on the cloud. We link it in, and then we can see everyone working on it in on like a live perspective. And this way we don't have to do any like overlays. Everything is done on Revit, and that's good, right?

**30:08** · You You already know this. But, what's the next program? Here, Bluebeam. You might have heard of this, but all Bluebeam is is it's a PDF viewer, but with way more functionality than any PDF viewer you have ever used in your entire life, okay? You're probably thinking like, "Oh, it's just a PDF viewer like Adobe. Like why is it even interesting?" But, I used to think the same thing, but wait till you actually start using this. Like you're probably thinking right now that PDF viewers don't matter.

**30:32** · But, with Bluebeam you can actually change your like versions or move revision clouds and change the color of certain elements and copy and paste images, easily remove images. It's a It's like a combination of AutoCAD, Revit, PDF editor, and Photoshop. Like it's like Photoshop all-in-one, okay?

**30:48** · And like it's not easy to to use this stuff um to do this stuff on like Adobe even. But, Bluebeam is so expensive because like $500 a year in order to have like one person. This is a PDF editor. But, it's not really a PDF editor. Like it's like Photoshop as well. So, like everything is in one. So, a lot of contractors like electrical contractors like to just use Bluebeam and just do all their work on Bluebeam.

**31:12** · And they like to like move their lights and do the lines. You can like do everything as if you have like a AutoCAD. Some like residential people like residential if you want to make drawings for like residential projects, they just use Bluebeam cuz they don't want to get AutoCAD and it's simple to use. You don't even have to learn AutoCAD. Like Bluebeam is very simple to use. Um and so that's also thing that happens.

**31:32** · But, the reason I use Bluebeam on a day-to-day basis is because I do a lot of overlays. Bluebeam does a lot of overlays very easily just like AutoCAD.

**31:39** · Um so, if you get a PDF, it's a PDF, right? You take the PDF, you can overlay it. You can reduce the opac- opacity so you can see like half of it and you can see underneath like your mechanical ductwork, and then you can see how everything's been coordinated.

**31:52** · Um you can put a cloud around something.

**31:54** · You can't really do that with a normal editor, right? Like it's it's harder.

**31:58** · So, the next thing is ACC or BIM 360.

**32:01** · You might be confused between the two, but they're both the same thing. Like BIM 360 is like um how do I explain this? It's like the Toyota um Toyota Camry, and then ACC is like the Toyota Aurion, okay? Cuz like the Aurion is like the better version of the Camry, but essentially they look the same, they feel the same.

**32:19** · Like the Aurion is just like a better engine, and then the Camry is just like a bit of like a lower performing engine, right? But, that's a difference. Like they look exactly the same, they do similar things, but Autodesk Construction Cloud is just this on BIM 360 on steroids cuz it has more functionality in terms of um they've added some additional things that you can do more design collaboration sort of things with it, right? Like it It can It's like it's got auto specs. You can like automatically scan a like a report, and then it like breaks it down into its own like funk- like categories.

**32:49** · And then if you add another report with a different version, it'll like do the comparison and show you exactly where it's done the done the done the changes on the report so you don't have to check both reports and see, right? So, it's like that. And it's all stored in the cloud. Things like that. It's like auto specs. That's what That's what it's called. And things like that. It's like using AI integrating with BIM 3- like Autodesk Construction Cloud. And so, when I say ACC, this is what I mean.

**33:15** · BIM 360 is the old version, ACC is the new version, but it looks very identical and they do a lot of the same thing.

**33:21** · Like bread and butter. You can get away with using BIM 360, but ACC is the newer version.

**33:26** · Um so like if I want to update my model on Revit, the reason all other consultants can see my big model being updated once they reload their model is because the model is being worked on the cloud. So, like instead of working on it locally, you're actually making sure that you upload this model onto the ACC, and then you're working off it on the ACC.

**33:45** · So, I can use this in order to run a clash detection. This way I can make sure that I'm using the latest models because they are always linked on the cloud. I can use the ACC in order to manage the way the models are released to each each of the stakeholders. I can give permissions to specific people to get access to specific models based on their authority within the project. So, like if I want to give permission to um the I want to give permission to the electrical guy to not be able to see any of the architectural models until I publish it, then they can't see any of the work-in-progress models.

**34:17** · And they only see it once I click a button clicking publish, then it goes into the published model, and then I can create a package, and then oh, now the Now the electrical guy and the mechanical guy and the MEP guy can see it, right? But, when I was changing the models, I was changing all the Let's just say I wanted to change 100 doors to something else, and it took a long time. Um and I had to change the walkway and the re- reduce the ceiling heights.

**34:40** · Might take 3 days of modeling for one person, right? So, instead of just doing it live and synchronizing it each day, you just do it, synchronize it each day. You can save it locally or like on the ACC, and then once you're done, publish it to the cloud, and then you can you can When you publish it, it goes into a shared folder, and now the MEP people can see it, okay? So, like you have different levels of access that you set up that allow specific people to see specific models at specific times, right? This is why ACC is so good. It's cuz you don't have to share it when you just do the thing.

**35:13** · You can share it when Otherwise, like what will happen is the MEP guy will take your model when you do 1 day of work and say, "I already used your model to do like to coordinate around my electrical cable trays. Like why is it changing every 3 days?" And it's because you were doing a work in progress. So, only when you are done, you publish, then they see it. Then they can take it and accept it. But, this can all happen on the ACC. Like this is an example, right? So, like go Start a trial account on the ACC, and then um and then just play around with it, upload a model, uh try to do a coordination.

**35:44** · And uh yeah, this is This is what I do with all my students that go through my program. I give you a a model you can uh we work together on doing a whole coordination, the clash detection. Uh I show you how to set up the proper permissions and design collaboration and project coordination.

**35:59** · We walk through everything, and so like you're pretty much an expert, and you would have done an actual project on the ACC uh by the end of that whole entire working with me one-on-one, right?

**36:09** · And this is why I get such good results and why all a lot of people that work with me actually able to move into coordination very quickly is because they have experience in the industry.

**36:17** · They come to me, they learn this thing.

**36:19** · We work together, they do something real, which is like I give them a real project, and they work through it for a couple of months with me, and I explain to them each week exactly what it is what's what it's going to be like, what you have to look for, how to do all this coordination stuff. And then by the end of the day like by the end of the program, they're so confident that they can get a job because their skills have unlocked, right?

**36:40** · So, Navisworks. The reason I have this on the list is because you probably would have questioned if I didn't have this on the list, but Navisworks isn't actually that useful if you're going to use ACC, honestly. Like there's a thing there's collaboration and coordination, right? Navisworks does coordination, but it doesn't do collaboration. What do I mean by that? Navisworks doesn't go on the cloud, right? ACC is on the cloud.

**37:01** · You can You can add members into the ACC, right? You can add roles, and you can put all your You can create a project, and you can You can't You don't have this with Navisworks. With Navisworks, it's locally on your computer.

**37:13** · You have to take the models. You do it locally. You can create views. You can do the coordination same as ACC, right?

**37:19** · Might even slightly be more user-friendly and better. But, you can't you can't do it and assign clashes to other people and it sends emails to other people, and then everyone can see it, and then it can automatically just doesn't integrate together, right? You know what the difference is? It's the difference between What am I doing right now? I'm using Google Docs in order to do a presentation for you. But, back in the day, do you remember how this was done?

**37:43** · I would have done like a Google um like a the Google like Word Word document on your computer, which is local like a local file. You'd have to save it every 5 seconds, right? But, now this is Google Docs. You can share this.

**37:57** · You can create a shareable link. I actually shared this to everyone on my Instagram. So, you can If you follow me on Instagram, you send me a message and ask me for any document, I can actually share you all the documents depending on which one you want. But, I asked everyone on my story like, "Do you want this shared to you?" And they said, "Yeah." And I just send them the link here, right? Like it's easier. And then like as I update this, they can automatically see get updated, right?

**38:18** · And they can see me when I'm like highlighting things and I update things.

**38:21** · So, like with That's the same thing with the ACC is what I'm trying to tell you.

**38:25** · You don't want to use like Word documents, you want to use Google Docs.

**38:28** · So, that's the difference.

**38:30** · So, what are the types of coordination that you would need to do learn as a coordinator? So, we talked about like different programs, and then we talked about like what coordination is, and I sort of started to uh sort of tease or about what it is, but here is like a real Here are real world examples because you know what Revit is, you know what ACC is, you know what Navisworks is. So, you know what Bluebeam is. So, let's talk about it, right?

### Examples of BIM Coordination

**38:53** · So, services coordination. This is probably what you know uh coordination to be. Like services coordination is for example, if you have a slab over here, you can see this ductwork is not going to go through the slab, but it's going to go underneath it, right? You know this pipework is not going to hit the duct, it's going to go underneath it. You can see this big pipe over here, which is a siphonics pipe, which is high pressure drainage. It's going underneath There's like a There's a transition over here. It's going underneath that duct and then going through it to outside the building, okay?

**39:20** · Look at this. Duct is going underneath, siphonics is going underneath the duct, and then these pipes are going underneath there, right? This pipe is going above the siphonics, and then it's it's attaching into that pipe.

**39:31** · That's coordination. This is another thing coordination. Like this duct has to drop down, and this ceiling has to drop below that, and then you have this hydraulics point because there's a toilet above here. So, that hydraulics point has to go down here. It has to do that U, cuz that's how that's how it works with sewer sewer, right? And then it does the U, and then below that U is where you have the duct. That's why you have to move this duct down, cuz if you have this duct going straight, it would clash with this, right?

**39:56** · So, wherever you do that U, and you can't move this pipe because it's going up into the toilet because the architect has designed the toilet to be there, right?

**40:04** · So, then you drop down, and then you have this whole you have this whole area over here. And then that ceiling space has to drop just below this. And so, we have to lower the ceiling in this area because the hydraulics dictated where the mechanical went, and then the mechanical dictated where the ceiling had to be lowered to. So, things like that, right? So, what we use for here is Revit. We model this on Revit. We link everything in, and then we use the ACC.

**40:28** · In this case, we actually use a different program called Revit Structure, but you don't need to learn it. Like it was it was because it was um recommended by the the BIM coordinator for that project. It's like an external BIM consultancy, so I didn't really do it. But, um I did the mechanical BIM coordination for that. But, if I was to do the BIM coordination, which I have in the past, I use ACC or the BIM 360, right? Uh because it's I I like using that cuz everyone usually has accounts on that.

**40:54** · So, ACC, the way that we would do that is we would flag these as clashes if they were clashing, and then we can we can assign these, and we can go underneath. Um and sort this out, right? So, this is services coordination. We do it on Revit. We sync it to the ACC. We do the model, and we see if there's any clashes, and then we can resolve them, right?

**41:15** · So, this is how it would look like in the ACC. Like if you make this bigger, you can see that this is like the clash detection. You have like the primary model coordination electrical contractor. Clash with mech uh contractor.

**41:29** · So, then what you do is you do like the primary model and the secondary model, and then you click run coordination, and you'd see like in green and in red what are the coord- what are the clashes that you see between every single like element. And you can click and you can zoom in, and you can see what the clashes are. You can assign them. These are all the clashes that get listed out.

**41:48** · You can select them, and you can assign them, right?

**41:55** · So, louvre facade coordination. This is with Revit, and you can do it with the ACC or the or Bluebeam, right? You can look The reason I say Bluebeam is because you can actually do coordination just by looking at the 2D drawings of the architectural drawings and see like where are the louvres, where where's the where's the facade, what's the facade drawing going to be like. Then you can overlay your mechanical um your mechanical elevations onto that, and you can see do an overlay and see like where is all like the plan view, and you can see okay, where is the duct going out of the building, and then you can see how it looks aesthetically.

**42:27** · That's how you do it old school with Bluebeam.

**42:30** · But, um when you're using like Revit, you model it, and then you can use the ACC in order to see the clash. This is an example of like a badly coordinated louvre. So, like you can see the louvre here. You can see the louvre here. It's not really in line with anything. This is underneath some sort of architectural element. You'd want this louvre to be over here, and you'd want this louvre to be over here. So, it's in line with this, and it's in line with this. But, it wasn't like that because um it was not designed properly. So, the mechanical contractor eventually has to just go off the design, and they place it like this, and then it's set in stone, right? And there's also limitations with the units.

**43:01** · Um the mechanical unit like air conditioning units might not be able to be upsized based on if you're adding a lot of bends, it increases the unit size, you have to lower ceilings, all these issues come into play, right? So, that's not something that you really have to deal with it as a coordinator.

**43:17** · You just need to understand how to point these things out and how to look at these things um when you're when you're doing coordination because uh when you bring these things up is when they get resolved. Otherwise, they go unnoticed, right?

**43:29** · You can see the louvre is not in line with anything on the facade. Ideally, we want to see the louvre underneath the window and aligned correctly. The green and orange louvres do not look nice and seem as if they're in random places.

**43:39** · There's no logic to this. So, like mechanical contractors don't really care.

**43:43** · Um the What is it? The builder? Like the build- the construction company doesn't really care about the architect's going to care about this, right? So, that you want to make sure that you're making an architect happy by coordinating this properly.

**43:54** · So, this is this is a good example.

**43:56** · See Do you see here how like okay, there's like a as an entrance here, then you have the louvre, which is the same size, and it's on top of that, and you have like another window or entrance here, and you have a louvre, which is like over here, right? This is a good example that was coordinated properly.

**44:08** · This is a bad example cuz it doesn't make any sense. It should be aligned here. And then this is another good example. Like this is these are actually fake louvres. Like the only exhaust So, this is exhaust. This is air coming out of the building. This is green is intake. This is air going into the building. So, like you will have you will have like a exhaust duct over here, and you'll have an intake duct over here and here, but what they did, the architect wanted a louvre across the whole face and a louvre across the whole face as like a it's it's like fake, right? It's fake.

**44:38** · Because you have this fake louvre, and then you have like over here, and you have over here the intake, and you have over here, and you have over here the the the exhaust. And so, it's fake, but it makes sense. Like when you look at the building and when this is this is where the car park is. Like the car will come and park here. The car will come and park here. You'll see okay, that looks that it looks sensible. Like on this side, it's symmetrical. Like it just needs to be symmetrical. And so, you can put in fake louvres from an architectural perspective in order to make something look nice. And this is another issue. There's a condenser unit over here.

**45:09** · The architect wanted it to be on top of the the ceiling over here, so you can't see it. But, like coordination, things like that, right?

**45:15** · So, those are two good examples. So, like looking at this and comparing it to this, you'll probably understand these are the small things that you probably need to keep in mind um when you're when you're doing things like this, right? So, let's talk about plant room access coordination. I'm losing my voice. It's crazy. Plant room cuz I I yell on these videos. So, um cuz I get passionate. So, and then I get to the end, and now I can't really finish it.

**45:37** · But, I'm going to keep going. Plant room access coordination. You can do this with Revit and the Autodesk Construction Cloud. So, a plant room is an area where you have a lot of the equipment of the project, right? It's a dedicated area for all of this like I talked about at the start of the video. But, what are the So, like this is an example of a plant room. Like you're walking in here, and you have you have equipment on the side, you have equipment on the floor, you have ductwork above. But, you want to make sure that you can come in through the entrance, and you can walk through here, and then you can get to the other side, and you can exit. This red thing over here is the door.

**46:07** · So, you can exit out of that door, and then and then walk off, right?

**46:11** · Plant room access is big because as you're walking through here, you want to make sure you're not hitting your head on any of these things. So, with things like BIM 360, what you can actually do is you can measure you there's like measure tools which you can measure the height from here to here, and you can see like is it 2100 above, and is there anything which is below? Is there anything that has a risk of us bumping our heads when we're walking through it?

**46:31** · And if there is, you you can't have it.

**46:33** · So, the reason that this for example, this is a fan coil unit, which is a mechanical unit like uh like a air conditioning unit that supplies air, right? The reason it's on the floor, this is not typically on the floor all the time. They're usually hung up in the ceiling so we can actually walk around. But, the reason it was on the floor is because there was no space in the like above here because all the ductwork was modeled, and then the unit was actually over here, but there was no space. So, this this pipework had to go underneath the unit, and then we were below 2100.

**47:04** · We were like 1900. We were like 1.8 m, and that's a that's a hazard. You have to put signs up, and you have to block the area off. You can't have that. And the client wasn't happy. So, what what we had to do was we had to say okay, we can put it on the floor, okay? That's fine to put it on the floor. And the reason for that is you might be thinking okay, we can't actually put it on the floor because it's above below 2100.

**47:26** · Like you told me the rule was like you has to be above 2100. The reason you can put it on the floor is because you're not There's no hazard of you hitting your head here because you don't walk under it. So, you have to think when can I walk underneath something and when can I hit my head?

**47:41** · You might be thinking this pipe, like can't you hit your head? No, because there's no need to go over here. This is against a wall. So, against a wall, you can have things which are which are low, and you can break that rule. That's completely fine because you're not walking through this, and it's better to be like way below like at hip height rather than being at 1800. Cuz at 1800, you can hit your head. But, when it's at hip height, you're not going to like do a limbo underneath there and try to get down, right? So, it's better for it to be really low against the wall so that there's no way you're going to hit your head on this.

**48:08** · It's like a toddler walking in the plant room, which would never happen. They would never be able to get in. So, that's another example. Like this is on the floor. Everything is fine. You're not hitting your head anywhere.

**48:19** · Um this is another example.

**48:22** · Like you might be These three ducts, it was going this way, this way, and this way. It was going on the ceiling. But, the thing was since they had to be below these red ducts, these red ducts are already at 2100. These blue ducts, they're coming from this big unit which supplies air. There was three of them.

**48:37** · It was going like this. And this is already 2100, so it was like 1600, 1.6 m. That's like shorter than me. So, like you'll hit your face, right? Or like someone that's shorter, 5 ft something, they'll hit their face. There's a guy here, anonymous girl. This is one of the people that I sent my PDF to.

**48:53** · But, anyway, so you have these um this cuz this is a live Google Doc, so people can come and watch when I'm recording this. So, you have you have these ducts. And what we did was as a coordinator as as the coordination process goes, you can make that duct go along the wall here, right? And then when it goes along the wall here, it can be below 2100 because again, like remember up here.

**49:18** · When it's along the wall, you can be below 2100 cuz you're not really walking underneath that. So, what we did was okay, we said okay, we can't walk underneath here, but we made a ductwork wall where like no one could walk through here, and there's no reason to hit your head cuz you don't need to walk underneath anything. So, understanding like there's there's there's rules that you can say in the IOS 1950 like things

**49:37** · have to be below 2100, but they're not going to come up with creative solutions like this or like this when it's like against the wall or like this where you're like, okay, this makes sense that we did it like that because we used our brain and we understood that okay, if there's no other solution, we have to be creative and create a ductwork wall where you're not going to hit your head. You won't really understand that type of stuff until you go and put yourself in a scenario where that type of thing needs to happen, okay? So, again, uh I just explained what happened everywhere.

**50:04** · So, again, with BIM 360, you can actually you can check what the the height is of a of a wall. So, this is 2.3 or like a duct from the bottom, 2.3 m, right?

**50:16** · You have a measure tool.

**50:20** · Reflected ceiling plan coordination, what's that? This is like we use Revit and Bluebeam or AutoCAD and Bluebeam.

**50:25** · So, this is like a 2D coordination. So, there's two ways. A reflected ceiling plan is pretty much when you stand inside a building and when you look up at the ceiling, what are all the elements inside the building, right? So, when you look at all the elements in the building, like you might have a light there, you might have a like a diffuser there, you want to make sure when you're doing uh RCP coordination, none of them are clashing on top of each other. So, sometimes the architect does this, sometimes the mechanical contractor does this, sometimes the BIM coordinator does this, right? It really depends on who's got the like which what's the scope, like which company decided to do it.

**51:00** · So, you'll have to do it if you're a BIM coordinator and the the way that you can do it is you can do it through BIM 360.

**51:05** · Like you can see okay, there's lights here, there's diffusers here, this is mechanical versus electrical, there's clashes here, this is an RCP clash. You can you can issue that as a clash on BIM 360 and you can resolve things like that, right? That's one way. The second way is you can do it this is what I did yesterday, you can do it on Bluebeam.

**51:23** · So, this is again a 2D way, but this is actually one of the only reasons this is one of the only times where I won't get annoyed at doing 2D coordination because RCP doesn't have a depth to it, it only has it's only on a 2D plane. So, as long as things are not on top of each other, you can see that on 2D, it's fine, but with like 3D coordination is harder. So, RCP is fine cuz you're just making sure elements have their own positions in the ceiling. Does that make sense? So, if you have like you can do an overlay like you did here, right?

**51:52** · And then you can print out the overlay and then you can do like you can put clouds here and you can say okay, fire needs to move this, dry fire needs to move this, mechanical needs to move this, hydraulics needs to move this and you can this is using Bluebeam, you can create notes and you can send it to everyone and then they do their thing, right? And they coordinate everything.

**52:09** · So, that is the process of doing RCP coordination either through BIM 360, which is honestly is ideal. You want to do everything through BIM 360, but it doesn't take any longer to do RCP coordination through Bluebeam. So, it's also possible. Precast panel coordination, so a lot of precast people do not use Revit, which is unfortunate because it's quite hard like it's not really that straightforward to do precast coordination and this can be messed up really quickly.

**52:34** · So, precast is just like concrete, which is cast in place on somewhere else on site and it gets brought to site and then um and then after that they like lift it and they hang it or like they put it where it needs to go. But you can see there's holes in it already.

**52:49** · There's a hole here, there's a hole here. It's called a penetration. So, for example, if you look at the 3D model over here for this project, you'll see that this duct is missing that hole, this duct is missing that hole, this duct is missing that hole. This hole's not even big enough. Or like and this duct is like on the edge here.

**53:03** · So, precast a detailer's precast is the concrete. They have certain structural elements to it. Like on the edge they have reinforced um steel members over here. They might have reinforced steel members in the center, on the other side. So, you can't actually put holes wherever you want to.

**53:18** · So, one thing is it's important to be able to model that on Revit and this is really easy. If you can model it on Revit with the correct holes, then you can see if the ductwork is actually going to match and fit inside the precast panels, right? A lot of times you can't actually fit um the ductwork inside the precast panels and then on site you have to remake the ductwork because you can't change a precast panel like after that's done. So, that's annoying. But the reason this happens is because you try to do 2D coordination.

**53:46** · So, what a lot of precast shop detailers try to do now is get into this 3D whole ACC and Revit space because they realize if we can coordinate it like this where you can clearly see look, there is a hole where the duct is not going, there's a hole where the duct is not going. This duct is on the corner over here where you have some sort of this green bit, right? And this is this might represent some sort of like structural element to it where you can't have any duct. You can easily see that and you can take photos of it, you can take screenshots and send it to people and you can coordinate easily.

**54:16** · But if you try to do with 2D, you try to do with Bluebeam, then you have to measure, you have to like calibrate your Bluebeam, you have to measure from the bottom to the top like where the where your the hole the penetration hole is and you have to do the penetration hole and then um you have to make sure the duct is finished. So much so much like back and forth and like understanding.

**54:35** · So, like since a lot of people and contractors are already using Revit, they're already using ACC, you want to make sure that you can make it's better, easier to get the precast person on board with using Revit and making sure that they're doing their precast panels on Revit so you can see very clearly if there's going to be coordination, it's easier for everyone.

**54:54** · Coordination is not an easy job because there's so many things that need to be coordinated that is inevitable that something always gets missed, right? So, in order to solve this problem, what you want to do is make sure there are multiple uh it is as easy as possible for everyone in the project to see as much of the coordination as possible so that issues are not only solved by you but by other people. So, the way we do that is by make using things like ACC and Revit because no one's going to sit there and double-check my work of checking if my if the hole for the precast that I drew on the mechanical drawing is perfect, right?

**55:27** · But if you should see it on 3D, you can see okay, straight away, you can just look at it and see. And so like that's why it's better to get everyone on board with like ACC and and Revit, but that's something that you might have to do.

**55:36** · Precast panel coordination is something you need to understand um how to do as well as a BIM coordinator. So, cuz you'll need like you'll need hydraulics going pipes through the precast, you'll need electrical cable trays sometimes going through precast, you'll need ductwork, which is mostly going through precast, all these types of things, right?

**55:54** · Structural steel model coordination with services so in the ceiling space. So, you might see that you have like these steel members which are going through this like this ductwork and you might see look at this, this cross cross bracing is actually hitting that ductwork. So, this is not going to work on site. This cross bracing is going through that ductwork. And like when I contacted them about this, they said that this was actually a mistake in the model, you don't actually have this cross bracing. So then, that's good.

**56:15** · You have to tell them to get rid of that cross bracing so that this a clash-free model and that no one is confused because this was an an initial design intent and that remaining on that model means that that still might be going ahead, right? And so if the wrong person gets the wrong information on site, they install the completely wrong thing. So, cuz they go off drawings, they don't they don't know about like what the design process was.

**56:43** · And so it's important to make sure that we don't have these things because if this is actually not there and this this steel um this steel design works without that cross bracing and someone on site gets the the drawings with this steel like looking like this, then it might be installed completely wrong and then you'll have to it's just wrong. So, you want to make sure that you pick things up like this and you can let people know so that nothing is clashing in terms of mechanical and then steel.

**57:13** · And so, yeah, this is another example in in a hospital this happened yesterday where you have for an X-ray machine, there is some there is some steel which is in the ceiling space. And the way this works is you have the structural steel model and you have the steel model, two different types of models, right? The structural model has like the design, like this is how everything the steel is meant to look like. And then the steel model has like the final design, this is what it's actually going to look like. It's like you know how you have the design phase and the construction phase.

**57:42** · In the design phase, the structural person puts the steel in. In the construction phase, the steel person, the steel detailer, that's what we call them, put creates a steel model. And so that's why you see this this very this maroon color is the steel the structural person's model and this light red color that looks like an apple is the like a red candy thing looks is the steel detailer's model. As you can see, that steel detailer's model steel is actually going through the ductwork, one, two, three, four, five clashes. It's not going to work there.

**58:14** · But the reason for that was because when the duct was initially installed here and was initially coordinated, it was coordinated with the the wrong red thing, like the the maroon red thing, right? The reason for that is because this the very bright red steel wasn't in the model by then, okay? It was not there because they hadn't finalized the design. So later, the duct was finalized, they did the the structural coordination over here, right? With the structural steel model.

**58:42** · And then when the steel actual steel model gets placed inside the inside BIM 360 and we synchronize it, we see okay, there's a clash. And then on site, there's a clash. And then so what we have to do is we have to delete this duct piece, you have to go on site, you have to remodel it. You have to get someone from site to remove that duct piece, you have to put a transition here and make that duct go like this.

**59:02** · Uh this diffuser is like sitting in between this steel member and this steel member, so you have to like make it smaller, you have to add an extra diffuser in the middle over here.

**59:11** · There's a lot of things that need to happen, but the reason for that is because the correct model like the steel detailer's model wasn't finalized and given at the correct time before the like mechanical and electrical trays were finalized. And because it wasn't given at the correct time and it was given later after everything was finalized, a clash finally showed up, right? Because when it was initially coordinated, it was coordinated around this dark red, not this bright red. This bright red came in later. This bright red came in later and then there's a clash, but then it's too late by then because this duct was manufactured, it gets sent to a factory.

**59:44** · Okay, this is the duct layout. Go to the factory, they do all the duct thing and then like they they create all the duct and they take it to site. So, there's always these these issues, right?

**59:54** · So, here's my secret bonus tip which will allow you to grow in your career quicker than you can ever imagine. So, this is what this is what I want to talk to you at the end. Here is how to leverage your identity to grow in your career. So, a lot of people seem to get stuck in a certain position for longer than they need to and they feel stagnant, but they don't know if they could be in a better position or they don't know if they can even go to another position which is better, okay? So, first of all, I was I was talking about a lot I was lecturing you about like duct work and like MEP coordination and stuff. So, get out of that.

### Key to growth

**1:00:24** · Let's talk about your career again, okay? Let's talk about your career.

**1:00:28** · The reason that you can't grow in your career and do all of these things which I talked about over here because this is pretty interesting, right? You probably really want to be part of this, but the reason that you can't really be part of this and you haven't had the opportunity and you do this boring Revit modeling is because of your identity, okay? This is like the psychological principle that I'm I said I was going to tie together.

**1:00:48** · The reason that you have this conflict in your mind about you deserve your current role, but then you also deserve better role and you want to grow, but you can't grow is because you haven't really formed your identity in the direction which will take you in your career take your career forward.

**1:01:01** · So, your your skills this is how it works, right? You you you learn skills.

**1:01:06** · Number one, forms your identity, your identity starts to change, you see opportunities, you take the opportunities. Your identity gets reinforced more and more.

**1:01:16** · You become a coordinator and then you get into management, right? If you don't reinforce What's but the thing is it's like compound interest. Like everyone talks about compound interest is the eighth wonder of the world and like $1 now is going to be a million I don't know what it is. If you added a If you added a dollar to your investment and by the time you're 50, you'll be a billionaire or whatever.

**1:01:34** · Like the the way that works is what is the snowball effect? It's the small step that you take at the start. If you had $0 at the start, it wouldn't be anything. So, what's the $1 at the start is your skills. Once you and it's actually not $1, it's a lot of money at the start because skills is what develops you as a person and actually gives you it's it's a lot more worth than $1. But, what I'm trying to tell you here is 0 \* 1,000,000 is 0. 1 \* 1,000,000 is 1,000,000. So, learn the skills so you have something and then everything takes care of itself. I've never seen it not take care of itself, right? So, if you learn the skills, right?

**1:02:07** · Then what happens is you your identity start shifting because if you go to a you're a BIM coordinator right now. I made this in a in a previous video, but let's go through it, right?

**1:02:16** · Right now, you're a Revit modeler. You want to get into BIM coordination, but you have three blockages. When you go to a BIM coordinator or like management interview, they ask you, "Do you know how to set up ACC?" You say, "No." "Do you know how to do clash detection?" You say, "No." "Do you understand MEP?" You say, "No."

**1:02:31** · Okay, you don't know anything. How are you going to get into BIM coordination or management? And then you're going to go back into your normal job as a modeler or draftsperson and then you're going to work there for another year and you're going to do this thing again, but you're not learning you you can't learn these things until you get to here. So, it's like what's the chicken and the egg story, right? Like what comes first? What comes first is in this case, there actually is a solution is you learn the skills because the only way you're going to say yes to this and even have a chance is if you learn the skills and you've done for example this is why a lot of people that work with me are able to break from break into coordination.

**1:03:03** · And and BIM coordination and management from modeling. It's because they can say yes to these three questions. When you do a project on the ACC, you learn how to coordinate, right? You learn everything which I just outlined in this whole video in depth with me one-on-one for months, right? And then we go through the ACC. I I tell you how to set everything up and then I walk you through the interview process. We walk through like you apply for jobs, you get on calls with me, I show you exactly how to apply for jobs and we refine the process, we track everything.

**1:03:34** · This is the reason why you're able to go from here to here is because you have guidance and you have the confidence because you are confident by the end of that when you finish working with me one-on-one that you know everything that I know about coordination. And even if you don't, you will know like when you start working, you can always text me and ask me questions and I can be solve the problems, right? So, that is why you're able to go from here to here and that's why a lot of people that work with me are able to succeed pretty much everyone into getting into that role is because it starts with your skills.

**1:04:04** · When you learn your skills, your identity shifts, you can get put into positions where this is an opportunity.

**1:04:11** · In order to take maximum advantage of this opportunity, you need to be you need to be able to say yes to all these three questions. Do you know how to coordinate? Yes. Do you know how to set up a project in BIM 360? Yes. Do you know MEP basics? Yes. Okay. What now?

**1:04:24** · Well, I guess you have the job now because you have you have like seven years of experience in the industry and you said you know how to coordinate.

**1:04:30** · Well, now you be a BIM coordinator and then you become BIM coordinator, right?

**1:04:33** · And so, the idea behind no experience was true when you did have no experience about anything, but now you're in the industry and you actually do have experience, right? And so, what's holding you back is skill, not experience because at the start, yes, the industry was completely different to you because you didn't you've never worked in the industry, you didn't really know anything. You can still you can like it's still not it's not a valid excuse.

**1:04:56** · But once you get into the industry and you have like five, six, seven years of experience, in order to get into coordination now, it's very simple, you just need to learn the skills.

**1:05:03** · And your experience is going to do a lot of the heavy lifting and your skill is going to allow you to take get to the next stage, right? That is the difference.

**1:05:10** · And so, being able to learn these things is what is going to allow you to excel and and succeed in your career and the whole point of this trick or like this mental thing which I always talk about is your identity is like you learn the skills first and your identity lags. You have to wait till your identity catches up to your evidence. And so, the first thing you need to do is learn the skill, set up a project on BIM 360 or ACC, do the coordination, learn how to do it, learn the MEP basics. Pretty much that's the whole point of this document, right?

**1:05:39** · Is trying to shift your identity by like now you know what what it is to coordinate everything. You just need to go more in depth on these specific things and do it so you have the confidence and then you can start working, right? So, that is the whole point of this and then once you do that, learn the skills, your identity lags. As you learn the skills, you can start to apply it as positions and opportunities rise in your company.

**1:06:01** · When you start to apply it, then you can be like, "Okay, I've actually applied it now to this company. Maybe I'll go and work at another company as a coordinator or like a manager." Then you go into that company as a manager, then you then you start as a manager you you talk to the as a BIM coordinator you talk to the project manager.

**1:06:16** · So, now By the way, you can do all this in one company if you have a really good company. They they should be able to teach you everything, but a lot of a lot of us don't. So, what you have to do is then you go into another company and then you start working as a coordinator and you and you start talking to the project manager a lot cuz a coordinator is always in contact with the project manager. Then you start learning project management, right? Then you start learning project management and then you can get to that stage and then you can you can quickly six months, one year, six months, one you you can get there very quickly, right? And so, that's how you become the youngest person that knows how to do the the most things and is the most useful in the company.

**1:06:48** · So, that's what I wanted to talk about in this video. It's quite a long video. I didn't expect it to be this long, but I I got to the end of it. My voice is very gone, but if you're interested in working with me one-on-one, um I will explain to you this whole BIM coordination blueprints. Book a call with me down below and we will see if you're suitable to work with me. We'll go through your we'll go through a game plan to get you to where you need to go to and then we'll start working together. I will teach you everything in this whole document in depth over a span of months.

**1:07:20** · You will learn everything you need to know. I will give you a project so you can set it up. I'll show you projects which I've worked on at work so you have more understanding and pretty much everything that I know in my mind will be transferred to you within the span of a few months and then I'll walk with you through through applying to jobs and then you will get the outcome and then you'll become BIM BIM coordinator, right? That's my offer to you. If you made it to the end of the video, that's what I wanted to tell you. Good luck. Um Stay safe. Keep learning.