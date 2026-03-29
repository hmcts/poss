/**
 * Content constants for the Event Matrix AboutPanel.
 * Exported separately so they can be tested independently of the React component.
 */

export const PANEL_TITLE = 'About this page — how to read it and what assumptions are made';

export const SECTION_WHAT_IT_DOES =
  'Shows all events for the possession service model, filterable by state, role, and WA task. ' +
  'Each row represents one event and displays its actor grid (which roles are assigned), ' +
  'whether it has open questions, whether it is system-triggered, and any associated Work Allocation task.';

export const SECTION_OPEN_QUESTIONS =
  'The \u26A0 warning indicator appears when the event\'s hasOpenQuestions field is true. ' +
  'This is a hand-authored flag set by a reviewer. ' +
  'Absence of the indicator does not mean the event is fully resolved — ' +
  'it may simply not have been reviewed yet.';

export const SECTION_ACTOR_GRID =
  'A filled cell (\u2713) means that role is assigned to the event in the model data. ' +
  'An empty cell means the role is not defined in the model for this event — ' +
  'it does not necessarily mean that role is uninvolved in practice. ' +
  'Actor assignments may be incomplete and should not be treated as exhaustive.';

export const SECTION_SYSTEM_FLAG =
  'The SYS badge marks events that are system-triggered (no human actor initiates them). ' +
  'This is set by the systemTriggered field in the model data. ' +
  'The absence of the flag does not guarantee a human actor is required — ' +
  'the systemTriggered field may not be exhaustive across all events.';

export const SECTION_WA_TASK =
  'The WA Task column is derived from wa-mappings.json, which maps Work Allocation task IDs to event IDs. ' +
  'Events with no WA mapping show \u2014 (em dash). ' +
  'This may mean no Work Allocation task is needed for that event, ' +
  'or it may mean the mapping has not been authored yet.';
