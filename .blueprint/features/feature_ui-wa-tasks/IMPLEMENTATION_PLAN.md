# Implementation Plan -- ui-wa-tasks

## Overview

UI orchestration layer bridging `wa-task-engine` (pure domain logic) and React components. Provides 6 pure functions that compose wa-task-engine outputs into display-ready view-model structures: badges, tooltips, enriched events, panel data, and state-level counts.

## Files to Create

### 1. `src/ui-wa-tasks/index.ts` (main implementation)

**Types:**
- `WaTaskBadge` -- `{ label: string, colour: string, icon: string }`
- `WaTaskMeta` -- `{ taskName: string, alignment: string, notes: string }`
- `WaEnrichedEvent` -- spread of original event + optional `waTask: WaTaskMeta`
- `WaTaskPanelItem` -- `{ task: WaTask, badge: WaTaskBadge, tooltip: string }`
- `WaTaskPanelData` -- `{ tasks: WaTaskPanelItem[], summary: {aligned, partial, gap}, hasGaps: boolean }`
- `WaTaskCountSummary` -- `{ total, aligned, partial, gap }`

**Functions:**

1. `getWaTaskBadge(alignment: string): WaTaskBadge`
   - Static lookup: aligned -> green/#22C55E/check, partial -> amber/#F59E0B/warning, gap -> red/#EF4444/cross
   - Fallback: Unknown/#6B7280/unknown for any unrecognised value

2. `getWaTaskTooltip(task: WaTask, mapping: WaTaskMapping): string`
   - Template: `"{taskName} -- Triggered by: {triggerDescription}"`
   - Append ` | Note: {alignmentNotes}` if alignmentNotes is non-empty

3. `enrichEventWithWaTask(event, mappings, tasks): WaEnrichedEvent`
   - Delegates to `getEventWaContext` from wa-task-engine
   - Spreads original event, adds `waTask` with taskName/alignment/notes (or undefined if no mapping)

4. `enrichAvailableActions(actions, mappings, tasks): WaEnrichedEvent[]`
   - Maps over actions calling `enrichEventWithWaTask` for each

5. `prepareWaTaskPanel(stateId, events, mappings, tasks): WaTaskPanelData`
   - Delegates to `getTasksForState` (deduplicated by engine)
   - Enriches each task with badge and tooltip
   - Computes alignment summary via `getAlignmentSummary`
   - Sets `hasGaps = summary.gap > 0`

6. `getStateWaTaskCount(stateId, events, mappings, tasks): WaTaskCountSummary`
   - Delegates to `getTasksForState` + `getAlignmentSummary`
   - Returns `{ total: aligned+partial+gap, aligned, partial, gap }`

### 2. `src/ui-wa-tasks/index.js` (bridge file)

Re-exports all 6 functions from `./index.ts`, following the pattern in `src/wa-task-engine/index.js`.

## Dependencies

- `src/wa-task-engine/index.ts` -- `getEventWaContext`, `getTasksForState`, `getAlignmentSummary`
- `src/data-model/schemas.ts` -- `WaTask`, `WaTaskMapping` types
- `data/wa-tasks.json`, `data/wa-mappings.json` -- consumed by callers, passed as parameters

## Test Coverage

19 tests across 3 suites covering all 6 functions, all alignment tiers, edge cases (empty input, unmapped events, deduplication, unknown alignment fallback).
