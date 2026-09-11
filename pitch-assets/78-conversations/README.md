# 78 Conversations — slide transition

Self-contained 1920×1080 animation for the pitch deck: 78 dots (one per conversation) pop in with a
counter, five of them light up, fly into a left-hand column and become the five headshots, and the
quotes cascade in beside them. Wall is complete at ~5.7 s; total clip 8 s (hold on the finished wall).

Files
- `78-conversations-60fps.mp4` — drop this straight onto the Canva slide (1080p, 60 fps, H.264).
- `index.html` — the animation itself. Fully self-contained (Inter font, GSAP and headshots are
  inlined), so it opens offline in any browser. Click anywhere to replay.
- `render.mjs` — re-renders the MP4 after edits (seeks the GSAP timeline frame by frame through
  Playwright, pipes PNGs into ffmpeg). `node render.mjs 60 out.mp4`. Needs `playwright` and an
  `ffmpeg` with libx264 on PATH (or set `FFMPEG=/path/to/ffmpeg`).
- `img/` — square-cropped headshots used in the HTML.

Editing
- Quotes, names, roles and which grid dot each person starts from: the `PEOPLE` array in `index.html`.
- Background colour: `--bg` in the `:root` block (currently `#0f0f12`, match it to the slide).
- Timing: `T_PICK` (dots light up), `T_FLY` (fly-in), `T_ROWS` (quotes) near the bottom of the script.

HyperFrames: the composition is plain HTML + a paused GSAP timeline exposed as `window.__tl`, so it can
also be dropped into a HyperFrames project with the GSAP adapter if you want to render it that way.
