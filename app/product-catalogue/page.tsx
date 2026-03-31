'use client';

import { useState, useMemo } from 'react';
import catalogueData from '../../data/product-catalogue.json';
import {
  filterCatalogue,
  sortCatalogue,
  getCatalogueSummary,
  exportCatalogueCsv,
} from '../../src/product-catalogue/index';
import {
  getSummaryCards,
  truncatePersonas,
  getExpandedDetail,
} from '../../src/ui-product-catalogue/index';

type SortDir = 'asc' | 'desc';

export default function ProductCataloguePage() {
  const [domainGroupFilter, setDomainGroupFilter] = useState<string | null>(null);
  const [moscowFilter, setMoscowFilter] = useState<string | null>(null);
  const [personaFilter, setPersonaFilter] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<string | undefined>(undefined);
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [expandedRef, setExpandedRef] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const pageSize = 25;

  const allItems = catalogueData as any[];

  const summary = useMemo(() => getCatalogueSummary(allItems), [allItems]);
  const summaryCards = useMemo(() => getSummaryCards(allItems), [allItems]);

  // Build filter option lists
  const domainGroups = useMemo(
    () => [...new Set(allItems.map((i) => i.domainGroup))].sort(),
    [allItems],
  );
  const moscowValues = useMemo(
    () => [...new Set(allItems.map((i) => i.moscow))].sort(),
    [allItems],
  );
  const personaValues = useMemo(
    () => [...new Set(allItems.flatMap((i) => i.personas))].sort(),
    [allItems],
  );

  const filtered = useMemo(
    () =>
      filterCatalogue(allItems, {
        domainGroups: domainGroupFilter ? [domainGroupFilter] : undefined,
        moscow: moscowFilter ? [moscowFilter] : undefined,
        personas: personaFilter ? [personaFilter] : undefined,
        search: search || undefined,
      }),
    [allItems, domainGroupFilter, moscowFilter, personaFilter, search],
  );

  const sorted = useMemo(
    () => (sortKey ? sortCatalogue(filtered, sortKey, sortDir) : filtered),
    [filtered, sortKey, sortDir],
  );

  const isFiltered = !!(domainGroupFilter || moscowFilter || personaFilter || search);

  const totalPages = Math.ceil(sorted.length / pageSize);
  const paged = sorted.slice(page * pageSize, (page + 1) * pageSize);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const handleExportCsv = () => {
    const csv = exportCatalogueCsv(sorted, isFiltered);
    const blob = new Blob([csv.content], { type: csv.mimeType + ';charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = csv.filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleClearFilters = () => {
    setDomainGroupFilter(null);
    setMoscowFilter(null);
    setPersonaFilter(null);
    setSearch('');
    setPage(0);
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-100">Product Catalogue</h1>
            <p className="text-sm text-slate-400 mt-1">
              Browse, filter, and export the {summary.total} possession service requirements
            </p>
          </div>
          <button
            onClick={handleExportCsv}
            className="px-4 py-2 text-sm font-medium text-slate-200 bg-slate-800/60 border border-slate-700/40 rounded-lg hover:bg-slate-700/60 transition-colors"
          >
            Export CSV
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        {summaryCards.map((card) => (
          <div key={card.label} className="bg-slate-900/50 border border-slate-700/30 rounded-xl p-4">
            <div className="text-xs font-medium text-slate-500 mb-1">{card.label}</div>
            <div className="text-2xl font-semibold text-slate-100">{card.value}</div>
          </div>
        ))}
      </div>

      {/* MoSCoW Breakdown */}
      <div className="grid grid-cols-6 gap-3">
        {Object.entries(summary.moscowBreakdown).map(([key, count]) => (
          <div key={key} className="bg-slate-900/50 border border-slate-700/30 rounded-lg p-3 text-center">
            <div className="text-xs text-slate-500 mb-0.5 capitalize">{key}</div>
            <div className="text-lg font-semibold text-slate-200">{count}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 items-center flex-wrap">
        <select
          value={domainGroupFilter ?? ''}
          onChange={(e) => { setDomainGroupFilter(e.target.value || null); setPage(0); }}
          className="px-3 py-1.5 text-xs bg-slate-900/50 border border-slate-700/40 rounded-md text-slate-200"
        >
          <option value="">All Domain Groups</option>
          {domainGroups.map((dg) => (
            <option key={dg} value={dg}>{dg}</option>
          ))}
        </select>
        <select
          value={moscowFilter ?? ''}
          onChange={(e) => { setMoscowFilter(e.target.value || null); setPage(0); }}
          className="px-3 py-1.5 text-xs bg-slate-900/50 border border-slate-700/40 rounded-md text-slate-200"
        >
          <option value="">All MoSCoW</option>
          {moscowValues.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
        <select
          value={personaFilter ?? ''}
          onChange={(e) => { setPersonaFilter(e.target.value || null); setPage(0); }}
          className="px-3 py-1.5 text-xs bg-slate-900/50 border border-slate-700/40 rounded-md text-slate-200"
        >
          <option value="">All Personas</option>
          {personaValues.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Search requirements..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0); }}
          className="px-3 py-1.5 text-xs bg-slate-900/50 border border-slate-700/40 rounded-md text-slate-200 placeholder:text-slate-500 w-60"
        />
        {isFiltered && (
          <button
            onClick={handleClearFilters}
            className="px-2 py-1 text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            Clear filters
          </button>
        )}
        <span className="text-xs text-slate-500 ml-auto">
          {sorted.length} of {allItems.length} requirements
        </span>
      </div>

      {/* Requirements Table */}
      <div className="bg-slate-900/50 border border-slate-700/30 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-400 border-b border-slate-700/30">
              {[
                { key: 'ref', label: 'Ref' },
                { key: 'domainGroup', label: 'Domain Group' },
                { key: 'feature', label: 'Feature' },
                { key: 'personas', label: 'Personas' },
                { key: 'moscow', label: 'MoSCoW' },
                { key: 'release1', label: 'R1' },
                { key: 'priority', label: 'Priority' },
              ].map((col) => (
                <th
                  key={col.key}
                  className="py-2 px-3 cursor-pointer hover:text-slate-200 transition-colors"
                  onClick={() => handleSort(col.key)}
                >
                  {col.label}
                  {sortKey === col.key && (sortDir === 'asc' ? ' \u25B2' : ' \u25BC')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.map((item, idx) => {
              const itemKey = item.ref || `page-${page}-${idx}`;
              const isExpanded = expandedRef === itemKey;
              const { visible, overflow } = truncatePersonas(item.personas, 3);
              return (
                <tr
                  key={itemKey}
                  className={`border-b border-slate-800/50 hover:bg-slate-800/30 cursor-pointer ${isExpanded ? 'bg-slate-800/20' : ''}`}
                  onClick={() => setExpandedRef(isExpanded ? null : itemKey)}
                >
                  <td className="py-2.5 px-3 text-slate-300 font-mono text-xs">{item.ref}</td>
                  <td className="py-2.5 px-3 text-slate-400 text-xs">{item.domainGroup}</td>
                  <td className="py-2.5 px-3 text-slate-200 max-w-xs truncate">{item.feature}</td>
                  <td className="py-2.5 px-3 text-slate-400 text-xs">
                    {visible.join(', ')}
                    {overflow > 0 && <span className="text-slate-500"> +{overflow}</span>}
                  </td>
                  <td className="py-2.5 px-3">
                    <MoscowBadge value={item.moscow} />
                  </td>
                  <td className="py-2.5 px-3 text-slate-400 text-xs">{item.release1}</td>
                  <td className="py-2.5 px-3 text-slate-400 text-xs">{item.priority}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Showing {page * pageSize + 1}–{Math.min((page + 1) * pageSize, sorted.length)} of {sorted.length}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(0)}
              disabled={page === 0}
              className="px-2 py-1 text-xs text-slate-400 hover:text-slate-200 disabled:text-slate-600 disabled:cursor-not-allowed transition-colors"
            >
              First
            </button>
            <button
              onClick={() => setPage((p) => p - 1)}
              disabled={page === 0}
              className="px-2 py-1 text-xs text-slate-400 hover:text-slate-200 disabled:text-slate-600 disabled:cursor-not-allowed transition-colors"
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`px-2 py-1 text-xs rounded transition-colors ${
                  i === page
                    ? 'bg-slate-700 text-slate-100'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= totalPages - 1}
              className="px-2 py-1 text-xs text-slate-400 hover:text-slate-200 disabled:text-slate-600 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
            <button
              onClick={() => setPage(totalPages - 1)}
              disabled={page >= totalPages - 1}
              className="px-2 py-1 text-xs text-slate-400 hover:text-slate-200 disabled:text-slate-600 disabled:cursor-not-allowed transition-colors"
            >
              Last
            </button>
          </div>
        </div>
      )}

      {/* Expanded Detail Panel */}
      {expandedRef && (() => {
        const item = paged.find((i, idx) => (i.ref || `page-${page}-${idx}`) === expandedRef);
        return item ? (
          <ExpandedPanel item={item} onClose={() => setExpandedRef(null)} />
        ) : null;
      })()}
    </div>
  );
}

function ExpandedPanel({ item, onClose }: { item: any; onClose: () => void }) {
  const detail = getExpandedDetail(item);
  const fields = [
    { label: 'High-Level Function', value: detail.hlFunction },
    { label: 'User Story', value: detail.userStory },
    { label: 'Expected Outcomes', value: detail.expectedOutcomes },
    { label: 'Event Trigger', value: detail.eventTrigger },
    { label: 'Notes', value: detail.notes },
    { label: 'Related Refs', value: detail.relatedRefs },
    { label: 'Personas', value: detail.personas?.join(', ') },
    { label: 'T-Shirt Size', value: detail.tshirtSize },
    { label: 'UCD Required', value: detail.ucdRequired },
    { label: 'Design Scope Complete', value: detail.designScopeComplete },
    { label: 'Post-R1 Design Required', value: detail.postR1DesignRequired },
    { label: 'Manual Mode', value: detail.manualMode },
  ];

  return (
    <div className="bg-slate-900/60 border border-slate-700/30 rounded-xl p-5 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-100">{item.ref} — {item.feature}</h3>
        <button
          onClick={onClose}
          className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
        >
          Close
        </button>
      </div>
      <div className="grid grid-cols-2 gap-x-8 gap-y-2">
        {fields.map(({ label, value }) => (
          <div key={label}>
            <dt className="text-[10px] font-medium text-slate-500 uppercase tracking-wide">{label}</dt>
            <dd className="text-xs text-slate-300 mt-0.5 whitespace-pre-wrap">
              {value || <span className="text-slate-600">—</span>}
            </dd>
          </div>
        ))}
      </div>
    </div>
  );
}

function MoscowBadge({ value }: { value: string }) {
  const colours: Record<string, { bg: string; text: string }> = {
    must: { bg: 'rgba(239,68,68,0.15)', text: '#EF4444' },
    should: { bg: 'rgba(245,158,11,0.15)', text: '#F59E0B' },
    could: { bg: 'rgba(34,197,94,0.15)', text: '#22C55E' },
    wont: { bg: 'rgba(107,114,128,0.15)', text: '#6B7280' },
  };
  const c = colours[value.toLowerCase()] ?? { bg: 'rgba(107,114,128,0.1)', text: '#9CA3AF' };
  return (
    <span
      className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium"
      style={{ backgroundColor: c.bg, color: c.text }}
    >
      {value}
    </span>
  );
}
