import { GoogleGenAI } from "@google/genai";
import { GeopoliticalState } from '../types';
import * as CacheService from './cacheService';

// Initialize the client. We use a function to ensure it picks up the latest environment variable
// if injected after module load, though for standard .env files this works immediately.
const getClient = () => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
  if (!apiKey) {
    throw new Error('Missing Gemini API key. Set GEMINI_API_KEY or API_KEY in environment.');
  }
  return new GoogleGenAI({ apiKey });
};

const SYSTEM_INSTRUCTION = `
You are a geopolitical analyst inside "GeoSight". Ground truth comes from:
- Historical years: curated data in the app (alliances/conflicts).
- Present year: GDELT event signals (hostile event density and trend) and curated alliances.

Rules:
1) Do NOT invent alliances, conflicts, or risk levels. Explain only what the current state shows.
2) When referring to tensions/conflicts, cite they are derived from GDELT event patterns, not imagination.
3) If data is missing or uncertain, say so clearly.
4) Future scenarios must be explicitly labeled speculative.
5) Be concise and analytical; use bullet points for multi-part answers.
`;

export const sendMessage = async (message: string, contextState?: GeopoliticalState) => {
  const ai = getClient();
  const contextLine = contextState ? `Context: Year ${contextState.year}.` : '';
  
  try {
    const result = await ai.models.generateContentStream({
      model: 'gemini-3-flash-preview',
      contents: [
        {
          role: 'user',
          parts: [
            { text: `${SYSTEM_INSTRUCTION}\n\n${contextLine}\n\nUser: ${message}` }
          ]
        }
      ],
      config: {
        tools: contextState?.year === 2024 ? [{ googleSearch: {} }] : []
      }
    });
    return result; // Async iterable
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    throw error;
  }
};

export const generateSummary = async (countryName: string, state: GeopoliticalState, forceRefresh = false) => {
    const cacheKey = CacheService.generateCacheKey('country', countryName, state.year);
    
    if (!forceRefresh) {
        const cached = await CacheService.getCachedData(cacheKey);
        if (cached) return cached;
    }

    const ai = getClient();
    
    const prompt = `
    Provide a concise geopolitical summary for **${countryName}** in the year **${state.year}**.
    
    Structure:
    1. **Current Strategic Posture**: One sentence summary.
    2. **Key Alignments**: Who are their main allies?
    3. **Active Frictions**: Who are their adversaries or sources of tension?
    4. **Why it matters**: Global significance.
    
    Use the provided year context strictly. If the year is 2024, include very recent real-world developments if possible.
    `;

    // Using flash-preview with search grounding to get the absolute latest info if 2024
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
            tools: state.year === 2024 ? [{ googleSearch: {} }] : []
        }
    });

    const text = response.text || "Analysis unavailable.";
    
    // Save to distributed cache
    await CacheService.setCachedData(cacheKey, text);
    
    return text;
};

export const generateAllianceSummary = async (allianceName: string, state: GeopoliticalState, forceRefresh = false) => {
    const cacheKey = CacheService.generateCacheKey('alliance', allianceName, state.year);

    if (!forceRefresh) {
        const cached = await CacheService.getCachedData(cacheKey);
        if (cached) return cached;
    }

    const ai = getClient();
    
    const prompt = `
    Provide a concise geopolitical analysis of the **${allianceName}** alliance in the year **${state.year}**.
    
    Structure:
    1. **Strategic Purpose**: Why does it exist in this era?
    2. **Current Cohesion**: Is the alliance united or fractured?
    3. **Global Influence**: How does it project power or economic influence?
    
    Keep it brief, analytical, and specific to the requested year.
    `;
    
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
         config: {
            tools: state.year === 2024 ? [{ googleSearch: {} }] : []
        }
    });
    
    const text = response.text || "Analysis unavailable.";
    
    await CacheService.setCachedData(cacheKey, text);
    
    return text;
};

export const generateConflictSummary = async (conflictName: string, state: GeopoliticalState, forceRefresh = false) => {
    const cacheKey = CacheService.generateCacheKey('conflict', conflictName, state.year);

    if (!forceRefresh) {
        const cached = await CacheService.getCachedData(cacheKey);
        if (cached) return cached;
    }

    const ai = getClient();

    const prompt = `
    Provide a concise strategic analysis of the **${conflictName}** in the year **${state.year}**.

    Structure:
    1. **Root Causes**: Brief origin.
    2. **Current Status**: Active combat, stalemate, or cold conflict?
    3. **Key Players**: Who is backing whom?
    4. **Global Risk**: Potential for escalation.

    Keep it brief and analytical.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
            tools: state.year === 2024 ? [{ googleSearch: {} }] : []
        }
    });

    const text = response.text || "Analysis unavailable.";
    
    await CacheService.setCachedData(cacheKey, text);
    
    return text;
};

export const getGlobalHeadlines = async () => {
    // Cache global headlines for 1 hour (3600000 ms) to ensure all users see the same 'edition'
    // of the news and save API costs.
    const dateKey = new Date().toISOString().slice(0, 13); // '2024-10-27T14'
    const cacheKey = `global_headlines_${dateKey}`;
    
    const cached = await CacheService.getCachedData(cacheKey, 3600 * 1000);
    if (cached) return cached;

    const ai = getClient();
    const prompt = "What are the top 3 most critical geopolitical developments happening in the world right now? Briefly explain their systemic impact.";
    
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
             tools: [{ googleSearch: {} }]
        }
    });
    
    const text = response.text || "Global news feed unavailable.";
    
    await CacheService.setCachedData(cacheKey, text);
    
    return text;
};
