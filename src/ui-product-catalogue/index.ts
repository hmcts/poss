/**
 * UI Product Catalogue — orchestration helpers
 *
 * Pure functions that transform catalogue data into display-ready shapes.
 */

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

interface SummaryCard {
  label: string;
  value: number;
}

interface TruncateResult {
  visible: string[];
  overflow: number;
}

export function getSummaryCards(items: CatalogueItem[]): SummaryCard[] {
  const domainGroups = new Set(items.map((i) => i.domainGroup));
  const allPersonas = new Set(items.flatMap((i) => i.personas));

  return [
    { label: 'Total Requirements', value: items.length },
    { label: 'Domain Groups', value: domainGroups.size },
    { label: 'Unique Personas', value: allPersonas.size },
  ];
}

export function truncatePersonas(personas: string[], max: number): TruncateResult {
  if (personas.length <= max) {
    return { visible: personas, overflow: 0 };
  }
  return {
    visible: personas.slice(0, max),
    overflow: personas.length - max,
  };
}

export function getExpandedDetail(item: CatalogueItem) {
  return {
    hlFunction: item.hlFunction,
    userStory: item.userStory,
    expectedOutcomes: item.expectedOutcomes,
    eventTrigger: item.eventTrigger,
    notes: item.notes,
    relatedRefs: item.relatedRefs,
    personas: item.personas,
    ucdRequired: item.ucdRequired,
    designScopeComplete: item.designScopeComplete,
    postR1DesignRequired: item.postR1DesignRequired,
    manualMode: item.manualMode,
    tshirtSize: item.tshirtSize,
  };
}
