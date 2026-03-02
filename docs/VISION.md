# GeoSight Vision (Gemini-Grounded)

## What We’re Building
GeoSight is a live geopolitical sense-making tool. For the present year (2026), Gemini Grounded Search is the **foundational information layer**: it is where live geopolitical facts are collected, validated, and structured before anything is visualized. Past years remain curated and static. The system is designed to surface geopolitically important events, connect them to the **what, why, and how**, and render a coherent world model rather than a raw stream of headlines.

## Product Thesis
- **Gemini grounding is the source layer for the present year:** It is not a cosmetic explainer added after noisy ingestion. Grounded retrieval and structured extraction are the first step in the intelligence pipeline.
- **GeoSight is a sense-making engine, not a feed reader:** The app prioritizes consequential developments, maps them to actors and regions, and exposes causal context.
- **Every visible signal must answer three questions:**
  - `What happened?` (event pattern and affected actors/regions)
  - `Why does it matter?` (strategic consequence and escalation/cooling implication)
  - `How is it unfolding?` (instrument, trend, and confidence)

## Core Principles
- **Grounded-first architecture:** Gemini Grounded Search produces the live factual substrate for the present year. Visualization and narration consume this substrate; they do not replace it.
- **Grounded, not imagined:** Gemini must not invent alliances, conflicts, or risk levels. Any statement must be anchored in grounded evidence.
- **Transparency:** Every live element shows when it was last scanned and whether it’s live or cached. No silent fallbacks.
- **Signal > headline:** We model clusters, trends, and intensity, not article-by-article chatter.
- **Separation of concerns:** Server performs grounded retrieval, normalization, and scoring; client renders and lets users interrogate the model.
- **Historical stability:** Curated timelines for past years; only the present year is dynamic.

## Data & Processing
1) **Grounded acquisition (server-side):** Gemini Grounded Search queries a hotspot watchlist plus broad global scan prompts. This is the primary ingestion path for present-year live data.
2) **Structured extraction:** Grounded results are normalized into a canonical schema (actors, ISO-3 countries, location, instrument, event pattern, confidence, timestamp, evidence links).
3) **Importance filtering:** Low-signal or duplicative chatter is suppressed. Only materially relevant situations are promoted into the world model.
4) **Scoring & trend detection:**
   - Frequency and recency within rolling windows (e.g., 7d/30d).
   - Trend delta vs previous window to capture escalation/cooling.
   - Intensity buckets (calm -> elevated -> critical) derived from scored signals.
5) **Conflict synthesis:** Structured situations are clustered by dyad/region and transformed into concise conflict objects for map and sidebar use.
6) **Alliance handling:** Alliances remain relatively stable. Present-year alliance health may be revalidated by grounded signals, but alliances are not freely reimagined.
7) **Caching and freshness controls:**
   - World scan cache (e.g., 6-12h TTL) shared across all users.
   - Manual `Refresh Scan` resets freshness for everyone.
   - If live scan fails, cached state is served *with explicit status messaging*.
   - No implicit fallback that can be mistaken for live data.

## Output Contract: What/Why/How
Every present-year situation shown in GeoSight should include:
- **What:** the conflict/tension label, actors, and geospatial scope.
- **Why:** strategic relevance and near-term systemic effect.
- **How:** dominant instrument (military/economic/political/cyber/information), trend direction, confidence, and evidence links.

## API/Model Contract (proposed)
- `worldState`: `{ scannedAt, source: live|cache, conflicts: [], alliances: [], ticker: [] }`
- `conflict`: `{ id, title, countries: [ISO3], summary, intensity, trend, evidence: [urls], centroid }`
- `alliance`: `{ id, name, members: [ISO3], summary, status }`
- `tickerItem`: High-impact changes only (escalation, new actor, ceasefire).

## User Experience
- **Map:** Arrows/heat for conflict intensity; callouts anchored at centroids; clicking highlights participants.
- **Left pane:** Alliances and Conflicts lists with filters (region, intensity); each conflict row should communicate the what/why/how summary in compact form.
- **Top status chip:** Single badge showing LIVE or CACHED with timestamp.
- **Ticker:** Only material changes; no general headlines.
- **Assistant:** Explains the current world model produced from grounded signals; cites scan time, confidence, and uncertainty; speculation labeled as such.

## Guardrails for Gemini
- Prompts enforce ISO-3 country codes and require source-backed statements.
- Grounding output must be converted to strict structured objects before rendering.
- Summaries must cite structured signals and evidence links; no free-form geopolitical storytelling detached from data.
- If signals are thin or contradictory, respond with “insufficient recent signals” rather than guessing.

## Non-Goals
- No client-side scraping or heavy parsing.
- No “everything dashboard” behavior that dumps all events without prioritization.
- No hallucinated future forecasts presented as fact (speculation must be explicit).

## Approaches Explored and Parked
- **GDELT client-side ingestion:** We fetched GDELT CSV/JSON directly in the browser and parsed per page load. Problems: heavy download for each user, rate/latency concerns, CORS fragility, and unfiltered event noise leading to poor signal-to-noise.
- **GDELT server proxy (basic):** Tried a thin proxy that pulled GDELT feeds and lightly filtered by country codes. Issues: still high noise, minimal clustering/trend logic, and no strong provenance surfaced to users. We paused this pending a richer scoring pipeline.
- **Hardcoded conflicts/alliances for present year:** Initially set static conflict lists (binary on/off). This failed to reflect real-time shifts and made the map feel synthetic; kept only curated *historical* years static.
- **Ungrounded LLM generation:** Early prompts let the model infer conflicts without grounding. Risk of hallucination was unacceptable; current stance is grounded retrieval plus structured extraction first.
- **Raw API news aggregation (non-Gemini):** Considered general news APIs without grounding; rejected due to cost, licensing, and weaker attribution/traceability vs grounded search.

## Near-Term Steps
1) Implement server ingestion + cache for grounded search results and derived world state.
2) Wire frontend to the summarized `worldState` contract; replace any raw client fetches.
3) Add status chip + explicit cached banner; manual refresh button with shared cooldown.
4) Tighten Gemini prompts to demand ISO-3 codes, evidence links, and concise conflict briefs.
5) Verify callout placement and conflict list visibility against the new payload.
