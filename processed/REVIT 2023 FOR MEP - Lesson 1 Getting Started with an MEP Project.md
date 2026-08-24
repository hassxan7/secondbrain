---
title: "REVIT 2023 FOR MEP - Lesson 1 Getting Started with an MEP Project"
source: "https://www.youtube.com/watch?v=PoH11nX72U4&list=PL5ZA2y2xWxRd35PHx_bO2BsmqPyuNEIvN"
author:
  - "[[Learning With Rich]]"
published: 2022-09-29
created: 2026-06-14
description: "Thanks for watching guys.You can check out my YouTube channel at:https://www.youtube.com/channel/UCkN1CGXmmHXjbyOi_dnonRAPlease follow/like also my FB Page:https://www.facebook.com/learningwithr"
tags:
  - "clippings"
---

> [!tip] Civly Relevance — **LOW**
> Pure Revit administration/setup (template choice, units dialog, project info fields, shared parameters, browser organization). No engineering content; Civly doesn't operate inside Revit.

## Notes

### Starting an MEP Project
- New project started from the "Systems" template, which bundles Mechanical + Electrical + Plumbing into one project (vs. selecting a single-discipline template if disciplines are meant to be modeled separately).

### Setting MEP Units
- Project Units dialog opened via the `UN` keyboard shortcut or Manage tab → Settings → Units.
- Units are configured **per discipline** — Common, HVAC, Electrical, Piping, etc. — each with its own set of measurable properties (density, illuminance, apparent power, coefficient of heat transfer, etc.).
- Example changes made: HVAC density set to kg/m³ (metric) then switched to lbm/in³ (imperial) to show both; Electrical illuminance switched from lux to foot-candles; Electrical apparent power set to BTU/second; Piping density set to lbm/in³; Piping energy set to a coefficient-of-heat-transfer unit (BTU/hr·ft²·°F).
- Each unit field also has a decimal-place rounding setting.

### Setting Project Information
- Manage tab → Settings → Project Information holds: organization name, building name, author, project issue date, project status, client name, project address (multi-line), project name, and project number.
- A separate "Energy Settings" link exists from the same panel for room/analysis settings — left at default in this lesson.

### Creating Project Parameters (Shared Parameters)
- Motivation: not every parameter needed is available on an element's built-in instance/type properties — custom ones must be created as **project parameters**, and to reuse them across projects/teams they should be **shared parameters**.
- Workflow: Manage → Shared Parameters → Create a shared-parameter file (stored somewhere a team can access, typically controlled solely by the BIM manager) → within that file, create a new **Group** (e.g. "Greenhouse Gas") → within the group, create a new **Parameter** (e.g. "Carbon Footprint Factor," Discipline = Energy, Type = Energy).
- Creating the shared parameter file/parameter alone does not make it usable — it must then be explicitly added via Manage → Settings → Project Parameters → New → "Shared parameter" → select it → choose whether it's an **Instance** parameter (visible per selected object) or **Type** parameter (visible only via Edit Type) → assign it to a target category (e.g. Project Information).
- Once bound, the parameter appears as an editable field on its target category (e.g. entering "12000" for Carbon Footprint Factor under Project Information).

### Project Location
- Manage → Project Information → Location: choose "Internet Mapping Service" (requires live internet, uses a Google Maps-style picker) or "Default City List" (offline city selection) to set the project's site location.

### Project Browser Organization
- Right-click the Project Browser → Browser Organization, or View tab → User Interface → Browser Organization.
- Default organization groups/sorts views by Discipline → Sub-discipline → Family and Type; can be changed (e.g. to Family/Type → Discipline) via editing the existing scheme.
- Custom organizations can be created from scratch (e.g. a project-specific "Office Space MEP" organization: group by Discipline then Family/Type, sort views alphabetically by name) and applied to change how the browser tree displays.

## Civly Relevance
See callout above — LOW.


Thanks for watching guys.  
  
You can check out my YouTube channel at:  
https://www.youtube.com/channel/UCkN1CGXmmHXjbyOi\_dnonRA  
  
Please follow/like also my FB Page:  
https://www.facebook.com/learningwithrich/?ref=bookmarks  
  
To continue more, please support my Patreon: https://www.patreon.com/learningwithrich  
  
To avail the complete exercise files:  
https://learningwithrich.wordpress.com/support-me/  
  
Get your regular dose of motivational and inspirational vlogs straight from Kuya Daniel Razon's Youtube Channel -- KDR TV!  
https://www.youtube.com/channel/UCYvYsVaGIGrUaVzlAM9wsnw/videos  
  
For your Spiritual needs:  
Subscribe, watch and share the OFFICIAL YouTube Channels:  
  
BroEli Channel  
https://www.youtube.com/BroEliChannel  
  
KDR TV  
https://www.youtube.com/KDRTV  
  
The Old Path  
https://www.youtube.com/TheOldPath  
  
Ayon sa Biblia  
https://www.youtube.com/channel/UCw21SznXMiXM6uN3OO0xINA  
  
Ang Dating Daan  
https://www.youtube.com/AngDatingDaan  
  
Truth Channel TV  
https://www.youtube.com/TruthChannelTV  
  
O Caminho Antigo  
https://www.youtube.com/OcaminhoAntigoHD  
  
El Camino Antiguo  
https://www.youtube.com/ElCaminoAntiguo  
  
TV La Verdad Oficial  
https://www.youtube.com/user/tvlaverdadoficial  
  
TV Verdade  
https://www.youtube.com/TVVerdade  
  
For Updated News:  
https://www.untvweb.com

## Transcript

### Intro

**0:00** · \[Music\] what's up guys learning with rich here in this video we are going to learn revit mep 2023 so the first

**0:19** · topic that we are going to do is we are going to learn how to get started with revit mep okay so let's do this so we're going to open a new project here so how to do that so here on our home view okay so i'm going to select here new and then here on the new project so we are going to select a template file

**0:48** · okay so in starting a project in revit mvp you need to use a template so by default you have this templates here so when you install your revit 2023 you'll be able to see these templates now the template that we are going to use here is

**1:08** · systems okay so why systems systems is a combination of the mep so you already have there the mechanical the electrical and then the plumbing but if you want to do it separately you can use mechanical if you want mechanical or electrical or just plumbing but if you want to combine all the services in your one project so systems

**1:34** · template is the one that you're going to use okay so i'm going to select this one and then make sure you are creating a new project okay and then let's select your okay

### Setting MEP Units

**1:58** · okay so after we create a new project the next thing that we are going to do here is we are going to set the mep units okay so setting the mep units so to do that you need to go to the units or project units dialog box so to do that you can type un

**2:21** · or units just like a shortcut in autohead or you can also go to the manage and then here let's look for units okay so where's the you need this one so it specifies this the display format

**2:40** · for units of measure so it's here on the settings panel and then that's the tool so project units or you can type u n so let's click this one and then after that here on the discipline we are going to change this i'm gonna select your hvac as you can see if it is common so these are the common units for all the discipline but if you want to make it specific just click the drop down arrow and then you can select your hvac

**3:14** · so as you can see here various units required in hbc uh hvac workflow are displayed okay here in this dialog box okay now for the format

**3:33** · okay wait so the format for the density parameter so let's say this one i'm gonna change this so currently it's kilogram per cubic meters right so you can change this if you want you can click that and then you can specify here the units

**3:54** · okay so you can select that one and then you can select other options here so let's say for example you want uh in english unit so you can select uh pounds mass per cubic inch

**4:10** · okay or if you are doing metric units so you can use your kilograms per cubic meter i think you know the idea so you can set here the the rounding of the decimal points if you don't want to have a decimal point you can just select here 0 decimal places for your density for example this also applies to other units here okay so you'll be able to see

**4:37** · this format dialog box okay now the next thing that i'm gonna do here is i'm going to cancel this let's say i already set the density i want kilograms per cubic meters

**4:53** · okay now for the electrical side so let's change this one i'm going to select your electrical so for the illuminance so let's say this is the illuminance i want

**5:09** · instead of lux level so i'm gonna select this one and then what i want here is food candles and then i'll select here okay right now let me just go back again to hvac and go to the density i want

**5:25** · english here so i'm going to select bounce mass per upper cubic inch then okay and then let's go back to electrical again let's set up okay so the illuminance is already on the foot candles you need okay so what else the power the apparent power so i'm going to select here uh british thermal units this one uh per inch do i have per inch

**5:54** · oh i don't have a per inch here so let's say i'll just use uh per seconds this one so that's the symbol and then i'll just select your okay

**6:13** · okay so let's say i'm done with the electrical i already finished setting up the units so let me now go to piping so let's select piping here and then for the density i'm gonna change this one so i want pounds bounce mass per cubic inch that one and then i'll just select here okay

**6:42** · and then what else uh energy for example so i select energy and then i want the coefficient of heat transfer units so i change this one again i want here btu so british thermal units per hour square foot degree fahrenheit and then i'll just select here okay

**7:06** · all right so let's say oops that chose this one for the energy okay not that one this one \[Music\]

**7:28** · coefficient okay so it's already set all right so let's say you already set up all the units in your project for the mep the next thing that i'm gonna do is i'm going to select here ok to apply all the formats that i have specified so just select ok ok now the next part of the exercise is we're going to set the project information so you are going to

### Setting Project Information

**7:58** · add project information to our uh building to our office space project for example okay so how to change the project information so to do that again it's here on the manage tab and then you can see here settings and then you can see here project information so you can click this and then you can specify here the project information like for example for the organization so let's say i'll call this a learning

**8:29** · learning with rich okay let's say this will gonna be uh youtube channel and then let's say i have a building name so i'll call this lwr

**8:51** · building and then i'm the author rich carsia okay and then uh for the project issue date so what's the d today so the date today is uh june 29 2022 and then the project project status let's say this is already started client name is abc

**9:25** · incorporation and then for the project address you can just put here uh let's say uh one you click this ellipsis button and then you can specify the address here

**9:59** · okay and then you can press enter for second line like that

**10:15** · all right and then just select here okay right and then for the project name so let's say this we're going to be learning with reach building office then project number lwr21-a

**10:41** · so that's it so this is where you specify the project information okay and then after that just select here okay okay so by the way you can also specify the energy settings parameter if you want so you can just go back to project information and then you can specify no not the energy settings but the root analysis settings you can select your edit and then you can specify this

**11:10** · okay but for this uh exercise just to simplify it i'm not gonna touch this one i'm just gonna use the default settings for the root analysis settings okay so i'm just going to select here okay and then just select your okay

### Creating Project Parameter

**11:34** · okay so now the next exercise is i'm gonna show you how to create project parameter okay so how to create a project parameter this is very important because not all parameters that you needed are here on the properties or listed on your

**11:53** · instance properties or type properties so there are some instances that you really need to create a project parameter so in this section we are going to create a shared project parameter that will be added to the project information

**12:10** · so let's say all the the parameters that we needed is not included to the project information so we need to create okay so how to do that so we are going to create a shared parameter so from the manage let's look for shared parameters this one so just click this

### Creating Shared Parameter

**12:34** · all right and then here we are going to create a shared parameter file so let's select here create and then i'll just put it here on the my documents or in your case if you're working in a company make sure you put this in a shared folder in the server where other team members can access this although if you are the beam manager they don't need to access the shared parameter okay you are the only one who will be controlling it okay all right so let's say for the name

**13:09** · i'm just calling this one uh repeat oops ready 2023 shared parameter okay sure parameters and then i'm going to select your save and then as you can see it's now here okay now after you create your shared parameter file the next thing that you're going to do is you're now going to create a new group

**13:41** · okay so for the new group so select that one and then let's say for this one i'm going to type green house this is the group so greenhouse gas and then i'll select here okay

**14:03** · and there you go as you can see parameters now is available so after you create the shared parameter file and then after you create a new group the next thing is the parameter that we are going to create under this greenhouse gas group okay so let's create so i'm going to select new and then you can specify here the name so let's say for the name i'm gonna type here carbon

**14:34** · footprint factor okay and then for the discipline this will gonna be for

**14:52** · energy and then for the type of parameter i'll just select it also energy okay so this is for the energy and then i'll just select here okay and there you go so you just created now your first project parameter so the procedure if you're going to create other project parameter is the same so just make sure

**15:16** · you create first a parameter file okay if you want to create another group so let's say group for your hvac parameters so you need to create a new group and then after that you can now create the parameter that you would like to add for your hvac or for the sheets if you want to add more parameters on your sheets just create a new group and then create parameters under the sheets group

**15:44** · okay so once you're done just select your okay all right okay so now the next uh portion is we're going to add the project parameter to the project information

### Adding Project Parameter

**16:00** · okay okay so how to do that so we are going to add the shared parameter that we have we just created to the project information so to do that you need to go to your settings panel again and then after that select project parameters so here on the project parameters as you can see i only have here one project parameter

**16:23** · now we need to add the parameter that we created so this is the next step you do not just simply create the shared parameter so if you want that to work you need to add that to your project parameters okay so to do that we are going to select here new parameter and then here instead of creating a project parameter we are going to select shared parameter okay so select the shared parameter

**16:55** · and then after that you select option and then you select the shared parameter that you just created and then after that you just select your okay and it's now added here okay so as you can see the discipline is already set and then the group parameter under if you want you can also change that but i'm just going to put that to the energy analysis group since this is for energy

**17:27** · and then this will going to be instance uh parameter so meaning you will be able to see it here on the instance parameter so when you select an object you'll be able to see it here on the instance parameters because the type parameter

**17:45** · if i put this on the type parameter in order for you to see this parameter you need to select type okay so that is the type parameter so if it is instance this is the instance parameter here this side here this is the instance parameter this is the type

**18:03** · parameter okay right so after we select your instance now for the category i want to add that to the project information so where is the project information project information that's the one so i

**18:24** · want to add this a parameter to the project information okay and then after that i'm now going to select here okay that's it so it's now added here and then let's select here okay

### Adding Project Information

**18:44** · all right so now let's go back to the project information so i'm going to select project information here all right and then there you go so it's now added here right so this is the instance parameter of your project information

**19:03** · okay so let's say for example for the carbon footprint factor i'm going to type here 12 000 enter so that's the unit

**19:18** · okay and then after that i'm going to select here okay so that's how you add a shared parameter that's how you create very important so you need to remember the procedure of this one so just select okay to apply it okay now for the next um exercise so let us try to specify the project location

### Project Location

**19:43** · so again here on the manage you can see there's a project information here okay now you can specify here the location so let's click the location let's click that and if you are going to use the internet you can use that if you want to use the default seat list it's up to you

**20:04** · okay so you can specify here so i'm just gonna select here internet mapping service so on selecting the internet mapping service option from the define location by drop down the google map browser is activated from browsing the desired location okay so you should ensure that there is an internet connection active at this stage when selecting

**20:33** · internet mapping service okay but if you don't have you can just simply select here default city list okay now for the project address you can just select from here okay search you can type the value so let's say i'm in auckland just search that's the one auckland california just click that one

**21:03** · and then after that just select here okay so that's it so it's now the location is now set okay now the next part of setting up your project is we're going to set the browser organization so in order for you

### Project Browser Organization

**21:24** · to modify your project browser this is the project browser which is very important as well so this is like the table of contents of your project wherein you can access all the floor plans all the schedules all the sheets all the

**21:39** · families groups or link model in your project now if if you want to arrange your project browser so you need to use your browser organization okay so how to do that browse organization just

**22:00** · go to your views discipline just move the slider up the top so right click and then you can see here browser organization or another way you can go to the view tab user interface and look for browser organization okay so let's go browse organization

**22:29** · okay so these are the default browser organization as you can see the settings here is edit discipline if you want to see the settings of that you just click here edit so it's none group for the filter there's none but the grouping and sorting it says here discipline and then sub discipline and then family and type that's why you can see here discipline subdiscipline and then family and type

**23:00** · right that is for your discipline if i select here type discipline and then you select your edit and then check the grouping and sorting you can see here family type and discipline that will gonna be the setup of your project browser if i select your okay and then i select here okay as you can see it will now change right so it's now change the settings

**23:30** · so it becomes a family and type and then discipline that's the settings so families type and discipline family and type and then discipline so i'm just showing you here the settings of your browser organization so let's say you want to create your own browser organization okay you can create so you can select a new

**24:02** · and then there's the create new browser organization so let's say i'm gonna type here like office office space mep okay and then i'll select here okay and then as you can see automatically it opens the browser organization for the

**24:26** · office space mep okay so i'm going to select here uh grouping and sorting tab and then let's say i want to see first the discipline so i select discipline okay and make sure all characters here is selected and then after that i want the family and type then the family and type

**24:58** · okay and then i think that's it for me so i just want to see the discipline and then family and type and then for the sort here sort by you can actually change this one if you want but i'm just gonna select here a view name in ascending order so that will gonna be the sort of my view

**25:24** · okay and then after that i'm gonna select here okay and then i'm gonna apply the browse organization settings that i have created and then i'll just select okay and then look what will happen on my browser organization there you go so it's now office space mep and then it's based on the discipline and then family and type okay

**25:49** · so that's how you work on your browser organization now let's say for example you already done this uh setting up your project so of course the next thing that you need to do is to save your project so let us save our project save okay and then i'll just put it here again on

**26:11** · my my document so let's say this will gonna be my office space and then i'll select your save there you go so basically that's the basic way of creating a new project and setting up your project okay so hopefully you learned something from this video guys thank you for watching have a nice day