# Handoff: react-caseman-comparison-tooltips

**From:** Cass (Story Writer)
**To:** Codey (Implementation)
**Date:** 2026-03-29

## Stories written

| File | Covers |
|------|--------|
| `story-tooltip-component.md` | Shared `Tooltip.tsx` — CSS group-hover, `role="tooltip"`, top/bottom position prop |
| `story-summary-card-tooltips.md` | Covered / Partial / Gap card labels + ⓘ italic-rows legend + Export JSON button |
| `story-states-tab-tooltips.md` | "New" amber badge + "No match" badge; SVG line safety called out |
| `story-tasks-tab-tooltips.md` | Domain blocks (dynamic content) + Unclassified verbatim override; flex layout safety called out |
| `story-events-tab-tooltips.md` | Source: auto conditional tooltip + Unclassified option `title` attribute |

## Key implementation notes for Codey

- Build `Tooltip.tsx` first — all other stories depend on it.
- Tooltip 7 (domain blocks) is the only one with dynamic content; build from `waTasks`/`taskDomains` already in scope — no new data fetching.
- Tooltip 10 (Unclassified option) uses a `title` attribute on `<option>`, not `<Tooltip>` — browser limitation documented in spec.
- Tooltip 2 (coverage %) is explicitly deferred — do not implement.
- Do not touch `src/`, data JSON files, routes, or test files.
- StatesTab: badge wrapper must not displace DOM ref elements used by SVG connection lines.
