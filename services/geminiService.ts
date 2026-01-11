import { GeopoliticalInsight, CountryGeopoliticalData } from '../types';

// Gemini disabled: return lightweight canned data to keep UI functional without external calls.
export const getGeopoliticalInsight = async (allianceName: string): Promise<GeopoliticalInsight | null> => {
  return {
    summary: `${allianceName} continues coordinating member states on shared strategic interests.`,
    objectives: [
      "Maintain cohesion across diverse member priorities",
      "Strengthen regional stability and economic resilience",
      "Advance collaboration with trusted partners"
    ],
    recentEvents: "Recent coordination meetings and ongoing policy alignment across members.",
    challenges: "Balancing national interests with collective goals amid fast-moving global events."
  };
};

export const getCountryGeopoliticalInfo = async (countryName: string): Promise<Omit<CountryGeopoliticalData, 'memberships' | 'name'> | null> => {
  return {
    capital: "N/A",
    population: "N/A",
    geopoliticalStance: `${countryName} engages pragmatically with regional partners while pursuing domestic priorities.`
  };
};
