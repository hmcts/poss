'use client';

import { useMemo } from 'react';
import { Tooltip } from './Tooltip';
import { getTooltipText, buildDomainTooltip } from '../../src/ui-caseman-tooltips/index';

// ── Types ──────────────────────────────────────────────────────────────────

interface CasemanEvent {
  id: number;
  name: string;
  domain: string;
  taskCodes: string[];
  prerequisiteIds: number[];
}

interface WaTask {
  id: string;
  taskName: string;
  alignment: string;
  [key: string]: unknown;
}

interface WaMapping {
  waTaskId: string;
  eventIds: string[];
  alignmentNotes: string;
}

interface Props {
  casemanEvents: CasemanEvent[];
  waTasks: WaTask[];
  waMappings: WaMapping[];
}

// ── Constants ─────────────────────────────────────────────────────────────

const DOMAIN_ORDER = [
  'CCBC', 'Issue', 'Enforcement', 'Judgments&Hearings', 'Payments',
  'Listing', 'Accounts', 'Complaints', 'DistrictRegistry',
  'Family', 'Insolvency', 'Statistics', 'Unclassified',
];

// ── Helpers ───────────────────────────────────────────────────────────────

function alignmentColour(alignment: string): { bg: string; text: string } {
  if (alignment === 'aligned') return { bg: 'rgba(34,197,94,0.15)', text: '#22C55E' };
  if (alignment === 'partial') return { bg: 'rgba(245,158,11,0.15)', text: '#F59E0B' };
  return { bg: 'rgba(239,68,68,0.15)', text: '#EF4444' };
}

function coverageColour(status: 'green' | 'amber' | 'red'): string {
  if (status === 'green') return '#166534';  // dark green bg
  if (status === 'amber') return '#92400e';  // dark amber bg
  return '#7f1d1d';                           // dark red bg
}

function coverageBorder(status: 'green' | 'amber' | 'red'): string {
  if (status === 'green') return '#22C55E';
  if (status === 'amber') return '#F59E0B';
  return '#EF4444';
}

// Fuzzy match: does a WA event name reference a caseman event?
// Try exact (case-insensitive) then substring.
function findMatchingDomains(
  eventIds: string[],
  casemanEvents: CasemanEvent[],
): Set<string> {
  const domains = new Set<string>();
  for (const eid of eventIds) {
    const lower = eid.toLowerCase();
    for (const ev of casemanEvents) {
      if (ev.name.toLowerCase() === lower || ev.name.toLowerCase().includes(lower) || lower.includes(ev.name.toLowerCase())) {
        domains.add(ev.domain);
      }
    }
  }
  return domains;
}

// ── Main component ─────────────────────────────────────────────────────────

export default function TasksTab({ casemanEvents, waTasks, waMappings }: Props) {
  // 1. Domain sizes
  const domainCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const d of DOMAIN_ORDER) counts[d] = 0;
    for (const ev of casemanEvents) {
      if (counts[ev.domain] !== undefined) counts[ev.domain]++;
      else counts[ev.domain] = 1;
    }
    return counts;
  }, [casemanEvents]);

  const totalEvents = useMemo(
    () => Object.values(domainCounts).reduce((a, b) => a + b, 0),
    [domainCounts],
  );

  // 2. WA task → domains covered
  const taskDomains = useMemo(() => {
    const result: Record<string, Set<string>> = {};
    for (const mapping of waMappings) {
      result[mapping.waTaskId] = findMatchingDomains(mapping.eventIds, casemanEvents);
    }
    return result;
  }, [waMappings, casemanEvents]);

  // 3. Domain coverage status
  const domainCoverage = useMemo(() => {
    const status: Record<string, 'green' | 'amber' | 'red'> = {};
    for (const domain of DOMAIN_ORDER) {
      let hasAligned = false;
      let hasPartial = false;
      for (const task of waTasks) {
        const covered = taskDomains[task.id];
        if (covered && covered.has(domain)) {
          if (task.alignment === 'aligned') hasAligned = true;
          else if (task.alignment === 'partial') hasPartial = true;
        }
      }
      if (hasAligned) status[domain] = 'green';
      else if (hasPartial) status[domain] = 'amber';
      else status[domain] = 'red';
    }
    return status;
  }, [waTasks, taskDomains]);

  // 4. Summary count
  const coveredDomains = useMemo(() => {
    return DOMAIN_ORDER.filter((d) => domainCoverage[d] !== 'red').length;
  }, [domainCoverage]);

  const greenCount = DOMAIN_ORDER.filter((d) => domainCoverage[d] === 'green').length;
  const amberCount = DOMAIN_ORDER.filter((d) => domainCoverage[d] === 'amber').length;
  const redCount = DOMAIN_ORDER.filter((d) => domainCoverage[d] === 'red').length;
  const totalDomains = DOMAIN_ORDER.length;
  const coveragePct = Math.round((coveredDomains / totalDomains) * 100);

  return (
    <div className="space-y-6">
      {/* Summary card */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-slate-900/50 border border-slate-700/30 rounded-xl p-4">
          <div className="text-xs font-medium text-slate-500 mb-1">Total Domains</div>
          <div className="text-2xl font-semibold text-slate-200">{totalDomains}</div>
        </div>
        <div className="bg-slate-900/50 border border-green-700/30 rounded-xl p-4">
          <div className="text-xs font-medium text-slate-500 mb-1">Aligned</div>
          <div className="text-2xl font-semibold text-green-400">{greenCount}</div>
        </div>
        <div className="bg-slate-900/50 border border-amber-700/30 rounded-xl p-4">
          <div className="text-xs font-medium text-slate-500 mb-1">Partial</div>
          <div className="text-2xl font-semibold text-amber-400">{amberCount}</div>
        </div>
        <div className="bg-slate-900/50 border border-red-700/30 rounded-xl p-4">
          <div className="text-xs font-medium text-slate-500 mb-1">No Coverage</div>
          <div className="text-2xl font-semibold text-red-400">{redCount}</div>
        </div>
      </div>

      <div className="bg-slate-900/50 border border-indigo-700/30 rounded-xl p-4">
        <p className="text-slate-200 text-sm font-medium">
          {coveredDomains} of {totalDomains} Caseman domains have at least partial WA coverage
          <span className="ml-2 text-slate-400">({coveragePct}%)</span>
        </p>
      </div>

      {/* Block chart */}
      <div className="bg-slate-900/50 border border-slate-700/30 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-200">Domain Coverage Block Chart</h2>
          {/* Legend */}
          <div className="flex gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-3 rounded-sm bg-green-800 border border-green-500" />
              Aligned
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-3 rounded-sm bg-amber-900 border border-amber-500" />
              Partial
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-3 rounded-sm bg-red-900 border border-red-500" />
              No Coverage
            </span>
          </div>
        </div>

        {/* Proportional blocks row */}
        <div className="flex w-full h-20 gap-0.5 overflow-hidden rounded-lg">
          {DOMAIN_ORDER.map((domain) => {
            const count = domainCounts[domain] ?? 0;
            const flex = Math.max(count, 1); // min 1 so all domains show
            const status = domainCoverage[domain];
            const coveringTaskNames = waTasks
              .filter((t) => taskDomains[t.id] && taskDomains[t.id].has(domain))
              .map((t) => t.taskName);
            const tooltipContent = domain === 'Unclassified'
              ? getTooltipText('unclassifiedBlock')
              : buildDomainTooltip(domain, count, coveringTaskNames);
            return (
              <Tooltip key={domain} content={tooltipContent} position="bottom" className="contents">
                <div
                  style={{
                    flex,
                    minWidth: 40,
                    backgroundColor: coverageColour(status),
                    borderLeft: `2px solid ${coverageBorder(status)}`,
                  }}
                  className="flex flex-col items-center justify-center px-1 overflow-hidden cursor-default"
                >
                  <span className="text-[9px] font-semibold text-white text-center leading-tight truncate w-full text-center">
                    {domain}
                  </span>
                  <span className="text-[10px] font-bold text-white/80">{count}</span>
                </div>
              </Tooltip>
            );
          })}
        </div>

        {/* Accessible table fallback */}
        <details className="mt-2">
          <summary className="text-xs text-slate-500 cursor-pointer hover:text-slate-300 transition-colors">
            Show accessible table view
          </summary>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-left text-slate-400 border-b border-slate-700/30">
                  <th className="py-1.5 px-3">Domain</th>
                  <th className="py-1.5 px-3">Event Count</th>
                  <th className="py-1.5 px-3">WA Tasks Covering</th>
                  <th className="py-1.5 px-3">Coverage Status</th>
                </tr>
              </thead>
              <tbody>
                {DOMAIN_ORDER.map((domain) => {
                  const count = domainCounts[domain] ?? 0;
                  const status = domainCoverage[domain];
                  const coveringTasks = waTasks.filter(
                    (t) => taskDomains[t.id] && taskDomains[t.id].has(domain),
                  );
                  return (
                    <tr key={domain} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                      <td className="py-1.5 px-3 text-slate-200 font-medium">{domain}</td>
                      <td className="py-1.5 px-3 text-slate-400">{count}</td>
                      <td className="py-1.5 px-3 text-slate-400">
                        {coveringTasks.length > 0
                          ? coveringTasks.map((t) => t.taskName).join(', ')
                          : '—'}
                      </td>
                      <td className="py-1.5 px-3">
                        <AlignmentBadge alignment={status === 'green' ? 'aligned' : status === 'amber' ? 'partial' : 'gap'} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </details>
      </div>

      {/* WA Task summary table */}
      <div className="bg-slate-900/50 border border-slate-700/30 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-700/30">
          <h2 className="text-sm font-semibold text-slate-200">WA Task Summary</h2>
          <p className="text-xs text-slate-400 mt-0.5">{waTasks.length} R1A WA tasks</p>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-400 border-b border-slate-700/30">
              <th className="py-2 px-4">Task Name</th>
              <th className="py-2 px-4">Alignment</th>
              <th className="py-2 px-4">Domains Covered</th>
              <th className="py-2 px-4">Notes</th>
            </tr>
          </thead>
          <tbody>
            {waTasks.map((task) => {
              const mapping = waMappings.find((m) => m.waTaskId === task.id);
              const domains = taskDomains[task.id];
              const domainList = domains && domains.size > 0
                ? Array.from(domains).join(', ')
                : '—';
              return (
                <tr key={task.id} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                  <td className="py-2.5 px-4 text-slate-200">{task.taskName}</td>
                  <td className="py-2.5 px-4">
                    <AlignmentBadge alignment={task.alignment} />
                  </td>
                  <td className="py-2.5 px-4 text-slate-400 text-xs">{domainList}</td>
                  <td className="py-2.5 px-4 text-slate-400 text-xs max-w-xs">
                    {mapping?.alignmentNotes ?? '—'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AlignmentBadge({ alignment }: { alignment: string }) {
  const c = alignmentColour(alignment);
  return (
    <span
      className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium"
      style={{ backgroundColor: c.bg, color: c.text }}
    >
      {alignment}
    </span>
  );
}
