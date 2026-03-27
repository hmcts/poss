import { WaTaskSchema, WaTaskMappingSchema } from '../data-model/schemas.ts';

interface ValidationResult {
  success: boolean;
  errors: string[];
}

export function validateWaData(tasks: unknown[], mappings: unknown[]): ValidationResult {
  const errors: string[] = [];

  // Check record counts
  if (tasks.length !== 17) {
    errors.push(`Expected 17 tasks, got ${tasks.length}`);
  }
  if (mappings.length !== 17) {
    errors.push(`Expected 17 mappings, got ${mappings.length}`);
  }

  // Validate each task against schema
  const validTaskIds = new Set<string>();
  for (const task of tasks) {
    const result = WaTaskSchema.safeParse(task);
    if (!result.success) {
      const taskId = (task as any)?.id ?? 'unknown';
      for (const issue of result.error.issues) {
        errors.push(`Task ${taskId}: ${issue.path.join('.')} - ${issue.message}`);
      }
    } else {
      validTaskIds.add(result.data.id);
    }
  }

  // Validate each mapping against schema
  for (const mapping of mappings) {
    const result = WaTaskMappingSchema.safeParse(mapping);
    if (!result.success) {
      const waTaskId = (mapping as any)?.waTaskId ?? 'unknown';
      for (const issue of result.error.issues) {
        errors.push(`Mapping ${waTaskId}: ${issue.path.join('.')} - ${issue.message}`);
      }
    }
  }

  // Check referential integrity: every mapping's waTaskId must exist in tasks
  for (const mapping of mappings) {
    const waTaskId = (mapping as any)?.waTaskId;
    if (waTaskId && !validTaskIds.has(waTaskId)) {
      errors.push(`Mapping references non-existent task: ${waTaskId}`);
    }
  }

  return {
    success: errors.length === 0,
    errors,
  };
}
