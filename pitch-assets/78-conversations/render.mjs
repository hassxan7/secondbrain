// Renders index.html to an MP4 by seeking the GSAP timeline one frame at a time.
// Usage: node render.mjs [fps] [outfile]   (needs `npm i playwright` or a global playwright, plus ffmpeg on PATH)
import { chromium } from 'playwright';
import { spawn, execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const FPS = Number(process.argv[2] || 60);
const OUT = process.argv[3] || path.join(here, `78-conversations-${FPS}fps.mp4`);
const FFMPEG = process.env.FFMPEG || 'ffmpeg';

const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
await page.goto('file://' + path.join(here, 'index.html') + '?render', { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);
const duration = await page.evaluate(() => window.__duration);
const frames = Math.ceil(duration * FPS);
console.log(`duration ${duration.toFixed(2)}s -> ${frames} frames @ ${FPS}fps -> ${OUT}`);

const ff = spawn(FFMPEG, ['-y', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-',
  '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '17', '-preset', 'medium', '-movflags', '+faststart', OUT],
  { stdio: ['pipe', 'inherit', 'inherit'] });

for (let i = 0; i < frames; i++) {
  await page.evaluate(t => window.__seek(t), i / FPS);
  const png = await page.screenshot({ type: 'png' });
  if (!ff.stdin.write(png)) await new Promise(r => ff.stdin.once('drain', r));
  if (i % 60 === 0) process.stdout.write(`\r${i}/${frames}`);
}
ff.stdin.end();
await new Promise(r => ff.on('close', r));
await browser.close();
console.log(`\ndone: ${OUT}`);
