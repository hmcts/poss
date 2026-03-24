## Test Specification -- state-explorer

### Test Strategy
Pure function unit tests using node:test. No DOM, no React, no mocking required.
All imports from `../src/state-explorer/index.js`.

### Test Cases

| ID | Function | Scenario | Assertion |
|----|----------|----------|-----------|
| SE-1 | getStateColor | Draft state (isDraftLike=true) | Returns amber palette |
| SE-2 | getStateColor | Live state (isLive=true) | Returns green palette |
| SE-3 | getStateColor | End state (isEndState=true) | Returns dark palette |
| SE-4 | getStateColor | Uncertain (completeness<50, no flags) | Returns muted palette |
| SE-5 | getStateColor | Priority: end overrides draft | Returns dark, not amber |
| SE-6 | getEdgeStyle | System-triggered | strokeDasharray='5 5', animated=false |
| SE-7 | getEdgeStyle | Time-based | strokeDasharray='2 2', animated=true |
| SE-8 | getEdgeStyle | User action (neither flag) | strokeDasharray=undefined/none, animated=false |
| SE-9 | getEdgeStyle | Both flags: time-based wins | strokeDasharray='2 2', animated=true |
| SE-10 | statesToNodes | Maps fields correctly | id, data.label, data.technicalName, data.completeness, style present |
| SE-11 | statesToNodes | Empty array | Returns empty array |
| SE-12 | transitionsToEdges | Maps fields correctly | id, source, target, label, style present |
| SE-13 | transitionsToEdges | Null condition | label is empty string |
| SE-14 | getStateDetail | Filters events by stateId | Correct events returned |
| SE-15 | getStateDetail | Actor summary counts | Correct counts per actor |
| SE-16 | getStateDetail | Missing state | state is undefined |
| SE-17 | buildGraph | Combines nodes and edges | Returns { nodes, edges } with correct lengths |
| SE-18 | buildGraph | Empty inputs | Returns { nodes: [], edges: [] } |
