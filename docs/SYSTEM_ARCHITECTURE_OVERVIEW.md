# GeoSight System Architecture Overview

## 1) High-Level Architecture
GeoSight follows a decoupled architecture, separating the **Signal Processing Pipeline** (which builds the world model) from the **Presentation Layer** (which serves the user). They communicate via a central **Data Store** that holds immutable *WorldState* revisions.

## 2) Core Components

### 2.1 Signal Processing Pipeline (The "Backend Builder")
This component is responsible for turning noisy world data into structured `WorldState` revisions.
- **Ingestion Service**: Connects to external APIs (news, strict data feeds) to fetch signals.
- **Extraction Engine**: Uses LLMs configured with strict entity-extraction prompts to identify `events` and `actors`.
- **Synthesis & Scoring Job**: Groups events into `Situations`, evaluates their materiality, and updates `SituationStatus`.
- **State Publisher**: Commits a new immutable `WorldState` revision to the Data Store.
*Technical Constraint:* This pipeline must run asynchronously. The user-facing app should never block waiting for this pipeline to complete, and **LLM inference only happens here in the background, never during a normal user page load.**

### 2.2 Data Store (The "Source of Truth")
Holds the canonical representations described in the World Model Specifications.
- **Relational Database (e.g., PostgreSQL)**: Stores structured entities (`Situations`, `Alliances`, `Actors`, `Regions`, `WorldState` metadata). Ensures strong relationships and enforces schema invariants.
- **Cache Layer (e.g., Redis / CDN)**: Holds the *active* Present-Year `WorldState` JSON payload for immediate, low-latency reads by the UI. **This is how we scale without LLM costs: thousands of users can simultaneously fetch this shared JSON representation without triggering a single AI API call.**

### 2.3 API Layer (The "Presentation Gateway")
Provides data to the client and handles user actions.
- **State Endpoint**: Serves the active `WorldState` JSON payload (directly from cache/CDN) or requested historical `WorldState`. Because this serves pre-computed JSON, it is highly cacheable and basically free to scale.
- **Refresh Endpoint**: Accepts user "live scan" requests, checks rate limits, and triggers the asynchronous Signal Processing Pipeline if allowed.
- **Assistant Endpoint**: Implements a strict RAG flow where the active `WorldState` is injected into the prompt along with the user's query, enforcing the "no unsupported facts" constraint.

### 2.4 Presentation Layer (The "Client UI")
A reactive web or desktop frontend that acts as an analysis surface.
- **State Context Provider**: Holds the single `WorldState` object in memory. All UI components (Map, Conflict List, Alliance List, Ticker) subscribe to this single state.
- **Visualization Components**: Maps (rendered via Mapbox/Leaflet/DeckGL), interactive Sidebars, and timeline lists.
- **Freshness Indicator**: A persistent UI element showing the current `source_type` and `last_scan_time`.

## 3) System Interaction Flows

### Flow A: Background Live Scan
1. Scheduler triggers **Ingestion Service**.
2. **Extraction Engine** and **Synthesis Job** build a candidate `WorldState`.
3. Validated state is saved to the Database.
4. The active Cache is updated with the new revision.

### Flow B: Manual Refresh & UI Update
1. User clicks "Refresh" -> Client calls `/api/refresh`.
2. API validates rate limits and returns `202 Accepted` -> Triggers the Pipeline.
3. Client polls or listens via WebSocket for new `WorldState` revision broadcasts.
4. When published, Client fetches the new `WorldState` and reactively updates the Map, Lists, and Ticker without a page reload.

## 4) Structural Constraints
- **Strict One-Way Data Flow**: The UI *never* edits the world state. It only reads. The Signal Pipeline *never* reads from the UI, it only writes to the Data Store.
- **Immutability of History**: When a year transitions to historical, its final `WorldState` is marked immutable and cached permanently.
- **Asynchronous Execution & Cost Control**: The heavy processing (LLM ingestion and extraction tasks) is completely decoupled from user request-response cycles. We only pay LLM API costs when the `WorldState` needs a material update (e.g., via a Background Live Scan or a rate-limited Manual Refresh), not when a user simply opens the page.
