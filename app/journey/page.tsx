'use client';

import { useState, useMemo, useEffect } from 'react';
import { useApp } from '../providers';
import { blobToWaTasks, blobToWaMappings } from '../../src/ref-data/adapter';
import {
  matchByEventTrigger, matchByDomainAndFeature, filterByReleaseScope,
} from '../../src/catalogue-coverage-map/index.js';
import { getPersonaRoleMapping, getDistinctPersonas } from '../../src/ui-catalogue-coverage-map/index.js';
import { getExpandedDetail } from '../../src/ui-product-catalogue/index';
import {
  traceAllPaths, getNextStates, getPersonaEventsAtState,
  getStateGapStatus, getEventCoverageFlags, getFeaturesAtState,
  getWaTasksAtState, getGapStyle, buildPathSummaries,
} from '../../src/journey-explorer/index.js';

export default function JourneyPage() {
  const { modelData, refData } = useApp();
  const waTasksData = useMemo(() => blobToWaTasks(refData), [refData]);
  const waMappingsData = useMemo(() => blobToWaMappings(refData), [refData]);
  const [selectedPersona, setSelectedPersona] = useState<string | null>(null);
  const [showAllPaths, setShowAllPaths] = useState(false);
  const [pickedPath, setPickedPath] = useState<string[]>([]);
  const [expandedStateId, setExpandedStateId] = useState<string | null>(null);
  const [expandedFeatureStateId, setExpandedFeatureStateId] = useState<string | null>(null);
  const [selectedFeature, setSelectedFeature] = useState<any>(null);
  const [selectedPathIdx, setSelectedPathIdx] = useState<number | null>(null);
  const [catalogueData, setCatalogueData] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/product-catalog')
      .then((r) => r.json())
      .then((res) => setCatalogueData(Array.isArray(res.products) ? res.products : []));
  }, []);

  const personas = useMemo(() => getDistinctPersonas(catalogueData), [catalogueData]);
  const roleMapping = useMemo(
    () => selectedPersona ? getPersonaRoleMapping(selectedPersona) : null,
    [selectedPersona]
  );

  // Catalogue mappings
  const allMappings = useMemo(() => {
    const items = filterByReleaseScope(catalogueData, 'r1+tbc') as any[];
    const exact = items.flatMap((i: any) => matchByEventTrigger(i, modelData.events));
    const inferred = items.flatMap((i: any) => matchByDomainAndFeature(i, modelData.states, modelData.events))
      .filter((inf: any) => !exact.some((ex: any) => ex.eventId === inf.eventId && ex.catalogueRef === inf.catalogueRef));
    return [...exact, ...inferred];
  }, [catalogueData, modelData]);

  // Initial state = first non-terminal state
  const startState = useMemo(
    () => modelData.states.find(s => !s.isEndState) ?? modelData.states[0],
    [modelData.states]
  );

  // All paths from start to terminal
  const allPaths = useMemo(
    () => traceAllPaths(startState.id, modelData.transitions, modelData.states),
    [startState, modelData.transitions, modelData.states]
  );

  const pathSummaries = useMemo(
    () => buildPathSummaries(allPaths, modelData.states, modelData.events, allMappings, roleMapping),
    [allPaths, modelData, allMappings, roleMapping]
  );

  // Pick-a-path: current path defaults to just the start state
  const activePath = pickedPath.length > 0 ? pickedPath : [startState.id];
  const lastStateId = activePath[activePath.length - 1];
  const lastState = modelData.states.find(s => s.id === lastStateId);
  const nextOptions = getNextStates(lastStateId, modelData.transitions);
  const isComplete = lastState?.isEndState ?? false;

  function pickNext(stateId: string) {
    setPickedPath(prev => [...(prev.length > 0 ? prev : [startState.id]), stateId]);
    setExpandedStateId(null);
    setSelectedFeature(null);
  }

  function resetPath() {
    setPickedPath([]);
    setExpandedStateId(null);
    setSelectedFeature(null);
    setSelectedPathIdx(null);
  }

  function loadPath(path: string[]) {
    setPickedPath(path);
    setShowAllPaths(false);
    setSelectedPathIdx(null);
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-100">Journey Explorer</h1>
          <p className="text-sm text-slate-400 mt-1">Trace a persona journey from start to terminal state</p>
        </div>

        {/* Controls bar */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Persona</label>
            <select
              value={selectedPersona ?? ''}
              onChange={e => { setSelectedPersona(e.target.value || null); resetPath(); }}
              className="text-sm bg-slate-800/60 text-slate-200 border border-slate-700/40 rounded-lg px-3 py-1.5 focus:outline-none focus:border-indigo-500/50 transition-all"
            >
              <option value="">All personas</option>
              {personas.map((p: string) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => { setShowAllPaths(v => !v); resetPath(); }}
              className={`text-[12px] px-3 py-1.5 rounded-lg border transition-colors ${
                showAllPaths
                  ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300'
                  : 'border-slate-700/40 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              {showAllPaths ? 'Building path' : `Show all paths (${allPaths.length})`}
            </button>
            {!showAllPaths && pickedPath.length > 0 && (
              <button onClick={resetPath}
                className="text-[12px] px-3 py-1.5 rounded-lg border border-slate-700/40 text-slate-500 hover:text-slate-300 transition-colors">
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {showAllPaths
        ? <AllPathsView summaries={pathSummaries} states={modelData.states} onSelect={loadPath} />
        : <PathBuilderView
            activePath={activePath}
            states={modelData.states}
            events={modelData.events}
            mappings={allMappings}
            roleMapping={roleMapping}
            nextOptions={nextOptions}
            isComplete={isComplete}
            expandedStateId={expandedStateId}
            setExpandedStateId={setExpandedStateId}
            expandedFeatureStateId={expandedFeatureStateId}
            setExpandedFeatureStateId={setExpandedFeatureStateId}
            selectedFeature={selectedFeature}
            setSelectedFeature={setSelectedFeature}
            onPickNext={pickNext}
            catalogueItems={filterByReleaseScope(catalogueData, 'r1+tbc') as any[]}
            waTasks={waTasksData}
            waMappings={waMappingsData}
          />
      }
    </div>
  );
}

// ── AllPathsView ─────────────────────────────────────────────────────────────

function AllPathsView({ summaries, states, onSelect }: any) {
  const stateMap = Object.fromEntries(states.map((s: any) => [s.id, s]));
  return (
    <div className="space-y-3">
      <p className="text-[12px] text-slate-500">{summaries.length} path{summaries.length !== 1 ? 's' : ''} found. Click one to explore it step by step.</p>
      {summaries.map((s: any) => {
        const pct = s.coverageScore;
        const badgeColor = pct === null ? '#475569' : pct === 100 ? '#16a34a' : pct > 0 ? '#d97706' : '#dc2626';
        return (
          <button key={s.idx} onClick={() => onSelect(s.path)}
            className="w-full text-left rounded-xl border border-slate-700/30 bg-slate-800/40 hover:bg-slate-800/70 p-4 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Path {s.idx + 1}</span>
              <div className="flex items-center gap-2">
                {s.gapCount > 0 && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/10 text-red-400">{s.gapCount} gap{s.gapCount !== 1 ? 's' : ''}</span>
                )}
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: badgeColor + '20', color: badgeColor }}>
                  {pct !== null ? `${pct}%` : 'n/a'}
                </span>
                {s.isComplete && <span className="text-[10px] text-emerald-400">→ terminal</span>}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-1">
              {s.path.map((id: string, i: number) => (
                <span key={id} className="flex items-center gap-1">
                  <span className="text-[12px] text-slate-300">{stateMap[id]?.uiLabel ?? id}</span>
                  {i < s.path.length - 1 && <span className="text-slate-600 text-[10px]">→</span>}
                </span>
              ))}
            </div>
            <p className="text-[11px] text-slate-600 mt-1">{s.stepCount} states</p>
          </button>
        );
      })}
    </div>
  );
}

// ── PathBuilderView ───────────────────────────────────────────────────────────

function PathBuilderView({ activePath, states, events, mappings, roleMapping, nextOptions,
  isComplete, expandedStateId, setExpandedStateId, expandedFeatureStateId,
  setExpandedFeatureStateId, selectedFeature, setSelectedFeature, onPickNext, catalogueItems,
  waTasks, waMappings }: any) {

  const stateMap = Object.fromEntries(states.map((s: any) => [s.id, s]));

  return (
    <div className="flex gap-6">
      {/* Timeline */}
      <div className="flex-1 space-y-0">
        {activePath.map((stateId: string, idx: number) => (
          <StepCard
            key={stateId}
            state={stateMap[stateId]}
            isLast={idx === activePath.length - 1}
            isFirst={idx === 0}
            events={events}
            mappings={mappings}
            roleMapping={roleMapping}
            catalogueItems={catalogueItems}
            waTasks={waTasks}
            waMappings={waMappings}
            expanded={expandedStateId === stateId}
            onToggle={() => setExpandedStateId((p: any) => p === stateId ? null : stateId)}
            featuresExpanded={expandedFeatureStateId === stateId}
            onToggleFeatures={() => setExpandedFeatureStateId((p: any) => p === stateId ? null : stateId)}
            selectedFeature={selectedFeature}
            setSelectedFeature={setSelectedFeature}
          />
        ))}

        {/* Next state picker */}
        {!isComplete && nextOptions.length > 0 && (
          <div className="ml-6 mt-2 space-y-2">
            <p className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold mb-2">Choose next state</p>
            {nextOptions.map((opt: any) => (
              <button key={opt.stateId} onClick={() => onPickNext(opt.stateId)}
                className="flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl border border-slate-700/30 bg-slate-800/30 hover:bg-slate-800/60 hover:border-indigo-500/30 transition-all group">
                <span className="w-2 h-2 rounded-full bg-indigo-500/60 group-hover:bg-indigo-400 shrink-0" />
                <div>
                  <div className="text-[13px] text-slate-300 group-hover:text-slate-100">{stateMap[opt.stateId]?.uiLabel ?? opt.stateId}</div>
                  {opt.condition && <div className="text-[11px] text-slate-600">{opt.condition}{opt.isSystemTriggered ? ' · system' : ''}{opt.isTimeBased ? ' · timed' : ''}</div>}
                </div>
              </button>
            ))}
          </div>
        )}

        {isComplete && (
          <div className="ml-6 mt-4 px-4 py-3 rounded-xl border border-emerald-500/30 bg-emerald-500/5">
            <p className="text-[13px] text-emerald-400 font-medium">Terminal state reached</p>
            <p className="text-[11px] text-slate-500 mt-0.5">This journey is complete.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── StepCard ─────────────────────────────────────────────────────────────────

function StepCard({ state, isFirst, isLast, events, mappings, roleMapping, catalogueItems,
  expanded, onToggle, featuresExpanded, onToggleFeatures, selectedFeature, setSelectedFeature,
  waTasks, waMappings }: any) {

  const personaEvents = getPersonaEventsAtState(state.id, events, roleMapping);
  const eventsWithCoverage = getEventCoverageFlags(state.id, personaEvents, mappings);
  const gapStatus = getStateGapStatus(state.id, personaEvents, mappings);
  const features = getFeaturesAtState(state.id, mappings, catalogueItems);
  const waTasksAtState = getWaTasksAtState(state.id, events, waTasks, waMappings);
  const { color, label } = getGapStyle(gapStatus);

  return (
    <div className="flex gap-3">
      {/* Spine */}
      <div className="flex flex-col items-center w-6 shrink-0 pt-4">
        <div className="w-3 h-3 rounded-full border-2 shrink-0" style={{ borderColor: color, backgroundColor: color + '30' }} />
        {!isLast && <div className="w-px flex-1 mt-1" style={{ backgroundColor: '#334155' }} />}
      </div>

      {/* Card */}
      <div className="flex-1 mb-3">
        <button onClick={onToggle}
          className="w-full text-left rounded-xl border border-slate-700/30 bg-slate-800/40 hover:bg-slate-800/60 p-4 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[13px] font-medium text-slate-200">{state.uiLabel}</span>
              <span className="ml-2 text-[10px] text-slate-600 font-mono">{state.technicalName}</span>
            </div>
            <div className="flex items-center gap-2">
              {/* Event coverage dots */}
              <div className="flex gap-0.5">
                {eventsWithCoverage.map((e: any) => (
                  <span key={e.id} className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: e.isCovered ? '#16a34a' : '#dc2626' }}
                    title={e.name + (e.isCovered ? ' ✓' : ' — gap')} />
                ))}
              </div>
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
                style={{ backgroundColor: color + '20', color }}>
                {label}
              </span>
              <svg className={`w-3 h-3 text-slate-600 transition-transform ${expanded ? 'rotate-180' : ''}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </button>

        {expanded && (
          <div className="mt-1 rounded-xl border border-slate-700/20 bg-slate-900/30 p-4 space-y-4">
            {/* Events */}
            <div>
              <h4 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Events {roleMapping && !roleMapping.isCrossCutting ? `(${roleMapping.roles.join(', ')})` : '(all)'}
              </h4>
              {eventsWithCoverage.length === 0
                ? <p className="text-[11px] text-slate-600">No events for this persona at this state.</p>
                : <ul className="space-y-1.5">
                    {eventsWithCoverage.map((evt: any) => (
                      <li key={evt.id} className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: evt.isCovered ? '#16a34a' : '#dc2626' }} />
                        <span className="text-[12px] text-slate-300">{evt.name}</span>
                        {evt.isSystemEvent && <span className="text-[10px] text-slate-600">system</span>}
                        {!evt.isCovered && <span className="text-[10px] text-red-400">no catalogue item</span>}
                      </li>
                    ))}
                  </ul>
              }
            </div>

            {/* WA Tasks */}
            {waTasksAtState.length > 0 && (
              <div>
                <h4 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">WA Tasks</h4>
                <ul className="space-y-1.5">
                  {waTasksAtState.map((t: any, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-0.5 text-[9px] px-1.5 py-0.5 rounded font-medium shrink-0"
                        style={{ backgroundColor: t.alignment === 'aligned' ? '#14532d' : '#451a03', color: t.alignment === 'aligned' ? '#86efac' : '#fcd34d' }}>
                        {t.alignment}
                      </span>
                      <div>
                        <div className="text-[12px] text-slate-300">{t.taskName}</div>
                        <div className="text-[10px] text-slate-600">via {t.eventName}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Features */}
            <div>
              <button onClick={onToggleFeatures}
                className="w-full flex items-center justify-between text-[11px] font-semibold text-slate-500 uppercase tracking-wider hover:text-slate-300 transition-colors">
                <span>Features ({features.length})</span>
                <svg className={`w-3 h-3 transition-transform ${featuresExpanded ? 'rotate-180' : ''}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {featuresExpanded && (
                <ul className="space-y-2 mt-2">
                  {features.length === 0
                    ? <li className="text-[11px] text-slate-600">No catalogue items mapped to this state.</li>
                    : features.map((item: any) => {
                        const isOpen = selectedFeature?.ref === item.ref;
                        const detail = isOpen ? getExpandedDetail(item) : null;
                        return (
                          <li key={item.ref}>
                            <button onClick={() => setSelectedFeature(isOpen ? null : item)}
                              className="w-full flex items-start gap-2 text-left hover:bg-slate-700/20 rounded-lg p-1 -mx-1 transition-colors">
                              <span className="mt-0.5 shrink-0 text-[9px] px-1.5 py-0.5 rounded font-medium"
                                style={{ backgroundColor: isOpen ? '#1e40af' : '#1e3a5f', color: '#93c5fd' }}>
                                {item.ref}
                              </span>
                              <div className="flex-1 min-w-0">
                                <div className="text-[12px] text-slate-300">{item.feature}</div>
                                <div className="text-[10px] text-slate-600">{item.moscow} · {item.domainGroup}</div>
                              </div>
                              <svg className={`w-3 h-3 mt-0.5 shrink-0 text-slate-600 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                            {isOpen && detail && (
                              <div className="mt-1 ml-1 pl-3 border-l border-slate-700/40 space-y-2 pb-1">
                                {detail.hlFunction && <DR label="Function" value={detail.hlFunction} />}
                                {detail.userStory && <DR label="User story" value={detail.userStory} />}
                                {detail.expectedOutcomes && <DR label="Outcomes" value={detail.expectedOutcomes} />}
                                {detail.eventTrigger && <DR label="Event trigger" value={detail.eventTrigger} />}
                                {detail.personas?.length > 0 && <DR label="Personas" value={detail.personas.join(', ')} />}
                                {detail.notes && <DR label="Notes" value={detail.notes} />}
                              </div>
                            )}
                          </li>
                        );
                      })
                  }
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DR({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-[10px] text-slate-500 uppercase tracking-wider">{label}</span>
      <p className="text-[11px] text-slate-300 mt-0.5">{value}</p>
    </div>
  );
}
