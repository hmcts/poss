# Story: Dashboard Summary Cards and Alignment Tables

**Feature:** react-wa-dashboard
**Priority:** P2
**Effort:** M

## Narrative
As an HMCTS business analyst, I want to see a summary of WA task alignment and browse aligned/partial/gap tables on the Work Allocation dashboard, so I can quickly understand the overall alignment status and drill into each category.

## Acceptance Criteria

### AC-1: Summary counts are correct
**Given** the dashboard loads with the 17 WA tasks
**When** the summary cards render
**Then** total = 17, aligned = 7, partial = 9, gap = 1

### AC-2: Percentages are calculated correctly
**Given** the dashboard summary
**When** percentages are computed
**Then** alignedPct = round(7/17 * 100, 1), partialPct = round(9/17 * 100, 1), gapPct = round(1/17 * 100, 1)

### AC-3: Aligned table has correct rows
**Given** the aligned tasks data
**When** rows are generated
**Then** 7 rows appear, each with taskName, triggerDescription, matchedEvents (from mapping eventIds), and alignment = 'aligned'

### AC-4: Partial table has correct rows with missing explanation
**Given** the partial tasks data
**When** rows are generated
**Then** 9 rows appear, each with taskName, triggerDescription, matchedEvents, and a non-empty `missing` field from alignmentNotes

### AC-5: Gap table has correct rows with recommendation
**Given** the gap tasks data
**When** rows are generated
**Then** 1 row appears for "Review Failed Payment" with an empty matchedEvents array and a non-empty `recommendation` field

### AC-6: Each row includes alignment badge data
**Given** any task row
**When** rendered
**Then** badge includes label ('Aligned'/'Partial'/'Gap') and colour (green/amber/red)

### AC-7: Empty data returns safe defaults
**Given** empty task and mapping arrays
**When** summary is computed
**Then** all counts are 0 and percentages are 0
