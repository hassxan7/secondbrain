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

// Poll arrived in whatsapp-web.js 1.23. Destructured defensively so an older
// install degrades to the text fallback instead of crashing on startup.
const { Client, LocalAuth, Poll } = pkg;
const CAN_POLL = typeof Poll === 'function';

/**
 * The word that wakes the bot. One word, matched anywhere, case-insensitive.
 * Kept in sync with TRIGGER in src/banksia/bot-routes.ts.
 */
const TRIGGER = /\bbanks(y|ie)\b/i;

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

client.on('ready', async () => {
  console.log(`Bot ready. Draining outbox every ${CONFIG.pollSeconds}s.`);
  console.log(CAN_POLL
    ? 'Native polls available.'
    : 'No Poll export — falling back to numbered text replies.');
  if (!CONFIG.chatId) {
    console.warn('WHATSAPP_CHAT_ID is not set — send "!whereami" in the group to get it.');
  }
  await syncRoster().catch((e) => console.error('roster sync failed:', e.message));
  drainForever();
});

/**
 * Tell the Worker who is actually in the group.
 *
 * Run on every start and hourly. Reminders to people in here go over WhatsApp
 * for nothing; everyone else falls through to email, then to paid SMS. Someone
 * leaving the group has to flip the flag back off, or we would keep queueing
 * messages into a chat they are not in, which fails silently.
 */
async function syncRoster() {
  if (!CONFIG.chatId) return;
  const chat = await client.getChatById(CONFIG.chatId);
  const phones = (chat.participants ?? []).map((p) => `+${p.id.user}`);
  const result = await api(`/api/g/${CONFIG.groupId}/bot/roster`, {
    method: 'POST',
    body: JSON.stringify({ phones }),
  });
  console.log(`roster: ${result.reachable} reachable on WhatsApp`
    + (result.unknown?.length ? `, ${result.unknown.length} in the chat but not on the board` : ''));
}
setInterval(() => syncRoster().catch(() => {}), 3600 * 1000);

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

/* ── Polls ────────────────────────────────────────────────────────────────── */

/** poll message id -> issue id. In memory: a restart just stops attributing
 *  votes on old polls, and people can still reply "not me" in text. */
const openPolls = new Map();

/**
 * Post the poll into the chat.
 *
 * Native poll when the installed version has one, because tapping a button is
 * the entire reason this lives in WhatsApp rather than behind a link. The text
 * fallback still works: the inbox route already understands "was me" / "not me"
 * in plain English.
 */
async function postPoll(chatId, poll) {
  if (CAN_POLL) {
    const sent = await client.sendMessage(
      chatId,
      new Poll(poll.question, poll.options, { allowMultipleAnswers: false }),
    );
    openPolls.set(sent.id._serialized, poll.issueId);
    return sent;
  }
  return client.sendMessage(
    chatId,
    `${poll.question}\n\nReply *was me* or *not me*.`
    + `\n_Not answering is counted as not answering._`,
  );
}

// Native poll votes. The event name changed across versions, so both are bound
// and the handler is idempotent on the server (one row per issue per member).
for (const event of ['vote_update', 'poll_vote']) {
  client.on(event, async (vote) => {
    try {
      const pollId = vote.parentMessage?.id?._serialized ?? vote.pollCreationMessageKey?.id;
      const issueId = openPolls.get(pollId);
      if (!issueId) return;

      const option = (vote.selectedOptions ?? [])[0]?.name;
      if (!option) return;

      const number = String(vote.voter ?? vote.sender ?? '').split('@')[0];
      const result = await api('/api/bot/vote', {
        method: 'POST',
        body: JSON.stringify({
          groupId: CONFIG.groupId, issueId, option, phone: `+${number}`,
        }),
      });

      if (result.needsLink) {
        await client.sendMessage(CONFIG.chatId,
          'Someone voted from a number that is not on the board yet, so it has '
          + `not been counted. Open ${CONFIG.apiBase}/h/${CONFIG.groupId} once and it links up.`);
      } else if (result.closed) {
        openPolls.delete(pollId);
        await client.sendMessage(CONFIG.chatId, 'Owned. Closed, nothing further. 🙏');
      }
    } catch (error) {
      console.error('vote failed:', error.message);
    }
  });
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
  '*Or just say banksy.* Photo of something that needs doing + the word',
  '“banksy” and I’ll put a was-me/not-me poll in here.',
  '',
  'You can also reply *was me* or *not me* to an open poll.',
].join('\n');

client.on('message', async (message) => {
  try {
    const chat = await message.getChat();
    if (!chat.isGroup) return;

    const text = (message.body ?? '').trim();

    // A photo plus the trigger word. Checked before every command, because
    // this is the path people will actually use.
    if (message.hasMedia && TRIGGER.test(text)) {
      await handlePhoto(message, text);
      return;
    }

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
    } else if (result.needsLink) {
      // Never let a real answer vanish because a phone number was not on file.
      await message.reply(
        'Got that, but I don\u2019t know which housemate this number belongs to, '
        + 'so it has not been counted yet. Open '
        + `${CONFIG.apiBase}/h/${CONFIG.groupId} once and it will link up.`,
      );
    }
  } catch (error) {
    console.error('inbound failed:', error.message);
  }
});

/**
 * A photo somebody tagged the bot in.
 *
 * Everything that decides whether this becomes a poll happens server-side, in
 * one place: a person in frame, nothing that needs doing, a duplicate of a poll
 * already open. All of those come back as `ignored` and the bot says nothing,
 * because a bot that comments on every photo is a bot that gets muted.
 */
async function handlePhoto(message, caption) {
  const media = await message.downloadMedia();
  if (!media?.data) return;

  // ~4MB of base64 is a phone photo at full resolution. Larger is a video or a
  // document, neither of which is a chore board or a sink.
  if (media.data.length > 4_500_000) {
    await message.reply('That file is too big for me to look at. A normal photo works.');
    return;
  }

  await message.react('👀');

  const result = await api('/api/bot/photo', {
    method: 'POST',
    body: JSON.stringify({
      groupId: CONFIG.groupId,
      imageBase64: media.data,
      mediaType: media.mimetype?.startsWith('image/') ? media.mimetype : 'image/jpeg',
      caption,
    }),
  });

  if (result.ignored === 'already-open') {
    await message.reply('There is already a poll open for that one 👍');
    return;
  }
  if (!result.poll) return; // silent by design

  await postPoll(CONFIG.chatId, result.poll);
}

client.initialize();
