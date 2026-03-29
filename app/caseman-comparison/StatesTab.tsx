'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { CLAIM_TYPES } from '../../src/app-shell/index';
import { Tooltip } from './Tooltip';
import { getTooltipText } from '../../src/ui-caseman-tooltips/index';
import type { State } from '../../src/data-model/schemas';

// ── Caseman statuses (hardcoded — they never change) ─────────────────────────

const CASEMAN_STATUSES = [
  { key: 'NULL_ACTIVE', label: 'NULL (Active)' },
  { key: 'PAID', label: 'PAID' },
  { key: 'SETTLED', label: 'SETTLED' },
  { key: 'SETTLED_WDRN', label: 'SETTLED/WDRN' },
  { key: 'STAYED', label: 'STAYED' },
  { key: 'EMPTY_STAY_LIFTED', label: '(Stay Lifted)' },
];

// ── Props ─────────────────────────────────────────────────────────────────────

interface AppModelData {
  states: State[];
  transitions: unknown[];
  events: unknown[];
}

export interface StatesTabProps {
  modelData: AppModelData;
}

// ── Auto-match logic ──────────────────────────────────────────────────────────

function autoMatch(casemanLabel: string, serviceStates: string[]): string | null {
  const needle = casemanLabel.toLowerCase().replace(/[^a-z0-9]/g, '');
  for (const s of serviceStates) {
    if (s.toLowerCase().replace(/[^a-z0-9]/g, '').includes(needle) || needle.includes(s.toLowerCase().replace(/[^a-z0-9]/g, ''))) {
      return s;
    }
  }
  // More relaxed: check if any word in caseman label is found in state name
  const words = casemanLabel.toLowerCase().split(/[^a-z0-9]+/).filter(w => w.length > 2);
  for (const s of serviceStates) {
    const sLower = s.toLowerCase();
    if (words.some(w => sLower.includes(w))) {
      return s;
    }
  }
  return null;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function StatesTab({ modelData }: StatesTabProps) {
  const [selectedClaimType, setSelectedClaimType] = useState<string>(CLAIM_TYPES[0].id);

  // Filter states for selected claim type
  const serviceStates = useMemo(() => {
    const filtered = modelData.states.filter((s) => s.claimType === selectedClaimType);
    return filtered.map((s) => s.uiLabel);
  }, [modelData.states, selectedClaimType]);

  // Build match map: casemanKey → serviceState label (or null)
  const matchMap = useMemo(() => {
    const map: Record<string, string | null> = {};
    for (const cs of CASEMAN_STATUSES) {
      map[cs.key] = autoMatch(cs.label, serviceStates);
    }
    return map;
  }, [serviceStates]);

  const matchedServiceStates = useMemo(
    () => new Set(Object.values(matchMap).filter(Boolean) as string[]),
    [matchMap],
  );

  const unmatchedServiceStates = useMemo(
    () => serviceStates.filter((s) => !matchedServiceStates.has(s)),
    [serviceStates, matchedServiceStates],
  );

  const matchedCount = useMemo(
    () => CASEMAN_STATUSES.filter((cs) => matchMap[cs.key] !== null).length,
    [matchMap],
  );
  const gapCount = CASEMAN_STATUSES.length - matchedCount;
  const amberCount = unmatchedServiceStates.length;

  // ── SVG connection lines ────────────────────────────────────────────────────

  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Row refs: left[casemanKey] → DOM element; right[stateLabel] → DOM element
  const leftRowRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const rightRowRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const [lines, setLines] = useState<Array<{ x1: number; y1: number; x2: number; y2: number; key: string }>>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const computed: typeof lines = [];

    for (const cs of CASEMAN_STATUSES) {
      const matched = matchMap[cs.key];
      if (!matched) continue;

      const leftEl = leftRowRefs.current[cs.key];
      const rightEl = rightRowRefs.current[matched];
      if (!leftEl || !rightEl) continue;

      const leftRect = leftEl.getBoundingClientRect();
      const rightRect = rightEl.getBoundingClientRect();

      computed.push({
        key: cs.key,
        x1: leftRect.right - containerRect.left,
        y1: leftRect.top + leftRect.height / 2 - containerRect.top,
        x2: rightRect.left - containerRect.left,
        y2: rightRect.top + rightRect.height / 2 - containerRect.top,
      });
    }

    setLines(computed);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchMap, serviceStates, selectedClaimType]);

  const claimTypeName = CLAIM_TYPES.find((c) => c.id === selectedClaimType)?.name ?? selectedClaimType;

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <div className="grid grid-cols-4 gap-4">
        <SummaryCard label="Caseman Statuses" value={CASEMAN_STATUSES.length} colour="#6B7280" />
        <SummaryCard label="Matched" value={matchedCount} colour="#22C55E" />
        <SummaryCard label="Gaps (No Match)" value={gapCount} colour="#EF4444" />
        <SummaryCard label="New (Amber)" value={amberCount} colour="#F59E0B" />
      </div>

      {/* Claim Type Selector */}
      <div className="flex items-center gap-3">
        <label className="text-xs font-medium text-slate-400">Claim Type:</label>
        <select
          value={selectedClaimType}
          onChange={(e) => setSelectedClaimType(e.target.value)}
          className="px-3 py-1.5 text-xs bg-slate-900/50 border border-slate-700/40 rounded-md text-slate-200"
        >
          {CLAIM_TYPES.map((ct) => (
            <option key={ct.id} value={ct.id}>
              {ct.name}
            </option>
          ))}
        </select>
        <span className="text-xs text-slate-500">
          {matchedCount} of {CASEMAN_STATUSES.length} Caseman statuses matched for{' '}
          <span className="text-slate-300">{claimTypeName}</span>
        </span>
      </div>

      {/* Side-by-side columns with SVG overlay */}
      <div
        ref={containerRef}
        className="relative bg-slate-900/50 border border-slate-700/30 rounded-xl p-6"
      >
        {/* SVG overlay for connection lines */}
        <svg
          className="absolute inset-0 pointer-events-none"
          style={{ width: '100%', height: '100%' }}
          aria-hidden="true"
        >
          {lines.map((line) => (
            <line
              key={line.key}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke="#22C55E"
              strokeWidth={1.5}
              strokeDasharray="4 3"
              opacity={0.6}
            />
          ))}
        </svg>

        <div className="grid grid-cols-2 gap-12">
          {/* Left column — Caseman statuses */}
          <div ref={leftColRef} className="space-y-2">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Caseman Statuses (Legacy)
            </div>
            {CASEMAN_STATUSES.map((cs) => {
              const matched = matchMap[cs.key];
              return (
                <div
                  key={cs.key}
                  ref={(el) => { leftRowRefs.current[cs.key] = el; }}
                  className={[
                    'flex items-center justify-between gap-2 px-3 py-2 rounded-lg border text-sm',
                    matched
                      ? 'bg-slate-800/40 border-slate-700/30 text-slate-200'
                      : 'bg-red-950/20 border-red-800/30 text-slate-300',
                  ].join(' ')}
                >
                  <span className="font-mono text-xs">{cs.label}</span>
                  {!matched && (
                    <Tooltip content={getTooltipText('badgeNoMatch')}>
                      <span
                        className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium"
                        style={{ backgroundColor: 'rgba(239,68,68,0.15)', color: '#EF4444' }}
                      >
                        No match
                      </span>
                    </Tooltip>
                  )}
                  {matched && (
                    <span
                      className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium"
                      style={{ backgroundColor: 'rgba(34,197,94,0.12)', color: '#22C55E' }}
                    >
                      matched
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right column — new service states */}
          <div ref={rightColRef} className="space-y-2">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              New Service States — {claimTypeName}
            </div>
            {serviceStates.map((state) => {
              const isMatched = matchedServiceStates.has(state);
              return (
                <div
                  key={state}
                  ref={(el) => { rightRowRefs.current[state] = el; }}
                  className={[
                    'flex items-center justify-between gap-2 px-3 py-2 rounded-lg border text-sm',
                    isMatched
                      ? 'bg-slate-800/40 border-slate-700/30 text-slate-200'
                      : 'bg-amber-950/20 border-amber-800/30 text-slate-300',
                  ].join(' ')}
                >
                  <span className="text-xs">{state}</span>
                  {!isMatched && (
                    <Tooltip content={getTooltipText('badgeNew')}>
                      <span
                        className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium"
                        style={{ backgroundColor: 'rgba(245,158,11,0.15)', color: '#F59E0B' }}
                      >
                        New
                      </span>
                    </Tooltip>
                  )}
                  {isMatched && (
                    <span
                      className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium"
                      style={{ backgroundColor: 'rgba(34,197,94,0.12)', color: '#22C55E' }}
                    >
                      matched
                    </span>
                  )}
                </div>
              );
            })}

            {serviceStates.length === 0 && (
              <p className="text-xs text-slate-500 italic px-3 py-2">
                No states found for this claim type.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ label, value, colour }: { label: string; value: number; colour: string }) {
  return (
    <div className="bg-slate-900/50 border border-slate-700/30 rounded-xl p-4">
      <div className="text-xs font-medium text-slate-500 mb-1">{label}</div>
      <div className="text-2xl font-semibold" style={{ color: colour }}>{value}</div>
    </div>
  );
}
