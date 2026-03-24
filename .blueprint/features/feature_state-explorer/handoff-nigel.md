## Handoff Summary
**For:** Codey (implementation)
**Feature:** state-explorer

### Tests Written
- `test/feature_state-explorer.test.js` -- 18 test cases covering all 6 exported functions
- `test/artifacts/feature_state-explorer/test-spec.md` -- test specification

### Exported API (from `src/state-explorer/index.js`)
All functions are pure, no side effects, no React dependency.

| Function | Signature | Returns |
|----------|-----------|---------|
| `getStateColor` | `(state: State) => { background, border, text }` | Colour object |
| `getEdgeStyle` | `(transition: Transition) => { strokeDasharray?, animated }` | Style object |
| `statesToNodes` | `(states: State[]) => ReactFlowNode[]` | Array of node descriptors |
| `transitionsToEdges` | `(transitions: Transition[]) => ReactFlowEdge[]` | Array of edge descriptors |
| `getStateDetail` | `(stateId, states, events) => { state?, events, actorSummary }` | Detail object |
| `buildGraph` | `(states, transitions) => { nodes, edges }` | Combined graph |

### Colour Rules
- isEndState -> dark (#1F2937 bg, #374151 border, #FFFFFF text)
- isDraftLike -> amber (#FEF3C7 bg, #F59E0B border)
- isLive -> green (#D1FAE5 bg, #10B981 border)
- completeness < 50 (no other flags) -> muted (#F3F4F6 bg, #9CA3AF border)
- Default fallback -> neutral (#F9FAFB bg, #D1D5DB border)
- Priority: isEndState > isDraftLike > isLive > uncertainty

### Edge Style Rules
- isTimeBased -> strokeDasharray='2 2', animated=true (highest priority)
- isSystemTriggered -> strokeDasharray='5 5', animated=false
- Neither -> solid (strokeDasharray=undefined), animated=false

### Run Command
```bash
node --experimental-strip-types --test test/feature_state-explorer.test.js
```
