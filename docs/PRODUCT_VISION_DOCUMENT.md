Below is the **complete updated Product Vision Document** with the lifecycle clarification integrated. I kept the structure intact and only strengthened the parts that needed alignment with the new world model. The original document you uploaded is here: 

---

# GeoSight Product Vision Document

## 1) Problem Statement

Modern geopolitical awareness is broken across disconnected headlines, noisy event streams, and opinion-heavy commentary. Users can access information, but they struggle to answer:

* What materially changed?
* Why does it matter now?
* How is the situation evolving?

The product problem is not lack of data. The product problem is lack of structured, trustworthy geopolitical sense-making.

---

# 2) Target Users

* **Primary:** policy and risk analysts who need rapid situational understanding.
* **Secondary:** journalists and researchers who need cross-region context quickly.
* **Secondary:** students and informed citizens who need explainable geopolitical summaries.

---

# 3) Core Value Proposition

* GeoSight provides a single, coherent geopolitical world model for the present year.
* The live model is grounded in externally verifiable signals and structured into prioritized geopolitical situations.
* Situations within the model evolve through a lifecycle as geopolitical conditions change, allowing the system to capture both active crises and situations that have stabilized or resolved during the year.
* Every surfaced situation must provide `what`, `why`, and `how`, with explicit confidence and freshness.
* Historical years remain curated and stable for comparative context.
* The interface is an analysis surface rather than a raw information feed.

---

# 4) Product Principles (Binding)

* **Grounded-first:** live present-year intelligence must originate from grounded retrieval and structured extraction.
* **Materiality over volume:** low-impact or duplicative events must be filtered out.
* **Explicit freshness:** users must always know whether they are seeing live or cached data.
* **Deterministic framing:** core world-state fields are structured; free-form narrative cannot replace structured fields.
* **Comparability across time:** historical and present-year views must share conceptual semantics, even when data sources differ.
* **Lifecycle continuity:** geopolitical situations persist through lifecycle states rather than disappearing when activity subsides, ensuring the system maintains an accurate historical record of developments within a year.

---

# 5) Non-Goals

* The system will **not** be a complete global event archive.
* The system will **not** display every detected event as equal importance.
* The system will **not** treat generated prose as truth without grounded evidence.
* The system will **not** silently degrade from live to stale outputs.
* The system will **not** provide operational or tactical intelligence.
* The system will **not** provide personalized political persuasion or partisan recommendations.

---

# 6) Success Metrics

* **Comprehension:** users can identify top geopolitical changes and rationale within one session.
* **Prioritization quality:** most viewed or expanded items correspond to materially significant developments rather than noise-heavy events.
* **Freshness transparency:** users can clearly distinguish live vs cached state at all times.
* **Traceability:** surfaced live situations include evidence references and confidence labeling.
* **Trust:** low user-reported incidence of ambiguous, unverifiable, or contradictory outputs.
* **Continuity:** historical exploration remains stable while present-year state evolves, and situations that resolve during the year remain visible in historical context.

---

# 7) Scope Boundary

### In Scope

* present-year dynamic geopolitical sense-making
* lifecycle tracking of geopolitical situations within the current year
* curated historical yearly snapshots
* map + timeline + list + assistant as aligned views of one world state

### Out of Scope

* fully autonomous geopolitical forecasting engine
* full-text news summarization portal
* user-specific recommendation engine

---

At this point your **documentation stack is fully coherent**:

```
PRODUCT_VISION_DOCUMENT.md
FUNCTIONAL_REQUIREMENTS_SPECIFICATION.md
NON_FUNCTIONAL_CONSTRAINTS.md
WORLD_MODEL_SPECIFICATION.md
```

Vision → Behavior → Constraints → Data Model are now all aligned.

If you want, the **next step (and most valuable one)** would be creating one final document that dramatically improves AI implementation quality:

**SYSTEM_ARCHITECTURE_OVERVIEW.md**

This would define the **actual components of the system (API, ingestion, extraction, synthesis, UI)** and how they interact.
