
import { GoogleGenAI, Type } from "@google/genai";
import { GeopoliticalInsight, CountryGeopoliticalData } from '../types';

export const getGeopoliticalInsight = async (allianceName: string): Promise<GeopoliticalInsight | null> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide a detailed geopolitical insight for the following international alliance: ${allianceName}. 
      Focus on its current strategic goals, member dynamics, and contemporary challenges.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING, description: 'Brief overview of the alliance status today.' },
            objectives: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: 'Key strategic objectives.'
            },
            recentEvents: { type: Type.STRING, description: 'Recent significant geopolitical developments.' },
            challenges: { type: Type.STRING, description: 'Current challenges or internal friction.' }
          },
          required: ['summary', 'objectives', 'recentEvents', 'challenges']
        }
      }
    });

    return JSON.parse(response.text.trim());
  } catch (error) {
    console.error("Error fetching Gemini insight:", error);
    return null;
  }
};

export const getCountryGeopoliticalInfo = async (countryName: string): Promise<Omit<CountryGeopoliticalData, 'memberships' | 'name'> | null> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide core geopolitical and demographic data for the country: ${countryName}.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            capital: { type: Type.STRING, description: 'The capital city.' },
            population: { type: Type.STRING, description: 'Approximate current population.' },
            geopoliticalStance: { type: Type.STRING, description: 'A 2-3 sentence summary of the country\'s current geopolitical orientation and major allies.' }
          },
          required: ['capital', 'population', 'geopoliticalStance']
        }
      }
    });

    return JSON.parse(response.text.trim());
  } catch (error) {
    console.error("Error fetching country info:", error);
    return null;
  }
};
