export interface GeoJSONFeature {
  type: string;
  id?: string;
  properties: {
    name: string;
    id?: string;
    iso_a3?: string;
    [key: string]: any;
  };
  geometry: {
    type: string;
    coordinates: any[];
  };
}

export interface GeoJSONData {
  type: string;
  features: GeoJSONFeature[];
}

export enum LayerType {
  ALLIANCES = 'ALLIANCES',
  CONFLICTS = 'CONFLICTS',
  ECONOMIC = 'ECONOMIC'
}

export interface Alliance {
  id: string;
  name: string;
  members: string[]; // ISO A3 codes
  color: string;
  description: string;
  type: string;      // e.g., "Military", "Economic", "Intelligence"
  status: string;    // e.g., "Active", "Collapsing", "Forming"
}

export interface Conflict {
  id: string;
  name: string;
  participants: string[]; // ISO A3 codes
  intensity: number; // 0-1
  description: string;
  coordinates: [number, number]; // Lat/Lng center for visualization
}

export interface GeopoliticalState {
  year: number;
  alliances: Alliance[];
  conflicts: Conflict[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isThinking?: boolean;
}