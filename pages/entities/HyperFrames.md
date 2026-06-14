---
title: "HyperFrames"
type: entity
tags: [tool, motion-graphics, HTML, video, Claude-skill]
created: 2026-06-14
updated: 2026-06-14
sources: 1
---

HyperFrames is an open-source HTML-to-video rendering framework by HeyGen. Write standard HTML/CSS/GSAP → renders to deterministic MP4 via headless Chrome + ffmpeg. It is the motion graphics engine in the [[video-editing-pipeline]], producing overlay animations for [[video-use]].

---

## Key Facts

- **Repo:** https://github.com/heygen-com/hyperframes
- **Stars:** 27.4k
- **License:** Apache 2.0
- **Tagline:** "Write HTML. Render video. Built for agents."
- **Claude skill:** installed via `npx skills add heygen-com/hyperframes`
- **Requires:** Node.js 22+, ffmpeg

## What It Does

- Parses HTML files with `data-` attributes for timing/animation
- Drives headless Chrome (Puppeteer) to capture each frame
- Encodes output with ffmpeg → deterministic MP4
- Supports audio mixing

## Animation Adapters Supported

- **GSAP** (recommended for kinetic typography, UI reveals)
- CSS animations
- Lottie
- Three.js
- Anime.js
- WAAPI

## CLI Commands

```bash
npx hyperframes init my-video      # scaffold new composition
npx hyperframes preview            # live reload in browser
npx hyperframes render             # output MP4
npx hyperframes lint               # validate composition
npx hyperframes inspect            # examine structure
```

## Composition Format

```html
<div id="stage" data-composition-id="launch" data-start="0"
     data-width="1920" data-height="1080">

  <video class="clip" data-start="0" data-duration="6"
         data-track-index="0" src="intro.mp4"></video>

  <h1 id="title" class="clip" data-start="1" data-duration="4">
    Launch day
  </h1>

  <script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js"></script>
  <script>
    const tl = gsap.timeline({ paused: true });
    tl.from("#title", { opacity: 0, y: 40, duration: 0.8 }, 1);
    window.__timelines = window.__timelines || {};
    window.__timelines.launch = tl;
  </script>
</div>
```

## When to Use (vs Alternatives)

| Use HyperFrames for... | Use instead... |
|------------------------|----------------|
| Kinetic typography, title cards | |
| Product UI / website mockup-to-video | |
| HTML/CSS authoring (no React) | |
| Transparent WebM overlays | |
| Deterministic frame-accurate output | |
| | Remotion — if React/component-based |
| | Manim — if diagrams/equations |
| | PIL — if simple counter/typewriter card |

## Usage Inside video-use Pipeline

Each animation is a separate slot inside `edit/animations/slot_<id>/`:

```bash
# Scaffold
npx --yes hyperframes init . --example blank --non-interactive --skip-skills

# Build HTML composition, then:
npx --yes hyperframes render . -o render.mp4
# or for alpha overlay:
npx --yes hyperframes render . --format webm -o render.webm
```

## Relationships

- Used by → [[video-use]] for motion graphics overlay slots
- Part of → [[video-editing-pipeline]]
- Alternative to → Remotion, Manim, PIL

## Open Questions

- Does Civly have a design system / brand tokens to wire into frame.md?
- Catalog components to explore: `npx hyperframes add flash-through-white`, `instagram-follow`, `data-chart`
