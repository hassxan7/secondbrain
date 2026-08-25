/**
 * Assemble the standalone Ripple prototype: one self-contained HTML file with
 * the engine, styles and app inlined.
 *
 * Generated from web/ripple/* rather than hand-copied, so the shareable
 * prototype can never drift from the page the Worker serves. The engine is
 * bundled as an IIFE global here (not ESM) because an inline module script
 * cannot usefully carry esbuild's `export {}` footer.
 *
 * Usage: node scripts/build-artifact.mjs [outfile]
 */

import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const out = resolve(process.argv[2] ?? join(root, 'dist', 'ripple-prototype.html'));

const scratch = mkdtempSync(join(tmpdir(), 'ripple-'));
const enginePath = join(scratch, 'engine.iife.js');

execFileSync('npx', [
  'esbuild', join(root, 'src/browser.ts'),
  '--bundle', '--format=iife', '--global-name=RippleEngine',
  '--target=es2020', '--external:@anthropic-ai/sdk',
  `--outfile=${enginePath}`,
], { stdio: 'inherit', cwd: root });

const engine = readFileSync(enginePath, 'utf8');
const css = readFileSync(join(root, 'web/ripple/app.css'), 'utf8');
let app = readFileSync(join(root, 'web/ripple/app.js'), 'utf8');
const page = readFileSync(join(root, 'web/ripple/index.html'), 'utf8');

// Swap the ES import for a destructure off the IIFE global.
const importRe = /^import\s*\{[\s\S]*?\}\s*from\s*['"][^'"]+['"];\s*$/m;
if (!importRe.test(app)) throw new Error('could not find the engine import in app.js');
app = app.replace(importRe, `const {
  generateGrid, formatSlot, scoreSlots, SUBURBS, rankHubs,
  mergeRippleEvents, rankActivities, buildItinerary, buildBrief, renderChatMessage,
} = RippleEngine;`);

// Reuse the served markup so the two versions stay identical.
const bodyMatch = page.match(/<body>([\s\S]*?)<\/body>/);
if (!bodyMatch) throw new Error('could not find <body> in index.html');
const markup = bodyMatch[1]
  .replace(/\s*<script[\s\S]*?<\/script>/g, '')
  .trim();

const html = `<title>Ripple Hangout Planner</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
${css}
</style>

${markup}

<script>
${engine}
</script>
<script>
${app}
</script>
`;

writeFileSync(out, html);
const kb = (Buffer.byteLength(html) / 1024).toFixed(1);
console.log(`wrote ${out} (${kb} KB)`);
