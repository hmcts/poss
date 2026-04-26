/**
 * UI helpers for the product catalogue — expanded detail formatting.
 */

/**
 * Returns a display-ready expanded detail object for a catalogue item.
 * All fields are normalised to strings (empty string if absent).
 */
export function getExpandedDetail(item) {
  return {
    hlFunction: item.hlFunction ?? item['hl-function'] ?? '',
    userStory: item.userStory ?? item['user-story'] ?? '',
    expectedOutcomes: item.expectedOutcomes ?? item['expected-outcomes'] ?? '',
    eventTrigger: item.eventTrigger ?? item['event-trigger'] ?? '',
    personas: Array.isArray(item.personas) ? item.personas : (item.persona ? [item.persona] : []),
    notes: item.notes ?? '',
  };
}
