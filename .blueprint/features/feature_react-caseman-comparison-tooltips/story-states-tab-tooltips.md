# Story: States Tab Badge Tooltips

**Feature:** react-caseman-comparison-tooltips
**File:** `app/caseman-comparison/StatesTab.tsx`
**Tooltips:** #5 "New" amber badge; #6 "No match" badge

---

## User Story

As a business analyst reviewing the state mapping between Caseman and the new service,
I want hover tooltips on the "New" and "No match" badges in the States tab,
so that I understand immediately what each badge means without consulting separate documentation.

---

## Acceptance Criteria

**AC1 — "New" badge shows tooltip on hover**
Given I am on the States tab and a new service state has no matching Caseman status,
when I hover the amber "New" badge,
then I see the tooltip: *"Exists in new service model only — may be new functionality or a finer-grained breakdown of a Caseman status."*

**AC2 — "No match" badge shows tooltip on hover**
Given I am on the States tab and a Caseman status has no matching new service state,
when I hover the "No match" badge,
then I see the tooltip: *"No similar-named new service state found. May be a genuine gap or simply a naming difference."*

**AC3 — Tooltips appear above the badges**
Given either badge tooltip is triggered,
when the tooltip is visible,
then it renders with `position='top'` — above the badge, centred horizontally.

**AC4 — SVG connection lines are unaffected**
Given the badge spans are wrapped in a Tooltip component,
when the States tab renders,
then the SVG connection lines between matched states continue to render correctly and all DOM refs remain intact.

**AC5 — Badges are hidden when not hovered**
Given the States tab is rendered,
when I am not hovering a badge,
then no tooltip text is visible on screen.

---

## Out of Scope

- Changes to badge colour or label text
- Changes to matching logic or state data
- Tooltips on matched-state rows (only unmatched badges are in scope)
- Keyboard or click interaction with badges
