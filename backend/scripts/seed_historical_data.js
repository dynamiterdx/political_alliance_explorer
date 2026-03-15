import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import pg from 'pg';
const { Pool } = pg;
import { PrismaPg } from '@prisma/adapter-pg';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const schema = {
    type: Type.OBJECT,
    properties: {
        situations: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    type: { type: Type.STRING },
                    status: { type: Type.STRING },
                    summary: { type: Type.STRING },
                    causes: { type: Type.STRING },
                    trajectory: { type: Type.STRING },
                    intensity_score: { type: Type.INTEGER },
                    trend_direction: { type: Type.STRING },
                    confidence_level: { type: Type.STRING },
                    latitude: { type: Type.NUMBER },
                    longitude: { type: Type.NUMBER },
                    source_lat: { type: Type.NUMBER },
                    source_lng: { type: Type.NUMBER },
                    target_lat: { type: Type.NUMBER },
                    target_lng: { type: Type.NUMBER }
                },
                required: ["title", "type", "status", "summary", "causes", "trajectory", "intensity_score", "trend_direction", "confidence_level", "latitude", "longitude"]
            }
        },
        alliances: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    type: { type: Type.STRING },
                    established_year: { type: Type.INTEGER },
                    purpose: { type: Type.STRING },
                    status: { type: Type.STRING }
                },
                required: ["name", "type", "status", "established_year", "purpose"]
            }
        }
    },
    required: ["situations", "alliances"]
};

async function generateStateForYear(year, isLive) {
    console.log(`Generating State for ${year}...`);
    const prompt = `
        You are an expert geopolitical intelligence system. 
        Generate a highly realistic global state for the year ${year}. Ensure all events, coordinates (latitude, longitude), and actors represent real-world geopolitical tensions and realities for that specific year.
        If the year is the present, project the most accurate current reality.
        Include accurate latitude and longitude floats. If an event is directional (e.g. NATO troop deployment to Poland from US, or US sanctions on China), provide source/target coords.
        Include real world alliances (e.g., NATO, BRICS, AUKUS, Quad) that existed in ${year}.
        Generate 10 to 15 geographically diverse, highly detailed situations. Avoid sci-fi or fake scenarios. Use the provided JSON schema perfectly.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: schema,
            temperature: 0.3,
        }
    });

    const data = JSON.parse(response.text);

    // Save to DB
    console.log(`Saving ${data.situations.length} situations and ${data.alliances.length} alliances for ${year}...`);

    // Create WorldState
    const worldState = await prisma.worldState.create({
        data: {
            year,
            freshness_status: isLive ? 'live' : 'historical',
            source_type: isLive ? 'live_scan' : 'curated_snapshot',
            last_scan_time: isLive ? new Date() : null,
            situations: {
                create: data.situations.map(s => ({
                    title: s.title,
                    type: s.type,
                    status: s.status,
                    summary: s.summary,
                    causes: s.causes,
                    trajectory: s.trajectory,
                    intensity_score: s.intensity_score,
                    trend_direction: s.trend_direction,
                    confidence_level: s.confidence_level,
                    latitude: s.latitude,
                    longitude: s.longitude,
                    source_lat: s.source_lat,
                    source_lng: s.source_lng,
                    target_lat: s.target_lat,
                    target_lng: s.target_lng
                }))
            },
            alliances: {
                create: data.alliances.map(a => ({
                    name: a.name,
                    type: a.type,
                    status: a.status,
                    established_year: a.established_year,
                    purpose: a.purpose
                }))
            }
        }
    });

    // If live, set to Redis
    if (isLive) {
        import('redis').then(async ({ createClient }) => {
            const redis = createClient({ url: process.env.REDIS_URL });
            await redis.connect();

            const fullState = await prisma.worldState.findUnique({
                where: { id: worldState.id },
                include: { situations: true, alliances: true }
            });

            await redis.set('geosight:active_world_state', JSON.stringify(fullState));
            await redis.disconnect();
            console.log('Saved to Redis cache!');
        });
    }

    console.log(`Done with ${year}! Revision ID: ${worldState.revision_id}`);
}

async function run() {
    try {
        await prisma.worldState.deleteMany({}); // Clear old data for a fresh start
        await prisma.situation.deleteMany({});
        await prisma.alliance.deleteMany({});

        await generateStateForYear(2024, false); // Historic
        await generateStateForYear(2025, false); // Historic
        await generateStateForYear(new Date().getFullYear(), true); // Present

    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

run();
