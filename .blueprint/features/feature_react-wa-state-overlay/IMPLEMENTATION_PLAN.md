# Implementation Plan -- react-wa-state-overlay

## Files to create

1. `src/ui-wa-tasks/state-overlay-helpers.ts` -- 5 pure helper functions
2. `src/ui-wa-tasks/state-overlay-helpers.js` -- bridge file re-exporting from .ts

## Files to modify

3. `app/state-explorer/page.tsx` -- add WA badges on nodes, WA tasks section in detail panel
4. `app/event-matrix/page.tsx` -- add WA Task column, WA Task filter dropdown

## Implementation order

1. Create `state-overlay-helpers.ts` with all 5 functions
2. Create `state-overlay-helpers.js` bridge
3. Run tests to verify all pass
4. Update `app/state-explorer/page.tsx`
5. Update `app/event-matrix/page.tsx`

## Function signatures

### getNodeWaBadge
```ts
getNodeWaBadge(stateId: string, events: Event[], waTasks: WaTask[], waMappings: WaTaskMapping[]): { label: string; colour: string } | null
```
Uses `getTasksForState` to get tasks, counts them, determines worst alignment for colour.

### getStateDetailWaTasks
```ts
getStateDetailWaTasks(stateId: string, events: Event[], waTasks: WaTask[], waMappings: WaTaskMapping[]): TaskDetail[]
```
Uses `getTasksForState`, enriches each with `getWaTaskBadge` and `getWaTaskTooltip`.

### getEventMatrixWaColumn
```ts
getEventMatrixWaColumn(eventName: string, waTasks: WaTask[], waMappings: WaTaskMapping[]): { taskName: string; alignment: string; colourDot: string } | null
```
Uses `getEventWaContext` for first match, `getWaTaskBadge` for colour.

### getWaTaskFilterOptions
```ts
getWaTaskFilterOptions(waTasks: WaTask[]): { value: string; label: string }[]
```
Maps task names + adds __none__ and __gaps__ special entries.

### filterEventsByWaTask
```ts
filterEventsByWaTask(events: Event[], waTaskFilter: string, waTasks: WaTask[], waMappings: WaTaskMapping[]): Event[]
```
Empty = all, task name = match, __none__ = no mapping, __gaps__ = gap alignment.
