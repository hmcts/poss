# Feature Specification — react-digital-twin-wa

## 1. Feature Intent
**Why this feature exists.**

The Digital Twin (Case Walk) simulation currently shows state transitions and events but has no visibility into the caseworker Work Allocation tasks that those events trigger. Analysts need to understand which WA tasks fire at each simulation step, whether those tasks are fully aligned with the event model, and where gaps or partial alignments exist.

react-digital-twin-wa integrates WA task cards directly into the Digital Twin React component so that caseworker tasks are visible during simulation. This serves the system purpose (System Spec Section 1) of enabling analysts to "simulate a case journey and see where the model breaks or is incomplete" -- WA alignment gaps are a form of incompleteness that must be surfaced, not hidden. It directly supports the "uncertainty as first-class content" invariant by making alignment status (aligned/partial/gap) visually prominent within the simulation flow.

---

## 2. Scope
### In Scope
- WA task card beneath each event in the available events panel when that event triggers a WA task
- Collapsible task card: collapsed shows task name + alignment badge; expanded shows trigger description, alignment notes, and context label
- WA task tag/chip on timeline entries when the applied event triggered a WA task
- "Show WA Tasks" toggle in simulation controls (default: off)
- Info note when current state has no WA-task-triggering events available
- Amber info box within task cards for partial alignment, explaining what the event model is missing
- Red banner at payment-related states for the Failed Payment gap task
- All WA display data sourced from ui-wa-tasks functions; no logic duplication

### Out of Scope
- Modifying the existing Digital Twin simulation logic (case-walk module, ui-case-walk module)
- Modifying wa-task-engine or ui-wa-tasks functions
- WA task indicators on the State Explorer graph (that is react-wa-state-overlay)
- WA task column in the Event Matrix (that is react-wa-state-overlay)
- Dedicated WA dashboard page (that is react-wa-dashboard)
- Loading or ingesting WA data (that is wa-ingestion and data-loading)
- Extending the AppProvider with WA data (assumed handled by data-loading or a WA-specific provider)

---

## 3. Actors Involved

### Business Analyst (primary user)
- **What they can do:** Toggle WA task visibility on/off during simulation. View task cards beneath events. Expand/collapse task cards for detail. See WA task chips on the timeline. See gap/partial alignment warnings.
- **What they cannot do:** Edit WA task data, change alignment status, or modify task-to-event mappings through the UI.

### The Model (data actor)
- **What it does:** Provides `WaTask[]` and `WaTaskMapping[]` arrays consumed by ui-wa-tasks functions that this component calls.
- **What it cannot do:** The model is read-only.

---

## 4. Behaviour Overview

**Happy path -- WA tasks visible during simulation:**
1. Analyst starts a simulation in the Digital Twin.
2. Analyst toggles "Show WA Tasks" on in the simulation controls.
3. For each event in the available events panel that triggers a WA task, a task card appears beneath the event row.
4. The task card shows the task name and an alignment badge (green for aligned, amber for partial, red for gap) in its collapsed state.
5. Analyst clicks the task card to expand it, revealing: trigger description, alignment notes (if any), and context label (e.g. "claim", "gen-app").
6. When the analyst advances the simulation by selecting an event, the new timeline entry includes a WA task chip if the applied event triggered a task.
7. The process repeats at each state.

**Alternative -- no WA tasks at current state:**
1. If the simulation is at a state where no available events trigger WA tasks, an info note appears: "No caseworker tasks at this state".
2. This only shows when the WA toggle is on.

**Alternative -- partial alignment:**
1. For events with `alignment === 'partial'`, the expanded task card includes an amber info box explaining what the event model is missing (sourced from `alignmentNotes` via `getWaTaskTooltip`).

**Alternative -- Failed Payment gap:**
1. When the simulation reaches a payment-related state (states whose `technicalName` contains `PAYMENT` or `PENDING_CASE_ISSUED`), a red banner appears: "WA task 'Review Failed Payment' has no corresponding event in the model".
2. This banner shows only when the WA toggle is on and a gap task exists for the payment context.

**Alternative -- WA toggle off (default):**
1. When the toggle is off, no task cards, task chips, info notes, or gap banners are rendered. The Digital Twin behaves exactly as before this feature.

---

## 5. State & Lifecycle Interactions

This feature is **state-querying and display-only**. It does not enter, exit, or modify any system states.

- **States entered:** None
- **States exited:** None
- **States modified:** None
- **Feature type:** Pure display/presentation layer over existing simulation

The feature reads the current simulation state and available events to resolve and display WA task information. It adds a single piece of local React state: the `showWaTasks` toggle boolean.

---

## 6. Rules & Decision Logic

### Rule 1: Task card visibility is controlled by the WA toggle
- **Description:** WA task cards, timeline chips, info notes, and gap banners only render when `showWaTasks` is `true`. Default is `false`.
- **Inputs:** `showWaTasks` boolean (local React state)
- **Outputs:** Conditional rendering of all WA UI elements
- **Deterministic:** Yes

### Rule 2: Task cards appear only for events that trigger WA tasks
- **Description:** For each event in the available events panel, call `enrichEventWithWaTask` (from ui-wa-tasks). If the returned object has `waTask !== undefined`, render a task card beneath the event. Otherwise, no card.
- **Inputs:** Event object, `WaTaskMapping[]`, `WaTask[]`
- **Outputs:** Task card or nothing
- **Deterministic:** Yes -- delegates to ui-wa-tasks

### Rule 3: Alignment badge colour follows the fixed mapping
- **Description:** `getWaTaskBadge(alignment)` returns green/check for aligned, amber/warning for partial, red/cross for gap. The component renders these as styled badge elements.
- **Inputs:** `WaAlignmentStatusValue`
- **Outputs:** Badge with label, colour, icon
- **Deterministic:** Yes -- static lookup in ui-wa-tasks

### Rule 4: Timeline chip shows task name when event triggered a WA task
- **Description:** When an event is applied and the simulation advances, the timeline entry includes a small chip showing the WA task name if `enrichEventWithWaTask` returned a `waTask` for that event. The chip uses the alignment badge colour as its background.
- **Inputs:** Applied event's WA enrichment data
- **Outputs:** Chip element on timeline entry, or nothing
- **Deterministic:** Yes

### Rule 5: "No caseworker tasks" info note shows at task-free states
- **Description:** When the WA toggle is on and `getStateWaTaskCount` returns `total === 0` for the current state, display an info note. When total > 0 or the toggle is off, no info note.
- **Inputs:** Current state ID, events, mappings, tasks
- **Outputs:** Info note or nothing
- **Deterministic:** Yes

### Rule 6: Partial alignment amber info box
- **Description:** When a task card is expanded and the task's alignment is `'partial'`, render an amber info box containing the alignment notes text. The notes come from `getWaTaskTooltip` or directly from the `waTask.notes` field on the enriched event.
- **Inputs:** `WaTaskMeta.alignment`, `WaTaskMeta.notes`
- **Outputs:** Amber info box or nothing
- **Deterministic:** Yes

### Rule 7: Failed Payment gap red banner at payment-related states
- **Description:** When the WA toggle is on and the current state's `technicalName` includes `PAYMENT` or equals `PENDING_CASE_ISSUED`, check if any gap tasks exist via `getUnmappedTasks` from wa-task-engine. If yes, display a red banner with the gap task name.
- **Inputs:** Current state `technicalName`, `WaTask[]`, `WaTaskMapping[]`
- **Outputs:** Red banner or nothing
- **Deterministic:** Yes

---

## 7. Dependencies

### System components
- **ui-wa-tasks** (`src/ui-wa-tasks/index.ts`): Primary dependency. Provides `enrichEventWithWaTask`, `enrichAvailableActions`, `getWaTaskBadge`, `getWaTaskTooltip`, `getStateWaTaskCount`. All WA display data is sourced from these functions.
- **wa-task-engine** (`src/wa-task-engine/index.ts`): Provides `getUnmappedTasks` for the Failed Payment gap banner, and `getTasksForState` used indirectly via ui-wa-tasks.
- **ui-case-walk** (`src/ui-case-walk/index.ts`): Provides the existing simulation enrichment functions (`initializeSimulation`, `getAvailableActionsPanel`, `advanceSimulation`, `getSimulationTimeline`, `getSimulationStatus`) that this feature integrates alongside.
- **wa-data-model** (types from `src/data-model/schemas.ts`): Provides `WaTask`, `WaTaskMapping` types used as function parameters.
- **app/providers.tsx**: Provides `useApp()` hook for model data and active claim type. Must be extended (or a sibling WA provider created) to supply `WaTask[]` and `WaTaskMapping[]` to the component.
- **app/digital-twin/page.tsx**: The existing Digital Twin React component that this feature modifies.

### External systems
- None

### Policy or legislative dependencies
- None

### Operational dependencies
- WA task and mapping data must be loaded and available via React context or provider. The mechanism for loading this data is outside this feature's scope (handled by data-loading or a WA-specific provider extension).

---

## 8. Non-Functional Considerations

- **Performance:** Not a concern. WA enrichment adds 17 task lookups at most per state. All operations are simple array filters. No network calls.
- **Audit/logging:** Not applicable. Display-only feature.
- **Error tolerance:** If WA data is unavailable (e.g. provider not yet wired), the component should degrade gracefully -- the WA toggle should be disabled or hidden, and the Digital Twin should function exactly as before. No crashes for missing WA data.
- **Security:** Not applicable -- internal tool, no user input beyond toggle clicks.
- **Accessibility:** Task cards should be keyboard-navigable. Collapsible cards should use appropriate aria-expanded attributes. Colour badges should include text labels (not colour-only). Follows the project's WCAG AA goal.

---

## 9. Assumptions & Open Questions

### Assumptions
- **ASSUMPTION:** WA task and mapping data will be available via a React context provider (either by extending `AppProvider` in `app/providers.tsx` with a `waData` field, or via a separate `WaProvider`). This feature consumes that data but does not implement the provider.
- **ASSUMPTION:** The `showWaTasks` toggle is local React state within the Digital Twin page component. It does not persist across navigation or page reloads.
- **ASSUMPTION:** The "payment-related state" heuristic (state `technicalName` containing `PAYMENT` or equalling `PENDING_CASE_ISSUED`) is sufficient for triggering the Failed Payment gap banner. If future states use different naming, the heuristic may need updating.
- **ASSUMPTION:** The existing `EventsList` sub-component in `app/digital-twin/page.tsx` will be extended to accept WA data props and render task cards, rather than creating a separate component tree.
- **ASSUMPTION:** Timeline entries in the existing component use the `TimelineEntry` type from ui-case-walk. WA task chips will be rendered conditionally alongside the existing timeline node, not requiring a new timeline entry type -- the chip data is resolved at render time from the event that caused the transition.
- **ASSUMPTION:** Sample/mock WA data will be used for prototyping (consistent with how the existing Digital Twin uses sample data from `app/providers.tsx`), with real data integration deferred to the data-loading pipeline.

### Open Questions
1. **WA data provider mechanism:** Should `AppProvider` be extended with `waData: { tasks: WaTask[], mappings: WaTaskMapping[] }`, or should a separate `WaProvider` wrap the Digital Twin page? Recommendation: extend `AppProvider` for simplicity, since WA data is small and static.
2. **Timeline chip data source:** The current timeline entries track `stateId` and `stateName` but not the event that caused the transition. To show a WA task chip on the timeline, the component needs to track which event was applied at each step. Should this be stored in local state alongside the simulation, or should `TimelineEntry` be extended? Recommendation: store a local `Map<number, WaTaskMeta | undefined>` keyed by step number.
3. **Toggle persistence:** Should the WA toggle state persist in the URL (query param) or session storage so it survives page navigation? Recommendation: no -- local state is sufficient for this prototype-stage tool.

---

## 10. Impact on System Specification

This feature **reinforces** existing system assumptions:
- It operates within the React component layer (System Spec Section 11, Layer 3), consuming UI helper modules exactly as the existing Digital Twin does.
- It respects the read-only model invariant -- WA data is queried, never mutated.
- It directly serves the "uncertainty as first-class content" principle by making WA alignment gaps and partial alignments visible during simulation via badges, info boxes, and banners.
- The toggle-off default respects the principle that the tool should not overwhelm users -- analysts opt in to WA visibility when they need it.

**No contradiction** with the current system specification.

**Minor stretch:** The Failed Payment gap banner introduces a state-name-based heuristic (checking `technicalName` for payment-related strings) that is not part of the existing state model. This is a pragmatic display rule, not a model change. If more gap tasks emerge in future, a more systematic approach (e.g. gap tasks declaring which states they apply to) may be warranted. This does not require a system spec change now.

---

## 11. Handover to BA (Cass)

### Story themes
1. **WA toggle and task cards:** The "Show WA Tasks" toggle and collapsible task cards beneath events in the available events panel. Core interaction pattern.
2. **Timeline WA chips:** WA task tag/chip on timeline entries when the applied event triggered a task.
3. **Alignment warnings:** Amber info box for partial alignment within task cards, and red banner for Failed Payment gap at payment-related states.
4. **Empty state and graceful degradation:** "No caseworker tasks at this state" info note, and behaviour when WA data is unavailable.

### Expected story boundaries
- Toggle + task cards (collapsed/expanded) form a natural first story -- the core integration.
- Timeline chips are a second story -- requires tracking applied events per timeline step.
- Alignment warnings (partial amber box + gap red banner) can be a third story.
- Empty state / degradation is small enough to be acceptance criteria on the first story or a standalone story.
- Feature is L effort, so 3-5 stories is appropriate.

### Areas needing careful story framing
- The data provider mechanism (how WA tasks and mappings reach the component) must be clarified before story acceptance criteria can reference specific props or hooks. Stories should state the data contract without prescribing the provider pattern.
- The timeline chip requires the component to know which event was applied at each step -- this is not currently tracked. The story should call out this local state addition explicitly.
- The Failed Payment banner heuristic (state name matching) should be documented in acceptance criteria so it can be tested against all sample claim types.

---

## 12. Change Log (Feature-Level)
| Date | Change | Reason | Raised By |
|-----|------|--------|-----------|
| 2026-03-27 | Initial feature specification created | Feature pipeline kickoff for Digital Twin WA task integration | Alex (System Spec Agent) |
