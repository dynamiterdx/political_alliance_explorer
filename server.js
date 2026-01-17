// server.js
// Run this with: node server.js
// Dependencies: npm install express cors ioredis dotenv

import express from 'express';
import cors from 'cors';
import Redis from 'ioredis';
import AdmZip from 'adm-zip';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

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
const WORLD_SCAN_TTL = 12 * 60 * 60; // 12 hours
const EXPLANATION_TTL = 6 * 60 * 60; // 6 hours

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.API_KEY;
const getGeminiClient = () => {
  if (!GEMINI_API_KEY) throw new Error('Missing GEMINI_API_KEY/API_KEY for Gemini classification');
  return new GoogleGenAI({ apiKey: GEMINI_API_KEY });
};

// Present-year watchlist (seed situations)
const WATCHLIST = [
  { id: 'russia-ukraine', title: 'Russia–Ukraine war', scope: 'Eastern Europe' },
  { id: 'israel-palestine', title: 'Israel–Palestine conflict', scope: 'Levant' },
  { id: 'red-sea', title: 'Red Sea shipping tensions', scope: 'Bab el-Mandeb / Red Sea' },
  { id: 'taiwan-strait', title: 'Taiwan Strait tensions', scope: 'East Asia' },
  { id: 'south-china-sea', title: 'South China Sea disputes', scope: 'Southeast Asia maritime' },
  { id: 'india-pakistan', title: 'India–Pakistan border tensions', scope: 'South Asia' },
  { id: 'korean-peninsula', title: 'Korean Peninsula standoff', scope: 'Northeast Asia' },
  { id: 'sahel', title: 'Sahel instability', scope: 'West Africa' }
];

const ESCALATION_LADDER = `
Level 0 Stable – diplomacy/normal relations.
Level 1 Coercion – sanctions, embargoes, economic leverage.
Level 2 Grey Zone – cyber, disinformation, espionage pressure.
Level 3 Proxy Conflict – state-backed armed groups or militias.
Level 4 Limited Military – localized kinetic clashes (drones, artillery, border forces).
Level 5 War – sustained state-on-state conventional warfare.
Only one dominant level per situation. Return "uncertain" if unclear.
`;

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

const worldScanKey = 'world_scan_current';
const explanationKey = (id) => `world_scan_expl_${id}`;

const classificationPrompt = (situation) => `
You are classifying a current geopolitical situation for GeoSight.
Return a single JSON object, no prose.

Escalation ladder:
${ESCALATION_LADDER}

Situation: ${situation.title}
Region: ${situation.scope}

Fields:
{
  "id": "${situation.id}",
  "title": "...",
  "escalation_level": 0-5 or "uncertain",
  "trend": "escalating" | "stable" | "de-escalating" | "uncertain",
  "actors": ["ISO or actor names"],
  "countries": ["ISO codes involved"],
  "dominant_instrument": "diplomacy|sanctions|cyber|proxy|limited_military|war|uncertain",
  "confidence": 0.0-1.0,
  "summary": "1-2 sentences, neutral",
  "evidence": ["short bullet evidence points"]
}

Rules: do not invent actors. If data is unclear, set escalation_level to "uncertain" and confidence low.
`;

const explanationPrompt = (situation) => `
Provide a concise markdown explanation for the situation "${situation.title}".
Use 3 bullet points: what is happening, why it matters, trend/uncertainty.
Do not change actors or invent conflicts. Keep under 80 words.
`;

const runWorldScan = async () => {
  const ai = getGeminiClient();
  const results = [];
  for (const s of WATCHLIST) {
    try {
      const resp = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [{ role: 'user', parts: [{ text: classificationPrompt(s) }] }]
      });
      const text = resp.text || '';
      const jsonStart = text.indexOf('{');
      const jsonEnd = text.lastIndexOf('}');
      if (jsonStart === -1 || jsonEnd === -1) continue;
      const parsed = JSON.parse(text.slice(jsonStart, jsonEnd + 1));
      results.push({
        id: s.id,
        title: parsed.title || s.title,
        escalation_level: parsed.escalation_level,
        trend: parsed.trend,
        actors: parsed.actors || [],
        countries: parsed.countries || [],
        dominant_instrument: parsed.dominant_instrument || 'uncertain',
        confidence: parsed.confidence ?? 0,
        summary: parsed.summary || '',
        evidence: parsed.evidence || []
      });
    } catch (err) {
      console.error(`Classification failed for ${s.id}:`, err);
    }
  }

  const lastScannedAt = new Date().toISOString();
  const ticker = results
    .filter(r => r.escalation_level !== 'uncertain')
    .sort((a, b) => (b.escalation_level || 0) - (a.escalation_level || 0))
    .slice(0, 3)
    .map(r => `${r.title}: level ${r.escalation_level} (${r.trend || 'trend unknown'})`)
    .join(' • ');

  const payload = { situations: results, ticker: ticker || 'Scan complete. No clear high-escalation situations.', lastScannedAt };
  await redis.set(worldScanKey, JSON.stringify(payload), 'EX', WORLD_SCAN_TTL);
  return payload;
};

app.get('/api/worldscan', async (_req, res) => {
  try {
    const cached = await redis.get(worldScanKey);
    if (cached) return res.json(JSON.parse(cached));
    const fresh = await runWorldScan();
    return res.json(fresh);
  } catch (e) {
    console.error('World scan error:', e);
    return res.status(500).json({ error: 'World scan failed' });
  }
});

app.post('/api/worldscan/refresh', async (_req, res) => {
  try {
    const fresh = await runWorldScan();
    return res.json(fresh);
  } catch (e) {
    console.error('World scan refresh error:', e);
    return res.status(500).json({ error: 'World scan refresh failed' });
  }
});

app.get('/api/worldscan/:id/explanation', async (req, res) => {
  const { id } = req.params;
  try {
    const cachedWorld = await redis.get(worldScanKey);
    if (!cachedWorld) return res.status(404).json({ error: 'No world scan available' });
    const world = JSON.parse(cachedWorld);
    const situation = (world.situations || []).find((s) => s.id === id);
    if (!situation) return res.status(404).json({ error: 'Situation not found' });

    const cacheKey = explanationKey(id);
    const cached = await redis.get(cacheKey);
    if (cached) return res.json(JSON.parse(cached));

    const ai = getGeminiClient();
    const resp = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ role: 'user', parts: [{ text: explanationPrompt(situation) }] }]
    });
    const text = resp.text || 'Explanation unavailable.';
    const payload = { id, explanation: text, generatedAt: new Date().toISOString() };
    await redis.set(cacheKey, JSON.stringify(payload), 'EX', EXPLANATION_TTL);
    return res.json(payload);
  } catch (e) {
    console.error('Explanation error:', e);
    return res.status(500).json({ error: 'Failed to generate explanation' });
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
