# Feature Specification -- state-explorer

## 1. Feature Intent

**Why this feature exists.**

Business analysts need to visually explore the state machine for each claim type. The current source material (PDF diagrams, Visio files) is static and disconnected. This feature provides an interactive React Flow state diagram per claim type, with colour-coded nodes (states), styled edges (transitions), and a detail drawer for inspecting state metadata, events, and actor permissions.

**Alignment:** Implements Mode 1 (State Explorer) from `.business_context/spec.md` and the `state-explorer` backlog item in `.blueprint/features/BACKLOG.md`. Consumes domain types defined in System Spec sections 5-6.

---

## 2. Scope

### In Scope

- **Graph data transformation layer** (pure functions, no React dependency):
  - `statesToNodes(states: State[])` -- convert State array to React Flow node descriptors with position placeholders, colour coding, and completeness badge data
  - `transitionsToEdges(transitions: Transition[])` -- convert Transition array to React Flow edge descriptors with line style coding
  - `getStateColor(state: State)` -- return `{ background, border, text }` colour object based on isDraftLike/isLive/isEndState/completeness
  - `getEdgeStyle(transition: Transition)` -- return `{ strokeDasharray, animated }` style object based on isSystemTriggered/isTimeBased
  - `getStateDetail(stateId, states, events)` -- aggregate state metadata, events at that state, and actor summary for the detail drawer
  - `buildGraph(states, transitions)` -- combined convenience function returning `{ nodes, edges }`
- **Colour coding rules:**
  - Draft (isDraftLike) -- amber background (#F59E0B border, #FEF3C7 background)
  - Live (isLive) -- green background (#10B981 border, #D1FAE5 background)
  - End state (isEndState) -- dark background (#374151 border, #1F2937 background, white text)
  - Uncertain (completeness < 50 and not end state) -- muted with striped pattern indicator
- **Edge style rules:**
  - System-triggered -- dashed line (strokeDasharray: '5 5'), not animated
  - Time-based -- dotted line (strokeDasharray: '2 2'), animated
  - User action (neither) -- solid line, not animated

### Out of Scope

- React Flow component rendering, layout algorithms, zoom/pan interaction
- Detail drawer UI component
- Claim type switcher UI
- Data loading or ingestion
- Zustand store integration (consumed by UI layer)

---

## 3. Actors Involved

### Business Analyst (primary user)
- **Can do:** View state diagram, click states to inspect details, switch claim types
- **Cannot do:** Modify the model data

### Developer (internal)
- **Can do:** Import transformation functions, compose them into React Flow components
- **Cannot do:** Bypass colour/style rules (enforced by pure functions)

---

## 4. Functional Requirements

### FR-1: State to Node Mapping
Given an array of State objects, `statesToNodes()` returns an array of node descriptors where each node has: `id` (state.id), `data.label` (state.uiLabel), `data.technicalName` (state.technicalName), `data.completeness` (state.completeness), `type` ('default'), and `style` (from getStateColor).

### FR-2: Transition to Edge Mapping
Given an array of Transition objects, `transitionsToEdges()` returns an array of edge descriptors where each edge has: `id` (from-to composite), `source` (transition.from), `target` (transition.to), `label` (transition.condition or ''), `style` and `animated` (from getEdgeStyle).

### FR-3: State Colour Coding
`getStateColor(state)` returns colour object:
- isDraftLike=true -> amber palette
- isLive=true -> green palette
- isEndState=true -> dark palette
- completeness < 50 and none of the above flags -> uncertain/muted palette
- Default fallback for states matching none of the above -> neutral grey

Priority: isEndState > isDraftLike > isLive > uncertainty check.

### FR-4: Edge Style Coding
`getEdgeStyle(transition)` returns style object:
- isSystemTriggered=true -> dashed
- isTimeBased=true -> dotted, animated
- Neither -> solid, not animated
- Both flags true -> dotted takes priority (time-based)

### FR-5: State Detail Aggregation
`getStateDetail(stateId, states, events)` returns:
- `state`: the matching State object (or undefined)
- `events`: filtered Event[] where event.state matches stateId
- `actorSummary`: Record<string, number> counting how many events each actor can perform at this state

### FR-6: Build Graph Convenience
`buildGraph(states, transitions)` calls statesToNodes and transitionsToEdges, returning `{ nodes, edges }`.

---

## 5. Non-Functional Requirements

- Pure functions with no side effects -- fully testable without DOM or React
- No runtime dependencies beyond the data-model types
- Functions must handle empty arrays gracefully (return empty arrays, not errors)

---

## 6. Testable Surface

Since this is a UI feature but we can only test non-UI logic with node:test, the testable layer is:
- Graph data transformation (statesToNodes, transitionsToEdges, buildGraph)
- Colour mapping (getStateColor)
- Edge styling (getEdgeStyle)
- State detail aggregation (getStateDetail)

All functions are pure and operate on the types defined in `src/data-model/schemas.ts`.

---

## 7. Open Questions

- OQ1: Node positioning strategy for React Flow layout -- deferred to UI implementation
- OQ2: Whether completeness threshold for "uncertain" styling should be configurable (currently hardcoded at 50)
