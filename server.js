// server.js
// Run this with: node server.js
// Dependencies: npm install express cors ioredis

const express = require('express');
const cors = require('cors');
const Redis = require('ioredis');

const app = express();
const PORT = 3001;

// --- SECURE SERVER-SIDE CONFIGURATION ---
// Connection to your Managed Redis instance
const redis = new Redis({
  host: 'redis-18740.c321.us-east-1-2.ec2.cloud.redislabs.com',
  port: 18740,
  username: 'default', // Explicitly set username for Redis ACL compatibility
  password: 'QmJT1ehLLWijoPo4tvVphniBD6ozuVsA',
  connectTimeout: 10000,
  // If your managed instance requires TLS, uncomment the line below:
  // tls: {}, 
});

redis.on('connect', () => {
  console.log('✅ Connected to Managed Redis Instance successfully.');
});

redis.on('error', (err) => {
  console.error('❌ Redis Connection Error:', err);
});

app.use(cors());
app.use(express.json());

const CACHE_TTL = 24 * 60 * 60; // 24 Hours in seconds

// Health Check for Frontend UI
app.get('/api/health', async (req, res) => {
  try {
    const ping = await redis.ping();
    res.json({ status: 'online', redis: ping === 'PONG' ? 'connected' : 'error' });
  } catch (e) {
    res.status(500).json({ status: 'offline', error: e.message });
  }
});

// GET: Retrieve from Cache
app.get('/api/cache', async (req, res) => {
  const { key } = req.query;

  if (!key) {
    return res.status(400).json({ error: 'Key required' });
  }

  try {
    const data = await redis.get(key);
    if (data) {
      console.log(`[CACHE HIT] ${key}`);
      return res.json(JSON.parse(data));
    } else {
      console.log(`[CACHE MISS] ${key}`);
      return res.status(404).json({ error: 'Cache miss' });
    }
  } catch (error) {
    console.error('Redis Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST: Write to Cache
app.post('/api/cache', async (req, res) => {
  const { key, content } = req.body;

  if (!key || !content) {
    return res.status(400).json({ error: 'Key and content required' });
  }

  const payload = {
    content,
    timestamp: Date.now(),
    version: 1
  };

  try {
    await redis.set(key, JSON.stringify(payload), 'EX', CACHE_TTL);
    console.log(`[CACHE WRITE] ${key}`);
    return res.json({ success: true });
  } catch (error) {
    console.error('Redis Write Error:', error);
    return res.status(500).json({ error: 'Failed to write cache' });
  }
});

app.listen(PORT, () => {
  console.log(`GeoSight Cache Proxy running on http://localhost:${PORT}`);
  console.log('Targeting Redis: redis-18740.c321.us-east-1-2.ec2.cloud.redislabs.com');
  console.log('Ensure you have installed dependencies: npm install express cors ioredis');
});