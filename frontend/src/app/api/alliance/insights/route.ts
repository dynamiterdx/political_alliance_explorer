import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { createClient } from 'redis';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Using a module-level variable to hold the redis client
let redisClient: ReturnType<typeof createClient> | null = null;

async function getRedisClient() {
    if (!redisClient) {
        redisClient = createClient({ url: process.env.REDIS_URL });
        redisClient.on('error', (err) => console.log('Redis Client Error', err));
        await redisClient.connect();
    }
    return redisClient;
}

export async function POST(request: Request) {
    try {
        const { allianceId, allianceData } = await request.json();

        if (!allianceId || !allianceData) {
            return NextResponse.json({ error: 'allianceId and allianceData are required' }, { status: 400 });
        }

        const cacheKey = `alias:insight:${allianceId}`;
        const redis = await getRedisClient();

        // 1. Check Redis Cache
        const cachedInsight = await redis.get(cacheKey);
        if (cachedInsight) {
            console.log(`[Alliance Insight] Cache HIT for ${allianceId}`);
            return NextResponse.json({ insight: cachedInsight, cached: true });
        }

        console.log(`[Alliance Insight] Cache MISS for ${allianceId}, generating fresh insight...`);

        // 2. Generate Insight via Gemini
        const systemPrompt = `You are a Senior Geopolitical Analyst for the GeoSight intelligence platform. 
Provide a concise, highly analytical, and objective "What, Why, and What Next" perspective on the following geopolitical alliance. 

Your response should be formatted in 3 short, punchy paragraphs:
1. What: Define the alliance and its core purpose.
2. Why: Explain its geopolitical significance and the strategic motives of its key members.
3. What Next: Forecast its trajectory, potential stressors, or expansion over the next 1-3 years based on current global trends.

Be highly professional and objective. Do not use filler introductions. Max 250 words total.

Alliance Data Context:
${JSON.stringify(allianceData, null, 2)}`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: systemPrompt,
        });

        const generatedInsight = response.text || "Insight generation failed. Please try again.";

        // 3. Cache the result for 24 hours (86400 seconds)
        await redis.setEx(cacheKey, 86400, generatedInsight);

        return NextResponse.json({ insight: generatedInsight, cached: false });

    } catch (error) {
        console.error('Alliance Insight API Error:', error);
        return NextResponse.json({ error: 'Failed to generate alliance insight' }, { status: 500 });
    }
}
