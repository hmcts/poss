# Story: About Panel — Action Items

## User Story
As a **BA or analyst** using the Action Items page,
I want to understand where the items come from, how priorities are assigned, and what the scores mean,
so that I can correctly interpret the list and prioritise my analysis and design work.

## Acceptance Criteria

- [ ] An "About this page" toggle button appears directly below the Action Items page subtitle
- [ ] The panel is collapsed by default
- [ ] Clicking the toggle opens/closes the panel with a rotating chevron
- [ ] The panel contains seven sections (What this page does, Two sources, Priority algorithm, Model health score, WA alignment %, Suggestions, Items not persisted)
- [ ] Each section has an h3 heading and descriptive paragraph text
- [ ] The panel uses Tailwind dark theme (slate-900/40 background, border-slate-700/30 border)
- [ ] Content strings are imported from `src/ui-about-action-items/index.js`, not inlined in JSX
- [ ] The About panel does not affect the summary cards, filters, or items table

## Design Notes
- Follow the exact visual pattern from `app/caseman-comparison/page.tsx` AboutPanel
- Place the panel between the page subtitle `<p>` and the summary cards
- The page header area must be restructured to a `space-y-3` column to accommodate the panel
