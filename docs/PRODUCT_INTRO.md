# GeoSight: Understand the World at a Glance

**Turn global chaos into clarity.**

GeoSight is an interactive atlas that brings geopolitics to life. Instead of reading dozens of disconnected news articles, you can simply look at the map to understand who is allied with whom, where conflicts are happening, and why it matters right now.

## Why GeoSight?
The world is complex. Understanding the relationships between nations usually requires digging through history books or endless news feeds. GeoSight puts it all in one place—a living, breathing map that explains itself.

## Key Features

### 🌍 Real-Time Global Intelligence
The world moves fast. GeoSight keeps up.
*   **Live News Ticker**: See the most critical geopolitical developments happening right now, streamed directly to the top of your screen.
*   **Active Conflict Zones**: Instantly visualize where tensions are high and see who is involved.

### ⏳ Time Travel through History
See how the map of power has shifted over the last century.
*   **Future Scenarios (2026)**: Explore potential near-future alliances and risks.
*   **The Cold War (1960)**: Step back in time to see the world divided between East and West.
*   **The Great War (1914)**: Visualize the fragile alliances that set the stage for WWI.

### 🤖 Your Personal Geopolitical Analyst
Have a question? Just ask.
*   **AI Chat Sidebar**: A smart assistant is always available to explain complex situations. Ask questions like *"Why is this alliance forming?"* or *"What are the risks in this region?"* and get clear, neutral answers.
*   **Context Aware**: The analyst knows which year you are looking at—so if you ask about Germany in 1939, it understands the historical context perfectly.

### 🔍 Instant Deep Dives
Click on any country, alliance, or conflict zone to get an immediate summary.
*   **Strategic Status**: Is this alliance strong or fracturing?
*   **Key Players**: Who are the major members?
*   **Risk Analysis**: How intense is the conflict?

## What powers the map
- **Basemap geometry**: World GeoJSON from Holtzy’s GitHub sample (`https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson`) plus India’s composite geometry from Datameet (`https://raw.githubusercontent.com/datameet/maps/master/Country/india-composite.geojson`).
- **Historical & hypothetical states**: Curated ISO-A3 alliance/conflict data hardcoded in `services/dataService.ts` (1914, 1939, 1960, 1990, 2010, 2024, 2026).
- **Styling & projection**: D3 GeoMercator with Tailwind-driven UI.

## What powers the intelligence
- **Live news ticker**: Google Gemini (`gemini-3-flash-preview`) with `googleSearch` tool enabled, asking for “top 3 critical geopolitical developments” (cached hourly).
- **Analyst Link chat**: Gemini `gemini-3-flash-preview` with `googleSearch` when the selected year is 2024; streams responses with the in-app system prompt.
- **Country/Alliance/Conflict briefs**: Gemini `gemini-3-flash-preview` (search grounded only for 2024) using structured prompts; cached via Redis/localStorage through the cache proxy.

## Key experiences
- **🌍 Real-Time Global Intelligence**: Live headlines + conflict overlays at a glance.
- **⏳ Time Travel**: Jump between eras (1914→2026) to see alliances and flashpoints evolve.
- **🤖 Context-Aware Analyst**: Ask “Why is this alliance forming?” or “What’s the escalation risk here?” and get neutral, concise answers tied to the selected year.
- **🔍 Instant Deep Dives**: Click any country, alliance, or conflict for an AI brief with sources noted above.

## Who is it for?
*   **News Junkies**: Get the context behind the headlines.
*   **Students**: Visualize history instead of just reading dates.
*   **Strategists**: See the big picture of global risks and opportunities.

---
*GeoSight: The map that speaks.* 
