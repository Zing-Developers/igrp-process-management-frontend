"use client";

import { useQuery } from "@tanstack/react-query";
import { getProcesses } from "@/app/(myapp)/client/process";
import type { Process, ProcessDefinition } from "@igrp/platform-process-management-types";
import { useProcessConfig } from "../use-process-config";

/**
 * Hook for the config page. Self-contained: allProcesses + assignGroups.
 * Uses config folder hooks only (no process-configuration dependency).
 */
export function useConfigPage({ processSelected }: { processSelected?: ProcessDefinition } = {}) {
  const processConfig = useProcessConfig({ processSelected });

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

  return {
    allProcesses,
    loading,
    loadAllProcesses,
    assignGroups: processConfig.assignGroups,
    numberingConfig: processConfig.numberingConfig,
  };
}
