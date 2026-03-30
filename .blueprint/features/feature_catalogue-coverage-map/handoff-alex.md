## Handoff Summary
**For:** Cass
**Feature:** catalogue-coverage-map

### Key Decisions
- Read-only visualisation — overlays catalogue data onto the existing state graph, no simulation or case engine
- Mapping engine uses deterministic string matching (eventTrigger, domainGroup, feature name) with confidence flags; ML/NLP deferred
- Cross-cutting catalogue items (accounts, notifications) shown separately, not forced onto graph nodes
- Follows the 4-layer pattern: mapping-engine (logic) → ui-coverage-map (orchestration) → React page
- Extends the existing State Explorer graph (React Flow) rather than building a new graph renderer

### Resolved Open Questions
- **OQ1 — Persona Mapping:** Static `data/persona-role-mapping.json` maps 23 catalogue personas to 8 KNOWN_ROLES. 6 personas (citizen, applicant, non-party, other-party, org-admin, professional-org) are cross-cutting with no event model role
- **OQ2 — WA Alignment:** Kept separate; CSV export includes "also has WA gap" cross-reference column
- **OQ3 — Release 1 Scope:** Three-way toggle (R1 only / R1+TBC / All), default R1+TBC (262 items)
- **OQ4 — Claim Type Scoping:** Domain-group heuristic: 62 items scoped to specific claim types, 227 apply to all

### Files Created
- .blueprint/features/feature_catalogue-coverage-map/FEATURE_SPEC.md

### Critical Context
The mapping engine is the foundation — stories for it must come first. It produces `{ catalogueRef, stateId, eventId, matchConfidence }` tuples that everything else depends on. Five story themes: mapping engine, coverage graph, persona journey analysis, gap/decision surfacing, summary dashboard. The persona-role mapping (OQ1) is now resolved with a concrete mapping table — Cass can write persona journey stories with confidence. The headline user outcome is "Can persona X reach terminal state with the defined requirements?"
