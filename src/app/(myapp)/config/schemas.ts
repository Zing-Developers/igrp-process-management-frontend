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

/** Process numbering configuration (prefix, date format, sequence length). */
export const processNumberingSchema = z.object({
  prefix: z.string(),
  dateFormat: z.string(),
  separator: z.string(),
  sequenceLength: z.number().min(1).max(10),
});

export type ProcessNumberingValues = z.infer<typeof processNumberingSchema>;
