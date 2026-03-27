# Test Specification -- wa-task-engine

## Feature Under Test
Pure query functions that resolve WA tasks for events/states, summarise alignment, and filter by context.

## Module Under Test
`src/wa-task-engine/index.js` -- 7 exported functions

## Test Data
- `data/wa-tasks.json` (17 tasks: 7 aligned, 9 partial, 1 gap)
- `data/wa-mappings.json` (17 mappings, 1:1 with tasks)

## Stories and AC Coverage

### Story 1: Event-Level Resolution (6 ACs)
| AC | Test ID | What it verifies |
|----|---------|------------------|
| AC-1 | EV-1 | getTasksForEvent("Case Issued") returns wa-task-01 |
| AC-2 | EV-2 | getTasksForEvent("Make an application") returns 3 tasks (06, 07, 08) |
| AC-3 | EV-3 | Unknown event returns [] |
| AC-4 | EV-4 | Case-sensitive matching ("case issued" returns []) |
| AC-5 | EV-5 | getEventWaContext("Upload your documents") returns task, alignment, notes |
| AC-6 | EV-6 | getEventWaContext for unmapped event returns null |

### Story 2: State-Level Resolution (5 ACs)
| AC | Test ID | What it verifies |
|----|---------|------------------|
| AC-1 | ST-1 | State with WA-triggering events returns non-empty result |
| AC-2 | ST-2 | Deduplication by WaTask.id (same task via 2 events appears once) |
| AC-3 | ST-3 | State with no WA events returns [] |
| AC-4 | ST-4 | Unknown state ID returns [] |
| AC-5 | ST-5 | Multiple different tasks at one state all returned |

### Story 3: Alignment Queries (6 ACs)
| AC | Test ID | What it verifies |
|----|---------|------------------|
| AC-1 | AL-1 | getAlignmentSummary returns { aligned: 7, partial: 9, gap: 1 } |
| AC-2 | AL-2 | aligned + partial + gap === 17 |
| AC-3 | AL-3 | getUnmappedTasks returns exactly wa-task-17 |
| AC-4 | AL-4 | getPartialTasks returns 9 items with task and missing fields |
| AC-5 | AL-5 | Specific alignmentNotes for wa-task-04 and wa-task-16 |
| AC-6 | AL-6 | Empty tasks array produces zero counts and empty results |

### Story 4: Context Filtering (6 ACs)
| AC | Test ID | What it verifies |
|----|---------|------------------|
| AC-1 | CF-1 | filterTasksByContext('gen-app') returns 4 tasks |
| AC-2 | CF-2 | filterTasksByContext('general') returns 6 tasks |
| AC-3 | CF-3 | filterTasksByContext('claim') returns 3 tasks |
| AC-4 | CF-4 | filterTasksByContext('counterclaim') returns 2 tasks |
| AC-5 | CF-5 | filterTasksByContext('claim-counterclaim') returns 2 tasks |
| AC-6 | CF-6 | Empty tasks array returns [] |

## Ambiguities Exposed by Tests

1. **getEventWaContext with multi-mapping events:** "Upload your documents" maps to 4 tasks (09-12). The AC says it returns a single object. Which mapping/task is returned? The function signature suggests one result per event, but the data has 4 mappings for that event. Tests assert at least one valid result is returned -- implementation must decide first-match or error.

2. **getAlignmentSummary signature:** Takes (tasks, mappings) but alignment counts come solely from `task.alignment`. The mappings parameter appears unused for counting. Tests verify counts from tasks only -- mappings parameter may be for future use or is redundant.

3. **getPartialTasks mapping lookup:** Each partial task needs its corresponding mapping's alignmentNotes. The lookup is by waTaskId. If a task had multiple mappings (future scenario), which alignmentNotes wins? Tests assert against current 1:1 data.

4. **getTasksForState event filtering:** The events parameter needs a way to associate events with states. The story says "events are filtered by state using their state association" but does not specify the field name (state? stateId? stateName?). Tests use mock events with a `state` field.

5. **Return order:** No story specifies ordering of returned arrays. Tests use set-like comparisons (sorted ID arrays) rather than asserting insertion order.

## Total: 23 tests covering 23 ACs (100%)
