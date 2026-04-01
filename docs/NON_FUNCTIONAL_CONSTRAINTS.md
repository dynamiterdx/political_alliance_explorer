# GeoSight Non-Functional Constraints

## 1) Performance Expectations (High-Level)

* Initial world-state render should feel immediate for end users in normal network conditions.
* Present-year state switching and historical year switching must remain interactive and low-latency.
* Manual refresh action must provide clear progress and completion/failure signaling.
* Rendering should remain stable under moderate interaction load (map pan/zoom, panel selection, year switching).
* Failure handling must be fast; users should not wait on hidden retries without status feedback.

---

# 2) Scalability Expectations (Order of Magnitude)

The system should support at least:

* tens of thousands of daily active users,
* thousands of concurrent readers,
* bursty refresh traffic during major geopolitical events.

Additional expectations:

* Read-heavy traffic must not degrade live scan quality or freshness signaling.
* Global world-state distribution should scale more easily than per-user bespoke computation.
* World-state revisions should be efficiently cacheable and distributable across edge infrastructure.
* On-demand AI insights (such as detailed Alliance Summaries) must be heavily cached with a predefined Time-To-Live (TTL) or a scheduled background refresh to minimize redundant LLM generation loops.

---

# 3) Security Posture

**Sensitivity Level:** moderate-to-high operational sensitivity, low personal-data sensitivity.

Required controls:

* strict secret handling for model and data-source credentials,
* controlled outbound data usage for grounded retrieval,
* protection against prompt-injection style contamination in model outputs,
* output safety checks to prevent fabricated geopolitical claims from being presented as fact.

The system should minimize storage of user-identifying data unless explicitly required by future policy.

---

# 4) Reliability Expectations

* Service should degrade gracefully: cached state with explicit stale messaging is acceptable; silent failure is not.
* State continuity is required: users should continue to see the last known valid world state during transient live-scan failures.
* Present-year and historical-year behavior must remain deterministic and separated during failures.

### Data Integrity Expectations

* malformed live payloads must not crash user-facing views,
* partial payloads should be rendered with confidence and completeness caveats,
* world-state revisions must remain internally consistent even when signals are incomplete or contradictory.

---

# 5) Observability Expectations

The system must emit enough telemetry to answer:

* did live scan run,
* did it succeed or fail,
* what source is currently displayed (live or cached),
* when was the displayed state last scanned,
* what validation or filtering dropped or accepted situations.

Operational monitoring must also allow operators to determine:

* when a situation first appeared in the world model,
* when a situation changed lifecycle state (for example: active → stabilizing → resolved).

Error categories must distinguish:

* retrieval failures,
* extraction or validation failures,
* rendering failures,
* assistant response constraint violations.

Operational health should be inspectable without reading raw logs line-by-line.

---

# 6) Consistency and Quality Constraints

* All UI surfaces must remain consistent with the same active world state revision.
* Freshness labels, timestamps, and source indicators must be consistent across views.
* Assistant responses must be auditable against the active world state and curated historical state.
* Product quality is defined by clarity and trustworthiness, not maximum event count.

### Situation Continuity Constraint

Situations must persist across lifecycle states and must not disappear from the world state solely because activity has subsided.

Historical yearly snapshots must preserve all situations that occurred during that year, including those that resolved before year end.

---

# 7) Change-Control Constraints

* Any future change that weakens grounded-first behavior, freshness transparency, or materiality filtering is out of policy.
* Any future change that makes historical years dynamically mutable requires explicit product-policy revision.
* Any future change that removes lifecycle continuity of geopolitical situations requires explicit revision of the world model specification.

