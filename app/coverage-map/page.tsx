'use client';

import { useState, useCallback, useMemo } from 'react';
import { ReactFlow, Background, Controls, type Node, type Edge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useApp } from '../providers';
import { prepareGraphData } from '../../src/ui-state-explorer/index';
import {
  matchByEventTrigger,
  matchByDomainAndFeature,
  filterByReleaseScope,
  identifyGaps,
} from '../../src/catalogue-coverage-map/index.js';
import {
  getPersonaRoleMapping,
  getCoverageStyle,
  getDistinctPersonas,
  groupByCrossGroup,
  buildCoverageSummaryCards,
} from '../../src/ui-catalogue-coverage-map/index.js';
import catalogueData from '../../data/product-catalogue.json';

const catalogue = catalogueData as any[];

export default function CoverageMapPage() {
  const { modelData } = useApp();
  const [selectedPersona, setSelectedPersona] = useState<string | null>(null);
  const [releaseScope, setReleaseScope] = useState<'r1' | 'r1+tbc' | 'all'>('r1+tbc');
  const [selectedStateId, setSelectedStateId] = useState<string | null>(null);

  const graphData = useMemo(() => prepareGraphData(modelData.states, modelData.transitions), [modelData.states, modelData.transitions]);

  const personas = useMemo(() => getDistinctPersonas(catalogue), []);
  const scopedItems = useMemo(() => filterByReleaseScope(catalogue, releaseScope), [releaseScope]);

  const personaRoleMapping = useMemo(
    () => (selectedPersona ? getPersonaRoleMapping(selectedPersona) : null),
    [selectedPersona],
  );

  const exactMappings = useMemo(
    () => scopedItems.flatMap((item: any) => matchByEventTrigger(item, modelData.events)),
    [scopedItems, modelData.events],
  );

  const inferredMappings = useMemo(() => {
    const exactKeys = new Set(exactMappings.map((m: any) => `${m.catalogueRef}:${m.stateId}:${m.eventId}`));
    return scopedItems
      .flatMap((item: any) => matchByDomainAndFeature(item, modelData.states, modelData.events))
      .filter((m: any) => !exactKeys.has(`${m.catalogueRef}:${m.stateId}:${m.eventId}`));
  }, [scopedItems, modelData.states, modelData.events, exactMappings]);

  const allMappings = useMemo(() => [...exactMappings, ...inferredMappings], [exactMappings, inferredMappings]);

  const crossCuttingItems = useMemo(() => {
    const mappedRefs = new Set(allMappings.map((m: any) => m.catalogueRef));
    return scopedItems.filter((item: any) => !mappedRefs.has(item.ref));
  }, [allMappings, scopedItems]);

  const coverageMap = useMemo(() => {
    const map: Record<string, number | null> = {};
    for (const state of modelData.states) {
      const stateEvents = modelData.events.filter((e) => e.state === state.id);
      if (stateEvents.length === 0) { map[state.id] = null; continue; }
      const coveredEventIds = new Set(allMappings.filter((m: any) => m.stateId === state.id && m.eventId).map((m: any) => m.eventId));
      const covered = stateEvents.filter((e) => coveredEventIds.has(e.id)).length;
      map[state.id] = Math.round((covered / stateEvents.length) * 100);
    }
    return map;
  }, [modelData.states, modelData.events, allMappings]);

  const gaps = useMemo(() => identifyGaps(allMappings, modelData.events, selectedPersona), [allMappings, modelData.events, selectedPersona]);
  const summaryCards = useMemo(() => buildCoverageSummaryCards(coverageMap, gaps, scopedItems), [coverageMap, gaps, scopedItems]);

  const nodes: Node[] = useMemo(() =>
    graphData.nodes.map((n: any) => {
      const state = modelData.states.find((s) => s.id === n.id);
      const pct = coverageMap[n.id] ?? null;
      const style = getCoverageStyle(pct);
      return {
        id: n.id,
        position: n.position,
        data: {
          label: (
            <div className="text-center px-1">
              <div className="font-medium text-[11px]" style={{ color: style.text }}>{state?.uiLabel ?? n.id}</div>
              <div className="text-[9px] mt-1 px-1.5 py-0.5 rounded-full inline-block font-medium"
                style={{ backgroundColor: style.badge + '33', color: style.text, border: `1px solid ${style.badge}66` }}>
                {style.label}
              </div>
            </div>
          ),
        },
        style: {
          backgroundColor: style.bg,
          border: `1px solid ${style.badge}40`,
          borderRadius: '10px',
          padding: '10px 6px',
          fontSize: '12px',
          width: 150,
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
        },
      };
    }),
  [graphData.nodes, modelData.states, coverageMap]);

  const edges: Edge[] = useMemo(() =>
    graphData.edges.map((e: any) => ({
      id: e.id, source: e.source, target: e.target, label: e.label, animated: e.animated,
      style: { stroke: '#475569', strokeWidth: 1.5 },
      labelStyle: { fill: '#64748b', fontSize: 9 },
      labelBgStyle: { fill: '#0f172a', fillOpacity: 0.8 },
      labelBgPadding: [6, 3] as [number, number],
      labelBgBorderRadius: 4,
    })),
  [graphData.edges]);

  const onNodeClick = useCallback((_: unknown, node: Node) => {
    setSelectedStateId((prev) => (prev === node.id ? null : node.id));
  }, []);

  const selectedState = selectedStateId ? modelData.states.find((s) => s.id === selectedStateId) : null;
  const selectedEvents = selectedStateId ? modelData.events.filter((e) => e.state === selectedStateId) : [];
  const mappedEventIds = new Set(allMappings.filter((m: any) => m.stateId === selectedStateId && m.eventId).map((m: any) => m.eventId));

  const crossGroups = useMemo(() => groupByCrossGroup(crossCuttingItems), [crossCuttingItems]);

  const SCOPES: { value: 'r1' | 'r1+tbc' | 'all'; label: string }[] = [
    { value: 'r1', label: 'R1' },
    { value: 'r1+tbc', label: 'R1+TBC' },
    { value: 'all', label: 'All' },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-slate-100">Coverage Map</h1>
        <p className="text-sm text-slate-400 mt-1">Catalogue-to-state coverage with gap analysis</p>
      </div>

      <div className="flex gap-5" style={{ height: 'calc(100vh - 160px)' }}>
        <div className="flex-1 rounded-xl border border-slate-700/30 bg-slate-900/40 overflow-hidden relative shadow-lg shadow-black/20">
          <ReactFlow nodes={nodes} edges={edges} onNodeClick={onNodeClick} fitView proOptions={{ hideAttribution: true }}>
            <Background color="#1e293b" gap={24} size={1} />
            <Controls />
          </ReactFlow>
        </div>

        <div className="w-[300px] shrink-0 space-y-3 overflow-y-auto h-full">
          {/* Controls */}
          <div className="rounded-xl border border-slate-700/30 bg-slate-800/40 backdrop-blur p-4 space-y-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">Persona</label>
              <select
                value={selectedPersona ?? ''}
                onChange={(e) => setSelectedPersona(e.target.value || null)}
                className="w-full text-sm bg-slate-900/60 text-slate-200 border border-slate-700/40 rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500/50 transition-all"
              >
                <option value="">All personas</option>
                {personas.map((p: string) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">Release Scope</label>
              <div className="flex rounded-lg overflow-hidden border border-slate-700/40">
                {SCOPES.map(({ value, label }) => (
                  <button key={value} onClick={() => setReleaseScope(value)}
                    className={`flex-1 text-[12px] py-1.5 transition-colors ${releaseScope === value ? 'bg-indigo-500/20 text-indigo-300' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/30'}`}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-2 gap-2">
            {summaryCards.map((card: any) => (
              <div key={card.label} className="rounded-xl border border-slate-700/30 bg-slate-800/40 p-3">
                <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">{card.label}</div>
                <div className="text-xl font-semibold text-slate-100">{card.value}</div>
                {card.sub && <div className="text-[10px] text-red-400 mt-0.5">{card.sub}</div>}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="rounded-xl border border-slate-700/30 bg-slate-800/40 p-4">
            <h3 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Coverage Legend</h3>
            {[
              { label: '100% covered', style: getCoverageStyle(100) },
              { label: 'Partial coverage', style: getCoverageStyle(50) },
              { label: 'No coverage (gap)', style: getCoverageStyle(0) },
              { label: 'Not applicable', style: getCoverageStyle(null) },
            ].map(({ label, style }) => (
              <div key={label} className="flex items-center gap-2 mb-1.5">
                <span className="w-3 h-3 rounded shrink-0" style={{ backgroundColor: style.badge }} />
                <span className="text-[12px] text-slate-400">{label}</span>
              </div>
            ))}
          </div>

          {/* Node detail */}
          {selectedState ? (
            <div className="rounded-xl border border-slate-700/30 bg-slate-800/40 p-4">
              <h3 className="text-sm font-medium text-slate-200 mb-0.5">{selectedState.uiLabel}</h3>
              <p className="text-[11px] text-slate-600 font-mono mb-3">{selectedState.technicalName}</p>
              <div className="h-px bg-slate-700/30 mb-3" />
              <h4 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Events</h4>
              <ul className="space-y-2">
                {selectedEvents.length === 0 && <li className="text-[11px] text-slate-600">No events at this state</li>}
                {selectedEvents.map((evt) => {
                  const covered = mappedEventIds.has(evt.id);
                  return (
                    <li key={evt.id} className="flex items-start gap-2">
                      <span className={`mt-0.5 shrink-0 w-1.5 h-1.5 rounded-full`}
                        style={{ backgroundColor: covered ? '#16a34a' : '#dc2626' }} />
                      <div>
                        <div className="text-[12px] text-slate-300">{evt.name}</div>
                        {!covered && <span className="text-[10px] text-red-400">gap</span>}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : (
            <div className="rounded-xl border border-slate-700/30 bg-slate-800/40 p-5 text-center">
              <p className="text-[12px] text-slate-600">Click a node to inspect</p>
            </div>
          )}
        </div>
      </div>

      {/* Cross-cutting requirements */}
      <div className="rounded-xl border border-slate-700/30 bg-slate-800/40 p-5">
        <h2 className="text-sm font-semibold text-slate-300 mb-4">
          Cross-Cutting Requirements ({crossCuttingItems.length})
        </h2>
        {Object.keys(crossGroups).length === 0 ? (
          <p className="text-[12px] text-slate-600">No cross-cutting items for this scope.</p>
        ) : (
          <div className="space-y-4">
            {Object.entries(crossGroups).map(([group, items]: [string, any]) => (
              <div key={group}>
                <h3 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">{group}</h3>
                <div className="flex flex-wrap gap-2">
                  {items.map((item: any) => (
                    <span key={item.ref} className="text-[11px] px-2 py-0.5 rounded-md bg-slate-700/40 text-slate-400" title={item.feature ?? item.ref}>
                      {item.ref}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
