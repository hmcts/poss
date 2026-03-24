## Handoff Summary
**For:** Nigel (skipping Cass — technical/infrastructure feature)
**Feature:** app-shell

### Key Decisions
- Dark mode is the default; toggle persists to `localStorage`
- `/` redirects to `/state-explorer` as the default route
- Claim type selector writes to Zustand `activeClaimType` (from `src/data-model/store.ts`)
- Digital Twin has nested sub-routes (`/digital-twin/case-walk`, `/digital-twin/scenario-analysis`)
- Placeholder pages render mode name + active claim type — no real content yet

### Files Created
- `.blueprint/features/feature_app-shell/FEATURE_SPEC.md`

### Open Questions
- None

### Critical Context
Nigel should write tests covering: (1) route existence and navigation between all 5 routes, (2) default redirect from `/` to `/state-explorer`, (3) claim type selector renders 7 options from `ClaimTypeId` enum and updates Zustand store, (4) dark mode toggle switches theme class and persists preference, (5) layout renders sidebar nav + top bar on every route, (6) Zustand provider wraps the app and `activeClaimType` defaults to `null`. Reference enums at `src/data-model/enums.ts` and store at `src/data-model/store.ts`.
