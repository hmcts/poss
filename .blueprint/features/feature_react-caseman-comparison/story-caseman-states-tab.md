# Story: caseman-states-tab

## User Story

As a Business Analyst reviewing legacy coverage,
I want a States tab that shows Caseman's 6 case statuses side-by-side with the new service's states for the selected claim type, with SVG connection lines linking matched pairs,
so that I can immediately see which legacy statuses map to the new model and which are gaps.

---

## Acceptance Criteria

### AC1 — Tab renders both state lists and a claim type selector

**Given** the user navigates to `/caseman-comparison` and selects the States tab

**When** the tab loads

**Then**:
- A claim type selector is displayed at the top of the tab
- The left column lists all 6 Caseman case statuses: `NULL (active)`, `PAID`, `SETTLED`, `SETTLED/WDRN`, `STAYED`, and the empty-string stay-lifted status
- The right column lists the new service states for the currently selected claim type

---

### AC2 — SVG connection lines link auto-matched state pairs

**Given** the auto-match algorithm has derived at least one matched pair between a Caseman status and a new service state

**When** the States tab is visible

**Then** an SVG line connects the matched Caseman status on the left to its matched new service state on the right; each line is visually distinct (e.g. coloured or labelled); and no line is drawn for unmatched statuses.

---

### AC3 — Unmatched Caseman statuses show a red gap indicator

**Given** a Caseman status that has no auto-derived or curated match to any new service state

**When** the States tab renders

**Then** a red gap indicator is displayed to the left of (or alongside) that Caseman status row, clearly distinguishing it from matched rows.

---

### AC4 — Unmatched new service states show an amber indicator

**Given** a new service state that has no corresponding Caseman status mapping

**When** the States tab renders

**Then** an amber indicator is displayed alongside that new service state, signalling that it represents capability beyond the legacy model.

---

### AC5 — Claim type selector changes the right-hand state list

**Given** the States tab is visible with claim type A selected

**When** the user selects a different claim type B from the selector

**Then** the right-hand state list updates to show the states for claim type B, the SVG connection lines redraw to reflect the new matches, and the gap and amber indicators update accordingly.

---

### AC6 — Summary card shows matched, gap, and amber counts

**Given** the States tab has computed matches for the selected claim type

**When** the tab renders

**Then** a summary card at the top of the tab shows: total Caseman statuses (6), matched count, unmatched-Caseman (gap) count, and unmatched-new-service (amber) count.

---

## Out of Scope

- Editing state mappings in-browser (States tab is read-only)
- Exporting States tab data (no CSV or JSON export for this tab)
- Pagination or scrolling within the state lists
- Rendering more than one claim type's states simultaneously
