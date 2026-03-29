# Story: About Panel for Work Allocation Dashboard

## User Story
As a user viewing the Work Allocation Dashboard, I want to understand what the page shows, how alignment categories are defined, and what assumptions have been made — so I can correctly interpret the data and avoid drawing false conclusions.

## Acceptance Criteria
- [ ] An expandable "About this page" panel is visible below the page subtitle on the Work Allocation Dashboard
- [ ] The panel is collapsed by default; clicking the header expands/collapses it with a chevron toggle
- [ ] Expanded panel shows four sections with h3 headings:
  1. What this page does
  2. Alignment categories (Aligned / Partial / Gap)
  3. Scope assumption (17 R1A tasks only)
  4. By Context view assumption (context from R1A doc, not event model)
- [ ] Panel styling matches the caseman-comparison AboutPanel pattern (slate-900/40 background, border, chevron SVG, h3 headings)
- [ ] Content is sourced from named constants in `src/ui-about-work-allocation/index.js`

## Implementation Notes
- Copy the exact AboutPanel component structure from `app/caseman-comparison/page.tsx`
- Import `getAboutSection` / `getAboutSections` from `src/ui-about-work-allocation/index.js`
- Insert the panel in the page header div, below the subtitle `<p>` element but before the Export CSV button row
- The panel should span full width (not constrained to the text column)
