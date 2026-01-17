# GeoSight – Current-Year Geopolitical Intelligence Design Summary

## Purpose

This document summarizes the current state of thinking around GeoSight’s **present-year geopolitical intelligence system**. It captures where we are conceptually, what problems we are solving, and the direction we have agreed to move forward with. This is not a coding prompt or a technical specification. It is an intent and design summary.

---

## Core Goal

GeoSight aims to present a **clear, trustworthy, and non-overwhelming picture of the world’s current geopolitical unrest**, updated periodically and explorable visually on a map.

The system should help users answer:
- What kinds of geopolitical disruptions are happening right now?
- Where are they happening?
- How severe are they?
- Why are they happening?

The emphasis is on **sense-making**, not news aggregation or raw data display.

---

## Scope: Focus on the Current Year First

We are intentionally focusing on the **current year only** at this stage.

- Historical backfilling (1900 / 1914 onward) will be addressed later.
- For now, the system should maintain a live, evolving understanding of the present world state.
- The current year is treated as **dynamic and uncertain**, unlike historical years which will later be static and archival.

---

## Conceptual Model: A Periodic “World Scan”

The current geopolitical state is represented as a **World Scan**, not a continuous stream.

- The system refreshes its understanding of the world on a fixed cadence (e.g. every 6–12 hours).
- Between scans, the map remains stable.
- Users can manually trigger a refresh using a **“Live Scan”** button.
- Each scan represents “what the system believes about the world at time T”.

This avoids map flicker, noise, and cognitive overload.

---

## Escalation Ladder (Core Ontology)

All international unrest is classified along a **single, ordered escalation ladder**, defined by the dominant instrument being used.

| Level | Name                | Dominant Instrument            | Example                          |
|------:|---------------------|--------------------------------|----------------------------------|
| 0     | Stable              | Diplomacy                      | Most international relations     |
| 1     | Coercion            | Sanctions / Embargoes          | U.S. vs Cuba                     |
| 2     | Grey Zone           | Cyber / Disinformation         | Election interference            |
| 3     | Proxy Conflict      | State-backed armed groups      | Iran–Saudi rivalry via militias  |
| 4     | Limited Military    | Drones / border forces         | India–Pakistan border clashes    |
| 5     | War                 | Full military force            | Russia–Ukraine                   |

Key properties of this model:
- Exactly one dominant level per situation.
- Levels are mutually exclusive and ordered.
- Works across time and regions.
- Maps directly to color, intensity, and filtering in the UI.
- Simple enough for reliable AI classification.

Level 0 is treated as a baseline (no disruption), not active unrest.

---

## Data Strategy: Gemini as Classifier and Explainer

We are explicitly **not** relying on fixed datasets (UCDP, ACLED, GDELT) for the current-year world model due to limitations in flexibility, granularity, and selectivity.

Instead:
- Gemini is used as a **controlled classifier and explainer**, not a free-form analyst.
- Gemini is never asked to “find conflicts globally”.
- Gemini is asked to **classify known geopolitical situations within a defined scope**.

Gemini’s responsibilities:
1. Classify the current situation into an escalation level (0–5).
2. Identify primary actors and geography.
3. Assess trend (escalating, stable, de-escalating).
4. Provide a concise, neutral explanation grounded in recent reporting.
5. Explicitly express uncertainty when appropriate.

Gemini is not allowed to invent facts, redefine history, or operate without scope.

---

## Structured Outputs (Frontend-Pluggable)

All Gemini responses must be **structured**, deterministic, and directly usable by the frontend.

Each Gemini call produces a single structured object representing a current geopolitical situation, including:
- Classification (level, label, dominant instrument)
- Actors involved
- Geographic scope
- Activity status and trend
- Confidence level
- Human-readable explanation fields
- Evidence and uncertainty notes

Descriptive text is subordinate to structured fields, not the other way around.

This ensures:
- No interpretation layer is required in the frontend.
- Map rendering is data-driven.
- Outputs can be cached, diffed, and versioned.

---

## Map Design Principles (Avoiding Overload)

To preserve clarity:
- At global zoom, only the **highest-escalation situation per region** is shown.
- Lower-level unrest is hidden unless users zoom in or apply filters.
- Visual weight scales with escalation level.
- Users can filter explicitly by escalation level (e.g. “Show only Wars”).

The map should feel like a strategic overview, not a news feed.

---

## Caching Strategy (Cost and Stability Control)

Two conceptual caches are used:

1. **World State Cache**
   - Stores the current set of active situations and their classifications.
   - Drives the map.
   - Updated on scheduled scans or Live Scan.
   - TTL: ~6–12 hours.

2. **Explanation Cache**
   - Stores Gemini-generated explanations for each situation.
   - Used when users click or explore.
   - TTL varies by severity (shorter for wars, longer for stable tensions).

When a user clicks:
- If explanation is fresh → serve from cache.
- If missing or stale → call Gemini and update cache.

This minimizes API usage while keeping explanations current.

---

## Live Scan (User-Initiated Refresh)

The Live Scan button:
- Triggers a full re-evaluation of the current world state.
- Updates escalation levels and trends if necessary.
- Updates a visible “Last scanned at” timestamp.

It does not:
- Create continuous updates.
- Override explanations unless required.
- Introduce instability into the UI.

---

## Where We Are Now

We have:
- A clear escalation ontology.
- A defined role for Gemini that avoids hallucination.
- A stable refresh model.
- A frontend-driven structured output philosophy.
- A strategy to keep the map readable and meaningful.

---

## Where We Are Going Next

Remaining decisions and design work include:
- Writing the exact Gemini classification and explanation prompts.
- Defining dominance rules when multiple signals exist.
- Deciding how to scope which situations are evaluated per scan.
- Designing how historical data (1900 onward) is backfilled into the same schema.

The foundation is now solid. Everything ahead is implementation and refinement, not conceptual rework.
