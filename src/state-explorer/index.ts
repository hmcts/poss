import type { State, Transition, Event } from '../data-model/schemas.js';

export { getPersonasForState } from './persona-helpers.ts';

// ── Colour mapping ──────────────────────────────────────────────────

export interface StateColor {
  background: string;
  border: string;
  text: string;
}

export function getStateColor(state: State): StateColor {
  if (state.isEndState) {
    return { background: '#1F2937', border: '#374151', text: '#FFFFFF' };
  }
  if (state.isDraftLike) {
    return { background: '#FEF3C7', border: '#F59E0B', text: '#000000' };
  }
  if (state.isLive) {
    return { background: '#D1FAE5', border: '#10B981', text: '#000000' };
  }
  if (state.completeness < 50) {
    return { background: '#F3F4F6', border: '#9CA3AF', text: '#000000' };
  }
  return { background: '#F9FAFB', border: '#D1D5DB', text: '#000000' };
}

// ── Edge styling ────────────────────────────────────────────────────

export interface EdgeStyle {
  strokeDasharray: string | undefined;
  animated: boolean;
}

export function getEdgeStyle(transition: Transition): EdgeStyle {
  if (transition.isTimeBased) {
    return { strokeDasharray: '2 2', animated: true };
  }
  if (transition.isSystemTriggered) {
    return { strokeDasharray: '5 5', animated: false };
  }
  return { strokeDasharray: undefined, animated: false };
}

// ── State to Node mapping ───────────────────────────────────────────

export interface ReactFlowNode {
  id: string;
  data: {
    label: string;
    technicalName: string;
    completeness: number;
  };
  type: string;
  style: {
    background: string;
    border: string;
    color: string;
  };
  position: { x: number; y: number };
}

export function statesToNodes(states: State[]): ReactFlowNode[] {
  return states.map((state, index) => {
    const color = getStateColor(state);
    return {
      id: state.id,
      data: {
        label: state.uiLabel,
        technicalName: state.technicalName,
        completeness: state.completeness,
      },
      type: 'default',
      style: {
        background: color.background,
        border: `2px solid ${color.border}`,
        color: color.text,
      },
      position: { x: 0, y: index * 100 },
    };
  });
}

// ── Transition to Edge mapping ──────────────────────────────────────

export interface ReactFlowEdge {
  id: string;
  source: string;
  target: string;
  label: string;
  style: {
    strokeDasharray?: string;
  };
  animated: boolean;
}

export function transitionsToEdges(transitions: Transition[]): ReactFlowEdge[] {
  return transitions.map((t) => {
    const edgeStyle = getEdgeStyle(t);
    return {
      id: `${t.from}->${t.to}`,
      source: t.from,
      target: t.to,
      label: t.condition ?? '',
      style: {
        ...(edgeStyle.strokeDasharray ? { strokeDasharray: edgeStyle.strokeDasharray } : {}),
      },
      animated: edgeStyle.animated,
    };
  });
}

// ── State detail aggregation ────────────────────────────────────────

export interface StateDetail {
  state: State | undefined;
  events: Event[];
  actorSummary: Record<string, number>;
}

export function getStateDetail(
  stateId: string,
  states: State[],
  events: Event[],
): StateDetail {
  const state = states.find((s) => s.id === stateId);
  const stateEvents = events.filter((e) => e.state === stateId);

  const actorSummary: Record<string, number> = {};
  for (const event of stateEvents) {
    for (const [actor, canPerform] of Object.entries(event.actors)) {
      if (canPerform) {
        actorSummary[actor] = (actorSummary[actor] ?? 0) + 1;
      }
    }
  }

  return { state, events: stateEvents, actorSummary };
}

// ── Build graph (convenience) ───────────────────────────────────────

export interface Graph {
  nodes: ReactFlowNode[];
  edges: ReactFlowEdge[];
}

export function buildGraph(states: State[], transitions: Transition[]): Graph {
  return {
    nodes: statesToNodes(states),
    edges: transitionsToEdges(transitions),
  };
}
