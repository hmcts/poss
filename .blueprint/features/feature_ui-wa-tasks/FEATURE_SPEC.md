# Feature Specification — ui-wa-tasks

## 1. Feature Intent
**Why this feature exists.**

The wa-task-engine provides pure query functions for resolving WA tasks per event or state, but its outputs are raw domain objects unsuitable for direct rendering. React components need display-ready data: badge colours, tooltip strings, structured panel data, and enriched event objects with WA metadata attached.

ui-wa-tasks is the UI orchestration layer that bridges wa-task-engine (pure logic) and the React component layer. It follows the established pattern set by `src/ui-case-walk/index.ts` and other `ui-*` modules: pure TypeScript functions that compose logic-layer outputs into view-model structures, with no DOM or React dependencies.

This supports the system purpose (System Spec Section 1) by ensuring analysts see WA task alignment status -- aligned, partial, gap -- directly alongside events and states in the UI. It serves the "uncertainty as first-class content" invariant by translating alignment gaps into visible badges, tooltips, and counts rather than hiding them.

---

## 2. Scope
### In Scope
- `enrichEventWithWaTask(event, mappings, tasks): EnrichedEvent` -- augment an event with optional `waTask` display metadata
- `enrichAvailableActions(actions, mappings, tasks): EnrichedAction[]` -- batch-enrich actions for the Digital Twin available events panel
- `getWaTaskBadge(alignment: WaAlignmentStatusValue): { label: string, colour: string, icon: string }` -- display metadata for alignment status
- `getWaTaskTooltip(task: WaTask, mapping: WaTaskMapping): string` -- human-readable tooltip string
- `prepareWaTaskPanel(stateId, events, mappings, tasks): WaTaskPanelData` -- structured data for a state detail view's WA task section
- `getStateWaTaskCount(stateId, events, mappings, tasks): { total: number, aligned: number, partial: number, gap: number }` -- per-state WA task counts by alignment
- TypeScript types for all return structures (`EnrichedEvent`, `EnrichedAction`, `WaTaskBadge`, `WaTaskPanelData`, `WaTaskCountSummary`)
- Unit tests for all functions
- Bridge `.js` file re-exporting from `.ts` (per existing module pattern)

### Out of Scope
- React components (that is react-digital-twin-wa, react-wa-state-overlay, react-wa-dashboard)
- Modifying wa-task-engine functions or wa-data-model schemas
- Loading or mutating store data
- Any server-side logic
- Styling, CSS, or theme decisions (this layer produces data, not DOM)

---

## 3. Actors Involved

### The Model (data actor)
- **What it does:** Provides `WaTask[]`, `WaTaskMapping[]`, and `Event[]` arrays consumed as function parameters.
- **What it cannot do:** The model is read-only. Functions query but never mutate.

### Business Analyst (indirect)
- **What they do:** They do not call these functions directly. They benefit because React components use these functions to surface WA task badges, tooltips, and panel data in the State Explorer, Digital Twin, and Event Matrix.
- **What they cannot do:** Nothing in this feature is user-facing.

---

## 4. Behaviour Overview

**Happy path -- event enrichment:**
1. Caller passes an `Event` object plus `mappings` and `tasks` arrays.
2. `enrichEventWithWaTask` calls `getEventWaContext` from wa-task-engine to resolve the WA task for the event.
3. If a mapping exists, the returned object includes a `waTask` property with `taskName`, `alignment`, `context`, and `notes`. If no mapping exists, `waTask` is `undefined`.
4. The enriched event retains all original `Event` fields.

**Happy path -- batch action enrichment:**
1. Caller passes an array of action/event objects (from the Digital Twin available events panel).
2. `enrichAvailableActions` maps over each action, calling `enrichEventWithWaTask` for each.
3. Returns `EnrichedAction[]` where each action carries optional WA task display data.

**Happy path -- badge resolution:**
1. Caller passes a `WaAlignmentStatusValue` (`'aligned'`, `'partial'`, or `'gap'`).
2. `getWaTaskBadge` returns a fixed object: green/check for aligned, amber/warning for partial, red/cross for gap.
3. The badge object contains `label`, `colour` (hex or semantic token), and `icon` (icon name string).

**Happy path -- tooltip generation:**
1. Caller passes a `WaTask` and its `WaTaskMapping`.
2. `getWaTaskTooltip` composes a human-readable string: task name, trigger description, and alignment notes (if non-empty).
3. For aligned tasks the tooltip is brief. For partial/gap tasks it includes the alignment explanation.

**Happy path -- panel preparation:**
1. Caller passes a state ID plus events, mappings, and tasks.
2. `prepareWaTaskPanel` calls `getTasksForState` from wa-task-engine, then enriches each task with badge and tooltip data.
3. Returns a `WaTaskPanelData` object containing: the task list (with badges and tooltips), an alignment summary, and whether any gaps exist.

**Happy path -- state count:**
1. Caller passes a state ID plus events, mappings, and tasks.
2. `getStateWaTaskCount` resolves tasks for the state, then counts by alignment.
3. Returns `{ total, aligned, partial, gap }`.

**Key alternatives:**
- Events with no WA task mapping produce `waTask: undefined` in enriched output. This is normal -- most events do not trigger WA tasks.
- States with no WA-triggering events produce an empty panel and `{ total: 0, aligned: 0, partial: 0, gap: 0 }`.
- An unknown alignment value passed to `getWaTaskBadge` should fall through to a neutral/grey badge as a defensive default.

---

## 5. State & Lifecycle Interactions

This feature is **state-querying and view-model-producing**. It does not enter, exit, or modify any system states.

- **States entered:** None
- **States exited:** None
- **States modified:** None
- **Feature type:** Pure view-model composition

The functions accept state IDs and events as parameters to compose display-ready data. They do not alter the possession process lifecycle or the WA data.

---

## 6. Rules & Decision Logic

### Rule 1: Badge colour mapping is fixed
- **Description:** Alignment status maps to a fixed badge: `aligned` -> green/check, `partial` -> amber/warning, `gap` -> red/cross. No dynamic computation.
- **Inputs:** `WaAlignmentStatusValue`
- **Outputs:** `{ label: string, colour: string, icon: string }`
- **Deterministic:** Yes -- static lookup

### Rule 2: Tooltip composition follows a fixed template
- **Description:** The tooltip string is composed as: `"{taskName} -- Triggered by: {triggerDescription}"`. If `alignmentNotes` is non-empty, append: `" | Note: {alignmentNotes}"`.
- **Inputs:** `WaTask`, `WaTaskMapping`
- **Outputs:** A single string
- **Deterministic:** Yes

### Rule 3: Event enrichment is additive, not destructive
- **Description:** `enrichEventWithWaTask` returns an object that includes all original `Event` fields plus an optional `waTask` property. No original fields are removed or modified.
- **Inputs:** `Event`, `WaTaskMapping[]`, `WaTask[]`
- **Outputs:** `EnrichedEvent` (superset of `Event`)
- **Deterministic:** Yes

### Rule 4: State task count uses wa-task-engine resolution
- **Description:** `getStateWaTaskCount` delegates to `getTasksForState` for resolution and then counts by `task.alignment`. It does not re-implement resolution logic.
- **Inputs:** State ID, `Event[]`, `WaTaskMapping[]`, `WaTask[]`
- **Outputs:** `{ total, aligned, partial, gap }`
- **Deterministic:** Yes

### Rule 5: Panel data aggregates tasks with display metadata
- **Description:** `prepareWaTaskPanel` composes task list items each containing the task, its badge (from Rule 1), and its tooltip (from Rule 2), plus an overall alignment summary and a `hasGaps` boolean flag.
- **Inputs:** State ID, `Event[]`, `WaTaskMapping[]`, `WaTask[]`
- **Outputs:** `WaTaskPanelData`
- **Deterministic:** Yes

---

## 7. Dependencies

### System components
- **wa-task-engine** (`src/wa-task-engine/index.ts`): Provides `getTasksForEvent`, `getTasksForState`, `getEventWaContext`, `getAlignmentSummary`. This is the primary upstream dependency -- ui-wa-tasks composes these query results into view-model structures.
- **wa-data-model** (`src/data-model/schemas.ts`, `src/data-model/enums.ts`): Provides `WaTask`, `WaTaskMapping`, `WaAlignmentStatusValue`, `WaTaskContextValue` types.
- **data-model** (`src/data-model/schemas.ts`): Provides `Event` type used as input to enrichment functions.
- **ui-case-walk** (`src/ui-case-walk/index.ts`): Provides the `EnrichedEvent` pattern this feature extends. The existing `EnrichedEvent` in ui-case-walk adds an `indicator` field; ui-wa-tasks follows the same additive enrichment pattern but adds a `waTask` field.

### External systems
- None

### Policy or legislative dependencies
- None

### Operational dependencies
- Correctly ingested WA task and mapping data must be available. Data quality is the responsibility of wa-ingestion, not this feature.

---

## 8. Non-Functional Considerations

- **Performance:** Not a concern. The dataset is 17 tasks, 17 mappings, and hundreds of events. All operations are simple lookups and string composition.
- **Audit/logging:** Not applicable. Pure functions with no side effects.
- **Error tolerance:** Functions should handle edge cases gracefully: events with no WA mapping return undefined/null enrichment, states with no tasks return empty panels and zero counts. No exceptions thrown for missing data.
- **Security:** Not applicable -- no user input, no authentication, internal tool.
- **Testability:** All functions are pure and stateless. Tests should cover: events with and without WA tasks, all three alignment tiers for badges, tooltip composition with and without alignment notes, panel data for states with mixed alignment, and zero-task states.

---

## 9. Assumptions & Open Questions

### Assumptions
- **ASSUMPTION:** The `EnrichedEvent` type in this module is a new type distinct from the `EnrichedEvent` in ui-case-walk. The ui-wa-tasks version adds a `waTask` property. Downstream consumers (react-digital-twin-wa) may need to compose both enrichments. The naming should be disambiguated -- recommend `WaEnrichedEvent` or a combined type.
- **ASSUMPTION:** Badge colours use the project's existing semantic colour tokens (green for positive, amber for caution, red for alert) consistent with the dark-only slate/indigo theme.
- **ASSUMPTION:** The `icon` field in the badge return is a string identifier (e.g. `'check'`, `'warning'`, `'cross'`) that React components resolve to an actual icon. This module does not import icon libraries.
- **ASSUMPTION:** `enrichAvailableActions` accepts the same event/action objects that `getAvailableActionsPanel` in ui-case-walk produces. The input type aligns with `Event` or a superset thereof.
- **ASSUMPTION:** The module lives at `src/ui-wa-tasks/index.ts` following the `src/ui-*/` pattern, with a bridge `index.js` file.

### Open Questions
1. **Type naming:** Should the enriched event type be called `WaEnrichedEvent` to avoid collision with ui-case-walk's `EnrichedEvent`? Recommendation: yes, use `WaEnrichedEvent` for clarity.
2. **Composition with existing enrichment:** When the Digital Twin needs both uncertainty indicators (from ui-case-walk) and WA task data (from ui-wa-tasks), should there be a combined enrichment function, or should react-digital-twin-wa compose the two? Recommendation: let the React layer compose -- keep ui-wa-tasks focused on WA concerns only.
3. **Badge colour values:** Should `colour` be hex values (e.g. `'#22C55E'`) or Tailwind class names (e.g. `'green-500'`)? Recommendation: use semantic tokens or hex values to keep this layer framework-agnostic, consistent with how uncertainty-display returns colour objects.

---

## 10. Impact on System Specification

This feature **reinforces** existing system assumptions:
- It follows the established UI helper layer pattern (System Spec Section 11, Layer 2): pure TypeScript functions that compose logic-layer outputs into view-model structures, with no DOM or React dependencies.
- It respects the read-only model invariant -- functions query but never mutate data.
- It directly serves the "uncertainty as first-class content" principle by making WA alignment gaps visible through badges, tooltips, and counts rather than hiding incomplete mappings.
- It follows the same enrichment pattern established by ui-case-walk (`EnrichedEvent`, `ActionsPanel`).

**No contradiction** with the current system specification.

**No stretch** -- this feature operates entirely within the established UI helper layer conventions. It adds no new architectural patterns, no new data formats, and no new runtime dependencies.

---

## 11. Handover to BA (Cass)

### Story themes
1. **Event enrichment:** `enrichEventWithWaTask` and `enrichAvailableActions` -- stories around augmenting events with WA task display data, including the no-task case.
2. **Badge and tooltip display metadata:** `getWaTaskBadge` and `getWaTaskTooltip` -- stories covering the fixed display mappings for all three alignment tiers.
3. **Panel preparation:** `prepareWaTaskPanel` -- stories around composing the structured data for state detail views.
4. **State-level counting:** `getStateWaTaskCount` -- stories covering per-state WA task aggregation by alignment.
5. **Type definitions:** Defining the return types (`WaEnrichedEvent`, `EnrichedAction`, `WaTaskBadge`, `WaTaskPanelData`, `WaTaskCountSummary`).

### Expected story boundaries
- Badge and tooltip functions are small and can share a story.
- Event enrichment (single + batch) is a natural story boundary.
- Panel preparation and state counting can be grouped as they both operate at the state level.
- Feature is M effort, so 3-5 stories is appropriate.

### Areas needing careful story framing
- The relationship between this module's `EnrichedEvent`/`WaEnrichedEvent` and ui-case-walk's `EnrichedEvent` must be explicit in acceptance criteria. Stories should clarify that these are separate types composed at the React layer.
- The badge colour values must be specified concretely in acceptance criteria -- Cass should confirm whether hex values or semantic tokens are expected.
- Tooltip template acceptance criteria should include example strings for each alignment tier so Codey has unambiguous targets.

---

## 12. Change Log (Feature-Level)
| Date | Change | Reason | Raised By |
|-----|------|--------|-----------|
| 2026-03-27 | Initial feature specification created | Feature pipeline kickoff for WA UI orchestration layer | Alex (System Spec Agent) |
