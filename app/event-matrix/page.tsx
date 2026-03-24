'use client';

import { useState, useMemo, useCallback } from 'react';
import { useApp } from '../providers';
import { getFilterOptions, applyFiltersAndSearch, prepareTableData, prepareCsvDownload, getEventMatrixSummary } from '../../src/ui-event-matrix/index';

export default function EventMatrixPage() {
  const { modelData } = useApp();
  const { events } = modelData;
  const [stateFilter, setStateFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [systemOnly, setSystemOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filterOptions = useMemo(() => getFilterOptions(events), [events]);
  const filteredEvents = useMemo(() =>
    applyFiltersAndSearch(events, {
      ...(stateFilter ? { state: stateFilter } : {}),
      ...(roleFilter ? { role: roleFilter } : {}),
      ...(systemOnly ? { systemOnly: true } : {}),
    }, searchQuery),
  [events, stateFilter, roleFilter, systemOnly, searchQuery]);
  const tableData = useMemo(() => prepareTableData(filteredEvents, filterOptions.roles), [filteredEvents, filterOptions.roles]);
  const summary = useMemo(() => getEventMatrixSummary(events, filteredEvents), [events, filteredEvents]);

  const handleExportCsv = useCallback(() => {
    const csv = prepareCsvDownload(filteredEvents);
    const blob = new Blob([csv.content], { type: csv.mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = csv.filename; a.click();
    URL.revokeObjectURL(url);
  }, [filteredEvents]);

  const hasFilters = stateFilter || roleFilter || systemOnly || searchQuery;

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
        {hasFilters && (
          <button onClick={() => { setStateFilter(''); setRoleFilter(''); setSystemOnly(false); setSearchQuery(''); }}
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
                {row.actors.map((active, i) => (
                  <td key={tableData.headers[i]} className="text-center px-3 py-2.5">
                    {active && <span className="text-emerald-400">&#10003;</span>}
                  </td>
                ))}
              </tr>
            ))}
            {tableData.rows.length === 0 && (
              <tr><td colSpan={4 + tableData.headers.length} className="text-center py-12 text-slate-600">No events match the current filters</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
