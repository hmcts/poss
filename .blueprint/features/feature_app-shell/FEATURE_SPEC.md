# Feature Specification — app-shell

## 1. Feature Intent

The foundational Next.js structure that all other features render within.
- **Problem:** No application exists yet — only a data model and dev environment.
- **Need:** A navigable shell with routing, layout, styling, and store integration so P1 features can render.
- **System alignment:** Implements tech stack (section 9), three-mode structure (section 3), and claim type switching (section 8) from `.blueprint/system_specification/SYSTEM_SPEC.md`.

---

## 2. Scope

### In Scope
- Next.js 15 App Router project with TypeScript
- Tailwind CSS configuration with shadcn/ui component library installed
- Root layout: sidebar navigation (3 modes) + top bar (claim type selector, dark mode toggle)
- App Router routes: `/state-explorer`, `/event-matrix`, `/digital-twin`, `/digital-twin/case-walk`, `/digital-twin/scenario-analysis`
- Dark mode as default, with toggle (Linear/Raycast aesthetic)
- Typography: `font-mono` for technical names, sans-serif for UI labels
- Claim type selector component reading from and writing to Zustand `activeClaimType`
- Zustand store provider wrapping the application (using `src/data-model/store.ts`)
- Placeholder page for each route displaying the mode name
- Dev server on port 3000

### Out of Scope
- Actual mode content (State Explorer rendering, Event Matrix table, Digital Twin simulation)
- Data ingestion or JSON loading
- Authentication (per System Spec section 3 — internal tool)
- React Flow or any visualisation library setup

---

## 3. Actors Involved

**Business Analyst (primary user)**
- Can: Navigate between modes, select a claim type, toggle dark mode
- Cannot: Modify the model, access restricted routes (none exist)

---

## 4. Behaviour Overview

1. User opens the app at `localhost:3000` and is redirected to `/state-explorer` (default route).
2. Sidebar shows three navigation links: State Explorer, Event Matrix, Digital Twin. Active link is visually highlighted.
3. Top bar contains: (a) claim type selector dropdown listing 7 claim types by display name, (b) dark mode toggle.
4. Selecting a claim type updates `activeClaimType` in the Zustand store. All modes read from this shared state.
5. Digital Twin route has two sub-routes: Case Walk and Scenario Analysis, accessible via sub-navigation within the Digital Twin layout.
6. Each route renders a placeholder component showing the mode name and selected claim type.
7. Dark mode is the default. Toggle switches between dark and light themes via Tailwind's `dark` class strategy.

---

## 5. State & Lifecycle Interactions

This feature is **state-creating** for the UI application state only:
- Initialises the Zustand store provider (wrapping `createPossessionsStore` from `src/data-model/store.ts`)
- Sets `activeClaimType` via the claim type selector (defaults to `null` until user selects)
- No domain state machine interaction — this is infrastructure

---

## 6. Rules & Decision Logic

| Rule | Description |
|------|-------------|
| Default route | `/` redirects to `/state-explorer` |
| Claim type list | Derived from `ClaimTypeId` enum in `src/data-model/enums.ts` (7 values) |
| Dark mode default | App loads in dark mode; toggle persists preference to `localStorage` |
| Active nav | Current route determines which sidebar link is highlighted |

---

## 7. Dependencies

| Dependency | Type | Notes |
|------------|------|-------|
| `src/data-model/store.ts` | Internal | Zustand store definition — wrap with React provider |
| `src/data-model/enums.ts` | Internal | `ClaimTypeId` enum for claim type selector options |
| Next.js 15 | Package | App Router, TypeScript |
| Tailwind CSS | Package | Styling framework |
| shadcn/ui | Package | Component library (Button, Select, Toggle, etc.) |
| Zustand | Package | Already a dependency from data-model feature |

---

## 8. Non-Functional Considerations

- **Performance:** Static shell, near-instant. **Port:** 3000 (System Spec section 9).
- **Accessibility:** Semantic HTML nav, keyboard-navigable sidebar, dark/light toggle.
- **Typography:** `font-mono` for technical identifiers; sans-serif for UI text.

---

## 9. Assumptions & Open Questions

- ASSUMPTION: Default claim type is `null` — modes show a prompt state until user selects.
- ASSUMPTION: Digital Twin sub-nav (Case Walk / Scenario Analysis) lives in a nested layout, not the main sidebar.
- ASSUMPTION: shadcn/ui installed via CLI (`npx shadcn-ui@latest init`).
- No open questions — well-defined infrastructure.

---

## 10. Impact on System Specification

This feature **reinforces** existing assumptions. Three-mode structure, no authentication, port 3000, and Zustand all align with System Spec and `.business_context/spec.md`. No contradictions identified.

---

## 11. Handover

Skipping Cass (BA) — technical/infrastructure feature. Handoff goes directly to Nigel (Test Spec Agent).

---

## 12. Change Log (Feature-Level)

| Date | Change | Reason | Raised By |
|------|--------|--------|-----------|
| 2026-03-24 | Initial feature spec created | P0 foundation feature | Alex (System Spec Agent) |
