"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  assignGroupsToProcessDefinition,
  getProcessNumberConfigs,
  saveProcessNumberConfig,
} from "@/app/(myapp)/client/process";
import { useIGRPToast } from "@igrp/igrp-framework-react-design-system";
import {
  assignGroupsSchema,
  processNumberingSchema,
  type AssignGroupsValues,
  type ProcessNumberingValues,
} from "./schemas";
import { ProcessDefinition } from "@igrp/platform-process-management-types";

const numberingDefaultValues: ProcessNumberingValues = {
  prefix: "",
  dateFormat: "yyyy",
  separator: "-",
  sequenceLength: 3,
};

/**
 * Single hook for all process configuration: assign groups, numbering, task config, etc.
 * Each config section is one object with schema, form and handler.
 */
export function useProcessConfig({ processSelected }: { processSelected?: ProcessDefinition } = {}) {
  const { igrpToast } = useIGRPToast();

  const { processKey, candidateGroups, id } = processSelected || {};

  // --- assignGroups (candidate groups) ---
  const assignGroupsForm = useForm<AssignGroupsValues>({
    resolver: zodResolver(assignGroupsSchema),
    defaultValues: { groups: "" },
  });

  // --- processNumbering ---
  const numberingForm = useForm<ProcessNumberingValues>({
    resolver: zodResolver(processNumberingSchema),
    defaultValues: numberingDefaultValues,
  });

  const addFieldValueToForm = (field: 'prefix' | 'dateFormat' | 'separator' | 'sequenceLength', value: string) => {
    numberingForm.setValue(field, value);
  };

  const loadAssignGroupsConfig = () => {
    assignGroupsForm.reset({ groups: candidateGroups?.trim() ?? "" });
  };

  const loadNumberingConfig = async () => {
    try {
      const config = await getProcessNumberConfigs(processKey ?? "");
      numberingForm.reset({
        prefix: config.prefix ?? "",
        dateFormat: config.dateFormat ?? "yyyy",
        separator: "-",
        sequenceLength: config.checkDigitSize ?? 3,
      });
    } catch {
      numberingForm.reset(numberingDefaultValues);
    }
  };

  const handleSaveNumberingConfig = async (
    values?: ProcessNumberingValues,
  ) => {
    const data = values ?? numberingForm.getValues();
    const parsed = processNumberingSchema.safeParse(data);
    if (!parsed.success) {
      igrpToast({
        type: "error",
        title: "Erro de validação",
        description:
          parsed.error.issues[0]?.message ?? "Dados inválidos.",
      });
      return;
    }

    try {
      await saveProcessNumberConfig(processKey ?? "", {
        name: `${processKey}_sequence`,
        prefix: parsed.data.prefix,
        dateFormat: parsed.data.dateFormat,
        checkDigitSize: parsed.data.sequenceLength,
        padding: 0,
        numberIncrement: 1,
      });
      igrpToast({
        type: "success",
        title: "Sucesso",
        description: "Configuração de número de processo salva com sucesso!",
      });
    } catch (error) {
      console.error("Error saving process number configuration:", error);
      igrpToast({
        type: "error",
        title: "Erro",
        description: "Erro ao salvar configuração. Tente novamente.",
      });
      throw error;
    }
  };

  const handleAssignGroupsToProcess = async (
    groups: string,
  ) => {
    if (!id) {
      igrpToast({
        type: "error",
        title: "Erro",
        description: "Processo não selecionado.",
      });
      return;
    }
    const parsed = assignGroupsSchema.safeParse({ groups });
    if (!parsed.success) {
      igrpToast({
        type: "error",
        title: "Erro de validação",
        description:
          parsed.error.issues[0]?.message ?? "Dados inválidos.",
      });
      return;
    }

    try {
      await assignGroupsToProcessDefinition(
        id,
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
      loadConfig: loadAssignGroupsConfig,
      handleAssignGroupsToProcess,
    },
    numberingConfig: {
      schema: processNumberingSchema,
      form: numberingForm,
      loadConfig: loadNumberingConfig,
      handleSave: handleSaveNumberingConfig,
      addFieldValue: addFieldValueToForm,
    },
  };
}
