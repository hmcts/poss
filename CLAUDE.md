# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

HMCTS Possessions Prototype — a Next.js application for visualising and analysing the civil possession case process model: state machines, events, work allocation tasks, and actor roles. It is a decision-support and analysis tool for BAs and designers, not a case management system.

## Development Environment

This project uses a VS Code devcontainer (Docker-in-Docker, privileged). The container provides:
- Node.js LTS (via NVM)
- Docker, Azure CLI, kubectl, helm, minikube, kubelogin
- Playwright for browser testing
- Claude Code and GitHub Copilot CLI

To start the container manually outside VS Code:
```bash
bash .devcontainer/startcontainer.sh
```

## Commands

```bash
npm run dev        # Start Next.js dev server on port 3000
npm run build      # Production build
npm start          # Start production server

# Run all tests (Node built-in test runner — no Jest)
node --test test/

# Run a single test file
node --test test/feature_data-model.test.js
```

There is no lint script configured. Tests use `node:test` and `node:assert/strict` — not Jest or Vitest.

## Architecture

### Four-Layer Pattern

Every feature follows this layer structure — do not skip layers or merge them:

1. **Schema / data-model** (`src/<feature>/`) — Zod schemas, enums, Zustand store slices. Pure TypeScript, no React.
2. **Logic** (`src/<feature>/`) — Pure functions operating on typed data. No side effects, no React.
3. **UI orchestration** (`src/ui-<feature>/`) — Transforms logic output into display-ready structures. No React components, just data shaping.
4. **React components** (`app/<route>/`) — Consumes UI orchestration output. No business logic inline.

Help/explainer text for each feature lives in a separate `src/ui-about-<feature>/` module, not inline in components.

### Bridge File Pattern

Every module has both `index.ts` and `index.js` — the `.js` file re-exports everything from the `.ts` file. This is required for compatibility with the Node test runner (which uses `.js` imports). **Always maintain both files** when adding exports to a module.

### Data Flow

```
.business_context/ docs
        │
        ▼
src/data-ingestion/     ──► data/*.json (static build-time JSON)
        │
        ▼
app/providers.tsx       ──► AppContext (activeClaimType, theme)
        │
        ▼
Zustand store           ──► Feature logic modules (src/)
        │
        ▼
UI orchestration        ──► React components (app/)
```

`app/providers.tsx` is the central React context. It holds the active claim type, model data for all 7 claim types, and theme state. Components access it via `useContext(AppContext)`.

The app currently uses **sample data embedded in `app/providers.tsx`** — there are no API routes for model data. Data is static JSON loaded at build time.

### Module Layout

```
src/
  data-model/          # Zod schemas, enums (ClaimTypeId, KNOWN_ROLES, WaTaskContext, WaAlignmentStatus), Zustand store factory
  app-shell/           # ROUTES constant, CLAIM_TYPES, theme utilities
  state-explorer/      # Graph building: statesToNodes, transitionsToEdges, getStateDetail
  ui-state-explorer/   # Auto-layout (Kahn's topological sort), node/edge display helpers
  event-matrix/        # filterEvents, searchEvents, eventsToCsv
  wa-task-engine/      # getTasksForEvent, getTasksForState, getAlignmentSummary
  ui-wa-tasks/         # WA task badges, enrichment helpers, panel data
  model-health/        # Health scoring: completeness, reachability, open questions
  caseman-comparison/  # Legacy Caseman vs new service comparison logic
  ...                  # 34 modules total — logic and ui-* pairs for each feature

app/
  layout.tsx           # Root layout: AppProvider, Sidebar, Header
  providers.tsx        # AppContext — claim type, model data, theme
  components/          # Sidebar.tsx, Header.tsx
  state-explorer/      # React Flow graph visualisation
  event-matrix/        # Searchable/filterable event table
  digital-twin/        # Step-through case simulation
  work-allocation/     # WA task alignment dashboard
  caseman-comparison/  # Caseman legacy comparison
  action-items/        # Model gap and WA alignment action items
  ...                  # 9 main routes total
```

### 7 Claim Types

`ClaimTypeId` enum: `MAIN_CLAIM_ENGLAND`, `ACCELERATED_CLAIM_WALES`, `COUNTER_CLAIM`, `COUNTER_CLAIM_MAIN_CLAIM_CLOSED`, `ENFORCEMENT`, `APPEALS`, `GENERAL_APPLICATIONS`.

### Key Actors

`KNOWN_ROLES`: Judge, Caseworker, Claimant, Defendant, LegalAdvisor, BailiffEnforcement, CourtAdmin, SystemAuto.

## Business Context

Domain reference documents are in `.business_context/`:
- `State model and dependencies v0.10.pdf` — state machine and dependency model for possession cases
- `Event Model Possession Service V0.1.xlsx` — event model for the possession service
- `R1A_WA_Tasks_vs_Event_Model_Analysis.md` — work allocation task alignment analysis
- `spec.md` — technical specification

Consult these when making decisions about domain logic, state transitions, or event handling.

## Feature Backlog

`.blueprint/features/BACKLOG.md` is the authoritative list of all features: status (Done/Ready/WIP), priority (P0–P3), effort (S/M/L/XL), and full implementation specs. Read it before starting any new feature to understand dependencies and the expected implementation detail.

## Deployment

GitHub Actions (`.github/workflows/deploy.yml`) builds on push to `master` and deploys to Azure Web App via publish profile. The app runs on `PORT` env var (defaults to 3000).

## Claude API / Bedrock

Claude runs via AWS Bedrock (eu-west-1). Model environment variables are set in `.devcontainer/claudeinit.sh`. When building AI features, use these model IDs:
- Opus: `eu.anthropic.claude-opus-4-6-v1`
- Sonnet: `eu.anthropic.claude-sonnet-4-6`
- Haiku: `eu.anthropic.claude-haiku-4-5-20251001-v1:0`
