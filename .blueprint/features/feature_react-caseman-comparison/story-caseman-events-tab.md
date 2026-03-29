# Story: caseman-events-tab

## User Story

As a Business Analyst reviewing the gap between Caseman and the new service,
I want a filterable Events tab showing all 497 Caseman events with auto-derived coverage badges that I can override inline and then export as either a curated mappings JSON or a CSV,
so that I can progressively curate the alignment baseline and share it with stakeholders.

---

## Acceptance Criteria

### AC1 — Table renders all 497 events with correct default sort and summary cards

**Given** the user navigates to `/caseman-comparison` and selects the Events tab

**When** the tab loads

**Then**:
- The table displays columns: ID | Event Name | Domain | Status badge | New Model Event | Notes
- Rows are sorted gap → partial → covered, then by ID within each group
- Summary cards at the top show: Total (497), Covered count (green), Partial count (amber), Gap count (red), and Coverage % computed as `(covered + partial * 0.5) / 497 * 100`
- `source: "auto"` rows are visually distinguished from `source: "curated"` rows (e.g. italic or faded text)

---

### AC2 — Filters and search narrow the table correctly

**Given** the Events tab is showing all 497 rows

**When** the user selects status filter `"gap"` and domain filter `"Enforcement"`, or enters a text query in the search box

**Then**:
- With status + domain filters active: only rows matching both criteria are shown; the summary cards update to reflect the filtered subset
- With a text query: only rows whose Event Name or Notes contain the query (case-insensitive) are shown
- Clearing all filters restores the full 497-row view

---

### AC3 — Expanding a row shows prerequisites, task codes, and deep links

**Given** a row in the Events table

**When** the user activates the row's expand control (keyboard or pointer)

**Then** the expanded panel shows:
- The event's prerequisite event IDs (if any) from `pre_req_events.csv`
- The event's associated BMS task codes (if any)
- A mapping notes field (read-only in collapsed state, editable in the inline edit form)
- A deep link to `/event-matrix?search={newEventName}` for covered/partial rows that have a `newEventName`, or to `/state-explorer?highlight={newStateName}` for rows that have a `newStateName`; gap rows show no deep link

---

### AC4 — Inline BA editing overrides auto-derived classification

**Given** a row in the Events table (any status)

**When** the user clicks the status badge on that row

**Then** an inline edit form opens on that row containing:
- A status dropdown with options: covered / partial / gap
- A new event name text field
- A notes textarea
- Save and Cancel buttons

**And when** the user changes the status and saves

**Then**:
- The row's badge and new event name update immediately in the table
- The row's `source` changes to `"curated"` and is visually distinguished from auto rows
- The summary cards recalculate to reflect the new counts
- Clicking Cancel discards changes and closes the form without modifying the row

---

### AC5 — "Export Mappings JSON" downloads `caseman-mappings.json` containing all edits

**Given** the BA has made at least one inline edit and saved it

**When** the user clicks "Export Mappings JSON"

**Then**:
- The browser downloads a file named `caseman-mappings.json`
- The file contains an array of `CasemanMapping` objects for every event that has been curated (source: "curated"), each with fields: `casemanEventId`, `status`, `newEventName`, `newStateName`, `notes`, `source: "curated"`
- Auto-derived rows that have not been edited are not included in the export (or may be included with `source: "auto"` — either is acceptable, but curated rows must be present)

---

### AC6 — "Export CSV" downloads a file with the correct columns and all visible rows

**Given** the Events tab is showing a filtered or unfiltered set of rows

**When** the user clicks "Export CSV"

**Then** the browser downloads a `.csv` file whose columns are exactly: `ID, Event Name, Domain, Status, New Model Event, New State, Notes, Source`; the rows correspond to the currently visible (filtered) set; values containing commas or newlines are properly escaped; and the file is named `caseman-events-comparison.csv` (or similar descriptive name).

---

## Out of Scope

- Editing or deleting Caseman source event data
- LLM-assisted or bulk auto-reclassification
- Pagination (497 rows, client-side only)
- Automatically creating Action Items from gap rows (a "View in Action Items" deep link is acceptable if the Action Items page is available, but auto-creation is out of scope)
- Persisting edits to the server or Zustand store (component state only until export)
