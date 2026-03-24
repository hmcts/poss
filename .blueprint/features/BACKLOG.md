# Feature Backlog

## Definitions

| Priority | Meaning |
|----------|---------|
| P0 | Critical -- foundation, blocks everything |
| P1 | High -- core modes, do soon |
| P2 | Medium -- cross-cutting enhancements |
| P3 | Low -- future refinement |

| Effort | Meaning |
|--------|---------|
| S | Small -- < 1 hour |
| M | Medium -- 1-3 hours |
| L | Large -- 3-8 hours |
| XL | Extra Large -- 1+ days |

| Status | Meaning |
|--------|---------|
| Ready | Ready to implement |
| WIP | In progress |
| Clarify | Needs clarification |

---

## Completed (Logic Layer)

All 9 logic-layer features are implemented with 194 passing tests:

| Status | P | E | Slug | Description |
|--------|---|---|------|-------------|
| Done | P0 | M | data-model | Zod schemas, enums, Zustand vanilla store |
| Done | P0 | L | data-ingestion | Excel/PDF parsing pipeline producing JSON |
| Done | P0 | M | app-shell | Routes, claim types, theme utils, app store |
| Done | P1 | L | state-explorer | statesToNodes, transitionsToEdges, graph builder |
| Done | P1 | L | event-matrix | Filter, search, actor grid, CSV export |
| Done | P1 | L | case-walk | Simulation engine, dead-end/end-state detection |
| Done | P2 | L | scenario-analysis | Toggle states/roles/events, impact analysis |
| Done | P2 | M | model-health | Health summary, unreachable states, completeness |
| Done | P2 | M | uncertainty-display | Uncertainty levels, colours, badges, indicators |

---

## Backlog (UI Layer)

| Status | P | E | Slug | Description |
|--------|---|---|------|-------------|
| Done | P0 | XL | next-app-setup | Initialise Next.js 15 with App Router, Tailwind CSS, React Flow, dark/light theme |
| Done | P0 | M | data-loading | Wire ingestion JSON output into Zustand store, load at app startup |
| Done | P1 | L | ui-app-shell | Layout, sidebar navigation, claim type selector, theme toggle, health badge |
| Done | P1 | XL | ui-state-explorer | React Flow graph visualisation of state diagrams per claim type |
| Done | P1 | L | ui-event-matrix | Filterable, searchable event table with actor grid and CSV export |
| Done | P1 | L | ui-case-walk | Step-through case simulation with history trail and role filter |
| Done | P2 | L | ui-scenario-analysis | What-if toggle panel with micro/meso/macro impact display |
| Done | P2 | M | ui-model-health | Model health dashboard with open questions and completeness metrics |

---

## Completed (React Component Layer)

Built via vibe coding (not agent pipeline). Consumes UI helper modules from `src/ui-*/`. Uses sample data per claim type for prototyping.

| Status | P | E | Slug | Description |
|--------|---|---|------|-------------|
| Done | P1 | L | react-app-shell | Sidebar, header, claim type selector, health badge, Inter/slate/indigo theme |
| Done | P1 | XL | react-state-explorer | React Flow graph with auto-layout, node badges, detail panel, legends |
| Done | P1 | L | react-event-matrix | Filterable/searchable table with actor grid, CSV export, open question indicators |
| Done | P1 | L | react-case-walk | Case simulation with event toggling, auto-replay, timeline, expandable event details |

Files: `app/layout.tsx`, `app/providers.tsx`, `app/components/`, `app/state-explorer/`, `app/event-matrix/`, `app/digital-twin/`

---

## Feature Details

### next-app-setup (P0, XL)

Initialise the Next.js 15 application framework that all UI features depend on.

- Install Next.js 15 with App Router, React 19, Tailwind CSS 4, and `@xyflow/react` (React Flow v12)
- Configure `tsconfig.json` for the existing TypeScript source in `src/`, path aliases for `@/src/*`
- Set up `app/` directory with root layout, global styles, and font loading
- Implement dark/light theme provider using the existing `getDefaultTheme`, `toggleTheme`, `getThemeClass` functions from the app-shell module
- Add Tailwind dark mode class strategy, define colour tokens for state colours (amber/green/dark/muted)
- Configure `next.config.js` for port 3000, static export compatibility
- **Consumes:** app-shell module (theme utilities)

### data-loading (P0, M)

Make the ingested model data available to React components at startup.

- Create a React context provider that reads the JSON files produced by the data-ingestion pipeline (states, transitions, events, breathing space entries per claim type)
- Populate the Zustand store (from `data-model/store.ts`) with loaded data, expose via React hooks
- Load all 7 claim types' data eagerly at app mount (dataset is small, no lazy loading needed)
- Provide a `useModelData(claimTypeId)` hook returning typed `{ states, transitions, events }` for a given claim type
- Handle the loading state with a skeleton/spinner while JSON is parsed
- **Consumes:** data-model module (store, schemas), data-ingestion module (JSON output), app-shell module (CLAIM_TYPES)

### ui-app-shell (P1, L)

The persistent layout frame wrapping all three modes.

- Sidebar navigation with links to State Explorer, Event Matrix, and Case Walk (using ROUTES from app-shell module)
- Claim type selector dropdown at the top of the sidebar, populated from CLAIM_TYPES, wired to `setActiveClaimType` in the app store
- Dark/light theme toggle button in the header, using `toggleTheme` from app-shell module
- Model health indicator badge in the header showing overall score (good/fair/poor) from model-health module's `getModelHealthSummary`, colour-coded green/amber/red
- Responsive layout: sidebar collapses to hamburger menu on narrow viewports
- Active route highlighting in the sidebar
- **Consumes:** app-shell module (ROUTES, CLAIM_TYPES, theme utils, createAppStore), model-health module (getModelHealthSummary)

### ui-state-explorer (P1, XL)

Interactive graph visualisation of state diagrams, the primary exploration mode.

- Render React Flow canvas using nodes from `statesToNodes` and edges from `transitionsToEdges` for the active claim type
- Nodes colour-coded: amber (draft), green (live), dark (end state), muted/striped (low completeness) via `getStateColor`
- Edges styled: solid (user action), dashed (system-triggered), dotted/animated (time-based) via `getEdgeStyle`
- Click a node to open a detail drawer/panel showing state info, events at that state, and actor summary from `getStateDetail`
- Overlay uncertainty badges on nodes using `getCompletenessBadge` and `getUncertaintyLevel` from uncertainty-display module
- Auto-layout nodes using dagre or elkjs for readable top-to-bottom flow; user can pan/zoom
- **Consumes:** state-explorer module (statesToNodes, transitionsToEdges, getStateColor, getEdgeStyle, getStateDetail, buildGraph), uncertainty-display module (getCompletenessBadge, getUncertaintyLevel, getUncertaintyColor)

### ui-event-matrix (P1, L)

Searchable, filterable event table replacing the Excel spreadsheet.

- Render events as a table with columns: State, Event Name, System flag, Notes, plus actor role columns as a scrollable grid from `eventsToActorGrid`
- Filter controls: claim type (pre-filled from active selection), state dropdown, role dropdown, system-only toggle -- all wired to `filterEvents`
- Search input for free-text search across event name and notes, using `searchEvents`
- Open question indicator (warning icon) on rows where `hasOpenQuestions` is true, with count badge from `getOpenQuestionCount`
- CSV export button that calls `eventsToCsv` on the currently filtered/searched results and triggers a browser download
- Sortable columns (at minimum: state, event name)
- **Consumes:** event-matrix module (filterEvents, searchEvents, eventsToActorGrid, eventsToCsv, getOpenQuestionCount), data-model module (KNOWN_ROLES)

### ui-case-walk (P1, L)

Step-through simulation of a case journey through the state machine.

- "Start Simulation" button that calls `createSimulation` for the active claim type, displaying the initial state
- Current state displayed prominently with its colour and completeness badge
- Available events panel listing results of `getAvailableEvents`, each clickable to call `applyEvent` and advance the simulation
- Role filter dropdown that applies `filterEventsByRole` to the available events list
- History trail (vertical timeline or breadcrumb) showing all visited states from `getHistory`
- Dead-end detection: when `isDeadEnd` returns true, display a warning banner ("No events available -- model dead end"). End-state detection: when `isEndState` returns true, display a success banner ("Case journey complete")
- Reset button to restart the simulation; breathing space return states shown via `getReturnStates` when in BREATHING_SPACE or CASE_STAYED state
- **Consumes:** case-walk module (createSimulation, getAvailableEvents, applyEvent, isDeadEnd, isEndState, getHistory, filterEventsByRole, getReturnStates), uncertainty-display module (getCompletenessBadge)

### ui-scenario-analysis (P2, L)

What-if analysis panel for toggling model elements and seeing system-wide impact.

- Toggle panel with three sections: States (checkboxes), Roles (checkboxes), Events (checkboxes) -- all for the active claim type
- Toggling a checkbox calls the corresponding `toggleState`, `toggleRole`, or `toggleEvent` function and updates the local scenario state
- Impact display panel divided into three levels from `analyzeImpact`: Micro (removed events count), Meso (dead-end states list), Macro (unreachable states, end-state reachability)
- Summary line at the top from `ImpactResult.summary`
- Visual diff: highlight affected states/events in red/orange compared to the baseline model
- Reset button to clear all toggles and return to baseline
- **Consumes:** scenario-analysis module (toggleState, toggleRole, toggleEvent, findUnreachableStates, findBlockedEvents, canReachEndState, analyzeImpact)

### ui-model-health (P2, M)

Dashboard panel surfacing model completeness and quality metrics.

- Summary card showing overall score (good/fair/poor) with colour coding, from `getModelHealthSummary`
- Open questions count with link/list of events that have `hasOpenQuestions` flag
- Low-completeness states list (below 50% threshold) from `getLowCompletenessStates`, each linking to the state in State Explorer
- Unreachable states list from `getUnreachableStates`
- End-state reachability indicator per claim type: green tick if `canReachEndState` returns true, red cross if false
- Accessible as a slide-out panel from the health badge in the app shell header, or as a dedicated page
- **Consumes:** model-health module (getModelHealthSummary, getOpenQuestionCount, getLowCompletenessStates, getUnreachableStates, canReachEndState), uncertainty-display module (getUncertaintySummary)

---

## Dependency Order

```
P0 (Foundation):
  next-app-setup
    |
    v
  data-loading
    |
    v
P1 (Core UI -- can run in parallel after data-loading):
  ui-app-shell ──> ui-state-explorer
              ──> ui-event-matrix
              ──> ui-case-walk
    |
    v
P2 (Enhancements -- can run in parallel after P1):
  ui-scenario-analysis
  ui-model-health
```

All P1 features depend on `next-app-setup` and `data-loading`. The three core UI features (state-explorer, event-matrix, case-walk) depend on `ui-app-shell` for the layout frame but can be built in parallel. P2 features can begin once the app shell and at least one core mode are in place.

---

## Notes

- All logic-layer features (9 modules, 194 tests) are complete and stable -- UI features consume these as pure function imports, no logic duplication
- React Flow (`@xyflow/react`) is the recommended library for state-explorer graph rendering
- The app-shell module already defines ROUTES with paths `/state-explorer`, `/event-matrix`, `/digital-twin` -- the Digital Twin route maps to Case Walk in the UI
- All data is static JSON loaded at build time; no API routes or server-side data fetching needed
- Uncertainty and incompleteness must be visually prominent in every mode, not hidden -- this is a core system invariant
- Existing bridge file pattern (`.js` re-exporting from `.ts`) must be maintained for any new modules
- Target: port 3000 for development server
