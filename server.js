// server.js
// Run this with: node server.js
// Dependencies: npm install express cors ioredis dotenv

import express from 'express';
import cors from 'cors';
import Redis from 'ioredis';
import AdmZip from 'adm-zip';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3001;

// --- SECURE SERVER-SIDE CONFIGURATION ---
// Connection to your Managed Redis instance
const {
  REDIS_HOST,
  REDIS_PORT,
  REDIS_USERNAME = 'default',
  REDIS_PASSWORD
} = process.env;

if (!REDIS_HOST || !REDIS_PORT || !REDIS_PASSWORD) {
  console.error('❌ Missing Redis environment variables. Please set REDIS_HOST, REDIS_PORT, REDIS_USERNAME, and REDIS_PASSWORD in .env');
  process.exit(1);
}

const redis = new Redis({
  host: REDIS_HOST,
  port: Number(REDIS_PORT),
  username: REDIS_USERNAME, // Explicitly set username for Redis ACL compatibility
  password: REDIS_PASSWORD,
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
const GDELT_LASTUPDATE_URL = 'http://data.gdeltproject.org/gdeltv2/lastupdate-translation.txt';

// Health Check for Frontend UI
app.get('/api/health', async (req, res) => {
  try {
    const ping = await redis.ping();
    res.json({ status: 'online', redis: ping === 'PONG' ? 'connected' : 'error' });
  } catch (e) {
    res.status(500).json({ status: 'offline', error: e.message });
  }
});

// GDELT Live Events: fetch latest export and surface as JSON
app.get('/api/gdelt/events', async (_req, res) => {
  try {
    const lastUpdateText = await fetch(GDELT_LASTUPDATE_URL).then(r => r.text());
    const exportLine = lastUpdateText.split('\n').find(line => line.includes('.export.CSV.zip'));
    if (!exportLine) {
      return res.status(500).json({ error: 'No export link found' });
    }
    const parts = exportLine.trim().split(/\s+/);
    const exportUrl = parts[2];

    const zipBuffer = Buffer.from(await fetch(exportUrl).then(r => r.arrayBuffer()));
    const zip = new AdmZip(zipBuffer);
    const entries = zip.getEntries();
    if (!entries.length) {
      return res.status(500).json({ error: 'No CSV found in export' });
    }

    const csv = entries[0].getData().toString('utf-8');
    const lines = csv.trim().split('\n').slice(0, 4000); // cap to keep payload reasonable

    const events = lines.map(line => {
      const cols = line.split('\t');
      const actor1 = cols[7] || cols[5] || '';
      const actor2 = cols[17] || cols[15] || '';
      const goldstein = parseFloat(cols[30] || '0');
      const tone = parseFloat(cols[34] || '0');
      const lat1 = parseFloat(cols[53] || '0');
      const lon1 = parseFloat(cols[54] || '0');
      const lat2 = parseFloat(cols[57] || '0');
      const lon2 = parseFloat(cols[58] || '0');
      const lat = !isNaN(lat1) && lat1 !== 0 ? lat1 : (!isNaN(lat2) && lat2 !== 0 ? lat2 : null);
      const lon = !isNaN(lon1) && lon1 !== 0 ? lon1 : (!isNaN(lon2) && lon2 !== 0 ? lon2 : null);
      return {
        id: cols[0],
        day: cols[1],
        actor1,
        actor2,
        goldstein,
        tone,
        lat,
        lon
      };
    }).filter(e => e.actor1 && e.actor2);

    res.json({ events, fetchedAt: new Date().toISOString() });
  } catch (error) {
    console.error('GDELT fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch GDELT events' });
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
  console.log(`Targeting Redis: ${REDIS_HOST}:${REDIS_PORT}`);
  console.log('Ensure you have installed dependencies: npm install express cors ioredis');
});
