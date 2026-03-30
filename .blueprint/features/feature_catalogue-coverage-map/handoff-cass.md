## Handoff Summary
**For:** Nigel
**Feature:** catalogue-coverage-map

### Key Decisions
- Split into 14 atomic stories: 5 mapping-engine logic, 3 filtering/scoping, 2 analysis, 4 UI/export
- Mapping engine stories are pure logic (no UI) and testable independently
- Persona-role mapping data file is its own story since it is a prerequisite for persona-based stories
- Graph rendering extends existing State Explorer -- not a new graph implementation
- Cross-cutting requirements get their own section rather than being forced onto graph nodes

### Files Created
- story-match-by-event-trigger.md
- story-match-by-domain-and-feature.md
- story-persona-role-mapping-data.md
- story-filter-by-release-scope.md
- story-filter-by-claim-type-relevance.md
- story-calculate-persona-coverage.md
- story-identify-gaps-and-severity.md
- story-trace-journey-completeness.md
- story-surface-decisions.md
- story-render-coverage-on-graph.md
- story-node-detail-panel.md
- story-cross-cutting-requirements.md
- story-persona-selector-filter.md
- story-summary-dashboard-cards.md
- story-export-gap-list-csv.md

### Open Questions
- None -- all OQs were resolved by Alex in the feature spec

### Critical Context
Stories 1-2 (matching) produce mapping tuples that all other stories consume. Story 3 (persona-role data) is a prerequisite for stories 6, 8, and 13. Test the logic layer stories (1-9) with unit tests against real catalogue JSON; test UI stories (10-15) with component/integration tests.
