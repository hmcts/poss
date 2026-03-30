/**
 * Journey Explorer logic — traces persona journeys through the state graph,
 * enriches each step with events, WA tasks, and catalogue coverage gaps.
 */

// ── Path tracing ─────────────────────────────────────────────────────────────

/**
 * DFS from startStateId to all terminal states.
 * Returns every unique complete path as an array of stateIds.
 * Cycle-safe: a stateId cannot appear twice in the same path.
 */
export function traceAllPaths(startStateId, transitions, states) {
  const terminalIds = new Set(states.filter(s => s.isEndState).map(s => s.id));
  const results = [];

  function dfs(current, path) {
    if (terminalIds.has(current)) {
      results.push([...path]);
      return;
    }
    const nexts = transitions.filter(t => t.from === current).map(t => t.to);
    if (nexts.length === 0) {
      // Dead end but not terminal — still record as partial
      results.push([...path]);
      return;
    }
    for (const next of nexts) {
      if (!path.includes(next)) {
        dfs(next, [...path, next]);
      }
    }
  }

  dfs(startStateId, [startStateId]);
  return results;
}

/**
 * Returns the available next state IDs from a given state.
 */
export function getNextStates(stateId, transitions) {
  return transitions.filter(t => t.from === stateId).map(t => ({
    stateId: t.to,
    condition: t.condition,
    isSystemTriggered: t.isSystemTriggered,
    isTimeBased: t.isTimeBased,
  }));
}

// ── Persona filtering ─────────────────────────────────────────────────────────

/**
 * Returns events at a given state relevant to the given persona role mapping.
 * If roleMapping is null or cross-cutting, returns all events at that state.
 */
export function getPersonaEventsAtState(stateId, events, roleMapping) {
  const atState = events.filter(e => e.state === stateId);
  if (!roleMapping || roleMapping.isCrossCutting || !roleMapping.roles.length) {
    return atState;
  }
  return atState.filter(e =>
    roleMapping.roles.some(role => e.actors?.[role] === true)
  );
}

// ── Coverage / gap analysis ───────────────────────────────────────────────────

/**
 * For a state, computes gap status against the persona's relevant events.
 * Returns 'covered' | 'partial' | 'gap' | 'na'
 */
export function getStateGapStatus(stateId, personaEvents, mappings) {
  if (personaEvents.length === 0) return 'na';
  const mappedEventIds = new Set(
    mappings.filter(m => m.stateId === stateId && m.eventId).map(m => m.eventId)
  );
  const covered = personaEvents.filter(e => mappedEventIds.has(e.id)).length;
  if (covered === 0) return 'gap';
  if (covered < personaEvents.length) return 'partial';
  return 'covered';
}

/**
 * For each event at a state, returns whether it has a mapped catalogue item.
 */
export function getEventCoverageFlags(stateId, personaEvents, mappings) {
  const mappedEventIds = new Set(
    mappings.filter(m => m.stateId === stateId && m.eventId).map(m => m.eventId)
  );
  return personaEvents.map(evt => ({
    ...evt,
    isCovered: mappedEventIds.has(evt.id),
  }));
}

/**
 * Returns catalogue items mapped to a given state (via stateId in mappings).
 * Deduplicates by catalogueRef.
 */
export function getFeaturesAtState(stateId, mappings, catalogueItems) {
  const refs = [...new Set(mappings.filter(m => m.stateId === stateId).map(m => m.catalogueRef))];
  return refs.map(ref => catalogueItems.find(i => i.ref === ref)).filter(Boolean);
}

// ── WA tasks ─────────────────────────────────────────────────────────────────

/**
 * Returns WA tasks triggered by events at a given state.
 * Returns [{ taskName, taskId, alignment, eventName }]
 */
export function getWaTasksAtState(stateId, events, waTasks, waMappings) {
  const eventNamesAtState = new Set(events.filter(e => e.state === stateId).map(e => e.name));
  const results = [];
  for (const mapping of waMappings) {
    const matchingEventNames = mapping.eventIds.filter(name => eventNamesAtState.has(name));
    if (matchingEventNames.length === 0) continue;
    const task = waTasks.find(t => t.id === mapping.waTaskId);
    if (!task) continue;
    for (const evtName of matchingEventNames) {
      results.push({
        taskId: task.id,
        taskName: task.taskName,
        alignment: task.alignment,
        eventName: evtName,
      });
    }
  }
  return results;
}

// ── Path summaries ────────────────────────────────────────────────────────────

const GAP_COLOURS = {
  covered: '#16a34a',
  partial: '#d97706',
  gap: '#dc2626',
  na: '#475569',
};

const GAP_LABELS = {
  covered: '100%',
  partial: 'partial',
  gap: 'gap',
  na: 'n/a',
};

export function getGapStyle(status) {
  return { color: GAP_COLOURS[status] ?? GAP_COLOURS.na, label: GAP_LABELS[status] ?? 'n/a' };
}

/**
 * Enriches a set of paths with summary metrics for the all-paths overview.
 * Returns [{ path, label, stepCount, gapCount, coverageScore, isComplete }]
 */
export function buildPathSummaries(paths, states, events, mappings, roleMapping) {
  return paths.map((path, idx) => {
    const stateMap = Object.fromEntries(states.map(s => [s.id, s]));
    let gapCount = 0;
    let coveredCount = 0;
    let applicableCount = 0;

    for (const stateId of path) {
      const personaEvents = getPersonaEventsAtState(stateId, events, roleMapping);
      const status = getStateGapStatus(stateId, personaEvents, mappings);
      if (status === 'gap') gapCount++;
      if (status !== 'na') {
        applicableCount++;
        if (status === 'covered') coveredCount++;
        if (status === 'partial') coveredCount += 0.5;
      }
    }

    const coverageScore = applicableCount > 0
      ? Math.round((coveredCount / applicableCount) * 100)
      : null;

    const lastState = stateMap[path[path.length - 1]];
    const isComplete = lastState?.isEndState ?? false;

    const stateLabels = path.map(id => stateMap[id]?.uiLabel ?? id);
    const label = stateLabels.join(' → ');

    return { path, label, stepCount: path.length, gapCount, coverageScore, isComplete, idx };
  });
}
