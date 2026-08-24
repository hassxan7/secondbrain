---
title: "How to paste an image into Claude Code (in 40 seconds)"
source: "https://www.youtube.com/watch?v=hVH2SoYuxY4&t=6637s"
author:
  - "[[Electric Rob]]"
published:
created: 2026-08-07
description: "How to Paste Images in Claude: Quick GuideLearn how to easily paste images into Claude using Control V on Mac, instead of Command V. This quick tutorial also..."
tags:
  - "clippings"
---
![](https://www.youtube.com/watch?v=hVH2SoYuxY4)

## Transcript

### Episode 01 - Linking Architectural Model

**0:00** · Hey guys this is Rob! So I've had a lot of requests to show start to finish an electrical Revit project so I've decided to do a residential scale project but design it as a commercial project. So what I mean is it will be a small square footage in only two levels but we will draw it and circuit it and detail it as if it's a commercial

**0:27** · level of detail so kind of a hybrid project but it should show a lot of the techniques used in commercial work and you can apply it to residential work as well going to be using as much of the out of the box templates and families as I can so that you can follow along without needing a bunch of custom content.

**0:45** · So if that interests you stick around so here we are in Revit 2023 and what we need to do is find an architectural model

**1:02** · that we can use as a starting point to add our electrical to so what I've decided to do is use an architectural model that can be found on the Autodesk website that is free to use and if you just go to your browser and do Autodesk sample projects and let's get a 2023 in there to get the right version because there's a few different ones and go to sample files right here

**1:30** · and you see we're in the Autodesk Revit 2023 help this also points out there's quite a few help topics in here that you can go through as you're learning but right here Revit sample project files they also have sample family files and and these kind of things let's go to sample projects and right here this is a basic sample project and it is a residential style home and it's got two

**1:58** · levels to it and it has a sunken living room here so that's a good sample project to work on now I must say that Revit is typically used electrically for commercial industrial work not so much on residential because residential typically doesn't require the level of connectivity and Detail in

**2:20** · those plans that a commercial project would a lot of contractors and electricians will self-design the electrical system and frankly I don't know how far they take their designs on paper if you will you know they would have to do some kind of design to decide what circuits things connect to things like that so what I'm going to do is treat this residential project like a commercial level of detail just to show how it's done on a small project a small footprint so with that being

**2:53** · said we're going to download this re residential project now you can see there's other commercial projects and in fact in 2024 they have a complete commercial project multistory multifam with full HVAC Plumbing structural architectural electrical everything that I will also be covering eventually

**3:14** · but that's a big project so I want to show how this can be done on a smaller level so let me go ahead you go ahead and just download that RAC basic sample project and I've already done that so let's get back into Revit 2023 first thing I like to do is open the architectural model to see how it's built see how it's put together and I've relabeled this to get the

**3:39** · right to get the version into it I like to know what version it is I mean you can see it here in the thumbnail it'll tell you what version it is but that's only if I'm looking at this while I'm in Revit if I'm outside in just explore and looking for projects I can't tell what they are

**3:55** · so here's Advanced here's basic sample project that is what we're looking for that is the archit textual version Let us just open that up not it's not too huge it only takes a second to open I want to get a you know an overview you want to get an overview of your project architecturally so you know what you're going to be designing now this lesson mainly deals with how to use Revit to document your plans but it'll also encounter some design issues so here

**4:24** · we go here is a site plan which is of course A View looking from the sky down and we can see that here's the north arrow pointing up and our building is somewhat tilted it's not straight up and down North and this here is some kind of a solar analysis to see how much light is coming into that project as well as how well it hits their solar panels and then we have a little bit of a planting schedule so that's that's the site plan now if we decide to do our own

**4:55** · site plan let's say we want to do a site plan that shows a connection out here to the solar panels or some other you know bringing service in from the utility we might need a site plan to do that and this is a good idea of you know what kind of tilt it might have if we really want to show it this way now we can always turn this and show it vertical and then here's some other plans these are the floor plans a level one floor plan and a level two floor plan like I mentioned

**5:22** · it's a two-story building two-story house we have a kitchen dining we've got the typical Hall with little mechanical room a bathroom and laundry and then one large living space and then on second floor we've got the bedrooms master bedroom bedroom it's a linen closet bathrooms we got three baths up there and the entry hall and just a deck up here so not a huge house nice project to start on to show the basics and then they include elevations and sections which

**5:57** · are nice for us to see how this things put together so we have those more elevations and sections now as we get into electrical design and drafting we're going to be studying these

**6:13** · a little more to see some of the details like we want to see you know where does the architect want the lights you can see kind of see that this is a sunken living room this is down a little bit lower than up there so we'll have to look at that that will affect the mounting height of some of our equipment and then they have construction details like sections

**6:38** · and such and these are actually interesting because these are if we look into these sections we'll find out that these are actually walls and railings and such someone didn't just draw detail lines and and create the sketch of this this is actually a section cut through the building and these are actually building elements within this model that are cut and then just labeled

**7:00** · so that's another of course benefit to using Revit in L of a CAD program and here's just some more sections to get an idea what things look like we've got a walkway we've got all kinds of interesting things in this project so that gives us an idea what's going on and then you want to get further you can get to the Views themselves because these are just sheets that have views dragged onto them we want to get into the views themselves you can do it from here if you open expand each of these sheets you will will see the individual pieces and this one here's a

**7:32** · schedule now here's the 3D view here's the site plan let's go to actual plans floor plan level one and floor plan level two you can also get to these views and pieces individually up here the same stuff um sorted by name now this brings up an interesting point that there's a lot to be

**7:52** · said about organizing this project browser and every firm every person has their own preference so you'll find different kinds of organization this one is more of a out of the-box style Revit organization but just note that this will vary project to project the filled

**8:13** · in box just means that that view has been dragged onto a sheet and is being used and you can turn that on and off if you don't want those boxes but let us go to level one and start looking at the details of this as you can see it's all in individual pieces these are these are model groups of chairs this is an actual casework we have doors which are pieces we have Windows walls we

**8:43** · have furniture that there is a Furniture a table a dining table so it's just all a bunch of pieces and what's unique about Consultants electrical mechanical even structural is that we take this our architectural model that's a bunch of pieces and we link it into our model and it comes in as one giant piece so we can't actually highlight the individual pieces as easy there's a way to do it but it's not it's all kind of One Piece they've got some collection tanks now mechanical we don't

**9:22** · have HVAC or Plumbing designed for this project so that's one drawback on this project I can't show how we would collaborate and coordinate with those other trades you can link other trades in and see

**9:40** · their equipment you can see their duct work and pipe work so we can avoid it we don't have that so we're going to miss that step but we will at least get through all of the electrical connections and we will assume some mechanical units and things like that again a basic project just to show some of the basics and not get too complicated I think the most complicated piece of this project will be that sunken living room and that's only complicated because of Revit things like levels let's look at how that works now in these plans they've turned off their section Cuts you can't

**10:13** · see the section symbol so we will have to just find those ourself but here's a building section and this is one that has that sunken living room and what you want to look at here on sections is these things called levels and if you call levels are actually an entity within Revit that determines what a view is based upon what I mean is this level one is actually a physical thing in the model that a plan can be hosted to or attached to this level it's it's related to this level and

**10:52** · once you sent that plan up for that level you can't change it so thing about these levels is you have these little circles on the side that and if it's blue it just means that there is a a plan view set up for that level this level's being used for a plan so we've got they've only done it with two levels these other levels now may be used for other constraints um you know maybe used for other purposes but as far as what plans were done it's just these two now we're going to

**11:25** · have to copy these levels into our own electrical model so that we have those levels we need those levels to create our plan now we may not need a roof plan because in in this residential project it's just a gable roof there's no platform up here with a with mechanical equipment on it for example

**11:45** · like you might find in a commercial space but it's still good to have a top limit in your model that we can relate to as far as view range which we'll get into but that's how that's set up so and the other thing I'll notice too is that this project was done in metric these are all millimeters now we can still use this in our Imperial us-based project so this is sunken about 2 ft down below

**12:12** · and they did not create a separate plan view with that level some Architects will and so they would have this floor plan split into two pieces one piece with the upper level and another piece with lower level and then maybe combined them on the sheet somehow but in this case they've just decided to keep it all level one and what they've done is even though this plan view is

**12:39** · set up as level one and over here under extense we actually looking at the floor plan so under extents you will see Associated level right here on the right it is the level It's associated with is level one the entire thing and so what they've done is the plan is set at level one and the The View range if you recall the view range is a bottom a cut and a top primarily they have

**13:09** · it set up for these kind of levels the bottom is actually the level below the cut plane is at this level above the associated level and the top is hard set at this above the associated level so they've got their cut plane established but the bottom is the level below which in this case ends up being being that lower level living room so even up here we can see down below but there

**13:36** · since there's no basement in this it doesn't obscure things but we'll get into view range a little more then but the things that are in this sunken living room are actually as you will see hosted to level one living room so even though our view is set up for level one you can actually

**13:57** · Mount or host objects to the other levels so it ends up being hosted to level one living room with a zero elevation from that level if we were to host this to our level one then it would need a

**14:14** · negative offset to be down so you can see what I'm talking about it gets a little complicated when you have different levels but it's something that eventually you'll need to deal with and learn other things this whole living room could have its own view range there's a way to do that but anyway this is how they've set it up so we will mimic what they've done now here we can actually see the sections so click on a section and this is a section looking this way through

**14:42** · the house and again you can see things like we've got we got the elevation we can see the kind of the elevation of the kitchen and you click on that and that is a dishwasher we'll need to know these appliances a lot of times an architect will actually maybe do an En larged view

**14:59** · of this kitchen and point these things out to us looks like a cooktop you'll find as an electrical designer you're going to be trying to figure out what are all these pieces because the architect didn't explicitly call them out luckily here in Revit we can click on things and see that it's an

**15:15** · actually well they've got an induction cooked up they may have a basis of design model number that you have to look up to figure out what the load is but a lot of things at least um residentially are kind of a typical we put an outlet in for the range for example let's say a 50 amp outlet at 240 and it doesn't matter what model of range it isless is some special thing that needs you know 60 or 100 amp outlet but in this case we're going to assume it's all standard stuff same with

**15:45** · the laundry how are these set up in the laundry they're not called out we can click on that and see that it's the washing machine as you walk in it's on the right and on the left is a dryer so that's good to know again we have no mechanical equipment called out here also in our electrical

**16:05** · model we'll be able to cut our own sections and elevations and look at things as well so mainly from this model again I got the levels that I need to deal with they're dealing with two plans they're at well this 1 to 100 so we'll have to figure out what that is for us they have the site plan that's angled and we may have to figure out how that's done they are using a topographic surface they're using actual model trees they've actually modeled pieces now why I bring that up is

**16:42** · doing electrical work you'll find out that a lot of Architects do not model a site plan and for some reason they may just draw some some detail lines on here especially when you have commercial work with parking lots and such it may be done with detail lines the Curve are just detail lines well those pieces don't show up in a link so we'll Link in and Link in their model and look at

**17:07** · the parking lot and it'll be blank because those were detail lines not model lines or not curbs and things that are actually in the 3D model so this is nice that this stuff is actually modeled so it will show up into our linked plan so that's a note to your Architects anyone watching so

**17:28** · I think we know enough about this architectural model to go ahead and put that into our project so let's close out of this we have to be out of it to cl to link it and we don't need to save the changes so let's start a new project all the other thing I'm going to do is I'm going to try to do this using the outof thee boox templates and families

**17:54** · now that will be a struggle sometimes as you'll see but we're going to try it so let's use their in in this version we have an imperial systems template so systems MEP systems so we're going to use that template to start our electrical project now why it's called systems

**18:16** · what makes it special well mainly because they have some views set up already over on the left you see they've got some lighting views power views mechanical HVAC they've got Plumbing views so that's one piece it makes this an me template and they may have loaded some families they may

**18:36** · have done some settings if you go to manage and look at MEP settings they may have gone in here and got some things set up for us and let's look at the electrical settings this a whole dialogue box of all the behind the scenes stuff that Revit does but you know some of the wiring may be set up and they may have voltage definitions in here even Distribution Systems this is interesting because in doing residential we need a 12240 volt single phase or split phase system setup if we're

**19:14** · actually going to connect things together and make the make the distribution system work so again we're going to treat this residential project as a commercial project we're going to add up receptacles like commercially we would with 18 0va per each and just kind of a hybrid here to to teach how to do this but we do have the 208 3phase system and 480 3phase system like You' use commercially but we also have 12 volt single phase so it's single phase three wire 240 so that is a

**19:46** · good sign we already have that in here we don't need to add it now whether we have a single face panel uh we'll find that out later but at least we have the system and we can in here change things with and we're okay with wiring sizes but how wiring is shown and when we get into wiring we may come back here and change some of these things but I mean you can affect what the hot wire looks like the ground wire neutral you know is it slanted are we going to show tick marks always or

**20:15** · just on home runs so these kind of things we will be messing with as we go this will also point out to you how important your template becomes all right enough of that let's go back to the we only need electrical we're going to go to electrical power plan to start with and we'll see that it actually is empty this is where we can bring our linked architectural model in and you have to do

**20:39** · it into a floor plan if we were to try to do it from and we don't have any drafting views but if you had a drafting view open you wouldn't be able to bring that in so we need to be in a plan view or you know a ceiling plan and what we do is we just go up to we there's a couple places you can do this you can go to manage links right here manage links and add one from there a Revit link

**21:07** · because there's Revit CAD links we have images all kinds of links so you can do it from there or you can go up to the insert up top insert Tab and Link Revit so we want to link a Revit and we

**21:23** · need to find that basic sample project not that one basic there it is basic sample it's the RAC for architectural and we're going to link it now there's a number of positioning things we can do

**21:41** · we used to bring things in internal origin to internal origin but if you study Origins and project base points and all that coordinate system stuff in Revit you'll find that internal Origins

**21:56** · really don't mean much the thing that means the most is that project base point it establishes elevation it establishes rotation with North from North it establishes a north and south location so I've been bringing things in base point to base Point unless you have some kind of a fancy shared coordinate system that typically will work so that's what I'm going to use base point to base point so there is the architectural model just brought in and you'll see our template

**22:27** · has some elevation markers which you can delete turn off or whatever but I just like to move these out of the way and I do them by window because they're actually two pieces so now if I do window this way I'm I'm grabbing I may be grabbing the model and that's a good point to think about this model there's the model let's pin that up here under modify we're going to hit the pin we don't want that moving around and then if we window

**22:58** · I can move that now you also have over here under under the modify there's a select drop down you have selection check marks if you want to make sure you never select a link by accident you can turn that off and never want to select an underlay never want to select a pinned element you can do that and that will keep you from accidentally I can't even select that

**23:22** · linked pinned model anymore you can also get to those down at the bottom right for select links select underlays and so the same controls are down at the bottom of your screen down here but I'm going to get these guys out of the way I don't need those showing up all the time so that's the architectural file in now as you

**23:47** · can see I see everything here even if I hit Za for Zoom all I get everything now when I actually create floor plans I don't need to see the entire side site well couple things you can do here Escape out you can get to the crop there's a crop line here crop view over here under extents on the right there's a crop view this just means that I want to actually crop The View yes and then the crop region I want to see it it draws the crop region box and I can take

**24:19** · this crop region box and I can drag this down now I'm cropping the model not the grids the grids are annotative element that don't get cropped by this line so I'm going to pull this in close to my wall this guy I don't need solar panels in my building floor plan that's a sight plan issue

**24:43** · bring this in like this let's get how close we want some of that Outdoors to show so I'll just go to there I'm lining up with this end of the building and then the right one now do I need all of this I don't think I do for this plan so I'm going to bring this clear and close to the wall so there now I've cropped out everything else that's one way to crop a plan but now if I jump into level two it's not cropped I have to do the same thing I have to do the same thing to

**25:17** · all my lighting plant as well so there's a shortcut to this instead of using this manually adjusted crop view we're going to use a thing called a scope box I'm going to undo all that we're going to go ahead and draw that scope box that's under the view tab it controls the

**25:39** · view and right here scope box controls the visibility of data elements grids levels and reference in views yes it does but it also crops The View so let's do that and we're going to do a similar border we're going to start here and just click it once and then this drags As you move the cursor to there now that created a scope box and over here we have an opportunity to name it we will call this I like to call it something like building versus site apply that

**26:12** · so now we actually have a scope box and it's a 3D element if we go down to this created 3D view that's already created here we can see that this scope box is actually a 3D box and it can be dragged up and down too but it looks like it encompassed her entire building and so we're good there I think even we may want to go a little lower just to be sure so there so now

**26:40** · we have the scope box and it's named now we want to apply that scope box to this view that we're in we're actually in power so over here with this extent stuff down here there's a place to assign our scope box so we're going to assign the building scope box apply and there it went instantly cropped and the benefit of that now is that when I go to my second floor I can apply that

**27:08** · scope box and it's instantly cropped exactly the same as the other floor so you can see the power of that is it's kind of a like a template controlled cropping so I'll do that with all of these now one thing I'll mention on the ceiling plans here in a second there's two different

**27:31** · kinds of plans we have a floor plan and a ceiling plan and you can see they're both created here in this template if you get into the nitty-gritty of that you'll see that a floor plan is looking down on the floor a ceiling plan is looking up well it's reflected but it's as if you're looking up

**27:49** · so they display differently they show different things a ceiling plan you can get to the ceiling to put lights a floor plan you can't so what we've decided our firm has decided to only use ceiling plans for lighting some firms may do both they may do floor plan and ceiling plan we like it

**28:06** · all in one so we don't even use these floor plans for lighting I could just delete them but I'll just close it for now so we're going to be using the ceiling plans only and we'll get into more of that later the other thing I want to make sure is I have these things already made for level one level two but are my level one and level two at the proper place let us go to an elevation there's already a South elevation created and this is how you can see your levels so as you can see over here these end up being the architectural levels that were brought in and it's kind of hard to see

**28:39** · these with the scale we can play with the scale to make it make these smaller there we go so we can see these levels but we can't touch them because they're part of the linked model here's our levels

**28:55** · you can see I can actually highlight those and level one level two or just in my template let me drag these over so I can see them now when you click on it you'll notice there there's a tiny little circle and even gets smaller sometimes it's a tiny little circle that if you grab that grip and hold that you can drag it around now if I let go I let let go I you know I can't drag it

**29:21** · now if I was to drag it and continue dragging it be on the edge of this View and now let go I'm still dragging this while I'm letting go of my mouse so now I can drag these all the way over somewhere where I can see them and line them up now level one is at zero elevation and

**29:42** · zero elevation so these are already aligned these match level two ours is a little bit higher this level two is not at 10 ft it's at 3,000 millim now again I mentioned before that this model was done in millimeters our model would be done in feet and inches and it's doing the conversion for us but I want this level to match their level now the way you can do that is to go up to modify and find the Align tool or there's a shortcut as you see after a

**30:14** · line it says Al that's a keyboard shortcut built in instead of going to modify we can also just click on the level and that automatically opens modify to get to there or we can just hit Al I'll use the uh ribbon for now and a line Works where it says select the line or Point reference for alignment which means what do I want to align my my stuff to I want to go to this from from a

**30:45** · second from there so that pulls it down and aligns it and no need to lock it if it moves we will have to adjust it later another thing I show in my commercial videos is that our our actual template only has one level and we just copy and then monitor the architectural levels but this is

**31:07** · there's multiple ways to do it if you want to have multiple views already set up in your template then you need levels in your template to set these up and I've seen some Architects set up up to 10 floors in their architectural template so you know there's always two or three ways to do things

**31:28** · so this is how you would do it if you already had the level now we do want a roof line again I said it's nice sometimes to have an upper limit on views so let's go ahead and put that roof line in I also want to make sure my my lines are extended and they're extended way over here which is more than enough let's go ahead and add that now we can just right click on here and say create similar you can go up to architecture and add levels that that way over here but let's just rightclick

**32:02** · create similar I'm going to start and I don't care the height right now I going to adjust it later I can start you can see as I get close to the end of that it gives me a little dashed guideline to line them up it's not critical but I like to line them up and then drag it way over and then you can see my blue line lines up to line those up and it gave it its own name it just called it whatever we can change that click on there and change this to roof line if I can spell there we go would you like to

**32:34** · rename the corresponding views no I'll name those manually later and then let's do the align align to there from there and you can see the conversion from millimeters to inches gets a little messy but

**32:52** · that's what we want so now we have our three levels in our model and let's go back and see level two was close already so it's not going to change a lot another thing I'll point out right here is that this background architectural model automatically gets um half toned and out

**33:15** · of the box Revit is pretty light like right now these seem fairly faint these can be adjusted and this get we know we adjust this in our own template the way you get to that go up to manage and under additional settings and there's a couple places of settings we saw the me settings earlier

**33:35** · and then over here there's object Styles which you can get to things like lines and and line weights and all that kind of stuff and then you can get to additional settings which has more line Styles and things so there's a number of places that you'll have to get familiar with where settings are we're going to go to one called half tone SL underlay and this controls the transparency or brightness

**33:58** · of these half tones we're going to leave the underlay with the built-in pattern but we want the brightness higher right now it's at 50 I'm going to suggest we go to 70 you can just type this in manually you can also just drag it so that is a little darker if you want it

**34:17** · darker you can go to 80 whatever works for you and then the real test is when you try to print this to a PDF or even to paper what does it look like we do want it somewhat dim because we want our electrical items to pop out so that's how you can control that another thing that we do when we set up a project is see these grid lines you know Architects use grid lines and and and structur will use grid lines to show typically columns um walls they set up a grid pattern that's

**34:49** · meaningful to help us identify where things are so we want to mimic that now we have no control over these grids and maybe it doesn't matter for most projects it might not matter but we've run into issues where it does matter where this is in the way of a schedule or I really want these I'm zooming in here and I want these bubbles over here well I have no control over this at all I'm at the mercy of the architect so like we did levels we want to have our own grid system and this

**35:24** · is where we will actually copy the grids rather than putting our own grids in and making them all align it was fine with two or three levels but with this many grids I just want to copy these the way we do that is actually under the collaborate tab we collab it's kind of a collaboration to copy monitor someone else's link so that's the way to think about collaborate there's a copy monitor button and now which project do you want to copy monitor from but we only have one link

**35:54** · so we could say use a curent current project but for good practice let's go to select the link because eventually you may have structural Mechanical plumbing links so select the link and this even even though you have don't select links here this overrides that and lets me select a link

**36:13** · in my project so copy monitor select link it will let me select this link so there I clicked on it you couldn't see much but I actually clicked on the link because now I have things I can do I'm just going to go copy now monitor is only monitor if I do copy it will copy and monitor you'll find

**36:33** · out it's kind of confusing they didn't say that and then under here we have another little menu copy monitor we want to copy monitor multiple things at once we don't want to have to pick them individually so hit multiple now I can use different window techniques to grab just the grid lines I can start at the right and drag left and you'll see I have a dashed window which is a CR Crossing window and you can see these high highlight as I drag over them you can do

**37:03** · that and then if I want to do another set if I do this other set here oh the other first set's gone I have to hold control down to add more sets now I can do this with everything there's another way to do this Escape out of that copy multiple I'm going to window from I can left to right right

**37:24** · to left get the whole project in here and then use a little funnel it's a filter filters are are very powerful in Revit use a filter it shows that I have floors grids and walls those are the categories I have selected and how many of each I don't want to copy the walls I don't want to copy floors I only want to copy grid so there's all 14 grids selected with one window and say okay so that narrows down my selection set to just grids I need to finish the multiple selection

**37:59** · and then it kicks me out of copy monitor after it's done so it kicked me out I'm still not done copy monitoring it but it kicked me out who knows why go back to copy monitor now we can actually finish the copy the first finish

**38:20** · was to finish these multiple selection set second finish is to finish the copy now what you'll find is I can hover already over these and I have control now of my grids now they're they're tied together right now they're pinned together locked together which is which is nice I can control them individually later but I have control now where these grids are I have control on whether I show a bubble there or click on here and show the bubble here now I don't want

**38:50** · to move these around but I can control their appearance but I still see the architectural grids there as well well we can turn those off so now we're going to jump into a visibility SLG Graphics you're going to eventually know this like the back of your hand this is what controls most things in Revit not everything cuz some things are controled by phase and things like

**39:15** · that but most things are controlled by visibility Graphics if I go over here I get this giant window what's going on here visibility Graphics override and I'm for I'm in floor plan two so I'm in level two showing all the model categories there's also annotation categories and

**39:37** · imported categories and Revit links so we can get to all kinds of things so you can get to all these categories this is our model controlling our model we don't need to turn on and off our model grids we want to turn off only the the linked grids so we need to go over here to Revit links

**39:59** · there's our link architectural link and it's already half tone so we don't have to hit half tone again the display settings for that link are by host view what's the host view our model is hosting the linked model so we are the host right now our view is controlling grids we want

**40:20** · to turn off just the grids in the link so here we go there's a bunch of things you can do here there like I mentioned there's phase filters detail levels all this kind of stuff we want to go to custom and then we want to custom The annotation and grids are annotations so we want to customize

**40:38** · The annotation view again we need to go to custom because there's so many different things you can do here there's a few levels now we are looking at reminds you that we're in the Revit link display not our model we're in the link and we're going to turn off grids so go down here you see all the different categories of annotations tags tags tags tags there all different kind of tags right here grids we can uncheck grids and say okay okay now the architectural model grids are

**41:15** · off and all we see left are our grids so now we can control our grids and where they are I did this one here let's say I want it down here on all three of these now I have ultimate control on my grids and what it shows so what else do we need to do well we need to finish setting up our plans we have our power PL set up and cropped and we have ceiling plans set up and cropped now we

**41:40** · need to control what do we see in each of these views for example first floor power similar to the scope box that let us apply a crop to every sheet we can set up view down here view templates a templates for the appearance of these views that we can apply to other views right now with just

**42:03** · two views two floor plan I don't have any other plans I may only have to set this up twice and I may not need to use a template for everything but I think it's good practice to get used to setting up view templates for use so we're going to do that now again our project template don't get confused project template versus view template our project template that we use has a number of view templates already set up but even those need some tweaking when you have a linked model

**42:34** · unless you are starting from an actual Project based template so what we're going to do is do a view template there's none assigned to this view right now we're able to control everything view range and everything from here and that does bring up a good point is that we haven't dealt with view range yet we will deal with that in this template so we are going to look at templates now there's a few out of the box templates we can let's say if we try this architectural plan so as you see architectural plan has the same categories here as we do over here but these are the settings

**43:11** · within a template called electrical plan so it's got it setup for 8 inch and this column here called include tells you what's included in this template because sometimes you can not include things in your template for various reasons so right now they haven't included any color schemes and and underlay orientations in the view in the view template they're letting us control that with each view but most things here are controlled in this view template so that we don't have to set them on every view so we have our model overrides annotation overrides and you

**43:48** · can see they're broken out instead of just one button they've got individual ones just as if you went to the individual tabs up here so we have scale set the detail level of this view is set here now what is detail level as we'll see your families look different depending on the level of detail you pick there's a coar medium and fine on a course view Plumbing may look like a single

**44:16** · line conduits may look like just a single line but in fine view they may look like a 3D pipe 3D conduit with fittings things like that so that this one is set up for medium and we can tweak that stuff the overrides we just did on that Revit link are not set up in this but let's just change the electrical plan and see what it does it doesn't look a whole lot different now they called it electrical plan not power plan not lighting plan so this template is set up to show anything

**44:52** · electrical all in one plan now that does bring up a good point is to how many different plans do we want and what do we want to see on each I think Architects if they were doing an electrical plan they would put Power and lighting and even you know technology T AATA things like that all

**45:15** · on one view one plan because they're not going to the level of detail on that that we would as electrical designers so that's why we are breaking this up into a separate power plan and a separate ceiling plan for lights and we would even could even have a separate technology plan if we want sometimes we'll combine technology with power again it's a decision on how you want to set up your set of plans it boils down to we don't want lighting showing up on a power plant so we need

**45:47** · to turn these lights and these are lights in the architectural model we need to turn those off long story short we're not going to use the built-in view templates we're going to set up our own so let's get out of this electrical plan we want none we don't want that view template we are going to create our own and what I like to do is set things up the way I like and then I create a view template from that view so like for example in power plan if I rightclick I can go to

**46:17** · create view template from this view so once I have everything set up I can create a view template and use that view template on the other power plans so so that's how we're going to approach this so let's get this one set up the way we like now what happened is when I switched over to the electrical template it undid what I had just done for my architectural so keep that in mind too if

**46:43** · you switch to other view templates a view template it's going to counteract what you had done because my what I did was not in a view template so we have to redo that the other thing that can happen usually commercially is you might see other architectural things that you want to turn off I don't see it here but sometimes they'll have an ADA door surround that little dash line that

**47:07** · shows the Ada clearance and we don't typically need that on our door so we could turn that off so there may be other architectural things we want to turn off but we're going to quickly go through and just redo this as a practice we want to go to the Revit link We want to make it custom we want to customize the annotations and we want to go down to grid and turn the grids

**47:30** · off so we just redid what we did before but as you know the more you practice the better you get so those are off now we want to turn the lights off so let us go and turn those lights

**47:48** · off now I could turn the lights off here and it would turn off in the revvit link however we are going to apply custom to the model categories as well in our Revit link so now we're not going to

**48:04** · be controlled by the host anymore so we do have to turn them off here so we want to turn off while we're at it let's turn off any electrical equipment any electrical fixtures any fire alarm and let's turn off there is no mechanical equipment in here but you can turn off a lot of

**48:24** · things in the architectural model that you don't want to see sometimes you want to turn off this there's one that jumps out of me as Entourage this guy has people and vehicles things like that well we don't really need to see those they're not on our way we'll leave them on for now but sometimes if they put little people inside the building we don't want those showing so let's go down to our lighting lighting devices and lighting fixtures we'll turn those off here now when we get to the lighting plan it'll be a different story and we'll talk about that

**48:57** · when we get there but we don't want lights on our power plan we're going to leave furniture on because we may want to align some power devices like receptacles maybe we want some floor boxes underneath some of the furniture or things like that so we'll leave that on for now it's nice to know where the television it's planned to go so we can get facilities for that so I think that's a good setup for the power plan so let us now an E8 in is a good

**49:26** · scale for us we're going to create that view template now create a view template well it wants us to save the project and that's fine I haven't given it a name yet so let's go ahead and and that's not I don't want to under XR I want under electrical we're going to call this tutorial residential I like to call it electrical and I like to give it the

**49:57** · version R23 all that in the name and I only need one backup there we go good idea to get that saved early on and named properly your office if you're in an office may have your own naming convention now I'm jumping back into my creative view template so I'm going to call this ER for electric grub I like to give it a name in front of it we're going to call it power plan

**50:34** · because it's not lighting and I'm going to give it the scale because scale is baked into this so now I have ER power plan good now it doesn't always assign it yet so now I need to also assign it to ER power plan there now that this has a view template I cannot make changes here all of this is grayed out anything that's tied to that view template now I cannot change here now we saw some

**51:04** · of the color schemes and stuff wasn't tied to that but things like view range as you I can't even get to that button so the view range now is controlled by the view template and to change anything view range I have to go into the template and then change it here view ranges here now so you can see all this stuff is brought back in I can't change the detail level it's gray out so that's what's going on there it means it's template controlled but that does mean that I can jump into my level two power plan and assign this view template ER power plan and everything's controlled by

**51:41** · that now let's get into the view range issue and perhaps let's cut a section let's go to the power plan and let's cut a section through here way we can do that is up top in the quick access bar we can go to section and this is really handy to just cut a section wherever you want start there and drag this over try to keep it parallel and then if I double click on the pointy head there it opens up a section and it opens up a section and it's a discipline called electrical if we had electrical

**52:14** · devices in here it would show all of them and like a like a x-ray vision but let's look at that so as we're looking at view range now we see that these two levels have different Tops This may affect us

**52:33** · more when we get into lighting because the roof line that they've established may be the where the eaves are in fact let's go here and cut another section um let's cut a section this way yeah see so the roof line is up here at the bot the start of the roof

**52:57** · the second story has a lot of vated area above it that may cause problems with our lighting so we'll have to adjust that there may be something we need to deal with if there's any kind of fan ceiling fans hanging up there so we'll have to keep an eye on that and see if we need to adjust and what would that do with our view template that means we may need separate view templates for level one and

**53:22** · level two that happens a lot commercially a lot of times level one is taller it's the opposite here we can do that you know again with only two views it changes really how much we need to worry about view templates because if we only have one view that uses that template why have a template the template's made really for duplicating the same view elsewhere but it's good practice to get used to the other thing you can do is we could actually disconnect the view range pull it out of the

**53:52** · template and let each floor dictate its own view range and again depending on the situation that may be the choice couple different choices getting ahead of myself we're going to be fine with this for now so the last thing I want to do as far as setting this model up to get started is dealing with the work sharing issue now you may have heard that Revit has a work sharing option that allows multiple users to be in the same Revit model working on it at the same time which is pretty

**54:25** · ingenious if you think about the old CAD systems where only one person at a time could be in it so we don't really need that set up if you're just a you know SLE proprietor working on this project by yourself you have no one else dealing with you no one else in your project you may not need it now

**54:43** · if you do use things called work sets we can't see them here but work sets for visibility or for turning things on and off for possibly for performance issues then it needs to be workshared project we're going to use filters to turn things on and off here instead of work sets

**55:04** · I'm trying to work more into the filter line of thinking so you may not need it but I like to do it we use it commercially in our firm so I want to show how that's done so it gives you complete picture if you don't need it you can skip this but the way you do it is you go up to the collaborate Tab and I looks like I'm already there and there's over here collaborate and then there's work sets

**55:29** · so we want to hit the collaborate tab we need to save the model before we can collaborate all right that's fine we can save it it wants to make sure we have the latest and greatest now collaborate you can collaborate within your own network or out in the cloud now you need to have a special typically a special license to do this Cloud collaboration and you know firms do that kind of thing but for us we're going to go within our own network okay and right now behind the scenes it's

**56:04** · just doing its crunching to make it collaborate on a larger model it'll take a while because it looks at each View and things like that so if you have a you know a 10-story building it's going to take a while this was quicker now it didn't do much but it's set up but before we can actually

**56:22** · use that collaboration as such we need to save this as what's called a Central model and the central model will live somewhere on the network a central location we put it on our main file server so that other people can get to it so let us go ahead and save it and I hit save as project not Cloud project and I'm resaving what I'd already done but now it's going to be saved as a central

**56:51** · model and options look at that it wants to it wants to give me 20 backups well I'm fine with one because we do our own nightly backup and just say okay and hit save and I'm just saving over the old single model now I'm putting in a Central File Central model so collaborate set

**57:13** · up work screen save it as a central model and then get out of it now when I reopen it you'll see I have some new options so let's go to tutorial res credential electrical not the backup with the 0.001 now down here you'll see some new work sharing options create new local

**57:37** · that just means it's going to take that Central model on the server it's going to create a copy of it onto my local hard drive for me to edit and every now and then we're going to syn with each synchronize with each other so that I get the latest updates from the Central that maybe somebody else is doing and Central gets my updates so that's the collaboration part we don't want to

**58:03** · detach this that's another step that we do for other reasons later that we'll cover but for now we want to create new locals so every time we open this we want to make sure we open it from the server and that we do create a new local because the old local will still be on your local hard drive you do not want to open that because now you have an old version of your file so that's how it works sharing Works other than that it's pretty transparent you'll see down at the bottom now we have this thing called work set this is a way to divide your workup into further categories if

**58:38** · you will not quite layers but it it's segregates things into pieces so in a large model you may want to have half the building on one work set the other half the other so you can turn it off and not affect performance a lot of people use it and we used to use it for visibility control I'd put my site stuff on a site work set so I can turn it off on my building we've learned that using filters is a better approach for various reasons which we'll cover in the filter

**59:09** · lesson but for now you'll see that it puts your username on here mine's just email address it'll put your username up there and that lets you know that you're working in a local file and now instead of just save you get a button next to it called synchronize so if I hit synchronize now it is synchronizing my local file with the central file and of course nowadays a lot of

**59:34** · firms will put a central model in the cloud that multiple physical geographically remote locations can get to and collaborate on through the internet so the last few things I'd like to do to get this model set up for this first lesson is go to my ceiling I want to do the same type of things with

**59:56** · the grid here and remember I have not assigned a view template to this yet so let's go ahead and practice we'll go to the same thing we're going to the Revit links and I can do it here now because I don't have a view template so I'm doing this first and then I will create a template from it and we want to make this custom we want to make The annotation custom and we want to turn off grids okay okay so those are turned off now I have my own grids like we talked about before now what

**1:00:33** · about lighting eventually I'm going to be bringing my own lights into my model now some people might think why not just use the Architects lights well we are going to connect our lights electrically we can't do that with a linked light furthermore even if we could Architects typically Link in lights that have no electrical connections that's not their thing so we are going to be reproducing our own lighting families into here now also what level of detail do we want those as electrical

**1:01:08** · designers and Engineers we are not creating a rendering kind of Atmosphere for this model we are just it's diagrammatic mostly we want it for the electricians to know how to connect things up so we don't care that it's ultimately you know beautiful visually we get close but we

**1:01:30** · mainly are looking for things to connect so we're not going to need the architectural lights on in our model when we produce it we may want them on in the interim to help us line our fixtures up with theirs so what we can do is we can turn them off in our what I would call

**1:01:50** · production view or sheet view the view that gets dragged into our construction documents but we can have them on and yet another view that we can we can create as many views as we want with different things showing we can create a working or coordination view that has their lights on so

**1:02:09** · we will get into that right now we're going to set up our our production view our sheet view so we're going to turn those off so again we're in the Revit links make sure you're in the Revit link and we have custom set up now we're in the Revit link display settings into the model category we need to make that custom as well and then down here again we're going to be turning off electrical stuff fire alarm stuff and then we want to turn off the lighting devices lighting

**1:02:46** · fixtures okay so now those are turned off so in our production view we're not going to see those let's go ahead and create create that view template the way we do that again right click create view template from this View and our new name ER lighting ceiling 8 inch to remind us it's a ceiling

**1:03:14** · plan and it looks good and then we want to assign it to the ER lighting ceiling and then we also want this one to be the same we may adjust a view range later that gets us started the last thing

**1:03:35** · I'll do here is I like to rename these views now when I drag these onto a sheet eventually I can give them their own name on that sheet that shows up in the title block down below but I still like for my own you know organization and for helping us as we go through I like to change the things rename now the number in front helps them sort and I've used things like you know .1s and

**1:04:04** · things like that but for a simple project the one and two works so I'm going to leave it as two now you can call it floor plan ceiling plan whatever you want it's based on a ceiling plan and it looks up at the ceiling but electrically we often call these just lighting plans or floor

**1:04:23** · plans lighting because sometimes we'll show lighting that's not on the ceiling it may be under cabinet it may be you know on the edge of the floor things like that so it's really a floor plan for lighting but Call It Whatever You Like what makes sense for you and let's go I'm going to go first floor \[Music\] plan you can call level one lighting level two

**1:04:59** · and frankly a lot of this has to do with the architect you're working with and what they're calling their plants make things match power again your company may have its own naming conventions okay now the 3D view we're not setting up yet we may do that later as we go

**1:05:31** · but for now we've got the basic plans the B basic views that we need to start doing some electrical work so this concludes the first lesson which is setting up your electrical model getting the architectural LinkedIn and setting up your views so stay tuned for part two welcome to episode two

### Episode 02 - Placing Receptacles on 1st Floor

**1:05:55** · of the full project residential series that we're doing here on electric Rob Channel we're going to be covering things like adding room names to your project and some of the pitfalls you may fall into with with the room tag issue we're going to look at downloading some content from Autodesk cloud we'll look at placing receptacles assigning loads to receptacles we'll change the scale of our drawing we will get the mounting Heights set for these receptacles and associated with different levels of our building so stay tuned for an indepth electrical video so here we are

**1:06:31** · in our residential tutorial project and I'm on first floor plan power I plan to put in some room names now how do we get room names into this thing we don't want to just type text if we don't have to we'd like to use the built-in room tag tool in Revit so up here under annotate we go to

**1:06:52** · room tag this may seem like a very straightforward simple thing to do but sometimes you'll run into roadblocks and I'm glad we will on this one so we can show you how to deal with them nothing like the simplest things driving your nets so here we go room tag first of all rooms are not currently visible in this view a view template is assigned to the view in order to make rooms available The View template needs to be edited or removed so by default our view template did not have rooms

**1:07:21** · turned on which are a physical entity in Revit so we need to manage our template and get those rooms turned on and they mean in our model so we're going to go to our model here not the Revit link our model edit that and we're going to go down to it's a actually a model category it's a 3D piece down here under rooms and we can see that rooms is not turned on we're going to enable rooms okay okay there now we have rooms enabled now we go to room tag and I'm hovering over things now I've

**1:07:59** · already gone back and checked the architectural model the original model and found out that they indeed have rooms set up in this project so we should be getting some kind of an indication that there's a room so there's another thing going on other things you can check and this is again I'm glad this happened so we can review this other things you can check are to make sure and we can't do it there we have to do it in our view template make sure that room tags are also enabled That's

**1:08:32** · The annotation portion of the room tag down here make sure that room tags are enabled we're good there in our model let's go to the Revit link make sure that rooms remember in custom and we are going to the model to make sure the rooms are enabled in the architectural link rooms are good there and let's check The annotation make sure room tags we have a lot of places to check here make sure the room tags are good there so all of that stuff is enabled and we still cannot get

**1:09:06** · to room tags there's an obscure issue here with this linked architectural file and it comes down to kind of a more advanced topic that we usually don't cover till much later in a lesson but it's called phases Revit has built-in project phases so that what I mean is phases in time or you can have

**1:09:30** · an existing point in time where you show maybe it's a remodel project and you have an existing portion of the building that's only half of the building and then you have new construction which is this Wing coming out and you can have those in different phases so that they can be turned on and off down here at the bottom of this view is the phase filter and it's gray out because in

**1:09:54** · the template we says we want to show All Phases and which phase are we currently modeling in the new construction phase because the existing would be nothing this is a brand new building so that

**1:10:09** · seems okay but what we need to do is look at the phasing of this model now the way you do that is click on the model I've got this set up here so that I can select it click on the model and there we have clicked on the link link now we need to go into the it's a type thing type parameter we need to go into the types and clear down at the bottom there's other phase mapping again this

**1:10:38** · is Advanced go into the phase mapping now if you had a project where you had a remodel and there was an existing phase and a new phase and maybe there was a phase two phase three you would need to map our model to match the architect's model why their model have phases well look at this

**1:10:58** · our phases are existing and new the standard out of the-box phases the architectural link has existing and then one called learning content so these don't match we're looking at a learning content phase which because this architectural model was set up for trying to teach how to do

**1:11:17** · things they had a looks like here they had a separate phase called learning content which had I don't know if you recall when we looked at the model but it had some question marks that you could click things like that so they put that on a whole separate phase so they have existing working drawings phase and learning content phase well my hunch is that the working drawing phases is what we want click match our new construction to their working drawing phase click okay first of all it's not so dim so that acts more like normal because usually we have to go in here and change

**1:11:57** · this to a halone and the other thing is when I click on it now I see these x's and these X's indicate rooms so the whole key here is that the architectural model phasing had this extra phase

**1:12:14** · called learning phase which did not have rooms in it that was linked so that's a good key for any future projects if you have trouble with room names things like that check the phase so let's move on with now that we have that fixed so back up to room tag now as we hover

**1:12:32** · over a room you will see they work so we can put kitchen dining this whole area is Kitchen dining all one area we can put this somewhere where it mostly will be out of the way we can always move it that's the joy of having our own room tags we can move them around and we need them typically in different places for a power plan as we would in a lighting plan so let's get these in here it gives you a name and a room number and that can be controlled if you

**1:12:59** · click on there over here there's two different room tags built in to Revit room tag and then a room tag with area so if you're looking for some areas and you know typically residential load summaries are handled a lot by area so we may need that later but right now we're just going to tag it without the area just to get the name in here and this is a hall and they don't have the stair stairs tagged separately which is fine this is the living area so second floor power same thing go to room tag now you can also go to tag all and click room

**1:13:39** · tags down here and see what happens and it puts them all in for you and then you can move them around to suit you but that's kind of a shortcut there now some of these areas don't have rooms

**1:13:54** · like this outer this deck and this side out here so if we want a label we can just use text for those but I would recommend doing the same for the lighting when we get to the lighting plan but for now we're good with power so we have that done now we can deal with this half te issue because this is fairly dark and we do that in our view template let us go to our Revit link and there

**1:14:19** · we can apply the half tone I also like to make it an underlay which just means that if you think of it as layers we want the architectural plan to be behind or under our line work so the the architecture doesn't obscure our devices in our line work so what we want to do next now is to actually get let's get to do some electrical stuff finally we want to get some receptacles

**1:14:45** · and power connections into this model like I said before we're going to try to use as much of the outof the-box Revit families as we can because I know customizing families is an advanced topic and many of you aren't ready for that yet you're just learning how to do this and so I'm going to try to do this out of the box as much as I can to minimize the learning curve of getting things started so let's see what we have in our model right now for families down here under electrical fixtures familyes electrical fixtures we have a duplex receptacle and looks like we have already

**1:15:20** · brought in a special purpose receptacle now if you don't have that we can bring in some more families so a standard duplex let's look at that and we can just drag one in you can also go up here to the systems menu and find the electrical pieces here you can go to device and you can go down to electrical fixtures and you can click on that and then it will give you a drop down that

**1:15:45** · you can click and find the receptacles that way that's one way to do it I like using this project browser as kind of an old school tool palet so I just drag those in from here another way you can do it is you can create a separate plan that has all of these in it and you can just create similar from there there's a number of ways to do this but let's just do this we're going to drag it in now you'll see that I can't just place this anywhere it is a face hosted family so it wants me to place

**1:16:16** · this on a face now what's funny is it considers a grid line as a face so that will kind of mess you up especially somewhere like here where you have a grid line line right along an actual piece of wall or Cabinetry so that will mess you up but let's find a clean wall right here so if we get close

**1:16:35** · to that now this receptacle is set up for the the two lines hitting the wall some of receptacles are turned around I've even seen receptacles that was just a circle with two lines in the middle and no lines extending from it so whatever symbol you're used to if you're trying to use out of the box this is the one you get so right there it will let me place that if I go too far it tries to flip it around to other things so you have to get a little careful to get that guy right there and click it and there it is now a question mark popped up just because this receptacle has the opportunity

**1:17:08** · to put some kind of a label in here but when you escape out that's what you get so I should say since we're doing kind of a residential plan here there's a lot of code implications to residential receptacles in fact there's more code implications to residential than there is for commercial so it's a much tighter code and it's there for safety we don't want people running extension cords across their room to power things or through doorways or across doorways things like that so I recommend studying up on code section at least 210.52 I'm not doing a code class here there's

**1:17:43** · plenty of other places on YouTube you can find things and on the internet such as Mike Holt is a great code resource he's been doing that for decades and a great resource I found to study up on a lot of code issues is also Ryan Jackson I'll put a link to his YouTube channel Down

**1:17:59** · Below in the description and you can check it out he has a three-part series specifically on residential code interpretations for receptical locations and circuits that I find very helpful and our firm uses that for a lot of reference as well so shout out to Ryan but I'm going to try to hit the major points of this and I may miss a few but I want to teach at least the basic steps for getting receptacles into your projects and getting them circuited up so we're going to follow the typical what they call the 6' 12T rule which is where when

**1:18:29** · you need a receptacle within 6 ft of the end of a wall and you can't have more than 12 ft between them such that a 6t cord along that wall can reach anywhere that's kind of the basic rule that when you get in the kitchen you've got receptacles needed above the counters you've got receptacles that you need for the appliances recepticles on islands and peninsulas things like that so we're going to try to hit as much of that as we can to get things laid out so this is just a standard receptacle 120 volt let's look at that edit it's a voltage of 120

**1:19:03** · load classification now this is used mainly in commercial work where we need these loads to be classified by what they're used for by the load so that an appropriate demand factor a calculation Factor can be applied to it some things need a 125% demand Factor like lighting other things need need less so that's under load classification and you can see here I'm not there but right here

**1:19:32** · you get the list of load classifications that are built into Revit so there's a lot of them we've got Clos dryers and ranges existing loads equipment elevators heating all kinds of lighting so whether you have a different demand factor for this or not you can still divide things up by load types to help you get idea for how much load you have of each type and that will show

**1:19:58** · up in the panel schedules that we do again this is residential and we're kind to doing a hybrid using commercial calculations right now just to demonstrate how this works so we're just going to leave this as receptacle and then over here you'll see it says demand Factor well it gets confusing because the demand Factor has the same name it's called receptacle and here's similar demand factors for these load classifications very rarely are they a different name but what happens is in the receptacle if you look at the details of it there is a calculation going on in here and

**1:20:35** · this can be customized for other types of loads but the basic idea is the calculation is by load not by quantity and following code rules it's the first 10,000 first 10 Kow or KVA is 100% of that

**1:20:53** · load and then anything above above 10 K KVA is only 50% and that's based again on the NEC but that is done here for a number of different kinds of loads so that luckily is already done for you in Revit so we're just going to let that be with a demand factor of receptacle load classification receptacle we just want to briefly cover that that that is all variable in here 120 volt and you'll notice that there's no option here for a multi-pole like a 240 volt Outlet this is strictly

**1:21:25** · a single pole 120 volt which is great for this receptacle another thing I want to mention is you didn't see me do it because I did it in between episode 1 and two but I changed the scale of my drawing to quar inch you look down here a/ qu in because this will be detailed enough or a/ quar inch will be nice I could just enlarge the kitchen at a/ quar inch but if we look at the

**1:21:50** · size of this building and and we kind of cheat and look at the size of the sheet we find that it fits on there so I only did it on this one view template and I did not carry it through so let us just review how to do that as you can see my my name of my view template still says 8 in so I need to fix that but what I did is I went in here and I go here and I just simply changed the scale to a quarter inch and what I want to do is I want to rename this to make it the right name just so

**1:22:20** · that doesn't confuse us and we'll do the same with the lighting let's jump into lighting do that right now see it's still at 88 in so let's go here simply change the scale to a/4 in and let us rename it to a/4 inch there we go now that will affect the size of all of our symbols so there we go that's why the

**1:22:48** · symbols aren't too huge but the next thing I'd like to look at is these symbols don't really pop out of the plan they're kind of just fading away as far as line type goes they're they're very thin even the architect is thicker we need to stand out more than the architect of course so the way we can do that this is a symbol which is ends up being a generic annotation category now custom

**1:23:13** · symbols that we make typically we try to change that line type so that if we change the generic annotation in here we're not changing the generic annotation for everybody but let's us change the generic annotation line weight here and the way we do that is we go up to manage and object Styles

**1:23:32** · over here on on the left object Styles this is where you can get to the line weight of these categories you can change colors line patterns things like that too we need to change the size of the lines for the symbols so we want to just go down to annotations we want to go down to generic annotation generic annotations and right now now it's set for one which is the smallest line type

**1:23:58** · I like to punch these up to about four and I'll leave it black and solid so that as you can see makes it nice and thick and it stands out a little better when we print it so there I think we're ready to send these around I'm going to start with this room which is a we've got the kitchen and this is a dining area we're going to call this kind of a kitchen island which isn't exactly

**1:24:28** · against the wall but it's close enough where I would think that an inspector someone reviewing this analyzing this would say that this is not an accessible portion we can't get back here to plug things in and this is a permanently mounted cabinet if this was just something on Wheels it'd be different but this is Perman Mount cabet so I'm going to consider this all part of the you know part of the wall not behind so we're going to start at this Edge and the basic idea is to be not

**1:25:00** · more than 6 ft away from the end of this wall well how do you measure that well you can start using Dimensions if you want but then there's nothing left to Dimension it to we can Dimension it from here to a receptacle and then you can move the receptacle around if you want to get that that's one way to do it so that's under 6 ft give it a little extra room I don't like to be right in the edge another way you can do it let me get out of that is you can simply go to an annotate and

**1:25:28** · just draw a detail line and so I will typically just draw a detail line and I'll come out oh 56 59 something like that to give myself an idea and then I'll place a receptacle so that will put the receptacle not further than 6 feet now the next thing is what am I mounting this to I've got it on a wall but there's what is this thing here so let's go ahead now and try draw a section double click it now we're looking at that South Wall right in the middle of the cabinet now this

**1:26:04** · is where you may want to change the view from electrical to what we call coordination that will change the look of it so it looks to me like we have window see the glazing we have window all the way to the floor along this so that's going to be fun for our receptacles so that's what

**1:26:25** · I was afraid of is that we have window all along this entire living space well looks like the owner of this building gets to invest in some floor Outlets the other thing you can do is you can hang an outlet from the ceiling on a cord but I don't think that's going to be the preferred option here so we are going to be getting into floor Outlets so now what do we have for floor Outlets let's go up to the insert and right here you can load a family from your from your network from your local hard drive wherever or you can jump over here to load Autodesk family from the cloud so this will

**1:27:00** · link us to Autodesk families they have quite a bit here and this used to get loaded onto your computer in previous versions of Revit but now it's just online so let's go to electrical now I

**1:27:19** · covered a lot of this in my other video which I'll link above which covers a lot of the out of thebox content you can get from Autodesk and I covered that there's an architectural tab electrical panels there's a floor box Outlets things warning against using architectural families they do not typically have electrical connectors built in so we can't connect them to our circuits they are purely for for visual so let's get back out of there we want the MEP type of family

**1:27:55** · now we have Standalone connectors if we want to just connect something and not actually place a physical model we may use those later and then we have power and this just Narrows down the search so we have appliances fans hair dryers hand dryers heaters we may need fans for our mechanical equipment but for now we're looking at terminals which they call receptacles devices things like that so we have receptacle countertop disconnect double pull duplex receptical duplex receptical top switched emergency switched high voltage do we have a floor

**1:28:32** · box it looks like we do not have a floor receptacle we can see if the architectural floor receptacle actually has power let's load that and see what happens now where is it let's see Outlet floor well because it came into electrical fixtures this might be promising

**1:28:56** · and there let's let's us put it on the floor we click on it you get no power connection that was my fear and you go to edit type there's no electrical connection now this may be an opportunity to actually edit a family either way to get a floor box we may have to edit some family so we can either edit this architectural family and simply add an electrical connector which I think may be the The Chosen route or we can create one from scratch that's much more advanced I think

**1:29:28** · what we'll do is we will eventually just edit this floor box to have our electrical connector for now we're just showing receptical so we're just going to leave it as is so we can get rid of that guy and put this one in instead so there's a floor box if you hit space the number of times it rotates it and it has to be by code within 18 in of the wall so we'll just put it there for now this is just as we know diagrammatic we're not dimensioning these a lot of times an architect will come in now and dimension this for us let's go to the next one and keep moving along we're in general we're going to

**1:30:04** · be measuring not more than 12 ft along here I don't see any operable doors out of this first floor so we don't need to worry about watching out for doors so we're going to go all the way around this with our receptacles so I'll end up speeding this up so you don't have to watch every measurement but I do my typical let's measure 12 ft let's go to about 11 and I can now just copy

**1:30:34** · this and then I have to C go around the corner from the wall so I'm here about 3T so I have another 9 ft I can go so let's go about 8 and 1 half to be safe

**1:31:02** · now we get to the hallway there's a different code rule for a hall in that if the hall is longer than 10 ft you need a receptacle so we know we need at least one receptacle in here I like to go above and beyond sometimes just cuz I've seen Halls done so poorly I'm going to copy this guy 12T roughly here we can use a standard receptacle now that we actually have a

**1:31:27** · wall so let's drag that back in the duplex standard and get that in here we can Center it on this wall again these are all design decisions that you'll have to make there so we have receptacle receptacle there that should cover that area now these as we saw

**1:31:52** · in the architectural model when we looked at episode one click on it for a linked model I'm just hovering over it and hitting tab to get to it and eventually you get there and then you can see that this is and it doesn't drop down but it it's a piece of furniture so it is not a built-in cabinet that I need to worry about we got that now let's work on the kitchen Now kitchens are

**1:32:19** · tricky because we don't always know where the appliances are even the architectural plan that we looked at did not point to things and call them out some Architects will do that and I think that that that plan may you know not be completely ready for bidding or construction so there's a few things missing so we will have to do our best here it looks like if we hover over it we get a little bit of note if you read that whole popup there without clicking it generic models melee induction cooktop so that's a cooktop we need a receptacle for that cooktop now we don't know the

**1:32:53** · electrical specs for that cooktop we don't know if it's a 120 volt a 240 volt is it you know 30 amp 50 amp what is it so you may need to get cut sheets from your architect you may have to go out and find it yourself based on the model number for my purposes right now we're going to assume that we looked it up and found out that it is just a 30 amp two-pole cooktop so a 30 amp 240 we're

**1:33:18** · going to say that's what we looked up now how do we get a 30 amp 240 volt Outlet in here I'd already downloaded a special purpose recepticle that's from that Autodesk site and let's see what that does drag it in and you can see it's trying to latch onto things but it is a face hosted recepticle as well and we're eventually going to mount this to this back wall of this

**1:33:46** · kitchen counter so right there let's click on that let's see what that is it's surely a different symbol and comes in at 1 6 we we can leave that there it's going to be behind but what is it electrically it says 120 volt 180v which is kind of a standard receptical load it's single pole only there's no choice for two pole so this is just a standard receptacle that with a different look now we need to find a receptacle that we can make two pole 240 volt but that's not it what do

**1:34:23** · we have load from Autodesk and we're going to go get away from this architectural cuz as we saw it doesn't have connections MEP electric power terminals don't know what a cleaner septic glist countertop we can look at that and a double pull switch a duplex Outlet we already have this is a duplex Outlet top switched high voltage receptical let's try that one and eventually we need switches

**1:34:54** · quad receptacle there's a 220 volt receptacle that might be promising we'll have to see if it's two pole though so we already have special purpose so let's bring those in so we simply

**1:35:09** · bring those in and they will populate over here in our project browser under electrical fixtures so let's look at this 22 volt receptacle see what's going on here pull that in and it's it's got a nice different symbol and sometimes you find you there's something there in the model that causes this it may be a column who knows what it is so you may have to find somewhere else to do this and then drag it over sometimes I end up putting a receptacle here dragging it in let's look at it 220 volt single well that's more like I would say like a European type of connector that's just

**1:35:48** · line to neutral single pole but higher voltage so I think that's what that is and we cannot change that it's hardcoded into that electrical connector so again this doesn't work I do like the symbol so

**1:36:04** · now we're into a high voltage receptacle let's try that it looks like a standard recepticle as far as the symbol theyve filled in the middle which for our firm means above the counter standard receptical so here we have a symbol issue that we have to deal with if we're going to live with Revit built-in we're going to have to live with their symbology and we can just call this out with a note but let's take a look at the electrical this is looking better 240 volt two pole see the number of poles is a parameter that we can change so we have access

**1:36:43** · to this luckily it's already set to two and it's 240 volt which is what we want Line to Line and then the load of this we decided that if we're using a 30 amp outlet well 30 amps at 240 is like 7kw let's say that this thing is we found out this is a 5kw more like a dryer

**1:37:06** · because it's just a cooktop so we'll say it's 5kw so now we have our cooktop now as far as tagging this we would need a tag that reflects a parameter within this and let's see what we have for tag for receptacles question mark let's see what that is this is a electrical device panel tag well

**1:37:33** · we don't have assigned to a panel and then we also have an electrical device circuit so we can either tag the panel or the circuit is all we get out of the box to do this now we can look at other tags in the load from Autodesk and at if we go to all results up here annotations there's lots and lots of tags so electrical tags annotations where's our tags down at the bottom we have wire tag and wir tag panel with panel and circuits well we may want that let's

**1:38:07** · load that one but let's see if we have anything about we have conduit cure conduit tick marks if we have anything for electrical equipment let's look at equipment electrical equipment tag electrical equipment type that's equip not fixtures electrical device

**1:38:28** · circuit electrical device panel so device circuit device panel are what we already have now here they're calling it device not fixture electrical equipment tag here's electrical fixture tag so we don't have a tag that will tell us anything about

**1:38:49** · that receptacle so we're just going to have to tag this with a a text so we'll just call this cooktop and we're using the built-in 33 seconds aerial and then we can extend from here click on it and up here we can get to the laders we can use a curved leader Architects use those I like to use this one nice straight we got the shoulder there so something like that

**1:39:23** · that's the cooktop now what else do we have for kitchen equipment I like to pull this section now that I have up to here so I can kind of treat it as an elevation now one thing about a section is you'll see this dashed line down here that indicates the extense of the section we can pull the sides in and we can pull the how far in it sees in the section so I'm going to pull this in so that I only see inside the house

**1:39:54** · look at this section well not much to see now there's this up here which is interesting let's see if we can what is that built-in range hood well that's good to know we have a hood so we'll need to connect that as well and then what else do we have down here there's our cooktop I don't see any other appliances shown so we will just make sure we get get the hood

**1:40:24** · now how can we show the hood we didn't bring in the motor connection which I need to do so let's go back to that load family we're going to be in here a lot we'll go to me electrical me and we're going to go to turn uh appliances let's bring this fan in we don't need hair dryer hand dryer spr bring the fan in and that may give us what we need to hook up the hood now again this looks to be a face-based family so it's looking for a wall

**1:41:02** · or Surface to mount we're going to mount on this surface here right there and that's their symbol so you get what they give you I use a different kind of symbol a circle with little wings on it for a motor but this will work and let's see if it has the proper connections right now it's a single pole it does have multile so we can use this for a two 40 volt equipment if we need to maybe we

**1:41:26** · have a condensing unit or something outside that we need to hook up but right now and let's changes to we typically do a 120 volt nominal connection instead of 115 this is set up load classification as an appliance dwelling unit again we're going to be calculating this project like it's a commercial project just for demonstration of a commercial job not using the residential but for a commercial we would apply something like a motor to this so I'm just going to call this motor other times you can

**1:41:57** · call this an HVAC HVAC and for exhaust fans things like that I like to call it HVAC but I think this is not specifically HVAC this is more of just a motor and the demand factor for a motor just to show you how that works 125% for the first one and then 100% for any more attached to this circuit so

**1:42:20** · that's good and then our load on this you know we would have to look at equipment cut sheets to figure out the load on this it's probably going to be a very small fan I'm going to give it 100 wats so there's that and we can again we don't have an equipment tag made it just tells circuits not type so we're going to have to use dumb text tag again another reason for having some custom content here

**1:42:53** · to get tags that actually tag for example the type Mark of this there's a hood and then the other things we want to hook up here are what's on this other cabinet so let's drop another section and I'm going through this detailed piece by piece just for

**1:43:21** · instructional purposes if if you want go ahead and scrub through this and get to something more exciting I knew this would be like this showing um every step of the way so tab over that it's a dishwasher tab over that it's just a sink okay that's just

**1:43:42** · the hardware for the sink what's that someone left a cup it's a vase okay so we have a dishwasher and a sink so we're going to assume the sink has a disposal now these are all things that you can coordinate with your architect or if you have you know Plumbing designer HVAC designer

**1:44:00** · things like that kitchen consultant you can do all the consultation with them to figure this out I'm just going to show you what happens once we uh if we knew what the loads were so here's the dishwasher kind of now the dishwasher just gets a receptacle underneath the counter so we need our standard receptical I can go down here and find it or I can also find the one I already have rightclick create similar and put that guy down here now I want it to be on that cabinet there now this also assumes that this cabinet has a back wall deep enough for receptacles so

**1:44:37** · now I'm under the counter here so it may not be an issue now when I get above the counter that might be an issue we're going to assume that this will get adjusted to be deep enough for it for a box we want this to be a special load not just a standard receptacle so I'm going to call this a dishwasher now the way I do that is go over to edit type because right now I just have a standard

**1:45:01** · I can go edit type and I want to duplicate this and give it a new name I'm going to call this dishwasher I do this created a separate type so that I can modify some of these type parameters I want to change the load I want to make this 500 watts for a dishwasher

**1:45:25** · load classification I can leave it as receptacle but I'm going to call this equipment and what's the demand Factor on equipment it's just 100% which is fine it's not on fulltime and it's 120 volt so now I have a receptacle now when I connect this up

**1:45:45** · to my panel it will use the 500 watt load 500 VA load not the standard 180 so that's why it's separate and again we want to put some kind of a label on this won't be a smart tag I use all caps you can do uh do what you like there in commercial work this is how I typically

**1:46:11** · work so there's the dishwasher and then we also want to get a disposal down here so let's do this again we're creating a similar from here here the standard get that here and we'll call that disposal again let's edit that and call it a different type disposal and you know some of these can get pretty big uh I've got seen some

**1:46:40** · that are half horsepower 3/4 horsepower pretty good size so we're going to get get it up there let's put it up around 800 VA and we'll call that equipment also 120 volt so we're assigning separate loads to all these different kinds of appliances again treating it like a commercial project we'll just call this a small commercial project that looks like a house so we have those

**1:47:22** · appliances now we're going to finish the rest of the appliances I think we have some stuff over here again we can move this section over to that wall and it shouldn't matter that I look through the wall here because I can change it to a coordination view which acts more like an elevation so there we go that's nicely elevated this guy looks like a refrigerator let's tab over it and there he is Master cool May fridge freezer this one ends up being a microwave

**1:47:52** · and this guy guy ends up being a oven okay so refrigerator again you start looking at specs on these things um they typically you know could be around 800 to 1,000 Watts depending on how big it is maybe 1200 watts we're going to go with 800 for now the oven I'm going to figure at a full range Power of a full 50 amp 240 volt outlet for that guy so that'd be more like an 8 9 KW and then this microwave oh they're typically down around 12200 1250 up to 15500

**1:48:26** · so again we are hooking up typical appliances to typical loads it's never exact because people can change these out in the future I'm I'm sure you've changed out your oven or your dishwasher at home possibly so we just have to get close now these guys are stacked so we're going to have to show receptacles if we show them stacked they won't look right so I typically show them side by side side there's a way to show them stacked by applying an offset which we can show for

**1:48:58** · example but what do we want to show here let's go to our refrigerator first it's a standard 120 volt receptacle and I'm going to show it connected back here on this back wall back in here within the Cabinetry it may get in reality may be pulled out to a face here but for our purposes diagrammatically this works so we're going to have that attached to that wall like that

**1:49:26** · and a lot of people like to put refrigerator recepticles higher than like 12 in or 18 in above the floor so we can we can say that too so for example we can here put a little plus 48 in just to signify that if you want to put a height and let's make this a special type of receptacle duplicate that again and refrige is enough it is

**1:49:56** · 120 volt we'll call it equipment and we'll give it a load of let's go 1,200 this a big refrigerator that tag with a dumb text and then up here these are one standard and one special our range is going to be this guy the

**1:50:31** · 240 volt Outlet so let's get that in there let's go here and call this range we're going to make that more like a 9,000 VA and we can call this uh electric range 3 and half ah we're close to

**1:50:53** · 875 we can leave that there how's that calculated that's a commercial range type demand Factor so we are just going to leave it as equipment because I want it fully calculated two pole 240 there we go if anyone knows the joke 240 241 whatever it takes let me know so that's the range

**1:51:28** · and then the microwave great similar get that there now like I was saying I could stack these and what I could do is I could take one of these and see this offset from host there's two different things there's an elevation from the level and then there's an offset from the host now the elevation we could also change for this microwave put it up at 5 de feat this guy is going to be a duplicate type called

**1:52:00** · microwave we're going to put him clear up at 1500 equipment 120 volt and let's put that up well that's default actual elevation is going to be at 5 ft that's the microwave get a tag on there get a leader on there okay now let's go back and fix this cooktop

**1:52:38** · that I failed to name properly we can just rename this now to cooktop so that looks like our kitchen equipment is in now we need to fill in with the rest of the

**1:52:54** · receptacles that are required again look at the NEC you'll see that there's requirements for how many receptacles and then when we get to circuiting there's requirements for how they get circuited for now we're just going to show receptacles the basic rule is it's similar to the 6' 12T rule it's more of a 2ft 4T rule here you have to be within 2 feet of the end of a countertop and then not more than 4T between them and anything that serves a countertop has to

**1:53:21** · be groundfold GFCI protected things like that and you can indicate that on here if you want sometimes people just rely on the electrician to follow the codes when they install those to be the type so right now we're just going to show these as as receptacles and let the GFCI and furthermore tamper resistant arc fault things like that be more of a specification driven

**1:53:45** · things like that for now we're mainly looking at at the circuiting aspects of this so let's get some more receptacles now I typically use this for a countertop receptacle what do they have for countertop recepticle they use the CTR okay we'll use what rabbit says we're going to go with the CTR and we need to be within 2 feet of the end of that cabinet two Feet's right there so we'll stop where we are right there and let's get this copied over

**1:54:21** · it not more 4 ft which looks good and we want to be a little bit away from the sink so I think a couple receptacles here will do the trick now this guy's underneath but we still need receptacles on top so let's mimic what we have here we have one there and then one within two feet of there and back to the microwave I was trying to

**1:54:47** · show some offset and I forgot so we can offset it let's go 2 feet and you can see it pops it out from the wall so that I could actually stack these on top of each other graphically but the receptacle is still on the wall at the height so we can try that for now

**1:55:13** · that's one way to get things lined up properly in 3D but not be obscured in 2D and now let's finish up this countertop down here going to mirror what we did up there it's very similar layout and 2 feet and 4 feet and again we just get close we make sure we have a number of the

**1:55:41** · right number of receptical Architects will often on their plans their architectural plans might do some elevations with some Dimensions because they get picky about such things which is good and that does that now let's go into the mechanical room let's say we've talked to our mechanical designer and they've decided that they're going to have a furnace in here so it's just a 120 volt 20 amp circuit they said create simar for this fan and it's hosted so we

**1:56:12** · have to find a wall put it on the back wall we will call this they're calling it The Furnace and we're going to call that one actually HVAC just so it schedules separate and this guy is

**1:56:32** · going to be a full 1500 watts on a full 20 amp circuit not a 15 amp circuit that's the other thing we'll deal with is residentially you'll see a lot of 15 amp circuits so we'll go 20 amp there and then in the bathroom we want you know it doesn't show the sync one thing you can check to make sure is that we have Plumbing fixtures turned on in our model and go down here to Plumbing fixtures is turned off try that that's in our model we also

**1:57:10** · need to make sure that plumbing fixtures are turned on in the linked architectural model pluming fixtures are off now why that toilet show it must not be a plumbing fixture category there's the sink this guy is generic model that's why it's a different category it's

**1:57:33** · not a toilet category okay so now we have the sink I like to get the receptacle either here on this side of the sink or on the on the other wall we just have to be within like 3 ft of the sink so we will get now I call it above counter mounted because it's high so we'll use this symbol

**1:57:55** · right there it kind of overlaps the sink and this is one reason I don't use labels built into receptacles is because they're turned upside down I typically will just show receptacle and I have a different symbol but if I need to add a label I will just put it as text now the laundry I think we already looked at these in the architectural model determined that that's the washer and this is the dryer now washer washing machine gets a a standard 120 volt receptacle so we can use this

**1:58:25** · guy put that back here for the washing again we hit something so we want to find clean wall and then drag it in that's for the washer and it's going to be again residentially codes say we use a 1500 watt circuit for the laundry room washer itself and other things in the laundry room and

**1:58:52** · then we need to have also a separate dryer circuit so this guy we're just going to call again a mixture a hybrid of a hybrid of load Styles duplicate we'll just call it laundry and do we even have a laundry we don't have a separate

**1:59:12** · laundry so we'll just call it equipment in our load we're going to put at500 again we're going to calculate this like a commercial project now the dryer is a 240 volt 30 amp outlet typically so we need another 240 volt Outlet receptacle right there and we

**1:59:39** · will call this guy duplicate dryer 240 volt two pole and we're going to call this electric Clos dryer look at that that what do they have for a demand Factor on this less than four or less less than or equal four or less is 100% so that works again commercially if you have a lot of them you get some diversity and this guy is also a 5,000 watt load for that 30 amp outlet and let us put some text on

**2:00:15** · these washer and dryer we can move our tag around which is nice washer and dryer now we may also like another receptacle in here for an

**2:00:42** · iron so let's go ahead and do that with just a standard receptacle and get that looks like that wouldn't be a window maybe a very high window so I'll put it on the wall now what's

**2:01:00** · happening is I've got a grid line right next to my wall so the receptacle is trying to grab onto that grid line so what I need to do is make sure I'm hitting the wall now when things are stacked in Revit remember you use the Tab Key to drill down into it so if I hover here hit tab you see

**2:01:23** · it pop up there now it's actually using the wall not the grid line so click on there and I'm going to drag this underneath this window so now we have a convenience receptacle in there as well I think we've got this room taken care of for recepticles one thing I haven't checked is to see if we have anything on the ceiling that

**2:01:51** · needs power we can check for that later for now we're going to look at the living room and we got some steps these are steps because this as you recall is a sunken living

**2:02:06** · room it's about 2 feet deeper so anything we put on the walls is going to be really kind of the wrong height if it's based on the level one height versus the level one living room height so we're going to have to deal with that I'll show you how we deal with that we want to start our receptacles we need something for the TV now we can just put a receptacle here we have to be within 6 fet this I would say this is the end of the wall for this living room so let's put a receptical create similar on that wall and within 6 feet and it looks like we're good let's just check

**2:02:45** · the distance here yeah 5T that works right now this is hosted to the linked Revit model it's hosted to level one that's up here 2 feet higher than the level we need now we can't host this to

**2:03:04** · the level one living room because we did not copy that if you go back to episode one we did not copy the architect's level one sunken living room into our model so we actually need now to link that in so we can relate these receptacles to it so do we do that we go back to an elevation or a section

**2:03:27** · we can do it right here in the section you'll see our levels and I'm going to grab my levels and grab it here not at the Circle and then drag it out so I can see it so we have living room and let's change the scale list so we can actually see those we want level one living room we need that so we can just copy this and draw over it or we can do again copy monitor that was under collaborate copy monitor select the link hover over the link Revit model click that copy I don't

**2:04:06** · need multiple this time I just need one and I can't get to it out here I have to be here within my boundaries of this view click on level one and it's doing its thing it's copying down here

**2:04:23** · processing and then since I don't have multiple I don't need to finish there I can just finish the copy now I have a copy of that living room level one living room and it put it in as feet

**2:04:40** · and inches instead of metric drag it over so it lines up with that now I have level one living room that I can utilize in my model so back to my plan back to this receptacle click on there now I can change the level to level one living room and what I should have done is put a put

**2:05:05** · my section down there let's drag this around this is just a so we're just using it for our purposes of design so here we have our elevation of this wall now we can see our receptacles are still high even though we Associated them with the low level well the reason for that is and let's look at this just because we Associated it with a different level doesn't move it it just changes the dimension so now it's elevated from the level by 3' 3 and this crazy fraction

**2:05:38** · of an inch so it didn't move it it just is hosted to a different level so now we need to manually put this down and I have these at the 1 foot6 Dimension like commercial Ada receptacles now if we look at that section we can see it's down here so as I create new receptacles I want

**2:06:05** · to make sure I create it from this one which is set up to be hosted to the lower level so let us look at the rest of these in this room we have some more windows let's check and see if these are floor clear to the floor windows again they are so we're going to be doing some more floor boxes this is wall this may be window let's cut another

**2:06:36** · section window all the way down to the floor okay so that's what we have now this guy just look

**2:06:51** · this we have doors so we don't have to count the door as part of our our distance we can start at the edge of the door and what do we have for a distance between these we have 10 ft Which is less than 12 we can get away with a single receptacle here now this is let's look at what this thing is I think it's a fireplace it is a fireplace Pang not sure if this is going to be very accessible but we put one here I would say

**2:07:24** · a fireplace is typically permanently mounted so we may be best to go ahead and put receptacles and add additional receptacles on either side rather than hide it behind this gu so I'm going to go that way now we need to get our floor box from up here create similar and we're going to have to relate that to this level so turn it like that we'll put it right here and let's get that hosted to living room level now because this is hosted to the

**2:08:01** · floor surface it automatically is still at zero it wasn't wall hosted and we can just copy this if we're not putting something on a different level or or something we can do a standard just copy and it will still be hosted and it's still at zero I tend to use create similar a lot just to make sure that it hosts properly so we've got that and we have five more feet so we can

**2:08:36** · go seven but let's keep it a little bit short put that guy there now this is again where we have a grid line in the way of our wall so hover over the grid line hit tab now we are on the wall surface and we want to copy this not more than 12T away wrong we

**2:09:07** · need floor boxes so 11 six is a good careful Dimension get this down here

**2:09:24** · and if we want we can line that up with that mulon and still be within our 12 feet and we can move this a little bit because it was 116 but we're getting down to the inch here and then what do we have from here we can go 116 to that and

**2:09:48** · that truly is a wall so we can create that on the wall not the let's Tab out there we go and how are we doing for distance here we may need another receptacle if it's further than 6 feet it is 7 11 yes we do so get that down and I don't like to put it right at the corner let's get a couple feet in so it's actually useful but that wall needs to now we can just mirror what we've done over here

**2:10:22** · now are we on the grid it looks like it's not trying to hit the grid so we're okay there we'll put a floor there let's get another now this is

**2:10:44** · a different layout I'd go 6 feet from this step right at the edge I think that will still give us 12 feet and get this floor receptacle over here that does the living room this is all just Furniture now if we want to try to you know put

**2:11:23** · some floor receptacles in here for tables and such we sure can and you know you may talk to the owner architect and see if that's something that's desirable but for now we'll do the minimum the other thing is do we want anything outside do we have any outside appliances and typically outside appliances you know are like gas um commercially we have to put in some interlocks and and electrically controlled gas valves and some timers things like that but residentially it's much more uh lenient as far as that goes on gas so we may still want um some receptacles

**2:11:56** · outside for convenience an exterior amounted light or something like that so I'm going to at least get one receptacle out here and tab for the purposes and those would end

**2:12:14** · up being weatherproof and GFI and we can tag some of that stuff later or again we can let some kind of a written specification do that or let code drive that and before we finish up it just occurred to me that when I created this similar I did not check to make sure that I put it at the level one living room we're still at level one because this one was hosted to level one when I created similar so a couple things we can do we can either go through and change each of these to the proper level and change their height or I can actually create a

**2:12:51** · plan View at the lower level model my elements from that plan View and it will still be available in this plan view because it's all part of the model so let me demonstrate that way to do it so I think best practice here would be for us to go ahead and create a lower level floor plan now we go up to view plan view floor plan we don't have one created for level one living room yet and this

**2:13:21** · is just a standard floor plan say okay and we need to give this the proper view template because view template also arranges it into our project browser under the proper headings disciplin subdisciplines

**2:13:38** · so let's go to our power plan quarter inch and we don't need to worry so much about cropping this and all of that because this is not going to be what I would call a production view it's not going to be a sheet view it's just for placing it's kind of a working drawing so I'm going to call this just to get it numbered here let's just call it three lower living room working so it's just a we don't want to rename the level so just lower level living

**2:14:13** · room working view so now what we can do is get rid of that if we create similar now and put it in the same place we had it before and we have to tab again now this guy is hosted to the level one living room at 1T 6 above it because that is our current work plane so we would do the same here

**2:14:43** · now this guy because it hosts to the floor it's a it's a face-based hosted family we can merely change it to the proper level and it is still at the floor this guy well he will need a new one so I'm going to delete these and because we're on the same face we're on the same wall I can actually just do a regular old copy and let's copy that one and we can see that we're within 24 ft copy that

**2:15:15** · and then get this guy down here we already made sure this one this one was on the lower level this one is on the lower level these guys are on the wrong level so let's get rid of those this one needs to be moved so again this complicates things a little bit makes it a little more tricky to have this different level but it's a good exercise to understand

**2:15:41** · how to deal with these different levels so we're going to create similar roughly across from that one and it should host to the level we are on more copies so this is finishing up this

**2:15:57** · plan and I would say the same thing with these exterior receptacles we're on the same wall so we can just copy and actually these are a code requirement to get receptacles out on a porch so that's another reason to put these out here

**2:16:22** · so that takes care of the level issue now we want to go back to our actual first floor level to go back to the kitchen dining and what I realized is that this back of this counter is actually going to be considered a wall space within here so we are going to need to treat that just like a wall so we need to be 6 feet from the end of this wrap around the corner so we can include the corner as part of the six feet

**2:16:53** · so we have a distance of just over 2 feet so if we're within 3 and 1/2 ft from here we should be good so I'm going to put one right in front of this this is just a a stool that can be moved around but let's go ahead and copy our receptacle to here and again here we are

**2:17:17** · here's our grid line the same old issue tab through that and then let's copy this within 12T and we're good there at this one so that should cover Us in this room the only other

**2:17:36** · space would be if we need one here in this kitchen lately I've been just playing it safe and adding a few extra receptacles I would rather have a little bit extra than especially in the work where you do the design and someone else installs it you hate to have all these change orders and things added later on so I'm just going to put that in there to be safe now that guy wants to host on the back of

**2:18:04** · that wall see right there it flips over here it doesn't so again there's something in the model that's invisible right now but it is affecting where that receptacle gets hosted so that can drive you nuts sometimes so let's find place it works and then drag it down and that should cover us here and that should complete this level so I'm going to stop episode two right here with

**2:18:35** · just getting level one receptacles and appliances connected I think level two is going to be much faster because it is bedrooms and bathrooms hey guys welcome to episode three of the full project residential Revit electrical series that I've got going here on this channel in this one we're going to cover a little bit more of the view range changes we need to make for this project and then we're going to finish laying out receptacles and HVAC equipment for this project to get it ready for circu in so stay tuned for more so we left off episode two here in our first floor plan

### Episode 03 - Placing Receptacles on 2nd Floor

**2:19:11** · power we got all of these receptacles installed and the next thing we would like to do is work on the second floor power plan to get those recept installed as well so double click that and the first thing you will notice is that we have the devices from down below showing through on our second floor plan this will happen once in a while on a project and you'll have to deal

**2:19:35** · with what's called The View range now we looked at this earlier and set the view range up for a cut plane top and bottom but that was for the first floor if we review this what we actually ended up with we tried a few different things is we ended up needing the bottom of our view range if you recall the picture down at the level below so that we could show that sunken living room and

**2:20:03** · that works fine for that view but now that we show the level Below on second floor well level below if we look at our elevation level below level two is level one so we see all of this space

**2:20:18** · between level one and level two so we need to fix that there's a couple ways we can deal with this and so this is good practice on dealing with a view range which can be quite an issue on some projects okay so back to the first floor because we have this sunken living room we do need to see lower at least in this area we do not need to see lower in the entire view view range affects the entire view so we can set the view range up for just this normal level one View and then we can

**2:20:51** · apply a separate view range just to this sunken living room so let me show you how to do that let us reset up our view range for this view template for just this first floor view so go down to view range edit this instead of level below we're going to set the bottom to this actual Associated level at zero and the view depth we don't need to see below our first level in this case now again in

**2:21:17** · some cases on a first floor at least you may want to see under the flooor you may want to see under Floor conduits coming in that would tend to lead to a separate view template just for level one in this case we're not going to show that so we're going to have level one and level two be the same so we have Associated level for the bottom and the view depth will also be because view depth is how

**2:21:42** · much below the bottom do we want to see we don't want to see any of that so we're going to say it's also the associated levels the bottom and The View depth are the at the associated level which is level one in this case so there now as predicted we cannot see the receptacles in the sunken living room go up to view and under plan views you will see this thing near the bottom called plan region I'll point to a video link up above for a whole video I did just on view range and plan region but

**2:22:17** · the short story here plan region allows you to to set up an area that you want to apply a different view range to so this is perfect for this sunken living room so we are in a sketch mode because you see the little check and the x marks here and our plan region can be a rectangle so we will use the

**2:22:40** · rectangle tool and just select the portion of the project that is sunken lower now I'm going to call this these are steps the bottom step is where I'm starting and I also want to include the walls in this so I'm going to do that and then I'm going to drag it and I do want to include this porch area as well so I'm going to be a little bit outside like that and say okay now I could have set up

**2:23:10** · the view range there but let's go back and we can get to this it's a dash line over here you'll see it has its own view range edit that and this is where now we can set up just this plan region to have a different lower level so instead of saying just level below we get absolute levels we want

**2:23:30** · to select level one living room as the bottom of our range and the view depth as well and those are all no offset to those hit okay and now our symbols show back up because this view range is set up differently so that is a very common way to apply a different view range to different

**2:23:50** · areas of your project you may encounter a school for example that has a gymnasium that's very high compared to some classrooms next to it you can use the plan region to increase the height of that view range to show your lights up the top of the gym so that's a very common technique and it doesn't mess with our actual view template now we can see the second floor which has that view template applied is correctly showing nothing below so we fixed those problems now we can

**2:24:20** · get right into adding receptacles to this bedroom level and we can move these room names around like that so let us see like I mentioned before we're going to do basic NEC code locations

**2:24:38** · for receptacles and we'll cover some of that I talked about that in episode two a little more and gave you a link to a good resource on YouTube so let us find our receptacles we're down here duplex receptacles standard and let's start showing these now as we talked about we need to be within 6 ft

**2:25:00** · of the end of a wall well that also includes any wall that is 2 feet or longer has to have a receptacle and we can check dimensions of this guy with a dimension tool or like we did before we can go to annotate and draw some detail lines just to get an idea how long this is that's 2ot just over 2 feet and this is out here this is 1 fo6 so we have 3 or 4 feet it's not long enough to require

**2:25:27** · two receptacles but it indeed does require one so put this at a reasonable location in the center of one of these walls typically let's go here now along this wall we have to start our 6ft Dimension from this edge of this doorway and what looks like a closet and start counting 6t maximum from here

**2:25:50** · so let's look here and we have roughly 3 feet and then we can go another 3 feet so let's put one a little short of 3 feet right click first of all let's make sure this is the right height we're good they're at level two and we're 1 fo6 again I'm showing these at commercial 18inch height you can put them down at 12 in for a residence if you want great similar get this guy right here get rid of our line now we have the rest of this wall let's see what dimension that

**2:26:27** · is we're Beyond 6 feet so we're in a position where this full wall is a little longer than 12 ft so we need two receptacles now I'll call your attention to this guy this is a pocket door and so that's a door of course that slides into the wall it is not enough depth in here to actually

**2:26:49** · recess a box for a receptacle choices are you could go a surface box or you could go with a floor receptacle but in reality since this is not more than 6 ft deep we don't need to put one within this 3ft door length we can put it just near it so we could put this guy right there and then the other one anywhere we can put I'm going to put it on this wall as well

**2:27:17** · so we have a couple places to plug things in in this little hallway if you want to set a little table and a lamp right here whatever you like to do we do not require receptacles in the closet although I will note that a lot of times at least in apartments you may get a some kind of a media cabinet in here that would need a receptacle so keep that in mind let's continue on with this bedroom we have a window and this is where I use my section again which I already have

**2:27:50** · have drawn let's use this section and see what we have upstairs for Windows now we need to make sure that my section is looking far enough so if I click on that I can see that the dash line of the depth of this section does not include this wall so I won't see that window so let's get this down a little further and again these sections are just for us during design I'm not dragging these sections onto a plan go back to that section that I already hit and let's see

**2:28:23** · where we are it's good to have an idea let's pull this in a bit so we're only looking at our room that helps us to narrow down our view you can do it here or you can actually do it in the section you can get to this crop if I click on the crop you'll see a a DOT that I can drag around and narrow it down I like to do it in the view so that I really know what I'm looking at so back to this section Second Story let's get up to the second floor just to help us remember

**2:28:57** · where we are okay so that window comes clear down to the floor level good to know so we cannot put a receptacle here unless we did something like a floor receptacle we're going to try to avoid that and actually the window counts is part of the wall so we start here and we have to be within 6 ft looks to me like we're going to put one right here in this corner either down here or on this wall

**2:29:29** · you can take your pick and we run into what we did on episode two where we found this grid line is trying to host our receptacle hover over the grid line hit tab because tab will drill down through all the Stacked lines and now we're hosting to our wall there we go and I will put this a little bit

**2:29:50** · ways and if you have any trouble getting to here you can sometimes just go down to another portion of the wall put it there and drag it over so I'm going to drag this near the window instead of around this corner and then we can go up to 12 ft away with the next receptacle so what do we have

**2:30:10** · here we have 10 ft and then another two feet and I'm going to stay a little bit short of two feet just to be safe I can put a receptacle around this corner however that's looking like window again to me so let us get a section in there I have one looking that way I could take this and there's a little flippy left and right button that I can use you can see that the head the head of this turns around I can do that I can drag this over instead of creating a bunch of sections I can do

**2:30:40** · that and I'm making sure I'm looking at this wall let's see this section and get up to second floor try to isolate that so we can see the little little better okay this is all glass this is glazing it comes clear down to level two so this is this architect likes full height Glass Walls

**2:31:02** · okay so we're going to need floor receptacles in this case I can avoid one in this area by keeping my receptacle down on this actual wall so that's what I'm going to do create similar I'm going to put it in a little bit in from that wall use my tab to get past the grid line there he goes it does mean I'm a little further to my next receptacle so let's see what we have for

**2:31:32** · a distance here we're only a foot away and we can go up to 11 ft away with this how far is the door okay so we are going to have to put one here so that's within 11 ft I'm going to put in right here at this million and instead of trying to find my floor receptacle which is not that hard to do here I can also just go to first floor as long as I have second floor open go to first floor I can simply rightclick on this create similar and then pop over to my second floor and place

**2:32:06** · that so there's a number of ways you can get to these things so there's that and I'm within 6 ft of the end of this wall which is which the door creates the end of the wall so I'm good there now let's see the rest of this room starting at this wall here I need to be within 6 feet there's 5

**2:32:33** · S again does this window Hit the Floor I'm not even going to look I just I'm sure it does so we will put a receptacle instead of going floor we're going to put one right here at the edge and let's see is there a grid line there is but it looks correct so I'm going to place it there well what do I have for Dimensions we have 15 16 ft to the end so I will definitely

**2:33:05** · need another recepticle here let us put one oh in the Midway if as you're looking at this wall it' be kind of in the middle of the wall and then this is again an outside porch which is going to require receptacles so let's get those out here here I'll put one here and let's just say for convenience we'll put another one down here and tab to make sure that we are on the wall so

**2:33:32** · this room looks good to me let's look at the bathroom now we have a tub for now we're going to say that it's just a regular tub that needs no power but we do have a sink so we need to get an above counter a higher mounted receptacle back on first floor let's find what we have over here in the bathroom we had a counter height receptacle and as a reminder we are using as much as we can

**2:34:01** · the outof thee boox Revit symbols and devices so this was their symbol for counter mounted receptacle as long as we indicate this symbol on a symbol list with our project which we will do in future episodes then we're golden as long as your symbol list matches what what you're doing on your plan you're good to go unless you start getting into custom symbols which I also show

**2:34:27** · how to do I'll point to one of the videos above that show us how to create some custom symbols and content for your models but for now we're going to use the out of the box and we're going to right click create similar pop back to second floor and put this on the right or left I don't

**2:34:45** · see a compelling reason for either one let's just put it right here so that's the only recepticle we need in this restroom and again we're going to rely on some written specifications or some notes elsewhere to remind the installer to make GFCI type receptacles where needed tamper proof

**2:35:03** · receptacles Arc faal Breakers all that kind of thing we're going to handle with some general notes so that we don't have to try to indicate all of that in the plan okay now this bedroom will be similar and I will start lining these out and then I'll have the video speed it up a little bit so you don't have to watch every little decision but it's the same process measurements and placing of receptacles so 1 2 3 four five bedrooms typically need four or five receptacles

**2:35:48** · you'll find in the bath we have an issue here with this sink let's rightclick create similar I like to put on the sidew wall of the sink and while I'm here let's do the sidew wall of this sink and this bedroom well not quite it looks like a mirror but it's not really because it has different walls and so each bedroom has to be figured out individually

**2:36:30** · and if you're really trying to Minimax this thing you'll you'll stretch these as far as you can with 12 feet but I don't think there's a problem having one extra receptacle in a bedroom you've ever been in a bedroom that doesn't have enough receptacles or in the right place you know exactly what I'm talking about so that's roughly 6 feet so yeah we're going to be further than 6 ft from

**2:36:52** · this guy so we're going to need two receptacles on this wall let's get them something like this try to make it usable now what's our issue here we have no grid line and it's a little bit away from that wall so something there see something's going on once we get up here we have a little different graphic so let's get to the point where the works on the wall and then we can drag it down

**2:37:20** · so something like that one two three another five in those these are good siiz bedrooms okay that's a bedrooms now let's look at the entry hall looking at codes you find out that if if a hallway itself is longer than 10 ft it needs a receptical so we need at least one in here I think for usability it makes sense to put a couple so I'm going to put one I have a lot of sliding doors I could put one at the end here

**2:37:52** · and then I think another one in this entry would be nice now hallways aren't just for plugging in a vacuum cleaner for example sometimes people will set little tables along the wall and put a lamp on it so you need to think about that as well if it's a wide enough hallway that might happen now this Hall here definitely somebody could put something along this if they wanted to but it's not required

**2:38:20** · by code to have these so again make your judgment call on what you want where this happens to be a walkway over to the driveway so we don't require one out there you don't require any in a Stairway this is an outside Terrace type patio now this could be considered you know a balcony or patio so I would get a receptacle out here for that reason let's put one right here on the wall

**2:38:51** · now another thing we want to look at up here is some equipment needs HVAC HVAC needs now again we don't have a mechanical or HVAC design done for this project but on most projects you will have that and you'll refer to that you can either link the model in if you have that or refer to the PDF documents that they have and cut sheets so we're going to say we have all the information behind the scenes and what we found out is there's going to be an exhaust fan in each bathroom so let's go back to our fan we have standard now this fan from Revit is hosted it it wants to host

**2:39:28** · to a wall which is I would say unusual for a piece of equipment usually they're floating we can put them anywhere we want but in this case we're using their built-in so we're going to put it right here and cuz sometimes the the fan will be near the shower near the toilet so we'll get this guy right here at least for now we can move the room tag around and we will call this we're going to duplicate this so that we have separate type parameters like load and load

**2:40:02** · classifications that we can apply to it so we want it to be its own type and we'll just call this bath fan something like that 120 volt single phas load classification now I like to classify these

**2:40:19** · things something like HVAC say okay and then the apparent load you know these things are typically small we'll stay with 100 VA for now say okay and we've determined from previous episode that we do not have a built-in tag to tag this piece of equipment with its name so we have to use Dum text again another reason why we create custom families so we have more variety but for here we're going to do this this is a an outof thee boox project so we will say rth fan get that

**2:40:54** · in here and point to this with a leader I add a leader and we can adjust the shoulder of it something like that we will need to do the same thing down below create similar let's get that fan right here we can also use copy here or we can contrl C and contrl V copy paste move it around

**2:41:20** · you can drag the leader over to the other side or you can also use the controls up top and remove the last lader and then add a liter to the left so that's sometimes a shortcut you can move this around with a little move symbol so a lot of variety of what you can do with the text bath fan there and we need another one in the master bath

**2:41:50** · right click create similar and we're going to say that this bathroom ends up having two fans in it so we'll get that copy this from here to here \[ \_\_ \] it over and sometimes you need to move this to a different room

**2:42:19** · whatever works drafting wise for you and we're going to have another bath fan we say it's out here near the shower great similar you can retype it yourself

**2:42:34** · you can copy it lots of options get this master bath out of the way and like so now the controls for these fans many times you'll just have a switch on the wall and we can do that or it may be switched with the lights so we will deal with the controls for these fans

**2:43:04** · when we get to the lighting plans and just know that we are only showing device layouts right now this is kind of a preliminary layout you might call it a schematic design design development those are the fancy terms for this but a lot of time AR Architects may only show this much they

**2:43:20** · may just show a layout and not go further we are going to go further as the electrical designers we are actually going to Circuit these things up to a panel similar to a commercial project and assign loads that way we will also do a load summary in the residential way so you can see how those contrast with each other one other thing I just realized we haven't addressed is on the first floor we also have a bathroom and we need to get a bath fan there so let's rightclick create similar back to the first floor and let's get that bath fan

**2:43:51** · and let's get that labeled let's say our HVAC design put a fan in here and let's say that this one

**2:44:13** · is a different wattage fan a different kind of fan so let us create yet another type because we want to change some of the type parameters so we need a different type let's go laundry fan and let's say it's a little bigger it's 200 VA so we've created a separate type for that and we will label this guy click this hold out

**2:44:52** · seeing this section line reminds me that when you print this to a PDF or a paper you have the option to not show these section indicators if they are not actually dragged onto a sheet there's

**2:45:07** · no need for this to print with an empty sheet and detail number so that will not actually show up in our final print so don't get concerned that this line Cuts right through our words and such it's not going to show up like I say unless we turn it into an actual section or elevation that we want to show up one more piece of mechanical equipment that we need to show is the cooling unit that goes with the furnace I also noticed we did not label this furnace so we need to label that again in custom symbols we would have a tag that does that for us and I'll point to a video

**2:45:49** · up above that shows how we can create custom tags and make them show the parameters that we want so we're going to say the mechanical unit is located outside and let's say that they just put it out here so we will show create similar get that on the wall so I think this

**2:46:10** · is a foundation and the actual wall is here so we will do that edit this again it needs different type parameters it's a different piece of equipment we will duplicate this and call this ning unit and you would look at a cut sheet for the unit you're dealing with and it's two polls Revit considers 240 a two-phase connection even though it's Line

**2:46:37** · to Line and sometimes we call that a single phase it's really phase to phase so there's two phases involved Revit deals with it as a two-phase connection it's HVAC and then we're going to say this is oh it's like 3,000 Watts apply that and we will call this Ving

**2:47:00** · unit like that okay guys I would say that we have our receptacle layouts done for both floors so next

**2:47:15** · time we will jump into laying out our lighting before we circuit anything I want to get all this laid out hey guys this is Rob and welcome to episode 4 of the residential electrical Revit Series in this one we are going to cover how to Circuit these recepticles that we installed how to find and install a 12240 volt split phase panel board and how to connect these devices up to

### Episode 04 - 120/240V 1-phase Panel & Circuiting Receptacles

**2:47:40** · it we'll also show how to start drawing a single line oneline diagram of our system and how to more efficiently do that so so if that interests you stick around let's get right into it so here we are again in our residential tutorial electrical project that we are treating like a commercial

**2:48:01** · level of development and we have already Place receptacles and Equipment connections for the first floor and the second floor so we've already got all those placed and now we are going to look at getting some of these things circuited up to a panel this is where the real magic of Revit can shine in an electrical project is the systems that we create and connect all of these together to form calculations and load summaries that we can use to size things so let

**2:48:33** · us get right into placing a panel board for this project or since it's residential we can call it a load Center style of panel which are typically used in residential the details are instead of having a bolt-on circuit breaker like a commercial panel board it is a plug on circuit breaker for

**2:48:51** · residential use it's a cheaper panel electrically though it's going to just have a set voltage phase and current capacity so let's see if we can find one of those in this example project I'm trying to use as many of the built-in Revit families as I can in our commercial work we use a lot of custom

**2:49:11** · families in fact that's kind of the first stepping stone into getting into Revit is to get your families created and customized but in this case for learning how to use Revit and connect things together we're going to use what it comes with as much as we can so let us go look over here at our electrical equipment that is already in our model and we started with revit's built-in template so there's not much in here there's a Transformer ethernet switch we're not dealing with that and we've got two panel boards now these are typically three-phase panel boards for commercial use 208 is

**2:49:43** · a three-phase voltage for commercial and so is 480 we are looking for a 12240 volt split phase panel which is common in the United States and and elsewhere in North America so we need to find a 12240 singlephase split phase panel so let's go up to our insert and remember this second load

**2:50:06** · family is load Autodesk family it's got a little cloud in it this is where we can get to the out of the box Revit families that used to be loaded into your hard drive when you loaded Revit and I have a whole video which I'll link a card above that shows a lot of these different families and what's available so if you go into all results you'll see you have a lot of categories we'll go

**2:50:31** · down to electrical and then remember that there's an architectural electrical section for Architects to use in their designs which does not have all of the electrical connectors that we need so we were going to skip past the architectural and go right to the me section ction connectors power appliances distribution now we want distribution go to distribution and you will see we have transfer switches circuit breakers switch boards starters a bunch of things so we want to go down lighting an appliance and if you hover over the name here you can see the full name right here

**2:51:05** · that's a Lighting and Appliance panel board 208 that's what we already have it's also an MCB main circuit breaker well we don't have one of those either if we're doing commercial work and need a Dom main circuit breaker we would load that we lighting 208 surface so this one by not saying surface means recessed so there's different families for different types of mounting even this one is a lighting imp plance 208 main lug only mlo 208 480 480 hm 480 480 now we have a

**2:51:40** · metering switchboard a motor control center more commercial industrial work motor control center a good old round plane junction box box look at this singlephase panel it says 120 volt main circuit breaker recessed well other than the 120 volt part we do need single phase even though it's

**2:52:00** · going to be 12240 split phase they call it single phase because it doesn't have a third phase Revit calls it two-phase and this one is a 120 volt main circuit breaker surface so it sounds like these are typically made for residential use we're going to take the main circuit breaker version because we need a main circuit breaker in our house let's load this into our model it'll pop

**2:52:25** · up down here under electrical equipment and there it is singlephase 120 volt let's hope it is just mislabeled now before we drag this in we have to figure out where is this thing going to go a lot of houses have a garage attached or separate and many times a panel or load Center will be placed in that garage it's a very common place we don't have a garage in fact let's look at this site again let's go up and 3D view it up here up the top at the quick access you can go to default 3D view click on that and it pops you into a 3D View and you can change the appearance of this

**2:53:03** · down at the bottom you can go to what level of detail you want and architecturally it may not show much of a difference but if you go down to fine you'll see you get a little more refinement let's say on the solar panel you'll get a little more detail and then also you can change whether

**2:53:23** · it's a wireframe hidden line shaded colors are realistic right now I think it's set on shaded if you go to wireframe it's indeed just a wireframe and it's you can see right through it and you can see a lot of our electrical boxes in here that we placed already but we want to look at more of a what does realistic do it takes a while to render a realistic and it'll apply things like materials and Lighting and all of that stuff to make it more of a realistic view

**2:53:52** · maybe for a rendering Architects use this to provide their 3D rendering of the project that took a while and so it'll probably take a while to pan around it so I'm going to go back to just shaded which I find is enough for our purposes we just want to get an idea of what this place looks like and what we have so we have looks like kind of a narrow driveway coming into probably just a a parking area there's no structure here no garage so it doesn't make sense really to put the panel

**2:54:26** · out here and have to run think of all the branch circuits that have to run into the house plus this is outside it would need to be weatherproof that is not a great idea we need to put the panel in this house somewhere now this is all part of the kind of a water collection system we don't want it

**2:54:44** · out in here we don't want it outside let's find a place inside now the trick is this has to be coordinated with your architect your interior's people with your owner for appearance not many people want to see that panel face right when you walk into the building so second floor is where we enter from this raised walkway so that's the main entrance to the to the structure second floor so a panel in this main entry hall would be unsightly you don't want to put it be in a

**2:55:16** · bedroom or Master bed bedroom sometimes Apartments will have one thrown in a bedroom but in a house I find it best to put it in more of a utility space so what do we have on the first floor for utility spaces we have this mechanical space but we already have a furnace in here and we found out from our plumbing designer that there's going to be a water heater in here that we need to add so that's not a good place because looking at the NEC you need clearance in front of a panel

**2:55:46** · board to service it and maintain maintain it you have to have safety clearance working clearance in front of that so we need a place that has some clearance this will be full of equipment so it cannot be located in a bathroom but this is actually a separate laundry room which should work the panel door has to be able to swing at least 90° open we have to have clearance so what I'm thinking here is this wall right here facing into the Lund room would be clear yes the washer is

**2:56:18** · accessed in the front but there's nothing going to be really sitting here there's no clothes hanging here in front of this we can't be in a closet any of the rest of the laundry functions would happen in this area so I'm going to declare that the panel can be located right here on this wall facing into this laundry room and it is nice and close electrically to a lot of the equipment the kitchen has a lot of equipment and it's close there so this makes it an economical choice now we also have to think of how power is going to get into this panel from outside and back to

**2:56:52** · the 3D view we just did we don't have information for where power would come into this site yet but let's say that we talked to our utility company and we find out that there's a pole on the street they'll set a little Transformer out here nearby for us let's say they're going to put it somewhere somewhat flat because they don't want it on grade let's say they'll put it here so it's going to come from out here and it needs to hit h a meter now that meter location is something we also have to deal with it has to comply with utility requirements for reading the meter

**2:57:28** · access to the meter if they need to work on it uh change it out so it needs to be outside now if the power comes from out here the meter is rated for outdoors so it could be placed somewhere out here and the meter typically has to be on the front of the house along the side within 5 ft of front there's many different utility rules for this so we're just going to say for the sake of this example that the meter is actually going to be located out here on some kind of a drut riser on

**2:57:57** · this wall here so that they can walk up read the meter so we will hit from the Transformer to the meter and then from the meter we will go into our panelboard we will deal with the sight electrical later but we just want to make sure that this is feasible so let's go back to our first floor plan we're going to come in under the slab so that we we have to stay outside of the building again lot of code rules rules here we have to stay outside the building and under the slab is considered outside the building and then up into our panel board so long story short we're going to put our panel right here we're going to put a 200 amp panel right here now you want to make sure

**2:58:34** · that you have the right selection up here it is a hosted family which means it has to attach to a wall hosted by a wall and a vertical face if you place on face here trying to place it on the floor or ceiling place on face typically means a horizontal face and sometimes here look at it's

**2:58:58** · placing on top of that washer we don't want that place on vertical face and then you'll see that it it's recessing it kind of like we did recepticles but it's recessing it into the wall so we need to keep a little bit away from the end here because there's usually a stud on the end of this if you look at the construction so we'll place it somewhere around here and the built-in panel board

**2:59:21** · from Revit doesn't have a door it doesn't have much of a symbol it's just a box but it serves its purpose it will let us connect things let's make sure we have the right settings in here so click on that and there's a bunch of settings over here for a panel and this is single face panel 120 now let's go look at this it is electrical data 120 volt single face you don't often see a 120

**2:59:47** · volt single face pan panel we want to see if we can modify this to be a 12240 split phase we see that we cannot change this electrical data it's built in there's nowhere here distribution system in fact is none because we don't have a 120 volton distribution system in our model in fact let's look at that to make sure if you go up to manage there is me settings right here and go

**3:00:15** · down to electrical settings and this has a bunch of settings that you deal with as you need to as you get more advanced and these are typically set up inside the template that you end up using so let's go to Distribution Systems now this shows the built-in Distribution Systems we can always add more right now it has a 1228 y 3phase four wire for commercial use there's our 120 240 single

**3:00:41** · three wire system split phase so it's 240 Line to Line 120 line to ground or line to neutral so that is what we use for residential so that's good we have this in here and then there's a 48 3phase 277 y system now in other commercial jobs and I show this in a separate video we have to add a 120208 singlephase system if we have Apartments because they are 208 not 240 that's a

**3:01:09** · whole another story but we're good here we have the right one but we do not have a 120 volt only singlephase distribution system so this panel out of the box does not work let's see how to fix that without having to go into the editor so let's go to edit type maybe it's a type parameter if you recall all of these in here are called instance parameters if we had two panels in here of the same kind of panel these could vary between them because they're related to just that one instance so let's go to the actual type 225 amp is the type here are the param

**3:01:48** · we can change luckily we can change the panel voltage and the number of poles so we're going to make this 240 we need to get the line to line voltage is 240 number of poles it's two poles it's two phases so again Revit calls this a two-phase panel because it has two lines two line voltage phases if you recall split voltages has two Hots and a neutral so this is a 240 vol two

**3:02:19** · pole panel now here's a bunch of dimensions and it includes different heights default elevation was four and we can move it around so now we have the voltage set up let's go make sure that applies down here so down here electrical data good 240 volt two phase we're set and look it assigned the

**3:02:39** · proper distribution system automatically when we set it up properly so we are set now for 120 and 240 volt connections let's give this panel a name and not many people have a name to their panel in their house but we will just call this let's just call it panel some people call it the uh

**3:03:00** · the the breaker box the fuse box so we're going to call it a panel even though it might be a load Center style construction and then we're going to move this out of the way and I'd like to put a tag on this we had to use dumb text labels here because there's no tag let's see if we have a tag for a piece of electrical equipment like a panel so let's go up to the tag by category shortcut

**3:03:25** · up here and click on that and see what we get and look at that it pops up with the name of our panel which we called excitingly panel there's that it has a leader now we could get rid of this we could put this in without a leader go to the tag and then up here at the top you you can deal with

**3:03:46** · leader you can un do the leader and then when you put it in it just centers it on the the panel and then I pull this out right in front of it so that's another way and is actually Tagged so that it's a smart tag and this is what we want as much as we can in Revit is for the tag itself to relay what is the information inside the family that we Tagged so if we were to change this to P1

**3:04:18** · apply you see that the tag automatically reflects that change we can also change it here in the tag go back to panel and click on this family and you will see that the name got changed to panel so

**3:04:34** · these are interrelated they are tied together and that is a huge benefit in in Revit as we change things we only change it once so the panel is set now we can start connecting our equipment hey and if you find this information useful I'd love it if you hit that like button down below to help propagate it to others and if you want to stick around for more electrical only Revit videos please hit subscribe and even leave a comment if you like now we have a lot of standard 120 volt receptacles we have some 240 volt equipment

**3:05:11** · how do we connect all this now I'll mention again that there's a lot of NEC National electrical code rules for residences or dwelling units as they call them so again I'm not trying to teach a whole code class here but just remember that what you do here has to relate and comply with the national electoral code and any local modifications that you may have in your state or even in your city so I will Point again in my description below to a a great YouTube channel for Ryan Jackson Who

**3:05:44** · covers a lot of NEC things and specifically has a three-part video series on residential receptical type codes so you can check that out if you want to learn more about those codes but the basics are in a kitchen for example let's start here we have to have two small appliance Branch circuits

**3:06:06** · that service the countertop equipment and can also service things like the refrigerator now you can go above and beyond those two but nothing else can be on those two circuits so one tool we already used the three default 3D you can also use the second one called camera now it drops a kind

**3:06:28** · of a perspective view of what we're looking at but you can do that inside so I'm going to hit camera and let's say I want to take a take a picture of this kitchen now where's a good point this happens to be a giant column in the middle of the room so that's not good let's take a picture from way down here and we'll click it and then you aim where you want to look and it's showing your field of view aim clear down to the past the end of this kitchen there there that's our kitchen now it's a mess the default view is an electrical view where you can see through the walls and you can

**3:07:03** · see all all our equipment now we can change that to different kinds of views go to shaded so that makes it look a little different but I want to make this so I can't see all this through the wall stuff one easy way is to go up to the discipline up top it's electrical just go to coordination and that will change settings if you hit apply that will change all the settings so that the walls are not transparent so there we go and that really shows what our kitchen looks like it's a nice view you can also hit f8 right here and you can use the look tool right here click on that and

**3:07:42** · hold it down and you can drag around and look around your model and you can even drag it off the screen and so we can look around and see what this thing looks like in 3D which will really help to visualize the space you're dealing with you can even apply a walk but I warn you that if you barely move the mouse forward like just creep it it moves fairly quickly so let me go just a little bit beyond my circle and you can see that I can do a slow walk through this so this gives you another

**3:08:15** · good idea of what's going on you you can also do sections elevations but I find that this 3D view really helps and it depends on how well the architect did it modeling of course but you can see our cooktop here that we hooked up you can see our dishwasher this helps to find those appliances that we had to find last time and there's this Hood that's sticking down from the ceiling exhaust Hood hit f8 again they can look around this shows that we have these two countertops

**3:08:48** · that I'm saying we uh need to get circuited we could share we could put one circuit on this countertop and another circuit on this countertop which is probably the most efficient way to do it and let's go that route I mean you could split two circuits between them but let's just go with the separate circuit so back to first floor so here we are with our countertops and these are

**3:09:14** · are out of the box countertop receptacles let's get started by circuiting these up we're going to hook all four of these countertop receptacles up to one circuit well how do we do that if you click on one receptacle you will see the power button up here this creates a circuit think of

**3:09:34** · it as connecting Upstream if you're thinking about your panels the top and it feeds down to the receptacle so the panel is Upstream from you we're connecting an upstream connection so we can click on this and then we can edit the circuit well right now we just need to connect it

**3:09:56** · to a panel we can select the panel visually by hitting this clicking on this and then find the panel in the model and our panel's close enough where that may work the other thing we can do is just hit the drop down for panel now panels that have the appropriate distri distribution system

**3:10:18** · set up that we can connect to will show up in the drop- down if this was a commercial job and we had 4 80 volt panels and 28 volt panels only the panels of the voltage of the receptacle the 120 volt panels 12028 volt panels would show up in this list so that's an indication also that you have things set up properly so we can again click on that now if you've already hit power and

**3:10:43** · you reclick on it again you can't get to the power button again because it already assigned that to a circuit even though you haven't picked a panel so go back up to the electrical circuit box now you get you get this box again let's go to panel and let's set our panel called panel there and it put a little blue little arrow thing on it which ends up being a home run symbol The Arc with an arrow

**3:11:10** · which we will add later right now we've connected this receptacle to a circuit in the panel M this is still highlighted over here you can see that I'm on circuit number one and it's set up with a breaker type connection the load name the name that will pop up in the panel schedule is just receptical I like to name these here because it's easiest to do while I'm connecting things up and I remember what area of the building am I in so I'm going to call this receptical kitchen so it's

**3:11:44** · one of the one of the kitchen circuits and then you you can set ratings and Frames here for that breaker kitchen circuits or small appliance Branch circuits as they're technically called must be a 20 amp circuit you'll have other circuits in the house that'll be 15 amp this is a 20 so leave it as 20 we don't worry about wire types and all that kind of stuff right now so we will just get the load name and the rating of the breaker and all that right now all this can be changed later but I like to do as much of this as I can as I'm going I find it easy to do as I'm circuiting so that's

**3:12:17** · great now I could just be done with this and have that circuited but I want to add the rest of these receptacles onto this circuit now when I already have this highlighted I can simply go to this electrical circuits and say edit circuit and then it automatically pops up with add to the Circuit

**3:12:37** · so now I'm in add mode and I'm in kind of a sketch mode adding and I can just hover over you can see these receptical are somewhat grayed out if they're not on the circuit mine is a little darker than these are so this means that these are not on my circuit but as I select and click on one it

**3:12:56** · darkens now that's going to be added to my circuit so I'm selecting the receptacles that I want and I find this a nice easy way to do this and when I'm done selecting those finish editing the circuit and now they're all connected well how can I tell they don't look any different now the way you can get to a circuit is to hover over over something that's on the circuit and then hit Tab and it

**3:13:21** · sometimes it takes a couple hits but when I hit tab you can see that the little help button hit tab again says electrical circuits I'm actually hovering over this circuit not the receptacle so now if I click I have selected the Circ the little dashed blue arcs and the little blue arrow and over here it says electrical circuits so now I know that I have selected the circuit and up top now now I have the option to add an arc or a chamfered wire to this now they call it

**3:13:53** · wire it's really conduit or a cable a multi-wire cable in this case but they call it wiring so if I click on that Revit will automatically connect these with arcs now if that's the way you want to show your plan this works great we do a lot of arcs in our commercial work I think it helps to convey what's on what circuit the other thing you can do of course is have no arcs and just put a tag on each receptacle to say what circuit it's on so either way now I must say that

**3:14:25** · Revit doesn't have a built-in circuit tag for the receptacle so you would have to make that but in this case we're going to use arcs and you can modify these arcs I modifying the arcs is kind of a whole trick in itself you can change the center point of that Arc so you can bend it to whatever

**3:14:45** · kind of shape you want and you can actually add more of these points if you right click on it and say insert vertex it will put another vertex now I'm going to say where to put it right there so

**3:15:01** · now I have another grip for a Vertex so I can make this complex if I need to get around something if I'm going around a lot of times outside the house you want to go around corners to show lighting you can bend this to your will now can I can also get rid of a Vertex right click and delete a Vertex let's delete this one and now I'm back to a single vertex you can change where this

**3:15:29** · attaches to the receptacle now it's hard to see with these thick lines so often times I will jump up to the top to this thin lines button and if you make it thinner then you select it then the little circle shows up a little better and you can move that's the attachment point you can move it around so if for some reason I was going across this aisle to this other one I could you know move it like move this where I want it to hit on here personally I like an arc to be kind of like that

**3:16:02** · I like it to hit as if it's going to the center where would it intersect the outside of the circle again you'll probably have your own standards you want this to meet you can make it show in the middle if you want I show it at the edge but a lot of options now there's a plus and minus here this would be for adding conductors inside this cable or conduit now I have this set up in my options to

**3:16:28** · only show wires on the home run the home run back to the panel but you can set this show shows wires everywhere but even in this home run if I click on it there's a plus and minus I can add additional hot conductors to this it would automatically do that for multiple circuits in one home run but even in my case if I had let's say in a bedroom I had some of these switched and I needed a switched hot and a a non-switched hot I could show multiple Hots so you have the option

**3:16:58** · to Show additional hot wires in there this is the ground symbol you can change it to different symbols if you want we just use the circle so that's the Home Run and even the Home Run you can move this around how you want change the shape of this Arc lots of iety I like to try to point it

**3:17:20** · somewhat in the direction of my panel board that's my preference some places do things differently and there's a lot of variety here so there I have that circuit go back to normal lines now I want to tag this home run to indicate what circuit this is again you can tag each receptacle if

**3:17:41** · you have the right tag but we have a built-in tag for this so let's go back up to tag by category and see what the default tag is right click on that it puts all in parentheses panel-1 maybe that's not the way you want to show it and I'm going to change this panel

**3:18:01** · name just because it I think it gets confusing being called panel so we're going to put it back to P1 that way we know that we're getting the name of our panel do we have options here if you click on that tag and go up to properties you'll find that there's sometimes multiple types types of wire tags so this is a wire tag panel and this is just a wire tag this wire tag is just the circuit now this may be more appropriate for this residential project when we only have one panel so I think that works if you want different kinds of tags I'll point to a video

**3:18:38** · above that I've done on customizing your tags you can have different kinds of tags for the same kind of equipment or in this case for the home run you could have different kinds of tags that you choose from but that's the basics of wiring and so we're going to go through here and just wire this place up I'll do the other kitchen the same I'm not going to go through all this here but let me show you a 240 volt connection let's review this cooktop over here edit the type

**3:19:08** · we set this up for 240 volt two pole connection and we set it up as a 5kw load so that's set up now we just need to Power It Up here's the power button power it up we want to go to panel it REM the last panel you connected to so that's P1 and there's no other receptacles on this circuit it's

**3:19:32** · only going to have the cooktop so we from here can easily just say Arc that wire one thing I forgot to do is put in all the data here so Escape out of here again if I hover over this receptacle hit tab

**3:19:47** · and this is going to take a couple tabs before I get my circuit now I'm hitting the circuit see it says electrical circuits 24 now I can click on my electrical circuit and I'm editing this the breaker type is a connection now it could be a a feed through lug things like that but breaker is what we want and then again I'm going to call this receptacle cooktop so that it's labeled on the panel schedule and it's going to be a 30 amp connection apply that and then I want to move this home run away from this and get this arked and if I need to I

**3:20:27** · can move where this guy hits this is adjustable now the only trick is if this guy was down here you've got to be careful because this little square is the actual electrical connector point and you don't want to pull a wire off of that because then you lose its connection you lose the home run and this wire is just floating in space so you have to be careful that you leave that guy connected to the receptacle connection point but there it put our two Hots in there and our neutral

**3:20:59** · and let's label this we changed this tag after we installed it so it still remembers the default tag now you can change the default tag a few different ways if we go to annotate here's the tag panel so if you go to the tag dropdown right here loaded tags and symbols you can take a look at all of the tags that are loaded and set up as default tags when you tag by category let's go down to

**3:21:33** · the wiring wires wire tag panel was that one that has the panel and the circuit we want to change it to wir tag by default and say okay now we set the default for when we hit tag by category now we get

**3:21:53** · our little circuit tag that we can drag around the other thing you can do is if you have different kinds of tags and you you want to be able to choose between different ones you can just find a tag you like rightclick it create similar and you will create that tag also so a couple different ways to do this and once you've attached the tag then you click on this and move around the tag goes with you so there you can go around decide how many circuits you want we're going above

**3:22:26** · and beyond what is typically shown for a house usually the electricians take a plan like this of just receptacles and they will apply it's a design build type thing where they will apply the circuiting and divide things up but you know in house they would probably have to produce a plan like this showing the circuiting so that's kind of the level of detail we're going to here is we are showing the actual circuiting for the receptacles the loads for these receptacles aren't done on a

**3:22:56** · on a per receptical basis they are done more on a square footage basis but that is the basics of how you circuit this up now let's take a look at the panel schedule that Revit automatically fills in for us and that's another huge benefit to Revit for electrical is that it does our panel schedules for us no more Excel panel schedules so if we go under the analyze tab it's under the analyze tab it's kind of an analysis of loads is the way I think of it that's why it's up here schedules are analysis we go to panel schedules right here click on there and panel schedules are created

**3:23:30** · using the default templates now there's templates for everything in Revit there's panel schedule templates so it's listing all of our panels we only have one and it's put in check mark yes we want to create a panel schedule for panel P1 say okay and it made it and it brings it up for us so

**3:23:48** · it uses a default panel schedule which looks like this this can be customized in fact what happens is some of these panels are are too wide when I throw them on a a sheet so you can narrow them up and that's a whole another lesson is how to edit panel schedules there's also separate schedules for switchboards and other kinds of equipment like that but we're going to stay with the the basics

**3:24:12** · it's a 12240 single it calls it single phase here Revit gets confusing because it says single face here but as you saw before when we clicked on the panel it showed a two so it depends on where you look you have to understand that it's a single phas three wire system Mains are rated 225 and you know we may end up having just a 200 amp circuit breaker which is the case for residential and what it did is it up circuited up our circuits that we connected in numerical

**3:24:43** · order one and then it applied went to two two and four because it's combined next one would be three then it would jump to four it's already filled jump to five that can also be customized in commercial work we like to Circuit 1357 we like to go this way first and then jump over to the other side of the panel again there's ways to set all that up we're going to go with the default for now and the other thing it does is it gives you a load classification at the bottom by load type that we set up and we have these all set up as receptacle now we could change the C cooktop to be more of

**3:25:18** · a a range type connection so that it would show up separately it also applies the demand Factor now right now it's just 100% but commercially if you end up with over 10,000 watts of receptacle it'll only take 50% of the rest so that's all done for you as well but anyway this gives us a running total of how many amps we have calculated commercially on this panel and we already have our 30 amp trip set up in our 20 amp we have this name set up that's why I do it when I connect them so that shows how the system is interconnected between loads and panels another thing I'd like

**3:25:55** · to show is a diagram of this electrical system now residential again it's very simple but it's still worth having a little bit of a single line or oneline diagram so how do we do that let us go up to a drafting view now we don't have any drafting views here because we need to make

**3:26:17** · there's none out of the box in this template so let's go up to view and you will see here there's our plan views here's drafting view drafting view is a view showing details that are not directly associated with a building model they're just like dumb lines it's like cat that's what we're going to do for our oneline diagram because there's no way in rabit to automatically generate a oneline diagram now I must say that there are third-party applications that you'll find out there that can produce prod a oneline diagram from your model if you want to go that

**3:26:50** · route and that may be good for you you know there's licensing and all that for those things so if you just want to do your own you can just draw your own they need a name for this drafting view I'm going to call it on line diagram now some people call it single line same thing and it applies just a random scale I like to just go these at 12 in to the foot one: one

**3:27:17** · and there there's my blank drafting view not much to it there's no symbols in Revit for doing single line diagrams like if we go all results even if you go to annotations and go down to electrical you'll find a number of switches a lot of tags conduit

**3:27:36** · size tag conduit fitting size tag receptacle annotations but you won't find any panel board or switchboard or circuit breaker any kind of symbols that we can really use in a oneline diagram so we just have to draw it ourself you can either draw it like for example if you go up to annotate we're in annotative mode now and go to detail line over here you have a choice of different kinds of line

**3:28:11** · types or line styles that are built into Revit and right now there's not many we have we have a thin line a wide line an MP hidden a medium line these are all built in medium line seem seems to be okay now you can create your own line Styles but for now we're just going to use again out of the box medium line and then you have a number of tools that you can use to draw these lines and you can just start drawing lines or let's create a box we want to create a on line symbol for our panel you

**3:28:42** · click here and then you start drawing and it's giving you some dimensions now what size do you want this well if you look at a piece of paper and you know you want the panel to be a certain size on your sheet you don't want it huge we're talking real units here real inches so I like a symbol that's maybe a half inch wide you have to zoom in to get that small a half inch wide and and it's kind of giv us some Dimensions at the bottom and it's in the it's going by 256 of an inch which is pretty fine you can change that around too but the further out you go the less precise it gets so

**3:29:20** · there's a/ inch and then I want 3/4 down so half inch wide by 3/4 you can also just draw this click on it and then you can click on here and change the dimension of 3/4 inch that's sometimes easier and let's throw some text in here now this tells you how you can justify the text top and then

**3:29:41** · left Justified we can also go middle up and down aine middle a middle line to bottom and we can Center let's go ahead and do top but let's do a center and let's put that here and let's write panel put that right right here and then we need

**3:30:02** · a name for that panel again we're going to be centered let's call it P1 so there panel P1 that's our panel and then we can draw just a just detail line I just clicked on the line

**3:30:20** · tool which is default I'm still in medium lines and I can go up here and we're going to say that the meter the self-contained residential meter is here so we need to draw another symbol so go to text and let's put an M somewhere here and then we can draw a box around it detail line use our Square use our rectangle tool now if you get too close to a text the text itself will

**3:30:52** · blot out your lines unless you go over here now here's here's the text tool on the right you'll see that there's a few different types we have 33 seconds aial and a quarter inch aerial built in and there's something used for a schedule so we're going through 30 seconds this like most things can be changed you can create your own type we can go to x edit type duplicate this 33 seconds aerial

**3:31:20** · and we will call this 33 seconds aerial and it applies a two automatically I'm going to call this transparent and we can change the background from opaque to transparent and say okay there's a bunch of other things here you can do okay now what that does is it makes the background opaque so it doesn't obscure our line work the other thing we can do is make make our box bigger or

**3:31:48** · sometimes the meter will just be shown as a circle and when you're selecting these lines you have to make sure you're not selecting the text you got to get in here and it highlights if you hit hover over line and hit tab now you will select the entire chain it's called of lines you can delete

**3:32:05** · that let's put a circle in say we decided our symbol is a circle so Center it somewhat there draw a circle and there's a minimum size like this is too small minimum size you can draw let's just draw it like that and now this is all pieces so if you want to window it and move the whole thing you can move pieces like that and then we want to draw we can rightclick and do create similar for this line again get it somewhat close and now we want to go out to our Transformer which is we're going

**3:32:39** · to say it's a little pad Mount like a ranch Runner they call Little 12240 pad mount so we can draw a symbol for a padmount Transformer and so we can do something like let's just say like this is the the the pad and then we will do some lines to make it look like a pad Mount whatever symbol you want to use for this some people will use an actual kind of a Transformer symbol that has windings and

**3:33:08** · the core and all that you can draw whatever you want this is simple so that shows a Transformer to a meter to a panel and then we can apply app Notes to these things we can call this utility Transformer or utility of pad Mount now again this is being left Justified I can change this back to

**3:33:30** · that this is still Center Justified I can change it to left Justified or actually when I create a new one I can make it also left Justified you can stretch your window to make this fit how you want

**3:33:46** · and then also you click on there up here you can add a leader like we did on the plan this the same as the plan view leader and get down here utility Transformer and you can start labeling your on line so again there's no symbols built in this gives me an opportunity to for a Shameless plug for a set of on line single line diagram symbols that I'm offering for sale if you don't want to

**3:34:13** · have to make all these you can just buy them for a reasonable price and use them so I will just point you to where that is in the description below I'll have a link to the whole oneline diagram pack that's on the MEP guy website for sale and as you can see here it includes circuit breakers and

**3:34:34** · fuse switches and Transformers and panels and all the pieces you would need and you just drag those in so let me show you really quick how that would go again if you're interested in not having a all of your own you can simply go that route so what we do is we would open up the library and

**3:34:56** · it's going to convert it up because they were done in 2020 so that they're compatible with 2020 and above open this up and you can see here it's one giant group I also in here have a sample drawings that can be brought in so a variety of complexity even this is kind of like what we're doing now

**3:35:15** · and you can see here these are dashed because they're existing now we're not using existing but this whole setup right here is pretty much what we need but let's go ahead and just bring in the whole thing if you open up the groups at the very bottom on the left you'll get to the symbols and the samples if you click on line symbols right click and say copy to clipboard now

**3:35:38** · if I go back into my on line diagram and just hit control + V paste and it says the following types are already here fill patterns and some materials that's okay now that whole group is put in and all of the symbols associated with that are in here now so if we go up to

**3:36:02** · annotations you will find all of the ER for electric Rob all the on line symbols so for example now I just take on line panel main lug only drag it in there it is it's a label based system where now I can just type

**3:36:25** · this P1 now what about a meter on line meter drag this in there's our meter it's kind of a box and a square and then we need a Transformer on line pad Mount they're alphabetical pad Mount Transformer drag that in it's a little bigger but there it is so now I just have to throw my lines on and we have in just seconds uh completed one line and these are copiable if this was

**3:37:00** · an existing panel click on it over to the right it says up here in the graphics it says existing click on existing and it's dashed automatically for you if I was to bring in that whole group of existing then I would also it would give me an existing line type but again just a little plug for that system if that's something that interests you if you're going to be doing a lot of these diagrams for even something more complicated than like a house that may turn out to be a

**3:37:26** · quick way for you to get up and running on your symbols because it takes a lot of time frankly it takes a lot of time for you to draw these symbols even if you create these as families if you learn the family editor and all that it can be done so there's a couple a couple ways you can go so we will uh just go with the out of the box and that's our on line diagram start of it we will be sizing

**3:37:49** · these wires and such later as we go but this gives us the basics so back to our first floor not in this video but elsewhere we will get all the rest of this connected and the same with the second floor we'll go through and we will just connect all of these to that panel that we have in there and get that all done I highly recommend that you jump in and actually practice this if you're

**3:38:12** · learning revvit get in here like I said before you can download this architectural model directly from Autodesk you can use the built-in Revit families to start showing receptacles bring in that panel like I showed you start connecting it and get familiar with how to connect and another thing is you'll need to get familiar with how to connect how to add receptical how do you remove a receptacle let's say we want to get rid of this receptacle well if I hover over this and select

**3:38:39** · the circuit like I did I can go up to edit circuit now instead of the default add to Circuit I can do remove move from circuit click that button now I will be UNH highlighting these so that just showed that I removed it finish editing now the wire stays here which is tricky and that can mess you up so you want to make sure you manually get rid of the wire but this is no longer circuited to that panel and as you can see I have my power button back again and the load on this panel if

**3:39:12** · we go back to our panel schedules which are over here the load on the panel has changed I don't know if you paid attention but now it's only 540 so that's the basics of circuiting and getting a oneline diagram started hey guys this is Rob welcome to episode five of the residential Revit electrical Series in this one we're going to finalize some of the circuiting of the receptacles we still have a floor receptacle that we need to add an electrical connector to and as you'll see it gets a little bit complex and we find VIs ility issues and things like that so stay tuned

### Episode 05 - Floorbox Family Editing & Panel Updates

**3:39:48** · for that as well as how we are going to deal with the bath fans so just a shorter episode this time but hopefully it shows you some basics of family editing and how to deal with some visibility issues with your families so here we are back in our Revit electrical residential tutorial project

**3:40:08** · where we left off in the previous episode was finishing up circuiting the receptacles in this two-story project so let's review some of that I want to show you a few things that I didn't cover but I would like to specifically cover here in our kitchen dining area you can see I have things circuited up I ended up circuiting these receptacles to one of the kitchen circuits I have dishwasher disposal all circuited separately I tied the hood into this kitchen circuit so

**3:40:37** · I made use of our circuits but what I did not do yet is circuit up these floor receptacles now the reason I didn't is as you recall back in oh episode 2 I think when we installed these we realized that they actually do not have electrical connections we had to dive into the architectural Revit built-in families to find a floor box but like most architectural pieces it does not have an electrical connector that we need to connect to our panel so we need to actually edit a family

**3:41:08** · now this is an advanced topic it will become essential to your success in Revit to learn how to at least do modification of existing families because out of the box revit's not really made for full production it's kind of a skeleton that you need to build upon anyway so let's get into some minor family editing we're going to look at this receptacle and it's an outlet floor duplex

**3:41:34** · and we're just going to go to edit family up here and it jumps you into the family editor and right now it doesn't look very exciting I can't see a thing I hit za Zoom all there's nothing here so we need to find a view where there's something to look at so on the left it's kind of like a mini project itself it has a project browser it has your properties on the right and there's other tools up top to help us build and modify families and we'll cover some of that as we need it but if

**3:42:02** · you go to the floor plans ceiling plans 3D plans elevations those are your views that are set up right now there's no 3D view for this device so that means that it's probably just a symbol so go to the reference level and there we go we see that this family just has a symbol and if you hover

**3:42:23** · over it you can see it highlights all one piece if you click on that it is a generic annotation and it's its own family because now we have the edit family available so the way things are done in Revit is you have a 3D object which is part of the model and then you have an annotative symbol or a generic annotation that is nested into this family to give you the look of the symbol that you want

**3:42:50** · in two Dimensions so that's how this works so this is a 2d family but our purpose here is to add an electrical connection let's see how we can do that so let's just go up to create and over here you'll see all these connectors electrical connectors duct pipes cable trays conduit so all the system

**3:43:10** · connectors for me we want the electrical connector so we click on that and adds an electrical connector to a component and we have to add it to a face you can see up here it's it's hosted they call it to a face now do we have any faces to host this to that is going to be our biggest issue is

**3:43:32** · there is no 3D faces in this family to even host an electrical connector so we are actually going to have to add a 3D element to this so this will get you really kicked off on your family editing experience so let's see how do we even do that so family editing 101 a lot of times you'll start off a family's 3D aspect by creating a 3D cube or a box so that is what we're going to do we're just

**3:44:01** · going to create a 3D box for this family now we could just start off and hit these buttons here do shapes extrusions Blends revolves or different kind of 3D shapes that we can do you can even this void forms will even let you cut a hole into a 3D object we're going to start with the basic Extrusion now normally in a family we would draw some reference planes reference lines which are like construction lines that form a skeleton to attach a 3D shape to we would normally do that if

**3:44:35** · we want to make it parametric and editable in your model if we want a box under this floor receptacle that we can change once it's in our family then we need to do all of this stuff again I want to make this very basic I'm trying to show this project specifically using as much out of the box as I can so I'm going to do the minimum needed to get this connector in so we are just going to build an extrusion so hit the Extrusion then they want you to draw a shape we're in sketch mode because there's a a check mark in an X hit the rectangle tool we're just going to create a box around this

**3:45:11** · Dimensions don't matter so much it's going to be about 8 in is square which works and when you draw this Extrusion it wants to know how deep is it so how far into or out of the screen is it going to be and up here the depth is 1T by default we can leave that as one foot and then we can adjust it later say okay let's see what we get now at this scale the line type is just super fat that's why

**3:45:36** · it's a just a Big Blob like if you click thin lines you can see that it's you know it's just lines but the other way to deal with this is in a family you can easily change the scale that you're looking at it it won't change anything other than how it's viewed but it of course does change the scale of the symbol because symbols are always the same size in paper on the sheet so it shrunk

**3:45:58** · it down which is fine for now we just want to see our shape we're looking at kind of a top view of it if you if you will looking down on it because it's looking at the floor we need to look at a side view so let's go to the front we can go down here look at the front double click front we need to change change it scale as well now we see it and there's this thing here called a reference level in our case we're going to be placing it on the floor we really want it to be below the floor here if we look at the reference level we are going to see this box in our model when we put

**3:46:37** · this family in there in normal two-dimensional view plan view I don't want to see this Extrusion I only want to see the symbol so we can set this box up to be viewed only in certain situations so

**3:46:52** · what I mean is if you recall down here there's different detail levels that you can set your view to fine medium or course and that will allow you to change the level of detail that you see in these families so what we can do is click on this Extrusion and over on the right there's a visibility graphics overrides for that hit this and now here's some view specific displays we're

**3:47:20** · going to display this Extrusion because we clicked on the Extrusion not the symbol we're going to display this Extrusion in 3D and you want it to show up in the plan or ceiling plan no do you want it to show up in a front or back elevation left or right elevation yes that's fine and then

**3:47:40** · the detail level we want to be able to control whether we see this EXT Extrusion at different detail levels I want to see it at fine because fine means super detailed so I want to see all that Medium is you can decide whether you want to see that or not and I definitely don't want to see it in course so do that okay so that should set up this Extrusion to be only visible in 3D views

**3:48:06** · and sections elevations and especially only if it's set up to something other than course so now we have the Extrusion made now we can apply that electrical connector which is the last piece so back to create back to electrical connector now you can see it highlights that Extrusion so

**3:48:26** · that's a face that we can apply so if I just click here somewhere it put my electrical connector in there that's what this symbol is circle with that plus so if we click on that symbol and look over to the right you can see that it's a connector element for electrical loads we have a bunch of parameters for this electrical connection that we can set you'll see a number of these in our model when we clicked on a receptacle we actually saw a voltage rating and a load rating and even a load

**3:48:56** · classification now we don't have all of this we don't need all of this visible in our model so we need to decide what do we want to see first of all any kind of load like this that what I mean by a load is it's not a panel it's not a distribution piece it's actually a load I want to make it balanced which means if I make it multi-pole the load the spots will be divided among all of the poles evenly which is how loads typically work now number of poles is one which is perfect for a 120

**3:49:25** · volt receptacle if that's all I'm ever going to make this floor box is 120 volt receptacle then I can just leave it at one and I don't need to change it the trick is if I do want to be able to adjust this in my model then I need to what I call is map these parameters to the family or they also

**3:49:45** · call associate it so associate this with a family parameter so that I can get to it when I'm in my model and I'll show you how that works that's why we can change the voltage and pole of some of these things that are in our model I like to go ahead and Associate Poes as well just in case I want to change this guy to a a 240 volt floor outlet for some reason I just get in the habit of that so I'm going to associate it with a family parameter and and it's asking if there's existing family parameter of a compatible type there are none I need to create a new parameter again if

**3:50:21** · this is all new to you you will have to go through this and try it a few times to get familiar with it there's a few basic things to learn on in basic families so we're going to call this parameter the same thing we're going to call it poles and we can say number of poles or just polls typically works now it's an electrical discipline it's a number of poles it already knows that now where do I want to group this you know when we open up the edit type there's a there's grouping of all of these parameters I like to group this just under raw electrical rather than circuiting lighting loads

**3:50:55** · it could be under loads but I like to just call it electrical so they're grouped together so I'm grouping it under electrical I want this to be a type parameter because I want to set it once and I want all of my instances of this floor boox to be the same the same so I want it to be a tight parameter okay and then okay now we've created a type parameter and if we go over this box up here

**3:51:21** · the family types with little blue click on that now it shows us what we would see in the edit type box an elevation which is Zero's fine and here's our number of poles that we just added so now that means that we can get to this parameter within our family now we can't get to voltage we can't get to load so we need to continue mapping or associating these connect parameters to our family so okay we

**3:51:49** · need to reselect our connector Now power factor I'm not going to change that in the field lagging is normal load classification I do want that available so again create a new parameter load

**3:52:06** · classification and we're adding this as a family parameter it's going to be a type again and I want this again again it put under loads but I want it under electrical so they're all together and say okay okay let's check again make sure there it is load classification now is here okay let's do another one we want voltage available same thing voltage type we would have

**3:52:38** · all of these parameters under all different headings if we just left the default so we want to force it to go to electrical okay okay I like to verify that it is where I want there it is and I'll set it to 120 volt as a default and then the load classification not not all of our load classifications that we find in our model are actually in this family as you can see there's only a few so just leave it as other for now and then when we put it in our model we can actually set that what else do we need to map or associate we want the apparent load

**3:53:14** · now that they've been Associated or mapped they have little equals so let's click on this little teeny button over here and this one is a new parameter again called parent load and this will be under electrical okay so now you're learning how to edit a family and

**3:53:39** · again this is key to your success in rabbit and we will cover more of this I have a bunch of of other videos on editing families the true power of Revit happens when you create or obtain these custom families and it makes your life so much easier because they're already set up you can make them look exactly how you want in your model and and go from there so we just want to make sure we have the data here available so that should be it and let's just double check we have number of polls a load and let's put this at a standard receptacle commercial at least and there's the defaults we

**3:54:16** · are good to go now we can save this as a separate file if we want but for now I'm just going to load this into my project and I don't even want to save it outside of my project as a separate family for now now if you're trying to create a library of custom families then you would go ahead and save this and give it a a proper name and things like that but for now for this project I'm not going

**3:54:40** · to save it externally we're just going to load it and I'm going to overwrite the existing version now do I just want to overwrite it or do I want to overwrite it and its parameter values now if I had already set up some parameter values in my model for this receptor goal then I may not want to overwrite the existing parameter values so that's why I typically go with overwrite the existing version but not its parameters if they were set and then this just says it's not edable

**3:55:08** · you want to make it edible sure let's let's edit that and that just means that it let me change it and the receptacles disappeared well let us figure out what happened here they worked fine before we added that Extrusion there's one here what is this look's look at this one over here it's on level two at 0 0 so we are seeing the level two receptacle floor box while we're in

**3:55:39** · level one well first of all that issue will be a view range issue because as you recall this floor box is an extrusion now that sticks down below the floor what is our view range set up in this view Under The View template so let's go look at view range and the bottom is our Associated level

**3:56:04** · at zero offset and the top is the level above at zero offset if the floor box above is mounted to level two it protrudes down down in below level two by 5 or 6 in so that's why it is visible we need to lower the top of our range to eliminate seeing the floor box so we'll need to come down I would say about 6 in so minus 6 in apply that and that is often needed as we find out and there

**3:56:39** · we go now we do not see level two that fixes that issue but we we still can't see our floor boxes we can investigate this a number of ways is it a view range issue did we mess up the family what's going on we can look at view range as an issue but we didn't change where that symbol is we

**3:56:59** · didn't really change anything that should affect it but let's just play around with that so let's go into our view range again and let's look at the view range the bottom of our view range we are at the associated with the zero we know this box goes down below the floor it appears that it got mounted to the right level because level two was there let's reduce the bottom of our floor let's go minus 1 in say apply okay now they showed up well why is that we had to go

**3:57:31** · below the floor to see them well what it turns out to be is that the Extrusion starts at zero and goes down below the floor so the view range doesn't see the Extrusion exactly at the level even though the top of our Extrusion is right at the level so in effect adding an extrusion to this family has changed its visibility properties from when it was just a symbol it's a very obscure issue that I frankly have never run into before so let's go back into our editor edit

**3:58:10** · family and go to to our front view as you recall this Extrusion only goes up to the reference level and we need to pop that up just above the reference level so that it can be seen this Extrusion can be seen within our view range that we set up so just again adding an extrusion to this symbol made it behave differently in Revit simply moving

**3:58:38** · that up above the floor will make it visible so load into the project we don't want to save it let's just overwrite the existing now if we set our view range back to exactly at floor level bottom Associated level with zero offset apply we should still be able to see our floor

**3:59:00** · boxes and there we go so we just had to pop that Extrusion up just up into our space a little bit so we're going to Circuit these up now I'm I'm going to figure that these receptacles are part of the kitchen and dining area which need to be on kitchen small appliance circuits and then the rest of this I'm going to call just living space so let's get these guys circuited like we did before now we have our power button because we added the power connector power and then I like to call this receptical shining apply that and then I like to edit the circuit and add the rest

**3:59:38** · of these and they're easily added now you can see them highlight up like I did before finish finish circuiting and then I hover over one hit tab until I see the dashed circuiting click on that now I've selected the circuit Arc wire and there's our arcs and we can adjust these as we see fit we can move

**4:00:00** · where they're attached those look fine they're attaching nicely and let me get out of the thin lines they're attaching nicely to this symbol which is nice sometimes they don't so let's get this and I like to play with The Arc I get picky about the these things and there's our circuit

**4:00:21** · and then I want to attach these guys to this hallway circuit so again hover over till I get the circuiting click on it now I'm in the circuit then I can edit circuit and by default add to the Circuit these other receptacles those are added finish editing go back to one of them hit tab

**4:00:44** · select the dash click it and Arc wire it and then I can adjust my arc now one thing I noticed when I was putting these in is we did not yet assign let's go to edit type for this floor box we did not yet assign a load classification since we edited it so we're going to go to receptacle okay and now we apply the correct load classification which applies the correct

**4:01:14** · demand factor and separately labels it down in our panel schedule so let's take a look at our panel schedule since last time we saw it we've added a lot of circuits here we go see that I also want to show you in case there's a few here like I did where I forgot to name the circuit description as I was placing it now I need to go back and figure out what was Circuit 3

**4:01:39** · well I can go back to my plan and on a simple plan like this it doesn't take long to find it like for example I just found it here but on a complicated building you can imagine with multiple floors or you know hundreds of thousands of square feet of school finding that circuit would be a nightmare so let me show you a trick you can go to the panel as long as you have these plans already tabbed click on this circuit Escape out click on this circuit it's it's selected now

**4:02:08** · if I go to first floor plan it highlights in blue and so if you're out here you can kind of kind of see some of it starting to turn this is the panel and the circuit is surrounded by this blue dash so this will help you narrow in on where it is and here's the blue receptacles that indicate those are on that circuit 3 so that will help you find it so now again Let's

**4:02:32** · Escape out of there tab into this circuit click on it and from here which I should have done I can type recepticle and this is another kitchen recepticle circuit we have a few other circuits let's see see what we have down here 13 click on 13 go back to first floor plan there's the panel lit up do we see any blue lines oh here it is a little bit of blue down here with a little bit of blue line so that is in our laundry we can highlight this and a

**4:03:04** · receptical another laundry circuit and then the final one that I saw that was not labeled is this guy and where is he first floor 21 right there there's the blue highlights and that is just the circuit we were dealing with which is kind of extended Hall so we'll just call this Hall tab tab accept go okay so that finishes

**4:03:35** · those so then to deal with this circuiting in this kind of order down the left down the right let me show you where that's taken care of under manage go to me settings go to electrical settings

**4:03:54** · and then you would think it'd be down here with panel schedules but that's not where it is now one thing you can do with panel schedules is we can merge multi- circuits into a single cell I like the visibility of that so let's do that but under a general there's all these different electrical settings and how you want to display your circuit settings Name by phases capitalization of names

**4:04:20** · and then we get to Circuit sequence which is what I changed now the the default is typically just numerical 1 2 3 in order I like to move it down to odd than even so it goes down the left side and then down the right side you can set this however you like but that's what I like to do and that's helps with the circuiting for me so so I don't need to move things around and as far as moving things around I have a whole video which I'll link above which talks about how Distribution Systems

**4:04:52** · work and how to do some panel editing you can edit templates but I'm going to show you how you can move things around you can just click on a circuit and then up left you have some move tools here you can move it up move it down or move it absolutely to an exact place so if I just move down you can see that just keeps dropping over here I can move it up now if I move this down this entry hall move

**4:05:18** · it down it will actually swap with the dining right there and continue moving down now I can move this to an absolute so it's the green one is what I'm moving and I'm going to move it to there so you can move things to places I can move it to this place and that will swap it so there's

**4:05:43** · a lot lot you can do with with the circuits and since Revit automatically assigns circuits for you that you need to have this flexibility to arrange things the way that you would like you can change the template of this and we'll get into that later that's more advanced is how to mess with the templates for these things but for now the basics of this are we can move things around we can also create spares and spaces in here so quite a bit we can do with the panel schedule but I just want to show you some of the basics but the other thing I want to show you here is on these bath fans I

**4:06:20** · did not circuit them to the bath receptacle I've decided that I would like them connected to the lighting circuit now they can either be on the same switch as the lights when I get to Circuit the lighting or there'll be a separate switch but either way I want them on the lighting circuit so that in my box switch box I only have the one circuit in there so to do that I will eventually connect this to the lighting circuit but for now I don't have a circuit so I'm just going to

**4:06:52** · use the wire tool systems way over here wherever these can move around so right here is wire click on wire now I can pick the connector of this bath fan I don't have to use the automatic wire feature this is the manual wire feature right here you'll find something highlight that's the connector for

**4:07:12** · this bath fan the electrical connector one point and then here's the midpoint of the arc and then I'll draw the end of the arc right there and then it hooks it to the middle it doesn't draw a home run because it's not assigned to a circuit so I can still just put a little text note here and it says two lights something like that to indicate on the power plan that this goes to the lighting circuit and refers the uh installer to look at the lighting circuit so that works for that and I've already done that up here on the second floor bath fans to lights to lights so you can see the second

**4:07:45** · floor I still have a floor box to hook up luckily we went through and fixed it so it has a power connector we want to connect that to the master bedroom circuit so let's highlight this circuit with tab a couple times there it is edit circuit add to Circuit right there finish it and then we have to get back into it with tab to get the arcs and it decided that this is the closest place for an arc so that completes that and one thing I want to show you here that I did in this hallway this

**4:08:21** · receptacle and this receptacle around the corner and to have a single Arc it was really cumbersome I I didn't want the arc cutting through the middle of the room so I used like I showed in a previous episode I used the add a Vertex so if you right click on here you can insert a Vertex into your Arc and this little dot shows shows you where it's going to be like right there so now I have extra control of this of this Arc shape to start getting it to bend around a corner so keep that in

**4:08:58** · mind when you need to do some interesting geometry now this one here I didn't mind it cutting through here because it's not cutting across any text or any other lines so back to first floor one more thing I want to add is I want to get a receptacle out here by this conding unit for servicing it and at least in commercial buildings you have to have a receptacle within a certain distance I think like within 25 ft so let's go ahead and rightclick create similar let's get a receptical

**4:09:27** · out here near this condensing unit and we'll just attach it to this receptacle circuit so just get into the circuit edit circuit and click there finish it tab Arc bam there it is so once you

**4:09:43** · get familiar with this it goes fairly quickly you can move these around again if you need to go thin lines so that you can see this little grip and you can there's the grip so you want this grip to hit through a circle not there so use thin lines to your advantage so that should complete the

**4:10:03** · circuiting of our receptacles including that floor receptical that we had to edit and that concludes this episode next time we will get into installing some lighting fixtures and getting those circuited eventually as well so by the way if you're getting some value out of this video I'd sure appreciate you hitting that thumbs up like button down below and if you want to see more electrical only future videos please hit the Subscribe button thanks a lot I appreciate you in this episode we're going

### Episode 06 - Lighting Modeling

**4:10:34** · to be creating our lighting plans we're going to look at the architectural model to see what kind of lights are in there and what kind of ceilings we have we're going to to then copy some of those lights and put them into our electrical model and see what kind of troubles we run into trying to find ceilings within a linked architectural model we're going to learn how to load different Revit out of the box light fixtures and how to pick different kinds of light fixture tags we're going to show how to create a lighting schedule and get that started so a full episode coming your way

**4:11:07** · stay tuned so we're starting this episode off back into the architectural model that we downloaded back in episode one if you can recall we are using an outof the-box Autodesk Revit project that they give you in their downloads area you can go back to episode one to check that out if you need to we're looking in this model to see what the Architects have planned for lighting now you'll often have an architectural plan that has some lighting in it maybe from the architect or from an interior designer perhaps they have a lighting designer on board or even some projects they will

**4:11:39** · have the electrical designers do some of the lighting design if that is your wheelhouse let's take a look and see what they have we're going to look right now at some of their renderings that they did to get an idea of what's going on in here and in here as you recall we have a kitchen and we have a couple lights shown we have some suspended linear lighting here with aircraft cable and another one here over the kitchen that's all we see in this View and let's take a look at this view down here this is the sunken living room as you recall from previous episodes and they have

**4:12:09** · what looks to be ceiling mounted track lighting and these are just flat level ceilings in both of those areas and we're just going to deal with the first level in this episode but in the future we will see that the second story has some vaulted ceilings so that's another type of ceiling that we'll have to deal with and get some lighting up in the vaults and see how we deal with that but we're going to look at the first level right now they don't show anything here at least in the renderings for exterior lighting there's no lights out here by this parking area so we will have to

**4:12:45** · add some lighting and again we can assume that we've got some lighting information from somewhere else we'll also look in here to see what they have for plans now on the left you see we have floor plans 3DS elevations sections detail views renderings we do not have any plans called ceiling plans or lighting plans we just have the raw floor plans so to actually see the lighting in plan view

**4:13:10** · we're going to need to create some ceiling plans in this model at least to see what they what they've done so the way you do that is you go up to view and plan views there's a floor plan View and then there's a ceiling plan view back in an early episode we set up some lighting plans based on SE reflected ceiling plan views so that's what we're going to do here just to see what they have so reflected ceiling plan and it gives you the option to select which levels let's do level one

**4:13:41** · and see what we have for lighting so it creates a ceiling plan and there's no view template assigned to this and it's just assigning a view range some preset view range but it appears that it works for this kitchen area because these look like lights here so in the architectural model we can easily just hover over these and see what it is lighting fixture sh lighting pendant light control mod 66 so this looks to be a vendor lighting family that was brought in and if you click on it

**4:14:13** · we can see there's a power button which is a good sign as far as connecting it but we actually need to bring lights into our electrical model so that we can connect them we can't connect a linked light so we're looking at a few things we want to see where they're putting lights and how they're mounted and also is a possibility that we can actually kind of Steal these lights and put them in our own model to connect them so a power button is a good sign and if we look at

**4:14:41** · the type parameters of this light we can see that we have some voltage selectors and they've got 277 selected now but you can looks like change it to 120 with this button and there's some apparent load there's an apparent load spot here so we have electrical data in here that we can use to connect it which again is a good sign there's that light and then so we can't see lights down in this area here so let us take a look at our view range to see what we're dealing with and we'll also cut a section so we can compare that view range to the section so cut a section right here you have to

**4:15:17** · be out of the section then you can double click the head to see the section and we've got level one level two and there's our lights right there so we can make these levels a little more visible readable by changing the scale and we're in metric in this architectural model so let's change it down to 1 to 50 let's go down to 1 to 25 and get that text reduced so we can read these so

**4:15:41** · we have our level one living room which is the living room and we're not worried about that part right now because in our ceiling plan we're looking up at the ceiling we're not looking down at the floor so the floor line is not as critical we have level one and we have a ceiling and a level two and ceilings up at 2700 let's look at our view range now we have to go back to a plan

**4:16:03** · to do that so go back to our ceiling plan look at the view range what do we have the bottom is at the associated level level one and it applies the same offset as our cut plane so the cut plane is here and then the top is at level two so we got level one to level two which makes sense but let's take note of the cut plane they're cutting it at 2300 where is 2300 so we have level one to

**4:16:29** · level two we're in that range but where is the cut it's cutting the wall like a section well 2700 is the ceiling so 2300 is pretty close if we were to draw a line let's just draw a line up here and let's move it let's see what the dimension is dimension ceiling to here and we need that to be what 400 click this and move it up to 400 our cut plane is actually above our ceiling

**4:17:13** · so the ceiling of this dropped living room is also dropped the cut plane is way up high so typically on a on a cut plane on a plan I usually have down around 4T and so let's get that cut plane down below because what what we're doing in this level is we are cutting horizontally above our ceiling and so like if we click on that we are actually seeing a roof so we are way too high let us change this view range range down to something like 500 and voila there they are it was all about the cut

**4:17:53** · plane so we are down around 500 we're cutting right there and that's why we can also see this television is because we're cutting through it so we got the cut line right now we can see these lights so if you have trouble finding things check that view range it is the culprit for many of these issues that third dimension is very tricky we have these lights and looks like they're individual track and one head and this guy if I can select it tab it track with

**4:18:29** · one head so this is all track with one head and it is the style it's a Cooper RSA profile series okay so it's another vendor lighting it have a power button again a good sign let's make sure it has all the connections we need voltage wattage um actual parent loads here and voltage we to

**4:18:54** · see which one's which there's a couple different voltages that gets confusing but that's what you get when you bring in a vendor's light sometimes it's a little messy but we'll see if we can use that we know what lights are in this thing now let's take a look and see what else is going on what do we have for ceilings in these other rooms and we can drag this section around let's look we're going to be looking at this this ends up being the laundry room we recall from before and it looks like here's the washer tumbler and we have just flat hard ceilings tied up against

**4:19:27** · this floor joist and I think we'll have the same in the mechanical room and the bathroom we can just go to our section and the bathroom there we go got the sink hard ceiling and the mechanical

**4:19:44** · room here hard ceiling so and even the hallway out here out here is a hard ceiling until we get to the stairs here's the stairs going up so we know that the whole first level is all flat jip board looking ceiling so that's good to know the last thing we want to do is let's

**4:20:07** · try to bring these lights into our model and try to use them um they have electrical connectors and we can see how that goes if not we have other options now one way you can bring these in is you can click on it and we could go to edit family we're in the family editor and then we can save it from there and then we can load it into our model another way we can do is go directly to the project browser and go down under families and go find those lights now I'm using 2023 Revit so it

**4:20:36** · has a nice feature in it that isn't in some of the earlier ones if we click on a light and rightclick we can say find in Project browser that's a nice shortcut it will open it up over here on the left for you and highlight it so here's our we can't click on the the one of the types we can click on the Family itself right click we can just save it and save it directly into our project folder so I'm just going to save it with this name with an option I like one backup okay I hit one and

**4:21:06** · then we have to actually hit save and then we'll save it now this says the light source is inside solid geometry no light will be emitted that just means if I'm trying to do some kind of a zonal cavity they call it lighting calculations with this it's not going to work well we're not using this for lighting Cals personally I use visual a lighting programmed by a QD outside of Revit to do my lighting Cals my point by points but you can do some rudimentary lighting Cals in Revit if you set it up properly and I may cover that in the future now this track same thing right click

**4:21:41** · the track and hit the save button and save it into our project folder with option of one backup okay and then hit save to actually save it now those are in our project folder and we can bring those into our electrical model so I can see right now we are done looking at this architectural file we can close it we don't want to save any changes so we hit open override existing copy

**4:22:13** · again this is a workshared project so we have a central model on our server and we create a local copy every time we open it up and then we synchronize with that Central now and then so here we have our lighting plan where we left off before we had created these in an earlier episode just a couple lighting plans and a reminder that these are called ceiling plans because they look up at the ceiling they're not looking down at the floor they're actually looking up at the ceiling it's look the model's looking up at the ceiling so we see things up from our cut plane like we just

**4:22:48** · saw in the architectural model now one thing I do notice is that I do see some receptacles in here I see some Motors so we have some categories turned on in our lighting view template over here that we need to turn off and again this is something you would set up in your project template when you set up view templates in a project template you want those set up to have the proper visibility right at the get-go when you open up your project template to start a project we'll cover project

**4:23:16** · templates uh in a future video but right now let's deal with the view template and there's a lot of different kind of templates in Revit so it can get confusing in the view template we want to turn off the electrical fixtures category so we go into our model and we go down to electrical

**4:23:33** · fixtures and you can see they're turned on turn those off and then electrical equipment we're going to leave on because I like to see my panels and switchboards and stuff and such in my lighting views as well because I'm connecting to those so say okay and that will turn off those electrical fixtures or devices another thing I'd like to do now is get some room names into these room tags like we did in our power PL so power floor plan for example here we had these room tags we

**4:24:03** · want to put those into our lighting plan now in CAD you might go around and copy these and paste them things like that but we just want to use the room tag directly in our plan so let's go up to the annotate over here under tags we have room tag click on room tag now the first thing we get is an

**4:24:23** · error a warning rooms are not currently visible in this view a view template is assigned to the view in order to make rooms available The View template needs to be edited or removed so this view template doesn't have rooms turned on which is actually a 3D entity a model entity so let's

**4:24:42** · manage our view template again we need to turn rooms on in our model so let's go down to it's actually a model category not an annotation the tag is an annotation but the room itself is a 3D entity so down here in the room as we can see it's turned off by default in the Revit lighting template so okay and let's check The annotation and I could also get to it from up here The annotation and make sure we have room tags turned on so room room tags are turned on let's see if

**4:25:15** · that helps so now we can see our room tag and we can place it where we want right here and then we get another warning now I'm leaving all these warnings in to show you that this is real life and Revit frankly a lot of videos I think gloss over some of this they will cover you know

**4:25:34** · just throwing room tags in throwing lights in this and that without any warnings or anything like that but in reality you're going to run into instances like this need to know how to fix them warning none of the created elements are visible in this reflective ceiling plan you may want to check the active view its parameters visibility settings as well as any plan regions and their settings okay so there's a whole list of things to check let's start with this active View and look at some visibility settings now we're dealing with rooms we already turned rooms on so that seemed to do something but let's go check rooms elsewhere remember we have a linked

**4:26:10** · architectural model let's go check rooms in there so down here the visibility Graphics override and the reason it's called override is because you can override a number of the built-in settings see all these overrides you can click in here and override things so that's where that comes from but let's look for rooms in the arc we're in the Revit link display now to remember where you are let's check the rooms now rooms are turned off in the Revit link let's turn those on here also there's a lot of places is to turn things on and off voila there it is it turns that on so that

**4:26:48** · was the issue so now we can place our room tags and also something we do in our project template is I like these room tags to not be so bold so let's see how to fix those to be lighter those are in our model they are an annotative element the tag itself so if we go down to room tag

**4:27:12** · there's a half tone column and that's the way we can dim this down so under room tags if we click the half tone that'll automatically shade it for you and see how that's not as dark so that's what the look I want again is something we we would fix in a project template let's go ahead and do the rest and I can just right click and say create similar and we can do the rest of the rooms

**4:27:37** · and we can move these around as we need to when we install our lighting get the living room so those are the major rooms any area that's blue is a room that we can tag this is just an interstitial space part of the kitchen so we're good there so we've got those in Escape out of that okay now we want to start bringing in some lighting fixture families now remember that we saved the fixtures

**4:28:04** · from the architectural model so let's bring those in we bring those in with the insert and we're going to insert we're going to load a family let's load of family and it drops you into its default location so I'll just navigate here to our actual location our project location where we saved them so here we are in our project location let's go find those and here is the sh lighting pendant and then the track and we're going to hold control and click that so now we have both of these selected and just say open and it's going to load them into our project so now we should find them down here

**4:28:40** · under families and I have families open and we know these are lighting fixtures and here they are model so the way we pull these into our model is we just drag we can drag one of these you can also go up here to the systems and go to lighting fixture and go that way I like to use if you've

**4:29:03** · seen my videos before you know I like to just drag things from the project browser kind of like a tool pallet drag it in and place it now let's see what's going on here it looks like a super long fixture so there's something going on with this model that makes it look strange and we can click

**4:29:27** · on it hit plus to turn it move it around let's use our section now we have one long section here we can make it longer by dragging that Circle double click let's see what we have well we moved the

**4:29:47** · section but it didn't actually move the visibility settings so let's move that over so here we are now I can highlight over there this is ours this is the architectural ours came in with a little Gap and it does say it's hosted to our linked model so this is a face hosted type of fixture

**4:30:15** · but it's not hitting the ceiling and it has and it has an extra length we can close the power plan so I think I'm going to not use this fixture it looks like it's got some crazy things going on so after

**4:30:31** · all we're just going to get rid of this fixture so what are we going to use instead well in our projects we use a whole bunch of custom light fixtures that we use that we like that are simple shapes and things like that made for our plans because we're not doing photorealistic rendered type of lighting drawings electrically we're mainly looking at connections and get a relative

**4:30:53** · 3D object in there for doing some Clash detection so we use a lot of custom but for this tutorial I'm trying to use outof thee box elements just so you can learn how to do this without a bunch of custom work so let us go up to the insert again and go back to the load Autodesk family from their

**4:31:11** · cloud I've shown this before on the power side of things let's look at the lighting side so it puts you into their cloud-based families and let's go down to lighting category and you get a bunch of different lighting both architectural and MEP now the architectural ones typically do not have electrical connectors and they could be ceiling hosted we don't have an actual ceiling in our model we have a link architectural model and in Revit that linked ceiling doesn't isn't a ceiling

**4:31:39** · entity anymore it's just a face so it's kind of an anomaly about Revit so we don't want ceiling hosted things either we can have face hosted but not ceiling so let's go to the me and they have exterior external and internal so exterior and interior look at the interior now we have a bunch of different kind of Lights here and you may want to bring a bunch of these in and play with them get a feeling for what they are how they're hosted some are not hosted some are floating so you take

**4:32:09** · a look at quite a few of these but let's see what we have we have a ceiling light flat round we may be using that a downl light recess can well we may do some recess cans let's try that we have a downlight strip under cabinet and these are hard to see in these tiny little thumbnails floor lamps pendant disc pendant hemisphere pendant linear two lamp and here's just a pendant lighting fixture

**4:32:37** · let's try that and we have some recess lighting surf surface lighting so let's just try those for now and it should load them over here here we go let's look at this pendant it looks like a pendant linear and it's set up with sizes and voltages so let us try the 8T 120 volt and bring it in and we can use space bar to flip it around so let's put it just in here

**4:33:09** · somewhere to look at it where did it put it if you click on it it says it's hosted and it put it at 81 in a fraction so it sounds like it put it on a ceiling now this is a hosted fixture just automatically connects to a surface look at our section and this looks

**4:33:28** · like our fixture it looks like it did attach it directly to the ceiling and this is their fixture so we can tweak this it looks like we have a pendant length that we can change and then if we go to edit type we can get in here to the actual cross-sectional dimensions and the length and Vary all that so we have a lot of variety and we have all of our loads and voltages and such that we need to connect it because it has a power button so that's all good so I think this is going to work now let me show you a contrast of putting a light

**4:33:59** · fixture in a floor plan versus a ceiling plan let's go back to that floor plan this is a good exercise now I can see the light I'm going to put this light in again I'm going to drag it in and if I put it in here it looks the same I'll put it over here I'm in my floor plan now where did it go where did it connect oh look at that now it's at zero elevation it's hosted to what it's hosted to the floor so a floor plan looks

**4:34:35** · down it sees the floor as the surface to connect this light to and you see plan it's looking up it sees the ceiling that is the exact difference between ceiling plan floor plan so that is why we use a ceiling plan to mount our lights so get rid of that guy now this is nice to be able to see the architectural Lighting in here to to compare

**4:35:00** · it but I can't see it in my lighting plan I like to make the architect's lighting visible as I'm constructing my lighting plans I will I will want to turn those off eventually when I present these on a on a sheet for a final drawing I don't want them to clash but how can I turn them on in the meantime well I could just go to my view template and turn on those lights but then I have to turn them off again so what I do is I create a separate view template for what

**4:35:28** · I call coordination I can coordinate my lights with their lights if I have a plumbing and HVAC plan I can bring that in and also coordinate that way so I can use a coordination view template to change the view so how do we do that we already have our normal lighting ceiling view we can

**4:35:49** · just copy this and then change the name and then change some parameters to create a coordination view now a little trick I use if I just go to duplicate for some reason Revit doesn't give you the old name for you to for you to change you'd have to type it in and I'm lazy instead of typing all that in I like to just go to a trick and do rename rightclick copy that cancel out and then go to duplicate and paste it right in and then I can change it easily that's just a little trick I use so I'm going to do coordination so I'm creating another view template called coordination

**4:36:26** · and I want to turn on the lighting fixtures in the Revit link so go to edit custom let's go to the model category and down to lighting fixtures we will turn those on and we can turn light devices too they may have which is like switches and sensors they may have those turned on so let's do that in our coordination view okay okay now you can see that pops the

**4:36:56** · fixtures on now we must have our view range set up properly in this view because I can see all of my lights so that's a good sign too we don't have a crazy cut plane issue like we did in the architectural so now we have Theirs to look at and in ours are different some people like to turn their lights of different color so you can compare them so we can do that as well now that I'm in the coordination view I can go into my model and turn my lighting this is where you can do actual override so this is projection or Surface we lines patterns

**4:37:32** · transparency now I'm not cutting the light fixture I'm it's projecting onto my plan so I want to change the projection override it and put a color into it so I'm going to color these blue so my lights are blue and I can just do that for my coordination view I don't need them blue in the

**4:37:52** · final but it's nice when I'm coordinating to keep track of what's what one more thing I'll say about this coordination view you can either switch view templates back and forth in our lighting plan and we've done that before but sometimes you can forget to switch it back to your actual produ or sheet view so what we do instead is we just go ahead and create another view another ceiling plan called a coordination view that always has the coordination view template assigned to it so this

**4:38:26** · production view I want to go back to my normal ceiling view this is my sheet view that I'm going to drag onto a sheet and then I want to duplicate this duplicate view to create a coordination view so I don't have to swap templates back and forth anymore so I can just duplicate The View and that just duplicates the model elements of the view or I can duplicate The View with the detailing which

**4:38:52** · means 2D annotative elements like the room tags and any fixture tags things like that so I'll go ahead and duplicate with the detailing I might as well have my room tags on it so you can see here it made a copy I can go through hit F2 and just rename this and I create a whole another set of digits here I'll do the the 10 series so I'll make it 11 this is just to help organize it and I'm going to use lowercase because it's not a sheet or production view first floor plan I like to say

**4:39:24** · coordination emphasize that this is a coordination view so I'm in my coordination View and this is the view that I want to apply the coordination view template so now I don't have to change View

**4:39:41** · when I drag this on a sheet there's no chance that my coordination view will end up showing anyway couple tips on uh you know on how we deal with view templates and different officers do different things but this is pretty common just to have a set of coordination or working working views now let's line this thing up we looked at the section we want to get the height correct we

**4:40:05** · can drag this around now I can't go up and down with it because it's actually connected to the ceiling which is called hosted so I'm going to move this around and I just want to get it the right height and I can do some measurements and things but it looks like it's if this is a foot and a half now for a stem length pendant length Let's Go 2 feet and see if that gets Us close some fixtures you can actually specify a bottom height and in fact our custom suspended fixture that we

**4:40:33** · use which I will show a link above how to build that this is free floating it's not connected to the ceiling and we can set the bottom height and we can extend each pendant individually up to the ceiling but in this out of the box this is what we get now I can't change the stem width it's going to be kind of like a you know like a a rigid stem not an aircraft cable and then the width of this I can change as a type parameter and the width of this is a foot let's go back let's go down to

**4:41:06** · 6 in and see if that gets us closer to like I say I don't need a photo realistic fixture but I want it somewhat close just for comparison so that looks decent now let's go back to I can close the power PL go back to our coordination view now we want to get the length the same now the length is another type parameter so I can't just drag the length but let's see what

**4:41:30** · length this fixture is you can go up here with your dimensions and you can see I highlight the end not the middle but I highlight the end and then go down here and highlight this end drag it out and we can see we're 13 9 and some in so 139 so let's go ahead and edit type make this thing

**4:41:54** · 13 foot 9 13 Space 9 is one way to do that apply it okay and it stretches it from the middle so we need to get it down and what I'm going to do is place it right on top now why didn't I drag my

**4:42:09** · light directly on top of that fix to begin with well we'll show you we'll show you get rid of that I'm going to do the same thing over here now I already have my fixture and it's already got the right length I can actually just create another one from here place this fixture create similar and I'm not going to line it up directly I'm just going to put it in over this fixture somewhere like this now let's see what happens okay this is what can happen is it saw this

**4:42:35** · existing light fixture the bottom of the light fixture as a surface it saw that as the ceiling and it placed it on this fixture so that's another reason that I don't Place fixtures right on top of the architectural fixture because you'll get this now how do I get it up here I can try picking a new plane but I can't do it from the section picks a wall I just can't pick the ceiling so I need to do it from here I can do this click

**4:43:10** · it say pick new and then put it away from the fixture and now let's see where that ended up ended up 8 10 so it looks like that corrected it so here it is over here and then now we can drag it in place so just another tip on lights place it nearby and then drag it on so there and that looks

**4:43:36** · right on top so those are the only two lights another thing I'll mention about these lights is we want to give them a type name that we can schedule and lights are typically called things like ABC or they'll have another like L1 L2 or if it's a pen in it'll be a P1 lots of different schemes so whatever scheme you're using we want to call the fixture by that so how do we do that well this fixture I can click on it and right now it's just it has this built-in name we want to change

**4:44:06** · that name to our own so we want to duplicate this and create a new type and call this let's just call it L1 go with the L's L1 and we also want to change its load now let's say we looked at the cut

**4:44:24** · sheet for this thing and we found out that it's 30v per 4 feet and it's just over three sets of four feet so let's say it's a 120 again you want to coordinate that with your fixture cut sheets and things like that and then we also want to put type mark this is what is used in tags so the type Mark we also want to call L1 and that way when we tag it it will be an L1 fixture now we only

**4:44:56** · Chang this one fixture to be an L1 this fixture over here was still the 1x8 out of the box so we want to change it to be an L1 and once we've already created L1 we can just go down here and ch change it to an L1 now that's an L1 let's look at tagging while we're talking about tagging so

**4:45:16** · let's go ahead and try to tag this thing if we go up to the tag by category it's going to tag it with the default tag that's set for a light fixture so we'll see what we get click on that what do we get we get a box with a question mark got a leader on it what is this actually tagging

**4:45:35** · we go up here to the properties it's a lighting fixture circuit tag okay so it's trying to to tag the circuit well we don't have the circuited yet furthermore we don't want to tag the circuit we want to tag the type the L1 well you can see from this drop in there's no other kinds of tags I mean we can do boxed or standard unboxed either way it's still a circuit tag so we need to create or load in a fixture type tag let's go back to our load autois family and see what we have for

**4:46:06** · tags let's go back to all results and this this is an annotative element so annotations and go to electrical and we'll see here there there's switches and these are all annotations let's see if we can find a tag now to help with us here we can just type in a search and go lighting and see if that helps there we go lighting light switch tag lighting fixture circuit tag that's what we have lighting fixture tag it doesn't say what it's tagging but it's different let's try this

**4:46:43** · it'll be in under family in the project browser or we can also just click on a tag and now see what we have for dropdowns it added that new tag to the dropdown let's try a standard and we can just change this by going here there we go that actually tags the fixture type and we can turn this leader off over here and then we can just move this down to Next Door our fixture

**4:47:11** · you want it let's tag this guy so we go back to fixture tag and do that now it's doing a boxed we can change the default behavior of a of a light fixer tag up here there's a couple ways to do that annotate under tags you'll hit the little drop-down tag and this will show you

**4:47:30** · all the loaded tags and symbols and it also means it's going to show you what the default tag is so look at all these categories there's some tags area tags cable trade tags conduit tags let's go down to lighting lighting devices like switches are a switch tag and then lighting fixtures is a

**4:47:49** · lighting fixture tag boxed so we can actually set this up as a default from the box we can set it up to the standard so what that does is it lets us now when we hit tag by category it will use that setup that we want and the leader we can just up here at the top here this bar we

**4:48:08** · can just turn off the leader and now we can just click it it puts it right in the middle of the fixture and we can move it around another way you can do this let me delete that if you already have a tag set up that you like and that's the tag you want because you can have multiple kinds of tags loaded as we know we have a circuit tag and a type tag right click on the tag you want create similar and it will use that tag independent of what you have as default to tag your fixture so

**4:48:40** · some some projects you may want both a circuit tag and a type tag and you can you can just create similar for each of those and and tag your tag your heart out so that's those now the other fixtures that we know of are these track lights now these are the architect's track lights we need to bring our track lights in so let us see what we what we can do about that so down here with our track open that up let's see if we can use this and just left click it hold it

**4:49:10** · drag it in and let go and I'm going to place it on a ceiling in here now let's see I'm getting the do not enter sign means I can't find a ceiling can't find a ceiling now this is another huge issue that

**4:49:26** · you run into working as a lighting designer in an architectural model why can't I see this ceil wait I see it up here okay I can see it there but I see that I crossover there's something in the way I just saw it in here a minute ago there it is so I can see it some places and other places I can't so this one drove me nuts for a long time

**4:49:59** · when I was a beginner and so let me show you what's going on here I can do it down here I can't do it here so something's in the way of our ceiling I looked around at different view settings I looked at is there Furniture in the way what's going on I'll tell you what I learned I'm going to put this right at the edge where it lets me right there so that tip I'll show you what's going on here associated with lights and let me just edit this light to show you associated with a light edit this family is this big cone

**4:50:37** · looking thing coming out of the track light so it says say edit family but it will not let us edit this family again this is a vendor created family and it won't let us edit it but what's going on is this cone is called a light source it is actually a 3D entity so when it's brought into our model it thinks it's part of the light fixture so we go to this model here let's turn on the light source category so go here and it's in our link it's our linked model custom model categories go down to

**4:51:17** · lighting fixtures and under lighting fixtures you see light source it's off by default turn that on see all those yellow lines those are the cones of that light source look how far they extend and

**4:51:34** · what's interesting again let me try to rightclick this to create similar if I cross into that yellow zone that's where I can't see the ceiling so these light sources are blocking the ceiling so I can't

**4:51:50** · place a single light anywhere within this yellow zone so how do you deal with that well I often do what I just did here I'll place it where I can in the ceiling and then drag it in where I want it just by turning those off doesn't eliminate them it just turns off their visibility to really deal with these we need the light source in the in the Family itself you can shrink it down to a smaller

**4:52:20** · size so that it's not blocking most of this of the room well as you can see I couldn't get into that family to edit it I couldn't change its size so we are limited in this s situation to just having to put lights on the ceiling wherever we can in some projects you'll have architectural lights all over there will be no ceiling left to put this in so you'll have to somehow edit that model shrink it down and but anyway just light sources are a huge issue on lighting plans so we can leave

**4:52:55** · that on here this is just our coordination view but that's a huge issue with lights so let's go ahead and we're going to hit space bar and move this guy around we want it to kind of line up with what we've got over here it's not super critical we really just need to get these in here here and it lines up and then we can just take these and copy them and you can kind of pick exact point to copy if you want to get super critical about it and turn thin lines on sometimes helps so if we

**4:53:28** · go to copy copy it from here and I have multiple on so I'll copy it from there that's kind of a insertion point or a midpoint this m midpoint to this midpoint and again we're just getting close it's not exactly lined up with the heads but again we're just doing this for circuiting reasons really put one there and there we just go on get these

**4:54:04** · close so there we have four lights and again we're not doing a rendering with this but it does resemble if we draw a section it will be it will resemble the

**4:54:21** · architectural situation so we have our lights and their lights and when we turn theirs off all you'll see is ours and they're representative of what's going on here and we want to tag these as well now what I should have done is before I copied this around I should have created my L2 type duplicate this I'm going to call this one L2 and again I need to put in my load track is typically loaded by its length it's calculated

**4:54:55** · differently than just the Watts so I'm just going to say this is about 400 about 100 watts per foot and because it's set up someone could throw incandescent lights on there so we'll put that to 400 per 4T section this voltage appears we don't know which voltage is which let's try this

**4:55:14** · one and let's hope that that's the right one for our connection if not we can change them up here but because it's under loads I'm thinking that's what's going on and then again the type Mark we want to call L1 L2 excuse me call this L2 okay and we actually want all of these to be now what you

**4:55:36** · can do is you can right click on this and say select all instances visible in this view now they don't mean in this window but in this entire lighting plan view select them all and now we have all the other seven light fixtures that are just named this and now we can take all these and turn them into l2s so that right click select select all instances visible and view or you can do the

**4:56:05** · entire project if if you want to do it that way and that will C catch it throughout the entire model very a very powerful selection tool so now we can lab now we can tag these with our tag and remember our last tag is the type so we can put that and just put an L2 by each one of these fixtures and make sure that we're tagging our fixture not the architectural now if we were

**4:56:32** · to try to tag the architectural fixture what do we get we get a question mark because it doesn't have a type so this makes sure we have RS L2 and so on okay so we're getting these

**4:56:51** · we're about done installing the architectural fixtures that we know about but we have areas in this building that need more lights so again let's say that we were talking with our interior designers and our architect and maybe a lighting designer and we found out that they want to add some other lights in these areas they want add a surface circular decorative light fixture they want just a surface circular LED fixture uh utility type in the mechanical room so we can start adding those in so let's see what we did we brought in a recessed can but we're going to

**4:57:26** · say they want all surface mount fixtures here so a flat round ceiling mount because you can get nowadays you can get a nice shallow down can that's surface mounted maybe it's only 3/4 of an inch tall let's say that's what we're going to use so we'll just pick a 120 volt model these look like incandescent wattages which doesn't matter we can change them but let's bring that in and there's a nice circular fixture and we'll put that in the mechanical room save the project every chance you can and let's look at this section again that we had

**4:58:00** · here and look in the mechanical room see how that looks it looks like it did place it on the ceiling and it's uh taller fixture than we want and can we change its height see we cannot on this fixture they did not associate the dimensions to the type so we can't change it again custom fixtures we put

**4:58:24** · the dimensions in here so that we can tweak them and change them but this is what we're stuck with for now which works we'll duplicate this and give it a type name we're going to call this L3 and don't forget to put that in the type Mark so it can be tagged and then parent load

**4:58:42** · we're going to say this is an LED down around 15 watts 120 volt works so that's that fixture now we start losing track of L2 L3 L whatever we are if you open these all up you can find these over here L3 L1 L2 that helps but also we can create a schedule in Revit that will list all of our

**4:59:04** · fixtures for us so we might as well learn right now how to create a schedule so let's go ahead and create a lighting schedule how do we do that under the analyze tab we can get to all the schedules and we've got panel schedules here now here's regular schedules the schedule create that and there's all different categories and we want to do a lighting schedule so let's go down to lighting fixtures and we're going to say okay and now what we do is we're into schedule properties box now on

**4:59:37** · the left are the available fields what that means is these are the available parameters within our lighting fixtures that we can drag into a schedule so you can schedule quite a few parameters here I mean you got height and uh Keynotes what lamp even got things like Lum and depreciation and number of

**4:59:59** · poles number of lamps all these things so let's start off our lighting schedule we can always add to it but for now let's at least get the the type the type mark and what we do is do this little arrow to add the parameter to our schedule so typ Mark and then what else we want to do let's

**5:00:18** · get lumens in there now luminous flux is the lumens the output of it and then let's also get the wattage in there which this is wattage here but we typically want the actual VA the volt amps so that's the apparent load so we'll do that and there's other things that we might want to incl include later like I like to include the housing type the Optics driver all that now we don't have

**5:00:45** · all that in here so we may have to repurpose some of these parameters unless we start customizing our lights and adding shared parameters which is a whole another video so for now let's just do this and this will let us at least see our fixtures so here we go and you can hold control down and zoom in on this to make it larger if you want I'll do that so we can see it but we have our type Mark luminous flux and our apparent load now you can change these headings and you can just say type

**5:01:17** · and this can here you can change that heading just to say lumens and this one here we'll just call load so you can change the headings we also notice that we see every single instance of our fixture

**5:01:33** · we don't need that in a lighting schedule because we just need these fixtures once so how can we fix that well over on the right you can get to the fields which we just added you can get to a filter to turn things on and off you can sort and group you can change the formatting the text and such and other things like appearance thin lines things like that but let's right now let's just go into

**5:01:56** · the sorting and grouping because under sorting and grouping down at the bottom it says itemize every instance you know that's what we have now we're seeing every instance if we uncheck that then we only see each type once not every instance and then we want to sort them by type Mark there

**5:02:19** · we go so now we have each type L1 L2 L3 and the lumens and the load and these can all be changed here as well as in the family types itself so I can change this lumens and say that this guy is

**5:02:36** · 12,000 lumens for example and again we base this on on the cut sheet we'll say that lumens on our track is now this is for the whole 4 feet and it depends on how many track H so it's really not applicable to this track we can have other notes that describe what the actual track heads are but this represents the entire 4 foot of track and then L3 we're going to say this one's 1500 lumens

**5:03:01** · but all that can be changed here as well as in the model and that's what's nice about this is that any place you change it reflects it everywhere so anyway that's that's how lighting fixture works so that lets us know that we have L1 through L3 already so as we label these now the other thing I'll note is I'm being very careful here to tag all these lights but I'm in my coordination view now this is something that you can realize too that if I tag it in the coordination view the tags are a 2d element a detailing element that do not show up in the other views so now in reality

**5:03:34** · when I go back to my first floor lighting plan there's no tags so my mistake there can show one of the pitfalls you can fall into is it forgetting which view you're in so what all I need to do is I need to retag these here so I will do that really quick and there we go so we just need to remember which view we're in now I can go

**5:04:00** · back to coordination view if I need to see the architectural lighting well I don't need to see the architectural lighting anymore because I'm just putting my own lights in so I'm going to go back to to my floor plan View and to do the rest and we've already got the light here and we can move this now if you if you're selecting the model by accident you can actually go here and turn off unselect check links select links select underlay

**5:04:24** · select pinned you can also get to those tools down here at the bottom where you can select links you can turn that on and off here and so you can get to those down here as well and we can turn back our thick turn off our thin lines

**5:04:40** · so let's go ahead and tag this guy L3 we set him up now we'll say the hallway is a similar fixture it's a surface mount round but it's going to be more decorative so and to select this you have to make sure you get right on top of it create similar and it's placing on a face if we go vertical face it's going to

**5:05:03** · try to put it on a wall which we don't want so make sure you have face selected and we can see our ceilings here which is nice so the designer told us that they're going to put one here well before we move on I want to change this type this is a more decorative type it may not look any different in our model but in reality it's a different specification of a fixture so let us create its own type duplicate this this is going to be L4 same wattage same VA L4 so now we have L4 is a different fixture from L3 and we can create

**5:05:42** · similar and put these where the designers told us to put them there they want one down here and then little blue dashes will help you line things up and then they want one out here in the middle and you can Dimension these to set them up if you want to get exact if you don't have

**5:06:04** · something to draw over and then we can tag these and now that we have our tag set up it's really quick now the bathroom the designer said they want to use a vanity fixture over the sync now I can't see the syn let's take a look at our section and see what's going on with that toilet in a SN now if I tab over this now I have to make sure actually that I have select

**5:06:33** · links on now if I tab over this I can select that sync and sometimes you can get a drop down sometimes you can't but it is a plumbing fixture so it's on the plumbing fixture category so if I go back to my floor plan I should be able to turn on Plumbing fixtures and see that guy so let's go into our view template our model overrides and let's turn on Plumbing fixtures in our model they are and let's make sure we turn them on in our link as

**5:07:04** · well because that's where that guy lives so Plumbing fixtures there let's see if if that helps it did not now this may be another cut plane issue let's check our view range now we can't get to view range here because it's actually in our template so we have to get to view range within the template because include the view range is included because of this check mark edit the view range and we're at 4 feet let's see where that bathroom fixture is from

**5:07:35** · here 29 so it is below our cut plane but we would have to lower our cut plane to see this clear down to 29 and so let's see what happens if we do that go down to 2 feet see what happens okay now we're seeing furniture and everything which you

**5:08:02** · know we may want to have on to show relative locations so I'm going to leave furniture on and that bathroom shows up now we don't see the toilet and one thing we can do is we can we get a lot of tabs open every time you change something it's trying to change things in all these views and it can affect performance but it also gets messy so you can go up here to this button up here close inactive views and just close all the views now this view one was this family that we were looking at we're just going to close that without saving now we can

**5:08:34** · go back to this section and it's section five and see why why can't we see this toilet hover over it with tab click on it okay so it is a generic model it's not even a plumbing fixture

**5:08:49** · and it's low so it's not going to be hitting the cut plane so we won't worry about that so much in this view as long as I see the sink I can place my light above it so now we need a vanity light we need a wall mount let's go back to our Autodesk families in the cloud we're in lighting we were in lighting tags let's go back to lighting electrical lighting MEP interior now we want some kind of a wall mount here's a scon flat round scon sphere scon

**5:09:25** · uplight so scon typically means wall mounted and then there's a wall bracket well let's see what we have we're going to load some of these sconces and load this wall bracket and see what we have to play with again we're not trying to make a an accurate rendering of this but we want to get something that's approximately the right size and shape so we can do some interference checking so down under our lights we have a scon flat round scon sphere and a scon uplight we may

**5:10:02** · end up just putting this wall bracket in we'll see what that looks like you can see trying to place it on the ceiling we want to place it on the wall so it's kind of that symbol let's use that and place it on the wall now sometimes the sinks in the way so place it on the wall nearby and then we want to give it a height comes in at 4 feet that's a little low let's get it up at 6 feet and then we'll move it over above the sink and let's see what that looks like okay yeah it

**5:10:38** · looks like an exterior kind a decorative light so you know you can play around with these and change it to a scon once it's in here we can change it to that a round light or an actual sphere with a dome I you know if you want to just kind of a horizontal bar we may have to make that again that's a custom symbol or bring it in from a vendor but right now we're just going to keep it as this it's just uplight we're going to keep it as this round for now this \[Music\]

**5:11:17** · Dome and I can get to it from the edge here let us give it a type now remember what's our type next type let's open our fixture lighting fixture schedule again so it's here under schedules and here's our lighting this is an old one we can get rid of that and here's our lighting fixture schedule we already have four so we're going to call this fixture 5 L5 edit that duplicate it L5 and we're going to say that it's also a 15 wat

**5:11:54** · LED and L5 again later on we're going to go back and add some more details about lumens or lamp types things like that housing but for now we're just getting the basic skeleton in here for kind of a schematic design level we can tag this and make sure we're tagging

**5:12:17** · the fixture right now once to tag a sink it's trying to tag the wall there's the fixture L5 now for our lighting plan we may want to turn that plumbing back off just so we can see actually see the lights so Plumbing may be only showing up we may only want the

**5:12:37** · plumbing showing up in our coordination View you so again those are some decisions you'll have to make for visibility issues we'll turn it up back off it's good practice to learn how to turn things on and off though okay here's our panel let's go ahead and label that and in the laundry room the designer said they want some of

**5:13:05** · these utility lights just in here on the ceiling so we can copy or create similar this L3 Now by creating similar it is actually trying to place it on a face once I have one in I then I could actually do a copy because it's all the

**5:13:25** · same ceiling long as you're in the same ceiling it will copy properly and if you click on it it is actually hosted to the ceiling at the proper height it will host it but if you're copying from one ceiling to another one to another I would actually place it and let it find the ceiling and so let's just make sure that these are all done properly check section five looks good the other thing I like to do and sometimes like we

**5:13:53** · did well like we did in the Aral model is do some 3D views of this what I'm going to do is I'm going to put a camera drop a camera in here camera at this doorway right inside the door drag it to this corner here Beyond the Edge and click camera now it comes up with this default view I actually want this to be a coordination view so go to coordination that will get rid of the X-ray walls and then I also want a consistent colors so let's go with f8 will let us look

**5:14:30** · around and what we're seeing now is the get there hover over that that's our receptacle and this guy is our exhaust fan we put in and it ended up putting it on the wall so we can mess around with that later but f8 we can look around here's our laundry equipment look up and there's

**5:14:51** · our lights on the ceiling and you can say they're just gray there's no material associated with them again we're not creating a photorealistic rendering we're just trying to get these systems diagrammatically shown and somewhat shown in 3D for coordination purposes so we can go ahead and tag these we are in our lighting floor plan view save it tag it and we can turn bin lines off also this living area here is pretty dark on these ends and the designers told us that they

**5:15:32** · want to put some of these decorative fixtures get out of the tag in here as well so let's go create similar because we are a different ceiling and they want them in line with these so we're going to put it there and in line with that guy in line with that and then also they want some down here on either side of this fireplace so we're going put those here and here get these tagged as

**5:16:02** · well four hover over it L4 same up here L4 and L4 and then finally our lighting designers have decided that we want some lights out on these walls so if we go back to this 3D view this is this end we're going to look at this other end so let's go to here and so we're out

**5:16:39** · side on this outside balcony here we've got these walls they want to put some lights up on these walls at about 6 feet so we'll go back to our plan view to represent those we're going to use that decorative wall bracket we found so drag this guy in and it's trying to put a ceiling let's go to a vertical face and they want them right here and let's say they want those up at 6 ft and they want it right in the middle of this wall

**5:17:10** · now sometimes you can't find the wall it's because there's sometimes different wall elements are stacked on top of each other so if you get hovered over right there and hit your tab remember tab Cycles through stacked elements so as I'm hitting tab it's finding different surfaces so right there is the one I want and then I come over here and get that somewhat in line with this guy

**5:17:39** · and again I didn't label these we're going to label these what's our next one lighting fixture schedule L6 would be our next tag our next type duplicate L6 and these are also 15 VA LEDs

**5:17:58** · L6 apply it and then this guy needs to be an L6 as well so I can just go down and choose him change him to an L6 like that and get these tagged and then out on this other balcony let's take a look at that and see what the

**5:18:21** · designer had in mind for us to put now you can see that we have these nice fixtures installed on the wall it looks somewhat representative in 3D of what we want let's go to this other Corner look at this end of the building now upstairs we have this balcony with walls but

**5:18:42** · what happens down here on this level let's do a left View and just look at the elevation of underneath we can also look at the section of this and make sure we're seeing to the wall click and there's no walls we just have flat seiling ceing so the designer

**5:19:11** · said that they want to put some ceiling lights out here that are exterior rated so it's going to be similar to these l4s but it's going to be an exterior so create similar we want not vertical face we want horizontal face and they said they're going to put them right here and this one's going to be called an L7 another different type it has a different spec 15 VA and L7 apply it okay and then we can

**5:19:49** · just create another one down here vertical face right there and tag these and that is all we need for this exterior for the exterior lighting on the first floor when

**5:20:09** · we get to second floor we've got this walkway and an outside Terrace type place and we have parking area and things like that that we'll want to be lit so when we get to second floor we'll have a lot more lighting to do but this should wrap it up for our level one lighting plan in the

**5:20:27** · future of course we need to Circuit these up but that'll be in a future episode so hopefully you've learned something in this one we covered a lot in this episode we are going to do the rest of the lighting up on the second floor we're going to take a look at the architectural model to see what the ceilings look like we're going to cut sections we're going to cut 3D views so we can figure out what is the architecture of this second floor and then we're going to look at placing light fixtures onto these vated ceilings and deal with hosted versus unhost lights we're going to look at

### Episode 07 - Pendant Light Modeling

**5:20:57** · even a custom light fixture that we end up using to make this thing work then we're going to show how to add light switches or lighting controls to our plan to indicate how things are switched so stick around for a packed episode we're starting off this episode with more lighting we're going to start looking at the architectural model and look at the second level of this out of the-box Autodesk Revit example project which I showed back in episode one how to download we have this two-story building as we've been looking at and we have a parking area a walkway to the second

**5:21:29** · level and we can see that it has a very steep roof and down here at some of the renderings we can see on the second level it's very vaated and this is outside and even at the other end of this you can see it's vaulted here for this covered balcony and looks like it's vaulted inside the building itself

**5:21:50** · what we can do is jump into this architectural model again we're in the architectural model itself not our electrical model and these 3D views they've already created are really just first floor and some exterior so we're going to need to create some of our own and let's go into level two floor plan they have not created any lighting or ceiling plans for us to look at

**5:22:10** · there's no lights placed on the second level in this model either so as we discussed previously for lighting design we typically get a lighting design from the architect or an interior designer or a separate lighting designer in this case we're going to assume that we have behind the scenes

**5:22:27** · received some lighting design from a designer so we're going to insert lights and connect those up and we'd like them to be inserted into this model in a 3D fashion even though we're really only going to present two-dimensional blueprints or drawings if you will for the installers but it's

**5:22:44** · a good habit to get used to doing things in three dimensions when you can to use one of the powers of Revit to help coordinate with other trades and to help visualize what's going on in this in this building so what we can do is we can create some sections to take a look at this that's kind of the old-fashioned way and then we can also in Revit create 3D views and one way we can do that is up

**5:23:08** · top there's a default 3D view but if you click the drop down you can get to a camera and this little camera will create a 3D perspective view of whatever you place it so let's start here right in this master bedroom we're going to pick a place and here's where the doors come go in and out on the deck let us put a camera and click right there and let go and then just move your cursor to a let's say a corner and go a little bit beyond and as you can see it drops a kind of a wireframe by by default now we can fix this up by going over and changing the discipline to

**5:23:43** · coordination which will automatically get rid of the X-ray View and then down at the bottom we can change this to a consistent colors first try shaded and then it'll give you you know a little more realistic View and you can also go to consistent colors so a couple different views if you go to clear down to realistic it'll apply some nice materials textures but it it takes

**5:24:07** · up some process processing time so I'm fine with consistent colors we're just looking for to get an idea of what's going on in here the other thing you can do is hit hit this f8 your f8 key by default sets up this little view heads up display and we can hit look and hold it down and now we can move our Mouse around and look up and here we can start seeing this framework of the

**5:24:31** · doors in the windows and we can also see that we have the peak of the Vault and even looking down this little short little entry into this room we have that we also have a peak of a vault so everything is vaulted in this room at least we can hit the walk button and slowly slowly is the key here barely move the mouse forward to get a little bit of a walk going on you can stop

**5:24:58** · hit the look again move around and start looking in this bathroom now it looks pretty dark in here and I think what's going on is I think we have approached a door and you can see if if I move it too fast oh yeah there we go there's the door so go inside here hit our look again look up and it again it's vaulted up there can look around we could just reset the camera as well but I kind of

**5:25:26** · like walking through my project and we're seeing some 3D things here we've got shower we've got the toilet and we can continue walking slowly it's a little hard to steer this thing there's the tub so this architect has actually modeled in 3D some of these U objects and again we're mainly

**5:25:51** · looking at ceilings right now and we can also see there's no lights in here so I think we can conclude that ceilings are vaulted throughout this entire level if we go back to level two let's do the old section just as another method so up top you'll see this button called section

**5:26:08** · up here in your quick access toolbar you can also get it through all these things up at the ribbon through the view Tab and here's a 3D view drop down sections and things like that even elevations now you can try elevations interior I find them a little tricky and I like using the section personally but let's go into this bedroom and see if we have the same issue so

**5:26:30** · we're going to drop a section symbol and you'll see this little dashed line that comes out here this is showing the extents of the SE section and you can see there's a little Double Arrow to move it it goes way over here so this section is looking Way Beyond the section marker now for an elevation view from a section cut I like to pull this back to just to just get to the wall

**5:26:55** · and we can pull this in and kind of narrow down our section if you double click you got to be clear out of it Escape out and then double click the head and now we've drawn a section in that room and here's our lower floor we've already done section again you there's no ceilings that we can see this is just a dash line for the roof line level indicator we have vaed ceilings there too we can get rid of the title sheet and we can now move this section along and it's still showing

**5:27:29** · vaed and we have some skylights that we are going to need to dodge as we place lights in here let's hope our designers kept that in mind and back to level two and continue with the section here that I'm using again kind of as an elevation and that's all good there and then let's look at this entry hall and we have our stair railings going down this is all Ved so yeah we are entirely vaed

**5:28:02** · second floor another thing we can do is create a little 3D view just of an isolated area so if you can get to a point where you can just window over an area let's say we'll take these bathrooms and the bedrooms and then up here under view there's this little box called selection box that isolates selected elements in the current View and it draws a little box of that area now

**5:28:29** · there's a thing called a section box where you can drag the Ed edges of this around sometimes you cut a view like this and you can't see that C box there's no box here so you want to make sure your visibility settings are set first Escape out of here and we do not have a view template so we are just going to go to visibility Graphics overrides it's an annotative element so go down to S and make sure that section boxes are turned on and indeed they are so we're good there that's

**5:29:02** · the first check so it must be hidden in some other way well go down to the bottom here and there's a little light bulb it says reveal hidden elements now you can use this anytime you've let's say hidden something by right clicking it and saying hide in view elements categories things like that well to undo that you can go down to the light bulb reveal hidden elements and it turns everything red that has been hidden and so levels have been hidden this right here hidden

**5:29:34** · element is a section box now why that's hidden who knows but if you rightclick on it you can say not hiding view but unhide these elements in the view and then you can go down and turn off this little light bulb now we have our section box unhidden a little trick there for some visibility issues you may run into we can click on the section box and there's little drag arrows to drag the cut plane of that section so as you can see it really helps us see into this model what's going on

**5:30:09** · in a 3D section so you can drag this through your building you can pull the top down and start to see things up here below the peak you can see that these walls go all the way up so this is a very handy tool not only for analyzing a model but even for presenting a 3D view in your model so just

**5:30:29** · want to show that to you as another tool in Your Arsenal of figuring out what's going on in these 3D models so now that we know that we have vaulted ceiling C outout we're going to have to apply our light fixtures that the lighting designer has told us they're going to use in here but we have to get those into our model so we're going to get out of the architectural model now so close that and we don't need to save it and we are going to open up our own electrical model that we've been working on so we will go into our electrical model this is my residential tutorial open that again overwrite

**5:31:05** · existing we are in a workshared model and it just takes a minute to open opens us at this 3D view now normally in our project template we have a starting view which is a easier View for the computer to process but we will show that when we get to the video on creating a project

**5:31:23** · template which is a very important part as you further ready your office or your practice for using Revit but for right now we're going to go back to our second floor lighting plan so we under here lighting second floor we can close some of these that we're not using to help our scrolling second floor lighting here we are with just a blank old lighting plan let us go ahead and put in some room tags like we did before remember up here annotate go to room tag

**5:31:55** · and we've already set this model up to accept rooms accept room tags we've done that on the first floor so now it's simply placing these tags within the model now you can also go to annotate go over here to tag all all objects and you want to hit room tags so try that and it didn't work

**5:32:18** · well let's see what's going on here try it again annotate tag all include elements from linked files well the elements that we are talking about are our rooms which are actually part of the linked architectural file we're going to include elements from this linked file and then go down and say room tags and apply that and say okay and there they are and like we did on our power plant it just places them kind of in the center of each room and we can move things around as we like and we'll probably further move them as we start placing lights so now

**5:32:52** · we get into the placing lights in your model the first thing we need to do is what kind of lights are we going to put in here there were none in the architectural model for us to copy and try to reuse so now we're going to need to find some lights to put in now if you don't already have a set of custom fixtures that you would use like we do in our firm you will have to find some light

**5:33:15** · fixtur somewhere well we can try the what I would call the outof thebox Revit fixtures that are in the cloud so if we go to insert like we've done with other things load Autodesk family right here in the little Cloud they have all the families that were previously loaded with earlier versions of Revit now they're in the cloud so you'll see all results and we want to go down to lighting

**5:33:38** · and we did this on first floor we don't want to use the architectural versions again because they don't have typically electrical connectors which we need so go to the MEP category and here's a bunch of different lights now because we have slope ceilings vaed ceilings we decided we're not going to use surface mounted lights we're not going to use recess lights we want to hang some pendants down from that Ved ceiling and sometimes they can have you know a fan attached to them or just be a light we're going to hang some pennant lights so we need to to find some pendant or suspended light fixtures now these are all surface down lights things like that floor

**5:34:14** · lamps now we get to a pendant light and again you can't see very well in these thumbnails but a pendant light disc let's click all of the pendant lights select them so we can see how they work and see which ones we like so we've got five different pendant lights we can try and there's other ones that are recessed if you go through the whole list you'll find sconces and even Street lights things like that but we want to go with the pendants so load those now what we're concerned

**5:34:44** · with is how do these attach to the architectural file we do not have a flat level ceiling like we did on first floor so how is that going to work it will depend on whether these fighting families are hosted to a face or whether they're what I would call free floating non-hosted so let's see what we get a pendant disc will start there and these are set up for incandescent but we can change those drag 100 watt 20 volt in into our model and we get the little cross here which shows we're rep

**5:35:13** · putting it up here we can place on the vertical face and you can see if I put on the vertical wall it's showing a dis pendant but mounted horizontally which we don't want we want vertical so let's place on face is our other option and it will find any kind of face now as I'm down here I'm seeing you know kind of a what a slanted view of it and what's happening is is placing it on the

**5:35:41** · face of this Vault I'm going to move this section into this room and make sure we can see clear past the wall with this section view drag now let's look at this section view so this is what we've done we've installed this pendant light and it hosts it to this slanted ceiling and puts it

**5:36:02** · perpendicular well that's not what we're looking for we would like this guy to hang straight down and before we try another one let's look at our visibility issue we were having as we drag this guy we lose it right there why can't we see it well again first thing to check like we've done

**5:36:21** · in the other episodes is let's check our view range perhaps we are not looking high enough because the ceiling get higher there it is it it's there it's just that we can't see it so we need to take a look at our view range and see what levels we're at and again remember this architectural model comes in in metric and we have it set up for Imperial so we can use either of these but let's see what our view range is set up at Escape out of here so we need to go to our floor plan and look at the view range of this floor plan if you recall we have

**5:36:57** · a view template assigned to this lighting plan let's look at the view range inside it because we can't get to view range here it's gray out because it's part of it's included in this view template so we will go here down to view range within the view template and it is included as you

**5:37:15** · can see this checkbox means that it is included within the template hit edit and here's what we have we set this up on the first floor to make things look right we have the bottom which is just automatically Associated level with the same offset is our cut plane so we are cutting our geometry 2 ft above the floor which lets us see some furniture SS things like that but the top is our Associated level which in this case is level two and 9 10 in above that so 9 10 in

**5:37:48** · above is and we'll draw a line right here and it won't extend because I have it cropped but we can look at the dimensions go up here the dimensions from this level up to there that's 6 foot our cut plane is up around 9' 6 9 10 so actually our cut plane is at this roof line so if a light fixture doesn't extend below

**5:38:29** · this top end of our view range we won't see it so again we don't see it until we drag a piece of it just touching or extending me let's see if we see it now below this line there we go so that's how

**5:38:44** · visibility is determined with this view range and I have a a video All About view range and that I'll point to up above if you want to check it out in more detail but what we need to do is fix our view range so we can see clear up to the peak and Beyond so let's go back here and fix that view range now if we fix the view range here in this template it will change that same view range

**5:39:07** · in our first floor so this is an instance and it happens quite often where different floors different levels different floors have different needs for view range so you'll find yourself possibly creating separate templates for different floors and a lot of times on a like you know on a commercial building the first floor may be extra tall and the rest of the floors 2 through five for example would be the same so you can have one template for first level first floor and a separate template for 2 through 5

**5:39:37** · the other thing you can do when you only have two floors and you don't need a bunch of templates is you can just disconnect the view range from the template so go back to the template and again this include and that's how I do that's how I will do it for this project as an example there's multiple ways to do things in this case because I only have two levels I'm just going to unincluded disconnect the view range from The View template I do that now I can get to my view range

**5:40:07** · independently of the view template from here so that way I'm not messing with the view range that's on my first level it is disconnected also but it stays the way it was before I disconnected it but now we just have to realize that view range now is separate we can get to it from here now the top can be changed should I change that to a higher offset I can and so what kind of offset am I looking for my little line here let's get up past this peak and we're at 19 ft 6 so I could

**5:40:38** · set the top for like 20 ft the other thing I can do if I don't mind seeing what's on the roof and above is I can set it to unlimited so let's see what happens there view range and let's just go to unlimited now the view depth is set below the top clip plane this is the thing you have to keep track of when you at the top of a ceiling plan as we I know this is a ceiling plan at the top above

**5:41:07** · the top is this view depth so it has to also be set at least as high as the top so you'll have to go down and also set it to unlimited so it doesn't really affect how we see it we can see the skylights you know now we it really doesn't have an issue with what we can see there's no lights on the roof that are causing us a problem so we should be good there now as we move this light in

**5:41:33** · the room we can see we see it all the way across because now now our top of our view range is way up here so we're good there now got that fixed now we still have the issue of the uh the light fixture diagonal let's try some other lights and this is a good example of what comes out of the box from rabbit and it makes you realize that whoever put these together must have thought all we have is flat level ceilings here's a 100 watt hemisphere I'm I'm sensing the same issue yep

**5:42:07** · let's try this linear and it can go that way this way or that way we'll try both there we go we've got our diagonal mounted light I'm sensing a pattern here here's another linear well it's two lamp Mak going be the same type it might be a different cross-section there we go yeah it's a different look same thing diagonal

**5:42:37** · and we have this good old pendant light fixture what does it do so this is the one we used this is the one we used downstairs and it's also the same deal hit the space bar to rotate it let's say we want it to go span what happens there well it picks which one it wants and it's stuck to there it went by Center Line so it's stuck to that one so as it turns out we can't

**5:43:06** · use use these these are all hosted light fixtures and in reality we need a non-hosted light that we can just place in our space that doesn't attach to a ceiling now there's other Solutions some people will say well you can just drop a work plane in here you could do that and what it does is it puts just a fake ceiling in here that you can attach things to and we can try that as an example so we can place a work plane go to architecture go over here to reference plane

**5:43:40** · now this creates a reference plane vertically so we would have to go to our section and create a reference plane and let's put a reference plane wherever we want it like right here now the only thing I would say is that note is that this reference plane goes now throughout the entire building it goes it doesn't stop at these lines it's infinite so now we have a

**5:44:03** · work plane throughout everywhere so if I need a different ceiling a mounting height than here that I do in here and here and here I'm going to have multiple work planes they're all going to be stacked on top of each other how do I get the right one this is not an ideal solution so what we

**5:44:18** · need to do is we need to find a light fixture that is not hosted that's pendant I can't find one in I can't find one in Revit out of the box so now we are stuck with needing to create some custom content I'll link a video right now of how you can do this yourself so you can either do it yourself

**5:44:38** · or you can find a package of some that are made and buy those but for electrical we really just need a fixture that has a pendant that we can stretch up to the ceiling and that works for our situation it gives a good representation in 3D of that fixture without being too detailed and it has all the electrical connectors we need so let's get rid of all of these crazy lights and we're going to just go ahead and bring in one of my custom lights and we'll show you how that works and again

**5:45:07** · I have a video to show you how to create something like this so you can do it for yourself and it's it's a good exercise someone in your firm or in your circle is going to need to learn to do some of this family editing anyway so might as well jump into it I'm going to go ahead and insert load of family and down here I have a pendant circular and it's just a barebone

**5:45:33** · circular style light fixture that's pendant and it loaded it I need go find it pendant circular and I put ER in for electric Rob in front for to indicate that it's a custom light fixture so we will drag this in now it comes in at zero now this is not hosted you can so you can see that it's not

**5:45:55** · saying it's hosted to level two but that's all it's not hosted to a surface so we need to say how high do we want to mount this let's start at like 8 ft hit 8 enter it's placing this light at 8 ft and let's just say the designer wants to place it right in the middle of the room let's go to our section and we see nothing okay another visibility issue let's deal with this why don't we see anything in this view we saw those other lights well those other lights if you get into the

**5:46:29** · internals of the family you can set which level of coarseness or which type of views it is visible in right now we see this light fixture but what we see is a symbol we don't see the 3D geometry of

**5:46:48** · this light fixture and similar to the receptacle when you place a receptacle and you see a symbol for the receptacle you don't see the actual box and the cover plate the 3D elements the extrusions of it same with my custom light fixtures I want to see a symbol and in fact my symbol has another

**5:47:09** · circle in it that over here you hit emergency and you can click emergency it darkens in that Circle and we use this mainly in commercial work where this may have an emergency battery in it or it may be connected to a generator things like that not so critical in in residential but it just shows that this is a symbol and you can't see symbols in sections that's the first instance but I'm also not seeing any Extrusion well if you look over here at this section right now the detail level of the section can be anywhere from coarse medium to fine this will let you control the level

**5:47:46** · of detail of the objects now this receptacle that came from Revit out of the box shows the Extrusion geometry even at a coar level in my custom fixtures I don't always want to see a fixture at course I only want to see it at fine so if I go to fine now I can see my fixture now you may

**5:48:13** · want to change that where you see it at medium and fine but our decision is I only want to see 3D geometry when I turn this to be a fine level of detail and this also brings up a good issue on this section that instead of having to make all these settings every time I cut a section you can also create a view template of a section or an elevation view if you want to call this elevation so this is a good time to Let's create our elevation view the way we want it every time we cut one so we can go to now this section view which we're in and we can't see it here we need to

**5:48:51** · expand something it happens to be right here this darkened one and you can also name this section but if I right click on this section I can just either apply a template to it or I can say create a view template from this view the way I have it set up now scale SC you know everything create a view template from here and I'm just going to call this and for a custom view I'm going to put the ER in front of it we're going to say I'm going to say elevation elevation electrical just

**5:49:23** · to remind me that this is my electrical elevation there it is okay and I can set this view to that elevation I do it in all caps so it stands out so now I can do that with any section I cut so now we have our light fixture and we put it at 8 ft and this is a pretty high Vault so let's let's go ahead and say that the designers want us to put this up at 9 ft so we're going to go up at N9 and it should pop up there it goes and and this is set up for 9 ft to the bottom not 9 ft to the

**5:49:59** · top like the other pendant down here but what this pendant has is if I click on it this stem has a little up and down arrow and let me turn the thin lines on you can see it better click on it there's a little up and down arrow what I can do is I can gra drag this pendant up to the ceiling so now in a 3D or section it it looks like it should it doesn't have a canopy and all the

**5:50:27** · details it doesn't have screws or anything like that but it is a good representation of this light now it's just a circular but flat top and bottom this is a very basic shape but I can change the height of it so the stem length then because I can drag it is an instance parameter so if you go over

**5:50:46** · here stem length see how that's an that's I can change it here as an instance so each light that I put in I can change the stem link but it also has Type parameters which I can only change as I edit the type itself and so this is where I want to duplicate like I did on the first level I want to give this a a name so we had already started our fixture schedule down below and let's review

**5:51:13** · that go down to schedules and we have lighting fixture it's lighting fixture schedule to because I already had one but here again we can we can expand this out hold control down and scroll you can expand this out to see it it's easier to see in the video but we left off with L7 as our light fixture and we can just keep numbering these if you want to get creative you can call it P1 for pendant things like that whatever you want to do get the thin lines off we're going to call this

**5:51:43** · L8 and we're going to give it the wattage or VA that's on the cut sheet and we'll find out this guy was only a 15v fixture we can change the depth let's make this a nice thin so let's

**5:52:02** · give it like a 2in height the diameter is 1T foot and we're going to make this a larger fixture that's a 2T diameter the light source symbol isn't as important for us as it was in the architectural model but I like to make it a little smaller we don't see it but it just won't clash with other stuff and the stem diameter you can get this as tight as you want

**5:52:24** · right now 1 in works if you were doing like an aircraft cable hanger you could take it down to maybe a smallest Dimension might be 1/32 of an inch we'll see how that works and then tip Mark again is L8 so we can tag it okay and let's look at the section and let me move a little bit

**5:52:45** · away from this Edge this wall Corner because we made the fixture thinner the bottom is still at the same height but it brought our stem down because the stem is attached to the top of the fixture so we will pull this up to the ceiling so now we can take a look at what this looks like

**5:53:06** · in 3D as well so let's go back to our lighting plan and like we learned in the architectural plan and be care careful where we pick if you pick here you're going to grab stuff so you might want to turn off how you select things but if we pick here and drag across this room and do our little box create a 3D View and we need to zoom in we have our section that we can start playing with

**5:53:39** · and we have our ceiling in the way but what we can do is we can turn our view to that side or even spin it or if you hold down the shift and use your middle Mouse you can orbit so there's a

**5:53:57** · bunch of different ways you can navigate you can orbit but that shows our fixture let's go down a little bit that shows our light hanging there it's kind of a dis light it's got the pendant and in 3D it gives us a good representation hold shift of what it will look like in this space pull that ceiling up there we go so that will help you visualize what's going on in this

**5:54:28** · space so we can continue on now placing lights and we can also tag this one we already created a tag that tags the fixture type we can turn the leader off as we put it in right here that's an L8 and then we can just continue on we can copy this because it this one especially it's

**5:54:48** · not hosted that's the joy of unhost objects you can copy them around they're not attached to anything there's quite an argument by many people that says we should use unhost families all the time I still think there's a purpose for them here and there like on receptacles it will help cut a hole in the wall if you want to see it visually so you have to make those decisions but especially on certain lights I really find that the UN hosted lights makes

**5:55:14** · your life so much better because you'll end up with models early in the design process that don't even have ceilings yet at all and so you know there's nowhere to place a light fixture so unhost lights you'll find are very helpful so that's what we're using in this second story now the designers also want one as you come in here so we're going to copy one over here and they've decided that this 2T diameter one is too large for this little entry they want

**5:55:45** · the same kind of family but they only want it 1T diameter so what that means is we need another type so we can take this one do edit type duplicate it again make this an L9 and because it's a type parameter we can change its fixture diameter and L9 for the type mark Mar so

**5:56:06** · it gets tagged appropriately and there now our symbol I I mentioned that this is just a symbol the symbol is tied to the geometry so that it is ends up being the same size as the actual fixture Extrusion and then we also want this fixture let's get it tagged we also want this smaller fixture in this closet so do this copy it right there so this will be represented the

**5:56:35** · same way way throughout the bedrooms I'm not going to show every single insertion of that through the bedrooms you'll you get the picture but in the bathrooms we want some wallmounted fixtures above the plumbing we had the issue downstairs where we couldn't see some of the plumbing we do have our view range down at 2 ft so it should cut any Plumbing that's in here but we

**5:56:56** · ended up turning off our plumbing we don't want it Plumbing interrupting with our light fixture but we can turn it on briefly or we can turn it on in our coordination view now we've not created a coordination view for this level because we're not trying to match up lights but we still could create a coordination view for other reasons but for this example I'm just going to Simply turn on the plumbing in the linked architectural we're in the Revit Link in the linked architectural model go down to the plumbing category Plumbing fixtures turn that on so we can see some

**5:57:31** · plumbing and all we'll see is the sink and like I mentioned before I do create an architectural PDF so I can refer to it without having to open the model so here's our PDF so we can go to the plan and look upstairs and we can see here there it is the shower's in here

**5:57:55** · the toilet's in here and our designers have decided we want a vanity light over the sink and just pendants in these rooms this pendant is going to be rated for a wet environment like a shower and we also want a pendant over this tub and let's go ahead and tag this guy we can right click and create similar it brings it the same height as the one we're

**5:58:19** · creating from and we can always change this height if we need to but we're going to put that over the tub we're going to put one in here in the toilet room and another one in the shower so what we're going to do is this guy is going to be yet another light fixture That's rated for a a wet environment wet label it's called so we are going to create an L10 simply copy an L10 it's the same size one foot diameter L10 simple as that and as we tag it it gets the L10 the rest of these are still

**5:58:53** · L9 and we need to get this vanity light now we already had one from level one so if we go to our schedule we can try to find it our schedule is just a start of a schedule it doesn't have anything in here about the description of what kind of light this is which would sure help right now when we're trying to figure out which is our bathroom vanity light so we can add another field to this lighting fixture schedule remember

**5:59:25** · our fields are selected from the available lighting fixture parameters that are in our lighting fixture families so we need to find a field that has some kind of a description this is where if you don't have custom parameters in your families which you won't out of the box you'll have to maybe repurpose one now we have one here called description perhaps we can use that so let's try description and put that

**5:59:52** · in here and we'll we'll change this to be all caps to match our headings description and now in here we can write the description well it's going to be hard to to do from this schedule view but remember we can do it from any of our views and it will still be documented here because it is just it is just reading the database let's go to our first floor lighting plan and L1 we can start filling these in L1

**6:00:23** · let's go to edit type and we can edit the description in here while we're looking at the light while we know what it is we can say it's a it's a suspended linear something like that this is just a rough description to help us remember what's what eventually in this schedule we'll have things like the housings being out of extruded aluminum things like that but for now that's the basics so L1 and then when we get down here to L2 was our track

**6:00:57** · click on L2 edit this type description we will put in track again just a basic description so we can keep track of these things the mechanical we're going to call this surface circular utility

**6:01:17** · style and then L4 is the more decorative go here and edit its description surface circular decorative L5 is is our bath vanity and we to get that we have to come over here there we go edit

**6:01:42** · that bath vanity and we can keep going so now you can see when we go to our light fixture schedule now we have some description for

**6:02:03** · these things so we know what's what and we can do the same for our fixtures on the second floor but for right now we know that bath vanity is L5 so now we can place an L5 now so let's go down and we can see our fixtures here's the L's so it may be closed we want L5 there he is drag that in and

**6:02:28** · now it will let me select which method I want so place on vertical face in this instance I want to place it to this face and I'll do it here where the geometry is a little less cluttered than all the sink place it there and let's see what height we're at 64 and we'll drag that over there so now

**6:02:52** · that light should be in there so let's take a look at in 3D and see if we've done this correctly we will select this little area hit our 3D box and then we're zoomed in we can use this box to pick different views I'm going to pick this other Corner we can play around with the section cut and we're seeing the light we can do it even from a left hand side now this seems low

**6:03:27** · but I think we don't have our section there we go we don't have our section going clear down to the floor so there's our light on the wall here's our little lights hanging down now one thing I noticed here is in 3D is that these stems just did the same same stem length as

**6:03:44** · the ones that I copied or created from so now I have to go in here independently and I can move these stems around however in the 3D view you can't get to this instance parameter this way we have to do it from a section so there's limitation with that so in my section I'm going to pull the section into this \[Music\] room now I can get to these and start adjusting

**6:04:14** · these so that's a limitation with a 3D view is you can't modify these instance parameters directly now I could type it in W that's a long suspended light fixture a very high ceiling but again that gives us the 3D look we're looking for

**6:04:36** · so we'll just go ahead and put the rest of these fixtures in but let's say in this entry hall they've decided to use yet another kind of light fixture that's more decorative so we're going to take one of these and bring it over into this space and in this space they've decided to use a nice 3ft diameter chandelier style fixture so let's create yet another type duplicate now where did we leave off light fixture says we left off with L10 so we're going to make this

**6:05:07** · l11 and this is a higher output light and it's 3T in diameter and let's go

**6:05:22** · ahead and put L1 and let's go ahead and put the description in as we do these now so this is a suspended circular chandelier there it pops out larger and we can look at the section first now we have

**6:05:46** · another section we can use here click on that now this one we can't see lights because again it's not set for our fine detail let's apply that view template that we made already and this is the power of the view template just click on that and voila there it is simple once you've made that view template you can apply it anywhere so there's our light it's the right it's about the right height close it's close and we can copy one and we can actually copy it from here to here so you can copy it from here and there's our light and we can get it

**6:06:26** · tagged like that so we'll do the rest of these like we just did now we also have some exterior lighting to deal with as we recall from looking at that architectural model we have a a walkway here we may want to deal with we'll say that the designers have decided that we're going to light this walkway just here at this end so let's see what that looks like so we will draw a section and use it as an elevation make sure our line yep we are there let's draw a section of this wall and apply our

**6:07:06** · template so what we're seeing here this here this is concrete this is our walkway and here's the railings so if we go to 3D view default we'll find that it applies our section box so let's turn off the section box in this view we should save this exterior view with its settings so we can get to it again we'll say exterior and this way we can see again what's going on let's go ahead and orbit

**6:07:39** · around so here we can see what's going on there's that walkway it goes out to this car parking area

**6:07:56** · so we want to get a light near this Doorway to light this entry and what the designers have told us they want to do is to put it right here beside the door so that would be about right here on this wall and we're going to use the light fixtures that we used on the first level so go down to first floor and we're going to use this guy right click create similar second floor and

**6:08:25** · it's a wall hosted so we need to host it to that wall and we don't have a grid line in the way so this should host nicely and it's set up right now at 6 ft we're going to put that up at 7 mount it right there and let's go back to that section and you can see that light nicely mounted right there get it typed it's the same one as down below and then they've also decided to put one outside this door

**6:09:05** · now we can cut another section or we can drag this section and use the little flippy up and down arrows to make it look that direction go back to the section now we're looking at this other deck which from here we can see this other side is this deck now we have a lot of glass here not many places to mount a

**6:09:31** · light so they've decided to mount it way over here so intersection it's going to be on this view here's the railing so it's going to be right here outside this window so in second floor that ends up being right here so let's rightclick create similar they're putting it right there and then finally the other exterior building mounted lighting we're going to do is out here on

**6:10:04** · this deck so again look at the exterior plan and this is interesting the orientation of the 3D must be locked before you can add tags or Keynotes that's a good point if you're going to do a 3D view you have to actually lock it down here there's a little lock button this little house click on it right now it's an unlock 3D view you would have to lock it to add tags so if you're ever going to do a 3D view that you want to tag or add text to you'll have to lock it first

**6:10:35** · but we're looking at this balcony here and we have walls and we have ceilings so we're going to say the designers decided just go wall mount lights out here rather than ceiling lights so we're going to use these same decorative exterior lights on this balcony and they want to put it just beyond the door so it doesn't hit and another one down there now this one here we have a grid line

**6:11:09** · as you recall from previous videos the grid lines can get in the way of mounting things so we need to hit tab to tab through all these stacked wall lines grid lines jip board lines all these things so we want to get it close hit tab until it flips the right direction now we know we're hitting the wall so we have those mounted and we can label these as well or tag them remember these are

**6:11:35** · smart tags they're not just text so there we go we just need to finish the rest of these interior lights now another thing I wanted to deal with in this video is lighting controls we have not touched things like switches or dimmers or things like that yet so I wanted to just quickly show you how that can be done we can use revit's built in light switch family so if we go down to lighting devices lighting switches and this is typically loaded with this template this project template

**6:12:09** · if not again you can go to load Autodesk family and find the light switches now this one has a variety of switches and these are line voltage typically line voltage switches like you would use residential unless you know high-end residential may have some digital lighting controls things like that but we're going to say this one's just going to be wired with line voltage you know toggle switches threeways fourways that kind of thing so we can represent that with these symbols and let's say that this master bedroom is just set up for a single light switch as you

**6:12:43** · enter the space it turns on everything in this master bedroom so we can just hit this single pole light switch drag it in and see what we get now because it's not showing up it's most likely a hosted family and we're going to go on a vertical face so as we get close to a wall just like a receptacle it's drawing this kind of a backward s St style of symbol for a switch

**6:13:08** · dollar sign and we're just going to mount it to this wall right there and it wants to host to a wall right there and simple as that now there's a switch in this room now Revit does have a built-in

**6:13:23** · switch system type of feature where you can assign lights to a switch if you have a three-way setup where you have a three-way switch and a three-way switch you cannot connect both of those switches to the switch system anyway so in my opinion it's not very useful I don't use it but I do

**6:13:43** · at least of course show some switches into space and when I circuit it I'll have actually an arc or a wire um a cable between the two to indicate what it controls but anyway let's go ahead and put some more switches in here so let's say we're right inside the closet they're going to have a switch and it's hard to get to this now look what happens here it's wrong side of the wall

**6:14:06** · it's kind of like the receptical situation I I can sort of get to it here but if you have that problem then what happens is there's probably a shelf in here or cabinets that it's interfering again get it close to where it should be and use your tab there it switched now another thing you can do rightclick create similar a space bar will rotate it to different sides but it

**6:14:34** · also mirrors the symbol so now that looks like a regular s instead of a backwards s so it changes your symbol on you so instead of using the space bar you're better off to use the tab to actually select the surface that you want it attached to so that's what I do is tab it through it and then we can do the same thing we have a pocket door so our light switch should be on the latch side

**6:15:05** · not the hinge side this is not a hinge but it would be on the opening side so again we can just rightclick this create similar and it's putting them at 4T you can change that height and if you take a look at our section here we have a section through here we can

**6:15:24** · see what that light switch looks like out of the box they are just a box now this one got close to the frame so if you wanted to look right in 3D you may move that away from the door frame you know it's it's a start in our custom switches we've made and custom receptacles we've added

**6:15:43** · a little more a little more detail to the 3D elements so that it looks more like a switch it doesn't need to be a 3D toggle or even if it's a rocker switch it doesn't need to be a 3D rocker but you can in a sense paint paint an image of lines on this to to more look like a switch if

**6:16:02** · you want it to look that way so we can continue just placing switches in our model if you want to do a three-way switch there's a built-in three-way switch here let's try this in this hallway let's say we're going to have a three-way switch in this hallway here and we want one at the end of this Hall so that these two bedrooms can turn it off or on this bedroom here can get to the one

**6:16:26** · here and then we also have a space out here that we'd like to switch so we're really looking at a three-way and a four-way and a three-way way if you recall how that's all done so let's try three-way and what it does as you can see there's actually I missed it try it again get to the wall

**6:16:48** · oh it's trying to put it on the grid that's why it gave me a an issue now I found the wall it puts a three but the three gets buried within the architecture so again my preference on these is not to use the built-in three-way that has a label that can't be moved I change it you can do it here instead to a standard single pole and then I just add my own text get a little three and I can move it where I want that's my preference keeps it readable but we can

**6:17:26** · put another switch that's the three I need to get to tab through to get to the switch create similar I want one down here this is All Glass and this is the latch anyway so put it here again I'm having troubles hit tab there we go and then over here we'll put it right there and that one mounts fine and then we can add our three-way to the end of this and you can just drag that wherever you want and then we need a little four for the four-way again this is all line voltage switching

**6:18:07** · and so that's how you would do that and we could go down to first floor and do the same thing put our switches where we want them but that's simply how that's done so with that we are done with our lighting plan until we come back and actually circuit these lights like we did the power hey

### Episode 08 - Circuiting Lights

**6:18:26** · guys this is Rob welcome to the next episode in this residential revvit electrical Series in this one we're going to look at circuiting these lights that we've put in on previous episode we'll look at how to deal with the adjusting the floor plan brightness in the background we will look at adjusting some Heights of some of these lights that are on different floor levels and then we'll look at actually circuiting these up putting home runs to the panel looking at the Watts that are on the circuit we will look at how to adjust all these little arcs that connect circuits and even the switches and show how to adjust those and fine-tune those to make

**6:18:57** · a nicely presented circuiting plan so stay tuned for another packed episode here we are back in our Revit El electrical residential series project that we've been working on and we are on the first floor lighting plan today we're going to continue with lighting plan by circuiting up all

**6:19:14** · of these lights that we've already installed in previous episodes if you need to review that go ahead and go back and check those out we have a variety of Lights in here and they're installed and they are tagged with the smart tags so we want to Circuit them before I do that I wanted to bring up a couple housekeeping items one thing I like to do with my architectural floor plan background is is help it to kind of be more faded in the plan we did that in the power plan but let's do that here

**6:19:42** · so remember we're using a lighting view template so any visibility Graphics changes we make need to be in this template so we click on the template and we go down to the VG overrides visibility Graphics override for the Revit links hit edit there and here we can see our architectural revvit link that we have and we can set it to halone which as you will see here kind of Grays it

**6:20:09** · down now if the half tone doesn't seem low enough we can go into some options to modify that if you go to manage and then hit additional settings you will see a number of settings in here and this one's called halone underlay there's a slider so we can modify this half tone so if we put it down to like 133% you will see that it nearly disappeared so this is a way you can deal with

**6:20:37** · the half tone and a lot of it has to do with your screen and then eventually when you print to PDF or if you even print a paper it may have different appearances so you'll want to get this dialed in for what works for you we will try 60 right now and that seems good for at least for this screen it kind of disappears and lets our electrical items like lighting and receptacles pop out the other thing I would like to do for some cleanup is that underlay ISS isue like right here you

**6:21:07** · can see that the light fixture here is obscured by the graphics of the sink let's go back to our lighting template and this is good practice to get in and out of here because this is something you will do quite often it's good practice to get in here hit this underlay and say okay and let's see what happens to the graphics now you can see that our light Graphics ends up being placed

**6:21:32** · on top of the graphics for the sink and this is independent of the dashed status now so it really helps your electrical items pop out I think from the background so that's a little housekeeping I wanted to do on visual the other thing I wanted to deal with that I didn't deal with back when I put these lights in is recall that this is a sunken living room this whole living room and

**6:21:57** · this balcony is is below the level of level one now the lights were okay because they're attached attach to the ceiling so they just attached the ceiling however these wall mount fixtures we installed over here as 6 ft above level one well that makes them even a couple feet higher than the sunken level living room level let's take a look at a section and I need to make sure my section is far enough over with this slider to get this light in there I've already fixed the switch and what I

**6:22:31** · mean is look at the switch I've already told it to be level one living room and 4T above that so I need to do the same thing to this light so let's look at that section and notice it's way up here level one is right here and let me pull these out so we can read these a little better because they're overlapped with the architectural levels level one is at zero and level one living room is down 1 fo9 so our switch was way up here before I lowered it now the light needs to be lowered so

**6:23:04** · so click on the light we're going to change its level from level one down to level one living room now that didn't move the light did it but what it did do is it red dimensioned it from our new Surface so that light is now 7 fo9 above the living room and this is where we want to make this 6 feet so it doesn't move the light it just changed its relative height and what it is

**6:23:29** · relative to so now this pulls it down so now we're 6 feet above this living room floor which is the same as this deck out here so we want to do the same over here move it down to level one living room and get it down to 6 feet and I believe I already did that with my switch I finished putting switches in yep it's 4 feet so we're good there we finished putting switches in off camera but we

**6:23:55** · showed how to do that up on the second level and now we are going to start circuiting now I also want to mention that this is a house as we know but in residential you would many times to save some money lights will be circuited on the same circuit as receptacles that serve that room other

**6:24:13** · than for example the kitchen because kitchen has special rules but other places like this hallway an electrician would typically connect these lights to the same circuit as the receptacles in this room so we could do that but like I said at the beginning of this project I want this to be more of a hybrid project where it's a house but I'm going to wire it like a commercial building so

**6:24:34** · yes it would it would be more costly so it's not cost effective but I do want to show how it's done so that's how we're going to Circuit this up when it comes to circuiting lights we have to of course pay attention to how many watts are on these circuits when we put the lights in we set their wattage or VA based on an imaginary like cut sheet from our lighting designer that's what

**6:24:54** · we're going to base these loads on is is what we have here and these are pretty typical loads for LED lights these days I mean this might even be only a 10 watt fixture versus a 15 watt fixture but this is how we're going to go ahead and and and hook these up we already have them set up at 120 volt so the joy of Revit is it will tell us how many watts we have on a circuit as we go we don't have to add anything up so let us just start circuiting we are going to Circuit at least this kitchen and the outside lights start those on a circuit and we'll see how we end up and let's

**6:25:25** · recall that our panel is inside this laundry room P1 is a recess panel load Center in the laundry room so we're going to Circuit up to that we only have one panel in this building so that makes that easy so click on L1 now we could select multiple fixtures hope holding control key down

**6:25:44** · and that's one way to do it my workflow is to get one circuited and then you'll see the others are are easier to Circuit because sometimes you will find yourself in a busy area where you're clicking on the room tag instead of the light fixture or you're hitting you know other things so this is the reason I do it in this order I will circuit one fixture and you go to the power button to Circuit like we did on the receptacles and then you can pick which panel and you can either pick

**6:26:14** · it by using the drop- down and again we don't have many choices here in this small project there's only one panel but you can do a drop down or you can hit the select panel button and then physically touch the panel and either way that selects panel P1 then it will show a dash line

**6:26:32** · which indicates your circuit boundary so we've got this fixture and this panel all kind of in this area it's a circuit it turns it blue now it is ready for me to hit a wire button which is actually a cable or conduit with multiple wires we can hit that button to show the home run but what I also like to do while I have this circuit selected and you can see I have a circuit selected now not a light fixture is I like to give a load name and this is the name not a load type

**6:27:03** · but it would actually be the name on the panel that would say you know kitchen lighting and I'm going to do it like we do with commercial loads we'll put lighting first and then we go or lights and then we go kitchen you can name it however you like whatever works for you and your users and I leave wiring till the end so I've got that done now I can start adding other lights to this circuit easily by just saying edit circuit now it automatically defaults to add to Circuit I

**6:27:37** · could jump over to remove from circuit if I want to start removing things but I want to add things so that's already picked and now you will see that all the lights in here that are not on my circuit are grayed out it's hard to see it that Zoom this one's dark because it's already on the circuit but also now it won't let me select room tags it won't let me select walls or any other things that might be in my way it only allows me to pick lights and switches so let me pick the rest of the

**6:28:11** · lights easily there and I'm just I don't even have to hold control down in this mode I'm in light selection mode so I've got those and I want to add the the switch that controls this area onto the same circuit so that I can show an art so click that that's my switch controlling here and finish

**6:28:34** · I finished circuiting those lights now how can I tell well you can't really tell by looking at it yet but if you click on a light and then over here in its instance parameters down here under a load you can see it's panel P1 circuit number 18 Revit automatically assigns the next available circuit based upon the rules you have already set up for which order to Circuit things so I circuited on

**6:28:58** · circuit 18 and let's go ahead and open our panel schedule to follow along with what it's doing down here on the left in our project browser come down to panel schedules and we already created panel one panel schedule back on the power plan but double click that guy and open it and you can see here we have our panel schedule and we haven't gone through and fixed all these Breakers yet we haven't put any down to 15 amps yet but we can fix it at the end but here right here it's

**6:29:23** · putting them in order down the right we already went in order down the left we're going order down the right here's lights kitchen it's our 20 amp circuit and over here there's 390 Watts or VA on that circuit so we've got plenty of room to add more lights so let's go back to first floor and start adding rooms look at this hallway and what I've set up for this one is I put a three-way

**6:29:45** · switch here and I put a four-way switch down here to control these lights well why a four-way well that's because I'm also controlling up the stairway there's a stairway up here look at the second floor and you can't see it because this is a ceiling plan in the floor plan you can see the stairs but there's a stairway that comes up here and so I want these stairway lights and entry lights to also be controlled by those two switches below so I actually have four switches controlling this area so we'll keep that in mind when we circuit so I'm going to leave those off of this

**6:30:21** · circuit but I do want to put in the rest of these circuits here so how do I add to this circuit I just need to hover over one of these lights that are already on a circuit and if I hit tab once it worked sometimes it takes a couple tabs and as you hit tab you'll cycle through different things

**6:30:40** · and if You tab then click now I've selected the circuit up here you can see you're on electrical circuit and I have options to wire things now but for now we want to edit the circuit and add to this circuit again add circuit is automatically up so now we're back in that same add circuit we were before we're not going to do the hallway but let's go do the mechanical room and it's switch let's do the bathroom and it switch now we have a bath fan In Here Also which we will need to connect which we will get to in a minute we have fans many small fans to connect this switch this

**6:31:15** · light this light and that's all I want to add to this circuit finish editing the circuit so if we click on a light again we see that it's circuited but we don't see the load of that circuit we have to do the hover and tab and click to get into that circuit to now see its information if we look at

**6:31:36** · the circuit we can see line by line some of the load information now one thing that jumps out to me is it it's set up with a power factor 0.95 now that is set somewhere in one of our lights I would assume and it doesn't really need to be I mean lighting drivers and such if you really dig into it are are so close to a Unity power factor that it's shouldn't be an issue so that

**6:31:57** · doesn't really matter too much to us but what all it does is inflates our apparent load to be a little higher which is okay too so we have plenty of room on this circuit to add more if we want now while we're in this circuit we can try to do some arcs now let's see what happens with Arc wire hit Arc now Revit takes its best shot at drawing spaghetti now I've actually trying to draw

**6:32:21** · arcs between things it does a relatively good job it depends on the GE the geometry of your light fixtures and such but as you can see it's arcing all things together and it kind of picks the shortest distance between them it's not maybe how an electrician would actually wire it but again remember our plans are diagrammatic we are just trying to convey a design intent and show that all of these are circuited together some people don't even draw arcs on plans they will just put circuit numbers beside each light so you can do whichever way you do but in my experience I prefer arcs they

**6:32:56** · do land some some understanding to how things are circuited Beyond just circuit numers so I'm going to leave them in but we do want to move some of these tags around to avoid the arcs now we can move tags we can also adjust arcs and I showed this on the power plan but there's some controls on these wiring arcs that you can grab this grip here and move it around and kind of shape your Arc I can actually move it over to this side if I want now when I do this I probably want to move

**6:33:28** · where this Arc attaches to my light and you can see this little blue circle and it's hard to see when you zoom in because of the lines it go up to thin lines and click on this again you'll see that little grip better so that grip is actually shown where this wire wants to hit that light so if you do click on it it'll move over to it but you can move this grip around move it to the middle if you want I like to hit the edge personally as if it's diving towards the center but pick the graphics that you like and this is how I do it and I'll go back turn these off if you need to do some kind

**6:34:03** · of a a fancier Arc you can add vertices to this for now I'm just going to move things around and get this to look proper so it takes a little drawing it's still easier than actually going in and drawing arcs by hand I believe now the light switches it puts right to the middle of the switch and I like that to be out at the end of the switch be as picky as you like now this

**6:34:29** · one is not just a circle grip that lines it's not just the circle it's actually this Square which is the electrical connection point of this switch if I was to pull it off of here I have actually disconnected electrically the switch from the circuit and we get this Arrow like it's a home run so I have to be careful about that so we'll just leave that connected where it should there

**6:34:55** · it's connected even though it's a little bit off of the switch the connection point is down here rather than at the switch it's an outof the boox switch from rabbit what can I say so we have the lights we have this light connected has a lot of things tied to it we are going to be using arcs from switches to show control so that part does matter now Revit has a built-in switch system and

**6:35:26** · you can assign switches to lights but it does not draw Arc it does not label the switches it doesn't do any anything frankly except behind the scenes it's connected so I don't use that system I just use arcs but what he can do is I can force this to connect to a different fixture for example this switch leg from this switch to this light it's not controlling that light it's controlling this light I can pull its grip clear over to another light now I have to adjust this also

**6:35:56** · but now I've shown that that switch controls this light because of its Arc now does that mess up the automatic draw arcs let's see what happens hover over this now if I hover over once you can see electrical Network that's a network not a system a network of connected items that are connected

**6:36:18** · to each other kind of like if you drew a box all four lines are connected to each other it's kind of a chain that's all that's saying it's a network so if I click that I'm not actually selecting a circuit I've picked 26 pieces that are are networked together in a chain so I could move

**6:36:39** · all of this stuff if I wanted to which I don't want to do and you can see that there's a number of errors that come up but it's just showing that those are all connected together I have to tab a number of times to get my circuit to light up now when I'm so zoomed in it's hard to see but there's a blue line out here that indicates that I've hit a a circuit you can also see as I hover

**6:37:07** · there's a little bit oh I'm back I got off of it and back on so now it's back to network so I need to tab there's the network tab again there's the circuit electrical circuits number 18 then I can click it so it takes a little finesse to get that figured out I'm back in my circuit and if I hit Arc wire it doesn't try to redraw this here it knows there's already an arc connected to that switch so it it's leaving it alone so this won't mess up your switching arcs this switch actually

**6:37:40** · controls this light so now I'm pulling it over here somewhere and I can put it near the same point I want to adjust this Arc so again take some fine tuning to get this done you could instead

**6:37:57** · just manually install wires for example down here in the laundry room let me delete that wire now and go up to systems and go to the wire tool draws arced wire runs and just click on the wire tool now I can hover over the actual electrical connection point which is right there there's actually a a box and an X go from there pick a center point and then hit the other one I have

**6:38:26** · to hit the connection point now it's electrically connected with the wire or cable and it does the same thing as doing the automatic wiring so you can go by hand if you want to and again if you do that and try to hit wiring again it won't redo what you have if you take it off completely

**6:38:48** · and then go back to the wiring tool see the dash it wants to connect those so it keeps track it's pretty smart it keeps track of what is wired and what is not now this big guy here with the arrow ends up being my home run of course which is means the run from the last fixture to the panel and it points it towards the panel in this case it's putting it right on it so we can move that to a place that may be better for for uh indicating the circuit now you can see this Arc is way off the map luckily they give you this grip so you can tame tame the arc so let's do that and speaking of

**6:39:28** · Home Run let's go ahead and tag this now we've already preet up our wiring to only show wires on the home run you can have it set up to show wires everywhere if you want I find that that gets tedious so I I leave it off but go to tag and make sure your leader is off and we're going to tag this actual home run and it's set up like on the power plan just to show the circuit because we only have one panel and commercially I would have p1- 18 I would have panel name- circuit number

**6:40:01** · but in this case with only one panel we're just going to going to leave it simple so let's see go through the rest of these and you can tweak these arcs if you want again I get kind of picky about this myself that goes there that's fine and the rest looks good all the tags are out of the way

**6:40:21** · so that is lighting circuiting 101 we're going to do the same to the rest of this house grab one fixture hit the power button P1 is the last panel I used and it's the only panel I can use so we're good there now I want to edit the circuit and add the rest of my lights so I'm going to add this now these are all broken into individual 4ft pieces now what happened here cannot add L2 to the

**6:40:49** · Circuit the voltage for L2 is out of range for the voltage 120 volt for the circuit okay you'll run into this now and then where your light fixture is set to a vol voltage well in this case to the wrong voltage and notice that on commercial buildings lights can be if you have a 480 volt system you also have a 277 volt to neutral system so lighting is often 277 volt in commercial you

**6:41:18** · know bigger commercial industrial buildings we can't connect the wrong voltage fixture to this circuit so we have to just X out of here and cancel editing the circuit we need to fix this light so let's edit L2 right here L2 is our track edit and see what we have for voltage now

**6:41:37** · we looked at this when we installed it and noticed that this is a manufacturers family and in hit we notice that they have an electrical section that has some voltage and wattage and power factor and poles and then they have an electrical loads Supply voltage and apparent load so this begs a question which one do we use I have to say this is one reason I don't like using vendor families

**6:42:01** · is because I find this kind of thing happens often that it gets confusing and I like to boil things down to make it simple so apparently this Supply voltage is not really the right voltage and is this even a number field yeah it is a number field that's not text but it's not the voltage that the

**6:42:22** · electrical connector inside this family is using so it must be this voltage now again I would go in here and get rid of these extra voltages and loads that aren't correct because I don't even think the the load is working we need to put 120 here and the wattage we set at 400 let's try

**6:42:46** · that we can save the project every chance you get so let's try that again which fixture this guy wasn't connected this guy is the one that's connected so we want to hover over it and then click it so we're into our circuit now now edit circuit that light works let's see if that light works now that fixed it that was the voltage we needed to fix well because we fixed L2 which is a type all l2s follow along that's the joy of having a type not an instance so now we can

**6:43:22** · select all of these now I was just going to say that remember these are 400 watts each that's going to add up quickly and this is what happens in Revit it warns you the total connected load for circuit 20 is exceeding 80% of the defined rating 20 amps so Revit keeps track of that for you which is Handy uh it's a good little warning and so what's happening is these are high wattage fixtures so we're going to have to do something different with circuiting so let's cancel out of this again so we have four of these at 400 that's 1,600 Watts that eats up a circuit by

**6:43:58** · itself I mean a 20 amp circuit at 120 volt is good for 24 400 watts and 80% of that is which is about 1920 so 1,600 would work so in reality we really need each of these rows of track to be on their own circuit and we could pop some of these on so my suggestion would be maybe go four of these and then that guy and that guy and then we have to think about the switching we're going to be switching each circuit independently too and then same thing here so let's do that and then we'll adjust their switching so we already have this circuit tab click edit circuit let's add

**6:44:33** · these four and that guy and see how we do and it doesn't give you a running total or anything like that you just have to finish editing and then hover over the circuit click it and then look we're at 16009 we are good with that circuit now we can label it I like to do that while I'm here lights living room apply that and then I'll hit my arc wire and see what I get so a ger

**6:45:03** · home run I might stretch that out a little bit and then I'll deal with my arc and where you put the arc affects how these wires look as you can see the other thing I'll note on the wire a little plus and minus you can add additional hot wires to this if you need additional wires

**6:45:20** · sometimes you need an additional hot because you run a switch leg and a nonswitch leg to a fixture and things like that if we're showing wireing between switches threeways and fourways we would add what they call The Travelers the extra wires that are between switches so that's a plus and minus for that let's go ahead and label this home run circuit 20 and just check the arcing doesn't do a smooth Arc depending on how zoomed in you are what's interesting is that the track which is from a vendor the connection point for this track is way down here see for this light

**6:45:58** · fixture the connection Point's way down here past the light fixture so again something strange in this built-in fixture so I'm going to have to fix all of these again I mentioned you can't pull this off of here you get that problem so what if I do want to change where that hits if I zoom way in I can find it there we go so that sometimes it's a little tricky to

**6:46:29** · get to that grip but now I have both ends of this fixture so I can connect it to this light and this light and get that that way so sometimes it is very much a challenge to find that little grip now you can see zooming way in I found it with thin lines on

**6:47:03** · we're going to play around with this I'll go ahead and I'll go ahead and speed this up and then this guy who knows what he's doing got all sorts of things going on here

**6:47:34** · wi's gone crazy \[Music\] here but you want to find that Circle grip so something like that and I'll do the same over here we're going to wire this separately power the next P1 edit circuit add the rest of these

**6:48:00** · you can see it's easy to pick these I don't have to worry about the L2 in the way L4 the tags finish editing hover again and pick it you have to do a hover again to pick these it doesn't stay picked which is annoying lights living room also and then also once you start typing you can just jump down and click on that and save yourself a type and let's Arc it and I'll go through and do the same things I just did I'll speed this up

**6:48:50** · and there we go now we need to get our switches adjusted now that we've had to go with two circuits I mean there's also of course a possibility you can use a a two- pole switch which switches two circuits at once but if you start doing that that with threeways it it gets to be messy and expensive so let me fix this Arc fix those wires what I'm going to do is just put two sets of three-way switches on here get back out of thin lines right click let's

**6:49:19** · create similar down the wall and let's click this and hit copy recall that I don't use the built-in labels in three-way switches because it would be in inside that wall somewhere right now the three-wood and you couldn't see it so I just use text however I do need these to

**6:49:40** · be connected but let's look at the other end now I had put switches and I hadn't put them three-way yet but I put switches at each exit so if you're coming in from here you can turn lights on or if you're leaving you turn them off I think doing it per row works I could put two threeways here for both and two three ways you know or four ways of course if I do all of that but I'm just going to put a three-way at each we'll say that will work for this

**6:50:06** · situation as you know switching can be very much a personal preference so I just go with what I think makes sense at the moment at least so now we need to

**6:50:27** · get these switches added to these circuits so hover over here connect it edit circuit pick that switch and that switch finish and then hover again and click and now I get my

**6:50:42** · dashes now it'll be interesting to see what happens when you get close to the Home Run and you pick another fixture or another switch it may decide to put the home run from the closer it did not luckily it chose the fixture to home run not the switch and we can always change that around and again in reality they may run a home run to thewi switch first and

**6:51:04** · then go up through the lights with all the extra Travelers or they may hit the switch first they may run cleared onto this switch with The Travelers and such and then take the switch like from here back up to the lights so again how they wire this is independent really of how we show our design in tend of what's connected to what is these are not wiring diagrams an electrician drawing this may end up drawing it like a wiring diagram which is great too needs to be drawn to uh suit whoever the user of these plans are tab let's edit circuit select

**6:51:40** · our switch and also this is nice it doesn't try to pick a three it lets us select the switch finish it tab tab select arcet and we can move the three out of the way for this guy that's why I like that being its own thing we can move the home run the 22 follows but we can still move it and then down here I don't like the arc that tight reworks so there now we also have these exterior

**6:52:13** · lights which we may want to tie to one of these circuits now we've already decided that those lights are going to have built-in photo cells and they're far enough away where they're not going to affect each other in that regard so we could add both of these just to one of these circuits it would be the unswitched leg of a circuit but we have enough room on one of these circuits to add it so I'm going to go ahead and add them to this circuit tab tab go to edit circuit pick these two lights we didn't get any warnings that we have too many

**6:52:44** · amps on this circuit finish editing then we have to select it again of course to do the wiring tab once was enough and then do our Arc wire and then we want to fix the AR wire now this it wanted to connect to that switch which we don't need need and then we can do this and fix our

**6:53:08** · arcs and again it went from here to here we could go from here to here let's go ahead and put do that so sometimes I like to like make it a little more practical than what it's trying to indicate and then here we have that same issue with the circle let's see if we can even find it way in here now they are so on top of each each other I'm zooming way in and I'm not seeing it so and it put

**6:53:39** · me way over there for some reason so that's going to be a tricky one this is one where this may help to get this extended Beyond and then sometimes it'll put a circle out here for me but I don't

**6:53:55** · see oh there it is I went clear over here and it decided that oh there's some other geometry you can attach to now it gave me the circle I was looking for so you have to kind of outsmart the grip we're good there this one is going to take some outsmarting pull it here so that it draws it over on that little guy there and now we can get to that Arc and draw it the way we like again little finesse to make that work and move our three

**6:54:35** · so now let's go and see what we're going to do with the hall we're going to make a circuit that spans two floors two separate plans so this is a good opportunity to show how to deal with that so we can circuit these together first and then we will go up and add the second floor items so let's get this started pick one fixture hit the power button it's going to P1 of course let's call this so upstairs this is is going to be called the entry hall so I'm just going to call this entry hall even though it comes down here apply that edit circuit and add the rest of these lights

**6:55:12** · to the circuit and we want the Swit the three-way switches four-way switches for this added to that circuit I can finish adding like that so there now I want to make sure I add these also to upstairs so how can I do that I go up here how can I add those to that circuit I need to select the circuit first well make sure you have both of these views on tabs so you can get to them you don't want to

**6:55:37** · have to click over here to get them open although that works too but it's easiest I believe if you have them both open so you go first floor hover over your circuit select your circuit if I go to second floor plan I now since circuiting is still selected still open I can edit the circuit now and finish adding my fixtures so I've added these and my switches to that downstairs circuit I'm done

**6:56:09** · and I'm going to call entry hall I'm going to put the entry hall over here rather this is kind of a hall just to the back bedrooms so I'm going to now hover over this click it and let's select archwire see what it does it gave me a home run on this level because it will do that per level if I go downstairs and do click and do Arc wire it gives me a home run down here as well which is way over

**6:56:35** · here so my way to deal with that is let's get this moved over where there's a little more room

**6:56:52** · and you could Point home runs how you want some people like to point them to the panel some people just point them anywhere or all all in the same direction there's many schemes out there I'll do that for that home run but I also want to indicate that the circuit needs to continue upstairs so what I will often do is manually draw my wire from the connection point and send it upstairs

**6:57:15** · like that and it'll do a home run because it's not connected and I can just say with a note I can say up and and that just is kind of a indicator that this goes up the circuit goes up to other lights so now I go to my second floor plan this home run can be a down I can move it over here there's different ways to do this so I'll put it over here and I'll just put a text on here and

**6:57:50** · call it down and that kind of points to each floor when you're looking at at this floor you can see that that goes down so to know what circuit this is on you would have to go to the first floor and look at that home run let's go ahead and get this Arc get all arked up here and move the three

**6:58:16** · around let got hit that okay so looks like we're good there so that's how you can do multifloor circuiting and I have a whole video I'll point to up above that deals with multifloor circuiting and it also deals with tagging the fixtures or in that case receptacles for the circuit number that it's

**6:58:37** · on since you don't have a home run on each floor next we're just going to Circuit the rest of this floor and I'm not going to do that here I'll do this off camera because it's the same technique the last thing I do want to show though and I can show on the first floor is how to deal with all of these fans that are in the bathrooms so let's go down to first floor and we need to open a power plan because the fans are actually on the power plan first floor power plan so for example in this laundry room we have a fan and we want to connect that to the lighting circuit so such that it is

**6:59:11** · controlled with the lights now also one thing I noticed I see all my switches on this power plan I don't want that so I need to turn the switches off in this view template so going to power plan view template and let's go to it's a model entity in our model and down here it ends up being we

**6:59:35** · don't want any lighting fixtures and lighting devices are what those switches are turn both of those off so I don't see them in my power plan there we go now it does beg the question if you did want to show a switch on a power plan let's say I put an independent switch to control this fan how would I show a non-lighting switch on here well that gets tricky because now I need a switch that is actually an electrical fixture so you can either find one somewhere or most likely go in and

**7:00:07** · have to edit one and edit the category that it is so if that's of interest you know I can show a video on how to do that but in this case we're tying these to the lighting circuit as you can see here I already put some notes on this fan it says to the lights but I would actually like the load of this fan to be on that lighting circuit so that it is more accurate so again I need to go and

**7:00:35** · and I'm going to close some of these other plans what you can do is just go up here to hit closeing active views and then I can reopen my lighting plan so I'm going to go to my lighting circuit here tab till I get to the circuit and then I'm going to jump over to the first floor power and say edit circuit and I'm going to add this fan as you can see it lets me highlight it and hopefully oh good it's set up for the right voltage and there so now that laundry fan is connected to

**7:01:07** · that lighting circuit and if I was to hover over it and do a Arc it will try to do a home run and that's where I can label this note to lights I'll do it here I'll just copy this one copy

**7:01:35** · and up here instead of just this dumb Arc I can actually connect that to my circuit and get my home run first floor plan again bath is the same circuit actually once I select the circuit go to first floor edit the circuit to add it select the fan and there now what happens if now look it wants to connect these two together because they're on the same circuit so I can simply pull that off and just use what it's put in there as a home run again

**7:02:15** · for to the lights and get that AR so you kind of have to again play around with the system and uh tweak it a bit to make it work now the furnace is its own circuit so we're good there and we have one bath fan one laundry fan we're good and so you would do the same thing up on the second floor lighting second floor power plan to get these fans connected to the lighting circuit and one last thing I want to show you about the lights too is I hadn't mentioned before these switches have a voltage associated with them as well now in this case it happens to be an instance

**7:02:51** · parameter over here electrical switch voltage a lot of these voltage and wattage parameters have been type parameters so you'd have to go into edit type to fix it now why would a switch be a instance parameter well this is again the built-in out of the box Revit switch and they did it this way I would say most likely because you can have switches like I mentioned before that are on a 277 volt circuit in commercial work so this allows you to change each switch independently to be

**7:03:24** · its own voltage now our custom switches that I've made for our firm I have separate types that have the switch voltage in the type so I don't have to change them all independently I can just change that type or you just use the type that's the right voltage so different ways to do it but in this case these are all set up as instance parameters and luckily they're all set up at 120 volt which is what we need in this project so that wraps up the lighting circuiting hey guys

### Episode 09 - Site Plan and Filters

**7:03:51** · this is Rob welcome to episode 9 in this one we are going to work on a site plan we're going to take a look at that architectural PDF we made and we're going to create a site floor plan in in our electrical model link that PDF of the site plan to establish the angle of our building from

**7:04:08** · North so we can make that match and then we're going to customize our view range for a site plan to get the right elevations and we're going to have to rotate our view to match that angle then we're going to insert some out of the box Revit Transformer and disconnect families and get those situated in three dimensions insert a custom meter family and then get those all connected with 3D conduit modeling including sloped conduits under our slab and then we're going to finally put in an outof the-box sight lighting pole fixture and get that elevated and connected to our panel so

**7:04:43** · an information filled episode I hope you enjoy it and let's get right into it and here we are in our residential electrical Revit project that we left off finishing up the interior lighting circuiting so this is our second floor circuiting and we got that all taken care of now we're going to look at a site plan and so I have full architectural set here we can take a look at the 3D view of it the rendering and remember we have this second story pathway walkway over to a parking area surrounded

**7:05:13** · by concrete and so on the site plan itself first of all we can see that the whole plan is tilted from North here's our North arrow down here and it's tilted a bit from North so our site plan is going to be oriented this way rather than the floor plans which we have turned to more of a project North so that our plan is vertical if you recall like this so North is a little bit diagonal

**7:05:38** · so what are we going to have on our site we have a few site items now we're not doing a solar design in in this project typically at least in my experience that's done by a specific solar expert a solar kind of a niche solar design firm we may need to show a feed after their inverters down to a maybe a 240 volt connection from here into our panel from their inverters so we'll get that shown

**7:06:03** · and we'll say that they have a inverter and disconnect out here on this wall and then we don't have utility coordination for this fictional project but let's say that we've talked to them and they're going to set a little padmount Transformer here a little 12240 split

**7:06:19** · phase and then we are going to run it from this Transformer to a meter and we'll put the meter down here on this wall so that they could walk down the driveway and read the meter here without having to go clear over to the property some places the meter will be mounted on the building but we don't have a good place to mount it here so we'll mount it there and then we need to run the service lateral from that meter continue it on under the building down this slope into our panel

**7:06:48** · which is on level one now we are going to show the conduit run underground and someone might wonder well why do we need to show that conduit run you won't even see it well we're going to do it for coordination reasons and a lot of times at least in in our practice we will show large conduit runs of course not the exact run because the contractor will figure out the exact run but

**7:07:12** · we're going to get something that's a possible design that could be built because we just want to let other trades and the architect and all the other trades know that we need something from here to there and there's going to be a big pipe in the way that they need to coordinate with the other piping Plumbing the Wast lines and water into the building and other you know other systems

**7:07:32** · coming into the building so at least we want to get that in here for coordination purposes and we'll also show an underground conduit heading out to this Transformer so that's kind of the overall plan of what we're going to be showing here but let's get this plan set up and that is sometimes a feed of its own a lot of Architects will draw this site plan with just detail lines

**7:07:53** · or maybe a cad background sometimes they'll actually do modeling where they'll model trees they will they will model concrete walls things like that they will show up in our plan so let's go into our into our project here and now we where do we start from I typically do a site plan as a power floor plan rather than a ceiling plan because there's no ceiling outside of course but how do I want to start I can copy duplicate my first floor plan or my second floor plan so

**7:08:24** · part of it is decide what what level do I want to base my site plan on because it's sloped it may be tricky to find the the proper cut plane so we're going to start from scratch and we're going to start it on level one and see how that looks so let's go to view plan views floor plan

**7:08:43** · and this little button here says Do Not Duplicate existing views what it means is if I've already got a floor plan on level one don't make another one well we do want to make another one because we're going to call it a site plan so uncheck that you can see all of your levels so we'll click that and first thing you notice is that well it didn't appear here well Revit starts with a default view

**7:09:07** · template and it tried to make a mechanical plan out of it so it's probably up here in a mechanical section way up here so first thing I want to do is get this to the right location now we we don't have a site plan view template created and we may not need one if you only have one type of plan on

**7:09:25** · your set you may not need a view template for it sometimes you'll create a view template just to be in the habit of using View templates so that I don't wonder do I go up here to change my view or do I go down here to change visibility for example so we're going to create one we're going to start with none for now and then we will turn that into a view template so the first thing I want to do is get this organized into our project browser and that has to do with what discipline

**7:09:52** · is under so if you look over here on the right go down you can find discipline and that's when it assigned a mechanical discipline let's change that to electrical that's a good start it apply and then a subdiscipline way down here is HVAC so they really wanted us to create an HVAC plan let's

**7:10:13** · go down to Power Hit apply now that sets up the organization in the project browser to get it down here under electrical subcategory power and there it is and it just calls it level one so we can hit F2 and call this I usually give it a zero just to put in the right order site plan all caps and I

**7:10:35** · call this electrical because it could have power and lighting typically on a site plan do I want to rename the corresponding level no just the view thank you okay so there's that now an issue is we can't see any of the site stuff a couple maybe walls here some walls here maybe because we're on level one so also we may be cropped so let's see if we have a a cropped view we do not have a

**7:11:04** · scope box associated with this so it's not a scope box crop but let's get the crop View and it was actually it actually said no don't crop it but we can look at the crop View and see the crop region and we'll find out that it's way out here so it seems to be far enough away this crop view that we would see any sight stuff so I think it's going to come down to a level now how do we affect the view based on the the 3D View and the Z coordinate the up coordinate also we want it to be tilted like

**7:11:39** · the architect's site plan so at least to get the Tilt right we are going to need to know what angle this tilt is so what we can actually do is if you have a PDF plan and sometimes you'll have a cad plan of the site or even a PDF maybe from a civil engineer or your architect you can actually bring this PDF in and underlay into your project and draw on top of it and use it again as an underlay for for drawing things and then you can get rid of it when you're done some people will actually leave a PDF in the plan if they need it if we don't have sufficient other information like a

**7:12:16** · cad plan so let's see how to get this PDF in so let's go ahead and up here in the insert tab up here where you can link in rabbits and cads well you can also link a PDF so hit link PDF and then get to your folder where it is and we have this one called the basic sample project PDF and open that and it gives you a choice of which page do you want to bring in so this looks like the site plan there and you can go to a higher resolution 300 seems to work say okay and it's loading it

**7:12:49** · you can see The Hourglass and then it wants you to place it left click to place the raster image well I can't see my image so I don't know where going but I'm just going to click in the middle somewhere do that and I get the warning none of the created elements are visible in the floor plan you may want to check active views parameters okay so we have a visibility issue so a PDF happens to be a raster image it's called so let's go we don't have a view template yet we'll go to visibility

**7:13:21** · Graphics up here and under model category let's go down to raster images right there click on that and there is our site plan so it's in there and we can move it around now one issue is the scaling of it it appears to be a little smaller than this so how can we scale it how can

**7:13:52** · we get it to be the right size it is just set up with a width and height and a scale is set up for 96 now if you remember CAD days we had to scale things 8 in was 8 \* 12 is 96 we had a factor of 96 well this one is set up for 1 to 200 which is metric our plan is set up for 8 inch that's why

**7:14:17** · it scaled it at 96 what we can do is instead of being 96 let's just say we want 200 right off the bat directly hit enter and there we go now let's see if that looks like it is the right

**7:14:36** · size and just kind of comparing them side by side they they tend to look proper well now we need to rotate our model to match that well you don't actually want to rotate your model itself we want the model to be the way it came in so what we actually need to do is rotate our view of the model so the way you rotate a view of a model in red it is a little little counterintuitive but you want to grab the crop region and rotate it in the opposite direction that you want to

**7:15:12** · rotate your view we also want to see what angle do we want to rotate this so we need to figure out what angle this building is compared to horizontal or vertical we need to find some lines on this background so let's take let's take this nice long I'm going to move this out

**7:15:31** · of the way take this nice long building line right here and we are going to draw with the detail line right on top of this and we're just going to you know we just need to get close so we'll draw this about right there and also draw one vertical and then we can put in a little

**7:15:54** · we can put an angular we can put an angular Dimension so angular from vertical to there is 37° so we want to rotate our crop region 37° but if I if I rotate it to the left you'll see

**7:16:14** · what happens let me do this click it hit rotate it wants a center point so we can just use that Center Point and click anywhere horizontal and then you want to go up to 37° can sort of see it in there 37 if when I do that you can see that my building rotated to the right it did

**7:16:33** · the opposite of what I said so I need to rotate my view so I kind of think of view is rotating your camera if you rotate your camera clockwise to the right then the final image will look rotated to the left counterclockwise so take your camera rotate it let's go from vertical and we want to go 37 to the right that ends up looking like our view is rotated it also rotated our PDF so now we need to rotate our PDF 37° actually to the right to get it back in

**7:17:10** · alignment our model appears rotated we just rotated the view so that just shows that we were able to get our view rotated we can get rid of our construction lines here and now we have the proper angle on our background now we're going to play with the elevation of this view range so we can look at the North elevation and we can see what our levels are here's our levels over here so we're looking at level one and these solar panels are just above level one

**7:17:50** · and a lot of this stuff is up on level two so I think level one's going to work we we don't want to draw a level two because then things will be underground so we're we're at the level one so get back to our site plan I'm going to close the rest of these plans and we just need to mess with this view range remember view range bottom cut top and then underneath the bottom is a view

**7:18:16** · depth to see below that bottom level so right now we're cutting at four and our top only goes to level two on a site plan I typically like the top to be unlimited I want to see clear up to the clouds and then the cut plane I typically might like to make it nice and high way up high above my building so I'm seeing the roof on a site plan it's as if I was looking down from a satellite or an airplane so I'm going to make the sight plan I'm going to make it like 500 ft cut plane and now you can see what I'm talking about we we can see now the

**7:18:55** · roof we see some of the plumbing fixtures through so you we see a variety of things but even though the cut plan's High we see clear down to the bottom of it so we can tweak what we see on this plan individually if if just the view range itself doesn't work I notice that we don't see these solar panels so we may need to take a look back at this elevation to see what category they are so as long as you have things turned on selectable here or you can do the same thing down here you can hover and tab and try to click on one there we go

**7:19:32** · okay so it is actually an electrical equipment in the architectural model so we need to turn electrical equipment back on in our linked Revit file to see those so again we don't have a view

**7:19:47** · template we'll do it up here let's go to the Revit links and right now it's set up just by whatever our host view says and this brings up a good point that even in our host view we're going to need to have certain electrical items on so that we can see them on our site plan when we put our meter in put a Transformer things like that you know we meet electrical equipment electrical devices turned on so in our let's go into our model and get those turned on fixtures and equipment

**7:20:20** · that does mean we'll see every single device inside the building as well and we're going to deal with that in a bit with a filter but for now because our link is set up to be visible

**7:20:37** · display settings by the host view our our model our electrical model is the host we are hosting that architectural so our host view settings determine what we see in the architectural link so now as long as we keep it host view we can see it if we Chang this to custom then we

**7:20:56** · would need to start turning things on and off but right now it mimics whatever we do our host on a site plan I don't need to see grids so let's go in here under annotations and turn off the grids that turns them off in our model and in the link model because the link is following the host

**7:21:17** · as far as visibility now we don't have contour lines we may not you know we may not need those in our plan people can look at um the architectural site plan to see the Contours and let's see what the west elevation looks like and we can see this extreme slope we have from the parking area here's

**7:21:38** · the walls slope so when we put our conduit in we're going to have to keep in mind that we have to slope it down to get it underneath the building so let's go back to our site plan I think we are good to go with modeling some of our site features so I'm going to go ahead and get rid of the PDF at least from here it's still LinkedIn to the project I just don't have it showing right now on this view again we are going to be turning some of this stuff off here with a filter so let's not

**7:22:10** · worry about it showing right now but we do want to get this tagged because I do want that showing in my site plan so just do a leader tag point to this E1 and that also makes me think about do we have the right scale for a site plan well the architect did 1 to 200 so it was more like a 16th of an inch

**7:22:32** · a lot of sight plans are based on civil units so 1 in equal 10 ft 1 in equal 20t 30 ft things like that so it sounds like 1 in equal 20 ft would be the closest to the scale they used so we're

**7:22:49** · going to go ahead and change the scale and again because I'm not in a view template I can do all of this stuff directly and here's all your scales see you have both architectural scales with they which are based on fractions of an inch and then you have what I would call civil scales which are based on 1 inal 10 ft so let's go 1 inal 20 ft so let's at least get service into this building now

**7:23:10** · what do we have for a Transformer this is where we're going to start finding out what Revit has out of the box for us to use we're trying to use as much out of the box families as we can on this project again I use mostly custom content in our own firm's work but as you're learning have it

**7:23:31** · you may find it's easier just to use some out of the box so let's see what we have we look down here and we under electrical equipment we have only a dry type Transformer we don't have like a pad Mount that you would see out here so let's go up to our Autodesk cloud insert load autod disk

**7:23:48** · family we've done this in previous versions and you'll start with with all results and you want to go down to electrical and then under electrical skip the architectural ones because they don't typically we have electrical connectors and down here under MEP we have electrical power appliances distribution generation and transformation so we are looking for a Transformer here's generators dry types Transformers Motors there's a wet type Transformer looks like a pad Mount so we

**7:24:20** · will click on that and load it into our project and it shows up under electrical equipment right here and a wet type 12 KV down to 480 well we're not 480 so we may have to change all that but we also are only showing this for the 3D rendition and that's a point I want to make as far

**7:24:39** · as electrical connectivity we we've got things electrically logically connected to the panel in previous episodes do we need to electrically connect it to a meter and electrically connect it to a Transformer well in this case we don't need to because all of those devices will have the same load on them that the panel already does so we don't need to do it for load calcul purposes we are just going to be doing it for location purposes you know what size will we have we would typically have by the utility for this for a house you know it may be down 15 or 25 or

**7:25:11** · you know 50 something like that small we're going to put the smallest Transformer we can find just again for for a little 3D representation and here it is I don't know if that's the front or the back we're going to put it up in this corner here near the street like right here and let's look at our 3D view to see what this guy looks like 3D view exterior down here there we go 3D exterior that's it we look up here and why can't we see anything well where did we put it remember we were on level

**7:25:49** · one and we installed it at 0t so it's underground there it is because what's nice is if you click on it here and then jump to another plan it will stay highlighted and will help you find it so it's buried underneath the ground and if we go to a different view like a wireframe then there it is so we need to bring it up to the level of the

**7:26:17** · ground what level is the ground at well one thing you can do under annotate is you can go to a spot elevation and it should tell you the elevation of that surface now this is an actual If You tab over this this is an actual topography called material grass but it has a dimension associated with it it's actually a 3D element so if you use spot not coordinate spot elevation you can get an idea where this is and we're up at 11 ft 6 so let's move our Transformer up to 11 ft space 6 is 11

**7:26:56** · ft 6 and apply and that pop it up there now let's see how it looks with a non wireframe let's go to even shaded so there we go now those two looks like the two doors of a transformer so we want to turn this thing around if you hit spacebar it'll start rotating it we may want it at a certain

**7:27:17** · angle so when you're in when you're installing it let me right click and go to create similar when you're installing it if you hold it over an an angled line and hit space it will try to align with that existing line so that's one trick you can get things angled the other way is

**7:27:37** · you can actually click on device hit the rotate and then start using the rotate but I like to try to align it if I already have something in my in my model I like to try to align it with with that so let's delete this one and is this one also the yeah it came at the same height so we'll put that there and that's what it looks like now it's a little bit buried we may have to raise it up and it's going to be on a pad so let's get this up a little bit higher let's go to 12 and apply takes a second there we go and even 12 seems a little

**7:28:13** · low and so we'll go a little bit higher 126 and we'll go one more let's go to 13 and again we're not going to draw the pad we're not going to

**7:28:32** · get that crazy we'll let the uh Architects and civil engineers you know draw a pad for us but that's a good representation of that Transformer sitting out near the street now we need to get a meter and I'm going to say the meter's mounted pretty much at the top of this little wall now what do we have for a meter again we don't need an electrical connected meter we're not connecting it electrically so what can we use for a meter so what we'll do is we'll just bring in a custom

**7:29:04** · family that I've already created that we use in our own projects for this one and I'll link up above to how you can create some of these custom families there and some of these are pretty basic so they're mainly just one one or two extrusions 3D extrusions with an electrical connector in some places and we're not even using the electrical connector for this meter you could also put a panel board in here and repurpose it to be a meter there's a few things you can do you can just bring in a 3D box so what I have is a meter let me go down here and get it it's down here under

**7:29:40** · electrical equipment and it's called ER meter base so if I drag that in there it is and it's the top view of a meter and the red is a clearance zone for a safe working zone so this is just free

**7:29:58** · floating it's not h poed to anything I can place it anywhere I want right now it's looks like it wants to go in at 13 ft which is probably close to what I want for my wall here so what I can do is hover it over the wall like this and then hit the space bar and it will rotate to match what's underneath which is nice now I don't want this on the face of this curve because it's low I want it

**7:30:22** · on top of the curb but I maybe want the meter overhanging so I'll do something like this and I'm going to turn off the clearance line in this case since I'm outside I'm not worried about it getting tight clearances in here now let's take a look at this I'm going to draw a little section right here so we can see the height of this thing and right here and let's use our

**7:30:48** · section view template and we can see that it's down in the concrete a bit it's just a box with a little meter sticking out very simple now we can just nudge this up I'm hitting the arrow key the up Arrow key we'll just nudge it up an inch or two at a time and we can do that and then I can move it to the left just to hair to be at the same face and I'll nudge it back down now

**7:31:14** · in Realties you would have to build maybe some kind of a post behind it things like that I'm not going that detailed in my model right now if I was to actually show a detail of this and show an installer how to mount it I might I might do that but in this case again I'm being diagrammatic I just want to show the intent so actually because I'm going to have conduit coming up through this concrete to make it buildable I'm going to pull this back a little bit and give us some room so that is our meter installation and we can tag it if we give it

**7:31:52** · a name because it's an electrical equipment it actually has room for a panel name and we will just type in meter base now meter's fine in this case and then use my tag by category to get this guy tagged and I'm going to use a leader tagged and I already have an arrow assigned if you don't see an arrow you can click on you can click on your tag edit type and then here leader Arrowhead you have a choice of of arrows and sometimes it comes in with none I like the little filled thin

**7:32:25** · arrow and I'll put this here that section line actually won't be there in the final printed product so now we have our meter and we can continue on with the rest of our site electrical work so we've got our Transformer and up here let's give that panel name any piece of equipment they just call a panel name and we'll call it Transformer apply that and let's go ahead and tag that as well

**7:33:04** · and we can give it a little shoulder up there so we have a Transformer meter and then we have our panel P1 down here again which is obscured this is probably the time where we can deal with our filter to control visibility of our site first of all there's a couple different ways we can deal with visibility and one common way and I have some older videos that show this is to use the work sets that are associated with with a workshared project in those you would go up to

**7:33:33** · your collaborate Tab and under here you see work sets and work sets are just a way that Revit groups things into separate groups other than the categories that we usually use and so that things can be turned on and off visibly and kind of almost like it helps the performance of a model but also it because multiple people are using it different users will check out

**7:33:58** · different work sets to be editable and the other people can't change something that you've checked out but you can create additional work sets it already it gives you two work sets to begin with but you can create additional work sets and then you can use those for visibility if you want to turn things on and off now there's arguments out there all over the place about which way to go work sets or not again we used to use work sets they kind of are cumbersome because every every

**7:34:24** · piece of the model you put in has to be put on the proper work set and this gets back into the cad days of of layering when things weren't on the proper layers one nice benefit of Revit I think is that it automatically categorizes what you put in so that every receptacle you throw in is in the same category as electrical devices or electrical fixtures anyway so that being said we're going to use filters for this one and filters take a little bit of getting used to because it's kind of almost a reverse logic and I'll show you what I mean so the the general idea is we are going to create a

**7:34:59** · filter for this view that controls what shows up and what doesn't in certain categories and that filter is going to relate to some parameter that's in the device so for example let's just create a basic filter the filter is going to further separate the categories into subcategories so I can just turn the electrical equipment off with my visibility Graphics override if I just turn

**7:35:31** · electrical equipment off it turns it off and if I turn electrical fixtures off then I won't see all these receptacles so there problem is I do want some of these to show so how do I decide which one show which ones don't when everything is in one category we need to apply a parameter to each in this case let's apply a parameter to the fewer items that I want to show I only have a few items

**7:35:59** · the site that I want to show so I'm going to apply a parameter to those so let's undo those two visibilities so I can get to it and so let's look at the fil how the filter works so again in here one tab we haven't really looked at is this filter tab so every view

**7:36:17** · has not only model and annotation control links and work sets you can also hit filters now in here there's already some filters set up for this view out of the box and they have some it looks like it's for plumbing they have domestic sanitary vent well we can remove all of these because we are not worried about Plumbing in this project so what this does is

**7:36:43** · you can put a name of a filter and you enable it and visibility and all these different things you can override we're going to add a filter but what do we have for filters these are names General lighting general power we have some filters pre-made we need to make our own filter for the site so down here we need to do add a new filter and we can call it something so right here

**7:37:08** · we go down to new create a new and we're going to call it site and we know it's electrical because we have an electrical model so we'll just say site now we need to define the rules select one of our categories to be included in the filter so I'm going to include electrical equipment and the

**7:37:32** · electrical fixtures that I want to control so I have those two checked and then it says all the selected which means all of these selected there's an and Rule and rules must be true you you have different kinds of logic you can do an and logic or or logic so I'm going to do an and so you'll see what I'm doing here all selected now this gives me a chance to which parameter within the

**7:37:59** · these families do I want to check well it say a number of different ones there's none of them that are called filter not so I need to what I need to do is repurpose one of these parameters that are within my families to check now I could go keynote what I've decided to do is I never really use model if I'm going to put a note even on a light fixture I may put it under manufacturer but I don't usually put model using that now you can use some some of these others but I like to use model

**7:38:30** · and so model and then I can set up the rules if it does not equal site and I'm going to put the word site and say okay so I created a filter but now I need

**7:38:47** · to apply it to this view so now I need to add select a filter select my site okay now I have the site filter applied to this view site plan electrical and eventually a view template so I'm enabling the filter this let you easily uncheck them without deleting them and the visibility so what do you have to do is look at the logic of this now my rule is if it does not equal site then right now it is visible so the logic is none of these say site so it's visible what

**7:39:19** · I'm going to want it to be is if it doesn't say site I want it invisible so if I click okay now you can see that it turned off everything because none of them have the parameter set to site let's turn this back on and once you do this a few times it'll start to make sense so now if it doesn't say site it's still going to be visible I go into each piece that I want to show on my site and again there's fewer pieces on the site than in the building so under Transformer go to

**7:39:49** · my type and down here we'll find this model I'm using this parameter to be my filter control and I put site apply site okay okay and then I want to do the same thing to my meter go to its model parameter and now I can drop down and find it and I can have I can add more words to this so if I want it filtered different ways and then one more thing I want to show up on my site is this little panel and put site under model apply it okay now these should stay showing up because they're in

**7:40:28** · the architectural link if they're not then we'll have to go and turn them back on in the link now let's apply our filter properly if it doesn't say site we want it off and now we have our panel showing and our meter and our Transformer we don't have these showing so now that means we need to go

**7:40:51** · back to our Revit link and actually don't go by host we're going to go custom and we want the custom here also like we've done in the other videos and we want to turn on electrical equipment electrical fixtures so we have those turned on but what we also need to pay attention to is under Basics that filter will apply to this linked model unless we CU right here view filters

**7:41:21** · are by host view we want no view filters in the architectural Link in this case so okay and there therefore our stuff shows up that's in our link we said don't apply our filter to it so again have to think about the logic of this but after you do it a few times it will make sense so now we have the pieces we want to show now the rest of these items we don't want to show we don't want to show a bunch of Plumbing fixtures so we can actually just turn these off by category in that Revit link so go to custom and let's just turn off the plumbing

**7:41:59** · turn off the plumbing fixtures there we go so now we simply have the roof plan we have our electrical devices showing we have a crop region that we can we can change around we can bring this crop in a little bit so we don't need to see the whole world and that will fit on our sheet a little better and then we can move these we can move these elevation views out of the crop so they don't show up as well this guy is persistent get him way out here there we go okay now we've got that set up let's

**7:42:41** · go ahead and get the connection the disconnect for this solar connection we're going to say that it's all a separate system and it comes down to a disconnect which is mounted on this wall so we'd already loaded this disconnect we can go ahead and use that disconnect is an electrical equipment now one thing we have to be careful of is that we need to make sure that it is set up for the site so this disconnect we are going to make sure that it has

**7:43:09** · site and we can bring that in and mount it to that wall and it says it's not on the host face it's probably a height issue we can draw a section and see what it looks like and use our section as an elevation and what we need to do is make sure that that section it was not looking far enough get it past this wall now we can see this and the wall is very short in this instance take a look at

**7:43:50** · this yeah see so that's a very very short wall so we may want this disconnect on the other side of the wall in this area here so let's do this and to move it to a new wall I can't just move it because it's hosted a hosted device can only slide along the wall I can't move it unless I hit pick new so I'm picking a new work plane or a new host and I can put that let's say we'll put that over here and that will look we change our view to look at this other angle and we

**7:44:33** · can't see it around the building so we can hold can hold shift and Center Mouse button and we can orbit and there's our disconnect switch so that seems like a more appropriate place for it so now we can start modeling some conduits I have a whole video about how to model conduit

**7:44:54** · that I'll link above we need to put in some sections so we can do this horizontally we'll start at plan View and we can start by giving some vertical Heights so this guy we know okay so we're all relative to level one so this guy we know is up at 4 feet and we want to go below grade so we're going to go what's the spot elevation of this floor we're at it's it's ohus one it's 2T below level one anyway so we need to be down

**7:45:29** · two feet plus another three feet of cover so we need to be 5 feet below so let's go ahead and go to our system and go to conduit up here conduit now over here we can pick what level it's at and

**7:45:45** · down here we pick what trade size diameter and we're just going to be using rigid non-metallic so like like a PVC Schedule 40 and that's fine for this we're just going to be showing a conduit a pipe and so the material itself doesn't really matter for our purposes now electrical contractors that have detailers will get into specifics of exactly which which kind of conduit is it and exactly which fitting so we're just going to draw a basic elbowed kind of conduit

**7:46:17** · to show design intent for space planning so we're going to say that this little solar only needs an inch and a half conduit you would B based upon the design you got from your solar installer let's say they told us we need an inch and a half and we want to go the top elevation is going to be minus5 5T below level one which puts us 3T below this conrete so there now we can start

**7:46:48** · now if I click right on the on on the device it's going to try to connect it and I don't typically connect conduits to the device because it it makes it hard to change later and I showed that in that video so I'm just going to get close like right there and then and then I'm going to start drawing it now as I draw I notice I cannot see what I'm drawing well we have another visibility issue we're 5T below level one so we need to adjust our view range as

**7:47:22** · you recall the bottom was at level one with zero offset and then the view depth down below level one is set there's no view depth below so we need to get see below the view depth so I'm going to go associate level and I'm just going to go so I'm at least 10t deep I can see 10 ft below so let's try that conduit again conduit it remembers what I did before let's get close and now I still can't

**7:47:49** · see the conduit so there's some other visibility issues do we even have conduit turned on in this plan let's go look at this and there we go our El elal site plan does not have conduits and conduit fittings turned on so turn those on and let's try it yet again on to it we have everything selected still go from here close to this disconnect and now we see a line now we can draw a conduit over

**7:48:18** · to our panel now if we had structural drawings we would see footings and things like that that we need to dodge we don't have all that information but we can assume with these walls there'll be footings so we may go down this way and then come into the panel this way we're going to do that go

**7:48:38** · here and then come in and again I don't want to attach if I attach to the panel then it's going to give me see how it shows up here on this little diagram here I'm at the top of the panel and now I can move where in the panel am I going to connect you can do all that but it connects it all as a a network you call it or a chain so that if I move move one thing that all moves together and I like independent control so I'm not going to connect it to the panel I am just going to right click draw conduit I can continue my conduit if I already have a piece done I

**7:49:14** · can right click on this connector and say draw conduit I don't want create similar because that would just create a separate conduit I actually want to hit draw a conduit it and then pull it down and get close to my panel without touching it and you'll see why there so let's see if we're good with elevations now what you see typically is this green circle and that's showing the end of the

**7:49:45** · you know the circular end of my conduit so I want to make sure these views I'm working on are set up for a fine view which actually th shows the 3D size of the conduit and even that sight plan I

**7:50:02** · need it to be a detail level fine and you can see it even changed the solar panels how they look but now I can see my three-dimensional conduit a center line and then two walls of the pipe to connect this I need to bend it up and into this disconnect well I can't do it from this view I need to do it from a perpendicular view so let's do another section right here and you'll be doing a lot of sections when you do conduit a little section here and instead of having to

**7:50:34** · redo all these settings I'm going to create a section view based on this a section View and I can change whatever scale I want but I'm going to create a section view template so where am I I'm up here in section 10 I'm going to right click this I'm going to say create a view template from this view enter a name I'm going to give the ER and we will call this section distribution I do distribution because that means I'm drawing conduit and

**7:51:10** · such so it'll be a extra fine view and there we go I'm at and then I want to apply it to this view I already have an elevation let's do a section now when I create these other sections I can simply go to my view template go to section and it pops everything in the way I want it there's my 3D now I noticed the crop line is not helpful so I need to get this crop line fixed now there's things I can't see there we go so I

**7:51:43** · bring it down and now I can see things now I can move my levels out of the way Click On My Level and move it out of the way now I have the levels from the architectural link showing so I can turn those off in here and I do that with Revit links custom The annotation custom and I can turn their levels off and that way my levels show and I can move them around okay again that's the joy of having a view template for this section

**7:52:22** · there's my little disconnect where's my conduit I need to go down a little deeper still can't see my conduit well let's take a look at our site plan see what's going on okay my section I drew I actually Drew on this side of a wall so I went a little too far away let's go on there now let's see what happens

**7:53:08** · take a look again click on this well it looks like I ended up mounting this up at 9 ft somewhere in here when I was going back and forth it lost my height so I can simply make this back to minus5 Ft and because it's all connected it should move move the whole piece let's see if this

**7:53:31** · one got moved minus 5 yes so it moved the whole piece that's connected now that's another reason I don't want to connect to my panel if I did that it would have lowered my panel 5 ft too so that's why I don't connect them so let's take a look at this section again and here we go here's our conduit showing up and it is kind of another slab here so I'm going to go even lower and let's and I can just actually take this and drag it down and we're down around 7 ft I want to take this conduit

**7:54:07** · and turn it up into this disconnect switch so I can click on it right click draw a conduit and I can turn it up I'm not right under it but I'm I'm close I'll go here and I missed it once I draw it

**7:54:26** · I can change its angle angle like that and then if I just grab this piece of conduit I can slide it around now and get it underneath this now we have pretty thick walls because of this scale now if I if I was to change the scale of this and get it to more like a quarter inch to the foot scale which would be or an 8 in or/ qu inch to be a more typical section in detail so there we go so

**7:54:58** · I like my section that kind of scale and I can again I can get it close you know actual mounting they may have unist strut or something on here but for now we're just going to strap it to the to the wall we're not getting that detailed on this and then again if I pull this up here it'll connect it but so what I do is I click on it and just use the Align tool if you just align it to the end it doesn't physically connect it and you don't have that issue this

**7:55:25** · is just a section for a working Section I'm not going to be dragging this onto a sheet but there we go we can see our conduit coming up into our disconnect this is helpful just to make sure everything's aligned properly so back to our site plan now we want to take a look at another section and we want to bend this one up into the panel so we need a section that's parallel with the conduit if you will so I guess yeah so it's a parallel to the conduit we can just move this guy and use this section again it's just a constructibility section

**7:55:59** · and here's our conduit it looks like we're still good we're underneath this lower slab or foundation so we're going to bend this straight up into this panel so the same thing click on it right click draw a conduit get it up vertically get close and then I'm going to pull this over to the panel and use my align tool line it to the bottom

**7:56:29** · and there we have that drawn and we can't see it in this view because it's all hidden but now we have that shown and on the site plan you'll be able to see that conduit

**7:56:45** · run so it will give other trades gives the electrician an idea that we need to go from here to here and it gives other trades the idea now this is not electrically connected it is just a 3D representation of a Raceway system we don't need to electrically connect the solar

**7:57:07** · panel because they're actually a source it's just a representation so now we can do the same thing with our Transformer this is I think we figured out a 200 amp service so you know it might be a 2 and A2 or 3 in something like that for pulling reasons so we're going to go ahead and do a 3-in conduit from the Transformer to the meter and then from the meter into the panel so let's

**7:57:31** · start out of the Transformer now let's again figure out what height are we dealing with a lot of sites will be pretty flat but others like this one are not so we need to have an idea where we're at it's not seen our surface from this view so we may have to go to 3D view to get that elevation I think we kind of knew where this was already we're at 13 ft so we can go about 3 ft below this and work our way over to our me meter which is right here so we are going

**7:58:02** · to start a conduit draw a direct line underneath all of this slab to our meter so on the site plan let's start drawing our conduit hit the systems conduit we're going to go with 3 in in this

**7:58:20** · situation you can pick them from the drop down and then our upper top is going to be we're 13 minus 3 we're going to be at 10 ft if you want to get really picky on a Transformer looking at the face the primary comes in on the left looking at the face and it leaves the right so we would leave somewhere under this section of the Transformer and that's I mean a point to to be made is that when you're doing any conduit work you really have to get a little more into

**7:58:51** · how conduits attached to things so it takes kind of an installer's perspective to do conduit runs if you want it to be somewhat realistic and you know not look like you're just making things up so you may have to look at some photos look at the cut sheet for this Transformer look at installation manuals for these things so you can have an idea where conduits can and cannot come in so from here we're not going to connect it to the Transformer we're going to get close here and then down to again get close to the meter without going in it and then we will

**7:59:28** · draw our sections and I want it parallel with this conduit so I'm going to do it as parallel to that conduit as I can so that I can turn it up into the Transformer get our section and move our crop so here we go and we're going to go this is the doors we're going to go up into this section

**7:59:59** · so draw a conduit continue it over and go up into the section and we can now it because we're not exactly parallel it thinks we're putting a Bend so if you look here it kind of is putting a little bit of an elbow in that so we need to undo that and just drag the conduit where we want and then we will continue up and again get close and finish it with an align

**8:00:37** · check our plan view so we're a little bit too far this crosses the end of the conduit we're going to pull it back a little bit let's go back a little bit and I go back and forth between plan and section that is good enough for us and then down here at the meter we want the same kind of section so just move this guy down and we'll get this over here continue it to underneath the meter right click draw a conduit and bring it up near the bottom of it and extend a line

**8:01:10** · like that check our FL and that comes in right there and again that that works out well for us so that's that conduit now let's take a look at actually the depth of this conduit and make sure we're okay the full length so extend this section and we have to extend this section view rectangle as well and take a look at the whole route now as we can see we did not go deep enough for this

**8:01:40** · slab so now we can simply pull this down and get it down underneath the slab and it doesn't have to be too deep it can be pretty close to the slab so now we are fine with our depth and it'll be even more important on this next route when we come way under the building to get up into this

**8:02:01** · panel now some might say let's try and just run it underneath this bridge and then down in but we have un it's called unprotected service conductors there's no main breaker out here at this meter so there's no overcurrent protection no fuses no breaker circuit breaker to protect this line coming in from the transformer into our panel because the panel has the main circuit breaker so codewise this is called unprotected service conductor it has to be outside of the building

**8:02:33** · and once we come to here under that bridge how would we get we could then go down underground and come up so we could do that but I really like to have this unprotected service get buried out of the way so people can't even get close to it so let's go ahead and take this down to this area

**8:02:56** · the same conduit I can right click and say create similar it's still a 3in conduit I'll keep it the same depth that it is right now so I'll take it from this other side of the meter and let's go down towards our panel and can I do a straight shot I pretty much can look at that so we'll get close to that panel right there and then let's get our sections parallel to the conduit

**8:03:30** · and see what we have go to our section you can see why we have this view template for a section it makes it very fast to develop a section and again we can extend that further for now let's get this guy up it's going to be pretty much in line with this one and draw a conduit up now it may try to attach to this other conduit so we have to be

**8:03:57** · a little tricky we're okay there sometimes you have to play games with what's visible what's not get different angles of your section looks like we're okay there and then let's extend this section we can just extend it here rather than in plan view okay so here we go this is where we have to dive down and get underneath this slab now let's see what's below that slab

**8:04:28** · so we have to get way down below this slab to get it up into our panel like we did this other conduit so how can we do that well we can take this guy and can we turn it like this and make that work let's see it did it let us it bent the elbow along with us so it uh provided the elbow and the bend just like we need so now we can bring this another Bend and go

**8:05:01** · horizontally now sometimes if you're going to interrupt a conduit you already have you don't want to touch it because it'll try to connect it I will tend to go a little bit further or keep it a little bit shorter so they don't interrupt and I can always back it off so I can get my Bend in here and not be directly under the panel and then I can move it to where I want it to be right there check out this and looks like we're good to go and to document this I would

**8:05:41** · put some notes on these conduits and refer them back to our oneline diagram which we will eventually continue to add to so we can just go with some text and just say I use ug for underground in this could be in your symbol list when we create that Underground Service lateral and I'm not going to put a size on this because that will be sized on my oneline diagram

**8:06:13** · now for this kind of tag and leader we can leave it as an arrow but you can also go over here and you can create another type of tag it's a type parameter so if I was what I'm getting is I want to put a loop around this instead of just an arrow if I just change this to a loop all of the type 33 seconds Arrow will have a loop so I need a separate type that is a loop so just like anything else I can take this and edit my own type duplicate it

**8:06:43** · and then I can put afterwards I can put Loop to show that it's a different style and instead of a leader Arrow Head I can go with a DOT or an open I can do a loop what's a E8 inch Loop do for us it does a loop now that's a little big I may just go with the 16inch loop down here let's go to the 16inch loop there and that way that's another kind of a

**8:07:15** · tag and and leader is a loop for going around a line or around a conduit and we also have the same thing here so I can actually just I can do create similar I can actually click on this note and actually copy it down to here and then I can rearrange my Loop to hit that

**8:07:39** · and then over here I can label this this is more like a feeder so I can say underground feeder but put the notes that you would normally put in your project your company your firm may have a method that you want to use so let's go down to Loop and just change it again it's another type that we can easily change to and this guy here we will call the

**8:08:10** · solar disconnect we're going to say AC just so it's obvious that we're not talking about the DC side of things

**8:08:31** · all right so there we have most of our site plan done the one last piece I'd like to put on this site plan is actually a light a pole mounted light up here at this parking area to help illuminate that we already have a light on the wall over here but this light will be out here and on the site plan I want to put it here roughly beside this meter it'll be in its own Foundation out here so we need to find a pole mounted light well like uh we're trying to

**8:09:02** · do on this one we're going to use some built-in out of the box Revit families so let's go up to our insert and see what we have for lighting exterior so we need to go to all results and we're not just electrical this time we are actually lighting click on the lighting tab we do not want architectural we want me and we actually want external or exterior and we

**8:09:25** · have a street light antique and a street light standard let's bring both of these in just so we can see what they are the rest of these are other kinds of Lights we don't need a Ballard in this case which is just a short pole so let's do that and let's see what we have for lighting now we also want to make sure we have lighting turned on in this site plan Escape out of here and we don't have a view template yet so let's make sure we have lighting turned on

**8:09:59** · we do not so lighting fixtures and devices let's turn those on in this view now what's that going to do like it did with our power it's going to show up here so we need to apply another filter to only have sight lighting showing so after we get our light in here we will do that so let's go ahead and look at these lights so we can close the the whole electrical equipment and fixtures

**8:10:27** · folders and let's go down to lighting fixtures and we have down lights all of our fixtures are here we can close those so they're not making us scroll too much and let's see here's our street light antique so of course these are all the old hallogen and sodium type of things it doesn't

**8:10:52** · matter we can change those but let's bring one in and see what it looks like and we'll put it right here and then let's get in our 3D view because this is another instance where we want the 3D look so we installed down a level one and we need to raise that up but if we click on the light we look over here there is no place to put a height in fact it's hosted to level one and that's gray out so this acts like a floor hosted family so if I go to my section and make sure yes so make make

**8:11:27** · sure I can see this light go to this section double click you can see it hosted down here to this level one I can't lift it I can only move it along here so again um you know that's one of the problems with some of this built-in content is it's not really set up for maybe the way we'd like to use it so we're going to have to mount this to a different level now we can use this level here which is level two and this little they're not showing the full Foundation the full Foundation

**8:12:03** · would go down below grade but that's okay we could do that and maybe get close but we really need a level and let's make sure our section is as close to this light we're going to actually put this light over here and get this as close as we can so we can make sure what level we're at and this won't stick above level two I may have to draw my own level and in this case

**8:12:29** · because this is level hosted we will do that let's right click on this level this is what we have to go through to deal with this kind of hosted fixture and let's put our level like right here and remember levels aren't just floors they are any level within any elevation within your

**8:12:54** · project for any purpose so we do this and we want to move it up to Mechanical 4 and that should pop it up there there we go and look at our 3D exterior that looks more like what we're looking for so we're going to go with that one the other light if we take a look at it it is

**8:13:15** · we'll put one right here to look at it it is more of you know a 30 or 40 foot parking light let's see what it has for height yeah it's a 25 ft height it's a little overkill for our residential purpose and even if this isn't the best looking light it's a little more residential look to me so we will use that guy there and then this will need a type so let's go back to our from

**8:13:44** · our previous episodes we created a fixture schedule lighting fixture schedule a start of it so we will see that we can go with an l12 we went L1 through l11 Let's do an L2 12 for this fixture so let's edit the type and if you need to see how we did all that go back to previous episodes and you'll see how we created this start of a lighting fixture schedule we will call this l12 and we'll look at the cut sheet and say that it ends up being a 15 watt ends

**8:14:23** · up being a 100 watt LED fixture and type Mark so it displays the tag properly it'll be l12 and our description is post top area Luminaire something like that we can tag it we do not need a leader

**8:14:47** · l12 now the only thing we're going to see is is that symbol right there which is not very dark again if I was doing this on my own custom family I would have an actual symbol that has maybe some

**8:15:03** · uh more line work to it that's more bold but it's what we get for now and then we want to Circuit that up to our panel now we don't need to draw a conduit for this one because it is just a small it's probably a 3/4 inch conduit I don't typically model anything smaller than like an inch and a half we just don't need that level of detail here so let's just do an actual circuit so power this to our only panel P1 now what voltage is this at we didn't check I think it's just 120 volt

**8:15:35** · oh yeah it it was a 120 volt when we brought it in so we'll leave it there if you're going a long ways you may need a 240 volt light but we're close enough for the 120 should work again this is residential so that should be fine and we'll call this lights and we'll call it parking the parking area apply that that and let's get a home run and that didn't work try it again Arc wire now why didn't the wire work let's see if we have wire turned on in this view another

**8:16:14** · visibility thing which again you run into a lot of times wires are turned off there we go and it only did one I me I hit wire twice but if it's already connected Revit knows that it's already connected and won't do another one so let's get that over here again this have to remember this section won't be there and hit a tag for this home run going into circuit 26 and again it's

**8:16:47** · close enough revit's not great at voltage drop calculations and there's a whole there's a bunch of videos out there on on YouTube that explain why for one single fixture it may be appropriate but

**8:17:03** · when you have a whole line of fixtures it figures the all the load at the furthest away element and it just really screws up a voltage drop Cal but for one single fixture we can use it so take a look at click on this and go over to the wire size and it still puts it at number 12 if we tab

**8:17:24** · over the circuit to actually light the circuit and click click on it now we can see some more circuit data and you'll get actual voltage drop which is25 volts now it we actually want that as a percent and if we go into the options you can see that we set it up for any branch circuit we will allow up to a 3% voltage drop before it upsizes so it did not upssize for us 025 volts is of 120 or nominal voltage is only a 2% drop so we are fine it's a very small load it's only

**8:18:03** · 100 Watts so anyway voltage drop is done but you have to be careful how you apply it for a single piece it's not so bad now the last thing we want to do is get these the rest of the interior lights off and we need to apply a filter we can use our sight filter if we put like we did on the rest of the ccal on the rest of the power stuff we added that parameter in here under model we used site

**8:18:36** · and let's see we don't have that into a light fixture yet so we will add it so we added site but now we need to fix our filter go edit our filter right here and we have one called site

**8:18:53** · we want to edit this filter and we we only had electrical equipment and fixtures now we need to add lighting we can keep adding and we don't have devices out here but we'll do it anyway we can add that to our filter so now it filters out also lighting so you can see how clean that works once you get used to filters it's very convenient and it they really work well and a benefit is you can have multiple filters so that's my plug for filters and that should complete our site

**8:19:28** · plan for now until we'll drag this onto a sheet eventually when we create sheets and we'll add a North arrow and title and all of that but for now this is the site plan welcome to episode 10 the last episode in this full projects residential Series in this feature packed episode we're going

### Episode 10 - Create PDFs

**8:19:48** · to review another method of setting up that site plan that we created and getting it rotated we're also going to finish up our lighting schedule and show how we can repurpose some of the parameters that are built into Revit to put into our schedule versus creating shared parameters we're going to add some text notes to our plans we're going to create a symbol list symbol Legend we're going

**8:20:09** · to finish that panel schedule and we're going to finish the on line diagram and just do some general buttoning up of the project and then we're going to finally create sheets fill in the title block and then we're going to print or extract to a PDF so lots to come let's get into it

**8:20:28** · I wanted to address a comment that I had from one of the viewers and it was a great point that many times the architectural model is set up such that there is two different North you have a project North which is what we use for the floor plans such that it's a madeup North so that we can

**8:20:49** · draw the plan with horizontal and vertical lines without having some crazy angle in there like you would see on the site plan so as you recall in that architectural site plan we have the building at an angle from this North Arrow which is true north so true north is up on this page and the

**8:21:13** · building is slanted and in the previous video to create our site plan I showed a method of bringing this PDF into our model and acquiring with just lines and angles what angle this is tilted at and setting things up that way but like the viewer pointed out if the architectural model is set up properly we can acquire that angle directly from the architectural model and set our

**8:21:39** · site plan up for that without having to go through this PDF scenario so for example we go back to the site plan and to bring that true north value again which is set up behind the scenes it's set up by the architect in their model and it's set up with survey points things like that that I'm not going to get into in this video but they set that all up for you so you can just acquire that point through Revit so if we go up to the manage tab there's a little button over here called

**8:22:09** · coordinates and it says it manages coordinates for Linked models which is what we have we have a linked architectural model so if you click on this dropdown you will get to a number of different things you can do you can acquire some coordinates from a model you can publish things you can reset all these things we want to acquire coordinates from the architectural model so that our model will match so we go to acquire coordinates and then at the bottom left it says select a linked project from which to acquire shared coordinate system so we

**8:22:44** · want to acquire from this linked architectural model so hover over it so that it highlights like that and here's our linked architectural model click it and it says here coordinates acquired from the RAC basic sample project which is our architectural model and so it acquired the coordinates that quickly from our model so now how do we deal with this well let's just to show you the contrast go back to the first floor plan one thing we haven't talked about within our view template or if you don't have a template it would just be up here is the

**8:23:20** · coordinate system that it's using if you go down here you'll see orientation this this line right here which is included in this template project North you can see that there's project North or True North well the floor plans are set up by default as project North and that makes them

**8:23:42** · vertical and horizontal so our site plan right now if we go to our view template for the site plan it is also orientation project North now that we have acquired coordinates from the textual model we can just change this to True North and that will instantly right there Orient our plan to be relative to True North so that true north is vertical which tilts the building this

**8:24:12** · ends up being the same thing we did by manually rotating our view and I really want to show you in that video how to rotate a view if for other reasons if you need to but this is actually the the best workflow to accurately set up your site plan such that it is properly oriented so I just

**8:24:29** · wanted to cover that and show you this is the actual best method for moving forward we also need to finish up our lighting fixture schedule that we started so if you recall over here under schedules we have a lighting fixture schedule and first of all if there's a schedule that I'm going to drag onto a sheet uh a sheet view that I'm actually going to use in production I like to make it all capital so I just go through and change to lighting fixture schedule

**8:24:56** · simple as that and double click that to open it this is our schedule and we can hold down the control key and mouse scroll to enlarge it if you want to see it that's better for the video so this was our lighting fixture schedule and we simply went L1 through l12 and we have some placeholders

**8:25:17** · for lumens we have some basic descriptions now depending on your company standards you may have other columns you would like to put in here now we typically include more than this we also include things like the housing construction and the Optics what kind of lensing is there what

**8:25:36** · kind of distribution pattern is there and then we also include things like what type of driver is it is it a standard driver or is it maybe a dimmable driver remote driver things like that so you can add more columns that's the easy part now the tricky part is what parameters will you use for those columns we only have so many parameters in our lighting fixture families that we mostly brought in from revit's out of the box Library so let us review our lighting plan first lighting and

**8:26:10** · let's take a look at one of our lights now we can also get to these lights down here in our project browser under lighting fixtures and as you recall we made our own lights and gave them our own names like l12 so if we double click l12 look at it type properties and type parameters we have a number of parameters under identity data we used model to help filter our

**8:26:40** · site light fixtures so that's already used now we can use manufacturer and that maybe this is appropriate for housing but we won't find a housing we won't find a driver we won't find you know a notes parameter built in now an advanced topic would be to create some shared parameters

**8:27:00** · in each of these lighting families that we can then schedule again that's more advanced and that takes family editing which eventually you need to get into but for now as a beginner lesson we are just going to what I call repurpose some of these built-in parameters and use them for whatever

**8:27:20** · we want I have a whole video on doing this which I'll point to up above in that link up there but I'm going to show you the basics of how you can from a beginner's perspective we can just use some of these parameters to do other things so for example let me go back to my schedule if you recall the way we deal with a schedule and add more columns these are called Fields so we go over here to fields and hit edit and here we already have the fields that we're using typ Mark lumens load and description as you see up here let's bring in the manufacturer

**8:27:58** · parameter and say okay and it adds it now we don't have to leave this as manufacturer we can change this to whatever we want so we can call this something like housing that's just a heading and then we can type in here whatever we want so again we are under the basis that we

**8:28:17** · have a lighting designer um that has given us the lighting design and given us fixture cut sheets that describe these light fixtures and so we just kind of want to reproduce that so let's say this this L1 the suspended linear is just a extruded aluminum housing and we

**8:28:37** · might give Dimensions now when I hit enter it lets me know that this change will be applied to all elements of this type L1 since L1 is a type it will apply to all the l1s which is what we want I'm going to shrink this a little bit so extruded alumin housing we go back to

**8:28:57** · the L1 which is a pendant lighting fixture we can open all these up to find it there's L1 if we double click that here's the type properties and parameters now we can see that it filled in extruded aluminum housing into the manufacturer parameter so again we're repurposing that so what are some other parameters that we could possibly use there's some type comments there's a URL cost

**8:29:23** · would be probably a number but we can use some type comments and the URL so let's go to in our schedule we can go to type comments as our Optics and then here we can put in the Optics this and we will just say we'll say that this suspended linear is a 20 up 80 down type of direct

**8:29:57** · indirect so that works that works there and we can stretch these out as we like and then the last thing we can do is add one more for the driver and let's see if we can use this URL repurpose that guy so I'm just going to reuse the URL for my driver comments so down here at URL move this over okay and driver and you can see that this is already in here for some of these so driver

**8:30:37** · we can just say 10% dimming driver 10% dimming so that just gives you an idea I'm not going to fill all these out but you can get the idea that this is how you can create this lighting fixture schedule to have more Fields more columns and repurpose them without having to get into each

**8:30:57** · fixture family and and edit that and create these shared parameters so that's kind of a shortcut beginner method to do this another thing I'd like to cover is if you've done electrical designs before you've often wanted to add some notes to a plan and you can actually just type these notes in and point to them with arrows or you can have a keynote of some type where

**8:31:21** · you have a symbol pointing to this and then the symbol is reflected up somewhere else on the sheet to describe that keynote now Revit does have a built-in Keynotes system that you can learn to use and it relies on an external text file and things like that I think for a beginner and the

**8:31:39** · way I actually still prefer is to just have my own symbol and my own notes without them needing to tie together I find that I'm still able to keep those coordinated without the keynote system so I'm just going to show you the shortcut method and that is either have a symbol a custom symbol which is the way we do it or when you again as a beginner and if you don't want to have to create a custom symbol yet you can just use the simple version that I've seen other Engineers actually still use it just say note one if you say note one and then use the arrow to point to

**8:32:13** · it then this doesn't take a special symbol and you can just type your notes now where are you going to type your notes should we type them here in The View well that's not recommended the best way we found to do this is to either type them directly on the sheet which again I don't recommend as much or create your own notes as a drafting view or what's called a legend now the difference

**8:32:44** · between a drafting view which we have for our oneline diagram if we go here drafting views on line diagram the difference between this drafting View and a legend they are both an annotative type

**8:33:00** · of view but you can only have this drafting view dragged onto one single sheet now for a on line diagram that works fine but for something like a set of notes if you have a project that has repetitive power plans like we may use the same notes on first floor and second floor power plan

**8:33:20** · we can't drag a drafting view onto both of those sheets when we eventually make the sheets so we want to make it a legend so that's the difference a legend will let you place a legend on multiple sheets so let's create a legend you can do it from here or you can go down to view and go to Legend give it a name and I'm going to call this power Keynotes and the scale won't really matter

**8:33:46** · too much and I've created a new Legend now it's empty but I can just start typing and I can say one suspend fixture at 8 ft above finished floor now this abbreviation we will put into

**8:34:04** · a symbol list or symbol Legend So something as simple as that and then you can put a heading up here and you can line these up with that little blue dash and just say something like key notes power and if you want you can have this underlined there's some text options up here bold

**8:34:25** · underlined you can make it bold if you like and that will help that stand out now this Legend we can actually drag onto a sheet when we get into creating our sheets but this is a way that I like to create my key notes or Keynotes rather than just typing them onto the view or onto a sheet

**8:34:48** · because then you can rearrange them and you can use them multiple times so I just want to show you that's how we are going to handle key notes on this project another thing we need to do to finish this up is create a symbol list or a symbol Legend now when you eventually get to the point where you create your own project template or project template file the best practice is to

**8:35:09** · have this symbol Legend in that template or at least in your in your library of details so that you don't have to create it each time but for a beginning project and you're just learning how to do this I'm going to show you how you can create a symbol Legend So let's go to Legends and again review of Legends is we can place this Legend on multiple sheets so sometimes you'll want this Legend on each sheet I prefer to just place it on one sheet personally but some people use it

**8:35:36** · on multiple sheets and some clients require that so I I make it as a legend rather than a drafting view so let's go to new Legend and we will call this symbols now how do we get our symbols onto

**8:35:54** · here so let's see if we can drag in some of our light fixtures to start with and see what happen now bring in L1 and that's promising now hit spacebar I can't rotate it so let me just place it see if I can rotate the symbol because you know along with the L1 3D geometry is an actual two-dimensional symbol so we should be able to deal with this and hit rotate and there's a Center Point start at the right and click vertically and it doesn't rotate h h

**8:36:25** · let's bring in a electrical fixture let's get a standard receptacle in here see what happens there's a receptacle well we get the symbol but we also get the Extrusion and see if I can rotate this one and I cannot rotate it either so just dragging these 3D

**8:36:52** · elements into a drafting view is is not going to work for our symbolist it's an advanced topic but what you can do is you can create custom families that are just the symbol that can be brought into a symbol list now that's something you may want to do but often the easiest way to deal with this is just to draw your symbols with drafting lines and go from there so we can have this as a reference but what we need to do is go to annotate and with detail lines recreate these Sy

**8:37:26** · and for the scale you may want to go to a 1:1 scale 12 inal a foot and you can see here that at that scale it doesn't even show these symbols but this way I can draw them at a at a true paper space size which is typically what a symbolist is so let's go to a circle and

**8:37:48** · I want this about 8 in diameter so I have to really zoom in here and I can do that click on it and then just type in 8 inch there we go and then I can put some medium lines works I can put a line starting at the right starting right at the bottom do something like this I can move this over here and then I can mirror this and create

**8:38:20** · my own Center own own mirror line somewhere in the middle something like that you know and I can adjust these as I want to make it look right so you're really just going to have to go through and kind of draw your own symbols and for the light fixture we can do something like get a rectangle in here and maybe get some dots small

**8:38:48** · circles to show the pendant and there's a certain minimum size that things can be and I think it's like right there and then you can again mirror this Mirror

**8:39:09** · by drawing an axis and the axis it'll kind of snap to the center line so there's a light fixture and just draw all the symbols that you used in your lighting plan and and floor plan and even in your single line diagram we've already drawn symbols by hand because we don't have a oneline diagram package of symbols so we can take this

**8:39:36** · and you can actually contrl C copy this and then go to your symbols and actually paste it inrl V paste and that will come in and it was drawn at you know one: one anyway so at least we can do that and then continue to draw your symbols and then right next to it you can type what they are this can be duplex receptacle and put whatever you would put in your symbol list sometimes for

**8:40:06** · residential here it'll be about 12 in above finished floor or if you're doing commercial it would be more like 18 in things like that so you can just create your own symbolist and give it a title and if you want to bump that up a size click on it go over here and find your quarter in

**8:40:26** · or you can customize this make whatever size you want and then you can draw a simply draw a box around it and you would do this for all of your symbols but basic symbolist is just drafted again you'll want to have something like this in your project template so that you don't have to create it on every project and you can add a symbol or delete symbols as needed so that's how we get the symbolist set up now we need to take a look at our panel schedule we only have the one panel in this Pro project and button that up make sure it's all ready it's pretty close to

**8:41:00** · done we can make sure we have proper circuit description for each of these because if we didn't type a description in when we circuited we could end up with some just miscellaneous name so we also want to check breaker sizes now again in commercial work 20 amp breaker is typically the smallest you see except for small motors where we'll have a 15 but in residential we use a lot of 15 amp Breakers uh to save cost now you can do that here like I mentioned in the beginning

**8:41:29** · of my project Series this is a residential style project but I'm doing it in more of a commercial method just to show those methods so I could just leave these all at 20 amp but I will change a few so that for the standard receptacles we're going to make these just 15 amp so you can go through and this is how you do it you just simply change it here but you

**8:42:00** · can change these values here or even in the floor plan if you hover over something on this circuit and hit tab a couple times you'll get to the electrical circuits the little the little note right there comes up tab tab electrical circuit and then click it and now you've selected the electrical circuit and down here under rating you can adjust it here and we're not showing

**8:42:29** · what frame it is in our panel schedule so we're not so worried about the frame of the breaker these are all the 100 amp frame Breakers but you can change it there I like to change it here so again let's go 15 and just go through and change these how you want and we have our main setup right and instead of 225 let's say that this is just a 200 amp load Center and we do have a main

**8:42:55** · circuit breaker this is a commercial load summary you see down here it's applying commercial demand factors so it comes up with a 157 amps for total estimated demand which is within our 200 amps I show in other videos how I've created a custom load summary for residential calculations which

**8:43:17** · I will also point to up above if you want to look at that further but for this project we're going to leave it as a commercial style panel schedule because that is what most of our work is another thing we need to finish up is our one line or single line diagram that we had started prior and it's up here as a drafting view under coordination so double click on line diagram and this is what we have a very simple diagram for this single panel house so we have the Transformer which

**8:43:46** · we've already labeled this would be the meter so we can start labeling the rest of this and depending on how you do things for your designs you can label these as you want but really this is just done in this drafting view with lines and text and if you have symbols you can use symbols we can line these up like this you can just label these how you want and we can call this meter base and again just label these how you want and you can add leaders up top to your text with the

**8:44:19** · left and right leaders you can get rid of a lader up here with this minus remove leader and just get these things lined up it gives you some little construction lines here the little dashed to make things look pretty let's go ahead and label this as the load Center and again whatever you do in your office let's say what you the way you did things in CAD

**8:44:47** · you can do similar here and it's a simple drafting view I find drafting views and Revit are very easy to deal with if you want to label these service laterals you can do that as well and let's say we want to label this with an actual size and coming from the Transformer to our meter let's say that the utility is going to furnish the conductors we just need to provide a conduit so we will just say 3in conduit only um and then you might put things again whatever you do you might put

**8:45:17** · things like minimum 36 in Berry but whatever you put for a note now on this one we have this Arrow and like we saw on previous episodes we can change this from an arrow to a different kind of symbol

**8:45:33** · so if you click on this and then we can go to a drop down on properties we already created a type of text that has a loop so click on Loop and you'll see you have this little Loop that you can move around and use that for looping around a single line and the way you create that if you

**8:45:55** · missed it in the previous video is you just go to edit type create duplicate it and create your own name called Loop and then under the Arrow Head leader Arro head you can select from the drop-down different kinds of arrow heads boxes diagonals fill dots all kinds of things and this is we we chose Loop so that's how we did that and then here you can label this one but it's a simple diagram

**8:46:25** · it's just simple text with arrows and loops and some symbols but that would complete your on line diagram and we will drag this onto a sheet couple things I wanted to finish up on this first floor power plan are a code issue that has been nagging me since I created this and that

**8:46:44** · is this guy right here that is a big old column right through the middle of the project now I'm not sure what purpose it serves it doesn't appear to be structural let's take a look at a 3D view of this let's go ahead and turn off our selections so we don't select the model and I'm going to just select a box like this and go up to this little view button up here called selection box

**8:47:11** · it isolates the selected elements in the current View and does a little 3D view of that so there it created a little 3D view of the area I surrounded and it gives me this section box now if you can't see this section box and sometimes you can't see it you need to go into the VG graphics and get that turned on so it's actually under annotations go down to the S's and you will find section boxes

**8:47:40** · and it may be turned off so make sure that gets turned on so that you can see this section box and then when you click on the section box you can drag the cut of that section where you want

**8:47:56** · so this is a nice little way to draw a 3D a small 3D section of of an area but I'm doing this just to show this column and here's the top it doesn't even go through the second floor it is purely on

**8:48:13** · the first floor but it's a column and technically if you look at the NC and read those rules you will see that this is counted as a wall just as if I had a square box wall in the middle of my room that is wall space that's greater than 2 ft so I need to get a recepticle on there so let's get a receptacle on this guy and it's just going to be a standard receptacle like this so right click create similar and luckily it is treated like a wall so it lets me host my hosted face

**8:48:47** · hosted receptacle to it so let's see where do we want it the other issue is how many would we need it depends on the linear circumference in this case of this circle well one way to figure that out is hover over it get these back on hover over it and see if we can see the circumference now we

**8:49:13** · don't get the circumference of this over here so what we can do is draw our own Circle and this should snap to the middle draw it out here and get the same size now if we click on this it shows us the length of this line which ends up being the circumference is only 10 ft 3 in so it's less than 12 ft we only need one receptacle on it get rid of this so we will just draw one receptacle create similar and I'm going to put it on this north end of this so that we can use it out here

**8:49:50** · so right there something like that and I want to tie it into this circuit and it would feed most likely you know under underground under the crawl space so tab tab get to the Circuit edit circuit add this guy finish editing and then again tab tab to the Circuit it wants to draw the wiring

**8:50:16** · click on there hit Arc wire and it wants to put the home run here now you can let it do that and get rid of this home run or or you can just say I like the Home Run I have and just delete this that's the way I'll handle that one but it added it to Circuit 16 I just wanted to address that one

**8:50:37** · little issue the other thing I want to address on this is we had already in previous episodes drawn some conduits into this panel and this is how they show up in a plan view I don't really like these giant green circles in my in my drawing couple ways I can deal with this I can just turn turn conduits off on a power plan some power plans you actually want to show conduits you may want to

**8:51:01** · show some Distribution on it other times you may have a separate view a separate plan that shows distribution so you have to make that judgment call I'm going to keep conduits on in here just in case I want to show them somewhere but what I can do is I can change the size of this symbol and this is just simply an up down conduit symbol it's like looking down into the tube of the conduit so if I just go up here to manage and go to my it's an me setting electrical setting down here if I go

**8:51:35** · down to conduit settings it's not here go down to rise drop conduit rise drop annotation size that is what this thing is and it's drawing an E8 in in paper size circle and I don't need it that large

**8:51:55** · so let's pick something like maybe a 302 of an inch I just I mean tiny is fine so that there is not it's not too prominent it's not obscuring the panel I think that's fine again I could totally just delete the conduit from this plan but I'm going to leave it on but that's one way you can deal with those sizes and you don't have to have this giant E8 inch circle another Finishing Touch for this power plan first floor power is down here where I had not added these floor receptacles to

**8:52:30** · my circuit so I need to add them I already did it over here but on this one I want to show you something to deal with wiring we already have wiring shown between these two receptacles and we want to add this guy in between them so first of all let's get the recepticle added so let me hover over the over this recepticle tab a few times until we get to the Circuit click the circuit now we're editing a c circuit edit circuit and it's by default going to add to the circuit if you recall our circuiting click on this guy and then finish it it's added to the Circuit now

**8:53:05** · I want to wire it if I leave this wire in place and hit tab it wants to draw it a a line in let me do that it wants to draw a a wiring Arc from the closest recepticle which ends up being this one down here well I don't really like the look of this coming back back and I really like this to come from here to this one to this one so the way I can do that is get rid of this is I have to actually delete this other wire just hit delete now when I hit the circuit you can see that it is

**8:53:38** · redrawing these in a more logical fashion because that other wire is not there and then I can take this and move it as I want and move the end points like we did in the previous episodes so I just want to show you that's one method that you can have the wiring automatically generated to your advantage and a similar approach down here a branch over like this should be fine so I'm

**8:54:10** · going to leave that unless I want to go from here to here to here I can rearrange these myself but I'm going to let this do what it wants I need to add it first and then again have to reselect the circuit get that guy and I decided I want to pull him up here and move these grips like we did

**8:54:32** · before so I just want to show that's one way you can get this wiring to to show more like you want without having to manually move it around so now that we have all these beautiful looking views and plans set up and schedules done we need to drag these onto sheets so that we can create PDFs or print these on paper and make them useful so how how do we do that well down here in

**8:54:57** · the project browser under Legends and schedules panel schedules you'll see sheets and right now we have none that's right above families so we can rightclick depending on which version you're in you can right click and say new sheet or you can go up to view it's another view option and then over here there's a sheet creates a page for a document set click on sheet and depending

**8:55:21** · on which title blocks you have in your project at the time you can select one the outof thebox Revit template that we are in right now does come with an a size E1 30in by 42 in title block that we can use so we'll use that say okay and it just creates a sheet puts the title Block in it's it's pretty much blank under our sheets if you expand it you'll see a sheet that it just gives a number to you can right click and do a rename or you can even click it and hit F2 to get to the sheet

**8:55:55** · title renaming we'll call our first plan E100 and that will be the electrical cover or electrical symbols whatever you want to call your first sheet and then we can drag our symbol list into

**8:56:13** · that that we've started and we only have a partial symbol list right now but eventually you'll have your full symbol list that you can bring on here now there's a couple options for this view type it takes the default up here of called viewport one you can create other kinds

**8:56:32** · of views where maybe you don't want the title or maybe you don't want a scale maybe you want this to look differently so that can be done and I'll have a whole separate video on how to deal with sheets and view titles and customize that because again sometimes we don't even want the scale or we don't even want a title but in this case we don't even need a A View Title so we can set this up for a nun so duplicate this and let's call this none and The View Title will be none show extension line no so our none will just be

**8:57:14** · blank we don't need a view Title just for a symbol list and again this is just a start of our symbol list and then we can create some other sheets so let's create another sheet and once you've created the sheet you'll see down here that it shows what has been dragged onto that sheet so it shows that the legend called symbols has been dragged onto that sheet you can actually get to this Legend from this sheet list right here now I opened it just as if I went up to my Legends and hit symbols

**8:57:45** · so that's another way to get to that sheet you can also on the sheet double click it and now I'm editing the legend I can't edit the sheet so it's like I've popped into kind of a viewport and if I

**8:58:00** · need to get back out here double click over here and you're back out to your sheet so I personally think it gets a little confusing to do it this way you forget which one you're in so I prefer to either click fully into the view this way or through the project browser up here but that's personal preference let's create another sheet new sheet okay now we're going to call this one E200 and this will be first floor plan lighting and you can put these in whatever order you would

**8:58:41** · like and then we can drag our first floor lighting we just hold it drag it over let go and see how it looks and then place this anywhere on your sheet you would like I'm going to kind of Center it here leave leave some room for maybe City comments in the upper right click it on there and luckily our

**8:59:03** · scale was set up properly so that it fits on the sheet that we have now if you go down here you'll see that the title comes in the same way that the view was named so we have a one dash you may not want that actually to show a one dash so you can just click on the sheet and you can come down here to the right under identity data you have the view name which is the name from here and then under that you can have the title on the sheet and it can be different and for me

**8:59:32** · it's typically the same but without the one or maybe I had a shorthand name for the view name and actually I want a full name so I'll just go first floor plan lighting and apply that so you feel like you've typed it twice because you had to name the sheet and you had to name the view but that's typical and it shows our scale there's a couple ways to pick this stuff you can click here on The View and that will let you move the whole view undo that however if you escape out

**9:00:06** · and just click on The View Title now you can move it independent of the view see how that goes by itself let's undo that if you select this View and move it everything moves together the whole View

**9:00:25** · but if you just select The View Title it moves by itself so perhaps you want to get that moved differently and now we can move the whole thing down so you have some variety on how you can do that you can also click here and get to these little dots at the end and so you can shorten this up if you want to maybe you just want a short little line instead of going clear across so you can mess with that so we'll set up all of our sheets in the same manner and just drag

**9:00:52** · them over and just as a note like I mentioned before most views you can only drag onto one sheet I cannot create another floor plan lighting and drag this same sheet over the only thing I can repeat over here are these Legends so for example I put a legend on the electrical cover I can also drag this Legend onto this sheet but I can't drag this floor plan again this view is

**9:01:16** · already placed on that sheet so to place a similar view on a sheet you can use the duplicate view or duplicate with detailing you can also o duplicate as a dependent there's other view commands we can do to to deal with that which we would cover in another video but for now we've got our sheet named now how can we get owner and project name in here now we could just jump in here and start typing these things in however we know that our architectural plan is already set up we look at the PDF you can see that it's already set up as sample house so we can just bring that data

**9:01:49** · into our model from there the way we do that is under man manage transfer project standards right there and it's bringing it in from the architecture it knows that we already have this architecture model open so all these things there's even things like browser organization and all these different settings for systems even conduit sizes so let's check none all we want to

**9:02:17** · bring in is some information about the project so there's project info and project parameters we want Pro project info say okay to that and it brings in energy settings project information and

**9:02:32** · some shared site information and just overwrite what we have and what that did is it brought in the title block information Autodesk sample house or on a more complicated name of a project which may have the address and things like that this is very handy and then under here you can put your issue date you can put who is drawn by checked by all of this information for the title block and that is repeated on every sheet go to electrical cover that information

**9:03:01** · also got brought in so let's go ahead and make that site plan sheet because we were concerned about the scale and how that would look so let's create a plan here and call it e101 site plan

**9:03:16** · electrical and drag this site plan and see what we get okay so it looks fairly small on this sheet so the scale we selected 1 in equal 20 ft is a little

**9:03:32** · bit too small so let let's see what happens if we bump this up to a different size now it's already on the sheet so we can just leave it there but let's go into our site plan and we have this set up as a view template so we need to change the view template let's change it to 1 inal 10 ft and we may have to go through and adjust some of these leaders and notes but right now they look like they're okay and let's see how that looks see if it fits it's a little bit big but we can adjust looks like we have some room up here to

**9:04:11** · adjust the actual plan so again we can get to the plan from here get to the view and let's go ahead and bring this down to here we can bring the sides in a bit with our crop region let's try that there

**9:04:29** · that looks like it's fitting better now just we have this we can deal with and this is too short one thing I would say is you can just delete this off here now all we've done is taken it off the sheet we haven't deleted the plan go back to the site plan red drag it in and it will resize The View Title to the size of the window or viewport automatically when you drag it in so that can save you some resizing so that looks much better and then our view itself I think our notes work this

**9:05:00** · is a little bit away but that should work and our light and our home runs I think everything looks okay in this scale and again these section cuts that are not used that did not get dragged onto plans will not be there when we print this out I'll go through and do the rest of the sheet setups off camera and we'll go from there and now that we have all of our sheets created created we need to create PDFs of these sheets as of Revit 2022 there's two different ways to do this the first way the way we used to do it is to just use the print function and then go you can select a

**9:05:37** · printer such as a blue beam PDF type printer or adobe and use that and then what we do is we have a file you want to name it and the print range and then things like the settings like the sheet size so first thing we select our printer and then I jump down here to the print range either the current window which would just be this sheet that I'm looking at or selected views and sheets now you can create if you hit select you can create a set of in our case sheets that you want

**9:06:09** · to print right now as long as this isn't checked uncheck that hide unchecked viewer sheets well if you hide unchecked usser sheets you can't check any so uncheck that here's all the view and then eventually we get down to Sheets here's our sheets we want to create finished sheets so we don't need

**9:06:31** · views and you can uncheck the views from here so all you see is the sheets and that makes it a little bit easier so narrow it down to sheets and in this case all of our sheets are ready for printing sometimes you'll have sheets set up that are not ready yet and so you would not check those so we want to check all of these and then we can save this as a set name so that we can print these again so up here right here we can save it as and give it a name and I'll just call this electrical set and so that saves this selection of sheets as a print set name that you can refer to again so

**9:07:10** · you don't have to check these again next time and now that we have those picked we can say select that so we and do we want to save those for use in a future rabit session yes we already did that called electrical set and then up here a default to create separate files you can create separate PDFs for each sheet if you want but I typically like to combine them into one set so I'll hit combine and then the settings for the sheet size we can close this now and look and the name of this was E130 X42 so there's the size now sometimes it won't say that in your title block

**9:07:49** · so you may have to measure it and you can just measure it with these tools here and you'll see here that that's 3' 6 so back to the print and then we want to set up our sheet size for that 30X 42 so we do not have any named print setups so we'll have to create it from scratch pop in here you see there's a lot of different sizes we want to go down to the an E1 which is 30X 42 and

**9:08:19** · then Center is fine now how do we want it to zoom if you fit the page it will typically add margins around your sheet we don't want that we want it zoomed at exactly 100% And then we want to down here is where we can hide these unreferenced view tags which are those section views hide scope boxes hide crop boundaries and that's what we need to set for that the rest of these defaults are fine Vector processing uh high quality and we just keep it in color and then save this setup as some

**9:08:53** · we can come back to so I like to give it a PDF and then a size 30 PDF 30X 42 and now we can save this and you would do this in your project template so you have these available in multiple sizes say okay to that and everything is set up so now we can say okay and it will ask you where do you want to save it and then you'll have a PDF document that we can look at and then open up the PDF and take a look and see how it printed it looks like it went clear out to the edges printed well and it has nice curved Vector processing it's not pixelated

**9:09:31** · so it has it does a nice print job even if you zoom in everything looks good there and it got all of our sheets go through the whole set now you have your PDF set printed with the printer function now the other way you can do this is instead of printing it there's a button here now called create PDF it's also under file export PDF and it's similar to The Print window where you

**9:10:04** · can select what do you want to print so you can go and it remembers your electrical set that you just created in your print settings so fortunately they they use the same settings and then here is where we can combine the views into a single PDF and you can give it a name and then it will automatically use your sheet size and then we can hide unreferenced view tags and hide all that and say export you want to save them and we can call this PDF 30 by 42 that's the part that didn't

**9:10:38** · save and in the background down at the bottom you can see it's printing and there it's done so that concludes this 10 episode full proc project series and I sure hope you learn something in this I will be doing more projects in the future that get a little more complicated we'll do a full commercial project and things like that along with continued individual

**9:11:06** · little videos about how to do certain things so thank you for sticking through to the end and thank you if you've subscribed I really appreciate that and until next time \[Music\]