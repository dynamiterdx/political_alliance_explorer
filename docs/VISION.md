# GeoSight Vision (Gemini-Grounded)

## What We’re Building
GeoSight is a live geopolitical sense-making tool. The present year (2026) is driven by continuously refreshed, structured signals gathered via Gemini Grounded Search; past years remain curated and static. The system summarizes conflicts, tensions, and alliances into a clear world model and explains *why* the map looks the way it does—never a raw data dump.

## Core Principles
- **Grounded, not imagined:** Gemini is used to *retrieve and summarize* from real sources; it must not invent alliances or conflicts.
- **Transparency:** Every live element shows when it was last scanned and whether it’s live or cached. No silent fallbacks.
- **Signal > headline:** We care about clusters, trends, and intensity—not individual news stories.
- **Separation of concerns:** Server ingests & scores; client renders & explains. Heavy lifting stays off the browser.
- **Historical stability:** Curated timelines for past years; only the present year is dynamic.

## Data & Processing
1) **Grounded search fetch** (server-side): Gemini grounded search queries a watchlist of hotspots and broad “global scan” prompts. Results are normalized into structured events (actors, ISO-3 countries, location, event type, sentiment/tone, timestamp).
2) **Scoring & trend detection:**
   - Frequency and recency within rolling windows (e.g., 7d/30d).
   - Trend delta vs previous window to capture escalation/cooling.
   - Intensity buckets (calm → elevated → critical) derived from scored signals.
3) **Conflict synthesis:** Events are clustered by dyads/regions; Gemini summarizes clusters into short conflict briefs and callouts (must reference structured signals and keep country codes consistent).
4) **Alliances:** Treated as relatively stable; present-year alliances come from curated data, optionally revalidated by grounded search for breaking changes.
5) **Caching:**
   - World scan cache (e.g., 6–12h TTL) shared across all users.
   - Manual “Refresh Scan” resets the timer for everyone.
   - If live scan fails, cached state is served *with an explicit banner*.

## API/Model Contract (proposed)
- `worldState`: `{ scannedAt, source: live|cache, conflicts: [], alliances: [], ticker: [] }`
- `conflict`: `{ id, title, countries: [ISO3], summary, intensity, trend, evidence: [urls], centroid }`
- `alliance`: `{ id, name, members: [ISO3], summary, status }`
- `tickerItem`: High-impact changes only (escalation, new actor, ceasefire).

## User Experience
- **Map:** Arrows/heat for conflict intensity; callouts anchored at centroids; clicking highlights participants.
- **Left pane:** Alliances and Conflicts lists with filters (region, intensity); mirrors the alliance UX for conflicts.
- **Top status chip:** Single badge showing LIVE or CACHED with timestamp.
- **Ticker:** Only material changes; no general headlines.
- **Assistant:** Explains “why the map looks this way,” cites scan time and confidence; speculation labeled as such.

## Guardrails for Gemini
- Prompts enforce ISO-3 country codes and require source-backed statements.
- Summaries must cite the structured signals provided; no free-form geopolitics.
- If signals are thin or contradictory, respond with “insufficient recent signals” rather than guessing.

## Non-Goals
- No client-side scraping or heavy parsing.
- No hallucinated future forecasts presented as fact (speculation must be explicit).

## Near-Term Steps
1) Implement server ingestion + cache for grounded search results and derived world state.
2) Wire frontend to the summarized `worldState` contract; replace any raw client fetches.
3) Add status chip + explicit cached banner; manual refresh button with shared cooldown.
4) Tighten Gemini prompts to demand ISO-3 codes, evidence links, and concise conflict briefs.
5) Verify callout placement and conflict list visibility against the new payload.

