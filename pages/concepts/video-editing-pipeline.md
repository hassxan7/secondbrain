---
title: "Video Editing Pipeline"
type: concept
tags: [video, pipeline, AI, editing, motion-graphics]
created: 2026-06-14
updated: 2026-06-14
sources: 2
---

The full AI-powered video editing pipeline for Civly: raw footage in → edited, motion-graphics-enhanced video out. Powered by [[video-use]] (Python, filler removal, cuts, subtitles) and [[HyperFrames]] (HTML-to-video motion graphics overlays).

---

## Pipeline Overview

```
Raw video file
     ↓
[1] Transcribe (ElevenLabs Scribe — word-level timestamps)
     ↓
[2] Pack transcript → takes_packed.md (phrase-level reading view)
     ↓
[3] LLM reasons → proposes edit strategy (confirm before executing)
     ↓
[4] EDL (edit decision list) JSON — cut points, grades, overlays
     ↓
[5] Per-segment extract + color grade + 30ms audio fades
     ↓
[6] Motion graphics animations (HyperFrames / PIL) — parallel sub-agents
     ↓
[7] Concat + overlay (PTS-shifted) + subtitles LAST
     ↓
[8] Self-eval at every cut boundary → fix → re-render (max 3 passes)
     ↓
edit/final.mp4
```

---

## What Each Tool Does

### [[video-use]] — The Editor
- Transcribes with ElevenLabs Scribe (word-level, NOT SRT mode)
- Removes filler words (`umm`, `uh`) and dead space between takes
- Applies color grade per segment
- Burns subtitles (applied LAST in filter chain — hard rule)
- Spawns parallel sub-agents for animations
- Maintains `project.md` session memory

### [[HyperFrames]] — Motion Graphics
- Write HTML/CSS/GSAP → renders to MP4/WebM overlay
- Used for: kinetic typography, product UI motion, animated cards, lower thirds
- Agent-friendly: `npx hyperframes init / preview / render`
- Supports GSAP, CSS animations, Lottie, Three.js, Anime.js

---

## Hard Rules (non-negotiable, silent failures if broken)

1. Subtitles applied LAST in filter chain (after all overlays)
2. Per-segment extract → lossless concat (never single-pass filtergraph with overlays)
3. 30ms audio fades at every segment boundary (prevents pops)
4. Overlays use `setpts=PTS-STARTPTS+T/TB` (shifts frame 0 to window start)
5. Subtitle SRT uses output-timeline offsets (not source timestamps)
6. Never cut inside a word (snap to word boundary from Scribe)
7. Pad every cut edge 30–200ms (Scribe timestamps drift 50–100ms)
8. Always word-level verbatim transcription (never SRT/phrase mode)
9. Cache transcripts — never re-transcribe unchanged sources
10. Parallel sub-agents for animations (never sequential)
11. Confirm strategy before any editing
12. All outputs in `<videos_dir>/edit/` (never in video-use repo)

---

## Output Directory Layout

```
<your-videos-folder>/
└── edit/
    ├── project.md          ← session memory
    ├── takes_packed.md     ← LLM reading view
    ├── edl.json            ← cut decisions
    ├── transcripts/        ← cached Scribe JSON
    ├── animations/         ← slot_1/, slot_2/, ...
    ├── clips_graded/       ← extracted + graded segments
    ├── master.srt
    ├── preview.mp4
    └── final.mp4
```

---

## How to Use (Quick Start)

```bash
# Navigate to your footage folder
cd /path/to/your/videos

# Start Claude Code — the video-use skill loads automatically
claude

# Then just say:
# "Edit this talking head — remove fillers, add captions, add a title card"
```

---

## Animation Engines (pick per slot)

| Engine | Best for |
|--------|---------|
| HyperFrames | HTML/CSS/GSAP: kinetic text, UI mockups, product cards |
| Remotion | React compositions, existing React brand system |
| Manim | Diagrams, state machines, equations, graph morphs |
| PIL + ffmpeg | Simple overlay cards, counters, typewriter text (fastest) |

---

## Dependencies

| Tool | Status | Notes |
|------|--------|-------|
| Node.js 24 | ✅ installed | |
| Python 3.14 | ✅ installed | |
| ffmpeg | ❌ needs install | `winget install ffmpeg` or Chocolatey |
| uv | installing... | Python package manager |
| ElevenLabs API key | ⚠️ needs key | https://elevenlabs.io/app/settings/api-keys |
| HyperFrames | installing... | `npx skills add heygen-com/hyperframes` |
| video-use | ✅ cloned | `C:\Users\hassa\Developer\video-use` |

---

## Open Questions

- What aspect ratio / delivery format is primary for Civly videos? (1920×1080, 9:16 vertical, square?)
- Is there a Civly brand style guide (colors, fonts, logo) to feed into animation sub-agents?
- Which ElevenLabs plan / API key will be used?
