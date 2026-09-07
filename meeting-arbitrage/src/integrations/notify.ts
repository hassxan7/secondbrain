/**
 * Actually delivering a reminder.
 *
 * The engine decides *what* to send and *whether* (see banksia/reminders.ts);
 * this is only the wire. It runs inside the Worker rather than in a process on
 * somebody's laptop, because a house tool that stops chasing people the moment
 * a MacBook lid closes is not a house tool.
 *
 * Cost shapes the channel order. Email through Resend is free at this volume
 * (3,000/month against a house sending maybe forty); SMS is a few cents a
 * message and is therefore opt-in, configured only if the house decides an
 * unread email is worse than five dollars a term. Neither is required: with no
 * keys set at all the outbox still fills, and the WhatsApp bridge — which costs
 * nothing — drains it.
 */

export interface EmailConfig {
  apiKey: string;
  /** Verified sender, e.g. "Banksia <house@yourdomain.com>". */
  from: string;
}

export interface SmsConfig {
  accountSid: string;
  authToken: string;
  /** Sending number in E.164. */
  from: string;
}

export interface DeliveryResult {
  ok: boolean;
  error?: string;
}

/** First line is the subject, the rest is the body — the outbox stores one blob. */
export function splitMessage(body: string): { subject: string; text: string } {
  const at = body.indexOf('\n\n');
  if (at === -1) return { subject: 'Banksia', text: body.trim() };
  return { subject: body.slice(0, at).trim(), text: body.slice(at + 2).trim() };
}

export async function sendEmail(
  config: EmailConfig, to: string, body: string,
): Promise<DeliveryResult> {
  const { subject, text } = splitMessage(body);
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${config.apiKey}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({ from: config.from, to: [to], subject, text }),
    });
    if (!response.ok) {
      return { ok: false, error: `resend ${response.status}: ${await response.text()}` };
    }
    return { ok: true };
  } catch (error) {
    return { ok: false, error: String(error) };
  }
}

export async function sendSms(
  config: SmsConfig, to: string, body: string,
): Promise<DeliveryResult> {
  const { subject, text } = splitMessage(body);
  try {
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${config.accountSid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          authorization: `Basic ${btoa(`${config.accountSid}:${config.authToken}`)}`,
          'content-type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          To: to, From: config.from, Body: `${subject}\n${text}`,
        }),
      },
    );
    if (!response.ok) {
      return { ok: false, error: `twilio ${response.status}: ${await response.text()}` };
    }
    return { ok: true };
  } catch (error) {
    return { ok: false, error: String(error) };
  }
}

export interface OutboxRow {
  id: string;
  channel: 'whatsapp' | 'email' | 'sms';
  target: string;
  body: string;
  attempts: number;
}

export interface DrainConfig {
  email?: EmailConfig;
  sms?: SmsConfig;
  /** Give up after this many failures rather than retrying a dead address forever. */
  maxAttempts?: number;
}

export interface DrainOutcome {
  id: string;
  status: 'sent' | 'failed' | 'skipped';
  error?: string;
}

/**
 * Send one queued message.
 *
 * WhatsApp is never sent from here — that channel is drained by the bridge
 * process holding the session, and marking those rows sent from the Worker
 * would delete a message before anyone received it.
 */
export async function deliver(
  row: OutboxRow, config: DrainConfig,
): Promise<DrainOutcome> {
  const maxAttempts = config.maxAttempts ?? 3;

  if (row.channel === 'whatsapp') return { id: row.id, status: 'skipped' };
  if (row.attempts >= maxAttempts) {
    return { id: row.id, status: 'failed', error: 'gave up after repeated failures' };
  }

  if (row.channel === 'email') {
    if (!config.email) return { id: row.id, status: 'skipped', error: 'no email sender configured' };
    const result = await sendEmail(config.email, row.target, row.body);
    return result.ok
      ? { id: row.id, status: 'sent' }
      : { id: row.id, status: 'failed', error: result.error };
  }

  if (!config.sms) return { id: row.id, status: 'skipped', error: 'no SMS sender configured' };
  const result = await sendSms(config.sms, row.target, row.body);
  return result.ok
    ? { id: row.id, status: 'sent' }
    : { id: row.id, status: 'failed', error: result.error };
}
