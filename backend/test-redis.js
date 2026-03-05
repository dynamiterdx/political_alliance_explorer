import { createClient } from 'redis';
import dotenv from 'dotenv';
dotenv.config();

const redisClient = createClient({
    url: process.env.REDIS_URL
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));

async function initializeRedis() {
    try {
        await redisClient.connect();
        console.log('Successfully connected to Redis!');

        // Quick test
        await redisClient.set('system_status', 'online');
        const status = await redisClient.get('system_status');
        console.log(`System status from Redis: ${status}`);

        await redisClient.quit();
    } catch (error) {
        console.error('Failed to connect to Redis:', error);
    }
}

initializeRedis();
