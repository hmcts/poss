# Story: Summary Card Tooltips

**Feature:** react-caseman-comparison-tooltips
**File:** `app/caseman-comparison/page.tsx`
**Tooltips:** #1 Covered / Partial / Gap card labels; #3 italic-rows legend ⓘ icon; #4 Export Mappings JSON button

---

## User Story

As a business analyst or developer reviewing the Caseman Comparison summary,
I want hover tooltips on the Covered, Partial, and Gap card labels and on the filter-bar controls,
so that I can understand what each coverage band means and how to use the export and italic-row conventions without leaving the page.

---

## Acceptance Criteria

**AC1 — Covered card tooltip**
Given I am on the `/caseman-comparison` page,
when I hover the "Covered" card label,
then I see the tooltip: *"Similarity > 0.8 — near-identical event name wording."*

**AC2 — Partial card tooltip**
Given I am on the `/caseman-comparison` page,
when I hover the "Partial" card label,
then I see the tooltip: *"Similarity 0.5–0.8 — related events but different granularity or phrasing."*

**AC3 — Gap card tooltip**
Given I am on the `/caseman-comparison` page,
when I hover the "Gap" card label,
then I see the tooltip: *"Similarity < 0.5 — no close match found in the new service model."*

**AC4 — Italic-rows legend ⓘ icon**
Given I am on the Events tab filter bar,
when I hover the ⓘ icon next to the events count,
then I see the tooltip: *"Italic rows are auto-derived by name similarity. Normal weight = manually curated by a BA. Click any row to edit."* and the tooltip drops below the filter bar.

**AC5 — Export Mappings JSON button**
Given I am on the Events tab,
when I hover the "Export Mappings JSON" button,
then I see the tooltip: *"Downloads in-session edits as caseman-mappings.json. Commit to repo to make curated mappings the new team baseline."* and it drops below the toolbar.

---

## Out of Scope

- "Total Events" card receives no tooltip
- Coverage % tooltip (deferred — no % figure is currently rendered in the summary row)
- Clicking the ⓘ icon (hover only)
- Export button click behaviour (unchanged)
