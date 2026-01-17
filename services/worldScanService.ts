import { Conflict } from '../types';

export interface Situation {
  id: string;
  title: string;
  escalation_level: number | 'uncertain';
  trend: string;
  actors: string[];
  countries: string[];
  dominant_instrument: string;
  confidence: number;
  summary: string;
  evidence: string[];
}

export interface WorldScan {
  situations: Situation[];
  ticker: string;
  lastScannedAt: string;
}

const PRESENT_YEAR = 2026;

const clamp = (val: number, min = 0, max = 1) => Math.max(min, Math.min(max, val));

// Minimal ISO2 -> ISO3 map for present watchlist coverage
const iso2to3: Record<string, string> = {
  RU: 'RUS',
  UA: 'UKR',
  US: 'USA',
  GB: 'GBR',
  CN: 'CHN',
  TW: 'TWN',
  IN: 'IND',
  PK: 'PAK',
  IR: 'IRN',
  IQ: 'IRQ',
  SA: 'SAU',
  EG: 'EGY',
  LB: 'LBN',
  YE: 'YEM',
  VN: 'VNM',
  MY: 'MYS',
  BN: 'BRN',
  PH: 'PHL',
  KR: 'KOR',
  KP: 'PRK',
  IL: 'ISR',
  PS: 'PSE'
};

const toIso3 = (code: string) => {
  const c = code.trim().toUpperCase();
  if (c.length === 3) return c;
  if (iso2to3[c]) return iso2to3[c];
  return c; // fallback
};

export const fetchWorldScan = async (): Promise<WorldScan> => {
  const resp = await fetch('/api/worldscan');
  if (!resp.ok) throw new Error('Failed to load world scan');
  return resp.json();
};

export const refreshWorldScan = async (): Promise<WorldScan> => {
  const resp = await fetch('/api/worldscan/refresh', { method: 'POST' });
  if (!resp.ok) throw new Error('Failed to refresh world scan');
  return resp.json();
};

export const mapSituationsToConflicts = (situations: Situation[]): Conflict[] => {
  const maxLevel = 5;
  return situations
    .filter(s => s.escalation_level !== 'uncertain' && typeof s.escalation_level === 'number' && s.escalation_level > 0)
    .map(s => {
      const level = typeof s.escalation_level === 'number' ? s.escalation_level : 0;
      return {
        id: `ws-${s.id}`,
        name: s.title,
        // Use ISO country codes so map highlighting works
        participants: s.countries.slice(0, 6).map(toIso3),
        intensity: clamp(level / maxLevel),
        description: s.summary || `Escalation level ${level} (${s.trend || 'trend unknown'}).`,
        // No reliable coords in world scan; set to NaN so callouts are skipped
        coordinates: [NaN, NaN] as [number, number]
      };
    });
};

export const PRESENT_DYNAMIC_YEAR = PRESENT_YEAR;
