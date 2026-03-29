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
| Done | P0 | M | wa-data-model | Zod schemas for WA tasks, event-to-task mapping types |
| Done | P0 | M | wa-ingestion | Parse R1A WA Task Names doc into structured JSON, map to event model |
| Done | P1 | M | wa-task-engine | Pure functions: resolve tasks per event, query tasks by state, alignment status |
| Done | P1 | M | ui-wa-tasks | UI orchestration: enrich events with WA task metadata for display |
| Done | P1 | L | react-digital-twin-wa | Integrate WA task cards into Digital Twin event steps |
| Done | P2 | M |   | WA task badges on State Explorer nodes and event matrix rows |
| Done | P2 | L | react-wa-dashboard | Dedicated WA task alignment dashboard with gap/partial/aligned views |
| Ready | P1 | L | wa-task-toggles | Toggle WA tasks on/off in Digital Twin to block events and affect reachability |
| Ready | P1 | XL | react-action-items | Consolidated action items page: model gaps + WA alignment issues with resolution suggestions and export |
| Done | P2 | L | react-caseman-comparison | Legacy Caseman vs new service comparison page — States, Events, Tasks tabs with auto-match baseline and BA-editable mappings |
| Done | P3 | S | react-caseman-comparison-tooltips | Add contextual tooltips to Caseman Comparison page to explain coverage scores, auto-match methodology, and BA editing workflow |
| Ready | P2 | S | react-about-state-explorer | Expandable about panel on State Explorer explaining graph layout, node colour/completeness scoring, WA badge logic, and edge style conventions |
| Ready | P2 | S | react-about-digital-twin | Expandable about panel on Digital Twin explaining available events, dead-end detection, auto-walk behaviour, WA task card assumptions, and role filter behaviour |
| Ready | P2 | S | react-about-event-matrix | Expandable about panel on Event Matrix explaining open question indicators, actor grid gaps, system flag, and WA task column derivation |
| Ready | P2 | S | react-about-work-allocation | Expandable about panel on Work Allocation explaining aligned/partial/gap classification methodology, R1A scope, and source of the 17 tasks |
| Ready | P2 | S | react-about-action-items | Expandable about panel on Action Items explaining the two data sources, priority algorithm, model health score formula, and that suggestions are auto-generated |

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

- State Explorer: on each graph node, show a small WA task count badge (e.g. "3 tasks") using `getNodeWaBadge`; colour the badge by worst alignment (red if any gap, amber if any partial, green if all aligned)
- State Explorer: in the state detail panel (opened on node click), show a "Next States & WA Tasks" section using `getTransitionWaTasks` -- groups outgoing transitions by target state, showing the transition condition and any WA tasks triggered by events at the current state, with alignment badges and tooltips
- Event Matrix: add a "WA Task" column to the event table showing the task name (or "--" if no task) and an alignment colour dot
- Event Matrix: add a "WA Task" filter dropdown to filter events by their associated WA task name, or filter to "events with no WA task" / "events with WA gaps"
- **Consumes:** ui-wa-tasks module (getNodeWaBadge, getStateDetailWaTasks, getTransitionWaTasks, getEventMatrixWaColumn, getWaTaskFilterOptions, filterEventsByWaTask, getWaTaskBadge), ui-state-explorer module (extends state detail panel), ui-event-matrix module (extends table columns)

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

### wa-task-toggles (P1, L)

Toggle individual WA tasks on/off in the Digital Twin simulation to model caseworker availability and see its effect on case reachability.

**Core logic:**
- Each WA task displayed under an event gets a checkbox (checked by default)
- An event that has WA task mappings requires **at least one active (checked) task** to be considered available. If all WA tasks for an event are unchecked, the event is effectively blocked — equivalent to disabling the event itself
- Events with **no WA tasks** are unaffected by task toggles and remain always available
- The existing auto-walk and reachability calculation consumes the derived enabled/disabled event set, so blocked events naturally prevent transitions and affect terminal state reachability
- WA task checkboxes are only visible when the "Show WA Tasks" toggle is on
- When a parent event is disabled via its own event checkbox, the WA task checkboxes beneath it are greyed out (visually muted, not interactive) since the event is already blocked at a higher level

**UI behaviour:**
- Task checkboxes appear inside the WA task cards beneath each event in the events panel
- When unchecking a task causes an event to become blocked: the event visually transitions to the disabled style (same as manually unchecking the event), and the disabled-events count banner updates
- When re-checking a task restores an event: the event returns to enabled style and auto-walk recalculates
- A summary indicator shows how many WA tasks are currently disabled (e.g. "3 tasks disabled")
- Reset Simulation clears all task toggles back to checked

**Example:** Main Claim (England), state "Submitted" has event "Respond to Claim" which maps to 2 WA tasks (wa-task-03: "Review Defendant response", wa-task-04: "Review Defendant response and counterclaim"). Unchecking both tasks blocks "Respond to Claim", which removes the caseworker pathway from Submitted → With Judge via "Refer to judge" is unaffected (no WA tasks), but the respond-to-claim event can no longer fire at that state.

- **Consumes:** wa-task-engine module (getTasksForEvent), ui-wa-tasks module (digital-twin-helpers), react-digital-twin-wa (extends existing WA task cards and simulation logic)
- **Scope:** Digital Twin only

### react-action-items (P1, XL)

Consolidated action items page that surfaces all outstanding information gaps from both the process model and WA task alignment, with prioritised resolution suggestions and CSV export.

**Route:** `/action-items` added to sidebar navigation (between Work Allocation and Digital Twin)

**Two sources of action items:**

1. **Model completeness gaps** (from `model-health` and `uncertainty-display` modules):
   - Open questions on events (`hasOpenQuestions === true`) — items where the business needs to clarify rules, actors, or behaviour
   - Low-completeness states (below 50%) — states where the model is underspecified
   - Unreachable states — states with no incoming transitions (except initial states)
   - End-state reachability — whether the model can reach a terminal state from the initial state

2. **WA task alignment gaps** (from `wa-task-engine` module):
   - Gap tasks (`alignment === 'gap'`) — WA tasks with no corresponding event in the model (e.g. Failed Payment)
   - Partial tasks (`alignment === 'partial'`) — WA tasks where the event model is at a coarser granularity than WA expects, with explanation of what's missing
   - Events with no WA task — events that exist in the model but have no caseworker task mapped (may indicate missing WA coverage)

**Each action item includes:**
- **Priority** — derived from impact: gaps/unreachable = high, partial/low-completeness = medium, informational = low
- **Category** — "Model Completeness" or "WA Task Alignment"
- **Title** — concise description (e.g. "Open question: Validate event at Submitted state")
- **Detail** — the notes, alignment notes, or completeness data explaining the gap
- **Suggestion** — a generated resolution hint (e.g. "Add a 'Failed Payment' event to the CASE_ISSUED state to cover WA task 'Review Failed Payment'", "Clarify whether Strike Out is available after Listed for Hearing — event has open questions", "Increase state completeness by defining missing transitions/events for 'With Judge' (currently 60%)")
- **Links** — deep links to the relevant state in State Explorer or event in Event Matrix

**UI layout:**
- Summary cards at the top: total items, high/medium/low counts, model health score, WA alignment percentage
- Filterable/sortable table of action items: filter by category, priority, state, claim type
- Each row expandable to show full detail, suggestion, and navigation links
- "Export CSV" button exports the full action items list with all fields

**Resolution suggestions logic:**
- `getActionItems(states, transitions, events, waTasks, waMappings): ActionItem[]` — pure function that collects all gaps from both sources, assigns priorities, and generates suggestion text
- `getActionItemSummary(items): { total, high, medium, low, modelScore, waAlignmentPct }` — summary counts
- `exportActionItemsCsv(items): { content, filename, mimeType }` — CSV export

- **Consumes:** model-health module (getModelHealthSummary, getLowCompletenessStates, getUnreachableStates, canReachEndState), ui-model-health module (getOpenQuestionsList, getHealthSummaryCard), wa-task-engine module (getAlignmentSummary, getUnmappedTasks, getPartialTasks), ui-wa-tasks module (getWaTaskBadge), app-shell module (ROUTES, extends navigation)
- **Follows the 4-layer pattern:** logic helpers → UI orchestration → React page

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
P1 (WA Simulation -- requires react-digital-twin-wa):
  wa-task-toggles
    |
    v
P1 (Consolidated View -- requires model-health + wa-task-engine + ui layers):
  react-action-items
    |
    v
P2 (WA Enhancements -- requires ui-wa-tasks + react component layer):
  react-wa-state-overlay
  react-wa-dashboard
```

WA foundation features (wa-data-model, wa-ingestion) can begin immediately in parallel with UI work. The WA core features (wa-task-engine, ui-wa-tasks, react-digital-twin-wa) require both the WA data and the existing Digital Twin to be in place. WA enhancements (state overlay, dashboard) can run in parallel once ui-wa-tasks is complete.

### react-caseman-comparison-tooltips (P3, S)

Contextual tooltips across the Caseman Comparison page to help both technical and non-technical users understand what the numbers mean and how to act on them.

**High priority (carry meaning a cold reader won't know):**
- **Summary cards — Covered / Partial / Gap**: hover tooltip explaining the similarity threshold for each. Covered: >0.8 (near-identical); Partial: 0.5–0.8 (related but different granularity); Gap: <0.5 (no equivalent found)
- **Coverage % figure**: tooltip explaining formula — `(covered + partial × 0.5) / 497`. Partial counts as half.
- **Italic rows in Events table**: no legend currently. Add `ⓘ` icon near the "497 events" count — *"Italic rows are auto-derived by name similarity. Normal weight = manually curated by a BA. Click any row to edit."*
- **"Export Mappings JSON" button**: tooltip explaining the BA workflow — *"Downloads in-session edits as caseman-mappings.json. Commit to repo to make curated mappings the new team baseline."*

**Medium priority:**
- **States tab — "New (Amber)" badge**: *"Exists in new service model only — may be new functionality or a finer-grained breakdown of a Caseman status."*
- **States tab — "No match" badge**: *"No similar-named new service state found. May be a genuine gap or a naming difference — check the Events tab."*
- **Tasks tab — domain blocks on hover**: show domain name, event count, and which WA tasks cover it
- **Tasks tab — "Unclassified" block**: *"413 of 497 Caseman events have no BMS task code in the source data and cannot be classified by domain. This is a known data quality issue in Caseman, not a gap in the new service."*

**Lower priority:**
- **Expanded row — "Source: auto"**: *"Classification derived by name similarity. May be inaccurate — click Edit to override."*
- **Domain filter — "Unclassified" option**: *"Events with no BMS task code. Represents 83% of all events."*

- **Consumes:** `app/caseman-comparison/` (all four components)
- **Pattern:** CSS `title` attributes for simple cases; a lightweight Tooltip component (div with absolute positioning) for richer content on badges and buttons

---

## Feature Details (Explanatory About Panels)

All five features follow the same pattern: an expandable `<AboutPanel>` component beneath the page subtitle, collapsed by default, containing plain-English sections explaining what the user is looking at and what assumptions underlie any scores or assessments. No new logic, no new data files. The shared `AboutPanel` component lives in `app/components/AboutPanel.tsx` (created as part of `react-about-state-explorer`); subsequent features reuse it.

### react-about-state-explorer (P2, S)

Add an expandable about panel to the State Explorer page (`/state-explorer`) and extract the shared `AboutPanel` component.

- **Create** `app/components/AboutPanel.tsx` — extract and generalise the inline `AboutPanel` from `app/caseman-comparison/page.tsx`; update Caseman Comparison to use it
- **What this page does:** interactive graph of states and transitions for the selected claim type; nodes = states, directed edges = transitions triggered by events
- **Graph layout assumption:** positions are auto-generated by the dagre algorithm — layout is readable but not semantically meaningful; relative positions carry no information
- **Node colour assumption:** amber = draft/uncertain state; green = live/confirmed state; dark = terminal end state; muted/striped = low completeness (<50%). Colours derived from `uncertaintyLevel` in the model data, which is hand-authored per state
- **Completeness badge assumption:** percentage of expected model fields populated (events defined, actors assigned, rules documented) — threshold for "low" is below 50%; states at 0% may simply not yet have been modelled
- **WA task badge assumption:** count of WA tasks associated with events reachable from this state; badge colour = worst alignment at that state (red if any gap task, amber if any partial, green if all aligned). Based on `wa-mappings.json` — incomplete mappings will undercount
- **Edge style assumption:** solid line = user-initiated event; dashed = system-triggered; dotted/animated = time-based. Derived from `systemTriggered` flag in model data

### react-about-digital-twin (P2, S)

Add an expandable about panel to the Digital Twin page (`/digital-twin`).

- **What this page does:** step-through simulation of a case journey through the state machine for the selected claim type; user selects events to advance the simulation
- **Available events assumption:** only events modelled for the current state appear; events that exist in reality but are not yet modelled are invisible. The model is a work in progress — dead ends may reflect model gaps, not real process dead ends
- **Dead-end detection assumption:** a state is flagged as a dead end when `getAvailableEvents()` returns empty and `isEndState()` is false. This is a model-completeness signal, not a definitive statement about the real process
- **Auto-walk assumption:** auto-walk selects the first available event at each step — this is an arbitrary traversal path used for quick testing, not representative of any typical or expected case journey
- **WA task cards assumption:** cards are derived from `wa-mappings.json`; only the 17 R1A tasks are modelled. Partial and gap tasks appear with amber/red indicators. Tasks not in R1A scope are not shown
- **Role filter assumption:** filtering by role hides events not assigned to that role in the model — it does not mean those events cannot occur in practice; role assignment in the model may be incomplete

### react-about-event-matrix (P2, S)

Add an expandable about panel to the Event Matrix page (`/event-matrix`).

- **What this page does:** all events for the selected claim type, grouped and filterable by state, actor role, and WA task; each row is one event with its actor grid and open question status
- **Open question indicator assumption:** the ⚠ icon appears when `hasOpenQuestions` is true for an event — this flag is hand-authored in the source data. Absence of the flag does not mean the event is fully resolved; it may simply not have been reviewed yet
- **Actor grid assumption:** a filled cell means that role is assigned to this event in the model. An empty cell means the role is not defined — not necessarily that the role is uninvolved in practice. Actor assignments may be incomplete
- **System flag assumption:** marks events that are system-triggered (no human actor initiates them). Set by the `systemTriggered` field in the model data; may not be exhaustive
- **WA task column assumption:** derived from `wa-mappings.json`. Shows the WA task name and alignment status for each event. Events with no WA mapping show "—"; this may indicate either no task is needed or the mapping has not yet been authored

### react-about-work-allocation (P2, S)

Add an expandable about panel to the Work Allocation page (`/work-allocation`).

- **What this page does:** maps the 17 R1A Work Allocation tasks against the new service event model to show alignment status for each task
- **Scope assumption:** only the 17 tasks defined in the R1A Work Allocation Task Names document are covered. Future phases may define additional tasks; this view does not represent full caseworker task coverage
- **Aligned (7 tasks) assumption:** a direct event model counterpart exists with matching context and granularity. Manual cross-reference documented in `R1A_WA_Tasks_vs_Event_Model_Analysis.md`
- **Partial (9 tasks) assumption:** a related event exists in the model but at a different granularity (e.g. WA expects sub-typed adjournment; the model has a generic "make an application" event), or context differs (e.g. citizen vs professional upload)
- **Gap (1 task) assumption:** "Review Failed Payment" — no failed payment event is modelled. Payment outcome is implied in the Submit and Pay / Case Issued flow; explicit failure handling has not been designed yet
- **By Context view assumption:** context classification (claim / counterclaim / gen-app / general) is from the R1A document, not derived from the event model

### react-about-action-items (P2, S)

Add an expandable about panel to the Action Items page (`/action-items`).

- **What this page does:** consolidated list of outstanding issues drawn from two sources — model completeness checks (from the state/event model) and WA task alignment gaps. Intended to help prioritise analytical and design work
- **Two source assumption:** model completeness items come from `model-health` and `uncertainty-display` logic modules applied to the live model data. WA alignment items come from `wa-task-engine` applied to `wa-mappings.json`. Neither source is exhaustive — they surface what is currently modelled
- **Priority algorithm:** High = gap tasks with no event mapping, unreachable states, or end-state not reachable (blocking issues); Medium = partial alignment, low-completeness states (<50%), open questions (need resolution); Low = informational items unlikely to block delivery
- **Model health score assumption:** composite of four factors — open question count, low-completeness state count, unreachable state count, end-state reachability. Score bands: Good (≥80%), Fair (50–79%), Poor (<50%). Thresholds are heuristic; the score is a rough guide, not a precise measure
- **WA alignment % assumption:** `(aligned + partial × 0.5) / 17`. Partial counts as half-aligned. Same formula as Caseman Comparison coverage %
- **Suggestions assumption:** resolution suggestion text is auto-generated from templates based on item type. Text is a starting point — it may not capture the full context or the correct resolution approach for every item
- **Items are not persisted:** action items are recalculated on every page load from the current model and mapping data. There is no "mark as resolved" — an item disappears when the underlying data changes (e.g. a mapping is updated or a state is fully modelled)

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
