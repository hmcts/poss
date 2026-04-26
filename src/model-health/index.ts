interface State {
  id: string;
  technicalName: string;
  uiLabel: string;
  claimType: string;
  isDraftLike: boolean;
  isLive: boolean;
  isEndState: boolean;
  completeness: number;
}

interface Transition {
  from: string;
  to: string;
  condition: string | null;
  isSystemTriggered: boolean;
  isTimeBased: boolean;
}

interface Event {
  id: string;
  name: string;
  claimType: string;
  state: string;
  isSystemEvent: boolean;
  notes: string;
  hasOpenQuestions: boolean;
  actors: Record<string, boolean>;
}

interface ModelHealthSummary {
  openQuestions: number;
  lowCompletenessStates: State[];
  unreachableStates: State[];
  hasValidEndPath: boolean;
  overallScore: 'good' | 'fair' | 'poor';
}

export function getOpenQuestionCount(events: Event[]): number {
  return events.filter(e => e.hasOpenQuestions).length;
}

export function getLowCompletenessStates(states: State[], threshold: number = 50): State[] {
  return states.filter(s => s.completeness < threshold);
}

export function getUnreachableStates(states: State[], transitions: Transition[]): State[] {
  const hasIncoming = new Set<string>();
  for (const t of transitions) {
    hasIncoming.add(t.to);
  }
  return states.filter(s => !hasIncoming.has(s.id) && !s.isDraftLike);
}

export function canReachEndState(states: State[], transitions: Transition[]): boolean {
  const initialStates = states.filter(s => s.isDraftLike);
  const endStateIds = new Set(states.filter(s => s.isEndState).map(s => s.id));

  if (initialStates.length === 0 || endStateIds.size === 0) {
    return false;
  }

  // Build adjacency list
  const adj = new Map<string, string[]>();
  for (const t of transitions) {
    if (!adj.has(t.from)) {
      adj.set(t.from, []);
    }
    adj.get(t.from)!.push(t.to);
  }

  // BFS from all initial states
  const visited = new Set<string>();
  const queue: string[] = initialStates.map(s => s.id);
  for (const id of queue) {
    visited.add(id);
  }

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (endStateIds.has(current)) {
      return true;
    }
    const neighbors = adj.get(current) || [];
    for (const next of neighbors) {
      if (!visited.has(next)) {
        visited.add(next);
        queue.push(next);
      }
    }
  }

  return false;
}

export function getModelHealthSummary(
  states: State[],
  transitions: Transition[],
  events: Event[],
): ModelHealthSummary {
  const openQuestions = getOpenQuestionCount(events);
  const lowCompletenessStates = getLowCompletenessStates(states);
  const unreachableStates = getUnreachableStates(states, transitions);
  const hasValidEndPath = canReachEndState(states, transitions);

  let overallScore: 'good' | 'fair' | 'poor';
  if (!hasValidEndPath || unreachableStates.length > 0) {
    overallScore = 'poor';
  } else if (openQuestions === 0 && lowCompletenessStates.length === 0) {
    overallScore = 'good';
  } else {
    overallScore = 'fair';
  }

  return {
    openQuestions,
    lowCompletenessStates,
    unreachableStates,
    hasValidEndPath,
    overallScore,
  };
}
