import { z } from "zod";

/**
 * Schemas for process configuration.
 * Each key is one configuration section (assign groups, numbering, etc.).
 */

/** Candidate groups for a process definition (comma-separated or single). */
export const assignGroupsSchema = z.object({
  groups: z
    .string()
    .min(1, "Grupos são obrigatórios")
    .refine(
      (val) => val.trim().length > 0,
      "Indique pelo menos um grupo (ex.: separados por vírgula)",
    ),
});

export type AssignGroupsValues = z.infer<typeof assignGroupsSchema>;

// Future config sections can be added here, e.g.:
// export const processNumberingSchema = z.object({ ... });
// export const taskConfigSchema = z.object({ ... });
