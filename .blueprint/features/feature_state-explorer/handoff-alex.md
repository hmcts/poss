## Handoff Summary
**For:** Nigel (skipping Cass -- data transformation feature, no user stories needed)
**Feature:** state-explorer

### Key Decisions
- Colour priority order: isEndState > isDraftLike > isLive > uncertainty (completeness < 50)
- Edge style priority: isTimeBased > isSystemTriggered (time-based takes precedence when both flags true)
- Uncertain styling applies when completeness < 50 AND state is not end/draft/live flagged
- Actor summary in getStateDetail is a count of events per actor, not a boolean presence
- Node positions are NOT part of the data transformation layer -- UI handles layout
- All functions are pure, no React or DOM dependency

### Files Created
- .blueprint/features/feature_state-explorer/FEATURE_SPEC.md

### Open Questions
- OQ1: Node positioning strategy deferred to UI implementation
- OQ2: Completeness threshold for uncertain styling hardcoded at 50

### Critical Context for Nigel
Tests should cover:
1. `statesToNodes` -- correct id, label, technicalName, completeness, and style mapping for each state category (draft, live, end, uncertain, default)
2. `transitionsToEdges` -- correct id composition, source/target, label, style for each edge type (system, time-based, user action)
3. `getStateColor` -- all five colour categories including priority ordering
4. `getEdgeStyle` -- all three edge types plus the both-flags-true priority case
5. `getStateDetail` -- correct filtering, actor summary counting, missing state handling
6. `buildGraph` -- integration of nodes + edges, empty input handling
7. Empty array inputs should return empty arrays, not throw
