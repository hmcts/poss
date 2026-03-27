# Story: CSV Export of Alignment Table

**Feature:** react-wa-dashboard
**Priority:** P2
**Effort:** S

## Narrative
As an HMCTS business analyst, I want to export the WA task alignment table as CSV, so I can share the analysis with colleagues or import it into other tools.

## Acceptance Criteria

### AC-1: CSV header row
**Given** the export function is called
**When** CSV string is generated
**Then** first line is: Task Name,Trigger,Alignment,Matched Events,Alignment Notes

### AC-2: CSV contains all 17 tasks
**Given** all WA tasks and mappings
**When** CSV is generated
**Then** there are exactly 18 lines (1 header + 17 data rows)

### AC-3: Matched events are semicolon-separated within the cell
**Given** a task mapped to multiple events
**When** CSV row is generated
**Then** the Matched Events cell contains event names separated by semicolons

### AC-4: Fields with commas are properly quoted
**Given** any field containing a comma
**When** CSV is generated
**Then** the field is enclosed in double quotes

### AC-5: Empty data produces header-only CSV
**Given** empty task array
**When** CSV is generated
**Then** result is the header row only
