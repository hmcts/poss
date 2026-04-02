'use client';

import { useState, useCallback, useMemo } from 'react';
import { ReactFlow, Background, Controls, type Node, type Edge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useApp } from '../providers';
import { prepareGraphData, prepareNodeWithBadge, prepareStateDetailPanel, getGraphLegend, getEdgeLegend } from '../../src/ui-state-explorer/index';
import { getNodeWaBadge, getStateDetailWaTasks, getTransitionWaTasks } from '../../src/ui-wa-tasks/state-overlay-helpers';
import { getAboutSections } from '../../src/ui-about-state-explorer/index.js';
import { blobToWaTasks, blobToWaMappings } from '../../src/ref-data/adapter';
import { getPersonasForState } from '../../src/state-explorer/persona-helpers';

export default function StateExplorerPage() {
  const { modelData, refData } = useApp();
  const waTasks = useMemo(() => blobToWaTasks(refData), [refData]);
  const waMappings = useMemo(() => blobToWaMappings(refData), [refData]);
  const [selectedStateId, setSelectedStateId] = useState<string | null>(null);

  const graphData = useMemo(() => prepareGraphData(modelData.states, modelData.transitions), [modelData.states, modelData.transitions]);

  const nodes: Node[] = useMemo(() =>
    graphData.nodes.map((n) => {
      const state = modelData.states.find((s) => s.id === n.id);
      const badge = state ? prepareNodeWithBadge(state) : null;
      const waBadge = getNodeWaBadge(n.id, modelData.events, waTasks, waMappings);
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
              {waBadge && (
                <div className="text-[9px] mt-1 px-1.5 py-0.5 rounded-full inline-block font-medium ml-1"
                  style={{ backgroundColor: waBadge.colour + '20', color: waBadge.colour, border: `1px solid ${waBadge.colour}40` }}>
                  {waBadge.label}
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
  const personas = selectedStateId ? getPersonasForState(refData, selectedStateId) : [];
  const waDetailTasks = selectedStateId ? getStateDetailWaTasks(selectedStateId, modelData.events, waTasks, waMappings) : [];
  const transitionWaTasks = selectedStateId
    ? getTransitionWaTasks(selectedStateId, modelData.states, modelData.transitions, modelData.events, waTasks, waMappings)
    : [];
  const graphLegend = getGraphLegend();
  const edgeLegend = getEdgeLegend();

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="space-y-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-100">State Explorer</h1>
          <p className="text-sm text-slate-400 mt-1">
            Interactive graph of possession case states and transitions
          </p>
        </div>
        <AboutPanel />
      </div>

    <div className="flex gap-5" style={{ height: 'calc(100vh - 180px)' }}>
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
            <>
              <div className="h-px bg-slate-700/30 my-3" />
              <h4 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Personas</h4>
              {personas.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {personas.map((persona) => (
                    <span key={persona.id} className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-slate-700/50 text-slate-300">
                      {persona.roles.join(', ')}
                      {persona.isCrossCutting && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium bg-amber-500/20 text-amber-400 border border-amber-500/30 ml-1">cross-cutting</span>
                      )}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-[11px] text-slate-600">No personas linked — add in Reference Data Editor</p>
              )}
            </>
            {transitionWaTasks.length > 0 && (
              <>
                <div className="h-px bg-slate-700/30 my-3" />
                <h4 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Next States &amp; WA Tasks</h4>
                <div className="space-y-3">
                  {transitionWaTasks.map((tw) => (
                    <div key={tw.targetStateId} className="rounded-lg border border-slate-700/20 bg-slate-900/30 p-3">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <svg className="w-3 h-3 text-slate-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                        <span className="text-[12px] font-medium text-slate-200">{tw.targetStateLabel}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 mb-2 ml-[18px]">
                        {tw.condition}
                        {tw.isSystemTriggered && <span className="ml-1 text-slate-600">(system)</span>}
                        {tw.isTimeBased && <span className="ml-1 text-slate-600">(timed)</span>}
                      </div>
                      {tw.events.length > 0 ? (
                        <ul className="space-y-1.5 ml-[18px]">
                          {tw.events.map((evt) =>
                            evt.waTasks.map((wt) => (
                              <li key={`${evt.eventName}-${wt.taskName}`} className="flex items-start gap-1.5">
                                <span className="text-[9px] mt-0.5 px-1.5 py-0.5 rounded-full font-medium shrink-0"
                                  style={{ backgroundColor: wt.badge.colour + '20', color: wt.badge.colour, border: `1px solid ${wt.badge.colour}40` }}>
                                  {wt.badge.label}
                                </span>
                                <span className="text-[11px] text-slate-300" title={wt.tooltip}>{wt.taskName}</span>
                              </li>
                            ))
                          )}
                        </ul>
                      ) : (
                        <p className="text-[10px] text-slate-600 ml-[18px]">No WA tasks for this transition</p>
                      )}
                    </div>
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
    </div>
  );
}

function AboutPanel() {
  const [open, setOpen] = useState(false);
  const sections = getAboutSections();
  return (
    <div className="bg-slate-900/40 border border-slate-700/30 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm text-slate-400 hover:text-slate-200 hover:bg-slate-800/30 transition-colors"
      >
        <span className="font-medium">About this page — how to read the graph and what each visual means</span>
        <svg
          className={`w-4 h-4 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="px-4 pb-4 space-y-4 text-sm text-slate-400 border-t border-slate-700/30 pt-4">
          {sections.map((section) => (
            <div key={section.key}>
              <h3 className="text-slate-200 font-medium mb-1">{section.heading}</h3>
              <p>{section.body}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
