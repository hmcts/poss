'use client';

import { useState, useMemo, useCallback } from 'react';
import { useApp } from '../providers';
import {
  initializeSimulation, getAvailableActionsPanel, advanceSimulation,
  getSimulationTimeline, getSimulationStatus, getRoleFilterOptions,
  type EnrichedSimulation,
} from '../../src/ui-case-walk/index';

function autoWalk(claimTypeId: string, states: any[], transitions: any[], allEvents: any[], enabledIds: Set<string>): EnrichedSimulation | null {
  const events = allEvents.filter((e: any) => enabledIds.has(e.id));
  try {
    let sim = initializeSimulation(claimTypeId, states, transitions, events);
    for (let i = 0; i < 50; i++) {
      const panel = getAvailableActionsPanel(sim.simulation);
      if (panel.events.length === 0) break;
      try { sim = advanceSimulation(sim, panel.events[0].id); } catch { break; }
    }
    return sim;
  } catch { return null; }
}

export default function CaseWalkPage() {
  const { modelData, activeClaimType } = useApp();
  const [enrichedSim, setEnrichedSim] = useState<EnrichedSimulation | null>(null);
  const [roleFilter, setRoleFilter] = useState('');
  const [enabledEvents, setEnabledEvents] = useState<Set<string>>(new Set());
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);
  const [started, setStarted] = useState(false);

  const handleStart = useCallback(() => {
    const allIds = new Set(modelData.events.map((e: any) => e.id));
    setEnabledEvents(allIds);
    setStarted(true);
    setEnrichedSim(autoWalk(activeClaimType, modelData.states, modelData.transitions, modelData.events, allIds));
    setRoleFilter('');
  }, [activeClaimType, modelData]);

  const handleReset = useCallback(() => {
    setEnrichedSim(null); setStarted(false); setRoleFilter(''); setEnabledEvents(new Set()); setExpandedEvent(null);
  }, []);

  const handleToggleEvent = useCallback((eventId: string) => {
    setEnabledEvents(prev => {
      const next = new Set(prev);
      if (next.has(eventId)) next.delete(eventId); else next.add(eventId);
      setEnrichedSim(autoWalk(activeClaimType, modelData.states, modelData.transitions, modelData.events, next));
      return next;
    });
  }, [activeClaimType, modelData]);

  const timeline = useMemo(() => enrichedSim ? getSimulationTimeline(enrichedSim.simulation) : [], [enrichedSim]);
  const simStatus = useMemo(() => enrichedSim ? getSimulationStatus(enrichedSim.simulation) : null, [enrichedSim]);

  if (!started) {
    return (
      <div className="max-w-lg mx-auto mt-20 text-center">
        <h2 className="text-xl font-semibold text-slate-100 mb-2 tracking-tight">Case Walk Simulation</h2>
        <p className="text-[13px] text-slate-500 mb-8 leading-relaxed">
          Step through a possession case journey event by event.<br />Toggle events on/off to see how the reachable path changes.
        </p>
        <button onClick={handleStart} className="px-6 py-2.5 bg-indigo-600 text-white text-[13px] font-medium rounded-lg hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20">
          Start Simulation
        </button>
      </div>
    );
  }

  const disabledCount = modelData.events.length - enabledEvents.size;

  return (
    <div className="flex gap-8 pb-20" style={{ minHeight: 'calc(100vh - 104px)' }}>
      {/* Timeline */}
      <div className="w-52 shrink-0">
        <h3 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-4">Timeline</h3>
        {timeline.map((entry, i) => (
          <div key={`${entry.stateId}-${i}`} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className="w-2.5 h-2.5 rounded-full border-2 shrink-0" style={{
                backgroundColor: i === timeline.length - 1 ? entry.badge.color.background : 'transparent',
                borderColor: entry.badge.color.border,
              }} />
              {i < timeline.length - 1 && <div className="w-px flex-1 bg-slate-700/40 min-h-[28px]" />}
            </div>
            <div className="pb-5 -mt-0.5">
              <div className={`text-[12px] ${i === timeline.length - 1 ? 'text-slate-200 font-medium' : 'text-slate-500'}`}>{entry.stateName}</div>
              <span className="text-[10px] px-1.5 py-0.5 rounded-md inline-block mt-1 font-medium cursor-help"
                title={`Model completeness: ${entry.badge.label} of this state's events, transitions, and rules are fully defined. Lower values indicate uncertainty or missing detail in the source model.`}
                style={{ backgroundColor: entry.badge.color.background, color: entry.badge.color.text, border: `1px solid ${entry.badge.color.border}` }}>
                {entry.badge.label}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Main */}
      <div className="flex-1 space-y-5">
        {enrichedSim && (
          <div className="rounded-xl border-2 p-5" style={{ borderColor: `${enrichedSim.badge.color.border}80`, backgroundColor: `${enrichedSim.badge.color.background}08` }}>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-lg font-semibold text-slate-100 tracking-tight">{enrichedSim.currentState.uiLabel}</h2>
              <span className="text-[11px] px-2.5 py-1 rounded-full font-medium"
                style={{ backgroundColor: enrichedSim.badge.color.background, color: enrichedSim.badge.color.text, border: `1px solid ${enrichedSim.badge.color.border}` }}>
                {enrichedSim.badge.label}
              </span>
            </div>
            <p className="text-[11px] text-slate-600 font-mono">{enrichedSim.currentState.technicalName}</p>
          </div>
        )}

        {simStatus && simStatus.status !== 'active' && (
          <div className={`rounded-xl p-4 text-[13px] ${simStatus.status === 'completed'
            ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-300'
            : 'bg-red-500/10 border border-red-500/20 text-red-300'}`}>
            {simStatus.status === 'completed' ? '✓ ' : '⚠ '}{simStatus.message}
          </div>
        )}

        {disabledCount > 0 && (
          <div className="text-[12px] text-amber-300/80 bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3">
            {disabledCount} event{disabledCount > 1 ? 's' : ''} disabled — showing furthest reachable path.
          </div>
        )}

        <button onClick={handleReset} className="px-4 py-2 text-[12px] font-medium bg-slate-800/50 text-slate-400 border border-slate-700/40 rounded-lg hover:bg-slate-700/50 hover:text-slate-300 transition-all">
          Reset Simulation
        </button>

        {/* Events panel */}
        <div className="pt-5 border-t border-slate-700/30 pb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">All Events ({modelData.events.length})</h3>
            {disabledCount > 0 && <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 font-medium">{disabledCount} disabled</span>}
          </div>
          <EventsList events={modelData.events} states={modelData.states} enabledEvents={enabledEvents} onToggle={handleToggleEvent}
            expandedEvent={expandedEvent} setExpandedEvent={setExpandedEvent} currentStateId={enrichedSim?.simulation.currentStateId ?? ''} />
        </div>
      </div>
    </div>
  );
}

function EventsList({ events, states, enabledEvents, onToggle, expandedEvent, setExpandedEvent, currentStateId }: {
  events: any[]; states: any[]; enabledEvents: Set<string>; onToggle: (id: string) => void;
  expandedEvent: string | null; setExpandedEvent: (id: string | null) => void; currentStateId: string;
}) {
  const stateMap = new Map(states.map((s: any) => [s.id, s.uiLabel]));
  const grouped = new Map<string, any[]>();
  for (const evt of events) { const l = grouped.get(evt.state) ?? []; l.push(evt); grouped.set(evt.state, l); }

  return (
    <div className="space-y-5">
      {Array.from(grouped.entries()).map(([stateId, stateEvents]) => {
        const isCurrent = stateId === currentStateId;
        return (
          <div key={stateId}>
            <div className="flex items-center gap-2 mb-2">
              {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />}
              <h4 className={`text-[11px] font-semibold tracking-wide ${isCurrent ? 'text-indigo-400' : 'text-slate-600'}`}>
                {stateMap.get(stateId) ?? stateId}
                {isCurrent && <span className="text-[10px] ml-1.5 text-indigo-500 font-normal">(current)</span>}
              </h4>
            </div>
            <div className="space-y-1.5">
              {stateEvents.map((evt: any) => {
                const isEnabled = enabledEvents.has(evt.id);
                const isExpanded = expandedEvent === evt.id;
                const actors = Object.entries(evt.actors).filter(([, v]) => v).map(([k]) => k);
                return (
                  <div key={evt.id} className={`rounded-lg border transition-all ${isEnabled ? 'border-slate-700/30 bg-slate-800/30' : 'border-red-500/10 bg-red-500/5 opacity-50'}`}>
                    <div className="flex items-center gap-2.5 px-3.5 py-2.5">
                      <input type="checkbox" checked={isEnabled} onChange={() => onToggle(evt.id)}
                        className="rounded bg-slate-800 border-slate-600 text-indigo-500 w-3.5 h-3.5 shrink-0 cursor-pointer" />
                      <button onClick={() => setExpandedEvent(isExpanded ? null : evt.id)} className="flex-1 flex items-center gap-2 text-left min-w-0">
                        <span className={`text-[12px] truncate ${isEnabled ? 'text-slate-300' : 'text-slate-600 line-through'}`}>{evt.name}</span>
                        {evt.isSystemEvent && <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-indigo-500/15 text-indigo-400 font-medium shrink-0">SYS</span>}
                        {evt.hasOpenQuestions && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />}
                        <svg className={`w-3 h-3 text-slate-600 ml-auto shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>
                    {isExpanded && (
                      <div className="px-4 pb-3.5 ml-6 space-y-2.5 border-t border-slate-700/20 pt-2.5">
                        {evt.notes && <div><span className="text-[10px] text-slate-600 uppercase font-medium tracking-wide">Notes</span><p className="text-[12px] text-slate-400 mt-0.5">{evt.notes}</p></div>}
                        <div>
                          <span className="text-[10px] text-slate-600 uppercase font-medium tracking-wide">Actors</span>
                          <div className="flex flex-wrap gap-1.5 mt-1">
                            {actors.map((a: string) => <span key={a} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-700/50 text-slate-400">{a}</span>)}
                            {actors.length === 0 && <span className="text-[10px] text-slate-700">None</span>}
                          </div>
                        </div>
                        <div className="flex gap-6">
                          <div><span className="text-[10px] text-slate-600 uppercase font-medium tracking-wide">Type</span><p className="text-[12px] text-slate-400">{evt.isSystemEvent ? 'System' : 'User'}</p></div>
                          <div><span className="text-[10px] text-slate-600 uppercase font-medium tracking-wide">Open Questions</span><p className="text-[12px] text-slate-400">{evt.hasOpenQuestions ? 'Yes' : 'No'}</p></div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
