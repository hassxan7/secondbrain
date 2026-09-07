/**
 * One command from an empty Cloudflare account to a running house.
 *
 *   npm run setup
 *
 * Creates the D1 database, writes its id into wrangler.toml, applies the
 * schema, seeds the house, and deploys. Safe to re-run: every step is either
 * idempotent or detects that it has already been done.
 *
 * Written as a script rather than a list of commands in a README because the
 * step everyone gets wrong is the middle one — copying a UUID out of one
 * command's output and into a config file — and a script does not mistype it.
 */

import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const configPath = join(root, 'wrangler.toml');

const run = (args, opts = {}) =>
  execFileSync('npx', ['wrangler', ...args], { cwd: root, encoding: 'utf8', ...opts });

function step(label) {
  process.stdout.write(`\n\x1b[1m${label}\x1b[0m\n`);
}

function databaseId() {
  const config = readFileSync(configPath, 'utf8');
  const match = config.match(/^database_id\s*=\s*"([^"]+)"/m);
  return match && match[1] !== 'REPLACE_ME' ? match[1] : null;
}

step('1/5  Checking you are logged in');
try {
  const who = run(['whoami']);
  console.log(who.trim().split('\n').slice(-3).join('\n'));
} catch {
  console.error('Not logged in. Run:  npx wrangler login');
  process.exit(1);
}

step('2/5  Database');
let id = databaseId();
if (id) {
  console.log(`Already configured: ${id}`);
} else {
  let output;
  try {
    output = run(['d1', 'create', 'arbitrage']);
  } catch (error) {
    // Re-running after a half-finished setup: the database exists but its id
    // never made it into the config, which is exactly the failure this script
    // is here to prevent. Recover it rather than telling the user to start over.
    output = run(['d1', 'info', 'arbitrage']);
  }
  const found = output.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/);
  if (!found) {
    console.error('Could not find the database id in wrangler output:\n' + output);
    process.exit(1);
  }
  id = found[0];
  writeFileSync(
    configPath,
    readFileSync(configPath, 'utf8').replace(/^database_id\s*=.*$/m, `database_id = "${id}"`),
  );
  console.log(`Created and wired up: ${id}`);
}

step('3/5  Schema');
run(['d1', 'execute', 'arbitrage', '--remote', '--file=./schema.sql', '-y'], { stdio: 'inherit' });

step('4/5  Seeding the house');
run(['d1', 'execute', 'arbitrage', '--remote', '--file=./scripts/seed-house.sql', '-y'], { stdio: 'inherit' });

step('5/5  Deploying');
const deployed = run(['deploy'], { stdio: 'pipe' });
console.log(deployed);

const url = deployed.match(/https:\/\/[^\s]+\.workers\.dev/)?.[0];
console.log(`
\x1b[1mDone.\x1b[0m

  House dashboard   ${url ?? '<your worker url>'}/h/banksia
  Join link         ${url ?? '<your worker url>'}/h/banksia  (send this one to the house)

Still to do, both optional:

  Email reminders   npx wrangler secret put RESEND_KEY
                    npx wrangler secret put RESEND_FROM
  Board photos      npx wrangler secret put ANTHROPIC_API_KEY
  WhatsApp bridge   npx wrangler secret put BOT_TOKEN, then: npm run bot
`);
