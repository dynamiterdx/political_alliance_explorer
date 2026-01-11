// --- FRONTEND CACHE SERVICE ---
// Connects to the secure Node.js proxy (server.js).
// Falls back to LocalStorage if the server is offline.

const SERVER_URL = 'http://localhost:3001/api';
const CACHE_PREFIX = 'geosight_intel_';
const STANDARD_TTL_MS = 24 * 60 * 60 * 1000; // 24 Hours

interface CachePayload {
  content: string;
  timestamp: number;
  version: number;
}

export const generateCacheKey = (type: string, name: string, year: number): string => {
  const safeName = name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
  return `${CACHE_PREFIX}${type}_${safeName}_${year}`;
};

export const checkCacheHealth = async (): Promise<boolean> => {
  try {
    const res = await fetch(`${SERVER_URL}/health`);
    if (res.ok) {
      const data = await res.json();
      return data.redis === 'connected';
    }
    return false;
  } catch (e) {
    return false;
  }
};

/**
 * Tier 1: Remote Server (Redis Proxy)
 * Tier 2: Local Storage (Fallback)
 */
export const getCachedData = async (key: string, ttlMs: number = STANDARD_TTL_MS): Promise<string | null> => {
  // 1. Try Server (Redis)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1000); // Fast timeout to avoid UI lag

    const response = await fetch(`${SERVER_URL}/cache?key=${encodeURIComponent(key)}`, {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    if (response.ok) {
      const data: CachePayload = await response.json();
      if (data && data.content) {
        // Update local cache to match server
        saveToLocal(key, data.content);
        return data.content;
      }
    }
  } catch (err) {
    // Server is likely offline or unreachable (CORS/Network).
    // Silently fall back to local storage.
  }

  // 2. Fallback to Local Storage
  return getFromLocal(key, ttlMs);
};

/**
 * Writes data to Server (Redis) and Local Storage.
 */
export const setCachedData = async (key: string, content: string): Promise<void> => {
  // 1. Save Local (Immediate)
  saveToLocal(key, content);

  // 2. Save Server (Background)
  try {
    fetch(`${SERVER_URL}/cache`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, content })
    }).catch(() => {
      // Ignore background save errors
    });
  } catch (e) {
    // Ignore
  }
};

// --- Local Storage Helpers ---

const getFromLocal = (key: string, ttlMs: number): string | null => {
  try {
    const item = localStorage.getItem(key);
    if (!item) return null;

    const entry: CachePayload = JSON.parse(item);
    if (Date.now() - entry.timestamp > ttlMs) {
      localStorage.removeItem(key);
      return null;
    }

    return entry.content;
  } catch (e) {
    return null;
  }
};

const saveToLocal = (key: string, content: string) => {
  try {
    const entry: CachePayload = {
      content,
      timestamp: Date.now(),
      version: 1
    };
    localStorage.setItem(key, JSON.stringify(entry));
  } catch (e) {
    // Storage quota exceeded
  }
};
