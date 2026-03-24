# Implementation Plan: ui-state-explorer

## Files
1. `src/ui-state-explorer/index.ts` - Main module
2. `src/ui-state-explorer/index.js` - Bridge file

## Implementation Steps

### 1. calculateAutoLayout(nodes, edges)
- Build adjacency map and in-degree count from edges
- Topological sort via Kahn's algorithm to assign layers
- Nodes with in-degree 0 go to layer 0
- Each node's layer = max(predecessor layers) + 1
- Within each layer, spread nodes horizontally with NODE_X_GAP spacing, centered
- y position = layer * NODE_Y_GAP
- Return new array with updated positions (do not mutate input)

### 2. prepareGraphData(states, transitions)
- Call buildGraph(states, transitions) from state-explorer
- Call calculateAutoLayout on the result nodes/edges
- Return { nodes: layoutNodes, edges: graph.edges }

### 3. prepareNodeWithBadge(state)
- Call getCompletenessBadge(state) from uncertainty-display
- Return { stateId: state.id, label: state.uiLabel, completeness: state.completeness, badge }

### 4. prepareStateDetailPanel(stateId, states, events)
- Call getStateDetail(stateId, states, events) from state-explorer
- For each event in detail.events, create formatted event with:
  - name, actors (array of actor names where value is true), indicator from getEventIndicator
- Return { state: detail.state, formattedEvents, actorSummary: detail.actorSummary }

### 5. getGraphLegend()
- Return static array of 4 entries matching state-explorer color scheme

### 6. getEdgeLegend()
- Return static array of 3 entries matching edge styles
