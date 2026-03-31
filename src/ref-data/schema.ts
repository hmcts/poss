import { z } from 'zod';
import { WaTaskSchema } from '../data-model/schemas.ts';

export { WaTaskSchema };

export const RefStateSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
});

export type RefState = z.infer<typeof RefStateSchema>;

export const RefEventSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
});

export type RefEvent = z.infer<typeof RefEventSchema>;

export const PersonaSchema = z.object({
  id: z.string(),
  roles: z.array(z.string()),
  isCrossCutting: z.boolean(),
});

export type Persona = z.infer<typeof PersonaSchema>;

export const StateEventAssocSchema = z.object({
  stateId: z.string(),
  eventId: z.string(),
});

export type StateEventAssoc = z.infer<typeof StateEventAssocSchema>;

export const EventTaskAssocSchema = z.object({
  eventId: z.string(),
  waTaskId: z.string(),
  alignmentNotes: z.string(),
});

export type EventTaskAssoc = z.infer<typeof EventTaskAssocSchema>;

export const PersonaStateAssocSchema = z.object({
  personaId: z.string(),
  stateId: z.string(),
});

export type PersonaStateAssoc = z.infer<typeof PersonaStateAssocSchema>;

export const PersonaEventAssocSchema = z.object({
  personaId: z.string(),
  eventId: z.string(),
});

export type PersonaEventAssoc = z.infer<typeof PersonaEventAssocSchema>;

export const PersonaTaskAssocSchema = z.object({
  personaId: z.string(),
  waTaskId: z.string(),
});

export type PersonaTaskAssoc = z.infer<typeof PersonaTaskAssocSchema>;

export const ReferenceDataBlobSchema = z.object({
  states: z.array(RefStateSchema),
  events: z.array(RefEventSchema),
  waTasks: z.array(WaTaskSchema),
  personas: z.array(PersonaSchema),
  stateEventAssocs: z.array(StateEventAssocSchema),
  eventTaskAssocs: z.array(EventTaskAssocSchema),
  personaStateAssocs: z.array(PersonaStateAssocSchema),
  personaEventAssocs: z.array(PersonaEventAssocSchema),
  personaTaskAssocs: z.array(PersonaTaskAssocSchema),
});

export type ReferenceDataBlob = z.infer<typeof ReferenceDataBlobSchema>;
