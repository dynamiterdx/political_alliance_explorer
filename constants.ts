
import { Alliance } from './types';

export const ALLIANCES: Alliance[] = [
  {
    id: 'nato',
    name: 'NATO',
    fullName: 'North Atlantic Treaty Organization',
    description: 'A military alliance between North American and European countries.',
    members: ['USA', 'CAN', 'GBR', 'FRA', 'DEU', 'ITA', 'ESP', 'POL', 'TUR', 'NLD', 'BEL', 'GRC', 'PRT', 'NOR', 'DNK', 'CZE', 'HUN', 'ROU', 'BGR', 'SVK', 'SVN', 'LTU', 'LVA', 'EST', 'ALB', 'HRV', 'MNE', 'MKD', 'FIN', 'SWE', 'ISL', 'LUX'],
    color: '#3b82f6',
    type: 'Military',
    yearFounded: 1949
  },
  {
    id: 'g7',
    name: 'G7',
    fullName: 'Group of Seven',
    description: 'An intergovernmental political forum consisting of the world\'s advanced economies.',
    members: ['CAN', 'FRA', 'DEU', 'ITA', 'JPN', 'GBR', 'USA'], // Plus EU representative usually
    color: '#f59e0b',
    type: 'Economic',
    yearFounded: 1975
  },
  {
    id: 'g20',
    name: 'G20',
    fullName: 'Group of Twenty',
    description: 'A forum for international economic cooperation.',
    members: ['ARG', 'AUS', 'BRA', 'CAN', 'CHN', 'FRA', 'DEU', 'IND', 'IDN', 'ITA', 'JPN', 'MEX', 'RUS', 'SAU', 'ZAF', 'KOR', 'TUR', 'GBR', 'USA'], // Plus EU & AU
    color: '#10b981',
    type: 'Economic',
    yearFounded: 1999
  },
  {
    id: 'brics',
    name: 'BRICS',
    fullName: 'BRICS+',
    description: 'An informal group of emerging economies focusing on south-south cooperation.',
    members: ['BRA', 'RUS', 'IND', 'CHN', 'ZAF', 'EGY', 'ETH', 'IRN', 'ARE'],
    color: '#ef4444',
    type: 'Economic',
    yearFounded: 2009
  },
  {
    id: 'asean',
    name: 'ASEAN',
    fullName: 'Association of Southeast Asian Nations',
    description: 'Promotes intergovernmental cooperation and facilitates economic integration.',
    members: ['BRN', 'KHM', 'IDN', 'LAO', 'MYS', 'MMR', 'PHL', 'SGP', 'THA', 'VNM'],
    color: '#8b5cf6',
    type: 'Mixed',
    yearFounded: 1967
  },
  {
    id: 'eu',
    name: 'European Union',
    fullName: 'European Union',
    description: 'A political and economic union of 27 member states that are located primarily in Europe.',
    members: ['AUT', 'BEL', 'BGR', 'HRV', 'CYP', 'CZE', 'DNK', 'EST', 'FIN', 'FRA', 'DEU', 'GRC', 'HUN', 'IRL', 'ITA', 'LVA', 'LTU', 'LUX', 'MLT', 'NLD', 'POL', 'PRT', 'ROU', 'SVK', 'SVN', 'ESP', 'SWE'],
    color: '#fbbf24',
    type: 'Mixed',
    yearFounded: 1993
  },
  {
    id: 'warsaw',
    name: 'Warsaw Pact',
    fullName: 'Warsaw Treaty Organization',
    description: 'Historical: A collective defense treaty established by the Soviet Union and other Soviet satellite states.',
    members: ['RUS', 'POL', 'DEU', 'CZE', 'SVK', 'HUN', 'ROU', 'BGR', 'ALB'],
    color: '#991b1b',
    type: 'Military',
    yearFounded: 1955
  },
  {
    id: 'sco',
    name: 'SCO',
    fullName: 'Shanghai Cooperation Organization',
    description: 'A Eurasian political, economic, international security and defense organization.',
    members: ['CHN', 'RUS', 'KAZ', 'KGZ', 'TJK', 'UZB', 'IND', 'PAK', 'IRN', 'BLR'],
    color: '#064e3b',
    type: 'Mixed',
    yearFounded: 2001
  },
  {
    id: 'au',
    name: 'African Union',
    fullName: 'African Union',
    description: 'A continental union consisting of the 55 member states that make up the countries of the African Continent.',
    members: ['DZA', 'AGO', 'BEN', 'BWA', 'BFA', 'BDI', 'CPV', 'CMR', 'CAF', 'TCD', 'COM', 'COG', 'COD', 'DJI', 'EGY', 'GNQ', 'ERI', 'SWZ', 'ETH', 'GAB', 'GMB', 'GHA', 'GIN', 'GNB', 'CIV', 'KEN', 'LSO', 'LBR', 'LBY', 'MDG', 'MWI', 'MLI', 'MRT', 'MUS', 'MAR', 'MOZ', 'NAM', 'NER', 'NGA', 'RWA', 'STP', 'SEN', 'SYC', 'SLE', 'SOM', 'ZAF', 'SSD', 'SDN', 'TZA', 'TGO', 'TUN', 'UGA', 'ZMB', 'ZWE'],
    color: '#166534',
    type: 'Political',
    yearFounded: 2002
  }
];

export const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';
