# Feature Spec: react-caseman-comparison-tooltips

**Slug:** react-caseman-comparison-tooltips
**Priority:** P3
**Effort:** S (< 1 hour)
**Status:** Ready
**Author:** Alex (System Specification Agent)
**Date:** 2026-03-29

---

## Summary

Add 10 contextual tooltips across the Caseman Comparison page (`/caseman-comparison`) to help both technical users and business analysts understand coverage scores, the auto-match methodology, and the BA editing workflow. This is a pure UI enhancement — no logic modules, no data files, no new routes.

---

## Scope

### Files modified (4 existing + 1 new)

| File | Change |
|------|--------|
| `app/caseman-comparison/Tooltip.tsx` | **New** — shared lightweight Tooltip component |
| `app/caseman-comparison/page.tsx` | Tooltips on summary cards (Covered/Partial/Gap) and coverage % |
| `app/caseman-comparison/EventsTab.tsx` | Tooltips on italic-rows legend icon, Export Mappings JSON button, Source: auto label, and Unclassified domain filter option |
| `app/caseman-comparison/StatesTab.tsx` | Tooltips on "New" badge and "No match" badge |
| `app/caseman-comparison/TasksTab.tsx` | Tooltips on domain blocks (hover) and "Unclassified" block |

No other files are touched.

---

## Tooltip Component — `app/caseman-comparison/Tooltip.tsx`

A lightweight, zero-dependency component. No external tooltip library.

### Contract

```tsx
interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom'; // default 'top'
}

export default function Tooltip({ content, children, position = 'top' }: TooltipProps)
```

### Implementation pattern

Wrap children in a `<span>` with `relative inline-flex group` classes. The tooltip text lives in an absolutely positioned `<div>` that is `invisible group-hover:visible`. The positioning div uses:
- `absolute z-50 w-max max-w-xs`
- `px-2.5 py-1.5 text-xs text-slate-200 bg-slate-800 border border-slate-700/60 rounded-lg shadow-lg`
- `whitespace-normal leading-relaxed`
- For `position='top'`: `bottom-full mb-1.5 left-1/2 -translate-x-1/2`
- For `position='bottom'`: `top-full mt-1.5 left-1/2 -translate-x-1/2`

No animation, no JS state — pure CSS `visibility` toggle via Tailwind group-hover. Keep it accessible: add `role="tooltip"` to the tooltip div and `aria-describedby` on the trigger element.

### When to use the Tooltip component vs `title` attribute

| Use `title` | Use `<Tooltip>` |
|-------------|-----------------|
| Plain text on non-interactive text spans | Buttons (native `title` unreliable on some browsers) |
| Read-only value labels | Badges (small click targets) |
| Low-priority explanatory text | Content with punctuation or special characters |

---

## Tooltip Inventory

### Tooltip 1 — Summary cards: Covered, Partial, Gap (page.tsx)

**Location:** `SummaryCard` component in `page.tsx`. The three cards with labels "Covered", "Partial", "Gap".

**Trigger:** Hover on the card label text.

**Implementation:** Wrap each card's `label` text in `<Tooltip>`. Pass the label as children and the threshold explanation as content.

| Card label | Tooltip content |
|------------|-----------------|
| `Covered` | `"Similarity > 0.8 — near-identical event name wording."` |
| `Partial` | `"Similarity 0.5–0.8 — related events but different granularity or phrasing."` |
| `Gap` | `"Similarity < 0.5 — no close match found in the new service model."` |

The "Total Events" card receives no tooltip.

### Tooltip 2 — Coverage % figure (page.tsx)

**Location:** `SummaryCard` does not show a coverage % — the % is not currently rendered in the summary cards row. The coverage formula is only mentioned inside the `AboutPanel`. No change needed here — the formula is already surfaced in the collapsible About panel. **Skip this tooltip** unless the coverage % is added as a visible figure in a future iteration.

> **Clarification note:** The backlog references a "Coverage %" tooltip target. Inspecting `page.tsx`, the four summary cards show raw counts (Total, Covered, Partial, Gap) — there is no rendered coverage `%` element outside the `AboutPanel`. The tooltip for the formula should be applied **if and when** a coverage % figure is added to the summary row. As of this spec, the About panel already documents the formula. This tooltip is deferred; the other 9 proceed.

### Tooltip 3 — Italic rows legend icon (EventsTab.tsx)

**Location:** The filter bar in `EventsTab`, near the `{sorted.length} events` count span (line 140 in `EventsTab.tsx`).

**Trigger:** Hover on a new ⓘ icon (`ⓘ` unicode or an SVG info icon) placed immediately before or after the events count.

**Implementation:** Add a `<Tooltip>` wrapping a small `ⓘ` character next to the event count span. Use `position='bottom'` so it drops below the filter bar.

**Content (verbatim):**
> `"Italic rows are auto-derived by name similarity. Normal weight = manually curated by a BA. Click any row to edit."`

### Tooltip 4 — "Export Mappings JSON" button (EventsTab.tsx)

**Location:** The "Export Mappings JSON" `<button>` in the header row of `EventsTab` (line 98–102).

**Trigger:** Hover on the button.

**Implementation:** Wrap the button element in `<Tooltip>`. Use `position='bottom'` so the tooltip drops below the toolbar.

**Content (verbatim):**
> `"Downloads in-session edits as caseman-mappings.json. Commit to repo to make curated mappings the new team baseline."`

### Tooltip 5 — States tab "New" badge (StatesTab.tsx)

**Location:** The `<span>` badge labelled "New" on unmatched right-column service state rows (line 249–253 in `StatesTab.tsx`). Currently the badge shows the text "New".

**Trigger:** Hover on the "New" badge span.

**Implementation:** Wrap the badge span in `<Tooltip>`. Use `position='top'`.

**Content (verbatim):**
> `"Exists in new service model only — may be new functionality or a finer-grained breakdown of a Caseman status."`

### Tooltip 6 — States tab "No match" badge (StatesTab.tsx)

**Location:** The `<span>` badge labelled "No match" on unmatched left-column Caseman status rows (line 208–213 in `StatesTab.tsx`).

**Trigger:** Hover on the "No match" badge span.

**Implementation:** Wrap the badge span in `<Tooltip>`. Use `position='top'`.

**Content (verbatim):**
> `"No similar-named new service state found. May be a genuine gap or simply a naming difference."`

### Tooltip 7 — Tasks tab domain blocks on hover (TasksTab.tsx)

**Location:** Each domain block `<div>` in the proportional block chart (line 192–212 in `TasksTab.tsx`). These blocks already carry a `title` attribute with partial info.

**Trigger:** Hover on any domain block.

**Implementation:** Replace the existing bare `title` attribute with a `<Tooltip>` wrapping the block's inner content. Build the tooltip content string dynamically from:
- Domain name
- Event count
- Names of WA tasks that cover this domain (from `waTasks` filtered by `taskDomains[task.id].has(domain)`) or "No WA tasks" if none

Example rendered content:
> `"Issue: 24 events — WA tasks: Review Defendant response, Review application"`

Or if no tasks:
> `"CCBC: 47 events — No WA tasks covering this domain"`

**Note:** The proportional block div currently uses `cursor-default` and `overflow-hidden` — ensure the `<Tooltip>` wrapper preserves the flex layout. Use `className="contents"` on the wrapper or restructure slightly to avoid breaking the `flex` sizing on the domain blocks. The `title` attribute can be removed once the Tooltip is in place.

**Data access:** The `TasksTab` component already has `waTasks`, `waMappings`, and `taskDomains` in scope — pass the pre-computed data to the tooltip content builder inline.

### Tooltip 8 — Tasks tab "Unclassified" block (TasksTab.tsx)

**Location:** The "Unclassified" domain block in the same proportional block chart (same component, `domain === 'Unclassified'`).

**Trigger:** Hover on the Unclassified block.

**Implementation:** Same as Tooltip 7, but override the tooltip content with the verbatim message below regardless of the generic template.

**Content (verbatim):**
> `"413 of 497 Caseman events have no BMS task code and cannot be classified by domain. This is a data quality issue in Caseman's source data, not a gap in the new service."`

### Tooltip 9 — Expanded row "Source: auto" label (EventsTab.tsx)

**Location:** Inside `DetailPanel` in `EventsTab.tsx`. The source value is rendered at line 289: `<p className="mt-0.5 text-slate-300">{row.source}</p>`.

**Trigger:** Hover on the source value text when `row.source === 'auto'`.

**Implementation:** Conditionally wrap the source `<p>` in a `<Tooltip>` only when `row.source === 'auto'`. When `row.source === 'curated'` no tooltip is shown.

**Content (verbatim):**
> `"Classification derived by name similarity. May be inaccurate — click Edit to override."`

### Tooltip 10 — Domain filter "Unclassified" option (EventsTab.tsx)

**Location:** The domain `<select>` in `EventsTab.tsx` filter bar (line 119–130). The options are rendered from `domains`.

**Implementation note:** Native `<option>` elements do not reliably support hover tooltips across browsers. The `title` attribute on `<option>` is browser-dependent and often ignored.

**Recommended approach:** Add a static `<span>` or small `<abbr>` element with a `title` attribute adjacent to the select, visible only when `domainFilter === 'Unclassified'` is selected. Alternatively, add a `title` attribute directly to the `<option value="Unclassified">` element as a best-effort fallback (supported in most desktop browsers). For this S-effort feature, use the `title` attribute on the `<option>` element with a note in code that richer behaviour is deferred.

**Content (verbatim):**
> `"Events with no BMS task code. Represents 83% of all events."`

---

## Implementation Order

Implement in priority order to allow partial delivery:

1. `Tooltip.tsx` — create the shared component first (all others depend on it)
2. Tooltips 3, 4 — EventsTab italic-rows icon and Export Mappings JSON (high priority)
3. Tooltips 1 — page.tsx summary cards (high priority)
4. Tooltips 5, 6 — StatesTab badges (medium priority)
5. Tooltips 7, 8 — TasksTab domain blocks (medium priority)
6. Tooltips 9, 10 — expanded row source label and domain filter option (lower priority)

---

## Constraints

- No external tooltip library. The `Tooltip` component is self-contained.
- No new logic modules. No changes to `src/`.
- No changes to data files.
- No new routes or navigation entries.
- The `Tooltip` component must be importable from all four tab components without circular dependencies (`app/caseman-comparison/Tooltip.tsx` has no imports from the tab files).
- Tailwind classes only — no inline `style` for the tooltip positioning. Existing `style` props on badge spans and domain blocks are unaffected.
- All tooltip content strings are hardcoded — no runtime computation of tooltip text (exception: Tooltip 7 domain block content is built from props already in scope).
- The implementation must not break the existing SVG connection-line logic in `StatesTab.tsx` (DOM refs must remain intact).
- `Tooltip.tsx` is a client component (`'use client'` if hover state requires JS; but since pure CSS group-hover is used, it can be a server component — no `useState` needed).

---

## Acceptance Criteria

1. A `Tooltip.tsx` component exists at `app/caseman-comparison/Tooltip.tsx` with the contract defined above.
2. Hovering "Covered", "Partial", and "Gap" card labels shows their respective threshold tooltips.
3. A ⓘ icon appears next to the events count in the EventsTab filter bar; hovering it shows the italic-rows legend text verbatim.
4. Hovering the "Export Mappings JSON" button shows the BA workflow tooltip verbatim.
5. Hovering the "New" badge on a new service state shows the verbatim explanation.
6. Hovering the "No match" badge on a Caseman status shows the verbatim explanation.
7. Hovering any domain block in the Tasks tab shows the domain name, event count, and covering WA task names (or "No WA tasks").
8. Hovering the "Unclassified" block specifically shows the verbatim data quality message.
9. Hovering the "Source: auto" text in an expanded event row shows the verbatim classification caveat.
10. The "Unclassified" option in the domain filter carries a `title` attribute with the verbatim 83% message.
11. No existing tests break. No new logic tests are needed (pure UI).
12. The SVG connection lines in StatesTab continue to render correctly after the badge changes.
