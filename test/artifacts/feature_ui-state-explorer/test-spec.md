# Test Spec: ui-state-explorer

## Test IDs: USE-1 through USE-18

### prepareGraphData
- USE-1: Returns nodes and edges from valid states/transitions
- USE-2: Returned nodes have non-default positions (not all y=0)
- USE-3: Empty inputs return empty graph

### calculateAutoLayout
- USE-4: Root nodes (no incoming edges) are placed at layer 0 (y=0)
- USE-5: Dependent nodes are placed in subsequent layers
- USE-6: Nodes in the same layer are spread horizontally
- USE-7: Single node returns position {x:0, y:0}
- USE-8: Disconnected nodes all go to layer 0

### prepareNodeWithBadge
- USE-9: Returns stateId, label, completeness, and badge
- USE-10: Badge level reflects completeness (100% -> complete)
- USE-11: Badge level for 0% completeness -> unknown

### prepareStateDetailPanel
- USE-12: Returns state detail with formatted events
- USE-13: Each formatted event has name, actors, and indicator
- USE-14: Events with open questions get warning indicator
- USE-15: Missing state returns undefined state in panel

### getGraphLegend
- USE-16: Returns exactly 4 legend entries with label, color, description

### getEdgeLegend
- USE-17: Returns exactly 3 legend entries with label, style, description
- USE-18: Legend entries cover solid, dashed, and dotted styles
