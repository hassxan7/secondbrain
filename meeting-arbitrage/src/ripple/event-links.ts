/**
 * Pasting an existing event into a plan.
 *
 * Someone drops a Luma or Partiful link into the group and it becomes an
 * option on the plan like any other — subject to the same coverage rule, so
 * everyone still gets asked before it can win.
 *
 * Two things are deliberately separated here:
 *
 *   parseEventUrl   Pure. Recognises the platform and pulls a stable id out of
 *                   the URL. Never touches the network, so it is safe to run on
 *                   anything a user pastes and is trivially testable.
 *   fetchEventMeta  Reads the page's Open Graph tags for a title and time.
 *
 * The split matters for more than tidiness. A server that fetches whatever URL
 * a user hands it is a server-side request forgery hole: paste
 * `http://169.254.169.254/latest/meta-data/` and a naive implementation will
 * happily retrieve cloud credentials and hand them back. So fetching is gated
 * on the parse succeeding, which only happens for an allow-listed public event
 * host — never an arbitrary URL, an IP literal, or a private address.
 */

import type { Activity, ActivityCategory } from './activities.ts';

export type EventPlatform = 'luma' | 'partiful' | 'eventbrite' | 'humanitix' | 'meetup';

export interface ParsedEventUrl {
  platform: EventPlatform;
  /** Stable per-platform id, used to dedupe re-pastes of the same event. */
  sourceId: string;
  /** Normalised https URL with tracking parameters stripped. */
  canonicalUrl: string;
}

interface HostRule {
  platform: EventPlatform;
  hosts: string[];
  /** Pull the id out of the path. Return null if the path is not an event. */
  extract: (path: string) => string | null;
}

const RULES: HostRule[] = [
  {
    platform: 'luma',
    hosts: ['lu.ma', 'www.lu.ma', 'luma.com', 'www.luma.com'],
    // lu.ma/abc123, and luma.com/e/abc123
    extract: (p) => {
      const m = p.match(/^\/(?:e\/)?([A-Za-z0-9-]{3,64})\/?$/);
      return m ? m[1] : null;
    },
  },
  {
    platform: 'partiful',
    hosts: ['partiful.com', 'www.partiful.com'],
    extract: (p) => {
      const m = p.match(/^\/e\/([A-Za-z0-9_-]{3,64})\/?$/);
      return m ? m[1] : null;
    },
  },
  {
    platform: 'eventbrite',
    hosts: [
      'eventbrite.com', 'www.eventbrite.com',
      'eventbrite.com.au', 'www.eventbrite.com.au',
    ],
    // .../some-event-title-tickets-1234567890
    extract: (p) => {
      const m = p.match(/-(\d{8,20})\/?$/);
      return m ? m[1] : null;
    },
  },
  {
    platform: 'humanitix',
    hosts: ['humanitix.com', 'www.humanitix.com', 'events.humanitix.com'],
    extract: (p) => {
      const m = p.match(/^\/([A-Za-z0-9-]{3,120})\/?$/);
      return m ? m[1] : null;
    },
  },
  {
    platform: 'meetup',
    hosts: ['meetup.com', 'www.meetup.com'],
    extract: (p) => {
      const m = p.match(/^\/[^/]+\/events\/(\d{6,20})\/?$/);
      return m ? m[1] : null;
    },
  },
];

/** Query parameters that only ever carry attribution noise. */
const STRIP_PARAMS = /^(utm_|fbclid|gclid|igshid|ref|source|mc_|_ga)/i;

/**
 * Recognise a pasted event link. Returns null for anything unrecognised,
 * which is also what keeps `fetchEventMeta` from touching arbitrary hosts.
 */
export function parseEventUrl(raw: string): ParsedEventUrl | null {
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    return null;
  }

  if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;

  const host = url.hostname.toLowerCase();
  const rule = RULES.find((r) => r.hosts.includes(host));
  if (!rule) return null;

  const sourceId = rule.extract(url.pathname);
  if (!sourceId) return null;

  const canonical = new URL(`https://${host}${url.pathname.replace(/\/$/, '')}`);
  for (const [key, value] of url.searchParams) {
    if (!STRIP_PARAMS.test(key)) canonical.searchParams.set(key, value);
  }

  return { platform: rule.platform, sourceId, canonicalUrl: canonical.toString() };
}

export interface EventMeta {
  title?: string;
  description?: string;
  imageUrl?: string;
  startsAt?: string;
}

const OG = /<meta[^>]+(?:property|name)=["'](og:[a-z:]+|description)["'][^>]+content=["']([^"']*)["'][^>]*>/gi;
const OG_REVERSED = /<meta[^>]+content=["']([^"']*)["'][^>]+(?:property|name)=["'](og:[a-z:]+|description)["'][^>]*>/gi;

/**
 * Read Open Graph tags off the event page.
 *
 * Only ever called with a `parseEventUrl` result, so the host is already known
 * good. Failure is not an error — a link with no readable title still becomes
 * an option, it just shows as the platform name until someone renames it.
 */
export async function fetchEventMeta(
  parsed: ParsedEventUrl, fetchImpl: typeof fetch = fetch,
): Promise<EventMeta> {
  try {
    const res = await fetchImpl(parsed.canonicalUrl, {
      headers: { accept: 'text/html' },
      redirect: 'follow',
    });
    if (!res.ok) return {};

    const html = (await res.text()).slice(0, 200_000);
    const found: Record<string, string> = {};
    for (const re of [OG, OG_REVERSED]) {
      re.lastIndex = 0;
      for (const m of html.matchAll(re)) {
        const [key, value] = re === OG ? [m[1], m[2]] : [m[2], m[1]];
        if (!found[key]) found[key] = decodeEntities(value);
      }
    }

    // Only include keys that were actually found. Emitting explicit `undefined`
    // makes an empty result look populated to anything comparing shapes.
    const meta: EventMeta = {};
    const title = found['og:title'];
    const description = found['og:description'] ?? found.description;
    const imageUrl = found['og:image'];
    const startsAt = found['og:start_time'] ?? found['event:start_time'];
    if (title) meta.title = title;
    if (description) meta.description = description;
    if (imageUrl) meta.imageUrl = imageUrl;
    if (startsAt) meta.startsAt = startsAt;
    return meta;
  } catch {
    return {};
  }
}

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#0?39;|&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)));
}

const PLATFORM_LABEL: Record<EventPlatform, string> = {
  luma: 'Luma', partiful: 'Partiful', eventbrite: 'Eventbrite',
  humanitix: 'Humanitix', meetup: 'Meetup',
};

export function platformLabel(platform: EventPlatform): string {
  return PLATFORM_LABEL[platform];
}

/**
 * Turn a pasted link into an option the plan can vote on.
 *
 * Cost defaults to the group's ceiling rather than zero: a ticketed event whose
 * price we could not read should not look free and quietly blow the budget.
 * Whoever pasted it can correct the number, and the UI marks it as an estimate.
 */
export function toActivity(
  parsed: ParsedEventUrl, meta: EventMeta, fallbackCostAud: number,
): Activity {
  const title = (meta.title ?? '').trim();
  return {
    id: `link-${parsed.platform}-${parsed.sourceId}`,
    label: title.length > 0 ? truncate(title, 42) : `${platformLabel(parsed.platform)} event`,
    emoji: '🎟️',
    estCostAud: Math.max(0, Math.round(fallbackCostAud)),
    durationMins: 150,
    category: 'culture' as ActivityCategory,
    placesQuery: '',
    timeOfDay: 'night',
    sequenceRank: 3,
    tags: ['link', parsed.platform],
    rippleEvent: false,
  };
}

function truncate(s: string, max: number): string {
  return s.length <= max ? s : `${s.slice(0, max - 1).trimEnd()}…`;
}

/**
 * What gets written to Ripple's own directory when someone pastes a link.
 *
 * Held as `pending_review` rather than published: the directory is a curated
 * surface, and anyone with a link would otherwise be able to write to it.
 * Crawling these hosts for listings is a separate job and deliberately not
 * done here — this only records what a real user chose to bring in.
 */
export interface DirectorySubmission {
  platform: EventPlatform;
  sourceId: string;
  canonicalUrl: string;
  title: string;
  imageUrl?: string;
  submittedBy: string;
  status: 'pending_review';
}

export function toDirectorySubmission(
  parsed: ParsedEventUrl, meta: EventMeta, submittedBy: string,
): DirectorySubmission {
  return {
    platform: parsed.platform,
    sourceId: parsed.sourceId,
    canonicalUrl: parsed.canonicalUrl,
    title: (meta.title ?? `${platformLabel(parsed.platform)} event`).trim(),
    imageUrl: meta.imageUrl,
    submittedBy,
    status: 'pending_review',
  };
}
