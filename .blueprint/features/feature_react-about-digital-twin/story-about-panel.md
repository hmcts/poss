# Story: About Panel — Digital Twin Page

## User Story
As a product analyst or developer using the Digital Twin simulation,
I want an expandable panel that explains the page's assumptions and limitations,
so that I do not misinterpret model gaps as definitive process statements.

## Acceptance Criteria

1. An "About this page" toggle button appears directly below the Digital Twin page subtitle.
2. The panel is collapsed by default on page load.
3. Clicking the button opens the panel; clicking again closes it.
4. A chevron icon rotates 180° when the panel is open.
5. The panel contains six sections with the following headings:
   - What this page does
   - Available events assumption
   - Dead-end detection assumption
   - Auto-walk assumption
   - WA task cards assumption
   - Role filter assumption
6. Each section has a non-empty paragraph of explanatory text.
7. Styling matches the About panel on the Caseman Comparison page (slate dark theme).

## Implementation Notes
- Component: inline `AboutPanel` function in `app/digital-twin/page.tsx`
- Content: imported from `src/ui-about-digital-twin/index.js`
- Pattern: mirrors `AboutPanel` in `app/caseman-comparison/page.tsx`
- Placement: inside the existing `space-y-3` header div, after the subtitle `<p>`
