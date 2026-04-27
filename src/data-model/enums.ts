export const WaAlignmentStatus = Object.freeze({
  ALIGNED: 'aligned',
  PARTIAL: 'partial',
  GAP: 'gap',
} as const);

export type WaAlignmentStatusValue = (typeof WaAlignmentStatus)[keyof typeof WaAlignmentStatus];
