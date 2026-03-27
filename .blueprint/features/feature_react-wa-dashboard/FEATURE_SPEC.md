# Feature Specification -- react-wa-dashboard

## 1. Feature Intent
**Why this feature exists.**

Analysts need a single view showing the alignment status of all 17 R1A Work Allocation tasks against the possession event model. Currently this information is spread across the Digital Twin's per-event task cards and the state overlay badges. react-wa-dashboard provides a dedicated route (`/work-allocation`) with summary cards, aligned/partial/gap tables, "By State" and "By Context" grouping views, cross-links to State Explorer and Event Matrix, and CSV export.

This supports the system purpose (System Spec Section 1): enabling analysts to interrogate the possession process model holistically. The dashboard directly serves the "uncertainty as first-class content" invariant by surfacing alignment gaps, partial mappings, and missing events in a structured, exportable format.

---

## 2. Scope
### In Scope
- New route `/work-allocation` added to app shell sidebar navigation
- Summary cards: total tasks (17), aligned count (green), partial count (amber), gap count (red), percentage bar
- Aligned tasks table: task name, trigger, matched event(s), state(s) where it applies
- Partial tasks table: task name, trigger, matched event(s), what is missing (expandable alignment notes)
- Gap tasks table: task name, trigger, recommendation for event model change
- "By State" view: group WA tasks by state they apply in
- "By Context" view: group WA tasks by context (claim/counterclaim/gen-app/claim-counterclaim/general)
- Links from task rows to State Explorer or Event Matrix
- CSV export of the full alignment table
- Dashboard helper functions (pure TypeScript, no DOM): `getDashboardSummary`, `getAlignedTaskRows`, `getPartialTaskRows`, `getGapTaskRows`, `groupTasksByState`, `groupTasksByContext`, `exportAlignmentCsv`

### Out of Scope
- Editing WA task or mapping data
- Real-time data updates (static JSON at build time)
- Modifying wa-task-engine or ui-wa-tasks functions
- Authentication or access control

---

## 3. Actors Involved

### Business Analyst (primary user)
- **Can do:** View all three alignment tables, switch between default/by-state/by-context views, expand partial task rows to see alignment notes, click through to State Explorer or Event Matrix, export CSV
- **Cannot do:** Modify task data, edit alignment classifications

### The Model (data actor)
- **What it does:** Provides `WaTask[]` and `WaTaskMapping[]` arrays consumed by dashboard helper functions
- **What it cannot do:** Model is read-only

---

## 4. Behaviour Overview

**Happy path -- dashboard landing:**
1. Analyst clicks "Work Allocation" in the sidebar
2. Summary cards display: 17 total, 7 aligned (green), 9 partial (amber), 1 gap (red), with percentage bar
3. Three tables render below: Aligned, Partial, Gap

**Happy path -- aligned table:**
1. 7 rows showing task name, trigger description, matched event names, and states where those events apply
2. Each row links to the relevant state in State Explorer

**Happy path -- partial table:**
1. 9 rows showing task name, trigger description, matched event names, what is missing
2. Rows are expandable to show full alignment notes
3. Each row links to the relevant event in Event Matrix

**Happy path -- gap table:**
1. 1 row (Failed Payment) showing task name, trigger description, recommendation
2. Red badge indicating gap status

**Happy path -- By State view:**
1. Tasks grouped by the state(s) where their mapped events apply
2. State card shows state name with tasks listed underneath

**Happy path -- By Context view:**
1. Tasks grouped by context: claim, counterclaim, gen-app, claim-counterclaim, general
2. Context card shows context label with tasks listed underneath

**Happy path -- CSV export:**
1. Analyst clicks "Export CSV" button
2. Browser downloads a CSV file containing all tasks with columns: Task Name, Trigger, Alignment, Matched Events, Alignment Notes

---

## 5. State & Lifecycle Interactions

This feature is **state-querying**. It reads WA task and mapping data to compose dashboard views but does not modify any system state.

- **States entered:** None
- **States exited:** None
- **States modified:** None
- **Feature type:** Pure query and display

---

## 6. Rules & Decision Logic

### Rule 1: Summary counts match alignment field
- **Description:** Summary cards count each task once by its `alignment` field. Percentages are `count / total * 100`.
- **Inputs:** `WaTask[]`, `WaTaskMapping[]`
- **Outputs:** `{ total, aligned, partial, gap, alignedPct, partialPct, gapPct }`
- **Deterministic:** Yes

### Rule 2: Aligned task rows include matched events and states
- **Description:** For each aligned task, resolve its mapped events from the mapping's `eventIds`, and list the states where those events appear (if event data is provided).
- **Deterministic:** Yes

### Rule 3: Partial task rows include missing explanation
- **Description:** The "what is missing" column comes from `WaTaskMapping.alignmentNotes`.
- **Deterministic:** Yes

### Rule 4: Gap task rows include recommendation
- **Description:** The recommendation comes from `WaTaskMapping.alignmentNotes` for gap tasks.
- **Deterministic:** Yes

### Rule 5: State grouping uses event-to-state resolution
- **Description:** For each task, find its mapped events, then find which states those events appear in. Group tasks under each state.
- **Deterministic:** Yes

### Rule 6: Context grouping uses taskContext field
- **Description:** Simple grouping by `WaTask.taskContext`.
- **Deterministic:** Yes

### Rule 7: CSV export includes all tasks
- **Description:** CSV contains all 17 tasks with columns: Task Name, Trigger, Alignment, Matched Events, Alignment Notes.
- **Deterministic:** Yes

---

## 7. Dependencies

### System components
- **wa-task-engine** (`src/wa-task-engine/index.ts`): `getAlignmentSummary`, `getUnmappedTasks`, `getPartialTasks`, `filterTasksByContext`, `getTasksForState`
- **ui-wa-tasks** (`src/ui-wa-tasks/index.ts`): `getWaTaskBadge`, `getWaTaskTooltip`, `prepareWaTaskPanel`
- **app-shell** (`src/app-shell/index.ts`): ROUTES (extends with `/work-allocation`)
- **ui-app-shell** (`src/ui-app-shell/index.ts`): `getNavigationItems` (picks up new route)
- **Data files:** `data/wa-tasks.json`, `data/wa-mappings.json`

### External systems
- None

---

## 8. Non-Functional Considerations
- **Performance:** Not a concern -- 17 tasks, 17 mappings, simple array operations
- **Accessibility:** Badge colours always accompanied by text labels for WCAG AA
- **Error tolerance:** Dashboard degrades gracefully when data is unavailable

---

## 9. Assumptions & Open Questions

### Assumptions
- ASSUMPTION: Dashboard helper functions are pure TypeScript in `src/ui-wa-tasks/dashboard-helpers.ts`, following the UI helper layer pattern
- ASSUMPTION: State grouping requires event data to resolve which states each task's events appear in. If no event data is available, state grouping returns empty.
- ASSUMPTION: CSV export is a client-side browser download, not a server endpoint

### Open Questions
1. Should the "By State" view include states that have no WA tasks? Recommendation: no, only show states that have at least one WA task.
2. Should the percentage bar be a stacked bar or separate bars? Recommendation: stacked bar showing aligned/partial/gap proportions.

---

## 10. Impact on System Specification

This feature **reinforces** existing system assumptions:
- Pure helper functions follow the UI helper layer pattern (System Spec Section 11, Layer 2)
- Read-only querying of model data respects the read-only invariant
- Alignment gap visibility serves the "uncertainty as first-class content" principle
- Adding a route extends the existing ROUTES pattern in app-shell

**No contradiction** with the current system specification.

---

## 11. Handover to BA (Cass)

### Story themes
1. **Summary cards and percentage bar** -- the landing view with alignment counts
2. **Alignment tables** -- aligned, partial, and gap tables with appropriate columns and expandable rows
3. **Grouping views** -- "By State" and "By Context" alternative views
4. **Cross-links and CSV export** -- navigation to State Explorer/Event Matrix and CSV download

### Expected story boundaries
- Summary cards + tables can be one story (they are the core dashboard)
- Grouping views are a natural second story
- Cross-links and CSV export can be a third story
- Feature is L effort, so 3-4 stories is appropriate

### Areas needing careful story framing
- The helper functions that produce table row data must be clearly specified with exact field names
- CSV format must be explicit in acceptance criteria
- State grouping depends on event data availability

---

## 12. Change Log (Feature-Level)
| Date | Change | Reason | Raised By |
|-----|------|--------|-----------|
| 2026-03-27 | Initial feature specification created | Feature pipeline kickoff for WA alignment dashboard | Alex (System Spec Agent) |
