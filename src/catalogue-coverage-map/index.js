// ── matchByEventTrigger ───────────────────────────────────────────────────────

export function matchByEventTrigger(item, events) {
  if (!item.eventTrigger) return [];
  const trigger = item.eventTrigger.toLowerCase();
  return events
    .filter(ev => ev.name.toLowerCase().includes(trigger))
    .map(ev => ({
      catalogueRef: item.ref,
      stateId: ev.state,
      eventId: ev.id,
      matchConfidence: 'exact',
    }));
}

// ── matchByDomainAndFeature ───────────────────────────────────────────────────

export function matchByDomainAndFeature(item, states, events) {
  const tuples = [];

  for (const state of states) {
    if (item.domainGroup && state.domainGroup === item.domainGroup) {
      tuples.push({
        catalogueRef: item.ref,
        stateId: state.id,
        eventId: null,
        matchConfidence: 'inferred',
      });
    }
  }

  if (item.feature) {
    const featureTokens = item.feature.toLowerCase().split(/\s+/);
    for (const ev of events) {
      const evNameLower = ev.name.toLowerCase();
      const matches = featureTokens.some(token => token.length > 2 && evNameLower.includes(token));
      if (matches) {
        tuples.push({
          catalogueRef: item.ref,
          stateId: ev.state,
          eventId: ev.id,
          matchConfidence: 'inferred',
        });
      }
    }
  }

  return tuples;
}

// ── filterByReleaseScope ──────────────────────────────────────────────────────

export function filterByReleaseScope(items, scope) {
  if (scope === 'r1') return items.filter(i => i.release1 === 'yes');
  if (scope === 'r1+tbc') return items.filter(i => i.release1 !== 'no');
  return [...items];
}

// ── filterByClaimTypeRelevance ────────────────────────────────────────────────

export function filterByClaimTypeRelevance(items, claimTypeId) {
  return items.filter(item => {
    if (item.domainGroup === 'claims-counterclaim') {
      return claimTypeId.toUpperCase().includes('COUNTERCLAIM');
    }
    if (item.domainGroup && item.domainGroup.startsWith('enforcement-')) {
      return claimTypeId.toUpperCase().includes('ENFORCEMENT');
    }
    return true;
  });
}

// ── calculatePersonaCoverage ──────────────────────────────────────────────────

export function calculatePersonaCoverage(persona, mappings, states, events, roleMapping) {
  if (roleMapping.isCrossCutting) {
    return {
      persona,
      resolvedRoles: [],
      totalStates: 0,
      coveredStates: 0,
      totalTransitions: 0,
      coveredTransitions: 0,
      coveragePct: null,
      isCrossCutting: true,
    };
  }

  const roles = roleMapping.roles;
  const relevantEvents = events.filter(ev =>
    roles.some(role => ev.actors && ev.actors[role] === true)
  );
  const relevantStateIds = [...new Set(relevantEvents.map(ev => ev.state))];
  const coveredStateIds = new Set(mappings.map(m => m.stateId));
  const coveredStates = relevantStateIds.filter(id => coveredStateIds.has(id)).length;
  const totalStates = relevantStateIds.length;
  const coveragePct = totalStates > 0 ? Math.round(coveredStates / totalStates * 100) : 0;

  return {
    persona,
    resolvedRoles: roles,
    totalStates,
    coveredStates,
    totalTransitions: relevantEvents.length,
    coveredTransitions: mappings.filter(m => m.eventId !== null).length,
    coveragePct,
    isCrossCutting: false,
  };
}

// ── identifyGaps ──────────────────────────────────────────────────────────────

export function identifyGaps(mappings, events, persona) {
  const stateEvents = new Map();
  for (const ev of events) {
    if (!stateEvents.has(ev.state)) stateEvents.set(ev.state, []);
    stateEvents.get(ev.state).push(ev);
  }

  const coveredEventIds = new Set(mappings.map(m => m.eventId).filter(Boolean));

  const gaps = [];
  for (const [stateId, stateEvList] of stateEvents) {
    const coveredCount = stateEvList.filter(ev => coveredEventIds.has(ev.id)).length;
    const totalCount = stateEvList.length;
    const hasOpenQ = stateEvList.some(ev => ev.hasOpenQuestions);

    if (coveredCount === 0 && hasOpenQ) {
      gaps.push({ stateId, severity: 'critical' });
    } else if (coveredCount === 0) {
      gaps.push({ stateId, severity: 'gap' });
    } else if (coveredCount < totalCount) {
      gaps.push({ stateId, severity: 'partial' });
    }
  }

  const order = { critical: 0, gap: 1, partial: 2 };
  gaps.sort((a, b) => order[a.severity] - order[b.severity]);
  return gaps;
}

// ── traceJourneyCompleteness ──────────────────────────────────────────────────

export function traceJourneyCompleteness(persona, coverageMap, graph) {
  if (persona === null) return null;

  const { states, transitions } = graph;
  const terminalIds = new Set(states.filter(s => s.isEndState).map(s => s.id));
  const startState = states.find(s => !s.isEndState);
  if (!startState) return null;

  const adjMap = new Map();
  for (const t of transitions) {
    if (!adjMap.has(t.from)) adjMap.set(t.from, []);
    adjMap.get(t.from).push(t.to);
  }

  const allPaths = [];
  const dfs = (node, path, visited) => {
    if (terminalIds.has(node)) { allPaths.push([...path, node]); return; }
    const nexts = adjMap.get(node) || [];
    for (const next of nexts) {
      if (!visited.has(next)) {
        visited.add(next);
        dfs(next, [...path, node], visited);
        visited.delete(next);
      }
    }
  };

  dfs(startState.id, [], new Set([startState.id]));

  const canReachTerminal = allPaths.length > 0;
  if (!canReachTerminal) {
    return { persona, canReachTerminal: false, bestPathCoverage: 0, worstPathCoverage: 0, blockingGaps: [] };
  }

  const pathScores = allPaths.map(path => {
    const vals = path.map(id => coverageMap[id] ?? 0);
    return vals.reduce((a, b) => a + b, 0) / vals.length;
  });

  const bestPathCoverage = Math.max(...pathScores);
  const worstPathCoverage = Math.min(...pathScores);

  const allPathStateIds = new Set(allPaths.flat());
  const blockingGaps = [...allPathStateIds]
    .filter(id => (coverageMap[id] ?? 0) === 0)
    .map(id => ({ stateId: id }));

  return { persona, canReachTerminal, bestPathCoverage, worstPathCoverage, blockingGaps };
}

// ── surfaceDecisions ──────────────────────────────────────────────────────────

export function surfaceDecisions(events, items) {
  const modelDecisions = events
    .filter(ev => ev.hasOpenQuestions === true)
    .map(ev => ({ source: 'model', id: ev.id, name: ev.name }));

  const catDecisions = items
    .filter(item =>
      item.userStory === null ||
      item.ucdRequired === null ||
      (item.notes && item.notes.includes('TBC'))
    )
    .map(item => ({ source: 'catalogue', ref: item.ref }));

  return [...modelDecisions, ...catDecisions];
}

// ── exportGapListCsv ──────────────────────────────────────────────────────────

export function exportGapListCsv(gaps, persona) {
  const header = 'State,Event,Severity,Persona,Domain Group,Open Questions,Also Has WA Gap';
  const rows = gaps.map(g => [
    g.stateId ?? '',
    g.eventId ?? '',
    g.severity ?? '',
    g.persona ?? '',
    g.domainGroup ?? '',
    g.hasOpenQuestions ? 'yes' : 'no',
    g.hasWaGap ? 'yes' : 'no',
  ].join(','));

  const content = [header, ...rows].join('\n');
  const filename = persona ? `coverage-gaps-${persona}.csv` : 'coverage-gaps-all.csv';
  return { content, filename, mimeType: 'text/csv' };
}
