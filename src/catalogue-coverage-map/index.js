/**
 * Catalogue coverage map — links product catalogue items to state-machine
 * events and states.
 *
 * Field fallbacks for Product schema compatibility:
 *   ref        → item.id
 *   feature    → item.name
 *   domainGroup → item.category
 */

export function filterByReleaseScope(items, scope) {
  if (!scope || scope === 'all') return items;
  const allowed = scope === 'r1+tbc' ? ['r1', 'tbc', undefined, null, ''] : [scope];
  return items.filter(i => allowed.includes(i.releaseScope));
}

export function matchByEventTrigger(item, events) {
  if (!item.eventTrigger) return [];
  const trigger = item.eventTrigger.trim().toLowerCase();
  const ref = item.ref ?? item.id;
  return events
    .filter(e => e.name?.trim().toLowerCase() === trigger)
    .map(e => ({ eventId: e.id, stateId: e.state ?? null, catalogueRef: ref }));
}

export function matchByDomainAndFeature(item, states, events) {
  const feature = item.feature ?? item.name ?? '';
  const domain = item.domainGroup ?? item.category ?? '';
  if (!feature && !domain) return [];
  const featureLower = feature.toLowerCase();
  const domainLower = domain.toLowerCase();
  const ref = item.ref ?? item.id;

  return events
    .filter(e => {
      const nameLower = (e.name ?? '').toLowerCase();
      return (featureLower && nameLower.includes(featureLower)) ||
             (domainLower && nameLower.includes(domainLower));
    })
    .map(e => ({ eventId: e.id, stateId: e.state ?? null, catalogueRef: ref }));
}
