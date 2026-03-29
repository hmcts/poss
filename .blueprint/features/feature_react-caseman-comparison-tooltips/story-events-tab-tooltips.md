# Story: Events Tab Tooltips

**Feature:** react-caseman-comparison-tooltips
**File:** `app/caseman-comparison/EventsTab.tsx`
**Tooltips:** #9 "Source: auto" label in expanded row; #10 "Unclassified" domain filter option

---

## User Story

As a business analyst editing event mappings,
I want contextual tooltips on the "Source: auto" label in the expanded row detail panel and on the "Unclassified" domain filter option,
so that I understand when a classification is auto-derived and what "Unclassified" represents before I filter to it.

---

## Acceptance Criteria

**AC1 — "Source: auto" label shows tooltip on hover**
Given I expand an event row whose source is "auto",
when I hover the "auto" source text,
then I see the tooltip: *"Classification derived by name similarity. May be inaccurate — click Edit to override."*

**AC2 — "Source: curated" label has no tooltip**
Given I expand an event row whose source is "curated",
when I hover the source text,
then no tooltip appears (tooltip is conditional on `row.source === 'auto'` only).

**AC3 — "Unclassified" domain filter option carries a title attribute**
Given I open the domain filter select in the Events tab filter bar,
when I hover or inspect the "Unclassified" option,
then its `title` attribute reads: *"Events with no BMS task code. Represents 83% of all events."*

**AC4 — Other domain filter options are unaffected**
Given I open the domain filter select,
when I inspect any option other than "Unclassified",
then no `title` attribute is added by this feature.

**AC5 — Filter bar layout is unchanged after adding the ⓘ icon**
Given the ⓘ icon has been added next to the events count in the filter bar,
when the Events tab renders with any domain or source filter applied,
then the filter bar layout remains correct and the existing controls (search, source toggle, domain select) are not displaced.

---

## Out of Scope

- Replacing the `<select>` with a custom dropdown to support richer hover behaviour on options (deferred)
- Tooltips on other source values beyond "auto"
- Changes to filter logic or event data
- Tooltips on the expanded row fields other than source
