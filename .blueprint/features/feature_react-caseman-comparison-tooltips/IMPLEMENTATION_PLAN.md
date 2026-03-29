# Implementation Plan: react-caseman-comparison-tooltips

**Feature:** react-caseman-comparison-tooltips
**Date:** 2026-03-29

## Files to create / modify

| File | Action |
|------|--------|
| `app/caseman-comparison/Tooltip.tsx` | Create |
| `app/caseman-comparison/page.tsx` | Modify |
| `app/caseman-comparison/EventsTab.tsx` | Modify |
| `app/caseman-comparison/StatesTab.tsx` | Modify |
| `app/caseman-comparison/TasksTab.tsx` | Modify |

## Step 1 — Create `Tooltip.tsx`

Props: `{ content: string; children: React.ReactNode; position?: 'top' | 'bottom' }`.

Pattern: outer `<span className="relative inline-flex group">`, inner tooltip `<div>` with `invisible group-hover:visible`, `role="tooltip"`, `aria-describedby` on the trigger. Position classes: `bottom-full mb-1.5` (top) or `top-full mt-1.5` (bottom). No `useState`, no `'use client'` directive needed.

## Step 2 — `page.tsx` (Tooltips 1)

Import `Tooltip` and `getTooltipText`. In `SummaryCard`, wrap the label text in `<Tooltip content={getTooltipText(labelKey)}>` for "Covered", "Partial", and "Gap" only. "Total Events" card unchanged.

## Step 3 — `EventsTab.tsx` (Tooltips 3, 4, 9, 10)

Import `Tooltip` and `getTooltipText`.

- **Tooltip 3 (italic-rows icon):** Add `<Tooltip content={getTooltipText('italicRows')} position="bottom"><span>ⓘ</span></Tooltip>` next to the events count span.
- **Tooltip 4 (Export button):** Wrap the existing `<button>` in `<Tooltip content={getTooltipText('exportJson')} position="bottom">`.
- **Tooltip 9 (Source: auto):** In `DetailPanel`, conditionally wrap the source `<p>` — `row.source === 'auto'` wraps with `<Tooltip content={getTooltipText('sourceAuto')}>`, otherwise render `<p>` unwrapped.
- **Tooltip 10 (Unclassified option):** Add `title={getTooltipText('unclassifiedOption')}` directly on `<option value="Unclassified">`. No `<Tooltip>` component (native `<option>` limitation; noted in code comment).

## Step 4 — `StatesTab.tsx` (Tooltips 5, 6)

Import `Tooltip` and `getTooltipText`. DOM refs on SVG line targets must not be moved.

- **Tooltip 5 ("New" badge):** Wrap the "New" `<span>` in `<Tooltip content={getTooltipText('badgeNew')}>`. Keep all existing class names and `ref` attributes on the inner span intact.
- **Tooltip 6 ("No match" badge):** Same pattern with `getTooltipText('badgeNoMatch')`.

## Step 5 — `TasksTab.tsx` (Tooltips 7, 8)

Import `Tooltip`, `getTooltipText`, and `buildDomainTooltip` from `src/ui-caseman-tooltips/index.js`.

- **Tooltip 7 (domain blocks):** Replace the bare `title` attribute on each domain block `<div>` with a `<Tooltip>` wrapper using `className="contents"` to preserve flex sizing. Build content inline: `buildDomainTooltip(domain, count, waTaskNames)` where `waTaskNames` is derived from `waTasks` filtered by `taskDomains[task.id].has(domain)`.
- **Tooltip 8 (Unclassified block):** Branch on `domain === 'Unclassified'` — use `getTooltipText('unclassifiedBlock')` as content instead of `buildDomainTooltip`.

## Verification

Run `node --test` after each step. All 16 existing tests must continue to pass. No new logic tests are needed.
