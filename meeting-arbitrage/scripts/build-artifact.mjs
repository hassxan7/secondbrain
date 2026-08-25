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
//
// The binding list is read out of the import itself rather than restated here.
// A hardcoded list silently goes stale the moment app.js imports something new:
// the build still succeeds, the standalone page throws on first render, and the
// only symptom is a screen where nothing responds.
const importRe = /^import\s*\{([\s\S]*?)\}\s*from\s*['"][^'"]+['"];\s*$/m;
const importMatch = app.match(importRe);
if (!importMatch) throw new Error('could not find the engine import in app.js');

const bindings = importMatch[1]
  .split(',')
  .map((name) => name.trim())
  .filter(Boolean);
if (bindings.length === 0) throw new Error('engine import names nothing');

app = app.replace(importRe, `const {\n  ${bindings.join(',\n  ')},\n} = RippleEngine;`);

// Reuse the served markup so the two versions stay identical.
const bodyMatch = page.match(/<body>([\s\S]*?)<\/body>/);
if (!bodyMatch) throw new Error('could not find <body> in index.html');
const markup = bodyMatch[1]
  .replace(/\s*<script[\s\S]*?<\/script>/g, '')
  .trim();

// Lift the font links straight out of the page, so a typeface change in
// index.html cannot leave the standalone build silently rendering a fallback.
const fontLinks = [...page.matchAll(/<link[^>]*fonts\.(?:googleapis|gstatic)\.com[^>]*>/g)]
  .map((m) => m[0])
  .join('\n');
if (!fontLinks) throw new Error('no Google Fonts links found in index.html');

const html = `<title>Ripple Hangout Planner</title>
${fontLinks}
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
