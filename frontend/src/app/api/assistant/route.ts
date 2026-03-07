import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request: Request) {
    try {
        const { message, worldState } = await request.json();

        // Construct the context prompt grounding the model in the specific state
        const systemPrompt = `You are the GeoSight AI Assistant. You must answer the user's questions grounded STRICTLY in the following WorldState JSON. Do not invent new facts. If the information is uncertain or absent, state so explicitly. Speculative future scenarios must be explicitly labeled as speculative.

<WorldState>
${JSON.stringify(worldState, null, 2)}
</WorldState>

User Question: ${message}`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: systemPrompt,
        });

        return NextResponse.json({ reply: response.text });
    } catch (error) {
        console.error('Assistant API Error:', error);
        return NextResponse.json({ reply: 'An error occurred while communicating with the AI Assistant.' }, { status: 500 });
    }
}
