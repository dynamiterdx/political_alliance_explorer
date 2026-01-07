
export interface Alliance {
  id: string;
  name: string;
  fullName: string;
  description: string;
  members: string[]; // ISO 3166-1 alpha-3 codes
  color: string;
  type: 'Political' | 'Military' | 'Economic' | 'Mixed';
  yearFounded: number;
}

export interface GeopoliticalInsight {
  summary: string;
  objectives: string[];
  recentEvents: string;
  challenges: string;
}

export interface CountryGeopoliticalData {
  name: string;
  capital: string;
  population: string;
  geopoliticalStance: string;
  memberships: string[];
}
