# Implementation Plan: uncertainty-display

## Files to Create
1. `src/uncertainty-display/index.ts` — all exported functions
2. `src/uncertainty-display/index.js` — bridge file re-exporting from index.ts

## Implementation Details

### Types
- `UncertaintyLevel` = `'complete' | 'partial' | 'low' | 'unknown'`
- `UncertaintyColor` = `{ background: string; border: string; text: string }`
- `CompletenessBadge` = `{ label: string; level: string; color: UncertaintyColor }`
- `EventIndicator` = `{ hasOpenQuestions: boolean; indicatorType: 'warning' | 'none'; indicatorColor: string }`
- `StateClassification` = `{ complete: State[]; partial: State[]; low: State[]; unknown: State[] }`
- `UncertaintySummary` = `{ totalStates: number; completeCount: number; uncertainCount: number; openQuestionEvents: number; overallLevel: string }`

### Function Implementations
1. **getUncertaintyLevel**: Simple if/else chain on completeness thresholds
2. **getUncertaintyColor**: Object lookup by level with grey fallback
3. **getCompletenessLabel**: Template literal `${completeness}%`
4. **getCompletenessBadge**: Composes getUncertaintyLevel + getUncertaintyColor + getCompletenessLabel
5. **getEventIndicator**: Ternary on hasOpenQuestions flag
6. **classifyStates**: Reduce over states, bucket by getUncertaintyLevel
7. **getUncertaintySummary**: Aggregate using classifyStates + filter events

### Priority ordering for overallLevel
unknown < low < partial < complete (worst wins)
