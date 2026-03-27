# Story -- WA Event Enrichment

## User story

As a downstream React component, I want events and available actions enriched with optional WA task display metadata so that I can render WA task badges and tooltips alongside events without additional query logic.

---

## Context / scope

- Layer 2 (UI orchestration) functions: `enrichEventWithWaTask` and `enrichAvailableActions`
- Follows the additive enrichment pattern established by `ui-case-walk`'s `EnrichedEvent` (which adds `indicator`)
- This module's enriched type is `WaEnrichedEvent` to avoid name collision with ui-case-walk's `EnrichedEvent`
- Enrichment delegates to `getEventWaContext` from wa-task-engine for resolution
- All original `Event` fields are preserved; a `waTask` property is added (or `undefined` if no mapping exists)
- `enrichAvailableActions` is a batch wrapper that maps over an array of events
- Composition of both enrichment layers (uncertainty + WA) is left to the React layer

---

## Acceptance criteria

**AC-1 -- Event with WA mapping is enriched with waTask metadata**
- Given an event with `name: "Case Issued"` and the full mappings and tasks arrays,
- When `enrichEventWithWaTask(event, mappings, tasks)` is called,
- Then the returned `WaEnrichedEvent` contains all original event fields plus a `waTask` property with `taskName: "New Claim -- Listing required"`, `alignment: "aligned"`, and a non-empty `notes` string.

**AC-2 -- Event without WA mapping has waTask undefined**
- Given an event with a name that has no entry in the mappings array (e.g. `"Transfer Case"`),
- When `enrichEventWithWaTask(event, mappings, tasks)` is called,
- Then the returned object contains all original event fields and `waTask` is `undefined`.

**AC-3 -- Original event fields are never removed or modified**
- Given any event object with fields `id`, `name`, `state`, `actors`, etc.,
- When `enrichEventWithWaTask` is called,
- Then every field from the original event is present in the returned object with identical values (additive enrichment, not destructive).

**AC-4 -- Batch enrichment returns WaEnrichedEvent for every input action**
- Given an array of 5 event/action objects and the full mappings and tasks arrays,
- When `enrichAvailableActions(actions, mappings, tasks)` is called,
- Then it returns an array of exactly 5 `WaEnrichedEvent` objects, one per input, each with the correct `waTask` value (present or `undefined`).

**AC-5 -- Batch enrichment with empty input returns empty array**
- Given an empty array of actions,
- When `enrichAvailableActions([], mappings, tasks)` is called,
- Then it returns an empty array `[]`.

**AC-6 -- WaEnrichedEvent type is distinct from ui-case-walk EnrichedEvent**
- Given the module's exported types,
- When a consumer imports `WaEnrichedEvent` from `ui-wa-tasks`,
- Then it is a separate type from `EnrichedEvent` in `ui-case-walk`, extending `Event` with a `waTask` property rather than an `indicator` property.

---

## Out of scope

- Composing WA enrichment with uncertainty enrichment (that is the React layer's responsibility)
- Re-implementing event-to-task resolution logic (delegates to wa-task-engine)
- Modifying the original `Event` type or wa-task-engine functions
- DOM rendering or React component logic
