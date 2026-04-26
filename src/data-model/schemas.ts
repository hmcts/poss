import { z } from 'zod';
import { WaAlignmentStatus } from './enums.ts';
import type { WaAlignmentStatusValue } from './enums.ts';

export const StateSchema = z.object({
  id: z.string(),
  technicalName: z.string(),
  uiLabel: z.string(),
  claimType: z.string(),
  isEndState: z.boolean(),
});

export type State = z.infer<typeof StateSchema>;

export const TransitionSchema = z.object({
  from: z.string(),
  to: z.string(),
  condition: z.string().nullable(),
  isSystemTriggered: z.boolean(),
  isTimeBased: z.boolean(),
});

export type Transition = z.infer<typeof TransitionSchema>;

export const EventSchema = z.object({
  id: z.string(),
  name: z.string(),
  claimType: z.string(),
  state: z.string(),
  isSystemEvent: z.boolean(),
  notes: z.string(),
  hasOpenQuestions: z.boolean(),
  actors: z.record(z.string(), z.boolean()),
});

export type Event = z.infer<typeof EventSchema>;

const waAlignmentValues = Object.values(WaAlignmentStatus) as [WaAlignmentStatusValue, ...WaAlignmentStatusValue[]];

export const WaTaskSchema = z.object({
  id: z.string(),
  triggerDescription: z.string(),
  taskName: z.string(),
  taskContext: z.string(),
  alignment: z.enum(waAlignmentValues),
});

export type WaTask = z.infer<typeof WaTaskSchema>;

export const WaTaskMappingSchema = z.object({
  waTaskId: z.string(),
  eventIds: z.array(z.string()),
  alignmentNotes: z.string(),
});

export type WaTaskMapping = z.infer<typeof WaTaskMappingSchema>;
