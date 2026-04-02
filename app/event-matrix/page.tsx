'use client';

import { useState, useMemo, useCallback } from 'react';
import { useApp } from '../providers';
import { getFilterOptions, applyFiltersAndSearch, prepareTableData, prepareCsvDownload, getEventMatrixSummary } from '../../src/ui-event-matrix/index';
import { filterEventsByPersona, getPersonaLabel } from '../../src/event-matrix/persona-filter';
import { getEventMatrixWaColumn, getWaTaskFilterOptions, filterEventsByWaTask } from '../../src/ui-wa-tasks/state-overlay-helpers';
import { blobToWaTasks, blobToWaMappings } from '../../src/ref-data/adapter';
import {
  PANEL_TITLE,
  SECTION_WHAT_IT_DOES,
  SECTION_OPEN_QUESTIONS,
  SECTION_ACTOR_GRID,
  SECTION_SYSTEM_FLAG,
  SECTION_WA_TASK,
} from '../../src/ui-about-event-matrix/index';

export default function EventMatrixPage() {
  const { modelData, refData } = useApp();
  const waTasks = useMemo(() => blobToWaTasks(refData), [refData]);
  const waMappings = useMemo(() => blobToWaMappings(refData), [refData]);
  const { events } = modelData;
  const [stateFilter, setStateFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [systemOnly, setSystemOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [waTaskFilter, setWaTaskFilter] = useState('');
  const [personaId, setPersonaId] = useState<string | null>(null);

  const filterOptions = useMemo(() => getFilterOptions(events), [events]);
  const waFilterOptions = useMemo(() => getWaTaskFilterOptions(waTasks), [waTasks]);
  const filteredEvents = useMemo(() => {
    const baseFiltered = applyFiltersAndSearch(events, {
      ...(stateFilter ? { state: stateFilter } : {}),
      ...(roleFilter ? { role: roleFilter } : {}),
      ...(systemOnly ? { systemOnly: true } : {}),
    }, searchQuery);
    const waFiltered = waTaskFilter ? filterEventsByWaTask(baseFiltered as any, waTaskFilter, waTasks as any, waMappings) : baseFiltered;
    return filterEventsByPersona(waFiltered as any, refData, personaId);
  }, [events, stateFilter, roleFilter, systemOnly, searchQuery, waTaskFilter, waTasks, waMappings, refData, personaId]);
  const tableData = useMemo(() => prepareTableData(filteredEvents as any, filterOptions.roles), [filteredEvents, filterOptions.roles]);
  const summary = useMemo(() => getEventMatrixSummary(events, filteredEvents as any), [events, filteredEvents]);

  const handleExportCsv = useCallback(() => {
    const csv = prepareCsvDownload(filteredEvents as any);
    const blob = new Blob([csv.content], { type: csv.mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = csv.filename; a.click();
    URL.revokeObjectURL(url);
  }, [filteredEvents]);

  const hasFilters = stateFilter || roleFilter || systemOnly || searchQuery || waTaskFilter || personaId;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-100 tracking-tight">Event Matrix</h2>
          <p className="text-[12px] text-slate-500 mt-0.5">
            {summary.filtered} of {summary.total} events
            {summary.openQuestions > 0 && <span className="text-amber-400"> &middot; {summary.openQuestions} open questions</span>}
            {summary.systemEvents > 0 && <span> &middot; {summary.systemEvents} system</span>}
          </p>
        </div>
        <button onClick={handleExportCsv} className="px-4 py-2 text-[12px] font-medium bg-slate-800/60 text-slate-300 border border-slate-700/40 rounded-lg hover:bg-slate-700/60 transition-all">
          Export CSV
        </button>
      </div>

      <AboutPanel />

      <div className="flex flex-wrap gap-3 items-center">
        <input type="text" placeholder="Search events..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          className="px-3 py-2 text-[13px] bg-slate-800/50 text-slate-200 border border-slate-700/40 rounded-lg focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 w-56 transition-all" />
        <select value={stateFilter} onChange={(e) => setStateFilter(e.target.value)}
          className="px-3 py-2 text-[13px] bg-slate-800/50 text-slate-200 border border-slate-700/40 rounded-lg focus:outline-none focus:border-indigo-500/50">
          <option value="">All States</option>
          {filterOptions.states.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}
          className="px-3 py-2 text-[13px] bg-slate-800/50 text-slate-200 border border-slate-700/40 rounded-lg focus:outline-none focus:border-indigo-500/50">
          <option value="">All Roles</option>
          {filterOptions.roles.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
        <label className="flex items-center gap-2 text-[12px] text-slate-400 cursor-pointer select-none">
          <input type="checkbox" checked={systemOnly} onChange={(e) => setSystemOnly(e.target.checked)} className="rounded bg-slate-800 border-slate-600 text-indigo-500" />
          System only
        </label>
        <select value={waTaskFilter} onChange={(e) => setWaTaskFilter(e.target.value)}
          className="px-3 py-2 text-[13px] bg-slate-800/50 text-slate-200 border border-slate-700/40 rounded-lg focus:outline-none focus:border-indigo-500/50">
          <option value="">All WA Tasks</option>
          {waFilterOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
        {(refData?.personas?.length ?? 0) > 0 && (
          <select value={personaId ?? ''} onChange={(e) => setPersonaId(e.target.value || null)}
            className="px-3 py-2 text-[13px] bg-slate-800/50 text-slate-200 border border-slate-700/40 rounded-lg focus:outline-none focus:border-indigo-500/50">
            <option value="">All personas</option>
            {refData?.personas?.map((p) => <option key={p.id} value={p.id}>{getPersonaLabel(p)}</option>)}
          </select>
        )}
        {hasFilters && (
          <button onClick={() => { setStateFilter(''); setRoleFilter(''); setSystemOnly(false); setSearchQuery(''); setWaTaskFilter(''); setPersonaId(null); }}
            className="text-[12px] text-indigo-400 hover:text-indigo-300 transition-colors">Clear</button>
        )}
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-700/30 shadow-lg shadow-black/10">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="bg-slate-800/60">
              <th className="text-left px-4 py-3 text-slate-500 font-medium sticky left-0 bg-slate-800/60 z-10">State</th>
              <th className="text-left px-4 py-3 text-slate-500 font-medium">Event</th>
              <th className="text-center px-3 py-3 text-slate-500 font-medium">Sys</th>
              <th className="text-left px-4 py-3 text-slate-500 font-medium max-w-xs">Notes</th>
              <th className="text-left px-4 py-3 text-slate-500 font-medium">WA Task</th>
              {tableData.headers.map((h) => (
                <th key={h} className="text-center px-3 py-3 text-slate-500 font-medium whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.rows.map((row) => (
              <tr key={row.event.id} className="border-t border-slate-700/20 hover:bg-slate-800/30 transition-colors">
                <td className="px-4 py-2.5 text-slate-400 sticky left-0 bg-[#0f172a] z-10 whitespace-nowrap">{row.event.state}</td>
                <td className="px-4 py-2.5 text-slate-200 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    {row.indicator.indicatorType === 'warning' && (
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: row.indicator.indicatorColor }} />
                    )}
                    {row.event.name}
                  </div>
                </td>
                <td className="text-center px-3 py-2.5">
                  {row.event.isSystemEvent && <span className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-500/15 text-indigo-400 font-medium">SYS</span>}
                </td>
                <td className="px-4 py-2.5 text-slate-600 max-w-xs truncate">{row.event.notes}</td>
                <td className="px-4 py-2.5 whitespace-nowrap">
                  {(() => {
                    const waCol = getEventMatrixWaColumn(row.event.name, waTasks, waMappings);
                    if (!waCol) return <span className="text-slate-600">--</span>;
                    return (
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: waCol.colourDot }} />
                        <span className="text-[12px] text-slate-300">{waCol.taskName}</span>
                      </div>
                    );
                  })()}
                </td>
                {row.actors.map((active, i) => (
                  <td key={tableData.headers[i]} className="text-center px-3 py-2.5">
                    {active && <span className="text-emerald-400">&#10003;</span>}
                  </td>
                ))}
              </tr>
            ))}
            {tableData.rows.length === 0 && (
              <tr><td colSpan={5 + tableData.headers.length} className="text-center py-12 text-slate-600">No events match the current filters</td></tr>
            )}
          </tbody>
        </table>
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
        <span className="font-medium">{PANEL_TITLE}</span>
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
            <p>{SECTION_WHAT_IT_DOES}</p>
          </div>
          <div>
            <h3 className="text-slate-200 font-medium mb-1">Open question indicator</h3>
            <p>{SECTION_OPEN_QUESTIONS}</p>
          </div>
          <div>
            <h3 className="text-slate-200 font-medium mb-1">Actor grid</h3>
            <p>{SECTION_ACTOR_GRID}</p>
          </div>
          <div>
            <h3 className="text-slate-200 font-medium mb-1">System flag</h3>
            <p>{SECTION_SYSTEM_FLAG}</p>
          </div>
          <div>
            <h3 className="text-slate-200 font-medium mb-1">WA task column</h3>
            <p>{SECTION_WA_TASK}</p>
          </div>
        </div>
      )}
    </div>
  );
}
