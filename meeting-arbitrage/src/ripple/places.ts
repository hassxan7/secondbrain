/**
 * Finding real venues near the chosen hub.
 *
 * This is also the layer that closes the gap geo.ts deliberately leaves open.
 * Straight-line distance says a spread-out group should meet in Burwood; venue
 * density says a clubbing plan there will find nothing while Darlinghurst
 * returns a dozen options. `rerankHubsByVenues` lets that reality re-order the
 * travel-optimal list instead of hardcoding a bias toward the city.
 *
 * Works with no API key. Without one you get clearly-labelled sample venues so
 * the prototype is demoable; nothing is invented — sample venues carry no
 * rating or price, because a fabricated 4.6 stars is worse than a blank.
 */

import type { LatLng } from './geo.ts';
import { haversineKm } from './geo.ts';

export interface Venue {
  name: string;
  address: string;
  location?: LatLng;
  rating?: number;
  ratingCount?: number;
  /** Google's bucket: INEXPENSIVE | MODERATE | EXPENSIVE | VERY_EXPENSIVE. */
  priceLevel?: string;
  mapsUri?: string;
  openNow?: boolean;
  /** `google` is live data. `sample` is a placeholder with no invented facts. */
  source: 'google' | 'sample' | 'ripple';
}

export interface PlacesOptions {
  query: string;
  center: LatLng;
  radiusM?: number;
  /** Per-person budget in AUD, used to pick Google price buckets. */
  budgetAud?: number;
  maxResults?: number;
  apiKey?: string;
  /** Injectable for tests. Defaults to global fetch. */
  fetchImpl?: typeof fetch;
}

const PLACES_ENDPOINT = 'https://places.googleapis.com/v1/places:searchText';

const FIELD_MASK = [
  'places.displayName',
  'places.formattedAddress',
  'places.location',
  'places.rating',
  'places.userRatingCount',
  'places.priceLevel',
  'places.googleMapsUri',
  'places.currentOpeningHours.openNow',
].join(',');

/** Map a per-person budget onto the price buckets worth searching. */
export function priceLevelsForBudget(budgetAud: number): string[] {
  if (budgetAud < 20) return ['PRICE_LEVEL_FREE', 'PRICE_LEVEL_INEXPENSIVE'];
  if (budgetAud < 45) return ['PRICE_LEVEL_FREE', 'PRICE_LEVEL_INEXPENSIVE', 'PRICE_LEVEL_MODERATE'];
  if (budgetAud < 80) {
    return ['PRICE_LEVEL_INEXPENSIVE', 'PRICE_LEVEL_MODERATE', 'PRICE_LEVEL_EXPENSIVE'];
  }
  return ['PRICE_LEVEL_MODERATE', 'PRICE_LEVEL_EXPENSIVE', 'PRICE_LEVEL_VERY_EXPENSIVE'];
}

/**
 * Search for venues. Falls back to labelled samples when no key is configured
 * or the call fails — a planning tool that returns nothing because a key
 * expired is worse than one that says "here's the shape of the answer".
 */
export async function searchVenues(opts: PlacesOptions): Promise<Venue[]> {
  const maxResults = opts.maxResults ?? 5;
  if (!opts.apiKey) return sampleVenues(opts.query, maxResults);

  const body: Record<string, unknown> = {
    textQuery: opts.query,
    maxResultCount: maxResults,
    locationBias: {
      circle: {
        center: { latitude: opts.center.lat, longitude: opts.center.lng },
        radius: opts.radiusM ?? 2500,
      },
    },
  };
  if (opts.budgetAud !== undefined) body.priceLevels = priceLevelsForBudget(opts.budgetAud);

  try {
    const doFetch = opts.fetchImpl ?? fetch;
    const res = await doFetch(PLACES_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': opts.apiKey,
        'X-Goog-FieldMask': FIELD_MASK,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) return sampleVenues(opts.query, maxResults);

    const json = await res.json() as { places?: GooglePlace[] };
    const places = json.places ?? [];
    if (places.length === 0) return [];
    return places.map(toVenue);
  } catch {
    // Network trouble should degrade the plan, not break it.
    return sampleVenues(opts.query, maxResults);
  }
}

interface GooglePlace {
  displayName?: { text?: string };
  formattedAddress?: string;
  location?: { latitude: number; longitude: number };
  rating?: number;
  userRatingCount?: number;
  priceLevel?: string;
  googleMapsUri?: string;
  currentOpeningHours?: { openNow?: boolean };
}

function toVenue(p: GooglePlace): Venue {
  return {
    name: p.displayName?.text ?? 'Unnamed venue',
    address: p.formattedAddress ?? '',
    location: p.location
      ? { lat: p.location.latitude, lng: p.location.longitude }
      : undefined,
    rating: p.rating,
    ratingCount: p.userRatingCount,
    priceLevel: p.priceLevel?.replace('PRICE_LEVEL_', ''),
    mapsUri: p.googleMapsUri,
    openNow: p.currentOpeningHours?.openNow,
    source: 'google',
  };
}

/**
 * Placeholders used when no key is configured.
 *
 * Names only. No ratings, no prices, no addresses — inventing those would make
 * a demo look live when it is not, and someone would eventually turn up at a
 * venue that does not exist.
 */
function sampleVenues(query: string, count: number): Venue[] {
  return Array.from({ length: Math.min(count, 3) }, (_, i) => ({
    name: `Sample ${query} venue ${i + 1}`,
    address: 'Connect a Google Places key for live venues',
    source: 'sample' as const,
  }));
}

export interface HubVenueScore<T extends { hubKey: string; location: LatLng; cost: number }> {
  hub: T;
  venues: Venue[];
  /** How many real venues the activity found here. */
  density: number;
  adjustedCost: number;
}

/**
 * Re-rank travel-optimal hubs by whether the activity actually exists there.
 *
 * A hub with no venues for the chosen activity is not a candidate, however
 * central it is. This is what makes a clubbing plan drift to Darlinghurst and
 * a yum cha plan drift to Haymarket, without either being hardcoded.
 */
export async function rerankHubsByVenues<
  T extends { hubKey: string; location: LatLng; cost: number },
>(
  hubs: T[],
  query: string,
  opts: Omit<PlacesOptions, 'query' | 'center'>,
): Promise<Array<HubVenueScore<T>>> {
  const scored = await Promise.all(
    hubs.map(async (hub) => {
      const venues = await searchVenues({ ...opts, query, center: hub.location });
      const density = venues.filter((v) => v.source === 'google').length;
      // Each real option shaves a little off the effective cost, with
      // diminishing returns — ten bars is not twice as good as five.
      const bonus = density > 0 ? 12 * Math.log1p(density) : 0;
      const noVenuePenalty = venues.length === 0 ? 1000 : 0;
      return {
        hub, venues, density,
        adjustedCost: Math.round((hub.cost - bonus + noVenuePenalty) * 10) / 10,
      };
    }),
  );

  return scored.sort((a, b) => a.adjustedCost - b.adjustedCost);
}

/** Nearest venue to a point, for "meet here" pins. */
export function nearestVenue(venues: Venue[], to: LatLng): Venue | null {
  const located = venues.filter((v) => v.location);
  if (located.length === 0) return venues[0] ?? null;
  return located.reduce((best, v) =>
    haversineKm(v.location!, to) < haversineKm(best.location!, to) ? v : best);
}
