# Story: Shared Tooltip Component

**Feature:** react-caseman-comparison-tooltips
**File:** `app/caseman-comparison/Tooltip.tsx`
**Priority:** P3 — foundational; all other tooltip stories depend on this

---

## User Story

As a developer adding contextual help to the Caseman Comparison page,
I want a shared, zero-dependency Tooltip component,
so that I can wrap any trigger element and show a styled tooltip on hover without duplicating markup or importing an external library.

---

## Acceptance Criteria

**AC1 — Renders children with a visible tooltip on hover**
Given a `<Tooltip content="some text">` wrapping a label,
when the user hovers the label,
then a styled tooltip bubble appears containing "some text" with dark background and readable text.

**AC2 — Supports top and bottom positioning**
Given `position='top'` (default) or `position='bottom'` is passed,
when the tooltip is visible,
then it appears above or below the trigger element respectively, centred horizontally.

**AC3 — Hidden when not hovered**
Given the tooltip is rendered on the page,
when the user is not hovering the trigger,
then the tooltip text is not visible (CSS visibility hidden, not removed from DOM).

**AC4 — Accessible markup**
Given the Tooltip is rendered,
when the DOM is inspected,
then the tooltip div carries `role="tooltip"` and the trigger element carries a matching `aria-describedby`.

**AC5 — No JS state or external library**
Given the component is rendered in a server or client context,
when it mounts,
then it uses only Tailwind `group-hover` classes for visibility — no `useState`, no third-party tooltip package.

---

## Out of Scope

- Animation or fade transitions
- Click-to-open or keyboard-triggered tooltips
- Mobile / touch support
- Placement variants beyond `top` and `bottom` (e.g. left, right, auto-flip)
- Coverage % tooltip (deferred — the % figure is not currently rendered in the summary row)
