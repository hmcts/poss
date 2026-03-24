import { z } from 'zod';

export const StateSchema = z.object({
  id: z.string(),
  technicalName: z.string(),
  uiLabel: z.string(),
  claimType: z.string(),
  isDraftLike: z.boolean(),
  isLive: z.boolean(),
  isEndState: z.boolean(),
  completeness: z.number().int().min(0).max(100),
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

export const ClaimTypeSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
});

export type ClaimType = z.infer<typeof ClaimTypeSchema>;
