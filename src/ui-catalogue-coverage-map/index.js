import personaRoleMapping from '../../data/persona-role-mapping.json' assert { type: 'json' };

export function getPersonaRoleMapping(personaId) {
  return personaRoleMapping[personaId];
}

// getCoverageStyle(pct: number | null) → { bg, text, badge, label }
export function getCoverageStyle(pct) {
  if (pct === null) return { bg: '#334155', text: '#94a3b8', badge: '#475569', label: 'N/A' };
  if (pct === 100) return { bg: '#14532d', text: '#86efac', badge: '#16a34a', label: '100%' };
  if (pct > 0) return { bg: '#451a03', text: '#fcd34d', badge: '#d97706', label: `${pct}%` };
  return { bg: '#450a0a', text: '#fca5a5', badge: '#dc2626', label: 'gap' };
}

// getDistinctPersonas(items) → string[] sorted
export function getDistinctPersonas(items) {
  return [...new Set(items.flatMap(i => i.personas ?? []))].sort();
}

// groupByCrossGroup(items) → { [domainGroup]: item[] }
export function groupByCrossGroup(items) {
  return items.reduce((acc, item) => {
    const g = item.domainGroup ?? 'other';
    (acc[g] = acc[g] ?? []).push(item);
    return acc;
  }, {});
}

// buildCoverageSummaryCards(coverageMap, gaps, items) → card[]
export function buildCoverageSummaryCards(coverageMap, gaps, items) {
  const values = Object.values(coverageMap).filter(v => v !== null);
  const totalCoverage = values.length > 0 ? Math.round(values.reduce((a, b) => a + b, 0) / values.length) : 0;
  const gapCount = gaps.filter(g => g.severity === 'gap' || g.severity === 'critical').length;
  const criticalCount = gaps.filter(g => g.severity === 'critical').length;

  const byDomain = items.reduce((acc, item) => {
    const g = item.domainGroup ?? 'other';
    acc[g] = acc[g] ?? { total: 0, covered: 0 };
    acc[g].total++;
    return acc;
  }, {});

  return [
    { label: 'Total Coverage', value: `${totalCoverage}%` },
    { label: 'Gaps', value: gapCount, sub: criticalCount > 0 ? `${criticalCount} critical` : null },
    { label: 'Domain Groups', value: Object.keys(byDomain).length },
    { label: 'Items Analysed', value: items.length },
  ];
}
