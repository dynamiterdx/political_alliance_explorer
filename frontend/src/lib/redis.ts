import { createClient } from 'redis';

let redisClient: ReturnType<typeof createClient> | null = null;

export async function getRedisClient() {
    if (!redisClient) {
        redisClient = createClient({
            url: process.env.REDIS_URL,
        });
        redisClient.on('error', (err) => console.error('Redis Client Error', err));
        await redisClient.connect();
    }
    return redisClient;
}

export async function getActiveWorldState() {
    const client = await getRedisClient();
    const data = await client.get('geosight:worldstate:active');
    if (!data) return null;
    return JSON.parse(data);
}
