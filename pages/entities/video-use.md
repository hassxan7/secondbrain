---
title: "video-use"
type: entity
tags: [tool, video-editing, AI, Python, Claude-skill]
created: 2026-06-14
updated: 2026-06-14
sources: 1
---

`video-use` is an open-source AI video editing system by browser-use. It works as a Claude Code skill — you describe what you want in plain English, it transcribes, cuts, grades, adds motion graphics, and delivers `final.mp4`. It is the core editing engine in the [[video-editing-pipeline]].

---

## Key Facts

- **Repo:** https://github.com/browser-use/video-use
- **Stars:** 9.6k
- **License:** MIT
- **Language:** Python (76%), HTML (23%)
- **Installed at:** `C:\Users\hassa\Developer\video-use`
- **Claude skill:** `C:\Users\hassa\.claude\skills\video-use` (symlink)
- **Primary language:** Python
- **Transcription:** ElevenLabs Scribe API (word-level, diarized)
- **Rendering:** ffmpeg

## What It Does

- Removes filler words (`umm`, `uh`) and dead space
- Color grades per segment (warm_cinematic, neutral_punch, or custom ffmpeg)
- Burns subtitles (2-word UPPERCASE chunks default, or natural-sentence)
- Generates animation overlays via [[HyperFrames]], Remotion, Manim, or PIL
- Self-evaluates rendered output and retries (max 3 passes)
- Maintains `project.md` session memory across sessions

## Core Principle

"The LLM never watches the video. It reads it." — transcript + on-demand filmstrip PNGs only.

## Helpers

| Script | Purpose |
|--------|---------|
| `transcribe.py <video>` | Single-file ElevenLabs transcription (cached) |
| `transcribe_batch.py <dir>` | 4-worker parallel batch transcription |
| `pack_transcripts.py` | Transcripts → `takes_packed.md` (phrase-level) |
| `timeline_view.py` | Filmstrip + waveform PNG at decision points |
| `render.py <edl.json>` | Full render pipeline |
| `grade.py <in>` | Color grade with ffmpeg |

## Setup Requirements

- ElevenLabs API key in `.env` at repo root (`ELEVENLABS_API_KEY=...`)
- `ffmpeg` + `ffprobe` on PATH (**not yet installed on this machine**)
- Python deps: `uv sync` inside `C:\Users\hassa\Developer\video-use`
- Node.js 22+ (for HyperFrames slots) — ✅ Node 24 installed

## Relationships

- Integrates with → [[HyperFrames]] (motion graphics overlays)
- Part of → [[video-editing-pipeline]]
- Requires → ElevenLabs Scribe API

## Open Questions

- ElevenLabs API key — needs to be added to `.env`
- ffmpeg — needs to be installed on this Windows machine
- Does Civly have existing brand colors/fonts for animation sub-agents?
