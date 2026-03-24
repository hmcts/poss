import type { State, Transition, Event } from '../data-model/schemas.js';
import { buildGraph, getStateDetail } from '../state-explorer/index.js';
import { getCompletenessBadge, getEventIndicator } from '../uncertainty-display/index.js';

// ── Layout constants ────────────────────────────────────────────────

const NODE_X_GAP = 250;
const NODE_Y_GAP = 150;

// ── Types ───────────────────────────────────────────────────────────

export interface LayoutNode {
  id: string;
  position: { x: number; y: number };
  [key: string]: unknown;
}

export interface GraphLegendEntry {
  label: string;
  color: string;
  description: string;
}

export interface EdgeLegendEntry {
  label: string;
  style: { strokeDasharray: string | undefined; animated: boolean };
  description: string;
}

export interface FormattedEvent {
  name: string;
  actors: string[];
  indicator: {
    hasOpenQuestions: boolean;
    indicatorType: 'warning' | 'none';
    indicatorColor: string;
  };
}

export interface StateDetailPanel {
  state: State | undefined;
  formattedEvents: FormattedEvent[];
  actorSummary: Record<string, number>;
}

export interface NodeWithBadge {
  stateId: string;
  label: string;
  completeness: number;
  badge: {
    label: string;
    level: string;
    color: { background: string; border: string; text: string };
  };
}

// ── calculateAutoLayout ─────────────────────────────────────────────

export function calculateAutoLayout<T extends { id: string; position: { x: number; y: number } }>(
  nodes: T[],
  edges: { source: string; target: string }[],
): T[] {
  if (nodes.length === 0) return [];

  // Build adjacency and in-degree maps
  const inDegree = new Map<string, number>();
  const predecessors = new Map<string, string[]>();
  for (const node of nodes) {
    inDegree.set(node.id, 0);
    predecessors.set(node.id, []);
  }
  for (const edge of edges) {
    if (inDegree.has(edge.target)) {
      inDegree.set(edge.target, (inDegree.get(edge.target) ?? 0) + 1);
    }
    if (predecessors.has(edge.target)) {
      predecessors.get(edge.target)!.push(edge.source);
    }
  }

  // Assign layers via BFS (Kahn's algorithm)
  const layerMap = new Map<string, number>();
  const queue: string[] = [];

  for (const node of nodes) {
    if ((inDegree.get(node.id) ?? 0) === 0) {
      queue.push(node.id);
      layerMap.set(node.id, 0);
    }
  }

  let head = 0;
  while (head < queue.length) {
    const current = queue[head++];
    const currentLayer = layerMap.get(current) ?? 0;

    for (const edge of edges) {
      if (edge.source === current) {
        const targetId = edge.target;
        const newLayer = currentLayer + 1;
        const existing = layerMap.get(targetId);

        if (existing === undefined) {
          layerMap.set(targetId, newLayer);
        } else if (newLayer > existing) {
          layerMap.set(targetId, newLayer);
        }

        inDegree.set(targetId, (inDegree.get(targetId) ?? 1) - 1);
        if ((inDegree.get(targetId) ?? 0) <= 0) {
          // Only add to queue if not already processed
          if (!queue.includes(targetId)) {
            queue.push(targetId);
          }
        }
      }
    }
  }

  // Any nodes not yet assigned (cycles or disconnected) go to layer 0
  for (const node of nodes) {
    if (!layerMap.has(node.id)) {
      layerMap.set(node.id, 0);
    }
  }

  // Group nodes by layer
  const layers = new Map<number, string[]>();
  for (const node of nodes) {
    const layer = layerMap.get(node.id) ?? 0;
    if (!layers.has(layer)) {
      layers.set(layer, []);
    }
    layers.get(layer)!.push(node.id);
  }

  // Assign positions
  const positionMap = new Map<string, { x: number; y: number }>();
  for (const [layer, nodeIds] of layers.entries()) {
    const totalWidth = (nodeIds.length - 1) * NODE_X_GAP;
    const startX = -totalWidth / 2;
    for (let i = 0; i < nodeIds.length; i++) {
      positionMap.set(nodeIds[i], {
        x: nodeIds.length === 1 ? 0 : startX + i * NODE_X_GAP,
        y: layer * NODE_Y_GAP,
      });
    }
  }

  // Return new nodes with updated positions
  return nodes.map((node) => ({
    ...node,
    position: positionMap.get(node.id) ?? { x: 0, y: 0 },
  }));
}

// ── prepareGraphData ────────────────────────────────────────────────

export function prepareGraphData(states: State[], transitions: Transition[]) {
  const graph = buildGraph(states, transitions);
  const layoutNodes = calculateAutoLayout(graph.nodes, graph.edges);
  return { nodes: layoutNodes, edges: graph.edges };
}

// ── prepareNodeWithBadge ────────────────────────────────────────────

export function prepareNodeWithBadge(state: State): NodeWithBadge {
  const badge = getCompletenessBadge(state);
  return {
    stateId: state.id,
    label: state.uiLabel,
    completeness: state.completeness,
    badge,
  };
}

// ── prepareStateDetailPanel ─────────────────────────────────────────

export function prepareStateDetailPanel(
  stateId: string,
  states: State[],
  events: Event[],
): StateDetailPanel {
  const detail = getStateDetail(stateId, states, events);

  const formattedEvents: FormattedEvent[] = detail.events.map((event) => {
    const actors = Object.entries(event.actors)
      .filter(([, canPerform]) => canPerform)
      .map(([actor]) => actor);

    const indicator = getEventIndicator(event);

    return {
      name: event.name,
      actors,
      indicator,
    };
  });

  return {
    state: detail.state,
    formattedEvents,
    actorSummary: detail.actorSummary,
  };
}

// ── getGraphLegend ──────────────────────────────────────────────────

export function getGraphLegend(): GraphLegendEntry[] {
  return [
    { label: 'Draft', color: '#FEF3C7', description: 'Draft or pre-issue state' },
    { label: 'Live', color: '#D1FAE5', description: 'Active live state' },
    { label: 'End State', color: '#1F2937', description: 'Terminal or closed state' },
    { label: 'Uncertain', color: '#F3F4F6', description: 'Low completeness or unknown state' },
  ];
}

// ── getEdgeLegend ───────────────────────────────────────────────────

export function getEdgeLegend(): EdgeLegendEntry[] {
  return [
    {
      label: 'User Action',
      style: { strokeDasharray: undefined, animated: false },
      description: 'Manual user-triggered transition',
    },
    {
      label: 'System Triggered',
      style: { strokeDasharray: '5 5', animated: false },
      description: 'Automatic system-triggered transition',
    },
    {
      label: 'Time Based',
      style: { strokeDasharray: '2 2', animated: true },
      description: 'Time-based automatic transition',
    },
  ];
}
