import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import pg from 'pg';
const { Pool } = pg;
import { PrismaPg } from '@prisma/adapter-pg';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString, ssl: { rejectUnauthorized: false } });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const schema = {
    type: Type.OBJECT,
    properties: {
        alliances: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    id: { type: Type.STRING },
                    members: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                name: { type: Type.STRING },
                                iso_a3: { type: Type.STRING }
                            },
                            required: ["name", "iso_a3"]
                        }
                    }
                },
                required: ["id", "members"]
            }
        }
    },
    required: ["alliances"]
};

async function backfillMembers() {
    try {
        console.log("Fetching existing alliances...");
        const existingAlliances = await prisma.alliance.findMany({ select: { id: true, name: true } });

        console.log(`Found ${existingAlliances.length} alliances. Prompting Gemini for members...`);

        const prompt = `
            Given the following geopolitical alliances, provide a list of their primary member countries.
            For each country, provide its full proper name and its standard ISO 3166-1 alpha-3 code (e.g. USA, CHN, GBR).
            Do not provide more than 15 members per alliance to keep the data lightweight.
            
            Alliances:
            ${JSON.stringify(existingAlliances, null, 2)}
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema,
                temperature: 0.1,
            }
        });

        const data = JSON.parse(response.text);

        console.log("Inserting members into database...");
        for (const item of data.alliances) {
            for (const member of item.members) {
                // Upsert the actor to avoid duplicates
                let actor = await prisma.actor.findFirst({ where: { name: member.name } });
                if (!actor) {
                    actor = await prisma.actor.create({
                        data: {
                            name: member.name,
                            actor_type: 'Nation State',
                            country_code: member.iso_a3
                        }
                    });
                }

                // Link to alliance
                await prisma.alliance.update({
                    where: { id: item.id },
                    data: {
                        members: {
                            connect: { id: actor.id }
                        }
                    }
                });
            }
        }
        console.log("Backfill complete!");

    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

backfillMembers();
