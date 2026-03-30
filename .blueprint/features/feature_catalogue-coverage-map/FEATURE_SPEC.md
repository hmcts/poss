# Feature Specification — Catalogue Coverage Map

## 1. Feature Intent
**Why this feature exists.**

- **Problem:** The possession service product catalogue contains 289 requirements spanning multiple personas, domain groups, and MoSCoW priorities. The state and event model defines how cases move through the system. Today there is no way to see whether the catalogue requirements *collectively cover* every state, transition, and event that each persona needs to reach a terminal state. Gaps, orphaned requirements, and under-specified journeys are invisible.
- **User need:** Business analysts need an interactive visualisation that overlays product catalogue coverage onto the state/event model, per persona, so they can answer: "Can this persona reach CLOSED with the requirements we have defined? Where are the holes?"
- **System alignment:** This directly supports the system purpose stated in SYSTEM_SPEC.md section 1 — making incompleteness visible. It extends the existing State Explorer and Product Catalogue viewer by *joining* their data, creating a new analytical lens that neither provides alone.

> **Alignment note:** This feature is a read-only analytical overlay. It does not create, modify, or simulate cases. It consumes existing data sources (product catalogue JSON, state/transition model, event model) and produces derived views. This aligns with the system boundary: "read-only with respect to the process model" (SYSTEM_SPEC.md section 2).

---

## 2. Scope

### In Scope
- Interactive state/event diagram with per-node/per-edge coverage indicators derived from the product catalogue
- Mapping engine: pure functions that link catalogue items to states, transitions, and events via `eventTrigger`, `domainGroup`, `feature` name, and persona fields
- Per-persona journey analysis: for a selected persona, highlight which states/transitions have catalogue coverage and which do not
- Gap surfacing: list of states, transitions, and events with no matching catalogue items (or only partial coverage)
- Decision surfacing: open questions from the state model combined with catalogue items flagged as incomplete (missing user stories, missing UCD, "TBC" notes)
- Clickable graph nodes and edges that drill down into: state details, associated events, mapped catalogue items, persona-specific coverage, and open questions
- Summary dashboard: coverage percentage per persona, per claim type, per domain group
- CSV export of the gap analysis

### Out of Scope
- Editing catalogue items or the state model through this feature
- Case simulation or case engine functionality (that is the persona-driven case progression feature)
- Automated matching via ML/NLP — mapping uses deterministic rules (string matching on `eventTrigger`, `domainGroup`, `feature` fields) with manual override capability deferred to a future feature
- WA task alignment (already covered by the existing WA dashboard and action items pages)
- Cross-claim-type comparison (each claim type is analysed independently)

---

## 3. Actors Involved

### Business Analyst (primary user)
- **Can:** Select a claim type and persona, view the coverage map, click nodes/edges for detail, filter by domain group or MoSCoW, export gaps as CSV
- **Cannot:** Edit catalogue items, modify state model data, or change mappings through the UI

### The Model (data actor)
- **Role:** Provides states, transitions, and events consumed by the coverage map
- **Source:** Static JSON loaded at build time (same as all other modes)

### The Product Catalogue (data actor)
- **Role:** Provides the 289 requirements with personas, domain groups, features, event triggers, and MoSCoW ratings
- **Source:** `data/product-catalogue.json` loaded at build time

---

## 4. Behaviour Overview

### Happy path
1. Analyst navigates to the Coverage Map page via the sidebar
2. The page loads with the active claim type's state diagram, with each node and edge colour-coded by catalogue coverage (green = fully covered, amber = partially covered, red = no coverage, grey = unmappable/not applicable)
3. A persona selector (populated from the catalogue's persona list) allows filtering to a single persona's journey
4. When a persona is selected, the graph re-colours to show only that persona's coverage — states/transitions irrelevant to the persona are dimmed
5. Clicking a node opens a detail panel showing: state info, events at that state, catalogue items mapped to those events, and any gaps
6. Clicking an edge opens transition detail: the condition, the catalogue items that enable the transition, and any missing coverage
7. A summary panel shows: total coverage %, gap count, items with open questions, and a per-domain-group breakdown
8. The analyst can export the gap list as CSV

### Key alternatives
- **No persona selected:** Shows aggregate coverage across all personas — every catalogue item contributes
- **Unmappable items:** Some catalogue items (e.g. account creation, notifications) do not map to specific states/transitions. These are shown in a separate "cross-cutting requirements" section, not forced onto the graph
- **Multiple catalogue items per state:** Coverage is additive — a state with 3 of 5 expected events covered shows 60% coverage
- **No catalogue items for a state:** The state node shows a red "gap" indicator with a count of events that have no coverage

### User-visible outcomes
- A colour-coded graph that immediately communicates where coverage is strong and where it is weak
- A prioritised gap list that analysts can take into backlog refinement
- Per-persona journey completeness: "Claimant can reach CLOSED: 78% of required steps have catalogue coverage"
- Decision list: open questions from both the state model and the catalogue that must be resolved

---

## 5. State & Lifecycle Interactions

This feature does **not** create, transition, or constrain system states. It is purely analytical.

- **States read:** All states for the active claim type (from the state model)
- **Transitions read:** All transitions for the active claim type
- **Events read:** All events for the active claim type
- **Catalogue data read:** All 289 items from `data/product-catalogue.json`

The feature is: **state-observing** — it reads the state model and overlays derived data.

---

## 6. Rules & Decision Logic

### R1: Catalogue-to-State Mapping
- **Description:** Each catalogue item is mapped to zero or more states/events based on its `eventTrigger` field (matched against event names), `domainGroup` (matched against state domain groupings), and `feature` name (fuzzy matched against event descriptions)
- **Inputs:** Catalogue item fields (`eventTrigger`, `domainGroup`, `feature`, `hlFunction`), event model (event names, states)
- **Outputs:** A set of `{ catalogueRef, stateId, eventId, matchConfidence: 'exact' | 'inferred' | 'none' }` tuples
- **Deterministic:** Yes for exact matches; inferred matches are flagged explicitly

### R2: Persona Coverage Calculation
- **Description:** For a given persona, use the persona-role mapping (`data/persona-role-mapping.json`) to resolve the catalogue persona to one or more KNOWN_ROLES. Filter catalogue items to those where `personas` includes the selected persona. Filter the event model to events where the resolved role(s) have `actors[role] === true`. Then calculate what percentage of the persona-relevant states/transitions have at least one mapped catalogue item. Personas that map to no role (citizen, applicant, non-party, other-party, org-admin, professional-org) are flagged as "cross-cutting — no event model role" and excluded from journey completeness calculations
- **Inputs:** Persona ID, persona-role mapping, filtered catalogue items, state/transition model
- **Outputs:** `{ persona, resolvedRoles, totalStates, coveredStates, totalTransitions, coveredTransitions, coveragePct, isCrossCutting }`
- **Deterministic:** Yes

### R3: Gap Identification
- **Description:** A gap exists when a state or transition has zero mapped catalogue items for the selected persona (or aggregate). Events with `hasOpenQuestions` that also lack catalogue coverage are elevated to "critical gap"
- **Inputs:** Coverage map, open question flags from event model
- **Outputs:** Ordered gap list with severity (critical / gap / partial)
- **Deterministic:** Yes

### R4: Journey Completeness
- **Description:** For a persona, trace all paths from the initial state to terminal states (CLOSED, DRAFT_DISCARDED). For each path, check whether every state and transition along it has catalogue coverage. Report the best-covered path and the worst-covered path
- **Inputs:** State graph, persona coverage map
- **Outputs:** `{ persona, canReachTerminal: boolean, bestPathCoverage: number, worstPathCoverage: number, blockingGaps: Gap[] }`
- **Deterministic:** Yes

### R5: Decision Surface
- **Description:** Collect all open questions from the event model (`hasOpenQuestions`) and all catalogue items with incomplete fields (`userStory === null`, `ucdRequired === null`, notes containing "TBC") into a unified decision list
- **Inputs:** Event model open questions, catalogue item fields
- **Outputs:** Prioritised decision list with source attribution (model vs catalogue)
- **Deterministic:** Yes

### R6: Claim-Type Relevance Scoping
- **Description:** Catalogue items are scoped to claim types based on their `domainGroup` field. Items with `domainGroup` matching `claims-counterclaim` are relevant only to Counter Claim types. Items matching `enforcement-*` are relevant only to Enforcement. Items matching `claims-general-application` are relevant only to General Applications. All other items (227 of 289) are relevant to all claim types. When viewing a specific claim type, only relevant items contribute to coverage calculations
- **Inputs:** Catalogue item `domainGroup`, active claim type
- **Outputs:** Boolean relevance flag per item per claim type
- **Deterministic:** Yes

### R7: Release Scope Toggle
- **Description:** A three-way toggle controls which catalogue items are included in coverage calculations: "R1 only" (items where `release1 === "yes"`, 234 items), "R1 + TBC" (items where `release1 !== "no"`, 262 items, **default**), or "All" (all 289 items). Excluded items appear dimmed on the graph when the broader scope is selected. Coverage percentages and gap counts recalculate dynamically when the toggle changes
- **Inputs:** Toggle state, catalogue item `release1` field
- **Outputs:** Filtered item set, recalculated coverage metrics
- **Deterministic:** Yes

---

## 7. Dependencies

### System components
- **state-explorer module** (`src/state-explorer/`): `statesToNodes`, `transitionsToEdges`, `buildGraph`, `getStateDetail` — provides the graph structure
- **product-catalogue module** (`src/product-catalogue/`): `filterCatalogue`, `getCatalogueSummary` — provides catalogue data access
- **ui-product-catalogue module** (`src/ui-product-catalogue/`): `getSummaryCards`, `getExpandedDetail` — provides display helpers
- **data-model module** (`src/data-model/`): State, Transition, Event schemas
- **uncertainty-display module** (`src/uncertainty-display/`): Completeness badges, uncertainty indicators
- **model-health module** (`src/model-health/`): Open question counts, reachability checks
- **app-shell module** (`src/app-shell/`): Routes, claim type selector, theme

### Data dependencies
- `data/product-catalogue.json` — 289 catalogue items (must exist at build time)
- `data/persona-role-mapping.json` — static mapping of 23 catalogue personas to 8 KNOWN_ROLES (created by this feature)
- State/transition/event model data (loaded via existing data-loading infrastructure)

### No external system dependencies
- No APIs, no databases, no external services

---

## 8. Non-Functional Considerations

- **Performance:** The mapping computation runs over ~289 catalogue items x ~20 states x ~40 events per claim type. This is trivially fast client-side. No lazy loading needed.
- **Rendering:** React Flow graph with coverage overlays. Same rendering approach as State Explorer — proven to work with the dataset size.
- **Export:** CSV export of gap analysis follows the existing `exportCatalogueCsv` pattern.
- **Accessibility:** Colour-coding must not be the sole indicator — text labels and icons supplement coverage status (same principle as existing completeness badges).

---

## 9. Assumptions & Open Questions

### Assumptions
- ASSUMPTION: The `eventTrigger` field in catalogue items contains text that can be matched (via substring or keyword) against event names in the state model. Initial inspection of the data confirms this is plausible but coverage of exact matches is unknown — the mapping engine must flag low-confidence matches.
- ASSUMPTION: Persona-to-role mapping is defined in a static data file (`data/persona-role-mapping.json`) that maps 23 catalogue personas to 8 KNOWN_ROLES. See OQ1 resolution for the full mapping table.
- ASSUMPTION: Not all 289 catalogue items map to state-specific behaviour. Some (accounts, notifications, accessibility) are cross-cutting. These are shown in a separate "cross-cutting requirements" section and their personas are flagged as having no event model role.
- ASSUMPTION: The mapping engine uses deterministic string matching in v1. Manual override / correction of mappings is deferred to a future enhancement.
- ASSUMPTION: Release 1 scope filtering defaults to "R1 + TBC" (262 of 289 items). See OQ3 resolution.
- ASSUMPTION: Claim-type relevance is inferred from domainGroup values. 62 items are scoped to specific claim types; the remaining 227 apply to all. See OQ4 resolution.

### Resolved Questions

- **OQ1 — Persona-to-Role Mapping (RESOLVED):** A static mapping file (`data/persona-role-mapping.json`) maps each of the 23 catalogue personas to zero or more of the 8 KNOWN_ROLES in the event model. The mapping is: Claimant ← claimant, claimant-lip, claimant-org, litigation-friend; Defendant ← defendant, defendant-lip, defendant-org, litigation-friend; Judge ← judge; Caseworker ← caseworker, court-staff; CourtAdmin ← court-admin; BailiffEnforcement ← bailiff; LegalAdvisor ← legal-rep, legal-rep-claimant, legal-rep-defendant; SystemAuto ← system, hmcts. Unmapped personas (citizen, applicant, non-party, other-party, org-admin, professional-org) are flagged as "no event model role — cross-cutting requirement" in the coverage map. `litigation-friend` maps to both Claimant and Defendant roles.

- **OQ2 — WA Task Alignment (RESOLVED):** Keep separate. WA gaps are already well-surfaced by the WA dashboard and Action Items pages. The coverage map's CSV export includes a column noting "also has WA gap" for items appearing in both analyses — a lightweight cross-reference without visual clutter.

- **OQ3 — Release 1 Scoping (RESOLVED):** A three-way toggle controls which items contribute to coverage calculations: **R1 only** (234 items) / **R1 + TBC** (262 items, default) / **All** (289 items). Default is "R1 + TBC" because TBC items represent active scope decisions — exactly the kind of thing this feature should surface. Items excluded by the toggle appear dimmed on the graph when visible. Coverage percentages recalculate dynamically based on the toggle.

- **OQ4 — Claim Type Scoping (RESOLVED):** All items are applicable to every claim type by default, with a domain-group-based relevance heuristic that scopes claim-type-specific items: `claims-counterclaim` (12 items) → Counter Claim types only; `enforcement-*` (29 items) → Enforcement only; `claims-general-application` (21 items) → General Applications only. The remaining 227 items contribute coverage to all claim types. This prevents the Main Claim from being inflated by enforcement-specific requirements, and enforcement from showing gaps for account creation features.

---

## 10. Impact on System Specification

This feature **reinforces** existing system assumptions:
- Read-only analytical tool — no new write paths
- Uncertainty as first-class content — gaps and open questions are surfaced prominently
- Static JSON data — no new data storage requirements
- Multi-claim-type support — operates per claim type consistent with all other modes

This feature **stretches** one assumption:
- The system spec does not currently mention the product catalogue as a data source. The catalogue was added after the initial system spec was written. **Proposed system spec update:** Add "Product Catalogue" as a data actor in section 4, and add the catalogue JSON to the data sources in section 2. This is an additive, non-breaking change.

No contradictions detected.

---

## 11. Handover to BA (Cass)

### Story themes
1. **Mapping engine** — logic layer stories for linking catalogue items to states/events/transitions
2. **Coverage graph** — UI stories for the interactive state diagram with coverage overlays
3. **Persona journey analysis** — stories for per-persona filtering, journey tracing, and completeness scoring
4. **Gap and decision surfacing** — stories for the gap list, decision list, and CSV export
5. **Summary dashboard** — stories for coverage summary cards and breakdown views

### Expected story boundaries
- Mapping engine stories should be pure logic (testable without UI), following the existing 4-layer pattern
- Graph stories build on the existing State Explorer React Flow implementation — extend, do not rebuild
- Persona filtering is a cross-cutting concern that affects graph, gap list, and summary simultaneously
- Export stories follow the existing CSV export pattern from product-catalogue and event-matrix

### Areas needing careful story framing
- The mapping engine is the critical path — stories must define what constitutes an "exact" vs "inferred" match, and acceptance criteria must specify the expected match rate against the real data
- Persona-to-role mapping (OQ1) must be resolved before persona journey stories can be accepted
- The distinction between "no catalogue coverage" (a gap) and "not applicable to this state" (not a gap) needs clear acceptance criteria per story
- Cross-cutting requirements (accounts, notifications) need a story that defines how they are displayed outside the graph context

---

## 12. Change Log (Feature-Level)
| Date | Change | Reason | Raised By |
|------|--------|--------|-----------|
| 2026-03-30 | Initial feature specification created | New feature request: visualise catalogue coverage against state/event model | Alex (System Spec Agent) |
| 2026-03-30 | Resolved OQ1-OQ4; added rules R6 (claim-type scoping) and R7 (release scope toggle); updated persona coverage calculation (R2) with role mapping; added persona-role-mapping.json to data dependencies | All four open questions resolved with data-informed decisions | User + Claude |
