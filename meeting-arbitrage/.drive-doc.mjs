import { chromium } from 'playwright';
import fs from 'node:fs';
const SRC='/tmp/claude-0/-home-user-secondbrain/4a29c885-cdc4-5529-b2e0-0f46fbba006a/scratchpad/doc/ripple-plan-builder.html';
const OUT='/tmp/claude-0/-home-user-secondbrain/4a29c885-cdc4-5529-b2e0-0f46fbba006a/scratchpad';
const inner = fs.readFileSync(SRC,'utf8');
fs.writeFileSync(`${OUT}/doc-wrapped.html`,
  `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>${inner}</body></html>`);
const browser = await chromium.launch({ executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
for (const scheme of ['light','dark']) {
  const page = await browser.newPage({ viewport:{width:820,height:1200}, deviceScaleFactor:2, colorScheme: scheme });
  const errs=[]; page.on('pageerror',e=>errs.push(e.message));
  await page.goto(`file://${OUT}/doc-wrapped.html`); await page.waitForTimeout(500);
  await page.screenshot({ path:`${OUT}/shots/doc-${scheme}-top.png` });
  await page.evaluate(()=>window.scrollTo(0, 2600)); await page.waitForTimeout(300);
  await page.screenshot({ path:`${OUT}/shots/doc-${scheme}-mid.png` });
  if (scheme==='light') {
    console.log('TITLE:', await page.title());
    const w = await page.evaluate(()=>document.documentElement.scrollWidth);
    console.log('page scrollWidth vs viewport:', w, '(820 = no horizontal scroll)');
    console.log('sections:', await page.locator('h2').allTextContents());
  }
  console.log(scheme, 'errors:', errs.length?errs.join(';'):'none');
  await page.close();
}
await browser.close();
