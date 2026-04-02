'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { useApp } from '../providers';
import {
  initializeSimulation, getAvailableActionsPanel, advanceSimulation,
  getSimulationTimeline, getSimulationStatus, getRoleFilterOptions,
  type EnrichedSimulation,
} from '../../src/ui-case-walk/index';
import {
  shouldShowWaToggle, getEventTaskCards, getTimelineChips,
  getAlignmentWarning, isPaymentRelatedState,
  computeEffectiveEnabledEvents, getTaskToggleState, getEffectiveDisabledCount,
} from '../../src/ui-wa-tasks/digital-twin-helpers';
import { getUnmappedTasks, getTasksForEvent } from '../../src/wa-task-engine/index';
import { blobToWaTasks, blobToWaMappings } from '../../src/ref-data/adapter';
import {
  ABOUT_WHAT_PAGE_DOES,
  ABOUT_AVAILABLE_EVENTS,
  ABOUT_DEAD_END_DETECTION,
  ABOUT_AUTO_WALK,
  ABOUT_WA_TASK_CARDS,
  ABOUT_ROLE_FILTER,
} from '../../src/ui-about-digital-twin/index.js';

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
  const { modelData, activeClaimType, refData } = useApp();
  const waTasks = useMemo(() => blobToWaTasks(refData), [refData]);
  const waMappings = useMemo(() => blobToWaMappings(refData), [refData]);
  const [enrichedSim, setEnrichedSim] = useState<EnrichedSimulation | null>(null);
  const [roleFilter, setRoleFilter] = useState('');
  const [enabledEvents, setEnabledEvents] = useState<Set<string>>(new Set());
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);
  const [started, setStarted] = useState(false);
  const [showWaTasks, setShowWaTasks] = useState(false);
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [disabledTasks, setDisabledTasks] = useState<Set<string>>(new Set());

  const waToggleVisible = shouldShowWaToggle(waTasks as any, waMappings);

  const effectiveEnabled = useMemo(() =>
    computeEffectiveEnabledEvents(enabledEvents, disabledTasks, modelData.events, waTasks as any, waMappings as any, showWaTasks),
    [enabledEvents, disabledTasks, modelData.events, showWaTasks],
  );

  const handleStart = useCallback(() => {
    const allIds = new Set(modelData.events.map((e: any) => e.id));
    setEnabledEvents(allIds);
    setStarted(true);
    setEnrichedSim(autoWalk(activeClaimType, modelData.states, modelData.transitions, modelData.events, allIds));
    setRoleFilter('');
  }, [activeClaimType, modelData]);

  const handleReset = useCallback(() => {
    setEnrichedSim(null); setStarted(false); setRoleFilter(''); setEnabledEvents(new Set()); setExpandedEvent(null); setDisabledTasks(new Set());
  }, []);

  const handleToggleEvent = useCallback((eventId: string) => {
    setEnabledEvents(prev => {
      const next = new Set(prev);
      if (next.has(eventId)) next.delete(eventId); else next.add(eventId);
      setEnrichedSim(autoWalk(activeClaimType, modelData.states, modelData.transitions, modelData.events, next));
      return next;
    });
  }, [activeClaimType, modelData]);

  const handleToggleTask = useCallback((taskId: string) => {
    setDisabledTasks(prev => {
      const next = new Set(prev);
      if (next.has(taskId)) next.delete(taskId); else next.add(taskId);
      return next;
    });
  }, []);

  useEffect(() => {
    if (started) {
      setEnrichedSim(autoWalk(activeClaimType, modelData.states, modelData.transitions, modelData.events, effectiveEnabled));
    }
  }, [effectiveEnabled, started, activeClaimType, modelData]);

  const timeline = useMemo(() => enrichedSim ? getSimulationTimeline(enrichedSim.simulation) : [], [enrichedSim]);
  const simStatus = useMemo(() => enrichedSim ? getSimulationStatus(enrichedSim.simulation) : null, [enrichedSim]);

  if (!started) {
    return (
      <div className="max-w-lg mx-auto mt-20 space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-slate-100 mb-2 tracking-tight">Case Walk Simulation</h2>
          <p className="text-[13px] text-slate-500 mb-4 leading-relaxed">
            Step through a possession case journey event by event.<br />Toggle events on/off to see how the reachable path changes.
          </p>
        </div>
        <AboutPanel />
        <div className="text-center">
          <button onClick={handleStart} className="px-6 py-2.5 bg-indigo-600 text-white text-[13px] font-medium rounded-lg hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20">
            Start Simulation
          </button>
        </div>
      </div>
    );
  }

  const disabledCount = getEffectiveDisabledCount(enabledEvents, disabledTasks, modelData.events, waTasks as any, waMappings as any, showWaTasks);

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
              {showWaTasks && (entry as any).eventName && (() => {
                const chips = getTimelineChips((entry as any).eventName, waTasks as any, waMappings as any);
                if (chips.length === 0) return null;
                return (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {chips.map((chip, ci) => (
                      <span key={ci} className="text-[9px] px-1.5 py-0.5 rounded-md font-medium" style={{ backgroundColor: `${chip.colour}20`, color: chip.colour, border: `1px solid ${chip.colour}40` }}>
                        {chip.taskName}
                      </span>
                    ))}
                  </div>
                );
              })()}
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

        <div className="flex items-center gap-3">
          <button onClick={handleReset} className="px-4 py-2 text-[12px] font-medium bg-slate-800/50 text-slate-400 border border-slate-700/40 rounded-lg hover:bg-slate-700/50 hover:text-slate-300 transition-all">
            Reset Simulation
          </button>
          {waToggleVisible && (
            <label className="flex items-center gap-2 text-[12px] text-slate-400 cursor-pointer select-none">
              <input type="checkbox" checked={showWaTasks} onChange={(e) => setShowWaTasks(e.target.checked)}
                className="rounded bg-slate-800 border-slate-600 text-indigo-500 w-3.5 h-3.5 cursor-pointer" />
              Show WA Tasks
            </label>
          )}
        </div>

        {showWaTasks && enrichedSim && isPaymentRelatedState(enrichedSim.currentState.technicalName) && (() => {
          const gapTasks = getUnmappedTasks(waTasks as any, waMappings as any);
          if (gapTasks.length === 0) return null;
          return (
            <div className="text-[12px] text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
              WA task &apos;{gapTasks[0].taskName}&apos; has no corresponding event in the model
            </div>
          );
        })()}


        {/* Events panel */}
        <div className="pt-5 border-t border-slate-700/30 pb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">All Events ({modelData.events.length})</h3>
            {disabledCount > 0 && <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 font-medium">{disabledCount} disabled</span>}
          </div>
          <EventsList events={modelData.events} states={modelData.states} enabledEvents={enabledEvents} onToggle={handleToggleEvent}
            expandedEvent={expandedEvent} setExpandedEvent={setExpandedEvent} currentStateId={enrichedSim?.simulation.currentStateId ?? ''}
            showWaTasks={showWaTasks} expandedCards={expandedCards} setExpandedCards={setExpandedCards}
            disabledTasks={disabledTasks} onToggleTask={handleToggleTask}
            waTasks={waTasks} waMappings={waMappings} />
        </div>
      </div>
    </div>
  );
}

function AboutPanel() {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-slate-900/40 border border-slate-700/30 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm text-slate-400 hover:text-slate-200 hover:bg-slate-800/30 transition-colors"
      >
        <span className="font-medium">About this page — how the simulation works and how to interpret results</span>
        <svg
          className={`w-4 h-4 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="px-4 pb-4 space-y-4 text-sm text-slate-400 border-t border-slate-700/30 pt-4">
          <div>
            <h3 className="text-slate-200 font-medium mb-1">What this page does</h3>
            <p>{ABOUT_WHAT_PAGE_DOES}</p>
          </div>
          <div>
            <h3 className="text-slate-200 font-medium mb-1">Available events assumption</h3>
            <p>{ABOUT_AVAILABLE_EVENTS}</p>
          </div>
          <div>
            <h3 className="text-slate-200 font-medium mb-1">Dead-end detection assumption</h3>
            <p>{ABOUT_DEAD_END_DETECTION}</p>
          </div>
          <div>
            <h3 className="text-slate-200 font-medium mb-1">Auto-walk assumption</h3>
            <p>{ABOUT_AUTO_WALK}</p>
          </div>
          <div>
            <h3 className="text-slate-200 font-medium mb-1">WA task cards assumption</h3>
            <p>{ABOUT_WA_TASK_CARDS}</p>
          </div>
          <div>
            <h3 className="text-slate-200 font-medium mb-1">Role filter assumption</h3>
            <p>{ABOUT_ROLE_FILTER}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function EventsList({ events, states, enabledEvents, onToggle, expandedEvent, setExpandedEvent, currentStateId, showWaTasks, expandedCards, setExpandedCards, disabledTasks, onToggleTask, waTasks, waMappings }: {
  events: any[]; states: any[]; enabledEvents: Set<string>; onToggle: (id: string) => void;
  expandedEvent: string | null; setExpandedEvent: (id: string | null) => void; currentStateId: string;
  showWaTasks: boolean; expandedCards: Set<string>; setExpandedCards: (s: Set<string>) => void;
  disabledTasks: Set<string>; onToggleTask: (taskId: string) => void;
  waTasks: any[]; waMappings: any[];
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
                    {showWaTasks && (() => {
                      const cards = getEventTaskCards(evt.name, waTasks as any, waMappings as any);
                      const tasks = getTasksForEvent(evt.name, waMappings as any, waTasks as any);
                      const warning = getAlignmentWarning(evt.name, waTasks as any, waMappings as any);
                      if (cards.length === 0) return null;
                      return (
                        <div className="mx-3.5 mb-2.5 space-y-1.5">
                          {warning && (
                            <div className="text-[10px] text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded-md px-2.5 py-1.5">
                              {warning.message}
                            </div>
                          )}
                          {cards.map((card, ci) => {
                            const cardKey = `${evt.id}-${ci}`;
                            const isCardExpanded = expandedCards.has(cardKey);
                            const task = tasks[ci];
                            const toggleState = task ? getTaskToggleState(task.id, disabledTasks, enabledEvents, waTasks as any, waMappings as any, events) : null;
                            return (
                              <div key={ci} className={`rounded-md border border-slate-700/20 bg-slate-800/20 ${toggleState && !toggleState.checked ? 'opacity-50' : ''}`}>
                                <div className="flex items-center gap-2 px-2.5 py-1.5">
                                  {task && toggleState && (
                                    <input type="checkbox" checked={toggleState.checked} disabled={!toggleState.interactive}
                                      onChange={() => onToggleTask(task.id)}
                                      className={`rounded bg-slate-800 border-slate-600 text-indigo-500 w-3 h-3 shrink-0 ${toggleState.interactive ? 'cursor-pointer' : 'cursor-not-allowed opacity-40'}`} />
                                  )}
                                  <button
                                    onClick={() => {
                                      const next = new Set(expandedCards);
                                      if (isCardExpanded) next.delete(cardKey); else next.add(cardKey);
                                      setExpandedCards(next);
                                    }}
                                    className="flex-1 flex items-center gap-2 text-left min-w-0"
                                    aria-expanded={isCardExpanded}
                                  >
                                    <span className="text-[10px] px-1.5 py-0.5 rounded-md font-medium"
                                      style={{ backgroundColor: `${card.badge.colour}20`, color: card.badge.colour, border: `1px solid ${card.badge.colour}40` }}>
                                      {card.badge.label}
                                    </span>
                                    <span className="text-[11px] text-slate-400 truncate flex-1">{card.taskName}</span>
                                    <svg className={`w-2.5 h-2.5 text-slate-600 shrink-0 transition-transform ${isCardExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                  </button>
                                </div>
                                {isCardExpanded && (
                                  <div className="px-2.5 pb-2 space-y-1.5 border-t border-slate-700/15 pt-1.5">
                                    <div><span className="text-[9px] text-slate-600 uppercase font-medium">Trigger</span><p className="text-[11px] text-slate-400">{card.triggerDescription}</p></div>
                                    <div><span className="text-[9px] text-slate-600 uppercase font-medium">Context</span><p className="text-[11px] text-slate-400">{card.context}</p></div>
                                    {card.notes && card.badge.label === 'Partial' && (
                                      <div className="text-[10px] text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded-md px-2 py-1.5">
                                        {card.notes}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      );
                    })()}
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
