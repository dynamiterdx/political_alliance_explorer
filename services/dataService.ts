import { GeopoliticalState, Alliance, Conflict } from '../types';

// --- Membership Definitions (Modern ISO Codes) ---

// Western / Euro-Atlantic
const NATO_MEMBERS = ["USA", "CAN", "GBR", "FRA", "DEU", "ITA", "TUR", "ESP", "POL", "NOR", "NLD", "BEL", "DNK", "PRT", "GRC", "CZE", "HUN", "ROU", "BGR", "EST", "LVA", "LTU", "SVK", "SVN", "ALB", "HRV", "MNE", "MKD", "FIN", "SWE", "ISL"];
const EU_MEMBERS = ["AUT", "BEL", "BGR", "HRV", "CYP", "CZE", "DNK", "EST", "FIN", "FRA", "DEU", "GRC", "HUN", "IRL", "ITA", "LVA", "LTU", "LUX", "MLT", "NLD", "POL", "PRT", "ROU", "SVK", "SVN", "ESP", "SWE"];
const FIVE_EYES = ["USA", "GBR", "CAN", "AUS", "NZL"];
const AUKUS_MEMBERS = ["AUS", "GBR", "USA"];

// Americas
const USMCA_MEMBERS = ["USA", "CAN", "MEX"]; // NAFTA
const MERCOSUR_MEMBERS = ["ARG", "BRA", "PRY", "URY", "BOL", "VEN"]; // Venezuela suspended in reality, but historically relevant
const OAS_MEMBERS = ["ATG", "ARG", "BHS", "BRB", "BLZ", "BOL", "BRA", "CAN", "CHL", "COL", "CRI", "CUB", "DMA", "DOM", "ECU", "SLV", "GRD", "GTM", "GUY", "HTI", "HND", "JAM", "MEX", "NIC", "PAN", "PRY", "PER", "KNA", "LCA", "VCT", "SUR", "TTO", "USA", "URY", "VEN"];
const RIO_PACT = ["ARG", "BHS", "BRA", "CHL", "COL", "CRI", "DOM", "SLV", "GTM", "HTI", "HND", "PAN", "PRY", "PER", "TTO", "USA", "URY", "VEN"];

// Asian / Eurasian
const ASEAN_MEMBERS = ["IDN", "MYS", "PHL", "SGP", "THA", "BRN", "VNM", "LAO", "MMR", "KHM"];
const SCO_MEMBERS = ["CHN", "KAZ", "KGZ", "RUS", "TJK", "UZB", "IND", "PAK", "IRN"]; // Shanghai Cooperation Org
const CSTO_MEMBERS = ["ARM", "BLR", "KAZ", "KGZ", "RUS", "TJK"];
const QUAD_MEMBERS = ["USA", "JPN", "IND", "AUS"];
const GCC_MEMBERS = ["BHR", "KWT", "OMN", "QAT", "SAU", "ARE"]; // Gulf Cooperation Council
const TURKIC_MEMBERS = ["AZE", "KAZ", "KGZ", "TUR", "UZB"]; // Organization of Turkic States

// Asia-Pacific Trade
const RCEP_MEMBERS = ["AUS", "BRN", "KHM", "CHN", "IDN", "JPN", "KOR", "LAO", "MYS", "MMR", "NZL", "PHL", "SGP", "THA", "VNM"];
const CPTPP_MEMBERS = ["AUS", "BRN", "CAN", "CHL", "JPN", "MYS", "MEX", "NZL", "PER", "SGP", "VNM", "GBR"];

// Global South / Africa
const BRICS_MEMBERS = ["BRA", "RUS", "IND", "CHN", "ZAF", "EGY", "ETH", "IRN", "ARE", "SAU"];
const OPEC_MEMBERS = ["DZA", "COG", "GNQ", "GAB", "IRN", "IRQ", "KWT", "LBY", "NGA", "SAU", "ARE", "VEN"];
const AU_MEMBERS = ["DZA", "AGO", "BEN", "BWA", "BFA", "BDI", "CMR", "CPV", "CAF", "TCD", "COM", "COD", "DJI", "EGY", "GNQ", "ERI", "ETH", "GAB", "GMB", "GHA", "GIN", "GNB", "CIV", "KEN", "LSO", "LBR", "LBY", "MDG", "MWI", "MLI", "MRT", "MUS", "MAR", "MOZ", "NAM", "NER", "NGA", "RWA", "STP", "SEN", "SYC", "SLE", "SOM", "ZAF", "SSD", "SDN", "SWZ", "TZA", "TGO", "TUN", "UGA", "ZMB", "ZWE"];
const ECOWAS_MEMBERS = ["BEN", "BFA", "CPV", "CIV", "GMB", "GHA", "GIN", "GNB", "LBR", "MLI", "NER", "NGA", "SEN", "SLE", "TGO"];
const EAC_MEMBERS = ["BDI", "COD", "KEN", "RWA", "SSD", "TZA", "UGA", "SOM"];
const SADC_MEMBERS = ["AGO", "BWA", "COM", "COD", "SWZ", "LSO", "MDG", "MWI", "MUS", "MOZ", "NAM", "SYC", "ZAF", "TZA", "ZMB", "ZWE"];
const ARAB_LEAGUE = ["DZA", "BHR", "COM", "DJI", "EGY", "IRQ", "JOR", "KWT", "LBN", "LBY", "MRT", "MAR", "OMN", "PSE", "QAT", "SAU", "SOM", "SDN", "SYR", "TUN", "ARE", "YEM"];

// Historical Groups (Approximated)
const TRIPLE_ENTENTE = ["FRA", "GBR", "RUS", "IRL"]; 
const CENTRAL_POWERS = ["DEU", "AUT", "HUN", "TUR", "BGR"];
const AXIS_POWERS = ["DEU", "ITA", "JPN", "HUN", "ROU", "BGR", "FIN", "THA"];
const ALLIES_WW2 = ["GBR", "FRA", "USA", "RUS", "CAN", "AUS", "NZL", "POL", "ZAF", "BRA", "MEX", "CHN", "NLD", "BEL", "NOR", "GRC", "YUG"];
const WARSAW_PACT = ["RUS", "POL", "DEU", "CZE", "SVK", "HUN", "ROU", "BGR", "ALB"];
const SEATO_MEMBERS = ["USA", "FRA", "GBR", "NZL", "AUS", "PHL", "THA", "PAK"]; // Southeast Asia Treaty Org
const CENTO_MEMBERS = ["GBR", "IRQ", "TUR", "IRN", "PAK"]; // Baghdad Pact
const NAM_MEMBERS_1960 = ["IND", "IDN", "EGY", "YUG", "GHA", "LKA", "CUB", "AFG", "MMR", "KHM", "ETH"];
const EEC_ORIGINAL = ["BEL", "FRA", "DEU", "ITA", "LUX", "NLD"];

// --- Data Structure ---

export const HISTORICAL_DATA: Record<number, GeopoliticalState> = {
  2026: {
    year: 2026,
    alliances: [
      { id: 'nato', name: 'NATO', members: NATO_MEMBERS, color: '#3b82f6', description: 'North Atlantic Treaty Organization (Expanded)', type: 'Military', status: 'Active' },
      { id: 'brics', name: 'BRICS+', members: BRICS_MEMBERS, color: '#eab308', description: 'Global South Economic & Political Bloc', type: 'Economic & Political', status: 'Expanding' },
      { id: 'eu', name: 'European Union', members: EU_MEMBERS, color: '#6366f1', description: 'European Political Union', type: 'Political & Economic', status: 'Active' },
      { id: 'sco', name: 'SCO', members: SCO_MEMBERS, color: '#dc2626', description: 'Shanghai Cooperation Organization (Eurasian Security)', type: 'Security', status: 'Active' },
      { id: 'aukus', name: 'AUKUS', members: AUKUS_MEMBERS, color: '#06b6d4', description: 'Trilateral Security Partnership', type: 'Military Technology', status: 'Active' },
      { id: 'quad', name: 'The Quad', members: QUAD_MEMBERS, color: '#0ea5e9', description: 'Quadrilateral Security Dialogue', type: 'Strategic Dialogue', status: 'Active' },
      { id: 'fiveyes', name: 'Five Eyes', members: FIVE_EYES, color: '#475569', description: 'Intelligence Alliance (US, UK, CAN, AUS, NZ)', type: 'Intelligence', status: 'Active' },
      { id: 'rcep', name: 'RCEP', members: RCEP_MEMBERS, color: '#a855f7', description: 'Regional Comprehensive Economic Partnership', type: 'Economic', status: 'Active' },
      { id: 'cptpp', name: 'CPTPP', members: CPTPP_MEMBERS, color: '#14b8a6', description: 'Comprehensive and Progressive Agreement for Trans-Pacific Partnership', type: 'Economic', status: 'Active' },
      { id: 'asean', name: 'ASEAN', members: ASEAN_MEMBERS, color: '#f97316', description: 'Association of Southeast Asian Nations', type: 'Political & Economic', status: 'Active' },
      { id: 'turkic', name: 'Turkic Council', members: TURKIC_MEMBERS, color: '#22d3ee', description: 'Organization of Turkic States', type: 'Cultural & Political', status: 'Active' },
      { id: 'csto', name: 'CSTO', members: CSTO_MEMBERS, color: '#991b1b', description: 'Collective Security Treaty Organization', type: 'Military', status: 'Strained' },
      { id: 'ecowas', name: 'ECOWAS', members: ECOWAS_MEMBERS, color: '#84cc16', description: 'Economic Community of West African States', type: 'Economic', status: 'Fractured' },
      { id: 'eac', name: 'EAC', members: EAC_MEMBERS, color: '#06b6d4', description: 'East African Community', type: 'Economic', status: 'Active' },
      { id: 'mercosur', name: 'MERCOSUR', members: MERCOSUR_MEMBERS, color: '#db2777', description: 'Southern Common Market', type: 'Economic', status: 'Stagnant' },
      { id: 'gcc', name: 'GCC', members: GCC_MEMBERS, color: '#059669', description: 'Gulf Cooperation Council', type: 'Political & Economic', status: 'Active' }
    ],
    conflicts: [
      { id: 'ukr-rus', name: 'Russo-Ukrainian War', participants: ['RUS', 'UKR'], intensity: 0.85, description: 'Protracted attrition warfare.', coordinates: [32, 49] },
      { id: 'scs', name: 'Indo-Pacific Friction', participants: ['CHN', 'PHL', 'TWN', 'JPN'], intensity: 0.75, description: 'High naval tension in South China Sea.', coordinates: [118, 18] },
      { id: 'mid-east', name: 'Regional Instability', participants: ['IRN', 'ISR', 'SAU'], intensity: 0.9, description: 'Multi-front proxy conflict.', coordinates: [36, 32] },
      { id: 'sahel', name: 'Sahel Insurgency', participants: ['MLI', 'FRA', 'NER'], intensity: 0.65, description: 'Instability and coups in West Africa.', coordinates: [0, 15] },
      { id: 'korea', name: 'Korean Peninsula', participants: ['PRK', 'KOR', 'JPN'], intensity: 0.6, description: 'Nuclear posturing and border tensions.', coordinates: [127, 38] }
    ]
  },
  2024: {
    year: 2024,
    alliances: [
      { id: 'nato', name: 'NATO', members: NATO_MEMBERS, color: '#3b82f6', description: 'North Atlantic Treaty Organization', type: 'Military', status: 'Active' },
      { id: 'brics', name: 'BRICS', members: BRICS_MEMBERS.filter(m => m !== 'SAU' && m !== 'ARE'), color: '#eab308', description: 'Major emerging economies', type: 'Economic', status: 'Expanding' },
      { id: 'eu', name: 'European Union', members: EU_MEMBERS, color: '#6366f1', description: 'Political and economic union', type: 'Political & Economic', status: 'Active' },
      { id: 'au', name: 'African Union', members: AU_MEMBERS, color: '#10b981', description: 'Pan-African union', type: 'Political', status: 'Active' },
      { id: 'ecowas', name: 'ECOWAS', members: ECOWAS_MEMBERS, color: '#84cc16', description: 'West African Bloc (Strained)', type: 'Economic', status: 'Active' },
      { id: 'sadc', name: 'SADC', members: SADC_MEMBERS, color: '#f59e0b', description: 'Southern African Development Community', type: 'Economic', status: 'Active' },
      { id: 'opec', name: 'OPEC', members: OPEC_MEMBERS, color: '#15803d', description: 'Organization of the Petroleum Exporting Countries', type: 'Economic', status: 'Active' },
      { id: 'usmca', name: 'USMCA', members: USMCA_MEMBERS, color: '#8b5cf6', description: 'United States–Mexico–Canada Agreement (Trade)', type: 'Trade', status: 'Active' },
      { id: 'sco', name: 'SCO', members: SCO_MEMBERS.filter(m => m !== 'BLR'), color: '#dc2626', description: 'Shanghai Cooperation Organization', type: 'Security', status: 'Active' },
      { id: 'arab', name: 'Arab League', members: ARAB_LEAGUE, color: '#22c55e', description: 'Regional organization of Arab states', type: 'Political', status: 'Active' },
      { id: 'fiveyes', name: 'Five Eyes', members: FIVE_EYES, color: '#475569', description: 'Intelligence Alliance', type: 'Intelligence', status: 'Active' }
    ],
    conflicts: [
      { id: 'ukr-rus', name: 'Russo-Ukrainian War', participants: ['RUS', 'UKR'], intensity: 0.9, description: 'Major conventional war in Eastern Europe.', coordinates: [31.1656, 48.3794] },
      { id: 'isr-gaza', name: 'Israel-Hamas Conflict', participants: ['ISR', 'PSE', 'LBN', 'YEM'], intensity: 0.95, description: 'High-intensity conflict in the Levant.', coordinates: [34.75, 31.5] },
      { id: 'scs', name: 'South China Sea', participants: ['CHN', 'PHL', 'VNM', 'MYS'], intensity: 0.6, description: 'Territorial disputes.', coordinates: [115, 12] },
      { id: 'sdn', name: 'Sudan Civil Conflict', participants: ['SDN'], intensity: 0.8, description: 'Internal power struggle.', coordinates: [30, 15] },
      { id: 'twn', name: 'Cross-Strait Tensions', participants: ['CHN', 'TWN'], intensity: 0.7, description: 'Strategic ambiguity.', coordinates: [121, 24] }
    ]
  },
  2010: {
    year: 2010,
    alliances: [
      { id: 'nato', name: 'NATO', members: NATO_MEMBERS.filter(m => !['MNE', 'MKD', 'FIN', 'SWE', 'ALB', 'HRV'].includes(m)), color: '#3b82f6', description: 'NATO (Pre-Balkan/Nordic expansion)', type: 'Military', status: 'Active' },
      { id: 'brics', name: 'BRIC', members: ["BRA", "RUS", "IND", "CHN"], color: '#eab308', description: 'Emerging economies (pre-South Africa)', type: 'Economic', status: 'Active' },
      { id: 'eu', name: 'European Union', members: EU_MEMBERS.filter(m => m !== 'HRV'), color: '#6366f1', description: 'European Union (Lisbon Treaty era)', type: 'Political & Economic', status: 'Active' },
      { id: 'nafta', name: 'NAFTA', members: USMCA_MEMBERS, color: '#8b5cf6', description: 'North American Free Trade Agreement', type: 'Trade', status: 'Active' },
      { id: 'asean', name: 'ASEAN', members: ASEAN_MEMBERS, color: '#f97316', description: 'Southeast Asian regional bloc', type: 'Political', status: 'Active' },
      { id: 'mercosur', name: 'MERCOSUR', members: MERCOSUR_MEMBERS.filter(m => m !== 'VEN'), color: '#db2777', description: 'South American Trade Bloc', type: 'Trade', status: 'Active' },
      { id: 'csto', name: 'CSTO', members: [...CSTO_MEMBERS, "UZB"], color: '#991b1b', description: 'CSTO (Incl. Uzbekistan)', type: 'Military', status: 'Active' },
      { id: 'alba', name: 'ALBA', members: ["VEN", "CUB", "BOL", "NIC", "ECU"], color: '#be123c', description: 'Bolivarian Alliance for the Americas', type: 'Political & Economic', status: 'Active' }
    ],
    conflicts: [
      { id: 'afg', name: 'War in Afghanistan', participants: ['USA', 'AFG', 'GBR'], intensity: 0.85, description: 'ISAF surge against Taliban.', coordinates: [66, 33] },
      { id: 'irq', name: 'Iraq War', participants: ['USA', 'IRQ'], intensity: 0.7, description: 'Transition to stability operations.', coordinates: [44, 33] },
      { id: 'drug', name: 'Mexican Drug War', participants: ['MEX'], intensity: 0.6, description: 'Cartel conflict.', coordinates: [-102, 23] }
    ]
  },
  1990: {
    year: 1990,
    alliances: [
      { id: 'nato', name: 'NATO', members: ["USA", "CAN", "GBR", "FRA", "DEU", "ITA", "TUR", "ESP", "PRT", "NLD", "BEL", "DNK", "NOR", "GRC", "ISL", "LUX"], color: '#3b82f6', description: 'Cold War era NATO', type: 'Military', status: 'Active' },
      { id: 'warsaw', name: 'Warsaw Pact', members: WARSAW_PACT, color: '#ef4444', description: 'Soviet alliance system (Collapsing)', type: 'Military', status: 'Collapsing' },
      { id: 'ec', name: 'European Communities', members: ["BEL", "FRA", "DEU", "ITA", "LUX", "NLD", "DNK", "IRL", "GBR", "GRC", "PRT", "ESP"], color: '#6366f1', description: 'Precursor to EU', type: 'Economic', status: 'Active' },
      { id: 'gcc', name: 'GCC', members: GCC_MEMBERS, color: '#059669', description: 'Gulf Cooperation Council', type: 'Economic', status: 'Active' },
      { id: 'oas', name: 'OAS', members: OAS_MEMBERS, color: '#0ea5e9', description: 'Organization of American States', type: 'Political', status: 'Active' },
      { id: 'asean', name: 'ASEAN', members: ["IDN", "MYS", "PHL", "SGP", "THA", "BRN"], color: '#f97316', description: 'ASEAN (Pre-Expansion)', type: 'Political', status: 'Active' }
    ],
    conflicts: [
       { id: 'gulf', name: 'Gulf Crisis', participants: ['USA', 'IRQ', 'KWT', 'SAU'], intensity: 0.9, description: 'Operation Desert Shield/Storm.', coordinates: [47, 29] },
       { id: 'yug', name: 'Yugoslav Tensions', participants: ['SRB', 'HRV', 'BIH', 'SVN'], intensity: 0.6, description: 'Rising ethnic tensions preceding breakup.', coordinates: [18, 44] },
       { id: 'nagorno', name: 'Nagorno-Karabakh', participants: ['ARM', 'AZE'], intensity: 0.7, description: 'First Nagorno-Karabakh War.', coordinates: [46, 39] }
    ]
  },
  1960: {
      year: 1960,
      alliances: [
          { id: 'nato', name: 'NATO', members: ["USA", "CAN", "GBR", "FRA", "DEU", "ITA", "TUR", "PRT", "NLD", "BEL", "DNK", "NOR", "GRC", "ISL", "LUX"], color: '#3b82f6', description: 'Anti-Communist Alliance', type: 'Military', status: 'Active' },
          { id: 'warsaw', name: 'Warsaw Pact', members: WARSAW_PACT, color: '#ef4444', description: 'Eastern Bloc Alliance', type: 'Military', status: 'Active' },
          { id: 'seato', name: 'SEATO', members: SEATO_MEMBERS, color: '#f59e0b', description: 'Southeast Asia Treaty Organization', type: 'Military', status: 'Active' },
          { id: 'cento', name: 'CENTO', members: CENTO_MEMBERS, color: '#8b5cf6', description: 'Central Treaty Organization (Baghdad Pact)', type: 'Military', status: 'Active' },
          { id: 'nam', name: 'Non-Aligned Movement', members: NAM_MEMBERS_1960, color: '#a8a29e', description: 'Founding Non-Aligned members', type: 'Political', status: 'Forming' },
          { id: 'eec', name: 'EEC', members: EEC_ORIGINAL, color: '#6366f1', description: 'The "Inner Six" (European Economic Community)', type: 'Economic', status: 'Active' },
          { id: 'arab', name: 'Arab League', members: ["EGY", "IRQ", "JOR", "LBN", "SAU", "SYR", "YEM", "LBY", "SDN", "MAR", "TUN"], color: '#22c55e', description: 'Arab League', type: 'Political', status: 'Active' },
          { id: 'opec', name: 'OPEC', members: ["IRN", "IRQ", "KWT", "SAU", "VEN"], color: '#15803d', description: 'OPEC (Founding Members)', type: 'Economic', status: 'Forming' },
          { id: 'rio', name: 'Rio Pact', members: RIO_PACT.filter(m => m !== 'CUB'), color: '#0ea5e9', description: 'Inter-American Treaty of Reciprocal Assistance', type: 'Military', status: 'Active' }
      ],
      conflicts: [
          { id: 'vnm', name: 'Vietnam War', participants: ['USA', 'VNM'], intensity: 0.8, description: 'Escalating conflict in Indochina.', coordinates: [108, 16] },
          { id: 'congo', name: 'Congo Crisis', participants: ['BEL', 'COD', 'USA', 'RUS'], intensity: 0.7, description: 'Post-independence turmoil.', coordinates: [24, -2] },
          { id: 'alg', name: 'Algerian War', participants: ['FRA', 'DZA'], intensity: 0.75, description: 'War of Independence.', coordinates: [2, 28] }
      ]
  },
  1939: {
      year: 1939,
      alliances: [
          { id: 'allies', name: 'The Allies', members: ALLIES_WW2.filter(m => m !== 'USA' && m !== 'RUS'), color: '#3b82f6', description: 'Powers opposing the Axis (Early War)', type: 'Military Coalition', status: 'Active (War)' },
          { id: 'axis', name: 'Axis Powers', members: AXIS_POWERS, color: '#000000', description: 'Germany, Italy, Japan', type: 'Military Coalition', status: 'Active (War)' },
          { id: 'commonwealth', name: 'British Commonwealth', members: ["GBR", "CAN", "AUS", "NZL", "ZAF", "IND"], color: '#a855f7', description: 'British Empire Dominions', type: 'Political & Military', status: 'Active' }
      ],
      conflicts: [
          { id: 'ww2-eur', name: 'World War II (Europe)', participants: ['DEU', 'POL', 'FRA', 'GBR'], intensity: 1.0, description: 'Invasion of Poland and outbreak of war.', coordinates: [19, 52] },
          { id: 'sino-jpn', name: 'Second Sino-Japanese War', participants: ['JPN', 'CHN'], intensity: 0.9, description: 'Full-scale invasion of China.', coordinates: [110, 35] },
          { id: 'winter', name: 'Winter War', participants: ['RUS', 'FIN'], intensity: 0.8, description: 'Soviet invasion of Finland.', coordinates: [26, 64] }
      ]
  },
  1914: {
      year: 1914,
      alliances: [
          { id: 'entente', name: 'Triple Entente', members: TRIPLE_ENTENTE, color: '#3b82f6', description: 'France, Britain, Russia', type: 'Military Alliance', status: 'Active (War)' },
          { id: 'central', name: 'Central Powers', members: CENTRAL_POWERS, color: '#7f1d1d', description: 'Germany, Austria-Hungary, Ottoman Empire', type: 'Military Alliance', status: 'Active (War)' },
          { id: 'balkan', name: 'Balkan League', members: ["SRB", "GRC", "MNE", "BGR"], color: '#10b981', description: 'Alliance against Ottoman Empire (Pre-WW1)', type: 'Military Alliance', status: 'Unstable' }
      ],
      conflicts: [
          { id: 'ww1', name: 'World War I', participants: ['AUT', 'SRB', 'DEU', 'RUS', 'FRA', 'BEL', 'GBR'], intensity: 1.0, description: 'The Great War.', coordinates: [20, 48] }
      ]
  }
};

export const getGeopoliticalState = (year: number): GeopoliticalState => {
  if (HISTORICAL_DATA[year]) return HISTORICAL_DATA[year];
  return HISTORICAL_DATA[2024];
};