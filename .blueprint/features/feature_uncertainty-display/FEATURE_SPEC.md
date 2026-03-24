# Feature Spec: uncertainty-display

## Overview
Visual uncertainty indicators (hasOpenQuestions, completeness badges) across all modes. This is a pure logic module providing uncertainty classification and badge/indicator data functions.

## Exported Functions

### `getUncertaintyLevel(completeness: number): 'complete' | 'partial' | 'low' | 'unknown'`
Classifies a completeness percentage into a named uncertainty level.
- 100 = `'complete'`
- >= 50 = `'partial'`
- > 0 = `'low'`
- 0 = `'unknown'`

### `getUncertaintyColor(level: string): { background: string; border: string; text: string }`
Maps an uncertainty level to a colour object using consistent colour language:
- `'complete'` = green (`#D1FAE5`, `#10B981`, `#000000`)
- `'partial'` = amber (`#FEF3C7`, `#F59E0B`, `#000000`)
- `'low'` = amber-muted (`#FDE68A`, `#D97706`, `#000000`)
- `'unknown'` = grey (`#F3F4F6`, `#9CA3AF`, `#000000`)

Any unrecognised level falls back to the unknown/grey palette.

### `getCompletenessLabel(completeness: number): string`
Formats a completeness number as a percentage string, e.g. `"75%"`, `"100%"`, `"0%"`.

### `getCompletenessBadge(state: State): { label: string; level: string; color: UncertaintyColor }`
Combines the above functions to produce a badge descriptor for a given state.

### `getEventIndicator(event: Event): { hasOpenQuestions: boolean; indicatorType: 'warning' | 'none'; indicatorColor: string }`
Returns an indicator descriptor for an event:
- If `hasOpenQuestions` is true: `indicatorType = 'warning'`, `indicatorColor = '#F59E0B'` (amber)
- Otherwise: `indicatorType = 'none'`, `indicatorColor = 'transparent'`

### `classifyStates(states: State[]): { complete: State[]; partial: State[]; low: State[]; unknown: State[] }`
Buckets an array of states into the four uncertainty levels.

### `getUncertaintySummary(states: State[], events: Event[]): UncertaintySummary`
Aggregates uncertainty information:
- `totalStates`: count of states
- `completeCount`: states with completeness === 100
- `uncertainCount`: states with completeness < 100
- `openQuestionEvents`: count of events where hasOpenQuestions is true
- `overallLevel`: the worst (lowest) uncertainty level found across all states

## Colour Language
- Green = complete / fully defined
- Amber = uncertain / partially defined
- Amber-muted = low confidence
- Grey = unknown / no data

## Module Location
`src/uncertainty-display/index.ts` with bridge file `src/uncertainty-display/index.js`
