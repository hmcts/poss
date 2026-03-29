## Handoff Summary
**For:** Codey
**Feature:** wa-task-toggles

### Key Decisions
- Tests are pure-function, no DOM/React -- mirrors the pattern in `test/feature_react-digital-twin-wa.test.js`
- Mock events use real WA-mapped event names from `data/wa-mappings.json` (Case Issued, Respond to Claim, Make an application, Upload your documents, Transfer Case, Allocate hearing centre, Create case flags)
- Transfer Case is the canonical "unmapped event" used to verify pass-through behaviour
- Tests import six functions total: `computeEffectiveEnabledEvents`, `isEventBlockedByTasks`, `getDisabledTaskCount`, `getTaskToggleState`, `getEventBlockedReason`, `getEffectiveDisabledCount`
- All six must be exported from `src/ui-wa-tasks/digital-twin-helpers.js` (the .ts source and .js bridge)
- `getTaskToggleState(taskId, disabledTasks, enabledEvents)` returns `{ checked: boolean, interactive: boolean }`
- `getEventBlockedReason(eventId, eventName, enabledEvents, disabledTasks, waTasks, waMappings)` returns `'event-disabled' | 'all-tasks-disabled' | null`
- `getEffectiveDisabledCount(enabledEvents, disabledTasks, allEvents, waTasks, waMappings, showWaTasks)` returns `number`

### Files Created
- `test/artifacts/feature_wa-task-toggles/test-spec.md` (pre-existing)
- `test/feature_wa-task-toggles.test.js`
- `.blueprint/features/feature_wa-task-toggles/handoff-nigel.md`

### Open Questions
- None

### Critical Context
Codey needs to implement the following functions in `src/ui-wa-tasks/digital-twin-helpers.ts` and re-export them via the `.js` bridge:

1. **`computeEffectiveEnabledEvents(enabledEvents, disabledTasks, events, waTasks, waMappings, showWaTasks)`** -- Returns a `Set<string>` of effective event IDs. When `showWaTasks` is false or `disabledTasks` is empty, returns `enabledEvents` unchanged. Otherwise, for each event in `enabledEvents` that has WA task mappings, checks whether ALL mapped tasks are in `disabledTasks`; if so, removes that event from the result.

2. **`isEventBlockedByTasks(eventName, disabledTasks, waTasks, waMappings)`** -- Returns `true` if the event has WA task mappings and ALL mapped task IDs are in `disabledTasks`.

3. **`getDisabledTaskCount(disabledTasks)`** -- Returns `disabledTasks.size`.

4. **`getTaskToggleState(taskId, disabledTasks, enabledEvents)`** -- Returns `{ checked: !disabledTasks.has(taskId), interactive: /* true if parent event is in enabledEvents */ }`. The `interactive` field requires resolving which event(s) map to the task and checking at least one is enabled. The test passes `enabledEvents` as the full set of event IDs when the parent event is enabled.

5. **`getEventBlockedReason(eventId, eventName, enabledEvents, disabledTasks, waTasks, waMappings)`** -- Returns `'event-disabled'` if `eventId` is not in `enabledEvents`; `'all-tasks-disabled'` if the event is enabled but all its WA tasks are disabled; `null` otherwise.

6. **`getEffectiveDisabledCount(enabledEvents, disabledTasks, allEvents, waTasks, waMappings, showWaTasks)`** -- Counts how many events in `allEvents` are NOT in the effective enabled set. Uses `computeEffectiveEnabledEvents` internally.

The existing `getTasksForEvent(eventName, waMappings, waTasks)` from `src/wa-task-engine/index.ts` is the key dependency for resolving event-to-task mappings. All new functions should use it rather than querying mappings directly.

Run tests with: `node --test test/feature_wa-task-toggles.test.js`
