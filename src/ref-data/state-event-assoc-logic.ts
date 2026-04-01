import type { RefState, StateEventAssoc } from './schema.ts';

const CLAIM_TYPE_LABELS: Record<string, string> = {
  MAIN_CLAIM_ENGLAND: 'Main Claim (England)',
  ACCELERATED_CLAIM_WALES: 'Accelerated Claim (Wales)',
  COUNTER_CLAIM: 'Counter Claim',
  COUNTER_CLAIM_MAIN_CLAIM_CLOSED: 'Counter Claim (Main Closed)',
  ENFORCEMENT: 'Enforcement',
  APPEALS: 'Appeals',
  GENERAL_APPLICATIONS: 'General Applications',
};

export function claimTypeLabel(claimType: string): string {
  return CLAIM_TYPE_LABELS[claimType] ?? claimType;
}

export function groupStatesByClaimType(states: RefState[]): { label: string; states: RefState[] }[] {
  const order = Object.keys(CLAIM_TYPE_LABELS);
  const map = new Map<string, RefState[]>();
  for (const s of states) {
    if (!map.has(s.claimType)) map.set(s.claimType, []);
    map.get(s.claimType)!.push(s);
  }
  const result: { label: string; states: RefState[] }[] = [];
  for (const ct of order) {
    if (map.has(ct)) result.push({ label: claimTypeLabel(ct), states: map.get(ct)! });
  }
  // any unknown claim types appended at end
  for (const [ct, sts] of map) {
    if (!order.includes(ct)) result.push({ label: claimTypeLabel(ct), states: sts });
  }
  return result;
}

export function getAssociatedEventIds(stateId: string, assocs: StateEventAssoc[]): string[] {
  return assocs.filter((a) => a.stateId === stateId).map((a) => a.eventId);
}

export function countAssociations(stateId: string, assocs: StateEventAssoc[]): number {
  return assocs.filter((a) => a.stateId === stateId).length;
}

export function toggleAssociation(
  stateId: string,
  eventId: string,
  assocs: StateEventAssoc[],
): StateEventAssoc[] {
  const exists = assocs.some((a) => a.stateId === stateId && a.eventId === eventId);
  if (exists) {
    return assocs.filter((a) => !(a.stateId === stateId && a.eventId === eventId));
  }
  return [...assocs, { stateId, eventId }];
}

export function isEventAssociated(
  stateId: string,
  eventId: string,
  assocs: StateEventAssoc[],
): boolean {
  return assocs.some((a) => a.stateId === stateId && a.eventId === eventId);
}
