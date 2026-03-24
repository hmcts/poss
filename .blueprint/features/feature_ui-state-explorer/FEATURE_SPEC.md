# Feature Spec: ui-state-explorer

## Overview
Pure-logic module that prepares data for a React Flow graph visualization of state diagrams per claim type. This module sits between the existing `state-explorer` and `uncertainty-display` modules and the UI layer, enriching graph data with layout positions, completeness badges, formatted detail panels, and legend information.

## Module
`src/ui-state-explorer/index.ts`

## Dependencies
- `state-explorer`: buildGraph, getStateDetail, getStateColor, getEdgeStyle
- `uncertainty-display`: getCompletenessBadge, getEventIndicator, getUncertaintyColor
- `data-model`: State, Transition, Event types

## Exported Functions

### prepareGraphData(states, transitions)
Calls `buildGraph` then runs `calculateAutoLayout` on the result to assign meaningful x,y positions to nodes. Returns `{ nodes, edges }` with positions populated.

### prepareNodeWithBadge(state)
Takes a State and returns enriched data combining the state-explorer node representation with a completeness badge from uncertainty-display. Returns `{ stateId, label, completeness, badge }`.

### prepareStateDetailPanel(stateId, states, events)
Wraps `getStateDetail` with formatted event list entries (each with name, actor list, and uncertainty indicator from `getEventIndicator`). Returns `{ state, formattedEvents, actorSummary }`.

### getGraphLegend()
Returns a static array of `{ label, color, description }` for the four node categories: Draft, Live, End State, Uncertain.

### getEdgeLegend()
Returns a static array of `{ label, style, description }` for edge types: User Action (solid), System Triggered (dashed), Time Based (dotted/animated).

### calculateAutoLayout(nodes, edges)
Assigns x,y positions using a topological-sort layered approach. Nodes with no incoming edges go to layer 0. Each subsequent layer holds nodes whose predecessors are all in earlier layers. Within each layer, nodes are spaced horizontally. Returns a new array of nodes with updated positions.

## Non-functional
- No React/DOM dependencies
- All functions are pure (no side effects)
- Testable with Node.js built-in test runner
