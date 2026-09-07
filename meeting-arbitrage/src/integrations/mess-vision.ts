/**
 * Reading a photo somebody posted in the group chat.
 *
 * Someone photographs the sink and types "banksy". This turns the picture into
 * one neutral sentence and an area, and nothing else. It is the narrowest job
 * the model could be given, and the narrowness is the design:
 *
 *   - **It never names anyone.** Not from the photo, not from a guess, not
 *     even if a person is visibly standing there. A house bot that identifies
 *     people in photos is a surveillance tool, and the poll exists precisely so
 *     that identification comes from a person volunteering it.
 *   - **It never assigns blame or judges.** "A pan and a bowl in the sink" is
 *     the output. "Someone has left a disgusting mess again" is not. The photo
 *     is already the accusation; the bot's job is to be the calm one.
 *   - **It decides nothing.** The poll, the counting, who is listed as not
 *     having answered, the settlement: all deterministic, all in
 *     banksia/accountability.ts. The model writes one line of description.
 *
 * If a person is visible the photo is refused outright rather than described,
 * because there is no version of "a man is standing at the sink" that is not
 * pointing at somebody.
 */

import { ISSUE_AREAS, type IssueArea } from '../banksia/anonymous.ts';

export const MESS_SYSTEM = `You look at a photo from a share-house group chat and describe what needs doing.

Return JSON only, no prose:

{"description":"Pan and bowl left in the sink","area":"kitchen","peopleVisible":false,"isMess":true}

Rules:
- "description": one short factual sentence, under 90 characters. Name the
  objects and where they are. Present tense, no adjectives of judgement, no
  exclamation marks. "Bins are full and not taken out" is right.
  "Someone has left the kitchen in a disgusting state" is wrong.
- Never refer to a person, a name, an owner, or whose it might be. Not
  "someone's pan" — just "a pan".
- "area": exactly one of kitchen, bathroom, common, bins, noise, guests, bills, other.
- "peopleVisible": true if any person, face, or identifiable body part appears
  in the photo, even partly, even in a reflection.
- "isMess": false if the photo shows nothing that needs doing (a clean room, a
  meme, a screenshot, a pet, a night out). Only true for something a housemate
  would actually need to deal with.`;

export interface MessReading {
  description: string;
  area: IssueArea;
  peopleVisible: boolean;
  isMess: boolean;
}

export interface MessVisionOptions {
  apiKey?: string;
  model?: string;
  imageBase64: string;
  mediaType: 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif';
  /** What the person typed with the photo. Context only; never trusted as fact. */
  caption?: string;
}

const AREA_IDS = new Set<string>(ISSUE_AREAS.map((a) => a.id));

/**
 * Validate whatever came back.
 *
 * Exported and pure so the whole contract is testable without an API key —
 * including the two refusals, which are the parts that must not regress.
 */
export function parseMessReading(payload: unknown): MessReading | null {
  if (!payload || typeof payload !== 'object') return null;
  const raw = payload as Partial<MessReading>;

  if (typeof raw.description !== 'string') return null;
  const description = raw.description.replace(/\s+/g, ' ').trim();
  if (!description || description.length > 140) return null;

  // A model that ignores the instruction and describes a person must not have
  // that reach the chat, so the guard is here rather than only in the prompt.
  if (raw.peopleVisible === true) return null;
  if (raw.isMess === false) return null;

  const area = typeof raw.area === 'string' && AREA_IDS.has(raw.area)
    ? raw.area as IssueArea
    : 'other';

  return { description, area, peopleVisible: false, isMess: true };
}

/**
 * Look at the photo. Returns null for anything that should not become a poll —
 * a photo with a person in it, a photo of nothing, a model failure, or no key
 * configured. Null always means "say nothing in the chat".
 */
export async function readMessPhoto(
  opts: MessVisionOptions,
): Promise<MessReading | null> {
  if (!opts.apiKey || !opts.imageBase64) return null;

  try {
    const { default: Anthropic } = await import('@anthropic-ai/sdk');
    const client = new Anthropic({ apiKey: opts.apiKey });

    const response = await client.beta.messages.create({
      model: opts.model ?? 'claude-opus-5',
      max_tokens: 300,
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      output_config: { effort: 'low' },
      system: MESS_SYSTEM,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'image',
            source: { type: 'base64', media_type: opts.mediaType, data: opts.imageBase64 },
          },
          {
            type: 'text',
            // The caption is context, and it is also user input from a group
            // chat, so it is fenced and labelled rather than concatenated into
            // the instruction.
            text: opts.caption
              ? `Describe this photo. The person posting it wrote, as context only:\n<caption>${opts.caption.slice(0, 200)}</caption>`
              : 'Describe this photo.',
          },
        ],
      }],
    });

    if (response.stop_reason === 'refusal') return null;

    const text = response.content
      .map((block) => (block.type === 'text' ? block.text : ''))
      .join('')
      .trim();

    return parseMessReading(extractObject(text));
  } catch {
    return null;
  }
}

/** Pull the JSON object out, tolerating a fenced block. */
export function extractObject(text: string): unknown {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const candidate = (fenced ? fenced[1] : text).trim();
  const start = candidate.indexOf('{');
  const end = candidate.lastIndexOf('}');
  if (start === -1 || end <= start) return null;
  try {
    return JSON.parse(candidate.slice(start, end + 1));
  } catch {
    return null;
  }
}
