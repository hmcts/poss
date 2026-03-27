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

## Backlog (Work Allocation Task Layer)

| Status | P | E | Slug | Description |
|--------|---|---|------|-------------|
| Ready | P0 | M | wa-data-model | Zod schemas for WA tasks, event-to-task mapping types |
| Ready | P0 | M | wa-ingestion | Parse R1A WA Task Names doc into structured JSON, map to event model |
| Ready | P1 | M | wa-task-engine | Pure functions: resolve tasks per event, query tasks by state, alignment status |
| Ready | P1 | M | ui-wa-tasks | UI orchestration: enrich events with WA task metadata for display |
| Ready | P1 | L | react-digital-twin-wa | Integrate WA task cards into Digital Twin event steps |
| Ready | P2 | M | react-wa-state-overlay | WA task badges on State Explorer nodes and event matrix rows |
| Ready | P2 | L | react-wa-dashboard | Dedicated WA task alignment dashboard with gap/partial/aligned views |

---

## Feature Details (Work Allocation)

### wa-data-model (P0, M)

Extend the data model with schemas and types for Work Allocation tasks and their relationship to events.

- Define `WaTaskSchema` (Zod) with fields: `id`, `triggerDescription` (the action/event text from the R1A doc), `taskName` (the caseworker WA task name), `taskContext` (enum: claim, counterclaim, gen-app, claim-counterclaim, general), `alignment` (enum: aligned, partial, gap)
- Define `WaTaskMappingSchema` linking `waTaskId` to one or more `eventId`s, with an `alignmentNotes` field explaining partial/gap status
- Define `WaTaskContextEnum` values: `claim`, `counterclaim`, `gen-app`, `claim-counterclaim`, `general`
- Define `WaAlignmentStatus` enum: `aligned` (direct event model counterpart), `partial` (event exists at coarser granularity), `gap` (no corresponding event)
- Export TypeScript types: `WaTask`, `WaTaskMapping`, `WaTaskContext`, `WaAlignmentStatus`
- Extend the Zustand store with a `waTask` slice: `{ tasks: WaTask[], mappings: WaTaskMapping[] }` with `setWaTasks` and `setWaMappings` actions
- **Source doc:** `.business_context/R1A Work Allocation Task Names.docx`
- **Analysis doc:** `.business_context/R1A_WA_Tasks_vs_Event_Model_Analysis.md`
- **Consumes:** data-model module (extends store and schema patterns)

### wa-ingestion (P0, M)

Parse the R1A Work Allocation Task Names document into structured JSON and produce event-to-task mappings.

- Create a static JSON file (`data/wa-tasks.json`) containing the 17 WA tasks from the R1A doc, each with trigger description, task name, context, and alignment status
- Create a static JSON file (`data/wa-mappings.json`) containing event-to-task mappings: for each WA task, list the event model event(s) it maps to (by event name and state), with alignment notes
- Handle the three alignment tiers from the analysis: 7 fully aligned (direct event match), 9 partially aligned (coarser granularity), 1 gap (no event)
- For partial alignments, capture what is missing (e.g. gen app sub-typing, document upload context distinction)
- For the gap (Failed Payment), mark as unmapped with a note that a new event is needed
- Include the citizen-only footnote as metadata: document upload WA tasks only trigger for citizen uploads, not professional user uploads
- Validate output against `WaTaskSchema` and `WaTaskMappingSchema`
- **Consumes:** wa-data-model module (schemas for validation), data-ingestion module (follows same static JSON output pattern)

### wa-task-engine (P1, M)

Pure logic functions for resolving which WA tasks apply at a given state or event, and querying alignment status.

- `getTasksForEvent(eventId, mappings): WaTask[]` -- given an event, return all WA tasks that would be triggered
- `getTasksForState(stateId, events, mappings): WaTask[]` -- given a state, find all events at that state and return their associated WA tasks (deduplicated)
- `getAlignmentSummary(tasks, mappings): { aligned: number, partial: number, gap: number }` -- count tasks by alignment status
- `getUnmappedTasks(tasks, mappings): WaTask[]` -- return tasks with no event mapping (gaps)
- `getPartialTasks(tasks, mappings): Array<{ task: WaTask, missing: string }>` -- return partially aligned tasks with explanation of what is missing
- `getEventWaContext(event, mappings): { task: WaTask, alignment: WaAlignmentStatus, notes: string } | null` -- for a single event, return its WA task context if any
- `filterTasksByContext(tasks, context: WaTaskContext): WaTask[]` -- filter tasks by context type (claim, counterclaim, gen-app etc.)
- All functions are pure, stateless, and tested
- **Consumes:** wa-data-model module (types and schemas), data-model module (Event type)

### ui-wa-tasks (P1, M)

UI orchestration layer that enriches events and simulation steps with WA task display data.

- `enrichEventWithWaTask(event, mappings, tasks): EnrichedEvent` -- augment an event object with `waTask?: { taskName, alignment, context, notes }` for UI consumption
- `enrichAvailableActions(actions, mappings, tasks): EnrichedAction[]` -- for the Digital Twin available events panel, append WA task info to each action
- `getWaTaskBadge(alignment: WaAlignmentStatus): { label, colour, icon }` -- return display metadata: green/check for aligned, amber/warning for partial, red/cross for gap
- `getWaTaskTooltip(task: WaTask, mapping: WaTaskMapping): string` -- generate a human-readable tooltip explaining the task, its trigger, and any alignment notes
- `prepareWaTaskPanel(stateId, events, mappings, tasks): WaTaskPanelData` -- prepare structured data for rendering a WA task summary panel within a state detail view
- `getStateWaTaskCount(stateId, events, mappings): { total, aligned, partial, gap }` -- count WA tasks associated with a state, broken down by alignment
- **Consumes:** wa-task-engine module (query functions), wa-data-model module (types), ui-case-walk module (follows enrichment patterns)

### react-digital-twin-wa (P1, L)

Integrate WA task information directly into the Digital Twin (Case Walk) so caseworker tasks are visible during simulation.

- In the available events panel, each event that triggers a WA task shows a task card beneath it: task name, alignment badge (green/amber/red), and context label
- Task card is collapsible -- collapsed by default shows just task name and badge; expanded shows trigger description, alignment notes, and context
- When an event is applied (simulation advances), the timeline entry includes the WA task that was triggered (if any), displayed as a tag/chip on the timeline node
- Add a "Show WA Tasks" toggle in the simulation controls -- when off, task cards are hidden (keeps the UI clean for users who only care about state flow)
- When the simulation is at a state with no WA-task-triggering events available, show an info note: "No caseworker tasks at this state"
- For events with partial alignment, show an amber info box within the task card explaining what the event model is missing (e.g. "Event model uses generic 'Make an application' -- WA expects sub-typed adjournment task")
- For the Failed Payment gap, if the simulation reaches a payment-related state, show a red banner: "WA task 'Review Failed Payment' has no corresponding event in the model"
- **Consumes:** ui-wa-tasks module (enrichAvailableActions, getWaTaskBadge, getWaTaskTooltip), ui-case-walk module (existing simulation UI data), wa-task-engine module (getTasksForState)

### react-wa-state-overlay (P2, M)

Add WA task indicators to the State Explorer graph and Event Matrix table.

- State Explorer: on each graph node, show a small WA task count badge (e.g. "3 tasks") using `getStateWaTaskCount`; colour the badge by worst alignment (red if any gap, amber if any partial, green if all aligned)
- State Explorer: in the state detail panel (opened on node click), add a "Work Allocation Tasks" section listing all WA tasks for that state with alignment badges
- Event Matrix: add a "WA Task" column to the event table showing the task name (or "--" if no task) and an alignment colour dot
- Event Matrix: add a "WA Task" filter dropdown to filter events by their associated WA task name, or filter to "events with no WA task" / "events with WA gaps"
- **Consumes:** ui-wa-tasks module (getStateWaTaskCount, prepareWaTaskPanel, enrichEventWithWaTask, getWaTaskBadge), ui-state-explorer module (extends state detail panel), ui-event-matrix module (extends table columns)

### react-wa-dashboard (P2, L)

Dedicated Work Allocation alignment dashboard accessible from the sidebar navigation.

- Add a new route `/work-allocation` to the app shell sidebar navigation
- Summary cards at the top: total tasks (17), aligned count (green), partial count (amber), gap count (red), with percentage bar
- Aligned tasks table: task name, trigger, matched event(s), state(s) where it applies -- all green-badged
- Partial tasks table: task name, trigger, matched event(s), what is missing -- amber-badged, with expandable rows showing the alignment notes from the analysis
- Gap tasks table: task name, trigger, recommendation for event model change -- red-badged
- "By State" view: group all WA tasks by the state(s) they apply in, showing a state card with its tasks listed underneath -- gives a caseworker-centric view of "what do I need to do at each stage"
- "By Context" view: group tasks by context (claim / counterclaim / gen-app / general) for cross-cutting analysis
- Link from each task row to the relevant state in State Explorer or event in Event Matrix
- CSV export of the full alignment table
- **Consumes:** wa-task-engine module (all query functions), ui-wa-tasks module (badges, tooltips, panel data), app-shell module (ROUTES, extends navigation)

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

P0 (WA Foundation -- can run in parallel with UI layer):
  wa-data-model
    |
    v
  wa-ingestion
    |
    v
P1 (WA Core -- requires wa-ingestion + ui-case-walk):
  wa-task-engine
    |
    v
  ui-wa-tasks
    |
    v
  react-digital-twin-wa
    |
    v
P2 (WA Enhancements -- requires ui-wa-tasks + react component layer):
  react-wa-state-overlay
  react-wa-dashboard
```

WA foundation features (wa-data-model, wa-ingestion) can begin immediately in parallel with UI work. The WA core features (wa-task-engine, ui-wa-tasks, react-digital-twin-wa) require both the WA data and the existing Digital Twin to be in place. WA enhancements (state overlay, dashboard) can run in parallel once ui-wa-tasks is complete.

---

## Notes

- All logic-layer features (9 modules, 194 tests) are complete and stable -- UI features consume these as pure function imports, no logic duplication
- React Flow (`@xyflow/react`) is the recommended library for state-explorer graph rendering
- The app-shell module already defines ROUTES with paths `/state-explorer`, `/event-matrix`, `/digital-twin` -- the Digital Twin route maps to Case Walk in the UI
- All data is static JSON loaded at build time; no API routes or server-side data fetching needed
- Uncertainty and incompleteness must be visually prominent in every mode, not hidden -- this is a core system invariant
- Existing bridge file pattern (`.js` re-exporting from `.ts`) must be maintained for any new modules
- Target: port 3000 for development server
- WA task data source: `.business_context/R1A Work Allocation Task Names.docx` with alignment analysis in `.business_context/R1A_WA_Tasks_vs_Event_Model_Analysis.md`
- WA tasks follow the same 4-layer pattern: schema (wa-data-model) -> ingestion (wa-ingestion) -> logic (wa-task-engine) -> UI orchestration (ui-wa-tasks) -> React components
- The "Show WA Tasks" toggle in the Digital Twin defaults to off to avoid overwhelming users focused on state flow
