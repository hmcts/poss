'use client';

import { useState, useMemo } from 'react';
import { useApp } from '../providers';
import { blobToWaTasks, blobToWaMappings } from '../../src/ref-data/adapter';
import {
  getDashboardSummary,
  getAlignedTaskRows,
  getPartialTaskRows,
  getGapTaskRows,
  groupTasksByContext,
  exportAlignmentCsv,
} from '../../src/ui-wa-tasks/dashboard-helpers';
import {
  getAboutSection,
} from '../../src/ui-about-work-allocation/index.js';

type ViewMode = 'tables' | 'by-context';

export default function WorkAllocationPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('tables');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const { refData, refDataLoading } = useApp();

  const waTasks = useMemo(() => blobToWaTasks(refData), [refData]);
  const waMappings = useMemo(() => blobToWaMappings(refData), [refData]);

  const summary = getDashboardSummary(waTasks as any, waMappings);
  const alignedRows = getAlignedTaskRows(waTasks as any, waMappings);
  const partialRows = getPartialTaskRows(waTasks as any, waMappings);
  const gapRows = getGapTaskRows(waTasks as any, waMappings);
  const contextGroups = groupTasksByContext(waTasks as any);

  const toggleExpand = (taskName: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(taskName)) next.delete(taskName);
      else next.add(taskName);
      return next;
    });
  };

  const handleExportCsv = () => {
    const csv = exportAlignmentCsv(waTasks as any, waMappings);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'wa-task-alignment.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  if (refDataLoading) {
    return (
      <div className="space-y-8">
        <div className="h-8 w-64 bg-slate-800/60 rounded animate-pulse" />
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 bg-slate-800/60 rounded-xl animate-pulse" />
          ))}
        </div>
        <div className="h-3 bg-slate-800/60 rounded-full animate-pulse" />
        <div className="h-48 bg-slate-800/60 rounded-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-100">Work Allocation Dashboard</h1>
            <p className="text-sm text-slate-400 mt-1">
              Alignment of R1A WA tasks against the possession event model
            </p>
          </div>
          <button
            onClick={handleExportCsv}
            className="px-4 py-2 text-sm font-medium text-slate-200 bg-slate-800/60 border border-slate-700/40 rounded-lg hover:bg-slate-700/60 transition-colors"
          >
            Export CSV
          </button>
        </div>
        <AboutPanel />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <SummaryCard label="Total Tasks" value={summary.total} colour="#6B7280" />
        <SummaryCard label="Aligned" value={summary.aligned} colour="#22C55E" pct={summary.alignedPct} />
        <SummaryCard label="Partial" value={summary.partial} colour="#F59E0B" pct={summary.partialPct} />
        <SummaryCard label="Gap" value={summary.gap} colour="#EF4444" pct={summary.gapPct} />
      </div>

      {/* Percentage Bar */}
      <div className="h-3 rounded-full overflow-hidden flex bg-slate-800/60">
        <div style={{ width: `${summary.alignedPct}%`, backgroundColor: '#22C55E' }} className="transition-all" />
        <div style={{ width: `${summary.partialPct}%`, backgroundColor: '#F59E0B' }} className="transition-all" />
        <div style={{ width: `${summary.gapPct}%`, backgroundColor: '#EF4444' }} className="transition-all" />
      </div>

      {/* View Toggle */}
      <div className="flex gap-2">
        {(['tables', 'by-context'] as ViewMode[]).map((mode) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              viewMode === mode
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                : 'text-slate-400 border border-slate-700/40 hover:text-slate-200'
            }`}
          >
            {mode === 'tables' ? 'Alignment Tables' : 'By Context'}
          </button>
        ))}
      </div>

      {/* Views */}
      {viewMode === 'tables' && (
        <div className="space-y-8">
          {/* Aligned Table */}
          <TableSection title="Aligned Tasks" badgeColour="#22C55E" count={alignedRows.length}>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-400 border-b border-slate-700/30">
                  <th className="py-2 px-3">Task Name</th>
                  <th className="py-2 px-3">Trigger</th>
                  <th className="py-2 px-3">Matched Events</th>
                </tr>
              </thead>
              <tbody>
                {alignedRows.map((row) => (
                  <tr key={row.taskName} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                    <td className="py-2.5 px-3 text-slate-200">{row.taskName}</td>
                    <td className="py-2.5 px-3 text-slate-400">{row.triggerDescription}</td>
                    <td className="py-2.5 px-3 text-slate-400">{row.matchedEvents.join(', ')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableSection>

          {/* Partial Table */}
          <TableSection title="Partial Tasks" badgeColour="#F59E0B" count={partialRows.length}>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-400 border-b border-slate-700/30">
                  <th className="py-2 px-3">Task Name</th>
                  <th className="py-2 px-3">Trigger</th>
                  <th className="py-2 px-3">Matched Events</th>
                  <th className="py-2 px-3">What is Missing</th>
                </tr>
              </thead>
              <tbody>
                {partialRows.map((row) => (
                  <tr
                    key={row.taskName}
                    className="border-b border-slate-800/50 hover:bg-slate-800/30 cursor-pointer"
                    onClick={() => toggleExpand(row.taskName)}
                  >
                    <td className="py-2.5 px-3 text-slate-200">
                      <span className="mr-1">{expandedRows.has(row.taskName) ? '\u25BE' : '\u25B8'}</span>
                      {row.taskName}
                    </td>
                    <td className="py-2.5 px-3 text-slate-400">{row.triggerDescription}</td>
                    <td className="py-2.5 px-3 text-slate-400">{row.matchedEvents.join(', ')}</td>
                    <td className="py-2.5 px-3 text-amber-400/80">
                      {expandedRows.has(row.taskName) ? row.missing : row.missing.slice(0, 60) + (row.missing.length > 60 ? '...' : '')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableSection>

          {/* Gap Table */}
          <TableSection title="Gap Tasks" badgeColour="#EF4444" count={gapRows.length}>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-400 border-b border-slate-700/30">
                  <th className="py-2 px-3">Task Name</th>
                  <th className="py-2 px-3">Trigger</th>
                  <th className="py-2 px-3">Recommendation</th>
                </tr>
              </thead>
              <tbody>
                {gapRows.map((row) => (
                  <tr key={row.taskName} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                    <td className="py-2.5 px-3 text-slate-200">{row.taskName}</td>
                    <td className="py-2.5 px-3 text-slate-400">{row.triggerDescription}</td>
                    <td className="py-2.5 px-3 text-red-400/80">{row.recommendation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableSection>
        </div>
      )}

      {viewMode === 'by-context' && (
        <div className="space-y-6">
          {Object.entries(contextGroups).map(([context, tasks]) => (
            <div key={context} className="bg-slate-900/50 border border-slate-700/30 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-slate-200 mb-3 flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-300 text-xs font-medium">
                  {context}
                </span>
                <span className="text-slate-500">{tasks.length} tasks</span>
              </h3>
              <div className="space-y-2">
                {tasks.map((task) => (
                  <div key={task.id} className="flex items-center gap-3 py-1.5">
                    <span
                      className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium"
                      style={{
                        backgroundColor:
                          task.alignment === 'aligned' ? 'rgba(34,197,94,0.15)' :
                          task.alignment === 'partial' ? 'rgba(245,158,11,0.15)' :
                          'rgba(239,68,68,0.15)',
                        color:
                          task.alignment === 'aligned' ? '#22C55E' :
                          task.alignment === 'partial' ? '#F59E0B' :
                          '#EF4444',
                      }}
                    >
                      {task.alignment}
                    </span>
                    <span className="text-sm text-slate-200">{task.taskName}</span>
                    <span className="text-xs text-slate-500 ml-auto">{task.triggerDescription}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AboutPanel() {
  const [open, setOpen] = useState(false);
  const sections = [
    getAboutSection('whatItDoes'),
    getAboutSection('alignmentCategories'),
    getAboutSection('scopeAssumption'),
    getAboutSection('byContextAssumption'),
  ];
  return (
    <div className="bg-slate-900/40 border border-slate-700/30 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm text-slate-400 hover:text-slate-200 hover:bg-slate-800/30 transition-colors"
      >
        <span className="font-medium">About this page — how alignment is assessed and what scope is covered</span>
        <svg
          className={`w-4 h-4 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="px-4 pb-4 space-y-4 text-sm text-slate-400 border-t border-slate-700/30 pt-4">
          {sections.map((section) => section && (
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

function SummaryCard({ label, value, colour, pct }: { label: string; value: number; colour: string; pct?: number }) {
  return (
    <div className="bg-slate-900/50 border border-slate-700/30 rounded-xl p-4">
      <div className="text-xs font-medium text-slate-500 mb-1">{label}</div>
      <div className="text-2xl font-semibold" style={{ color: colour }}>{value}</div>
      {pct !== undefined && (
        <div className="text-xs text-slate-500 mt-1">{pct}%</div>
      )}
    </div>
  );
}

function TableSection({ title, badgeColour, count, children }: { title: string; badgeColour: string; count: number; children: React.ReactNode }) {
  return (
    <div className="bg-slate-900/50 border border-slate-700/30 rounded-xl overflow-hidden">
      <div className="px-5 py-3 border-b border-slate-700/30 flex items-center gap-3">
        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: badgeColour }} />
        <h2 className="text-sm font-semibold text-slate-200">{title}</h2>
        <span className="text-xs text-slate-500">{count}</span>
      </div>
      {children}
    </div>
  );
}
