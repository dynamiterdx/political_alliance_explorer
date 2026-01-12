import { Conflict } from '../types';

export interface GdeltEvent {
  id: string;
  day: string;
  actor1: string;
  actor2: string;
  goldstein: number;
  tone: number;
  lat: number | null;
  lon: number | null;
}

export interface LiveSignals {
  conflicts: Conflict[];
  ticker: string;
  fetchedAt: string;
}

const PRESENT_YEAR = 2024;

const clamp = (val: number, min = 0, max = 1) => Math.max(min, Math.min(max, val));

const normalizeIso = (code: string) => code.trim().toUpperCase().slice(0, 3);

export const fetchLiveSignals = async (): Promise<LiveSignals> => {
  const resp = await fetch('/api/gdelt/events');
  if (!resp.ok) {
    throw new Error('Failed to fetch GDELT events');
  }

  const data = await resp.json();
  const events: GdeltEvent[] = (data.events || []).map((e: any) => ({
    ...e,
    actor1: normalizeIso(e.actor1),
    actor2: normalizeIso(e.actor2),
    goldstein: Number(e.goldstein) || 0,
    tone: Number(e.tone) || 0,
    lat: e.lat === null || isNaN(Number(e.lat)) ? null : Number(e.lat),
    lon: e.lon === null || isNaN(Number(e.lon)) ? null : Number(e.lon)
  }));

  const hostilityByPair: Record<string, { a: string; b: string; score: number; count: number; lat?: number; lon?: number }> = {};

  events.forEach(ev => {
    // Hostility signal: negative GoldsteinScale or strongly negative tone
    const hostility = Math.max(0, -ev.goldstein) + Math.max(0, -ev.tone / 3);
    if (hostility <= 0) return;

    const sorted = [ev.actor1, ev.actor2].sort();
    const key = `${sorted[0]}-${sorted[1]}`;
    const existing = hostilityByPair[key] || { a: sorted[0], b: sorted[1], score: 0, count: 0, lat: undefined, lon: undefined };
    existing.score += hostility;
    existing.count += 1;

    if (ev.lat != null && ev.lon != null) {
      // Simple running average of coordinates
      if (existing.lat == null || existing.lon == null) {
        existing.lat = ev.lat;
        existing.lon = ev.lon;
      } else {
        existing.lat = (existing.lat * (existing.count - 1) + ev.lat) / existing.count;
        existing.lon = (existing.lon * (existing.count - 1) + ev.lon) / existing.count;
      }
    }

    hostilityByPair[key] = existing;
  });

  const pairs = Object.values(hostilityByPair).sort((a, b) => b.score - a.score);
  const topPairs = pairs.slice(0, 8);
  const maxScore = Math.max(...topPairs.map(p => p.score), 1);

  const conflicts: Conflict[] = topPairs.map(pair => ({
    id: `gdelt-${pair.a}-${pair.b}`,
    name: `${pair.a} – ${pair.b} friction`,
    participants: [pair.a, pair.b],
    intensity: clamp(pair.score / maxScore),
    description: `Derived from ${pair.count} hostile events in the latest GDELT window.`,
    coordinates: [
      pair.lon ?? 0,
      pair.lat ?? 0
    ]
  }));

  const ticker = pairs.slice(0, 3).map(p => {
    const change = p.score > 5 ? 'escalating' : 'active';
    return `${p.a} ↔ ${p.b}: ${change} (${p.count} hostile signals)`;
  }).join(' • ') || 'No significant hostile signals detected in the latest window.';

  return {
    conflicts,
    ticker,
    fetchedAt: data.fetchedAt || new Date().toISOString()
  };
};

export const PRESENT_DYNAMIC_YEAR = 2026;
