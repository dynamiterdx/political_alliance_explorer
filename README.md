# GeoSight - Global Sensemaking Engine

GeoSight is a React-based interactive geopolitical atlas powered by Google's Gemini API. It visualizes global alliances, active conflicts, and historical shifts while providing a conversational AI interface for deep situational analysis.

## 🚀 Overview

GeoSight combines D3.js data visualization with Large Language Model (LLM) reasoning to create a "live" map of the world. Unlike static maps, GeoSight understands context—it knows which alliances were active in 1960 vs 2026, it simulates potential future conflict zones, and it pulls real-time intelligence using Gemini's grounding capabilities.

## ✨ Key Features

*   **Interactive World Map**: D3.js-powered vector map with zoom, pan, and click interactions.
*   **Layer System**: Toggleable layers for Alliances (Military/Economic) and Active Conflicts.
*   **Timeline Navigation**: instant state switching between historical eras (1914, 1939, Cold War) and future scenarios (2026).
*   **Live Intel Ticker**: Real-time geopolitical headlines fetched via Gemini Search Grounding.
*   **AI Chat Analyst**: A sidebar chatbot with a persistent persona ("Geopolitical Analyst") aware of the current map state.
*   **Smart Info Panels**: dynamic generation of country, alliance, and conflict summaries using GenAI.
*   **Multi-Alliance Comparison**: Visual logic to compare overlapping alliance memberships.

## 🛠️ Technical Stack

*   **Frontend**: React 19, TypeScript, Vite
*   **Styling**: Tailwind CSS (Dark Mode focused)
*   **Visualization**: D3.js (GeoMercator projection)
*   **Icons**: Lucide React
*   **AI/LLM**: Google Gemini API (`@google/genai` SDK)

## 🧠 Gemini API Integration

GeoSight relies heavily on the Google GenAI SDK to provide dynamic content.

### 1. The "Live Feed" (Search Grounding)
The scrolling ticker at the top of the app is not hardcoded. It triggers a function `getGlobalHeadlines` in `geminiService.ts`.
*   **Model**: `gemini-3-flash-preview`
*   **Tool**: `googleSearch`
*   **Mechanism**: The app asks Gemini for "top 3 critical geopolitical developments". The model queries Google Search, synthesizes the results, and returns a concise summary which is displayed in the UI.

### 2. Context-Aware Chat
The `ChatAnalyst` component maintains a session using `ai.chats.create()`.
*   **System Instruction**: The model is primed with a persona that values neutrality, systemic thinking, and brevity.
*   **Context Injection**: When the user changes the year slider (e.g., to 1960), the app injects a hidden system prompt or context update so the AI knows to speak about the Cold War rather than modern events.

### 3. On-Demand Intelligence
When a user clicks a country or alliance:
*   **Dynamic Prompts**: The app constructs a prompt like "Provide a strategic assessment of NATO in the year 2026."
*   **Streaming/Async**: Responses are generated on-the-fly, allowing the content to adapt if the "Geopolitical State" data changes (e.g., if we updated the member list of an alliance in the code).

## 📂 Project Structure

```
src/
├── components/         # React UI components
│   ├── WorldMap.tsx    # D3.js map logic & rendering
│   ├── ChatAnalyst.tsx # Right sidebar chat interface
│   ├── LeftSidebar.tsx # Layers & Legends
│   └── ...Panels.tsx   # Detail popups
├── services/
│   ├── dataService.ts  # Hardcoded historical datasets (Alliances/Conflicts)
│   └── geminiService.ts# Google GenAI SDK wrapper & prompt logic
├── types.ts            # TypeScript interfaces
└── App.tsx             # Main layout & State management
```

## ⚡ Setup & Run

1.  **Clone the repository**.
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Configure API Key**:
    *   Ensure `process.env.API_KEY` is available (e.g., via `.env` file or environment variables) containing a valid Google Gemini API key.
4.  **Start Dev Server**:
    ```bash
    npm run dev
    ```

## Author

Archit Mishra  
Bengaluru, India  
architmishrapro@gmail.com

## 🗺️ Data Sources

*   **Map Geometry**: Low-resolution World GeoJSON (sourced from GitHub for demo purposes).
*   **Geopolitical Data**: `dataService.ts` contains a structured JSON representation of world history (1914-2026), defining alliance members (ISO-A3 codes) and conflict vectors.

## 🔮 Future Roadmap

*   **Predictive Simulation**: Ask Gemini to "simulate next turn" and update the map state programmatically based on the response.
*   **Economic Layers**: Heatmaps for GDP, Trade Volume, or Resource dependencies.
*   **Gemini 2.0 Flash**: Migrating to faster models for near-instant map recoloring based on natural language queries ("Show me all countries that export Lithium").
