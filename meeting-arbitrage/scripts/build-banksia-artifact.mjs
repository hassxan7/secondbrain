/**
 * Assemble the standalone Banksia dashboard demo — one self-contained HTML
 * file with the engine, styles and app inlined, mirroring build-artifact.mjs.
 *
 * Usage: node scripts/build-banksia-artifact.mjs
 */

import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'dist', 'banksia-demo.html');
const scratch = mkdtempSync(join(tmpdir(), 'bank-'));
const enginePath = join(scratch, 'engine.iife.js');

execFileSync('npx', [
  'esbuild', join(root, 'src/browser.ts'),
  '--bundle', '--format=iife', '--global-name=RippleEngine',
  '--target=es2020', '--external:@anthropic-ai/sdk',
  `--outfile=${enginePath}`,
], { stdio: 'inherit', cwd: root });

const engine = readFileSync(enginePath, 'utf8');
const css = readFileSync(join(root, 'web/banksia/app.css'), 'utf8');
let app = readFileSync(join(root, 'web/banksia/app.js'), 'utf8');
const page = readFileSync(join(root, 'web/banksia/index.html'), 'utf8');

const importRe = /^import\s*\{([\s\S]*?)\}\s*from\s*['"]\.\.\/shared\/engine\.js['"];\s*$/m;
const m = app.match(importRe);
if (!m) throw new Error('no engine import in banksia app.js');
const bindings = m[1].split(',').map((s) => s.trim()).filter(Boolean);
app = app.replace(importRe, `const {\n  ${bindings.join(',\n  ')},\n} = RippleEngine;`);
if (/^\s*import\s/m.test(app)) throw new Error('unhandled import in banksia app.js');

const body = page.match(/<body>([\s\S]*?)<\/body>/)[1].replace(/\s*<script[\s\S]*?<\/script>/g, '').trim();
const fonts = [...page.matchAll(/<link[^>]*fonts\.(?:googleapis|gstatic)\.com[^>]*>/g)].map((x) => x[0]).join('\n');

const html = `<title>Banksia House</title>
${fonts}
<style>
${css}
</style>

${body}

<script>
${engine}
</script>
<script>
${app}
</script>
`;
writeFileSync(out, html);
console.log(`wrote ${out} (${(Buffer.byteLength(html) / 1024).toFixed(1)} KB)`);
