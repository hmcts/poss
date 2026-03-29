# Story: About Panel — State Explorer

## User Story
As a **case worker or BA** using the State Explorer,
I want to understand what each visual element on the graph means,
so that I can correctly interpret state colours, edge styles, completeness badges, and WA task badges without needing external documentation.

## Acceptance Criteria

- [ ] An "About this page" toggle button appears directly below the State Explorer page title/subtitle
- [ ] The panel is collapsed by default
- [ ] Clicking the toggle opens/closes the panel with a rotating chevron
- [ ] The panel contains at least six sections (What this page does, Graph layout, Node colour, Completeness badge, WA task badge, Edge style)
- [ ] Each section has an h3 heading and descriptive paragraph text
- [ ] The panel uses Tailwind dark theme (slate-900/40 background, border-slate-700/30 border)
- [ ] Content strings are imported from `src/ui-about-state-explorer/index.js`, not inlined in JSX
- [ ] The About panel does not affect the graph layout, legend, or detail panel

## Design Notes
- Follow the exact visual pattern from `app/caseman-comparison/page.tsx` AboutPanel
- The page header area must be restructured to accommodate the panel below the subtitle
- Place the panel between the subtitle `<p>` and the graph/sidebar layout
