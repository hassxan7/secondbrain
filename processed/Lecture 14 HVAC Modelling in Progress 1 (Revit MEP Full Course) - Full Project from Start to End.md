---
title: "Lecture 14 HVAC Modelling in Progress 1 (Revit MEP Full Course) - Full Project from Start to End"
source: "https://www.youtube.com/watch?v=Z7rHOcGVx2U&list=PLjD2PC-RU6S-GoTfv6lM53zGjBXVkXAw7&index=13"
author:
  - "[[Engineering Academy (BIM Management)-Mohamed Gamal]]"
published: 2023-09-27
created: 2026-08-10
description: "HVAC Modelling in Progress 1 (Revit MEP Full Course) - Full Project from Start to EndFamilieshttps://drive.google.com/file/d/1A1z_OKb7oPVhVcuFyBGJIA8T4xVj9vyb/view?usp=drive_linkhttps://drive.goog"
tags:
  - "clippings"
---

> [!tip] Civly Relevance — **LOW**
> Revit UI ductwork placement (rotate equipment, draw sized duct runs, place diffusers/returns, copy a room's system). Dimensions shown are arbitrary to this specific model, not general sizing rules — no formula or code value to extract. Civly doesn't operate inside Revit.

## Notes

### HVAC Modelling Session (continuation)
- Continues modeling ground-floor HVAC: a mechanical equipment instance is placed via "Create Similar" (copies properties from an existing instance), then rotated (180°) so its "in" and "out" connectors align with the intended supply direction — critical before duct connections are drawn.
- Main supply duct drawn from the equipment connector at 350×250mm; a branch duct reduced to 350×150mm, taken off the main run "not in snap in any line" (avoiding accidental alignment snapping) and extended slightly.

### Diffusers, Returns, Flexible Duct
- A diffuser family placed via "Create Similar" (matches elevation/properties of an existing instance) in three locations per room; a return diffuser placed similarly, including one positioned directly under the equipment.
- Flexible duct connects the last item (diffuser/return) into the system; once connected, Revit highlights the run blue to confirm system connectivity.
- Insulation is deliberately deferred and applied only once, in bulk, after all modeling is finished — not incrementally per duct segment — to avoid rework.

### Repeating the Pattern / Second Branch
- The equipment-and-duct pattern is repeated for a second area: connector rotated, duct routed out at 450×150mm.
- Duct-accessory (fire damper) placed inline on a duct run, inheriting the run's color/appearance.

### Air Terminal Placement / Troubleshooting
- An air terminal (diffuser) placed at elevation 3450mm, aligned to the duct's centerline; first attempt fails ("no space to make the fitting") because the preceding duct segment is too short.
- Fix: shorten/adjust the duct segment length (example value: 39mm) and retry placing the diffuser at 3450mm — succeeds; confirmed by checking the 3D view.

### Duplicating a Completed Room's System
- The return duct is copied to an equivalent second room via a straight copy.
- An identical room's entire system (equipment + all connected ductwork + diffusers) is selected together (Ctrl-select) and copied as a set, then nudged into exact position — used because this floor has repeated identical rooms.
- Presenter's stated practice: check the 3D view step-by-step throughout modeling to confirm correctness rather than only checking in plan view.

## Civly Relevance
See callout above — LOW.


HVAC Modelling in Progress 1 (Revit MEP Full Course) - Full Project from Start to End  
  
Families  
https://drive.google.com/file/d/1A1z\_OKb7oPVhVcuFyBGJIA8T4xVj9vyb/view?usp=drive\_link  
https://drive.google.com/file/d/16qk9GkZK\_iWMl\_J6tE9eV\_T5Vv\_PWKiW/view?usp=sharing  
Additional Families  
https://drive.google.com/file/d/1ksqXkTfUfTErHz2dwNQ356FgabtrtZe7/view?usp=sharing

## Transcript

**0:00** · welcome to Revit M course in this session we will continue the modeling of the HV for ground floor here I need to make another mechanical equipment so I will select this and make create similar to take the same properties and by the space you can rotate until it adjusted to the correct location so I will put here you can buy also here to

**0:27** · adjust and select here here the in and here the out so the supply will be from here so this is wrong so we need to rotate the equipment 180° so I will select and use rotate option and make one 80° so now it's okay we can select here

**0:51** · create duct from this symbol and then make 350 by 250 so 350 here 350 by 250 okay and continue seducting till here okay okay and then

**1:11** · another Branch 350 by 150 so I will change this to be50 okay and take the branch from here like this try to not in snap in any line okay and then this here extend this little bit like this okay so I need to make the

**1:36** · diffuser so you will select one diffuser from here to make create similar also to take the same properties and I will put one here and one here and also one here return so select

**1:54** · the return and make create similar to detect the same elevation and same properties and one also under the equipment so like this then the last the last uh item is the flexible duct here and here okay and once it took the uh system

**2:19** · it will be blue okay because it's connected to the system okay let's see in the 3D the other room here I'm rotating by shift and the scroll to hold on shift and scroll okay okay go right here and also go like this

**2:39** · you will find that the two rooms that we did it's okay okay okay I will do the fire Dum here duct accessory and I will put here and it will take also the same color and also

**2:58** · in the in the last step when I finish all I will do the insulation okay don't do the insulation one by one make it overall when you finish the modeling it make it overall okay so we will continue the ducting here the equipment it's repeated steps repeated

**3:21** · steps okay like this and then select the equipment the in here so you need to to rotate like this okay and then go out from here by 450

**3:37** · 150 so we will go to 450 450 by 150 and go till here okay you can also we can use another way like this here to put rid duct connection not flexible okay okay now we will do the Air Terminal here air terminal like this

**4:02** · 3450 make the elevation 3450 and put it in the same location of the center line of the duct like this uhhuh okay there is no space to make the fitting okay we'll try again no space to make the fitting so you will select the duct and make it for example 39 okay 39 and then

**4:25** · try again to put the diffuser at 3450 okay and here put here and now it is okay we put the diffuser and we need to see in the 3D what happened so it is done like this okay it's okay okay and here the return duct so we will make copy from here copy like this to

**4:53** · the duct to the other room okay okay we have this room the same of this room so we can select this system we can select the all system that we did with control and this diffuser also and make copy for the equipment to the same location okay and

**5:17** · you can move them to adjust the location exactly mhm here you can select them again to just make small movement like this to adjust and also this to make move like this so this is the other room and also I prefer to check the 3D step by step to make sure that you are making modeling correct okay so we did the four rooms as

**5:50** · we know as we see okay okay thank you very much