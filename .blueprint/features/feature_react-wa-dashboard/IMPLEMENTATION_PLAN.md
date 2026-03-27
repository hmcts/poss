# Implementation Plan -- react-wa-dashboard

## Files to Create
1. `src/ui-wa-tasks/dashboard-helpers.ts` -- 7 pure helper functions
2. `src/ui-wa-tasks/dashboard-helpers.js` -- bridge file re-exporting from .ts
3. `app/work-allocation/page.tsx` -- React page for /work-allocation route

## Files to Modify
4. `src/app-shell/index.ts` -- add `/work-allocation` to ROUTES array

## Implementation Order
1. Create dashboard-helpers.ts with all 7 functions
2. Create dashboard-helpers.js bridge
3. Run tests to verify
4. Add route to app-shell ROUTES
5. Create work-allocation page.tsx
