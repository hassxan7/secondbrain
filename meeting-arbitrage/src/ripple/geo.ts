/**
 * Where in Sydney, and how far is that for everyone.
 *
 * The hard part of a Sydney hangout is not the calendar, it is that seven
 * people live along four different train lines. "Meet in the city" is the
 * usual answer and often the right one, but it is right for a reason —
 * the CBD minimises *total* travel when a group is spread out — and it is
 * plainly wrong when everyone already lives in the inner west.
 *
 * So rather than defaulting to Town Hall, this ranks real venue districts by
 * what they cost the group in travel, and lets the CBD win on merit when it
 * deserves to.
 */

export interface Suburb {
  name: string;
  lat: number;
  lng: number;
  /** A district with actual venues and transport — a candidate meeting area. */
  hub?: boolean;
}

/**
 * Approximate suburb centroids. Good to a few hundred metres, which is well
 * inside the noise of "how long does it take to get there".
 */
export const SUBURBS: Record<string, Suburb> = {
  'sydney-cbd':      { name: 'Sydney CBD',      lat: -33.8688, lng: 151.2093, hub: true },
  'haymarket':       { name: 'Haymarket',       lat: -33.8797, lng: 151.2044, hub: true },
  'surry-hills':     { name: 'Surry Hills',     lat: -33.8845, lng: 151.2119, hub: true },
  'darlinghurst':    { name: 'Darlinghurst',    lat: -33.8797, lng: 151.2199, hub: true },
  'potts-point':     { name: 'Potts Point',     lat: -33.8697, lng: 151.2255 },
  'newtown':         { name: 'Newtown',         lat: -33.8963, lng: 151.1794, hub: true },
  'enmore':          { name: 'Enmore',          lat: -33.8983, lng: 151.1738 },
  'erskineville':    { name: 'Erskineville',    lat: -33.9028, lng: 151.1859 },
  'st-peters':       { name: 'St Peters',       lat: -33.9114, lng: 151.1810 },
  'redfern':         { name: 'Redfern',         lat: -33.8926, lng: 151.2043 },
  'chippendale':     { name: 'Chippendale',     lat: -33.8886, lng: 151.1985 },
  'ultimo':          { name: 'Ultimo',          lat: -33.8797, lng: 151.1976 },
  'pyrmont':         { name: 'Pyrmont',         lat: -33.8700, lng: 151.1950 },
  'glebe':           { name: 'Glebe',           lat: -33.8796, lng: 151.1867 },
  'camperdown':      { name: 'Camperdown',      lat: -33.8895, lng: 151.1750 },
  'leichhardt':      { name: 'Leichhardt',      lat: -33.8836, lng: 151.1560 },
  'balmain':         { name: 'Balmain',         lat: -33.8578, lng: 151.1795 },
  'marrickville':    { name: 'Marrickville',    lat: -33.9111, lng: 151.1547, hub: true },
  'dulwich-hill':    { name: 'Dulwich Hill',    lat: -33.9047, lng: 151.1394 },
  'ashfield':        { name: 'Ashfield',        lat: -33.8886, lng: 151.1256 },
  'burwood':         { name: 'Burwood',         lat: -33.8776, lng: 151.1039, hub: true },
  'strathfield':     { name: 'Strathfield',     lat: -33.8736, lng: 151.0951 },
  'homebush':        { name: 'Homebush',        lat: -33.8657, lng: 151.0827 },
  'lidcombe':        { name: 'Lidcombe',        lat: -33.8646, lng: 151.0442 },
  'auburn':          { name: 'Auburn',          lat: -33.8496, lng: 151.0329 },
  'parramatta':      { name: 'Parramatta',      lat: -33.8150, lng: 151.0011, hub: true },
  'rhodes':          { name: 'Rhodes',          lat: -33.8306, lng: 151.0870 },
  'ryde':            { name: 'Ryde',            lat: -33.8148, lng: 151.1055 },
  'macquarie-park':  { name: 'Macquarie Park',  lat: -33.7772, lng: 151.1246 },
  'epping':          { name: 'Epping',          lat: -33.7726, lng: 151.0817 },
  'hornsby':         { name: 'Hornsby',         lat: -33.7048, lng: 151.0993 },
  'chatswood':       { name: 'Chatswood',       lat: -33.7969, lng: 151.1803, hub: true },
  'north-sydney':    { name: 'North Sydney',    lat: -33.8390, lng: 151.2070, hub: true },
  'neutral-bay':     { name: 'Neutral Bay',     lat: -33.8320, lng: 151.2180 },
  'manly':           { name: 'Manly',           lat: -33.7969, lng: 151.2874, hub: true },
  'bondi-junction':  { name: 'Bondi Junction',  lat: -33.8912, lng: 151.2504, hub: true },
  'bondi-beach':     { name: 'Bondi Beach',     lat: -33.8908, lng: 151.2743 },
  'coogee':          { name: 'Coogee',          lat: -33.9205, lng: 151.2540 },
  'randwick':        { name: 'Randwick',        lat: -33.9146, lng: 151.2437 },
  'kensington':      { name: 'Kensington',      lat: -33.9089, lng: 151.2226 },
  'kingsford':       { name: 'Kingsford',       lat: -33.9245, lng: 151.2280 },
  'zetland':         { name: 'Zetland',         lat: -33.9066, lng: 151.2087 },
  'waterloo':        { name: 'Waterloo',        lat: -33.8990, lng: 151.2090 },
  'alexandria':      { name: 'Alexandria',      lat: -33.9007, lng: 151.1954 },
  'mascot':          { name: 'Mascot',          lat: -33.9235, lng: 151.1889 },
  'rockdale':        { name: 'Rockdale',        lat: -33.9522, lng: 151.1379 },
  'kogarah':         { name: 'Kogarah',         lat: -33.9633, lng: 151.1345 },
  'hurstville':      { name: 'Hurstville',      lat: -33.9673, lng: 151.1027, hub: true },
  'bankstown':       { name: 'Bankstown',       lat: -33.9171, lng: 151.0349 },
  'liverpool':       { name: 'Liverpool',       lat: -33.9203, lng: 150.9238, hub: true },
};

export interface LatLng { lat: number; lng: number }

const R_EARTH_KM = 6371;
const toRad = (deg: number) => (deg * Math.PI) / 180;
const toDeg = (rad: number) => (rad * 180) / Math.PI;

export function haversineKm(a: LatLng, b: LatLng): number {
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R_EARTH_KM * Math.asin(Math.min(1, Math.sqrt(h)));
}

/** Spherical mean of points. Overkill for one city, but it never surprises you. */
export function centroid(points: LatLng[]): LatLng {
  if (points.length === 0) throw new RangeError('centroid of nothing');
  let x = 0, y = 0, z = 0;
  for (const p of points) {
    const lat = toRad(p.lat);
    const lng = toRad(p.lng);
    x += Math.cos(lat) * Math.cos(lng);
    y += Math.cos(lat) * Math.sin(lng);
    z += Math.sin(lat);
  }
  const n = points.length;
  x /= n; y /= n; z /= n;
  const hyp = Math.sqrt(x * x + y * y);
  return { lat: toDeg(Math.atan2(z, hyp)), lng: toDeg(Math.atan2(y, x)) };
}

/**
 * Rough door-to-door minutes on Sydney public transport.
 *
 * Piecewise because the modes differ: under ~2km you walk, mid-range is buses
 * and light rail with real waiting, longer trips are trains that are fast once
 * you are on them but cost you at both ends. Swap this for the Google
 * Directions API when a key is configured; the shape of the answer is the same.
 */
export function estimateTravelMinutes(km: number): number {
  // Each segment starts where the previous one ended, so the curve is
  // continuous. An earlier version restarted each band from its own intercept,
  // which made 2.1km score faster than 2.0km and quietly corrupted hub ranking
  // for anyone sitting near a boundary.
  const WALK_END_KM = 2;
  const MID_END_KM = 8;

  if (km <= WALK_END_KM) return Math.round(5 + km * 7.5);          // on foot

  const atWalkEnd = 5 + WALK_END_KM * 7.5;                          // 20 min
  if (km <= MID_END_KM) return Math.round(atWalkEnd + (km - WALK_END_KM) * 2.5);

  const atMidEnd = atWalkEnd + (MID_END_KM - WALK_END_KM) * 2.5;    // 35 min
  return Math.round(atMidEnd + (km - MID_END_KM) * 1.2);            // train
}

export interface Member {
  id: string;
  name: string;
  /** Key into SUBURBS. */
  suburb: string;
}

export interface TravelBreakdown {
  memberId: string;
  km: number;
  minutes: number;
}

export interface HubRanking {
  hubKey: string;
  name: string;
  location: LatLng;
  perMember: TravelBreakdown[];
  totalMinutes: number;
  meanMinutes: number;
  /** The worst single journey. This is what makes people bail. */
  maxMinutes: number;
  /** max - min. High spread means one person is carrying the trip. */
  spreadMinutes: number;
  /** Distance from the group's true centre of mass. */
  kmFromCentroid: number;
  /** Ranking cost: total travel plus a penalty for making one person carry it. */
  cost: number;
}

/**
 * How hard to punish an unequal trip.
 *
 * Ranking on total travel alone lets a hub win simply by being somebody's
 * doorstep, handing the longest journey to whoever lives furthest out — and
 * that person is exactly the one who ends up bailing. This charges for the gap
 * between the worst journey and the average one.
 */
export const FAIRNESS_WEIGHT = 2;

export function resolveSuburb(key: string): Suburb {
  const s = SUBURBS[key];
  if (!s) throw new RangeError(`unknown suburb: ${key}`);
  return s;
}

export function groupCentroid(members: Member[]): LatLng {
  return centroid(members.map((m) => resolveSuburb(m.suburb)));
}

/**
 * Rank candidate meeting areas for this group.
 *
 * Ordered by `cost` — total travel plus a penalty for handing one person a
 * disproportionate trip. Note that this is straight-line distance, so it
 * measures geography, not Sydney's rail topology: a spread-out group scores
 * best around Burwood or Strathfield, which is genuinely where the middle is,
 * even though such a group usually ends up in the city.
 *
 * That gap is deliberate and is closed downstream rather than fudged here.
 * The city wins in practice for two reasons this layer cannot see — every
 * train line converges there, and it has the venues. Venue density is settled
 * by places.ts, which drops a hub where the chosen activity does not exist
 * (a clubbing plan finds nothing in Burwood and plenty in Darlinghurst).
 * Swapping estimateTravelMinutes for the Directions API closes the other half.
 */
export function rankHubs(members: Member[], limit = 6): HubRanking[] {
  if (members.length === 0) return [];
  const centre = groupCentroid(members);

  const hubs = Object.entries(SUBURBS).filter(([, s]) => s.hub);

  return hubs
    .map(([hubKey, hub]) => {
      const perMember = members.map((m) => {
        const home = resolveSuburb(m.suburb);
        const km = haversineKm(home, hub);
        return { memberId: m.id, km: round(km, 2), minutes: estimateTravelMinutes(km) };
      });
      const minutes = perMember.map((p) => p.minutes);
      const totalMinutes = minutes.reduce((a, b) => a + b, 0);
      const meanMinutes = totalMinutes / members.length;
      const maxMinutes = Math.max(...minutes);

      return {
        hubKey, name: hub.name, location: { lat: hub.lat, lng: hub.lng },
        perMember, totalMinutes,
        meanMinutes: round(meanMinutes, 1),
        maxMinutes,
        spreadMinutes: maxMinutes - Math.min(...minutes),
        kmFromCentroid: round(haversineKm(centre, hub), 2),
        cost: round(totalMinutes + FAIRNESS_WEIGHT * (maxMinutes - meanMinutes), 1),
      };
    })
    .sort((a, b) => a.cost - b.cost || a.maxMinutes - b.maxMinutes)
    .slice(0, limit);
}

function round(n: number, dp: number): number {
  const f = 10 ** dp;
  return Math.round(n * f) / f;
}
