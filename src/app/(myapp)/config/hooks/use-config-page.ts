"use client";

import { useQuery } from "@tanstack/react-query";
import { getProcesses, updateProcessArtifact } from "@/app/(myapp)/client/process";
import type { CreateProcessArtifactRequest, Process, ProcessDefinition } from "@igrp/platform-process-management-types";
import { useIGRPToast } from "@igrp/igrp-framework-react-design-system";
import { useProcessConfig } from "../use-process-config";

/**
 * Hook for the config page. Self-contained: allProcesses + assignGroups + numberingConfig + userTasks.
 */
export function useConfigPage({ processSelected }: { processSelected?: ProcessDefinition } = {}) {
  const processConfig = useProcessConfig({ processSelected });
  const { igrpToast } = useIGRPToast();

  const {
    data: processesData,
    isLoading: loading,
    refetch: loadAllProcesses,
  } = useQuery({
    queryKey: ["all-processes"],
    queryFn: async () => {
      const response = await getProcesses();
      return (response.content || []).map((process) => ({
        ...process,
        version: `v${process.version}`,
      })) as Process[];
    },
  });

  const allProcesses = processesData ?? [];
  const { userTasks: userTasksConfig } = processConfig;

  const handleSaveUserTask = async (
    request: CreateProcessArtifactRequest,
  ) => {
    console.log(request);
    userTasksConfig.getSaveUserTaskData(
      request,
    );
    userTasksConfig.loadConfig();
  };

  const handleSaveAllUserTasks = async () => {
    const dataList = userTasksConfig.getSaveAllUserTasksData();
    if (dataList.length === 0) return;
    for (const { processDefinitionId, request } of dataList) {
      await updateProcessArtifact(processDefinitionId, request);
    }
    igrpToast({
      type: "success",
      title: "Sucesso",
      description: "Configurações das tarefas salvas com sucesso!",
    });
    userTasksConfig.loadConfig();
  };

  return {
    allProcesses,
    loading,
    loadAllProcesses,
    assignGroups: processConfig.assignGroups,
    numberingConfig: processConfig.numberingConfig,
    userTasks: {
      ...userTasksConfig,
      handleSave: handleSaveUserTask,
      handleSaveAll: handleSaveAllUserTasks,
    },
  };
}
