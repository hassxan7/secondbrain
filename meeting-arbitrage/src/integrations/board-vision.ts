/**
 * Reading a photographed whiteboard.
 *
 * This is the one place a model is allowed to produce facts rather than prose,
 * and the containment is structural: the model returns rows of `{task, names}`
 * and nothing else. It never scores anyone, never decides a fine, never sees a
 * ledger. Everything after this file is the same deterministic path a typed-in
 * tick takes — see `banksia/board.ts`, where the output is validated, matched
 * against the actual housemates, and merged additively.
 *
 * The failure mode being designed against: a model that quietly hallucinates a
 * tick against someone's name costs them nothing (the board only adds), but a
 * model that hallucinates a *missing* tick would cost them $100. Import can
 * only add, so the expensive direction is unreachable by construction rather
 * than by prompting.
 */

export const BOARD_SYSTEM = `You transcribe a photograph of a household chore whiteboard.

The board is a grid: chores down the left, people's names across the top, and a
mark (tick, cross, dot, initial, tally) where a person has done a chore.

Return JSON only, no prose, in exactly this shape:

{"rows":[{"task":"Take the bins out","cap":null,"names":["Pete","Kez"]}]}

Rules:
- One entry per chore row, in the order they appear top to bottom.
- "names" lists only the people with a mark in that row. Empty array if none.
- Copy names exactly as written on the board, including abbreviations. Do not
  expand "Kez" to "Kerry" or correct spelling — the matching happens later.
- If a row says something like "max 2x" or "x2", put that number in "cap".
  Otherwise "cap" is null.
- If a mark is ambiguous or you cannot tell whose column it is in, leave that
  name out. A missed tick is corrected in ten seconds; a wrong one is an
  argument.
- Do not invent rows or names that are not visible.`;

export interface BoardVisionOptions {
  apiKey?: string;
  model?: string;
  /** Image bytes, base64. */
  imageBase64: string;
  mediaType: 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif';
}

export interface BoardVisionResult {
  rows: { task: string; cap?: number; names: string[] }[];
}

/**
 * Send the photo, get rows back. Returns null on any failure — a house that
 * cannot upload a photo falls back to tapping the grid, which always works.
 */
export async function readBoardPhoto(
  opts: BoardVisionOptions,
): Promise<BoardVisionResult | null> {
  if (!opts.apiKey || !opts.imageBase64) return null;

  try {
    const { default: Anthropic } = await import('@anthropic-ai/sdk');
    const client = new Anthropic({ apiKey: opts.apiKey });

    const response = await client.beta.messages.create({
      model: opts.model ?? 'claude-opus-5',
      max_tokens: 2000,
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      // Transcription, not reasoning — but a grid with eight rows and seven
      // columns is where careless reading puts a tick in the wrong column, so
      // this sits above the one-line mess reader rather than at the floor.
      // Thinking bills as output, and at a few photos a week the difference is
      // cents either way.
      output_config: { effort: 'medium' },
      system: BOARD_SYSTEM,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'image',
            source: { type: 'base64', media_type: opts.mediaType, data: opts.imageBase64 },
          },
          { type: 'text', text: 'Transcribe this chore board.' },
        ],
      }],
    });

    if (response.stop_reason === 'refusal') return null;

    const text = response.content
      .map((block) => (block.type === 'text' ? block.text : ''))
      .join('')
      .trim();

    return extractJson(text);
  } catch {
    return null;
  }
}

/**
 * Pull the JSON object out of a reply, tolerating a fenced code block.
 *
 * Exported so the parse is testable without an API key — the model's exact
 * wrapping is the least stable thing about this integration.
 */
export function extractJson(text: string): BoardVisionResult | null {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const candidate = (fenced ? fenced[1] : text).trim();
  const start = candidate.indexOf('{');
  const end = candidate.lastIndexOf('}');
  if (start === -1 || end <= start) return null;

  try {
    const parsed = JSON.parse(candidate.slice(start, end + 1));
    if (!parsed || !Array.isArray(parsed.rows)) return null;
    return parsed as BoardVisionResult;
  } catch {
    return null;
  }
}
