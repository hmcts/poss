# Test Spec: uncertainty-display

## Test Strategy
Pure unit tests for all 7 exported functions. Tests use `node:test` (describe/it) and `node:assert/strict`. Fixtures use factory functions following the project pattern.

## Test Cases

### getUncertaintyLevel
- UD-1: completeness=100 returns 'complete'
- UD-2: completeness=50 returns 'partial'
- UD-3: completeness=99 returns 'partial'
- UD-4: completeness=49 returns 'low'
- UD-5: completeness=1 returns 'low'
- UD-6: completeness=0 returns 'unknown'

### getUncertaintyColor
- UD-7: 'complete' returns green palette
- UD-8: 'partial' returns amber palette
- UD-9: 'low' returns amber-muted palette
- UD-10: 'unknown' returns grey palette
- UD-11: unrecognised string returns grey palette

### getCompletenessLabel
- UD-12: 100 returns "100%"
- UD-13: 0 returns "0%"
- UD-14: 75 returns "75%"

### getCompletenessBadge
- UD-15: state with completeness=100 returns complete badge
- UD-16: state with completeness=0 returns unknown badge
- UD-17: state with completeness=60 returns partial badge

### getEventIndicator
- UD-18: event with hasOpenQuestions=true returns warning indicator
- UD-19: event with hasOpenQuestions=false returns none indicator

### classifyStates
- UD-20: mixed states are bucketed correctly
- UD-21: empty array returns empty buckets

### getUncertaintySummary
- UD-22: aggregates counts correctly
- UD-23: overallLevel reflects worst state
- UD-24: empty arrays return zero counts with 'unknown' level
