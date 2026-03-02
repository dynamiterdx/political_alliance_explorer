// Lightweight backend to run Gemini-grounded "world scan" and serve cached results.
// Start with: node server.js (uses PORT=3001 by default)

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const PORT = process.env.PORT || 3001;
const CACHE_PATH = path.join(process.cwd(), 'data', 'worldscan-cache.json');
const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours

const ensureDataDir = () => {
  const dir = path.dirname(CACHE_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

const getClient = () => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
  if (!apiKey) {
    throw new Error('Missing GEMINI_API_KEY/API_KEY');
  }
  return new GoogleGenAI({ apiKey });
};

const baseResponse = (payload, source = 'live') => ({
  ...payload,
  source,
  lastScannedAt: payload.lastScannedAt || new Date().toISOString()
});

const readCache = () => {
  if (!fs.existsSync(CACHE_PATH)) return null;
  try {
    const raw = fs.readFileSync(CACHE_PATH, 'utf8');
    const data = JSON.parse(raw);
    return data;
  } catch (e) {
    console.error('Cache read error', e);
    return null;
  }
};

const writeCache = (data) => {
  try {
    ensureDataDir();
    fs.writeFileSync(CACHE_PATH, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('Cache write error', e);
  }
};

const runWorldScan = async () => {
  const ai = getClient();
  const prompt = `You are GeoSight's world-scan engine (date: Feb 24 2026). 
Return a concise JSON with key hotspots only. Use ISO-3 country codes.

Required JSON shape:
{
  "situations": [
    {
      "id": "string",
      "title": "string",
      "escalation_level": 1-5,
      "trend": "escalating|stable|cooling",
      "actors": ["state or major actor names"],
      "countries": ["ISO3", "ISO3"],
      "dominant_instrument": "military|economic|political|cyber|information",
      "confidence": 0-1,
      "summary": "<=35 words, factual",
      "evidence": ["URL", "URL"]
    }
  ],
  "ticker": "<=120 chars highlighting the biggest live shift"
}

Rules:
- Base facts on grounded search results only.
- No hallucinated conflicts or generic actors; use nation-states where possible.
- Limit to the most material 6-8 situations worldwide.
- If evidence is thin, mark confidence below 0.5 and say "signals thin" in summary.
`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: { responseMimeType: 'application/json' }
  });

  if (!response.text) throw new Error('Empty Gemini response');

  // Gemini often wraps JSON in markdown fences; strip them.
  const cleaned = response.text
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim();

  const parsed = JSON.parse(cleaned);
  const payload = baseResponse({
    situations: parsed.situations || [],
    ticker: parsed.ticker || 'Live scan available.'
  });
  writeCache(payload);
  return payload;
};

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/worldscan', async (req, res) => {
  try {
    const cached = readCache();
    const freshEnough = cached && cached.lastScannedAt && (Date.now() - new Date(cached.lastScannedAt).getTime() < CACHE_TTL_MS);
    if (freshEnough) {
      return res.json(baseResponse(cached, 'cache'));
    }
    const live = await runWorldScan();
    return res.json(live);
  } catch (e) {
    console.error('worldscan get error', e);
    const cached = readCache();
    if (cached) return res.json(baseResponse(cached, 'cache'));
    return res.status(500).json({ error: 'No scan available' });
  }
});

app.post('/api/worldscan/refresh', async (req, res) => {
  try {
    const live = await runWorldScan();
    return res.json(live);
  } catch (e) {
    console.error('worldscan refresh error', e);
    const cached = readCache();
    if (cached) return res.json(baseResponse(cached, 'cache'));
    return res.status(500).json({ error: 'Refresh failed and no cache' });
  }
});

// Minimal stub to prevent 404s if called
app.get('/api/gdelt/events', (req, res) => {
  return res.json({ events: [], fetchedAt: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`GeoSight world-scan backend running on http://localhost:${PORT}`);
});
