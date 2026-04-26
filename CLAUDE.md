# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Statesmith — a generic Next.js application for modelling, visualising, and analysing process state machines. Users define their own states, events, work-allocation tasks, and personas through the Reference Data UI. There is no pre-loaded domain data; the app starts from a blank canvas.

The service name is controlled by `APP_NAME` in `src/app-shell/index.ts`.

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
app/reference-data/   ──► /api/reference-data (Azure Blob)
                                  │
                                  ▼
app/providers.tsx       ──► AppContext (activeModel, theme)
                                  │
                                  ▼
Zustand store           ──► Feature logic modules (src/)
                                  │
                                  ▼
UI orchestration        ──► React components (app/)
```

`app/providers.tsx` is the central React context. It loads all data from the `/api/reference-data` endpoint (Azure Blob Storage) and derives `modelData` from the active user-defined model. When the blob is empty the app starts with no data — a blank canvas.

### User-Defined Models

There are no hard-coded model types. Users create states in the Reference Data editor and assign each state a `claimType` string — this string becomes the model ID. The sidebar model selector is populated dynamically from the unique `claimType` values present in the blob.

### Module Layout

```
src/
  data-model/          # Zod schemas (State, Transition, Event, WaTask), WaAlignmentStatus enum, Zustand store
  app-shell/           # APP_NAME constant, ROUTES, theme utilities
  data-loading/        # getModelIdsFromBlob(), getModelDataForClaimType()
  ref-data/            # ReferenceDataBlob schema, Azure Blob adapter, editor logic
  state-explorer/      # Graph building: statesToNodes, transitionsToEdges, getStateDetail
  ui-state-explorer/   # Auto-layout (Kahn's topological sort), node/edge display helpers
  event-matrix/        # filterEvents, searchEvents, eventsToCsv
  wa-task-engine/      # getTasksForEvent, getTasksForState, getAlignmentSummary
  ui-wa-tasks/         # WA task badges, enrichment helpers, panel data
  case-walk/           # Case simulation step-through logic
  scenario-analysis/   # Scenario building
  journey-explorer/    # Case journey mapping
  ui-app-shell/        # Navigation helpers, theme toggle state
  ui-about-*/          # Help/explainer text modules (one per feature)
  ui-event-matrix/     # Table formatting, search highlights, CSV prep
  ui-wa-tasks/         # WA task badges, enrichment, panel data
  ui-case-walk/        # Simulation state display
  ui-scenario-analysis/# Scenario UI prep
  uncertainty-display/ # Open question rendering
  wa-ingestion/        # WA task data transformation

app/
  layout.tsx           # Root layout: AppProvider, Sidebar, Header
  providers.tsx        # AppContext — active model, model data, theme
  context.ts           # AppContext type definitions (no JSX)
  components/          # Sidebar.tsx, Header.tsx
  state-explorer/      # React Flow graph visualisation
  event-matrix/        # Searchable/filterable event table
  digital-twin/        # Step-through case simulation
  work-allocation/     # WA task alignment dashboard
  journey/             # Journey explorer
  reference-data/      # Reference data editors (states, events, tasks, personas, associations)
```

## Deployment

GitHub Actions (`.github/workflows/deploy.yml`) builds on push to `master` and deploys to Azure Web App via publish profile. The app runs on `PORT` env var (defaults to 3000).

## Claude API / Bedrock

Claude runs via AWS Bedrock (eu-west-1). Model environment variables are set in `.devcontainer/claudeinit.sh`. When building AI features, use these model IDs:
- Opus: `eu.anthropic.claude-opus-4-6-v1`
- Sonnet: `eu.anthropic.claude-sonnet-4-6`
- Haiku: `eu.anthropic.claude-haiku-4-5-20251001-v1:0`

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Statesmith — a generic Next.js application for modelling, visualising, and analysing process state machines. Users define their own states, events, work-allocation tasks, and personas through the Reference Data UI. There is no pre-loaded domain data; the app starts from a blank canvas.

The service name is controlled by `APP_NAME` in `src/app-shell/index.ts`.

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
app/reference-data/   ──► /api/reference-data (Azure Blob)
                                  │
                                  ▼
app/providers.tsx       ──► AppContext (activeModel, theme)
                                  │
                                  ▼
Zustand store           ──► Feature logic modules (src/)
                                  │
                                  ▼
UI orchestration        ──► React components (app/)
```

`app/providers.tsx` is the central React context. It loads all data from the `/api/reference-data` endpoint (Azure Blob Storage) and derives `modelData` from the active user-defined model. When the blob is empty the app starts with no data — a blank canvas.

### User-Defined Models

There are no hard-coded model types. Users create states in the Reference Data editor and assign each state a `claimType` string — this string becomes the model ID. The sidebar model selector is populated dynamically from the unique `claimType` values present in the blob.

### Module Layout

```
src/
  data-model/          # Zod schemas (State, Transition, Event, WaTask), WaAlignmentStatus enum, Zustand store
  app-shell/           # APP_NAME constant, ROUTES, theme utilities
  data-loading/        # getModelIdsFromBlob(), getModelDataForClaimType()
  ref-data/            # ReferenceDataBlob schema, Azure Blob adapter, editor logic
  state-explorer/      # Graph building: statesToNodes, transitionsToEdges, getStateDetail
  ui-state-explorer/   # Auto-layout (Kahn's topological sort), node/edge display helpers
  event-matrix/        # filterEvents, searchEvents, eventsToCsv
  wa-task-engine/      # getTasksForEvent, getTasksForState, getAlignmentSummary
  ui-wa-tasks/         # WA task badges, enrichment helpers, panel data
  case-walk/           # Case simulation step-through logic
  scenario-analysis/   # Scenario building
  journey-explorer/    # Case journey mapping
  ui-app-shell/        # Navigation helpers, theme toggle state
  ui-about-*/          # Help/explainer text modules (one per feature)
  ui-event-matrix/     # Table formatting, search highlights, CSV prep
  ui-wa-tasks/         # WA task badges, enrichment, panel data
  ui-case-walk/        # Simulation state display
  ui-scenario-analysis/# Scenario UI prep
  uncertainty-display/ # Open question rendering
  wa-ingestion/        # WA task data transformation

app/
  layout.tsx           # Root layout: AppProvider, Sidebar, Header
  providers.tsx        # AppContext — active model, model data, theme
  context.ts           # AppContext type definitions (no JSX)
  components/          # Sidebar.tsx, Header.tsx
  state-explorer/      # React Flow graph visualisation
  event-matrix/        # Searchable/filterable event table
  digital-twin/        # Step-through case simulation
  work-allocation/     # WA task alignment dashboard
  journey/             # Journey explorer
  reference-data/      # Reference data editors (states, events, tasks, personas, associations)
```

## Deployment

GitHub Actions (`.github/workflows/deploy.yml`) builds on push to `master` and deploys to Azure Web App via publish profile. The app runs on `PORT` env var (defaults to 3000).

## Claude API / Bedrock

Claude runs via AWS Bedrock (eu-west-1). Model environment variables are set in `.devcontainer/claudeinit.sh`. When building AI features, use these model IDs:
- Opus: `eu.anthropic.claude-opus-4-6-v1`
- Sonnet: `eu.anthropic.claude-sonnet-4-6`
- Haiku: `eu.anthropic.claude-haiku-4-5-20251001-v1:0`
