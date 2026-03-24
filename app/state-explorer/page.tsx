'use client';

import { useState, useCallback, useMemo } from 'react';
import { ReactFlow, Background, Controls, type Node, type Edge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useApp } from '../providers';
import { prepareGraphData, prepareNodeWithBadge, prepareStateDetailPanel, getGraphLegend, getEdgeLegend } from '../../src/ui-state-explorer/index';

export default function StateExplorerPage() {
  const { modelData } = useApp();
  const [selectedStateId, setSelectedStateId] = useState<string | null>(null);

  const graphData = useMemo(() => prepareGraphData(modelData.states, modelData.transitions), [modelData.states, modelData.transitions]);

  const nodes: Node[] = useMemo(() =>
    graphData.nodes.map((n) => {
      const state = modelData.states.find((s) => s.id === n.id);
      const badge = state ? prepareNodeWithBadge(state) : null;
      return {
        id: n.id,
        position: n.position,
        data: {
          label: (
            <div className="text-center px-1">
              <div className="font-medium text-[11px]" style={{ color: (n.style as any)?.color }}>{n.data.label}</div>
              {badge && (
                <div className="text-[9px] mt-1 px-1.5 py-0.5 rounded-full inline-block font-medium"
                  style={{ backgroundColor: badge.badge.color.background, color: badge.badge.color.text, border: `1px solid ${badge.badge.color.border}` }}>
                  {badge.badge.label}
                </div>
              )}
            </div>
          ),
        },
        style: {
          ...n.style,
          borderRadius: '10px',
          padding: '10px 6px',
          fontSize: '12px',
          width: 150,
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
        },
      };
    }),
  [graphData.nodes, modelData.states]);

  const edges: Edge[] = useMemo(() =>
    graphData.edges.map((e) => ({
      id: e.id, source: e.source, target: e.target, label: e.label, animated: e.animated,
      style: { stroke: '#475569', strokeWidth: 1.5, ...(e.style.strokeDasharray ? { strokeDasharray: e.style.strokeDasharray } : {}) },
      labelStyle: { fill: '#64748b', fontSize: 9, fontFamily: 'Inter, sans-serif' },
      labelBgStyle: { fill: '#0f172a', fillOpacity: 0.8 },
      labelBgPadding: [6, 3] as [number, number],
      labelBgBorderRadius: 4,
    })),
  [graphData.edges]);

  const onNodeClick = useCallback((_: unknown, node: Node) => {
    setSelectedStateId((prev) => (prev === node.id ? null : node.id));
  }, []);

  const detail = selectedStateId ? prepareStateDetailPanel(selectedStateId, modelData.states, modelData.events) : null;
  const graphLegend = getGraphLegend();
  const edgeLegend = getEdgeLegend();

  return (
    <div className="flex gap-5" style={{ height: 'calc(100vh - 104px)' }}>
      <div className="flex-1 rounded-xl border border-slate-700/30 bg-slate-900/40 overflow-hidden relative shadow-lg shadow-black/20">
        <ReactFlow nodes={nodes} edges={edges} onNodeClick={onNodeClick} fitView proOptions={{ hideAttribution: true }}>
          <Background color="#1e293b" gap={24} size={1} />
          <Controls />
        </ReactFlow>
      </div>

      <div className="w-[280px] shrink-0 space-y-4">
        <div className="rounded-xl border border-slate-700/30 bg-slate-800/40 backdrop-blur p-5">
          <h3 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-3">States</h3>
          <div className="space-y-2.5">
            {graphLegend.map((entry) => (
              <div key={entry.label} className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded" style={{ backgroundColor: entry.color, boxShadow: `0 0 6px ${entry.color}30` }} />
                <span className="text-[12px] text-slate-400">{entry.label}</span>
              </div>
            ))}
          </div>
          <div className="h-px bg-slate-700/30 my-4" />
          <h3 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-3">Transitions</h3>
          <div className="space-y-2.5">
            {edgeLegend.map((entry) => (
              <div key={entry.label} className="flex items-center gap-2.5">
                <svg className="w-6 h-2 shrink-0" viewBox="0 0 24 4">
                  <line x1="0" y1="2" x2="24" y2="2" stroke="#475569" strokeWidth="2" strokeDasharray={entry.style.strokeDasharray ?? undefined} />
                </svg>
                <span className="text-[12px] text-slate-400">{entry.label}</span>
              </div>
            ))}
          </div>
        </div>

        {detail && detail.state ? (
          <div className="rounded-xl border border-slate-700/30 bg-slate-800/40 backdrop-blur p-5">
            <h3 className="text-sm font-medium text-slate-200 mb-0.5">{detail.state.uiLabel}</h3>
            <p className="text-[11px] text-slate-600 font-mono mb-3">{detail.state.technicalName}</p>
            <div className="text-[12px] text-slate-400 mb-3">
              Completeness: <span className="text-slate-200 font-medium">{detail.state.completeness}%</span>
            </div>
            {detail.formattedEvents.length > 0 && (
              <>
                <div className="h-px bg-slate-700/30 my-3" />
                <h4 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Events</h4>
                <ul className="space-y-2">
                  {detail.formattedEvents.map((evt) => (
                    <li key={evt.name}>
                      <div className="flex items-center gap-1.5">
                        {evt.indicator.indicatorType === 'warning' && (
                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: evt.indicator.indicatorColor }} />
                        )}
                        <span className="text-[12px] text-slate-300">{evt.name}</span>
                      </div>
                      <div className="text-[11px] text-slate-600 ml-3">{evt.actors.join(', ')}</div>
                    </li>
                  ))}
                </ul>
              </>
            )}
            {Object.keys(detail.actorSummary).length > 0 && (
              <>
                <div className="h-px bg-slate-700/30 my-3" />
                <h4 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Actors</h4>
                <div className="flex flex-wrap gap-1.5">
                  {Object.entries(detail.actorSummary).map(([actor, count]) => (
                    <span key={actor} className="text-[11px] px-2 py-0.5 rounded-md bg-slate-700/50 text-slate-400">{actor}: {count}</span>
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="rounded-xl border border-slate-700/30 bg-slate-800/40 p-5 text-center">
            <p className="text-[12px] text-slate-600">Click a state node to inspect</p>
          </div>
        )}
      </div>
    </div>
  );
}
