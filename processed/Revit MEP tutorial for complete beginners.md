---
title: "Revit MEP tutorial for complete beginners"
source: "https://www.youtube.com/watch?v=gO0tjfUKDPU"
author:
  - "[[SourceCAD]]"
published: 2024-06-23
created: 2026-06-14
description: "Signup for the free Revit MEP course here https://sourcecad.com/courses/revit-mep-essentials-for-beginners/In this video, you will learn all about Revit MEP ..."
tags:
  - "clippings"
---

> [!tip] Civly Relevance — **HIGH**
> Direct MEP development reference. Shows the exact mental model Revit MEP engineers use across all five disciplines in one project. The zone-first approach (restroom core as a bounded scope), five-discipline linking pattern, and clash workflows (structural steel in plenum, duct vs plumbing U-bends) are all concrete Civly product requirements. MEP is in active development — every section below is relevant.

## Notes

### Setup — Five-Discipline Coordination Model (0:00–5:43)

- **Project structure:** five separate Revit files — architectural, structural, mechanical, electrical, plumbing — each worked independently, then linked into one blank coordination file
- **Linking:** Insert > Link Revit; always set positioning to **"Auto - Internal Origin to Internal Origin"** — this aligns all disciplines to a shared reference point automatically
- **Overlay mode:** when linking, Revit warns about nested links (e.g. the electrical file already has arch/structural linked inside it); overlay ignores those nested links — correct behaviour, prevents double-loading
- **Coordination file:** holds all five links in one view for clash checking and visualisation; actual modelling happens inside individual discipline files
- **Visibility cleanup:** turn off Annotation Categories in Visibility/Graphics Overrides → removes levels, section boxes, grids from 3D view, leaving only model geometry
- **Section Box:** cuts through the building to reveal internal conditions; note — section box is classified as an annotation, so if you've hidden all annotations you must specifically re-enable it in visibility settings
- **Project scope for this tutorial:** Level 2 restroom core (two mirror-image WCs) — a small, bounded MEP zone: HVAC fresh/stale air exchange, hot/cold domestic water, electrical (receptacles + lighting), sanitary drainage
- **Plenum space note:** structural steel is visible in the ceiling plenum above Level 2; all MEP services must route around it — this is the primary clash constraint the whole project works within

---

### Mechanical — HVAC (6:20–25:38)

**Working in the discipline file:**
- Open mechanical .rvt directly (already has arch + structural linked); do NOT model in the coordination file
- Level 2 starts blank; Level 1 has existing VAV + HRU from a prior course — use it as reference for what needs replicating

**HRU (Heat Recovery Unit) — purpose and layout:**
- Handles fresh-air intake and stale-air exhaust for the restroom zone; sized to the zone's CFM requirement
- Two sides of the unit: small connectors = outside air (intake + exhaust to exterior); large connectors = inside air (supply + return into the rooms)
- Colour coding in Revit: orange = supply air system; yellow = exhaust air system; HRU turns grey when connected to multiple systems (expected)

**Placing the HRU:**
- Systems tab > Mechanical Equipment > Heat Recovery Ventilator
- Hosting level: Level 2; elevation above floor: 9'6" (ceiling is 8'0", unit sits in the plenum above)
- Press Space Bar to rotate before placing; orient with small connectors toward the exterior wall
- After placement, HRU should sit in the plenum space between the two restrooms

**Routing exterior ducts (intake/exhaust):**
- Right-click connector > Draw Duct; duct inherits system colour
- Intake duct: runs straight to exterior wall
- Exhaust duct: must exit well away from intake to prevent re-ingestion; use Short Radius duct type → Revit inserts elbows automatically
- Routing preferences: Edit Type > Routing Preferences shows which duct accessories are auto-inserted for a given duct type

**Exterior air terminals (caps):**
- Face-based family — must be placed in an elevation view, not in plan
- Systems > Air Terminal > Supply Cap (4" diameter) > Place on Face > click exterior wall
- Modify > Align to centre cap on the duct centreline; then in plan view drag duct end to snap to cap (cap turns orange = logically connected)
- Repeat with Exhaust Cap on the exhaust duct

**Supply diffusers inside rooms:**
- Sizing rule: 1 CFM per square foot; 180 sqft room → 200 CFM
- Family: Rectangular Face, Round Neck, 24×24" face, 8" neck diameter (must match HRU connector)
- Place in plan on ceiling grid, hosted to architectural ceiling from the linked arch model
- Set flow rate in properties: 200 CFM; copy to second room
- Turn off directional arrows in properties (too cluttered)

**Connecting diffusers to HRU:**
- Revit enforces system logic: cannot connect supply duct to a return diffuser — system mismatch error
- Supply port of HRU → supply diffusers only; return port → return diffusers only
- Branch off main duct: select existing duct > "Create Similar" tool → creates a new segment of the same system/type/elevation from any point

**Return diffusers:**
- Face-based, 8'0" AFF; flow rate 200 CFM; copy to second room
- Connecting to a round duct automatically inserts a transition fitting (round → square neck)

**Duct pipe sizing and analysis:**
- Tab key while hovering over a duct: cycles through connected elements until the entire branch highlights → click to select all
- Analyze > Duct/Pipe Sizing > Equal Friction method → Revit resizes ducts to maintain uniform friction loss throughout
- Analyze > Show Disconnects (Duct): flags any unconnected duct ends as warning badges on screen

---

### Electrical (25:49–53:46)

**Two-voltage system (commercial, North America):**
- **208V system:** leg-to-leg 208V, leg-to-ground 120V → receptacles and general power
- **480V system:** leg-to-leg 480V, leg-to-ground 277V → commercial light fixtures (277V is standard for commercial lighting in North America)
- Two panels needed per floor:
  - **EP-2** (Power Panel 2): 208V, 225A, MCB (mini circuit breaker), surface-mounted
  - **LP-2** (Lighting Panel 2): 480V, 250A, MCB, surface-mounted
- Configure distribution systems in: Systems ribbon > Electrical Settings (tiny arrow) > Distribution Systems

**Panel placement:**
- Systems > Electrical > Electrical Equipment
- **Must use "Place on Vertical Face"** — "Place on Work Plane" places panel incorrectly (out of plane, appears huge and flat)
- Set level to L2; height 4'0" AFF; click wall face; assign names EP-2 and LP-2 in properties

**Callout view for electrical room:**
- View > Callout > drag around electrical room → creates enlarged plan view
- Revit defaults new callout views to "Architectural Plan" type → change to "Power Plan", rename to "L2 Power Plan Enlarged"
- Scale: 1/2" = 1'-0"

**GFCI receptacles:**
- Device > Electrical Fixture > Duplex Receptacle GFCI > Place on Vertical Face; elevation 1'6" AFF; 2 per restroom
- Create power circuit: select receptacle > Power button > assign to EP-2 > Connection Type: Breaker
- Edit Circuit > Add to Circuit: click second receptacle to group on same breaker > Finish
- View circuit: hover over receptacle + Tab key → shows circuit arc and dashed box around connected panel
- Add wire: click arc indicator after Tab-select → Add Arc Wires → home run arrow auto-generated toward EP-2
- Home run tick marks = hot conductor count; controlled in Electrical Options

**Light fixtures:**
- Family: 2×4 ft troffer, 2-lamp, 277V (matches 480V/277V distribution)
- Place on Face (ceiling); 8'0" AFF; Space Bar to rotate
- Must use MEP electrical lighting family — the architectural fixtures have no connectors; MEP fixtures are placed on top of arch fixture positions
- View range fix if L2 lighting plan is empty: edit View Range, set Top to Roof level (the mezzanine level is only 1' above, cutting the view off prematurely)

**Switches:**
- Device > Lighting Switch > Single Pole; Place on Vertical Face; position just inboard of door opening

**Wiring logic (two-step process):**
1. **Switch system:** select fixture > Switch System > select the switch > Edit Switch System > add all fixtures in the room > Finish; verify by Tab-selecting fixture → dashed lines radiate from switch
2. **Power circuit:** select fixture > Power > assign to LP-2 > Edit Circuit > add remaining fixtures AND the switch (switches are part of the power circuit) > Finish
- Add wire: Tab-select circuit > Add Arc Wires
- Home run can originate from the switch instead of the fixture: delete auto-generated wire, draw manual wire using Systems > Wire (3-click arc: start point, arc midpoint, arrowhead)
- Tag home runs: Annotate > Tag by Category > click wire → "Breaker X / LP-2" label

**Panel schedules:**
- Right-click panel in Project Browser > Create Panel Schedule → spreadsheet of all circuits, voltages, loads

---

### Plumbing — Hot and Cold Domestic Water (53:46–1:08:56)

**Fixture placement strategy:**
- Architectural model shows fixture locations (rendered grey) but lacks MEP connectors — cannot attach pipes to them
- Place MEP plumbing fixture families directly on top of arch fixture positions; MEP families have built-in pipe connectors (domestic hot, domestic cold, sanitary)
- Efficient shortcut: Copy Level 1 MEP fixtures to clipboard > Paste Aligned to Selected Levels (L2); verify in section view that they landed on the correct floor
- Urinals (if no MEP family available): add individual pipe connectors (cold + sanitary) to the arch family instead of replacing it

**Extending risers from Level 1:**
- L1 already has hot and cold water mains; extend to L2 by converting elbows to T-fittings
- Click the **+** symbol on an elbow to convert to a T; then draw new vertical pipe from the T
- Vertical pipes must be drawn in a section view (3D view cannot constrain pipe drawing to a vertical axis reliably)

**Pipe reference level issue:**
- Pipes drawn by extending from L1 elements may remain assigned to L1 as reference level even if physically on L2
- Fix: select new pipe segment > change Reference Level to L2 > set offset elevation (e.g. 2'0" above L2)
- Convention in this project: cold water at 1'10.5" AFF; hot water at 2'3" AFF (slightly higher to separate runs in cavity wall)

**Connect Into tool:**
- Select plumbing fixture > "Connect Into" button in ribbon > choose connector type (Domestic Hot Water or Cold Water) > click the main pipe
- Revit auto-routes the connecting stub; if auto-route causes a conflict (pipe runs through another pipe), it does not self-detect this
- Fix: before Connect Into, **Cap Open Ends** on the pipe stubs you want to limit routing toward — Revit then only routes in the remaining open direction
- Toilets: cold water only; sinks: both hot and cold

**Insulating hot water pipes:**
- Tab key to select entire hot water branch; use Filter to deselect plumbing equipment (keeps only pipes + fittings)
- Modify > Add Insulation > Fiberglass, 1" thickness
- If some already have insulation: choose "Continue Adding, replace existing"

**Verifying connections:**
- Analyze > Show Disconnects for Pipe: flags open pipe ends
- Micro-position variances may produce persistent warnings despite being graphically connected; acceptable to disregard if visual model is correct

---

### Plumbing — Sanitary and Vent (1:09:17–1:17:42)

**Copying from Level 1:**
- Window-select entire L1 sanitary + vent system > Copy to Clipboard > Paste Aligned to Selected Levels (L2)
- Resulting L2 view has all systems mixed together → separate into two callout views

**Creating separate plan views:**
- View > Callout around restroom area > right-click bubble > Go to View
- Change view type from "Architectural Plan" to "Plumbing Plan"; rename to "L2 Enlarged Domestic Water Plan"
- Visibility/Graphics Overrides > Filters tab: toggle pipe system visibility
  - Domestic water view: show domestic hot + cold; hide sanitary + vent
  - Sanitary view: duplicate the domestic water callout, rename to "L2 Enlarged Sanitary and Vent Plan", swap filters

**Vent routing:**
- Vent must go UP to roof — never down (sewage would drain into a downward vent)
- Route from L2 restroom vent stub → horizontal run through ceiling plenum → vertical up through elevator/stair chase → roof
- Horizontal run must be drawn in section view; use wireframe 3D to verify connections through walls
- Below-2100mm rule for vents: vent runs along walls where no walking occurs — acceptable; only centre-of-room routes need 2100mm headroom

**Micro-disconnect tolerance:**
- Copied piping sometimes has tiny positional variances that cannot be eliminated
- Acceptable to disregard if the model is graphically correct and the coordination intent is clear

---

### Interference Check (1:17:42–1:19:02)

- Collaborate > Interference Check > Run Interference Check
- Can check the model against itself (all categories) or against a linked model (e.g. mechanical vs structural)
- Results table: each clash is a row; click to zoom in; flag real clashes, disregard acceptable tolerances
- Insulation-to-insulation conflicts: usually acceptable (insulation compresses; minor overlaps tolerated in practice)
- In a real project: every line item must be reviewed and confirmed real or acceptable before sign-off
- Stale model issue: if structural steel model is updated after MEP is already fabricated, new clashes appear that cannot be resolved without on-site rework — timing of model updates is critical in real projects

![](https://www.youtube.com/watch?v=gO0tjfUKDPU)

## Transcript

### Introduction

**0:00** · Hello and welcome to SourceCAD. In this video, Scott Onstott will show you the step-by-step method of making a project in Revit MEP right from scratch. And in the process, you'll learn to use the software in a professional way. Now, this Revit MEP tutorial series is completely project-based, where you will start from basics of user interface and project basics. Then you learn about the heat and ventilation systems. Then you learn about electrical system, hot and cold plumbing, and then finally to wet and sanitary systems.

**0:30** · Now, essentially, in this one video, you'll learn all there is to get up and running with Revit MEP right from scratch. Now, if you want lesson files of this tutorial series and a certificate of completion, then sign up for the free Revit MEP Essentials course on SourceCAD, which is completely free, and you'll get a certificate when you finish the course.

**0:52** · The link is in the description of this video, and also in the first pinned comment. Now, let's get started.

**1:03** · So, here's the project one, which has nothing in it really except for the what comes with the template. And so, now I'm going to go to insert, link Revit, and I'm going to link all five of these disciplines into this model. And we can't do them all at the same time.

### Setting up models in Revit

**1:20** · We'll do them one by one. So, I'm going to link in the architectural, and the positioning is always going to be set to auto internal origin to internal origin.

**1:30** · This allows all of the different disciplines to line up. And so, let's take a look at this in 3D. I'll click on the house icon up here on the quick access toolbar, and I'll switch into shaded mode. And you can see here that we have this building, which was developed in the architecture course.

**1:48** · And I want to link in the different systems. So, I'll bring in the electrical, and of course, you wouldn't see any change here in the 3D view. And it says here the following nested links will not appear because their reference type is set to overlay in the link electrical.rvt.

**2:05** · That means that the electrical file has all of these other models linked into it. And when we're linking in the electrical in here, we don't want to bring those in again. And that's what overlay does for you. It ignores nested links. And that's exactly the behavior that we want. So, I'll just close that, and I'll go ahead and link the next model, which is mechanical. It's going to give us that same warning, and I can just close out of that. And I'm going to link in the plumbing. And this will form the basis of coordination model that has all of the disciplines in it.

**2:36** · I'm bringing in the structural as well.

**2:41** · Okay. So, now if I go to manage links, you can see that we have all five disciplines linked in here in this blank file really. But that Now that that's done, we can visualize everything together. And it's a little bit cluttered right now because we're seeing all these section boxes and levels and all this stuff that gets a little confusing. So, what I'd like to do is go into visibility graphics overrides here, and I'm going to go to annotation categories and uncheck that, so we don't see anything that isn't a model category.

**3:12** · We'll just say okay, and then we'll lose all of those distracting elements here. You can see from the mechanical discipline, we're seeing some rooftop equipment up here, the air handling unit and so on. I also in the MEP project that I want to do today, I'm not really interested in the topography of the site. So, I'm going to turn off the topo solid and the topography here, and anything that has to do with the site. I don't need to see that here.

**3:41** · Okay. Now, I can actually see the foundation of the building also. So, now in this 3D view, I'm going to check section box over here. This is a really powerful feature in Revit, and it allows you to select the building, and why am I not seeing the section box itself? Oh, I know why. It's because I've hidden all of the annotation, and a section box is actually considered to be a form of annotation.

**4:06** · So, I'm going to have to rethink this and take everything in here, shift select, and uncheck, and then specifically enable just the section box. There. Now, I can see it.

**4:20** · And I need to be able to see it to select it, and then I can use the grips to cut through the building. So, on the top, you have this penthouse auditorium.

**4:28** · We cut through, you can see the plenum space on level two, and this is where we're actually going to be starting our project. We're going to be concerned with the restrooms in the core in here.

**4:38** · This is an elevator, an electrical room.

**4:41** · If I cut down even lower, you'll see the layout of the spaces. We have a couple of washrooms here, and that's what we're going to focus on today. But this project was developed in the architecture course, and all the systems were added in the Revit MEP course. And today, we're just going to focus on this little mini project of servicing the the restrooms in the core. All right. Um if I go down deeper into the building, you can see into the plenum space on level one, we have a bunch of HVAC equipment.

**5:11** · If I go down even more, uh we can see into the systems room over here, where we have some mechanical equipment. We have a boiler, pump, hot water tank, and so on. All right. So, I want to leave this view in a in a state which will help me in this goal of working on level two. I'd like to cut through the building just below this floor on the roof, where I can see some of the structural steel that we're going to have to avoid. And I can also see into the plenum space around here. Okay, great.

**5:43** · So, now I'm going to save this file as a project, which I will call coordination. And this will be useful if we want to look at everything together.

**5:54** · But now, I'd like to work on the mechanical system in particular. So, I need to open the mechanical link by itself. And we can't open that at the same time that we're in this coordination model. So, I need to close out of everything, and then I want to open the mechanical Revit file. And this will have the architectural and the structural models already linked because the mechanical systems rely upon that.

**6:20** · And over here, we have mechanical as a discipline in the project browser. And if I look at L1 RCP mechanical, you can see the systems that we developed in the comprehensive course on level one. And this involves a variable air volume unit, a VAV unit, as well as a heat recovery unit. This is the HRU. I think what we're going to do on level two is put in an HRU to bring in fresh air and exhaust stale air out of those restrooms.

**6:51** · So, I want to create um a unit like this. And it is connected to an intake and an exhaust that go right outside the building. And then on the other side of the unit, it has supply and return duct that you can connect into the ceiling of the space you're interested in. So, that's my game plan.

**7:15** · Now, before I move further, I'd like to once again mention that this video series is available as a completely free course on SourceCAD, where you'll get all the lesson files used in this tutorial series along with certificate of completion when you finish the course 100%. Check the link in the description and first pinned comment to sign up for the free Revit MEP Essentials course.

**7:36** · Now, back to the video.

**7:38** · In the mechanical file, I'm going to open the level two reflected ceiling plan. And here we have kind of a blank slate. We have a couple of ducts over here that go up to the air handling unit, and otherwise, we don't have anything here. So, I need to zoom in on these two rooms, which are in the building core, and they're the two restrooms. And what I'd like to do now is bring in a heat recovery unit in here into the plenum space on level two.

### Placement of a heat recovery unit (HRU)

**8:03** · I'll go to the systems tab and click on mechanical equipment, and then choose the heat recovery ventilator unit here, the HRU, and make sure it's coming in on level two, and you need to specify the elevation above that floor level. So, I I'm not really sure exactly at this moment where it's going to be. Uh I know the ceiling is at 8 ft, so this could be at 9 ft or 10 ft. Let's Let's say it's 9 ft 6.

**8:32** · And when you're specifying imperial units, you can follow this convention, where you put a space between the numbers. So, the first number is feet, and the second number is inches. So, if I want to say 9 ft 6 in, all I have to do is type nine space six, and then I can place this in. But first, I I think I'd like to rotate this. I'll press the space bar, and I can rotate it. And I'll place that right here in the middle, like that. And if you notice, the HRU unit has different sized connectors on the left and the right.

**9:07** · And I have it oriented so that the smaller connectors are on the left. And if I click on this, you can see that we have different connectors on this piece of equipment. We have a power connection over here. We have smaller diameter in and out, and we have larger diameter in and out over here. So, the way that this is designed is that the um intake and the exhaust the to the outside world are using the smaller diameters.

**9:35** · And then the larger diameter ones over here are going to service our space. So, let's begin by creating a duct coming out of this unit. And we can do that in a couple of different ways here. I could click right on this symbol right here to create a duct, and that would just let me start drawing it. I'll press escape.

### Creating Ducts

**9:52** · Another way that we could do that would be to right click on this connector and say draw a duct. It accomplishes exactly the same thing. And if I draw this duct over here and click, it changes color because this particular duct is coming out of a connector and this connector says in. So, this duct is part of the supply air bringing air fresh air into the HRU.

**10:15** · And so, this the color of this system is controlled under a family and if you expand families over here, we can find it. Go down to duct systems, supply air, and then type properties. I can edit the graphic overrides and this is where it's getting this orange color from. You can change that if you like. Now, if I draw another duct coming out of here on the out, this is going to be a part of a different system, the exhaust air.

**10:48** · So, if I draw this over, that duct is yellow and that's because the exhaust air system is indeed yellow. But, observe that when I added my second duct, the HRU went back to gray because it's no longer just part of a single system. It's now connected to two different systems and so, it doesn't have a color. It just stays neutral.

**11:11** · Okay. Well, now our task is to connect these ducts to the outside world where we can get fresh air and exhaust stale air. So, what I could do is take this intake and just drag this connector all the way outside the building like that.

**11:25** · And then, we could do the same thing here but when you think it through, you don't really want the the exhaust air to be exhausted right next to the intake because it would just get sucked right back in the building, kind of defeating the purpose of it. So, what we want to do is give some space between these. So, I'm going to um right click on that and say draw a duct.

**11:49** · And when I do that, I want to make sure that I choose a type down here for the round duct that will give me a transition piece. And you have different choices about how you want to do that.

**11:58** · I'm going to use the tabs short radius and I'm going to feed this up here somewhere well away from the intake. And then I'll have it come over here and go outside the building like that. So, we have some short radius pieces put in automatically by this particular um type. And if you want to see that, you can go into edit type and then you can go into the routing preferences here and edit that and this is where you specify all of the different duct accessories that you want to use for this particular type.

**12:27** · And we don't need to change anything here but I just want to show you that to you. All right. Now, it's not enough just to stick this duct right outside the building. We need to cap it off with an air terminal and I know from experience that we can't add this type of air terminal in a reflected ceiling plan. The The air terminal that we want here is a face based family and it has to go on a wall. And so, I need to be able to see this wall. The best way to do that is to look at it the exterior elevation.

### Placement of air terminals

**12:59** · And that is available through the architectural discipline up here. There is a west elevation that we can use right here. I'll open that up and zoom in and you can just see that we have these colorful ducts sticking out of the building here.

**13:14** · So, I'm going to zoom in here and I want to place um a cap on this and this one is the supply air to the HRU. So, I need an air terminal. I'll click on systems, air terminal under HVAC and I'll open the type selector and go to the top of the list and I want to use the supply cap, 4-in diameter, place on face mode, and then click right on this wall.

**13:44** · And then go to modify and then the modify tab and use the align tool to align this to the center line of this duct. I'll click that little dot and then click right here and then click the little dot again and then click on the horizontal line. So, these are lined up and this is on the wall. So, if I go back to my level two mechanical ceiling plan, you can see it right down here.

**14:09** · It's in the right position. However, it's not connected and I can tell that because it's gray. If I take this duct and then drag it back and snap it there, this air terminal will turn the same color as the duct indicating that it's properly connected to this logical system. It's part of the supply air system now. Supply air and it says supply air up here. So, that's how you have to do this.

**14:37** · Now, let's go back to the elevation and locate the other duct which is just penetrating through the wall and I'll go back to systems, air terminal and I want the exhaust cap. I'll place that on the wall and then go to modify, align and align that in both directions.

**14:56** · Go back to the ceiling plan and pull this back and snap it there and this will turn yellow to indicate that it's connected correctly. So, now we have plenty of separation between these.

**15:09** · We're not going to have a feedback problem. And now we can turn our attention to servicing these spaces. So, over here we have these ports. We have out and we have in.

### Placement of supply diffusers

**15:20** · So, in is the supply and out is the return. We can see that with the symbology here, supply and return, the X. So, let's think about supplying air to the spaces. The first thing I'd like to know is approximately how big are these rooms because there's a rule of thumb which is to match the CFM, the cubic feet per minute, to the square footage of the space.

**15:44** · And that's what I'm going to use. So, I've selected the space and this space will tell me the area of that room. It's 180 square feet. So, we could have a supply air terminal that supplies 180 CFM. Maybe we'll round up and we'll call it 200 CFM. So, I'll go to systems, air terminal and now I need a supply diffuser. Here's one, rectangular face, round neck.

**16:15** · I'd like a 24 by 24-in, 8-in neck to match the diameter of the terminals on our HRU. And I'm going to bring this in and I'm going to place this supply diffuser on one of these grid squares. And what I like to do is connect it positively to at least one grid line like this.

**16:38** · And then go to modify select the object and move it from its corner to a grid intersection like that.

**16:46** · So, this here is a supply diffuser.

**16:50** · It's on level two and it's 8 ft above level two which is correct and it's hosted to the architectural model. So, it's hosted to that ceiling that the architect put in this room. However, I don't like the arrows on this thing.

**17:05** · They're overwhelming. So, we could turn those off like that. And then I'll take uh actually we want one in each room, don't we? And we know that we want this to have 200 CFM. So, what I need to do is select it and go right here and say the flow is 200 CFM.

**17:23** · And then I'll copy that over here like so. And if I drag the mouse, you can see the light fixtures are shown. And these were put in by the architect. So, these are the architectural light fixtures.

**17:36** · And I just want to be sure that I'm not placing my air terminals on top of any lights and I'm not. So, we're good. So, now I can go ahead and connect this connection on the HRU and I'll draw this over here like this and notice that as I bring this over, we see this inference line appear. I can click there and then I can click right on the uh center of that air terminal and it says the element you are trying to connect to has a different system classification. Okay.

### Connecting the supply diffusers

**18:06** · So, undo. Undo. So, when I drew this, it's showing me purple or magenta and that means it's part of the return air system.

**18:16** · These are um supposedly supply diffusers, not return diffusers and they're part of the supply air system. So, this highlights a very important point in Revit and that is Revit will not let you mix systems, thankfully. You have to um you know, connect to your supply air to your supply air terminals. And so, this is return air. It's this other duct over here that we want to connect and this one is our supply air. So, this is causing me to kind of rethink my strategy here because these are supply um diffusers.

**18:47** · I want to move them. I think it would be easier if I move these up to this part of the room and then I can take this supply duct and route it up there without having to cross over the return.

**19:02** · I'll draw a duct up and now we don't get a warning because it's it's satisfied that these are all part of the same system. Here I'd like to branch off of this duct right here and go over there.

**19:13** · And to do that, the most expedient way to accomplish that is to select an existing duct and use this tool right here which is create similar. And so, that means you're going to create a duct of the same system type at the same elevation of the same type. And I'll click here and I'll click up here and then click right on the air terminal.

**19:35** · Let's take a look at that now in 3D and make sure everything is as we imagine here in the reflected ceiling plan. I'll go into my working 3D view and just zoom in here and orbit around and take a closer look and make sure that it isn't, you you jumping up to some strange elevation. It looks good all around.

**19:54** · Looks like I'm missing all of that steel. I'm well below it. I don't see any problems here.

**20:00** · I guess one issue is that we don't want to have this right in the middle of this um partition.

**20:05** · This is a plumbing wall and so we can't have this here.

**20:09** · So, I'm going to go back into my level two and I'm going to hold down shift and press the left arrow. Just nudge this over out of the way.

**20:17** · So that we'll have these duct penetrations through this wall. But we want to minimize what we're cutting through here. Okay. All right. Now we want to do something similar on the other side but for the return diffusers.

### Placement of return diffusers

**20:29** · So I'll go to air terminal and I'll add some return diffusers if I can find them in my list. I have supply grills. Here's a return diffuser right here. This one is got a square um connection a 12 by 12. You know, that's not exactly what I want. I would like a return diffuser that has a round connection. I'm not seeing that in my current project. So um what I'd like to do is figure out what I did on level one.

**21:00** · I'll go to my level one plan and if I look in here this is rectangular. And are these ducts rectangular? Yes. That's interesting. So these are rectangular and they're connecting to this rectangular return.

**21:16** · So that's the same strategy that I guess I'll use. This here is return diffuser hosted work plane base. Okay.

**21:25** · So let's do the same thing. I'll go to air terminal return diffuser work plane based. What is the work plane? Place on work plane. Well, I don't really have a work plane that I'm aware of here. Yeah, I don't want to place it on level two because that would be on the floor.

**21:43** · I can try pick a plane. Okay. And then I can pick the plane of this grid line. In order to edit the sketch, please open one of the um orthogonal views. I don't want to do that. No.

**21:56** · Um pick a line and use the work plane it was sketched in. Okay, let's try that.

**22:01** · No, I don't even have any lines to pick.

**22:03** · I'm not satisfied with this particular air terminal. Let me try a different one.

**22:08** · Cancel. Air terminal level two.

**22:11** · I'm going to change that to return diffuser the face version. So I'm going to specify that is 8 ft above level two.

**22:20** · And now I can see it. I'll turn off the arrows. It's return air. And I'm going to place that right on this grid line.

**22:27** · Go to modify, select it, and move it over to a grid intersection.

**22:32** · And I just want to make sure that is where I imagine it is. So I'm going to cut a section and take a look at it.

**22:39** · I'll use the section tool up here and draw in a section through the building core. Right click on that and go to view. And then here I can see this is the return diffuser and it looks like it is in the correct place. However, I'm looking at single line representation here of the duct. To see the full duct, you go to the fine level of detail and you can see that better. So this is in the correct location. Excellent. So I'll take that and copy it.

**23:07** · Actually, before I copy it, I want to specify the flow rate of 200 CFM.

**23:13** · And then I can copy that over here and the copy will have the same flow rate.

**23:17** · 200 CFM.

**23:19** · All right. So now I can take my existing return air duct and continue drawing down here to the return air diffuser.

### Connecting the return diffusers

**23:28** · And the connections are made. Note that the symbology is a little bit different.

**23:33** · And that is because this is a different style um diffuser that requires a transition from square to round. So it put that in automatically for us. Okay. Now I'll go to modify and click on this duct and create similar. Now I'll create a similar duct coming off of here and then connecting over there.

**23:55** · So now we've successfully connected everything. And after we do that, it's a good idea to run the um algorithm on this. So if I select want to select all of these return ducts here by pressing the tab key until I get all of those branches to highlight then I can click to select them. And then I'll go right up here to duct pipe sizing.

### Running analysis for the HRU system

**24:19** · And I can use a sizing method.

**24:21** · And you can learn more about each of these algorithms if you click on help right here. I'll try equal friction and it resized this a little bit. Made it a little larger because it determined that we needed a a slightly larger duct to have equal friction throughout the system.

**24:38** · So over here I'll do the same thing.

**24:41** · I'll press the tab key a couple of times until everything highlights and then click and then run the duct pipe sizing tool on it with equal friction. And it says sizing failed. Well, it there's nothing there to um fail really. I'm not sure why it did that. Let's see. I want to look at the analyze tab and show disconnects for any duct. And this will highlight any disconnects that we may have in our system. And I don't see any. If we did have a disconnect, it would look like this.

**25:11** · Let me just pull this back a little bit. So this is the symbol that matches up with this icon here. That's showing me that I have a disconnect and I need to solve that problem. So here I've solved it and those little badges disappear. But I guess we're just not having any um any problem with the um the ducts here.

### Preparing for electrical design in level 2

**25:32** · Says it it failed probably because it doesn't have any suggestions for us. It's it's fine just as it is.

**25:38** · Okay. So I feel like I've completed the mechanical aspect of this project. So in the next segment we'll take a look at the electrical.

**25:49** · Okay, so I'm in the mechanical file here and I'm going to close out of it. And a good way to do that is to click this button right here on the quick access toolbar and it will close any inactive views and then finally close the last view to close out of the project. If you haven't saved, it will prompt you and go ahead and save and then open the electrical discipline.

**26:13** · And so this is going to have the architectural and structural links already established.

**26:20** · And I'm looking at looks like the electrical room here on the level one power plan enlarged view. So if I go under electrical, you can see that is the view right here that we're looking at. If I look at L1 power there's the electrical room.

**26:36** · And here are some receptacles in the space that were made in the more comprehensive project. Now today I'm interested in level two.

**26:49** · So I'd like to go to the level two power plan right here and there's nothing on it yet. There is a working section in the electrical room. That's fine. I can move that around anywhere I want.

**27:00** · But what I'd like to do is start out by um putting in some panels in the electrical room. And to get some inspiration for this, let's take a look at what we did on level one.

**27:13** · So on level one we have bunch of equipment. I'd like to get a better look at that. So let's take a look at this section which is looking down. I'll right click and go to that view. And here we can see that we have a couple of utility switchboards and a transformer.

**27:32** · And we have conduit running up above the ceiling.

**27:36** · And it looks like we have a cable tray up here.

**27:39** · And we have some lighting in here and we have looks like some vent piping from plumbing going on in here. Okay.

**27:47** · And then looking at in the other direction, we have this other section.

**27:52** · I'll go to that view.

**27:53** · And here we have two different panels mounted on the walls with conduit um coming up here above the cable tray.

**28:03** · So what are these panels?

**28:05** · And why do we have two of them? Well, let's read these things. This one is the lighting and appliance panel board at 480 V.

**28:13** · It's got a mini circuit breaker surface mounted three phase.

**28:18** · Over here we have one that's running at a lower voltage at 208 V. And so let's take a look at these different voltages. We'll go to systems. And this is the electrical area here.

**28:31** · So if I click this tiny little arrow over here that opens up the settings.

**28:35** · Notice that each discipline has its own little settings dialogue box.

**28:40** · You see?

**28:41** · So electrical settings are available on this little microscopic arrow that you can click right there. And this will give us all of the different um you know, deep options that we have. And what I want to draw your attention to today are the distribution systems that we have available. And you can add your own but these are part of the template.

**29:01** · And we're using these these two systems today. We're using 208 V.

**29:07** · This is the leg to leg voltage. This is the leg to ground voltage. So the leg to ground voltage is 120. And this is what we would use for regular receptacles.

**29:18** · This distribution system has a leg to leg voltage of 480 and that's what we're seeing right here.

**29:25** · And this is um got a leg to ground voltage of 277.

**29:29** · And this is the voltage that light fixtures tend to be in commercial projects in North America.

**29:35** · So um that's why we have two different distribution systems and two different voltages and that's why we have two different panels.

**29:43** · So I'd like to you know, do the same thing basically on level two. I'd like to have different panels up there running at these two different voltages at 208 and 480. Okay, so let's go up to L2 power and right now we're looking at the whole floor, but what I want to do is focus in on this room right in here and create a level two electrical room plan. So, I'm going to use the annotate Where is it? The callout feature. View, callout. It's on view.

### Placement of electrical panels

**30:14** · So, view callout and then I'm going to click the two opposite corners of this callout around the electrical room and I'm right now I'm in thin lines mode. If you turn that off, you'll see that this is a bit thicker actually. I can click on this callout now and use the little grips to reposition the bubble to someplace where it's not obscured.

**30:37** · This will eventually be filled in with the drawing number and the sheet number when we place this view on a sheet. Um but for now, just placing that callout will generate a new view of this. And I can right click and say go to view. And this is L2 power callout one.

**30:54** · So, that is unfortunately miscategorized as an architectural plan by default. And the reason for that is that when it generates a new view it just uses the first type over here.

**31:08** · So, I can change this now to a power plan.

**31:12** · And then that recategorizes that view into the correct bin here of power plan.

**31:18** · And then I will just rename that and call it L2 power plan enlarged.

**31:25** · And I'd like to make sure the um scale is half inch. Looks like it automatically was set at half inch.

**31:31** · That's great. I can hide the crop region here and this is prepared now for me to place my panels in. So, I can go to systems, electrical, electrical equipment.

**31:45** · And then I can see from this list of currently loaded families in my project what my um choices are here. Now, before I place them, I need to remember where those panels were on level one. So, I'm going to look in level one. So, the higher voltage panel was on this wall. I think it would make the most sense just to um place the the second panel directly above that on level two.

**32:10** · So, let's just make a note that the higher voltage panel is here, the lower voltage panel is over here.

**32:16** · Okay. So, when I come back here, I can add that electrical equipment and I want the 480 V mini circuit breaker surface mounted panel that runs at 250 amps and why is this so big? It shouldn't be so big.

**32:33** · That looks right to me.

**32:34** · But, still huge.

**32:37** · Hm.

**32:37** · I don't think it should be that size.

**32:41** · That is must be a view issue. So, let me try that again. Electrical equipment, place on vertical face.

**32:50** · There we go. So, it was placing it like out of plane, I think when we had place on work plane. We want to make sure it says place on vertical face.

**32:59** · It was oriented incorrectly. That's what was happening. So, now I can say this is going to be on level two. It's 4 ft above the ground in level two. I'm going to place it right about here.

**33:10** · And that looks right.

**33:11** · And then I'm going to deselect and do the same again.

**33:15** · And this time I'm going to choose the lower voltage MCB panel at 225 amps. Place on vertical face and it's going to go right over here somewhere.

**33:26** · Okay.

**33:27** · So, we have our panels and I think it would make sense to name them. So, this lower voltage one should have a panel name of EP-2.

**33:39** · This is power panel two. This one will have the name of LP-2 for lighting panel two. Okay. So, we have our panels in. A great start. Now, we need to go to the larger plan, so the L2 power plan.

### Working with electrical receptacles

**33:55** · Incidentally, this is blue because this particular view has been placed on a sheet in the template. These other ones are white because they have not yet been placed on a sheet. Okay. So, in the larger L2 power plan, I'm interested in just these two rooms here.

**34:12** · And for electrical power in here, we really only need maybe we need something for It depends on if we have a hot air hand drying solution on the wall over here um and we might want to have a a GFI plug on the wall over here. So, let's just plan to put two GFIs in the in each restroom. So, I'll go to device, electrical fixture and then I can choose the type over here.

**34:39** · I want a duplex receptacle GFCI ground fault circuit interrupt and I want to place that on a vertical face and this you can set the elevation above the floor, how high you want it here.

**34:55** · Say that's uh 1 ft 6 and I'll place that right over here.

**35:00** · And I'll place another one like right over here.

**35:04** · I'll do the same thing on the other side in the other mirror image washroom.

**35:10** · So, I've placed my receptacles. Now, we need to attach them to a logical system.

**35:17** · And these can be on different breakers.

**35:19** · Let's say we have two different breakers, one for each washroom. So, I can select one of these and go up here and click on power. This will create a power system. This creates a power circuit for the selected electrical devices.

**35:34** · So, when I click that, we're prompted we go to this special green tab where we have specialized tools over here for the system. We need to select the panel that it's going to go on.

**35:46** · So, this is going to go on power panel number two. The connection type is breaker because we're using an MCB mini circuit breaker type of panel. We also have the option to feed through lugs.

**35:59** · That would be um an MLO type of panel.

**36:03** · Breaker is the correct choice here.

**36:05** · Um and I want to edit the circuit now.

**36:09** · So, I'll go into edit circuit mode and then we're given yet another tab, this orange tab. And this allows us to add to the circuit or remove from the circuit.

**36:19** · So, in add to circuit mode, I'm going to click on this other GFCI and say finish editing circuit. So, now these two are connected in a circuit and we can see that if you position the cursor over one of the receptacles, it doesn't matter which one, and you press tab, you'll see Let me just zoom out a little bit.

**36:39** · You'll see that this is connected with an arc indicating the wire and a dashed box that highlights the panel that it's connected to. I believe it's the panel on the right. So, if I click on that now, it activates this mode and then I can convert um this to an actual wire.

**37:01** · Now, some firms will show the wiring and some won't. I'm going to show you how to do it. So, you have a choice of arc wire or chamfered wire. I'll go with the arc wire style and that adds the wire automatically. And it also adds a home run that points back to the panel that it's connected to. And in this case um it's kind of interfering with this um one over here. So, what I want to do is edit this a little bit and just pull this maybe up here and this is an arc, so it has three points.

**37:33** · It has two end points and a point in the middle and you can pull that point in the middle around. The idea is this arrow should kind of point in the general direction of the panel that it's home runned to. And this dash mark here, this tick mark is something that can indicate um the number of conductors in your wire if you like. And this is something that's controllable um right on the wire. You can add or remove from it. Um you can also have the tick marks be off or on or calculated.

**38:05** · It's calculated from the number of conductors. So, right here the hot conductors, there's one hot conductor here. So, if I said there were two hot conductors here it would show two tick marks. If I said there was only one hot conductor, then it goes back to one tick mark. So, that's how the tick marks function. And I believe you can specify in the electrical options, there's something in here about the tick marks that you can dive in deeper and uh explore them here. Here.

**38:37** · Hot wire tick mark. The long wire tick mark um is shown here. You can also have tick marks for the ground wire and the neutral wire if you want. So, if I chose those, we'd have more tick marks basically on the wire to show each conductor that's inside of there. Now, the way it's set up right now, it's only showing tick marks for the hot wire.

**39:02** · But, if you didn't want any tick marks, you could you could get rid of this and you would right here it says show tick marks, you could say never if you wanted to.

**39:11** · All right. So, that's how you do wiring.

**39:14** · Let's do the same thing over here. I'll position the cursor over a receptacle, press the tab key and I don't have any wiring yet because I haven't yet made a logical system out of these receptacles.

**39:26** · So, to do that, I need to actually click on one of them create the power system route it to a specific panel and it will default to the last panel that you selected, which is PP2 here.

**39:38** · I'll edit the circuit add to that circuit finish editing the circuit and then I can come in here and press tab, and then click, and then add the arc wire. And in this case, I'm happy with the way that that those look. Maybe instead of this just being straight, I like to have it with a little bit of a curve like that. Okay. So, the last thing I want to do is show what these are home run to. So, for that, I'm going to tag these home runs.

### Annotation of panels and electrical systems

**40:07** · I'll use tag by category, and I'll click right on this particular wire here. And this shows me that it's going to circuit breaker number one on power panel two.

**40:19** · And I can move this around and put a little shoulder on that if I want to.

**40:24** · This is already configured um in the comprehensive course the way I wanted it to appear. And then tag this home run, and it's showing me that it's on breaker two on power panel two.

**40:35** · And I can just adjust this little shoulder here like so.

**40:40** · Uh I don't want to tag anything else right now.

**40:42** · But what I would like to do is see these in a in a spreadsheet format. So, I can go to my um power panel two right here, and create a panel schedule from that using the default template. And then I'd like to see the whole spreadsheet, and if you can't, you can hold down the control key and roll your mouse wheel to zoom in and out on a schedule like this. So, here we have circuit breaker number one, circuit breaker number two, and so on.

**41:13** · And it shows all of the connections and the distribution system and everything here.

**41:18** · And this is accessible right um right in here under panel schedules power panel two.

**41:23** · So, I'd also like to label my power panel over here to say what it is. So, I'll tag it, and I can click on that, and maybe just reorient this. So, this is really like too much information, I think. So, I would like to pair that down. And to understand, where is it getting this information from?

**41:44** · What we can do is edit this I want to go to modify and edit this particular tag.

**41:50** · So, I'll edit the family, and then I can click on the label and edit the label. And then here, you can see that it's showing me the family name and the electrical data.

**42:02** · That's what it's doing.

**42:03** · So, let's go back to our um level two power. So, the family name of this panel is this really wordy um family name. So, I'd like to kind of pair that down. It's more information that I want to see here. So, I can go to my families under electrical um equipment, and right down here, I have various families that are very wordy, and I I want to rename this, and just call it panel board. Here. Rename panel board.

**42:34** · I don't care that it's surface mounted.

**42:40** · That's what I want to see. And the other MCB um panel I will also rename for clarity. These MOL panels are part of the template, but I don't think I'm using them in this project. In fact, I could get rid of them.

**42:52** · Delete.

**42:53** · Delete. Okay.

**42:55** · Fair enough. Now, let's label this other one. I'll go to tag tag by category, click on it, just adjust its little leader, and now we can see that we're running two different panels at different voltages.

**43:08** · Excellent. So, now, I would like to deal with lighting. And of course, the lighting in these rooms would be shown on the reflected ceiling plan.

### Placement of electrical lighting system

**43:18** · So, I'll go to level two lighting, and this particular view looks like it needs some work. We're not seeing what we should. Let's take a look at level one lighting.

**43:28** · So, this shows what we developed in the comprehensive project. We have a bunch of lighting fixtures, we have wiring, we have switches, and home runs. We also have cable trays.

**43:40** · Okay. So, I'd like to use this troffer light in the restrooms, and the switch as well. So, yeah, that's what I want to do. Let's go to our I want to look at the view range of this particular view. So, if I go into the view template here, and take a look at the view range, it's set up to be the cut plane is at 4 ft, and it's going to the level above.

**44:08** · When I go to level two here, we need to make sure that our view range is going to work for us.

**44:15** · This view range isn't working for us.

**44:18** · So, I'm going to uncheck this here, so it's not part of the template anymore.

**44:23** · Then I can specify the view range of this view separately, and I can see what's going on here. The level above is the mezzanine, which is only a foot higher. That's why we're having a problem here.

**44:35** · So, we want to go up to the roof, I believe, here. Apply.

**44:39** · No. Got to change this one, too.

**44:42** · There we go.

**44:43** · So, I needed to make that change in this particular view because of the um unique way in which we have levels in this particular project. This conference room floor is 1 ft higher than the rest of this um level. And so, that's why we were having an issue.

**44:59** · Anyway, it's been solved. So, now if I come in here, what I don't want to see is this plumbing fixture. You know, that we we definitely don't want to see that on the ceiling, and nor do we want to see these toilet partitions, either. So, how can we get rid of these things? Let's go into the view template, and these are coming in from the plumbing link.

**45:23** · Go in here, and I can turn off the plumbing link, which we don't really need in the electrical project. We don't even need to see that at all.

**45:32** · And nothing changes.

**45:34** · So, that tells me that these are not part of the plumbing discipline. They must be coming from the architect. We need the architectural link, though. We can't get rid of it. So, we're going to have to customize how that's shown, and in particular, I want to hide anything having to do with plumbing fixtures or plumbing equipment here.

**45:55** · We got rid of the urinal, all right.

**45:57** · This is part of the architectural model, and if I tab, I can actually click on that and see what it is. This is specialty equipment. Okay. So, I learned that, and now I can go back into my template, and edit the architectural link, and get rid of specialty equipment from the architect. There we go. This is suitable finally for a lighting plan.

**46:25** · And if I drag the cursor, you can see where the architect has placed those lighting fixtures.

**46:31** · And you can actually see that here. It's very subtle, but there's a a slight tonal difference that I can perceive.

**46:38** · So, I'd like to place my own light fixtures on this grid that I can use in the electrical project. So, I'll go to systems, electrical, lighting fixture, and I need to select the type, which is a 2 by 4 ft lamp, two lamp, 277 V.

**46:57** · And And I want that to be on level two, and it's 8 ft above the floor. And it's going to go on the face, not the vertical face, on the face. I'll press the space bar to rotate that, and I'll attach that right here. I'll add these light fixtures on top of the architectural light fixtures.

**47:18** · And the architect has laid out where they go, but we need to place our special electrical light fixtures because they have connectors on them, and they have certain voltages that the architectural um light fixture does not possess.

**47:34** · Okay. So, I've placed my light fixtures.

**47:36** · I just want to be sure that they're in the correct plane, though. So, I'll cut a section. I'll change the scale here.

**47:42** · Well, I don't I don't need to change the scale, but the section bubble is rather large.

**47:47** · I'll go to that view, and zoom in here, and it looks like they're right on the ceiling. I'll go into a fine level of detail here.

**47:55** · They look fine to me. No problems.

**47:57** · So, I can close that section, and I don't really need it. I'll just delete it. Okay. So, now, we need switches on the walls, and I can see the door openings here, which is very helpful in helping me determine where the light switches should go, just inboard of the door opening.

**48:15** · So, for that, I need an electrical device, lighting switch, and we have all these different types to choose from. I just want a single pole switch right here, and another one right over here.

**48:29** · Now, these switches are showing up with a box around them, probably because they're shown in a fine level of detail.

**48:39** · If I go into my template, and edit the model, and take a look at electrical uh devices um electrical fixtures, they are specifically set to a fine level of detail right here in the um visibility graphics. I can say by view, and that would give me the ability to control that um if I could do that here. I'll do it right here.

**49:04** · Course, medium, fine.

**49:06** · Fine shows just the box. Course shows the symbology and the box. Not sure why I want to get rid of the box, actually. So, if I edit this family, and look at its reference level, there's the box. And what is this show How is this showing me? Visibility settings.

**49:25** · Um I don't want to see this in the plan, let's say. Load into project electrical is the project, and override. Well, they're smaller. I'll live with it. So, there we have our switches and our light fixtures. Now, we need to start connecting them. So, the first thing is I will select the light fixture and we have two different systems that we need to create. Let's start with the switch system. I'll click on that and then select the switch. It's this one here.

### Creating the electrical light switch and power system

**49:57** · And then edit the switch system and add the other light fixtures to the system and finish.

**50:05** · So, now if I position the cursor over a light fixture and press the tab key, you can see dashed lines radiating out of the switch showing that that switch is responsible for turning those lights on and off. We'll do the same thing over here in this adjacent room. I'll create a switch system, select the switch, edit the switch system, and add the devices to that, and then finish editing. Again, I can test this out by pressing the tab key and we should see four radiating dashed lines.

**50:37** · Next, I can click on the light fixture and the switch is no longer there because it's already been created. If you ever wanted to edit that, you could just go to switch systems up here and you can edit that. I don't want to edit it. I want to move on and create the power system.

**50:53** · And here we have to choose the panel that it's connected to.

**50:57** · This would be the lighting panel two on the second floor.

**51:01** · It's a breaker type. I'm going to edit the circuit and I'm going to add to that circuit. I'm going to add the light fixtures and don't forget the switch.

**51:11** · They're all part of that power system.

**51:13** · Finish editing the circuit and then do the same thing in the adjacent room.

**51:18** · Create a power system. It goes on LP2.

**51:21** · Edit the circuit, add the other fixtures to the circuit, and the switch, and finish editing the circuit. Finally, we can add the wiring by pressing the tab key a couple of times. I had to press it four times in that case.

**51:36** · And you can see the dashed box goes around the panel that it's connected to.

**51:42** · I'll add arc wires and for some reason Revit sometimes does this. The home run goes all the way to the panel. That's not what I want. So, I'll take this and pull it back. And we have to move the the middle grip. I want to have that kind of pointing over at that panel, like that. Now, some people don't want to have the home run coming from the light fixture. They want to have it coming from the switch.

**52:06** · And that's fine. I can get rid of this particular wire here by pressing the delete key.

**52:12** · And then I can manually put in a wire.

**52:15** · Let me just fix this this connection here first. So, that's correct. But then I'm going to draw in my own wire. I'll go to systems, electrical, wire.

**52:26** · And then I can draw this wire from this point, then click here for the center of the arc, and click a third time to put in the arrow head. So, that's home running to the panel and I can tag that and you can see this is going on breaker number one on LP2.

**52:42** · Next, we have this washroom.

**52:45** · So, I will position the cursor over one of the light fixtures and press the tab key repeatedly until we get to this mode and then click and then add arc wires.

**52:56** · And again, I want to just select this one and delete it. And I'm just going to tidy this up a little bit. And I want to draw in my own wire from the point grip on this switch. So, I click once there, a second time here, and a third time here.

**53:15** · And then I'll tag this and you can see that it's on breaker number two. And just like we did with the power panel, we can come in here and select the high voltage lighting panel board two and create a panel schedule for that.

**53:31** · And here it is. We have these two lighting circuits.

**53:35** · They're using a higher voltage and everything is set up. So, we've essentially completed the electrical portion of this project.

**53:46** · I've opened the plumbing model and if you look at level one, you can see what was done there. We We see a hot water heater over here in the systems room with hot and cold domestic water supplies. The hot water is shown with insulation and that's why it appears thicker.

### Preparation for hot-cold water plumbing works

**54:05** · And that is routed through the ceiling down into this cavity in this wall between the restrooms. And you see below all of that, you'll see the sanitary piping in green.

**54:17** · And so, we have these fixtures shown in white. And these are special plumbing fixtures that have connectors on them.

**54:26** · And these connectors determine what we can connect to it in terms of piping.

**54:31** · So, if I click on one of these sinks and edit the family, you can see that it has the geometry of the sink, but behind that, we have these connectors. And so, this connector here is um domestic hot water. This one here is domestic cold water. And the one on the bottom is the sanitary. And so, that's built into this family. And that allows us to connect pipes directly to it. On level two, we don't have um really anything built here yet.

**55:00** · We see the locations of the sinks and the toilets and so on, but it's all gray because this is all part of the architectural model. The architect laid out these fixture locations, but when we're doing plumbing engineering, we have to add our own fixtures on top of those.

**55:17** · So, to save time because these are after all identical restrooms, we can select couple of these fixtures here and copy them to the clipboard and then choose paste aligned to selected levels and choose level two. So, those get copied up to level two. Just like that.

**55:40** · And now I can select this particular sink and copy it up above. I'll make another copy over here and rotate this 180 and align it in both directions and copy that down below.

**55:58** · And on level one, you'll notice perhaps that the urinal is not shown in white and that's because we solved this in a different way. Instead of bringing this family in from the architectural model, we added these connectors to it. So, these are called pipe connectors for cold and for sanitary. So, that's what we'll do here, too. We'll add pipe connectors instead of bringing in the geometry of the urinal.

**56:24** · But down below here, we have two more toilets that we could add and just to save time, I think it might be more expedient to simply select these in level one, copy them to the clipboard and then paste aligned to selected levels, level two. And then everything should show up in the right position.

**56:43** · But it's always a good idea to check and make sure that things are not floating above where they need to go. So, I'll cut a section across the restrooms and then go to that view and it all looks good. They're not out of position.

**57:00** · Actually, this is the wrong floor. This is the floor below. I need to look at what's happening above and it's fine.

### Placement of the main hot cold water pipes

**57:06** · Okay. So, back on L2 plumbing, we're set up to receive the piping. And there's no use in running it from the water heater again because we already have piping directly below this on level one. So, what I really need to do is get a view of this um and run the pipes up. I need to see this um in the section, maybe.

**57:28** · I'll switch this to fine level of detail, a higher scale. And here I have access to this particular elbow on this hot water pipe. And I'd like to convert that elbow into a T and I can do that by clicking either one of these plus symbols. And I want the T to run up, so I'll click this upper T button. And then I can click on that T and draw a pipe running straight up.

**57:51** · I need to do the same thing for the cold water, but the cold water pipe is behind the hot water pipe here, so it's not letting me select that T. What I need to do here is take this section and pull it over here and flip it around looking the other way.

**58:10** · Then if I if I position it right, I don't think it is. I should be able to see that cold water pipe. Here it is.

**58:18** · And now this is in front of the um red pipe behind it, so I can select this particular elbow and turn it into a T and then draw a pipe coming out of that.

**58:28** · And I need to now run these into the cavity. And I can't see that. It's receding into the picture plane.

**58:35** · So, I just need to cut a section going the other way. And I'll look through this view. Now, it's getting fairly confusing. I'll change a few things here and zoom in to my area of interest. Now, here we have a cold water pipe coming up from below. I will draw a pipe running horizontally here.

**58:55** · And I need to service these sinks as well as these fixtures on the right. So, this elbow should really be a T. Now, I can draw uh water pipe going that way.

**59:06** · And then let me just see what we have here. If I select this, it says it's referenced on level one. You see, Revit doesn't understand that this is on level two. Even though I drew it up here above level two, unfortunately, Revit doesn't detect that. And because I drew it from a pipe that was on level one, this is still on level one in in terms of what it understands. I can change that here by specifically calling for reference level L2.

**59:34** · And then I can rationalize this above level two.

**59:37** · So, let's say it's 2 ft above level two.

**59:40** · Here, this pipe will go to the left where we have we need to have hot water in the sinks. But, we don't need hot water over here on the right. I guess that's why these risers are located exactly where they are. It's because we just need to feed this one to the left and this one goes both ways.

**59:56** · And so, this pipe has to be on level two. And its middle elevation should be at a little bit higher than the cold water. Let's call this one 2 ft 3.

**1:00:06** · So, it's just a little bit higher there.

**1:00:08** · Great. All right. Now, back in um L2 plumbing, I can't see those pipes yet. So, there's some kind of issue that we need to figure out. Why can't we see those? If I go into my view template and I look through here, I notice that there's a missing checkbox. That means that the the filters are controlled separately from the template. And that is what I need to deal with. So, the filters are available through visibility graphics overrides. Filters, and here I can change them.

**1:00:39** · So, I'm going to turn on hot and cold domestic water. And now, I can actually see those systems in here.

**1:00:47** · Excellent. Now, I'm going to select all of these things and make a selection box out of it. That is going to um show me that selection in 3D. And I don't want to see any of the links here. I I'll go into just click off to the side to deselect everything. And then I'll go into visibility graphics overrides. Note that there is no view template in this new 3D view. So, I'll go right into visibility graphics overrides and go to Revit links and turn these off.

**1:01:18** · That way, I can just see the elements that I've added here explicitly. Now, I notice that we have box here. This is because of the uh it's a T.

**1:01:29** · And we mean well, ultimately we're going to need insulation on all of our hot water pipes, but we can add that later.

**1:01:35** · This here is a vent from the sanitary system. We'll be routing that up through here as well. But for now, let's consider how are we going to connect these cold water um pipes up to the sinks? So, I can um select the sink and say connect into and then I can choose which connector I want wish to use. I want to use the cold water connector. Then, I'm going to click on this cold water pipe and it connects right in there. See that?

### Connecting sinks to the plumbing system

**1:02:01** · So, to save a on these connectors, we should figure out what is the elevation of this particular pipe. It's at 1 ft 10 and 1/2. Well, I don't think there's any reason why we shouldn't change this whole run to be at that same elevation at What is it? 1 ft 10 and 1/2. And when I do that, it moves it down to the same level, but something broke. I can delete that element, get rid of these little tiny pieces and reconnect this.

**1:02:32** · So, we just have a straight run. Now, it's not shown how this is actually connected up into the sink. That would be something you could model in the family itself, but this is attached to that sink's connector right there. Okay.

**1:02:47** · So then, over here, we can elongate this pipe. And so that we don't have any connections that route around here, what I'm going to do is select this particular pipe and click cap open ends. So, it's going to temporarily put a cap on the end of that pipe. That will make um Revit find us a routing solution that doesn't involve going through the end of that pipe.

**1:03:11** · I can select the next sink and click connect into, choose cold water, and then click on the cold water pipe.

**1:03:18** · That's looking good. Next, and finally, this one. So, those are all straight shots. Very easy. For the hot water, let's see if we can get it to work in the same way. It might be a little more challenging.

**1:03:33** · Um so, I'm going to say connect into from this sink. And I I can choose from hot water or sanitary. So, here we want hot water. And I'll click on that. And you see it it took this long path around there to connect it in there, and that's not right. Undo. So, I'm going to drag this out and put a cap on the end and then try to connect into that again. You see, it worked, but Revit routed that right through another pipe. So, it's unfortunately not quite smart enough to detect this.

**1:04:01** · So, we have to detect it ourselves, and that's why I'm working in 3D, so I can see errors like that. I know that's not going to work. So, what I'm going to do is erase some of those um pieces. And then, if you select the T, there's these little rotate grips.

**1:04:22** · You can rotate that around like that.

**1:04:24** · And then draw a pipe coming out of here like that. And I want to route it straight down. I can't do that in 3D though. I can't draw that straight down.

**1:04:32** · So, I need to look in one of the sections to do that. This one here. So, go back to 3D and I can see that we have it. You see? So, we had to manually solve this problem. Unfortunately, I think it's going to be the same on all these others. So, if I try to use this and say connect into the hot water pipe, Oh, no. That one worked. Well, it's because there's no spatial conflict.

**1:04:56** · This one's probably going to work. Yeah.

**1:04:59** · But, we don't need We don't have any more sinks. And so, we don't need this stub. What I can do here, I think I accidentally moved the level. That's dangerous. I need to lock my link selection right here so that I can't ac- accidentally drag something and end up changing the entire project. Okay. So, I'm going to delete these and take this T and click on the minus to turn it into an elbow.

**1:05:22** · Same thing here. Great. Now, this sink, I imagine we're going to have to draw it in ourselves.

**1:05:29** · What I might be able to do is take these pieces.

**1:05:33** · I'm control selecting them.

**1:05:35** · I'm going to copy them down. So, it's not cutting the pipe for us. We're going to have to do that manually. But, here's my thought process is I'm going to draw hot water pipe coming out there.

**1:05:48** · Then, I will align those and I didn't quite make it. Line.

**1:05:53** · Um no. It's tricky cuz I I'm working in 3D, but I might be able to click on that center. And then, if I'm careful, I can maybe get the other center.

**1:06:05** · No, it's not There we go. There we go.

**1:06:08** · Got it. Well, I moved one, but I really needed to move all of that stuff. This is fairly difficult to manually select these pieces.

**1:06:18** · And then, I'm going to come under here and move.

**1:06:22** · I'll press the tab key.

**1:06:24** · It's very tricky, this.

**1:06:25** · Yeah, undo. Not working well.

**1:06:28** · Maybe I'll have better luck if I use the arrow keys. Just nudge it over. There.

**1:06:33** · But, I know I have duplicate pipes here on the end. And I also know that this wasn't cut. So, I have to pull this back and then I have to draw on it a separate piece over here. And just so that I can verify that everything is indeed connected, I'll go to the analyze tab and show disconnects. I want to show any disconnects on pipe. And it will show me anything that isn't connected. So, these these have There's one down here for sanitary, which we haven't done yet.

### Showing disconnects and adding pipe insulation

**1:07:01** · This one is identifying as not connected. You see? Even though it looks like it is. There. I got it.

**1:07:07** · That needs to disappear. The sanitary hasn't been done yet. That's okay. Same there. And there. And there. And here, we have the um the toilet. The cold water This has to go into the pipe over here.

**1:07:20** · So, I'll say connect into cold water.

**1:07:24** · And you see how it took the circuitous route? That's not what I wanted. Undo.

**1:07:28** · What I'm going to have to do is pull this down far enough and then cap it.

**1:07:33** · And then, I can connect into the cold water line and it will find the right routing solution because there's only that possibility.

**1:07:42** · Here, connect into. Great. Now, there's no other fixture that I need to attach.

**1:07:48** · So, I can eliminate this cap and this final piece. And I can then turn this T into an elbow. Now, we have um disconnects on all the sanitary cuz we haven't done that system yet. All right.

**1:08:01** · Now, we just simply need to insulate all of the hot water pipe. So, I'm going to position the cursor over one of those pipes and press the tab key until all of that stuff is selected. And then, I can say um What can I do here to remove or add insulation? It's not letting me do that. I can do that over here, but I think what happened was when I selected that branch, it probably selected like the water tank itself. And that's keeping me from having the right tool available.

**1:08:30** · So, I'll use filter and I'm going to filter out plumbing equipment out of this selection. Then, I can add insulation.

**1:08:40** · And because I already have some insulation, it's giving me this um message.

**1:08:44** · Some of the pipes or fittings that you selected are already insulated. What do you want to do? Continue adding the insulation. The new added insulation will replace the existing ones on the selected pipes or fittings. Perfect.

**1:08:56** · I'll use fiberglass, 1 in. There we go. So, now we are fully insulated on all of the hot water pipes so that we can save energy. And we've connected everything. Excellent. I'm going to turn off the disconnects right now. I find them distracting. Okay. So, now we need to consider the sanitary.

**1:09:17** · Now, we're going to do the sanitary system. Let's take a look at the L1 enlarged sanitary and vent plan and it shows exactly what we want up above. So, to save a lot of time, what I can do is scavenge all of this stuff by window selecting it, copying that to the clipboard, and then pasting that aligned to selected levels on L2. And then I need to look at that now on L2. So, if I go to my L2 plumbing plan, I can see all of this up here.

### Preparation for working with the sanitary and vent system

**1:09:48** · And we have some disconnects which we might be able to solve with some manual work. And you may or may not see those disconnects here if you go to analyze, show disconnects.

**1:10:03** · I'll just turn those off for now. But I don't want to see all of this on the same plan. It's too confusing. It's hard to read. So, if we look up above, you see that I've separated out the enlarged domestic water plan on level one from the enlarged sanitary and vent plan.

**1:10:21** · I want to do something similar on level two. So, on level two, we have all the requisite piping here, but we haven't separated them. So, what we need to do is go to the view tab and create a call out. And this call out will be a call out surrounding the restrooms. And I will select the call out bubble here and drag it up out of the way. And then I will right click on that and say go to view.

**1:10:49** · And this is a new view that was generated in the act of creating the call out. And that view, L2 plumbing call out one, is actually miscategorized up here in the plumbing discipline, but it's under floor plans architectural plan. The reason for that is when the new view is generated, it is simply given the first view type in alphabetical order. It happens to be architectural plan. I'll change that now to plumbing plan.

**1:11:18** · And you see over here that it re it fixed that problem and now this is in the correct bin, plumbing plan. I would like to rename this. And let's say that this particular one will be the enlarged domestic water plan on level two. So, I'll rename that and call it enlarged domestic water plan on level two. Okay, if that's true, then I don't want to see the sanitary or the vent. We don't have any vent at the moment, but we will.

**1:11:47** · So, I need to go into the visibility graphics overrides, filters, and I need to turn off the domestic hot and cold or rather I need to turn off the vent, leave these on, and add the sanitary system here, and turn that one off. So, in this way, on the filters tab, is where you can control which systems you you want to filter out. So, we're filtering out the vent and the sanitary here. And then I'll duplicate this plan.

**1:12:18** · First, I'll turn off the crop region.

**1:12:21** · And then I will duplicate this view, and then rename this duplicate. We'll call it the enlarged sanitary and vent plan.

**1:12:30** · And in this view, we want to change the filters. So, we're seeing vent and sanitary and not cold and hot water.

**1:12:40** · There we go. So, we're able to see just the green piping, and in the adjacent view, we're seeing just the red and the blue. Perfect. So, going back here, see if we can fix those those disconnects that we saw on the analyze tab, show disconnects pipe. So, what's up with that? So, this is probably a really tiny little error that we have to kind of You see how I just dragged that over a little bit and that disconnect warning disappeared?

### Creating the venting system connection

**1:13:07** · It's because we have little micro variances in here that are causing this, and we can safely disregard this if really cuz graphically, this is all looking great.

**1:13:21** · I don't know if I'm going to be able to succeed in getting that to disappear.

**1:13:25** · So, I'm going to ignore it. It's fine.

**1:13:27** · Here we have a disconnect, and this really should be matched up with the pipe below. So, for that, I need to look at a section. I'll look at this section.

**1:13:36** · And here I need to have this pipe go all the way up. So, this one has to be turned into a T, and then I can draw a new pipe running up here. And here, these are probably off a little bit, so we can use a line, modify a line.

**1:13:55** · Align those up, and then I just need to drag this in there to connect it. It might also be misaligned in the other direction that we can't see here. So, let's look in the plan here. And again, it's such a micro difference that I can't even perceive it. So, I'm going to disregard it. I'll go to analyze and turn off show disconnects. So, I think we're good all throughout. The only thing outstanding is the vent. So, let's take a look at this in 3D.

**1:14:27** · Where's my 3D view here? So, we have a vent here on level two that's just going nowhere. And we have a vent below coming up. We want to join these together ultimately. Where does this go? This vent gets routed in the chase by the elevator core, I believe. But I just want to interconnect these vents. We certainly don't We can't have this turn upside down or else the septic would go down the vent. That's not going to work.

**1:14:58** · What we could do Well, I really need more context. I need to see this in the context of the full model. So, I think for that I'm going to have to go into my working 3D view where I see everything.

**1:15:11** · And this is level two. My vent is still embedded here. I need it to be a little higher, and I can route it over here and join it up in the plenum space.

**1:15:23** · Well, actually, I think are we on This is level one. Yeah. Go up higher. So, here's where I need to bring my vent over. I think I'm just going to run it over this way and then connect it over here in the chase. Yeah. So, let's see.

**1:15:38** · How can I do this? I need to look at my 3D view, and I want to bring this up higher.

**1:15:45** · I know I won't be able to draw that up vertically in the 3D view. So, I need a better angle on it. I need a section.

**1:15:52** · So, where can I see this? I'll go in my level two through the section.

**1:15:58** · Here is my vent pipe running up. Yeah, that's going to work, but I think what I'll do is just nudge this down. I want to run it straight into the picture plane there. So, I need to go in the other section, section two. Section two is right in here. Yes. And then the vent pipe is coming up here. It can then First, I need to orient myself within the building and figure out where is the elevator core. It's over here. The stairs are over here. So, yes, this needs to go this way.

**1:16:28** · I don't want to slope down, though. The vent is not It's just air, so we don't need to worry about the flow of liquids. So, I can route this over here somewhere. Let's take a look in 3D again. See what's happening. Here's this pipe that I'm drawing right here. Just need to make sure that it's not running through a duct or a light fixture or steel. And we'll do an interference check in a moment after we route this to see how that's working out for us.

**1:16:57** · But I'll go back here and draw this over further, and then draw pipe out of there. You can rest assured that you're in the same plane if you draw it off of the end of an existing pipe. Yeah. So, here I'm able to see that right there. I can pull this over. And here's where we're going to make it be able to make a connection to the vent pipe that's going up the chase. So, I'll draw another pipe running this direction. Very hard to see. So, in this context, I think if I go into wireframe mode, I might be have more success with this. There.

**1:17:29** · We made a connection. That'll work. So, we're venting it up to the roof. And I don't know, it there may be some type of conflict with the ducts or something.

### Running interference check

**1:17:42** · So, this is where it's always a good idea to run an interference check.

**1:17:46** · So, you go to collaborate, interference check, run interference check. And you can run the check against the existing model. You can select all of the different categories and run that against itself. And we have some issues here with insulation. And so, this is where you can see if we have anything we need to attend to. It'll show where that is.

**1:18:11** · Hard to know where that one is. I think that we're having some conflicts with the insulation on the hot water pipe running into the cold water pipe, maybe.

**1:18:21** · That would be acceptable. It's very close.

**1:18:25** · And the insulation is flexible. So, I think we could disregard those things.

**1:18:29** · Anyway, the interference check can come in handy to make sure that you don't have any problems where you're running into other trades and other systems. So, in a real project, I'd want to go through each one of these line items and make sure that there really isn't a problem. But I won't bore you with that. So, I think now I have completed the plumbing aspect of this project. Let's take a look at what we have in terms of our deliverables. We have our enlarged domestic water plan. We have our enlarged sanitary and vent plan.

**1:19:02** · And we have these sections which were useful when we were working, but now I can delete them. And so, congratulations. We have completed a taste of all of the disciplines MEP in this project, mechanical, electrical, and plumbing. If you'd like to learn more, please go to SourceCAD.com and check out our complete course on Revit MEP.

**1:19:29** · So, that was the Revit MEP tutorial series. Let me know what you want to learn next in the comments down below.

**1:19:35** · And don't forget to check the free Revit MEP Essentials course, which has the lesson files of this tutorial series, and you will also get a certificate of completion when you finish the course 100%. The link is in the description of this video, and also in the first pinned comment.

**1:19:51** · And also let me know what you want to learn next, and we'll have your suggested video soon on SourceCAD. Take care, and have a great day.