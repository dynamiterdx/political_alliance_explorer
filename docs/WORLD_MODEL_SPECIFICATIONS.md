# GeoSight World Model and Signal Pipeline Specification

This document closes structural gaps in the system specification by defining:

1. Canonical **World State Schema**
2. **Situation Ontology** used for geopolitical classification
3. **Signal Processing Pipeline** that converts raw signals into structured world state

This document is authoritative for how geopolitical reality is represented inside GeoSight.

---

# 1. Canonical World State Schema

The GeoSight system operates on a single authoritative object called the **World State**.

All user interface surfaces derive their data from this object.

These include:

* world map
* conflict list
* alliance list
* top ticker
* assistant context

The system must never allow multiple inconsistent state representations to exist simultaneously.

---

## 1.1 WorldState Object

Fields:

```
WorldState
  revision_id
  year
  created_at
  last_scan_time
  freshness_status        (live | cached | historical)
  source_type             (live_scan | curated_snapshot)

  situations[]
  alliances[]
  actors[]
  regions[]
```

### Field Descriptions

**revision_id**
Unique identifier for the current world state revision.

**year**
Year the world state represents.

**created_at**
Timestamp when this revision was created.

**last_scan_time**
Timestamp of most recent live scan that contributed to this state.

**freshness_status**
Indicates whether the data is live, cached fallback, or historical.

**source_type**
Indicates whether the world state originated from live scanning or curated historical data.

---

# 2. Core Entities

## 2.1 Situation Object

A **Situation** represents a materially significant geopolitical development.

Situations are the primary analytic unit of the GeoSight system.

### Situation Lifecycle

Situations persist through a lifecycle and are never removed from the world state solely because activity has subsided.

Instead, situations transition through status states that represent their current level of activity.

```
SituationStatus

  emerging
  active
  stabilizing
  resolved
  dormant
```

### Status Definitions

**emerging**
Early signals indicate a situation may develop.

**active**
Situation is currently producing meaningful geopolitical activity.

**stabilizing**
Activity is decreasing but the situation remains relevant.

**resolved**
Situation has concluded but remains part of the historical record.

**dormant**
Situation is inactive but may re-emerge in the future.

Situations must remain in the world state for the remainder of the year once detected.

---

### Situation Schema

```
Situation
  id
  title
  type
  status

  actors[]
  regions[]

  summary
  causes
  trajectory

  intensity_score
  trend_direction

  confidence_level
  evidence[]

  start_date
  end_date

  first_detected
  last_updated
```

### Field Meaning

**type**
Classification according to the Situation Ontology.

**status**
Current lifecycle state of the situation.

**actors**
States or organizations involved.

**regions**
Geographic areas impacted.

**summary**
Short explanation of what is happening.

**causes**
Drivers or motivations behind the situation.

**trajectory**
Direction the situation appears to be evolving toward.

**intensity_score**
Relative level of geopolitical significance.

**trend_direction**
Escalating, stabilizing, or de-escalating.

**confidence_level**
System confidence based on evidence quality.

**evidence**
References supporting the situation.

**start_date**
Date when the situation began.

**end_date**
Date when the situation reached resolved state (optional).

**first_detected**
Timestamp when the system first detected the situation.

**last_updated**
Timestamp when the situation was last updated.

---

## 2.2 Alliance Object

Represents formal or semi-formal geopolitical cooperation structures.

```
Alliance
  id
  name
  type

  members[]

  established_year

  purpose
  status
```

Alliance **status** examples:

* active
* strained
* inactive
* dissolving

---

## 2.3 Actor Object

Represents geopolitical entities.

```
Actor
  id
  name
  actor_type

  regions[]

  alliances[]
```

Actor types include:

* sovereign_state
* regional_bloc
* military_alliance
* non_state_actor

---

## 2.4 Region Object

Represents geographic areas used for map visualization and grouping.

```
Region
  id
  name

  region_type

  geometry_reference
```

Region types:

* country
* subregion
* maritime_zone
* disputed_area

---

# 3. Situation Ontology

The ontology ensures situations are categorized consistently.

All situations must belong to one of the following classes.

---

## 3.1 Conflict Situations

* Armed Conflict
* Military Escalation
* Territorial Dispute
* Proxy Conflict

---

## 3.2 Political Situations

* Political Crisis
* Regime Instability
* Diplomatic Breakdown

---

## 3.3 Strategic Competition

* Strategic Rivalry
* Military Posturing

---

## 3.4 Economic and Sanctions Situations

* Sanctions Regime
* Trade Conflict
* Economic Bloc Formation

---

## 3.5 Alliance and Cooperation

* Military Alliance
* Strategic Partnership
* Security Pact

---

## 3.6 Emerging Risk

* Nuclear Risk
* Regional Instability
* Escalation Flashpoint

---

# 4. Signal Processing Pipeline

The system converts raw geopolitical signals into structured world state updates.

The pipeline operates in the following stages.

```
Signal Ingestion
        ↓
Event Extraction
        ↓
Situation Aggregation
        ↓
Materiality Scoring
        ↓
World State Synthesis
```

---

## 4.1 Signal Ingestion

The system retrieves grounded external signals.

Examples include:

* news sources
* official government statements
* international organization releases

The system must store raw signals temporarily for extraction.

---

## 4.2 Event Extraction

Raw signals are analyzed to detect structured geopolitical events.

Examples:

* military deployment
* sanctions announcement
* diplomatic meeting

Events must include source references.

---

## 4.3 Situation Aggregation

Events are clustered into broader situations.

Multiple events may contribute to a single situation.

Example:

Multiple troop movements and statements may form a single
"border escalation" situation.

---

## 4.4 Materiality Scoring

Situations are scored to determine geopolitical significance.

Example contributing factors:

* escalation level
* military activity
* economic impact
* diplomatic consequences
* persistence over time

Low-materiality situations may be excluded from the world state.

---

## 4.5 World State Synthesis

The system constructs a new WorldState revision using the material situations produced by the pipeline.

Rules:

* world state must remain internally consistent
* conflicting signals reduce confidence levels
* incomplete data must be explicitly marked

---

# 5. Deterministic State Rules

The following rules apply to all system behavior.

1. The UI must always render from exactly one world state revision.

2. Historical years must never be modified by live scanning.

3. Present-year revisions may only change via successful scan completion.

4. Assistant responses must be explainable using fields present in the active world state.

5. Any uncertainty must propagate into the confidence field rather than being hidden.

6. Situations must not be deleted during the active year. Situations that become inactive must transition to a resolved or dormant status rather than being removed.

7. Historical snapshots must preserve all situations that occurred during the year, including resolved situations.

---

# 6. Future Extension Points

The model intentionally allows expansion for future features.

Possible extensions include:

* geopolitical influence graphs
* actor capability modeling
* predictive trajectory analysis

These capabilities must still operate on the canonical world state defined in this document.
