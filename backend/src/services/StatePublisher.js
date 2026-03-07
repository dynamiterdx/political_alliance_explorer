import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import pg from 'pg';
const { Pool } = pg;
import { PrismaPg } from '@prisma/adapter-pg';

import { createClient } from 'redis';
import dotenv from 'dotenv';
dotenv.config();

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const redisClient = createClient({ url: process.env.REDIS_URL });

redisClient.on('error', (err) => console.log('Redis Client Error', err));

export class StatePublisher {
    constructor() {
        this.isRedisConnected = false;
    }

    async ensureRedisConnected() {
        if (!this.isRedisConnected) {
            await redisClient.connect();
            this.isRedisConnected = true;
        }
    }

    /**
     * Commits a new WorldState revision to the Data Store (PostgreSQL) 
     * and broadcasts the active JSON payload to Redis.
     * @param {Object} payload The validated Situations, Actors, etc.
     * @param {Object} metadata The WorldState metadata (year, source_type, etc.)
     */
    async publishNewState(payload, metadata) {
        try {
            console.log(`[StatePublisher] Beginning publish for year ${metadata.year}...`);
            await this.ensureRedisConnected();

            // 1. Transactionally write the WorldState and its associated entities to Postgres
            const newWorldState = await prisma.$transaction(async (tx) => {

                // Example: Create the WorldState record
                const worldState = await tx.worldState.create({
                    data: {
                        year: metadata.year,
                        freshness_status: metadata.freshness_status,
                        source_type: metadata.source_type,
                        last_scan_time: metadata.last_scan_time || new Date(),
                    }
                });

                // Loop over situations and create them linked to this WorldState
                for (const sit of payload.situations || []) {
                    await tx.situation.create({
                        data: {
                            title: sit.title,
                            type: sit.type,
                            status: sit.status,
                            summary: sit.summary,
                            causes: sit.causes,
                            trajectory: sit.trajectory,
                            intensity_score: sit.intensity_score,
                            trend_direction: sit.trend_direction,
                            confidence_level: sit.confidence_level,
                            worldStates: {
                                connect: { id: worldState.id }
                            }
                        }
                    });
                }

                // Return the fully populated WorldState to cache it
                return await tx.worldState.findUnique({
                    where: { id: worldState.id },
                    include: {
                        situations: true,
                        alliances: true,
                    }
                });
            }, {
                maxWait: 15000,
                timeout: 25000,
            });

            console.log(`[StatePublisher] Successfully committed Revision ID: ${newWorldState.revision_id}`);

            // 2. Publish to Redis Cache for low-latency Client UI reads
            const cacheKey = `geosight:worldstate:active`;
            await redisClient.set(cacheKey, JSON.stringify(newWorldState));

            console.log(`[StatePublisher] Cache updated at key: ${cacheKey}`);

            return newWorldState;

        } catch (error) {
            console.error('[StatePublisher] Failed to publish new state:', error);
            throw error;
        }
    }

    async close() {
        await prisma.$disconnect();
        if (this.isRedisConnected) {
            await redisClient.quit();
        }
    }
}
