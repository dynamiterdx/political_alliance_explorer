# GeoSight Domain Model Definition

## 1) Core Entities

### Entity: `YearContext`
- **Purpose:** defines temporal mode for all product behavior.
- **Attributes (conceptual):**
  - `year` (numeric)
  - `mode` (`historical` | `present-live`)
  - `isKeyYear` (boolean)

### Entity: `WorldState`
- **Purpose:** single authoritative state used by map, lists, ticker, and assistant context.
- **Attributes:**
  - `year`
  - `source` (`live` | `cache` | `curated`)
  - `lastScannedAt` (timestamp or null for purely curated state)
  - `situations` (collection of `Situation`)
  - `alliances` (collection of `Alliance`)
  - `tickerItems` (collection of `TickerItem`)
  - `stateRevisionId` (logical revision identifier)

### Entity: `Situation`
- **Purpose:** represents a materially important geopolitical tension/conflict pattern.
- **Attributes:**
  - `situationId`
  - `title`
  - `countries` (ISO-3 list)
  - `actors` (state/non-state actor labels)
  - `regionScope`
  - `intensityLevel` (ordinal band)
  - `trend` (`escalating` | `stable` | `cooling` | `uncertain`)
  - `dominantInstrument` (military/economic/political/cyber/information)
  - `summaryWhat`
  - `summaryWhy`
  - `summaryHow`
  - `confidence`
  - `evidence` (collection of `EvidenceItem`)

### Entity: `Alliance`
- **Purpose:** captures cooperative geopolitical bloc structure.
- **Attributes:**
  - `allianceId`
  - `name`
  - `members` (ISO-3 list)
  - `status` (`active` | `strained` | `inactive`)
  - `summary`

### Entity: `TickerItem`
- **Purpose:** concise top-line change signal.
- **Attributes:**
  - `tickerId`
  - `headline`
  - `linkedSituationIds`
  - `importanceRank`
  - `createdAt`

### Entity: `EvidenceItem`
- **Purpose:** traceability anchor for live present-year claims.
- **Attributes:**
  - `evidenceId`
  - `sourceReference`
  - `capturedAt`
  - `relevanceNote`

### Entity: `AssistantExchange`
- **Purpose:** user query and constrained assistant answer tied to active world state.
- **Attributes:**
  - `exchangeId`
  - `question`
  - `answer`
  - `yearContext`
  - `stateRevisionId`
  - `uncertaintyFlag`
  - `speculationFlag`

## 2) Relationships
- `YearContext` selects exactly one active `WorldState`.
- `WorldState` contains zero-to-many `Situation`.
- `WorldState` contains zero-to-many `Alliance`.
- `WorldState` contains zero-to-many `TickerItem`.
- `Situation` contains one-to-many `EvidenceItem`.
- `TickerItem` may reference one-to-many `Situation`.
- `AssistantExchange` must reference exactly one `YearContext` and one `WorldState` revision.

## 3) Invariants and Business Rules
- Exactly one active `WorldState` per selected `YearContext` at a time.
- If `YearContext.mode = historical`, `WorldState.source` must be `curated`.
- If `YearContext.mode = present-live`, `WorldState.source` may be `live` or `cache`, never implicit.
- `Situation.countries` must use ISO-3 codes.
- Every present-live `Situation` must include confidence and at least one evidence reference unless explicitly marked insufficient-signal.
- `TickerItem` must represent material change, not generic headline chatter.
- Assistant answers must not contradict active `WorldState` facts.

## 4) Ownership Boundaries
- **Curated Historical Owner:** maintains historical alliances/conflicts and key-year narratives.
- **Live Signal Owner:** maintains present-year grounded acquisition and structured situation generation.
- **Presentation Owner:** renders world state into map/list/ticker interfaces without altering source semantics.
- **Assistant Owner:** explains current world state and historical context under guardrails; does not create source truth.

## 5) State Transitions

### `WorldState` Lifecycle (Present Year)
1. `Idle` (no scan in progress)
2. `Scanning` (live retrieval/structuring in progress)
3. `Validated` (payload passes business invariants)
4. `PublishedLive` (new live state becomes active)
5. `PublishedCacheFallback` (live failed, last valid cached state remains active)
6. `ErrorNoState` (live failed and no valid fallback exists)

Allowed transitions:
- `Idle -> Scanning`
- `Scanning -> Validated`
- `Validated -> PublishedLive`
- `Scanning -> PublishedCacheFallback`
- `Scanning -> ErrorNoState`
- `PublishedLive -> Scanning`
- `PublishedCacheFallback -> Scanning`

### `Situation` Trend Transition
- `uncertain -> escalating|stable|cooling` when sufficient evidence is available.
- `escalating|stable|cooling -> uncertain` when confidence drops below policy threshold.

## 6) Interpretation Constraints for Future Agents
- Do not redefine `WorldState` as a raw event log.
- Do not bypass evidence/confidence fields for present-live situations.
- Do not merge historical curated semantics with live semantics without explicit product-policy change.
- Do not let assistant output become a substitute for structured `Situation` entities.
- Do not remove explicit `source` and `lastScannedAt` from active present-year state.
