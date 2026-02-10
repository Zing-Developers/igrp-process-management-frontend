"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  assignGroupsToProcessDefinition,
  getProcessArtifacts,
  getProcessDeployedArtifacts,
  getProcessNumberConfigs,
  saveProcessNumberConfig,
} from "@/app/(myapp)/client/process";
import { useIGRPToast } from "@igrp/igrp-framework-react-design-system";
import {
  assignGroupsSchema,
  processNumberingSchema,
  type AssignGroupsValues,
  type ProcessNumberingValues,
  type PriorityOption,
} from "./schemas";
import {
  CreateProcessArtifactRequest,
  ProcessArtifact,
  ProcessDefinition,
} from "@igrp/platform-process-management-types";
import { getCandidateGroupsTemplate } from "../utils/columns-template";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { PRIORITY_OPTIONS } from "./constants";

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
export function useProcessConfig({
  processSelected,
}: {
  processSelected?: ProcessDefinition;
} = {}) {
  const { igrpToast } = useIGRPToast();
  const queryClient = useQueryClient();

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

  const addFieldValueToForm = (
    field: "prefix" | "dateFormat" | "separator" | "sequenceLength",
    value: string,
  ) => {
    numberingForm.setValue(field, value);
  };

  const loadAssignGroupsConfig = () => {
    assignGroupsForm.reset({ groups: candidateGroups?.trim() ?? "" });
  };

  const { data: numberingConfigData, isError: numberingConfigError } = useQuery(
    {
      queryKey: ["process-number-config", processKey],
      queryFn: () => getProcessNumberConfigs(processKey ?? ""),
      enabled: !!processKey,
    },
  );

  useEffect(() => {
    if (numberingConfigData) {
      numberingForm.reset({
        prefix: numberingConfigData.prefix ?? "",
        dateFormat: numberingConfigData.dateFormat ?? "yyyy",
        separator: "-",
        sequenceLength: numberingConfigData.checkDigitSize ?? 3,
      });
    } else if (!processKey || numberingConfigError) {
      numberingForm.reset(numberingDefaultValues);
    }
  }, [numberingConfigData, processKey, numberingConfigError]);

  const loadNumberingConfig = () => {
    queryClient.invalidateQueries({
      queryKey: ["process-number-config", processKey],
    });
  };

  type SaveOptions = { silent?: boolean };

  const handleSaveNumberingConfig = async (
    values?: ProcessNumberingValues,
    opts?: SaveOptions,
  ) => {
    const data = values ?? numberingForm.getValues();
    const parsed = processNumberingSchema.safeParse({
      ...data,
      sequenceLength: Number(data.sequenceLength),
    });

    if (!parsed.success) {
      if (!opts?.silent) {
        igrpToast({
          type: "error",
          title: "Erro de validação",
          description: parsed.error.issues[0]?.message ?? "Dados inválidos.",
        });
      }
      throw new Error(parsed.error.issues[0]?.message ?? "Dados inválidos.");
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
      if (!opts?.silent) {
        igrpToast({
          type: "success",
          title: "Sucesso",
          description: "Configuração de número de processo salva com sucesso!",
        });
      }
    } catch (error) {
      console.error("Error saving process number configuration:", error);
      if (!opts?.silent) {
        igrpToast({
          type: "error",
          title: "Erro",
          description: "Erro ao salvar configuração. Tente novamente.",
        });
      }
      throw error;
    }
  };

  const handleAssignGroupsToProcess = async (
    groups: string,
    opts?: SaveOptions,
  ) => {
    if (!id) {
      if (!opts?.silent) {
        igrpToast({
          type: "error",
          title: "Erro",
          description: "Processo não selecionado.",
        });
      }
      throw new Error("Processo não selecionado.");
    }
    const parsed = assignGroupsSchema.safeParse({ groups });
    if (!parsed.success) {
      if (!opts?.silent) {
        igrpToast({
          type: "error",
          title: "Erro de validação",
          description: parsed.error.issues[0]?.message ?? "Dados inválidos.",
        });
      }
      throw new Error(parsed.error.issues[0]?.message ?? "Dados inválidos.");
    }

    try {
      await assignGroupsToProcessDefinition(id, parsed.data.groups.trim());
      if (!opts?.silent) {
        igrpToast({
          type: "success",
          title: "Sucesso",
          description: "Grupos atribuídos com sucesso!",
        });
      }
    } catch (error) {
      console.error("Error assigning groups to process:", error);
      if (!opts?.silent) {
        igrpToast({
          type: "error",
          title: "Erro",
          description: "Erro ao atribuir grupos ao processo. Tente novamente.",
        });
      }
      throw error;
    }
  };

  // --- priorityOptions ---
  const defaultPriorityOptions: PriorityOption[] = PRIORITY_OPTIONS.map(
    (o) => ({
      label: o.label,
      value: String(o.value),
    }),
  );

  const [priorityOptions, setPriorityOptions] = useState<PriorityOption[]>(
    defaultPriorityOptions,
  );
  const [newPriorityLabel, setNewPriorityLabel] = useState("");
  const [newPriorityValue, setNewPriorityValue] = useState("");

  const loadPriorityConfig = () => {
    setPriorityOptions(defaultPriorityOptions);
    setNewPriorityLabel("");
    setNewPriorityValue("");
  };

  const updatePriorityOption = (
    index: number,
    field: string,
    value: string,
  ) => {
    setPriorityOptions((prev) =>
      prev.map((opt, i) =>
        i === index ? { ...opt, [field as "label" | "value"]: value } : opt,
      ),
    );
  };

  const removePriorityOption = (index: number) => {
    setPriorityOptions((prev) => prev.filter((_, i) => i !== index));
  };

  const addPriorityOption = () => {
    const label = newPriorityLabel.trim();
    const value = newPriorityValue.trim();
    if (!label || !value) return;
    setPriorityOptions((prev) => [...prev, { label, value }]);
    setNewPriorityLabel("");
    setNewPriorityValue("");
  };

  const handleSavePriorityConfig = async (_opts?: SaveOptions) => {
    // TODO: wire to API when endpoint exists for process priority options
  };

  // --- userTasks ---
  const [editedTasksPatch, setEditedTasksPatch] = useState<
    Record<string, CreateProcessArtifactRequest>
  >({});

  const { data: artifactsData, isLoading: loadingUserTasks } = useQuery({
    queryKey: ["process-artifacts", id],
    queryFn: () => getProcessArtifacts(id!),
    enabled: !!id,
  });

  const toCandidateGroupsString = (val: unknown): string =>
    Array.isArray(val)
      ? val
        .map((s) => String(s).trim())
        .filter(Boolean)
        .join(",")
      : String(val ?? "");

  const userTasksList: any = (artifactsData ?? []).map(
    (artifact: ProcessArtifact, index: number) => {
      const patched = editedTasksPatch[artifact.key];
      const source = patched
        ? {
            ...artifact,
            name: patched.name ?? artifact.name,
            dueDate: patched.dueDate ?? artifact.dueDate,
            priority: patched.priority ?? artifact.priority,
            candidateGroups: patched.candidateGroups ?? artifact.candidateGroups,
          }
        : artifact;

      const raw = toCandidateGroupsString(source.candidateGroups);
      const groupsArray = raw
        ? raw
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
        : [];

      const defaultPriorityDesc = source.priority
        ? PRIORITY_OPTIONS.find(
            (o) => o.value.toString() === source.priority.toString(),
          )?.label
        : "";

      return {
        ...source,
        index,
        defaultPriority: defaultPriorityDesc,
        defaultDueDate: source.dueDate ?? "-",
        candidateGroups: getCandidateGroupsTemplate(groupsArray),
        candidateGroupsRaw: raw,
      };
    },
  );

  const loadUserTasksConfig = () => {
    setEditedTasksPatch({});
    queryClient.invalidateQueries({ queryKey: ["process-artifacts", id] });
  };

  const patchEditedTask = (
    taskKey: string,
    request: CreateProcessArtifactRequest,
  ) => {
    setEditedTasksPatch((prev) => ({ ...prev, [taskKey]: request }));
  };

  const getSaveUserTaskData = (
    processDefinitionId: string,
    request: CreateProcessArtifactRequest,
  ) => ({ processDefinitionId, request });

  const getSaveAllUserTasksData = () =>
    userTasksList.map((task: any) => {
      const patched = editedTasksPatch[task.key];
      const req: CreateProcessArtifactRequest = patched
        ? {
          ...patched,
          candidateGroups: toCandidateGroupsString(patched.candidateGroups),
        }
        : {
          key: task.key,
          formKey: task.formKey ?? "",
          name: task.name ?? "",
          dueDate: task.dueDate ?? "",
          priority: task.priority ?? "",
          candidateGroups: task.candidateGroupsRaw ?? "",
        };
      return { processDefinitionId: id!, request: req };
    });

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
    priorityConfig: {
      priorityOptions,
      newPriorityLabel,
      setNewPriorityLabel,
      newPriorityValue,
      setNewPriorityValue,
      updatePriorityOption,
      removePriorityOption,
      addPriorityOption,
      loadConfig: loadPriorityConfig,
      handleSave: handleSavePriorityConfig,
    },
    userTasks: {
      list: userTasksList,
      loading: loadingUserTasks,
      loadConfig: loadUserTasksConfig,
      patchEditedTask,
      getSaveUserTaskData,
      getSaveAllUserTasksData,
    },
  };
}
