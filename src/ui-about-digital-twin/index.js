/**
 * Content constants for the Digital Twin About panel.
 * Exported so they can be tested independently and imported by the page component.
 */

export const ABOUT_WHAT_PAGE_DOES =
  'This page simulates a possession case journey through the state machine. ' +
  'Starting from the initial state, you select events to advance the case step by step. ' +
  'The timeline on the left shows each state visited. Toggle events off to see how the ' +
  'reachable path changes when certain actions are unavailable.';

export const ABOUT_AVAILABLE_EVENTS =
  'Only events that are modelled for the current state appear as options. ' +
  'Unmodelled events are not shown — they are invisible rather than disabled. ' +
  'If you reach a state with no available events and the case is not in an end state, ' +
  'this is a model completeness gap, not necessarily a real process dead end.';

export const ABOUT_DEAD_END_DETECTION =
  'A dead end is flagged when getAvailableEvents() returns an empty list and ' +
  'isEndState() returns false for the current state. This is a model-completeness ' +
  'signal — it means the model does not yet define what happens next, not that the ' +
  'real process has no route forward.';

export const ABOUT_AUTO_WALK =
  'Auto-walk selects the first available event at each step and repeats up to 50 times. ' +
  'The traversal is arbitrary — it reflects the ordering of events in the model data, ' +
  'not any typical or representative case journey. It is provided as a quick way to ' +
  'exercise the model end-to-end without manual step-through.';

export const ABOUT_WA_TASK_CARDS =
  'WA task cards are derived from wa-mappings.json and the 17 R1A Work Allocation tasks ' +
  'currently modelled. Cards with amber indicators are partial matches — the task is ' +
  'associated with the event but the alignment is incomplete. Red indicators mean the task ' +
  'has no corresponding event in the model. Tasks outside the R1A scope are not shown.';

export const ABOUT_ROLE_FILTER =
  'The role filter hides events not assigned to the selected role. Role assignment in the ' +
  'model may be incomplete — an event hidden by the filter may still be performable by ' +
  'that role in the real process. The filter reflects what the model currently records, ' +
  'not a definitive statement of role boundaries.';
