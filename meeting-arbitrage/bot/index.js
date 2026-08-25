/**
 * Banksia WhatsApp bot.
 *
 * Runs on a machine in the house (a laptop that stays on, or a Pi), logs in by
 * scanning a QR code, and bridges the group chat to the Worker:
 *
 *   outbound   polls /api/bot/outbox, posts what is queued, acks it
 *   inbound    forwards group messages to /api/bot/inbox, which recognises
 *              "was me" / "not me" against the newest open issue
 *
 * Polling rather than webhooks because this process sits behind a home router
 * with no stable inbound address.
 *
 * ── Read this before running it ─────────────────────────────────────────────
 * whatsapp-web.js drives a real WhatsApp Web session. It is not an official
 * API, and automating an account is against WhatsApp's terms of service; the
 * account can be banned. Use a spare number, keep the volume low (this bot
 * sends a handful of messages a week), and never point it at a chat whose
 * members have not agreed to it. The official Cloud API cannot post to group
 * chats at all, which is why this path exists.
 */

import pkg from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';

const { Client, LocalAuth } = pkg;

const CONFIG = {
  apiBase: process.env.ARBITRAGE_API ?? 'http://localhost:8787',
  botToken: process.env.BOT_TOKEN ?? '',
  groupId: process.env.BANKSIA_GROUP_ID ?? '',
  /** WhatsApp group chat id, e.g. `1203...@g.us`. Discover it with !whereami. */
  chatId: process.env.WHATSAPP_CHAT_ID ?? '',
  pollSeconds: Number(process.env.POLL_SECONDS ?? 20),
  sessionPath: process.env.SESSION_PATH ?? './bot/.wwebjs_auth',
};

if (!CONFIG.botToken) {
  console.error('BOT_TOKEN is required. It must match the Worker secret of the same name.');
  process.exit(1);
}

const api = async (path, init = {}) => {
  const res = await fetch(`${CONFIG.apiBase}${path}`, {
    ...init,
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${CONFIG.botToken}`,
      ...(init.headers ?? {}),
    },
  });
  if (!res.ok) throw new Error(`${path} -> ${res.status} ${await res.text()}`);
  return res.json();
};

const client = new Client({
  authStrategy: new LocalAuth({ dataPath: CONFIG.sessionPath }),
  puppeteer: {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  },
});

client.on('qr', (qr) => {
  console.log('\nScan this with the bot\'s WhatsApp (Linked devices -> Link a device):\n');
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log(`Bot ready. Draining outbox every ${CONFIG.pollSeconds}s.`);
  if (!CONFIG.chatId) {
    console.warn('WHATSAPP_CHAT_ID is not set — send "!whereami" in the group to get it.');
  }
  drainForever();
});

client.on('auth_failure', (message) => console.error('auth failed:', message));
client.on('disconnected', (reason) => {
  console.error('disconnected:', reason, '— exiting so the supervisor restarts us');
  process.exit(1);
});

/* ── Outbound ─────────────────────────────────────────────────────────────── */

async function drainOnce() {
  const { messages } = await api('/api/bot/outbox');
  for (const message of messages) {
    if (message.channel !== 'whatsapp') continue;

    const destination = message.target === 'group' ? CONFIG.chatId : message.target;
    if (!destination) {
      console.warn('no destination for', message.id, '— skipping');
      continue;
    }

    try {
      await client.sendMessage(destination, message.body);
      await api(`/api/bot/outbox/${message.id}/ack`, {
        method: 'POST',
        body: JSON.stringify({ ok: true }),
      });
      console.log('sent', message.id);
    } catch (error) {
      console.error('send failed', message.id, error.message);
      await api(`/api/bot/outbox/${message.id}/ack`, {
        method: 'POST',
        body: JSON.stringify({ ok: false, error: String(error.message).slice(0, 300) }),
      }).catch(() => {});
    }
  }
}

async function drainForever() {
  for (;;) {
    try {
      await drainOnce();
    } catch (error) {
      console.error('drain failed:', error.message);
    }
    await new Promise((resolve) => setTimeout(resolve, CONFIG.pollSeconds * 1000));
  }
}

/* ── Inbound ──────────────────────────────────────────────────────────────── */

const HELP = [
  '🏠 *Banksia bot*',
  '',
  '`!meeting`  — link to answer when you can do',
  '`!refix`    — you can’t make the fixed time',
  '`!chores`   — the board and where you are on it',
  '`!agenda`   — what this week’s meeting is about',
  '`!issue <what happened>` — open a was-me/not-me poll',
  '`!whereami` — print this chat’s id (setup only)',
  '',
  'You can also just reply *was me* or *not me* to an open issue.',
].join('\n');

client.on('message', async (message) => {
  try {
    const chat = await message.getChat();
    if (!chat.isGroup) return;

    const text = (message.body ?? '').trim();

    if (text === '!whereami') {
      await message.reply(`This chat id is:\n\`${chat.id._serialized}\``);
      return;
    }

    // Only act on the chat we were pointed at.
    if (CONFIG.chatId && chat.id._serialized !== CONFIG.chatId) return;

    if (text === '!help') {
      await message.reply(HELP);
      return;
    }

    if (text.startsWith('!issue ')) {
      await message.reply(
        'Open it here so it’s attributable: '
        + `${CONFIG.apiBase}/h/${CONFIG.groupId}?issue=${encodeURIComponent(text.slice(7))}`,
      );
      return;
    }

    if (text === '!meeting' || text === '!chores' || text === '!agenda') {
      await message.reply(`${CONFIG.apiBase}/h/${CONFIG.groupId}#${text.slice(1)}`);
      return;
    }

    if (text.startsWith('!refix')) {
      await message.reply(
        'Re-fix requests go through the link so the budget is tracked: '
        + `${CONFIG.apiBase}/h/${CONFIG.groupId}#refix`,
      );
      return;
    }

    // Everything else: let the Worker decide whether it means anything.
    const contact = await message.getContact();
    const result = await api('/api/bot/inbox', {
      method: 'POST',
      body: JSON.stringify({
        groupId: CONFIG.groupId,
        from: contact.pushname ?? contact.number ?? '',
        phone: contact.number ? `+${contact.number}` : null,
        body: text,
      }),
    });

    if (result.handledAs?.startsWith('issue:')) {
      await message.react('✅');
    }
  } catch (error) {
    console.error('inbound failed:', error.message);
  }
});

client.initialize();
