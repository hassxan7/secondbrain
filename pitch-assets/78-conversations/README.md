# 78 Conversations — slide transition (scroll wall)

Self-contained 1920×1080 animation for the pitch deck. 78 dots (one per conversation) pop in with a
counter, six light up, fly into their place in a feedback wall and become the headshots, the names,
bios and quotes cascade in, and the wall then scrolls continuously (alternating left/right, looping).

Timing: dots 0–2.4 s · picks light up 2.5 s · fly-in 3.4–4.5 s · quotes 4.3–5.4 s · wall scrolls from
5.2 s and loops. The clip is 42 s so it keeps rolling while you talk; trim in Canva if you want less.

Files
- `78-conversations-60fps.mp4` — drop this on the Canva slide (1080p, 60 fps, H.264, no loop needed).
- `index.html` — the animation itself, fully self-contained (font, GSAP and headshots inlined). Opens
  offline in any browser; click anywhere to replay.
- `template.html` + `build.py` — the editable source. Edit the template, then `python3 build.py`
  to regenerate `index.html`.
- `img/` — square headshots, one per person, file name = person id (`leo.jpg`, `boris.jpg`, ...).
  A person with no image gets an initials placeholder. **`boris.jpg` is still missing.**
- `render.mjs` — re-renders the MP4: `node render.mjs 60 out.mp4`. Needs `playwright` and an
  `ffmpeg` with libx264 (set `FFMPEG=/path/to/ffmpeg` if it is not on PATH).

Editing
- People, quotes, roles and which grid dot each person starts from: the `PEOPLE` array in `template.html`.
- Row size, quote font size, scroll speed, clip length: the `cfg` dict at the top of `build.py`.
- Background colour: `--bg` in `template.html` (currently `#0f0f12`, match it to the slide).
