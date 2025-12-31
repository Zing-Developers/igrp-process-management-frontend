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
    fetchProcessInstances,
  } = useProcessInstancesData();

  // Transform process instances to table format
  const tableData = useMemo((): ProcessInstanceTableRow[] => {
    /* eslint-disable @typescript-eslint/ban-ts-comment */
    // @ts-expect-error Allow JSX in table row fields without refactor
    return processInstancesState.processInstances.map((instance) => {
      // Calculate days since creation
      const createdDate = new Date(instance.startedAt);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - createdDate.getTime());

      return {
        processInfo: getProcessInfo(instance.name, instance.number),
        createBy: undefined, //getUserInfo(instance.startedBy),
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
    updateFilters({ processType: searchTerm });
    applyFilters();
  };

  const handlePageChange = (page: number) => {
    fetchProcessInstances(page, processInstancesState.pageSize);
  };

  return {
    // Data
    tableData,
    loading: processInstancesState.loading,
    error: processInstancesState.error,
    totalElements: processInstancesState.totalElements,
    totalPages: processInstancesState.totalPages,
    currentPage: processInstancesState.currentPage,

    // Filter values
    filters,

    // Actions
    handleSearch,
    handlePageChange,
    applyFilters,
    resetFilters,
    getStatusVariant: getProcessInstanceStatusVariant,
    fetchProcessInstances,
  };
}
