"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { assignGroupsToProcessDefinition } from "@/app/(myapp)/client/process";
import { useIGRPToast } from "@igrp/igrp-framework-react-design-system";
import { assignGroupsSchema, type AssignGroupsValues } from "./schemas";

/**
 * Single hook for all process configuration: assign groups, numbering, task config, etc.
 * Each config section is one object with schema, form and handler.
 */
export function useProcessConfig() {
  const { igrpToast } = useIGRPToast();

  // --- assignGroups (candidate groups) ---
  const assignGroupsForm = useForm<AssignGroupsValues>({
    resolver: zodResolver(assignGroupsSchema),
    defaultValues: { groups: "" },
  });

  const handleAssignGroupsToProcess = async (
    processDefinitionId: string,
    groups: string,
  ) => {
    const parsed = assignGroupsSchema.safeParse({ groups });
    if (!parsed.success) {
      igrpToast({
        type: "error",
        title: "Erro de validação",
        description: parsed.error.errors[0]?.message ?? "Dados inválidos.",
      });
      return;
    }

    try {
      await assignGroupsToProcessDefinition(
        processDefinitionId,
        parsed.data.groups.trim(),
      );
      igrpToast({
        type: "success",
        title: "Sucesso",
        description: "Grupos atribuídos com sucesso!",
      });
    } catch (error) {
      console.error("Error assigning groups to process:", error);
      igrpToast({
        type: "error",
        title: "Erro",
        description: "Erro ao atribuir grupos ao processo. Tente novamente.",
      });
      throw error;
    }
  };

  return {
    assignGroups: {
      schema: assignGroupsSchema,
      form: assignGroupsForm,
      handleAssignGroupsToProcess,
    },
    // Future sections, e.g.:
    // processNumbering: { schema, form, handleSave },
    // taskConfig: { schema, form, handleSave },
  };
}
