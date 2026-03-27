import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

import {
  shouldShowWaToggle,
  getEventTaskCards,
  getTimelineChips,
  getAlignmentWarning,
  isPaymentRelatedState,
  getEmptyStateMessage,
} from '../src/ui-wa-tasks/digital-twin-helpers.js';

const require = createRequire(import.meta.url);
const waTasks = require('../data/wa-tasks.json');
const waMappings = require('../data/wa-mappings.json');

// ── 1. shouldShowWaToggle ─────────────────────────────────────────────

describe('shouldShowWaToggle — toggle visibility based on data availability', () => {
  it('T-1.1: returns true when valid WA tasks and mappings exist', () => {
    const result = shouldShowWaToggle(waTasks, waMappings);
    assert.equal(result, true, 'Toggle should be visible when WA data is available');
  });

  it('T-1.2: returns false when both arrays are empty', () => {
    assert.equal(shouldShowWaToggle([], []), false, 'No data means toggle hidden');
  });

  it('T-1.3: returns false when data is null or undefined', () => {
    assert.equal(shouldShowWaToggle(null, null), false, 'null data means toggle hidden');
    assert.equal(shouldShowWaToggle(undefined, undefined), false, 'undefined data means toggle hidden');
    assert.equal(shouldShowWaToggle(waTasks, null), false, 'Missing mappings means toggle hidden');
    assert.equal(shouldShowWaToggle(null, waMappings), false, 'Missing tasks means toggle hidden');
  });
});

// ── 2. getEventTaskCards ──────────────────────────────────────────────

describe('getEventTaskCards — task card data for an event', () => {
  it('T-2.1: returns card objects for a mapped event (Case Issued)', () => {
    const cards = getEventTaskCards('Case Issued', waTasks, waMappings);
    assert.ok(Array.isArray(cards), 'Must return an array');
    assert.ok(cards.length > 0, 'Case Issued should produce at least one card');
  });

  it('T-2.2: collapsed fields include taskName and alignment badge data', () => {
    const cards = getEventTaskCards('Case Issued', waTasks, waMappings);
    const card = cards[0];
    assert.ok(typeof card.taskName === 'string' && card.taskName.length > 0, 'taskName must be a non-empty string');
    assert.equal(card.taskName, 'New Claim -- Listing required', 'Correct task name for Case Issued');
    assert.ok(card.badge, 'Card must have badge data');
    assert.equal(card.badge.label, 'Aligned', 'wa-task-01 is aligned');
    assert.equal(card.badge.colour, '#22C55E', 'Aligned badge is green');
  });

  it('T-2.3: expanded fields include triggerDescription, notes, and context', () => {
    const cards = getEventTaskCards('Case Issued', waTasks, waMappings);
    const card = cards[0];
    assert.ok(typeof card.triggerDescription === 'string' && card.triggerDescription.length > 0,
      'triggerDescription must be a non-empty string');
    assert.ok(typeof card.notes === 'string', 'notes must be a string');
    assert.ok(typeof card.context === 'string', 'context must be a string');
    assert.equal(card.context, 'claim', 'wa-task-01 context is claim');
  });

  it('T-2.4: returns empty array for unmapped event (Transfer Case)', () => {
    const cards = getEventTaskCards('Transfer Case', waTasks, waMappings);
    assert.ok(Array.isArray(cards), 'Must return an array');
    assert.equal(cards.length, 0, 'Unmapped event has no cards');
  });

  it('T-2.5: event mapped to multiple tasks returns multiple cards (Respond to Claim)', () => {
    const cards = getEventTaskCards('Respond to Claim', waTasks, waMappings);
    assert.ok(cards.length >= 2, 'Respond to Claim maps to wa-task-03 and wa-task-04');
    const taskNames = cards.map((c) => c.taskName);
    assert.ok(taskNames.includes('Review Defendant response'), 'Includes wa-task-03');
    assert.ok(taskNames.includes('Review Defendant response and counterclaim'), 'Includes wa-task-04');
  });

  it('T-2.6: partial-aligned card includes non-empty alignment notes', () => {
    const cards = getEventTaskCards('Respond to Claim', waTasks, waMappings);
    const partialCard = cards.find((c) => c.badge.label === 'Partial');
    assert.ok(partialCard, 'Should have a partial card');
    assert.ok(partialCard.notes.length > 0, 'Partial card must have alignment notes');
  });
});

// ── 3. getTimelineChips ───────────────────────────────────────────────

describe('getTimelineChips — chip data for timeline entries', () => {
  it('T-3.1: returns chip with taskName and alignment colour for mapped event', () => {
    const chips = getTimelineChips('Case Issued', waTasks, waMappings);
    assert.ok(Array.isArray(chips), 'Must return an array');
    assert.ok(chips.length > 0, 'Case Issued should produce chips');
    const chip = chips[0];
    assert.ok(typeof chip.taskName === 'string' && chip.taskName.length > 0, 'Chip has taskName');
    assert.ok(typeof chip.colour === 'string' && chip.colour.length > 0, 'Chip has colour');
  });

  it('T-3.2: returns empty array for unmapped event', () => {
    const chips = getTimelineChips('Transfer Case', waTasks, waMappings);
    assert.ok(Array.isArray(chips), 'Must return an array');
    assert.equal(chips.length, 0, 'Unmapped event produces no chips');
  });

  it('T-3.3: chip colour matches alignment status', () => {
    // Aligned event
    const alignedChips = getTimelineChips('Case Issued', waTasks, waMappings);
    assert.equal(alignedChips[0].colour, '#22C55E', 'Aligned chip is green');

    // Partial event (Upload your documents -> wa-task-09 partial)
    const partialChips = getTimelineChips('Upload your documents', waTasks, waMappings);
    const partialChip = partialChips.find((c) => c.alignment === 'partial');
    assert.ok(partialChip, 'Should have partial chip');
    assert.equal(partialChip.colour, '#F59E0B', 'Partial chip is amber');
  });

  it('T-3.4: chip includes text label (taskName is readable)', () => {
    const chips = getTimelineChips('Allocate hearing centre', waTasks, waMappings);
    assert.ok(chips.length > 0, 'Allocate hearing centre should produce chips');
    for (const chip of chips) {
      assert.ok(typeof chip.taskName === 'string' && chip.taskName.length > 0,
        'Every chip must have a non-empty taskName for WCAG compliance');
    }
  });
});

// ── 4. getAlignmentWarning ────────────────────────────────────────────

describe('getAlignmentWarning — partial/gap warning for an event', () => {
  it('T-4.1: returns partial warning for event with partial-aligned task', () => {
    // "Update Counter Claim" maps to wa-task-05 (partial)
    const warning = getAlignmentWarning('Update Counter Claim', waTasks, waMappings);
    assert.ok(warning, 'Warning object must exist for partial alignment');
    assert.equal(warning.type, 'partial', 'Warning type is partial');
    assert.ok(typeof warning.message === 'string' && warning.message.length > 0,
      'Warning must have a non-empty message');
  });

  it('T-4.2: returns null for event with fully aligned task', () => {
    // "Create case flags" maps to wa-task-13 (aligned)
    const warning = getAlignmentWarning('Create case flags', waTasks, waMappings);
    assert.equal(warning, null, 'Aligned events should not produce a warning');
  });

  it('T-4.3: returns null for event with no WA task', () => {
    const warning = getAlignmentWarning('Transfer Case', waTasks, waMappings);
    assert.equal(warning, null, 'Unmapped events produce no warning');
  });

  it('T-4.4: returns partial warning for Make an application (maps to multiple tasks including partial)', () => {
    const warning = getAlignmentWarning('Make an application', waTasks, waMappings);
    // Make an application maps to wa-task-06 (partial), wa-task-07 (partial), wa-task-08 (aligned)
    // Should detect at least one partial
    assert.ok(warning, 'Should return warning when at least one mapped task is partial');
    assert.equal(warning.type, 'partial');
  });
});

// ── 5. isPaymentRelatedState ──────────────────────────────────────────

describe('isPaymentRelatedState — payment state heuristic', () => {
  it('T-5.1: returns true for state containing PAYMENT', () => {
    assert.equal(isPaymentRelatedState('AWAITING_PAYMENT'), true);
    assert.equal(isPaymentRelatedState('PAYMENT_PENDING'), true);
    assert.equal(isPaymentRelatedState('SUBMIT_AND_PAYMENT'), true);
  });

  it('T-5.2: returns true for PENDING_CASE_ISSUED', () => {
    assert.equal(isPaymentRelatedState('PENDING_CASE_ISSUED'), true);
  });

  it('T-5.3: returns false for non-payment states', () => {
    assert.equal(isPaymentRelatedState('DRAFT'), false);
    assert.equal(isPaymentRelatedState('CASE_ISSUED'), false, 'CASE_ISSUED alone is not payment-related');
    assert.equal(isPaymentRelatedState('WITH_JUDGE'), false);
    assert.equal(isPaymentRelatedState('LISTED_FOR_HEARING'), false);
    assert.equal(isPaymentRelatedState('CLOSED'), false);
  });

  it('T-5.4: matching is case-insensitive for the PAYMENT substring', () => {
    assert.equal(isPaymentRelatedState('Payment_Pending'), true, 'Mixed case should match');
    assert.equal(isPaymentRelatedState('payment_processing'), true, 'Lowercase should match');
  });

  it('T-5.5: returns false for empty or null input', () => {
    assert.equal(isPaymentRelatedState(''), false, 'Empty string is not payment-related');
    assert.equal(isPaymentRelatedState(null), false, 'null is not payment-related');
    assert.equal(isPaymentRelatedState(undefined), false, 'undefined is not payment-related');
  });
});

// ── 6. getEmptyStateMessage ───────────────────────────────────────────

describe('getEmptyStateMessage — info note for states with no WA tasks', () => {
  // Build mock events at a state with no WA-triggering events
  const emptyStateEvents = [
    { state: 'STATE_NO_WA', name: 'Some Unrelated Event' },
    { state: 'STATE_NO_WA', name: 'Another Unrelated Event' },
  ];

  // Build mock events at a state that has WA-triggering events
  const waStateEvents = [
    { state: 'STATE_WITH_WA', name: 'Case Issued' },
    { state: 'STATE_WITH_WA', name: 'Respond to Claim' },
  ];

  it('T-6.1: returns message when no events at state trigger WA tasks', () => {
    const msg = getEmptyStateMessage('STATE_NO_WA', emptyStateEvents, waTasks, waMappings);
    assert.ok(typeof msg === 'string', 'Must return a string');
    assert.equal(msg, 'No caseworker tasks at this state');
  });

  it('T-6.2: returns null when events at state trigger WA tasks', () => {
    const msg = getEmptyStateMessage('STATE_WITH_WA', waStateEvents, waTasks, waMappings);
    assert.equal(msg, null, 'Should return null when WA tasks exist at state');
  });

  it('T-6.3: returns null when data arrays are empty (degraded mode)', () => {
    const msg = getEmptyStateMessage('STATE_NO_WA', emptyStateEvents, [], []);
    assert.equal(msg, null, 'Empty data should return null, not message');
  });

  it('T-6.4: returns message for state with events that exist in data but have no WA mapping', () => {
    const eventsNoMapping = [
      { state: 'STATE_UNMAPPED', name: 'Completely Unknown Event' },
    ];
    const msg = getEmptyStateMessage('STATE_UNMAPPED', eventsNoMapping, waTasks, waMappings);
    assert.equal(msg, 'No caseworker tasks at this state');
  });
});
