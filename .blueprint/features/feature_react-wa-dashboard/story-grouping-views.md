# Story: By State and By Context Grouping Views

**Feature:** react-wa-dashboard
**Priority:** P2
**Effort:** S

## Narrative
As an HMCTS business analyst, I want to view WA tasks grouped by state or by context, so I can understand which tasks apply at each process stage and which tasks relate to each claim context.

## Acceptance Criteria

### AC-1: By Context groups tasks correctly
**Given** the 17 WA tasks
**When** grouped by context
**Then** groups are: claim (3 tasks), counterclaim (2 tasks), gen-app (4 tasks), claim-counterclaim (2 tasks), general (6 tasks)

### AC-2: By Context covers all tasks
**Given** the context grouping result
**When** all group sizes are summed
**Then** total equals 17

### AC-3: By State groups tasks by event states
**Given** WA tasks, mappings, and event data
**When** grouped by state
**Then** each state key maps to an array of tasks whose mapped events appear at that state

### AC-4: By State handles empty event data
**Given** empty events array
**When** state grouping is attempted
**Then** result is an empty object (no states)

### AC-5: Tasks appearing at multiple states appear under each state
**Given** a task mapped to events at multiple states
**When** state grouping is computed
**Then** the task appears under each relevant state
