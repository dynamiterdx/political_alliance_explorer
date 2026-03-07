import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * ExtractionEngine
 * 
 * Responsible for passing raw geopolitical signals to the Gemini LLM
 * to extract structured events and map them to the WorldModel schema.
 */
export class ExtractionEngine {

    /**
     * Defines the JSON schema that Gemini must adhere to when extracting situations.
     * This perfectly matches the WORLD_MODEL_SPECIFICATIONS.md ontology.
     */
    get situationSchema() {
        return {
            type: Type.ARRAY,
            description: "A list of geopolitical situations extracted from the raw signals.",
            items: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING, description: "A concise, formal title for the situation." },
                    type: {
                        type: Type.STRING,
                        description: "Must be one of: Armed Conflict, Military Escalation, Territorial Dispute, Proxy Conflict, Political Crisis, Regime Instability, Diplomatic Breakdown, Strategic Rivalry, Military Posturing, Sanctions Regime, Trade Conflict, Economic Bloc Formation, Military Alliance, Strategic Partnership, Security Pact, Nuclear Risk, Regional Instability, Escalation Flashpoint."
                    },
                    status: {
                        type: Type.STRING,
                        description: "Must be one of: emerging, active, stabilizing, resolved, dormant"
                    },
                    summary: { type: Type.STRING, description: "A short professional summary of what is happening." },
                    causes: { type: Type.STRING, description: "Drivers or motivations behind the situation." },
                    trajectory: { type: Type.STRING, description: "Direction the situation appears to be evolving toward." },
                    intensity_score: { type: Type.INTEGER, description: "Relative level of geopolitical significance (1 to 10)." },
                    trend_direction: { type: Type.STRING, description: "Must be one of: escalating, stabilizing, de-escalating" },
                    confidence_level: { type: Type.STRING, description: "Must be one of: high, medium, low." }
                },
                required: ["title", "type", "status", "summary", "causes", "trajectory", "intensity_score", "trend_direction", "confidence_level"]
            }
        };
    }

    /**
     * Processes a batch of raw signals and extracts structured Situations.
     * Uses Gemini 2.5 Pro for deep, critical extraction.
     * 
     * @param {Array<Object>} rawSignals 
     * @returns {Promise<Array<Object>>} Extracted situations
     */
    async extractSituationsFromSignals(rawSignals) {
        if (!rawSignals || rawSignals.length === 0) return [];

        console.log(`[ExtractionEngine] Processing ${rawSignals.length} signals via Gemini...`);

        // Combine signals into a readable prompt context
        const context = rawSignals.map(s => `Source: ${s.source}\nTimestamp: ${s.timestamp}\nText: ${s.rawText}`).join("\n\n---\n\n");

        const prompt = `
      You are a senior geopolitical intelligence analyst. Your objective is to extract distinct geopolitical "Situations" from the following raw signals.
      Adhere strictly to the requested JSON schema for the output. Combine related signals into a single unified situation if they refer to the same geopolitical event.
      
      Raw Signals:
      ${context}
    `;

        try {
            // Using gemini-2.5-pro for high critically task: extraction and structuring
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: this.situationSchema,
                    temperature: 0.1, // Keep it highly deterministic
                }
            });

            const extractedData = JSON.parse(response.text);
            console.log(`[ExtractionEngine] Successfully extracted ${extractedData.length} situations.`);
            return extractedData;

        } catch (error) {
            console.error("[ExtractionEngine] Failed to extract situations:", error);
            throw error;
        }
    }
}
