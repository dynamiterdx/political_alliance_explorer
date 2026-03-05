# GeoSight Product Vision Document

## 1) Problem Statement
Modern geopolitical awareness is broken across disconnected headlines, noisy event streams, and opinion-heavy commentary. Users can access information, but they struggle to answer:
- What materially changed?
- Why does it matter now?
- How is the situation evolving?

The product problem is not lack of data. The product problem is lack of structured, trustworthy geopolitical sense-making.

## 2) Target Users
- **Primary:** policy and risk analysts who need rapid situational understanding.
- **Secondary:** journalists and researchers who need cross-region context quickly.
- **Secondary:** students and informed citizens who need explainable geopolitical summaries.

## 3) Core Value Proposition
- GeoSight provides a single, coherent geopolitical world model for the present year.
- The live model is grounded in externally verifiable signals, then structured into prioritized situations.
- Every surfaced situation must provide `what`, `why`, and `how`, with explicit confidence and freshness.
- Historical years remain curated and stable for comparative context.
- The interface is an analysis surface, not a raw feed.

## 4) Product Principles (Binding)
- **Grounded-first:** live present-year intelligence must originate from grounded retrieval and structured extraction.
- **Materiality over volume:** low-impact or duplicative events must be filtered out.
- **Explicit freshness:** users must always know whether they are seeing live or cached data.
- **Deterministic framing:** core world-state fields are structured; free-form narrative cannot replace structured fields.
- **Comparability across time:** historical and present-year views must share conceptual semantics, even when data sources differ.

## 5) Non-Goals
- The system will **not** be a complete global event archive.
- The system will **not** display every detected event as equal importance.
- The system will **not** treat generated prose as truth without grounded evidence.
- The system will **not** silently degrade from live to stale outputs.
- The system will **not** provide operational or tactical intelligence.
- The system will **not** provide personalized political persuasion or partisan recommendations.

## 6) Success Metrics
- **Comprehension:** users can identify top geopolitical changes and rationale within one session.
- **Prioritization quality:** most viewed/expanded items are materially significant (not noise-heavy).
- **Freshness transparency:** users can clearly distinguish live vs cached state at all times.
- **Traceability:** surfaced live situations include evidence references and confidence labeling.
- **Trust:** low user-reported incidence of ambiguous, unverifiable, or contradictory outputs.
- **Continuity:** historical exploration remains stable while present-year state evolves.

## 7) Scope Boundary
- In scope:
  - present-year dynamic geopolitical sense-making
  - curated historical snapshots
  - map + timeline + list + assistant as aligned views of one world state
- Out of scope:
  - fully autonomous forecasting engine
  - full-text news summarization portal
  - user-specific recommendation engine
