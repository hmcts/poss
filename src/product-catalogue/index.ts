/**
 * Product Catalogue — logic layer
 *
 * Pure functions for filtering, sorting, summarising, and exporting
 * the HMCTS possession product catalogue data.
 */

// ── Types ───────────────────────────────────────────────────────────

interface CatalogueItem {
  ref: string;
  groupCode: string;
  groupName: string;
  subGroup: string;
  domainGroup: string;
  workPackage: string;
  feature: string;
  hlFunction: string;
  personas: string[];
  moscow: string;
  release1: string;
  priority: string;
  tshirtSize: string;
  category: string | null;
  notes: string | null;
  userStory: string | null;
  expectedOutcomes: string | null;
  eventTrigger: string | null;
  relatedRefs: string | null;
  ucdRequired: string | null;
  designScopeComplete: string | null;
  postR1DesignRequired: string | null;
  manualMode: string | null;
}

interface CatalogueFilters {
  domainGroups?: string[];
  moscow?: string[];
  personas?: string[];
  search?: string;
}

interface CatalogueSummary {
  total: number;
  moscowBreakdown: Record<string, number>;
  release1Breakdown: Record<string, number>;
  domainGroupCount: number;
  personaCount: number;
}

interface CsvExport {
  content: string;
  filename: string;
  mimeType: string;
}

// ── Filter Engine ───────────────────────────────────────────────────

export function filterCatalogue(items: CatalogueItem[], filters: CatalogueFilters): CatalogueItem[] {
  return items.filter((item) => {
    if (filters.domainGroups?.length && !filters.domainGroups.includes(item.domainGroup)) {
      return false;
    }
    if (filters.moscow?.length && !filters.moscow.includes(item.moscow)) {
      return false;
    }
    if (filters.personas?.length) {
      const match = filters.personas.some((p) => item.personas.includes(p));
      if (!match) return false;
    }
    if (filters.search && filters.search.trim() !== '') {
      const q = filters.search.toLowerCase();
      const fields = [item.ref, item.feature, item.hlFunction, item.userStory, item.notes];
      const found = fields.some((f) => f != null && f.toLowerCase().includes(q));
      if (!found) return false;
    }
    return true;
  });
}

// ── Sort ────────────────────────────────────────────────────────────

export function sortCatalogue(items: CatalogueItem[], key: string, direction: 'asc' | 'desc'): CatalogueItem[] {
  const sorted = [...items].sort((a, b) => {
    const va = (a as any)[key] ?? '';
    const vb = (b as any)[key] ?? '';
    if (va < vb) return -1;
    if (va > vb) return 1;
    return 0;
  });
  return direction === 'desc' ? sorted.reverse() : sorted;
}

// ── Summary ─────────────────────────────────────────────────────────

export function getCatalogueSummary(items: CatalogueItem[]): CatalogueSummary {
  const moscowBreakdown: Record<string, number> = {
    must: 0, should: 0, could: 0, wont: 0, welsh: 0, unknown: 0,
  };
  const release1Breakdown: Record<string, number> = {};
  const domainGroups = new Set<string>();
  const allPersonas = new Set<string>();

  for (const item of items) {
    const mk = item.moscow.toLowerCase();
    if (mk in moscowBreakdown) {
      moscowBreakdown[mk]++;
    } else {
      moscowBreakdown.unknown++;
    }

    release1Breakdown[item.release1] = (release1Breakdown[item.release1] || 0) + 1;
    domainGroups.add(item.domainGroup);
    for (const p of item.personas) {
      allPersonas.add(p);
    }
  }

  return {
    total: items.length,
    moscowBreakdown,
    release1Breakdown,
    domainGroupCount: domainGroups.size,
    personaCount: allPersonas.size,
  };
}

// ── CSV Export ───────────────────────────────────────────────────────

const CSV_HEADERS = [
  'Ref', 'Group Code', 'Group Name', 'Sub Group', 'Domain Group',
  'Work Package', 'Feature', 'HL Function', 'Personas', 'MoSCoW',
  'Release 1', 'Priority', 'T-Shirt Size', 'Category', 'Notes',
];

function csvEscape(field: string): string {
  if (field.includes(',') || field.includes('"') || field.includes('\n')) {
    return '"' + field.replace(/"/g, '""') + '"';
  }
  return field;
}

function serialise(val: unknown): string {
  if (val == null) return '';
  if (Array.isArray(val)) return val.join('; ');
  return String(val);
}

export function exportCatalogueCsv(items: CatalogueItem[], isFiltered: boolean): CsvExport {
  const lines = [CSV_HEADERS.join(',')];

  for (const item of items) {
    const fields = [
      item.ref, item.groupCode, item.groupName, item.subGroup, item.domainGroup,
      item.workPackage, item.feature, item.hlFunction, serialise(item.personas),
      item.moscow, item.release1, item.priority, item.tshirtSize,
      serialise(item.category), serialise(item.notes),
    ];
    lines.push(fields.map(csvEscape).join(','));
  }

  return {
    content: lines.join('\n'),
    filename: isFiltered ? 'product-catalogue-filtered.csv' : 'product-catalogue.csv',
    mimeType: 'text/csv',
  };
}
