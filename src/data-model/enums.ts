export const ClaimTypeId = {
  MAIN_CLAIM_ENGLAND: 'MAIN_CLAIM_ENGLAND',
  ACCELERATED_CLAIM_WALES: 'ACCELERATED_CLAIM_WALES',
  COUNTER_CLAIM: 'COUNTER_CLAIM',
  COUNTER_CLAIM_MAIN_CLAIM_CLOSED: 'COUNTER_CLAIM_MAIN_CLAIM_CLOSED',
  ENFORCEMENT: 'ENFORCEMENT',
  APPEALS: 'APPEALS',
  GENERAL_APPLICATIONS: 'GENERAL_APPLICATIONS',
} as const;

export type ClaimTypeIdValue = (typeof ClaimTypeId)[keyof typeof ClaimTypeId];

export const WaTaskContext = Object.freeze({
  CLAIM: 'claim',
  COUNTERCLAIM: 'counterclaim',
  GEN_APP: 'gen-app',
  CLAIM_COUNTERCLAIM: 'claim-counterclaim',
  GENERAL: 'general',
} as const);

export type WaTaskContextValue = (typeof WaTaskContext)[keyof typeof WaTaskContext];

export const WaAlignmentStatus = Object.freeze({
  ALIGNED: 'aligned',
  PARTIAL: 'partial',
  GAP: 'gap',
} as const);

export type WaAlignmentStatusValue = (typeof WaAlignmentStatus)[keyof typeof WaAlignmentStatus];

export const KNOWN_ROLES: string[] = [
  'Judge',
  'Caseworker',
  'Claimant',
  'Defendant',
  'LegalAdvisor',
  'BailiffEnforcement',
  'CourtAdmin',
  'SystemAuto',
];
