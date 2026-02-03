import { useMemo } from "react";
import { useProcessInstancesData } from "./use-process-instances-data";
import {
  getProcessInstanceStatusVariant,
  ProcessInstanceStatus,
} from "../../utils/status-helpers";
import { ProcessInstanceTableRow } from "../types";
import {
  formatDuration,
  getBusinessKeyTemplate,
  getDateTemplate,
  getProcessInfo,
  getProcessStatusTemplate,
  getProgressTemplate,
} from "../../utils/columns-template";
import { format, formatDistanceToNow } from "date-fns";

export function useProcessInstances() {
  const {
    processInstancesState,
    filters,
    updateFilters,
    applyFilters,
    resetFilters,
  } = useProcessInstancesData();

  // Transform process instances to table format
  const tableData = useMemo((): ProcessInstanceTableRow[] => {
    /* eslint-disable @typescript-eslint/ban-ts-comment */
    // @ts-expect-error Allow JSX in table row fields without refactor
    return processInstancesState.processInstances.map((instance) => {
      // Calculate days since creation
      const createdDate = new Date(instance.startedAt);
      const now = instance.endedAt ? new Date(instance.endedAt) : new Date();
      const diffTime = Math.abs(now.getTime() - createdDate.getTime());

      return {
        processInfo: getProcessInfo(instance.name, instance.number),
        createBy: undefined,
        daysWaiting:
          diffTime > 0
            ? formatDuration(diffTime)
            : formatDistanceToNow(instance.startedAt, { addSuffix: false }),
        version: `v${instance.version}`,
        startedAt: format(instance.startedAt, "dd MMM, HH:mm"),
        endedAt: getDateTemplate(instance.endedAt),
        progress: getProgressTemplate(
          instance.progress,
          instance.status as ProcessInstanceStatus,
        ),
        priority: instance.priority + "",
        status: getProcessStatusTemplate(
          instance.status as ProcessInstanceStatus,
        ),
        processInstanceId: instance.id,
        procReleaseKey: instance.procReleaseKey,
        startedBy: instance.startedBy,
        statusDesc: instance.statusDesc,
        businessKey: getBusinessKeyTemplate(instance.businessKey ?? ""),
      };
    });
  }, [processInstancesState.processInstances]);

  const handleSearch = (searchTerm: string) => {
    // Update filters - query will automatically refetch when filters change
    updateFilters({ processType: searchTerm });
  };

  return {
    // Data
    tableData,
    loading: processInstancesState.loading,
    error: processInstancesState.error,

    // Filter values
    filters,

    // Actions
    handleSearch,
    applyFilters,
    resetFilters,
    updateFilters,
    getStatusVariant: getProcessInstanceStatusVariant,
  };
}
