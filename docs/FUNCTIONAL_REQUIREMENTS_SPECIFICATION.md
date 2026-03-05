# GeoSight Functional Requirements Specification

## 1) Feature Set (Explicit)

The system must provide the following features:

* **World Map View:** interactive display of alliances and geopolitical situations with geographic context.
* **Year Navigation:** user can navigate across years.
* **Present-Year Live Mode:** current year is dynamic and can refresh from grounded live signals.
* **Historical Mode:** non-present years use curated, static data.
* **Conflict List Panel:** ranked list of geopolitical situations with intensity and trend. The default view prioritizes emerging, active, and escalating situations while allowing access to resolved situations for the selected year.
* **Alliance List Panel:** alliance view with membership and status.
* **Situation Detail View:** structured details for selected situation or alliance including lifecycle status.
* **Top Ticker:** only materially important updates derived from the same world state.
* **Assistant:** explanation interface constrained to system world state and curated history.
* **Scan Status Display:** visible freshness state (live or cached) and last scan timestamp.
* **Manual Refresh Action:** user-triggered live scan request.

---

# 2) Functional Boundaries (Strict)

* The system must treat grounded live extraction as the source for present-year live situations.
* The system must not expose raw unfiltered event dumps as primary UI output.
* The system must not invent live situations that are absent from grounded structured state.
* The system must keep historical years unaffected by live refresh.
* All major UI surfaces (map, lists, ticker, assistant context) must derive from the same current world state object.

---

# 3) User Flows

## Flow A: Open App in Present Year

1. User opens app.
2. System loads latest available present-year world state.
3. System displays explicit freshness status (`live` or `cached`) with timestamp.
4. Map, conflict list, ticker, and assistant context align to the same loaded state.

---

## Flow B: Manual Live Refresh

1. User triggers refresh.
2. System starts a new live scan attempt.
3. On success, system replaces present-year world state and updates timestamp/source.
4. On failure, system preserves previous state and clearly reports fallback status.

---

## Flow C: Explore Historical Year

1. User selects a non-present year.
2. System switches to curated static state for that year.
3. Live refresh controls do not alter historical state.
4. Historical snapshots must include all situations that occurred during that year, including situations that resolved before year end.

---

## Flow D: Inspect Situation

1. User selects a situation from map or sidebar.
2. System highlights related actors and geography.
3. System opens structured details for the selected situation.

The detail view must display:

* situation title
* situation type
* situation lifecycle status
* actors involved
* geographic regions affected
* what / why / how summary
* start date
* end date (if resolved)
* intensity score
* trend direction
* confidence level
* evidence references
* freshness context

---

## Flow E: Ask Assistant

1. User submits question.
2. Assistant answers using current world state plus curated historical state.
3. Assistant responses must remain grounded in the structured world model.
4. If information is uncertain, assistant must explicitly declare uncertainty.
5. Future scenarios must be explicitly labeled speculative.

---

# 4) System Behaviors

* **Single State Coherence:** all UI modules consume one active state per selected year.
* **Present-Year Dynamism:** only present year can be updated by live scan.
* **Materiality Filtering:** surfaced situations must be prioritized by geopolitical significance rather than event feed order.
* **Situation Lifecycle Behavior:** situations persist through lifecycle states and are not removed simply because activity subsides.
* **Default Visibility Behavior:** emerging, active, and escalating situations should be prioritized in the default view while resolved situations remain accessible for the selected year.
* **Situation Intensity Behavior:** intensity must reflect both signal level and trend direction.
* **Freshness Behavior:** every present-year render must indicate source and scan time.
* **Fallback Behavior:** fallback to cached data must be explicit and user-visible.
* **Assistant Guarding:** assistant may explain and synthesize; assistant may not create unsupported facts.

---

# 5) Edge Cases

* **No Live Data Available:** show last known cached state with explicit stale indicator; if none exists, show empty-state messaging with reason.
* **Partial Live Data:** render available situations; mark confidence and incomplete coverage.
* **Contradictory Signals:** lower confidence and show uncertainty note.
* **Refresh Failure During Session:** retain current state; do not clear map/lists; update status to failed fallback.
* **Year Switch Mid-Refresh:** selected year state must remain consistent and not cross-contaminate.
* **Malformed Situation Payload:** invalid items must be excluded from rendering; system remains operational.

---

# 6) Access Control Rules

* **Read Access:** public read access to world-state views.
* **Refresh Access:** refresh action is available to all users unless explicitly restricted by policy.
* **Rate Governance:** refresh requests must be bounded to prevent abuse and repeated redundant scans.
* **No User Data Privileges:** no role-based geopolitical content differences unless future policy defines them.

---

# 7) Data Lifecycle Rules

## 7.1 Create

* A new present-year world state is created on successful live scan completion.
* Curated historical snapshots are created through controlled editorial updates only.

---

## 7.2 Update

* Present-year world state may be updated by scheduled or manual scans.
* Historical snapshots are immutable during normal runtime.

---

## 7.3 Delete

* Expired present-year scan artifacts may be removed according to retention rules.
* Historical curated records are not auto-deleted.
* Individual situations should not be deleted within the active year. Instead, situations transition through lifecycle states such as stabilizing or resolved.

---

## 7.4 Retention

* Present-year live artifacts must retain at least one recent fallback snapshot for continuity.
* Freshness metadata must persist with each retained snapshot.
* Evidence references should remain attached to corresponding live situations while retained.
* Historical yearly snapshots must retain all situations that occurred during that year, including resolved situations.

---

# 8) AI Agent Interpretation Constraints

Future implementation agents must respect:

* Do not reinterpret GeoSight as a generic news application.
* Do not prioritize completeness of event streams over clarity of material developments.
* Do not remove explicit freshness or fallback communication.
* Do not allow assistant-generated text to bypass structured state constraints.
* Do not make historical years dynamically mutable unless product policy explicitly changes.
