import { useCallback, useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import { getProcessDefinitionPriorities } from "../client/process";
import {
  getPriorityBadgeFromApi,
  type ApiPriorityInfo,
} from "../utils/status-badge";

/**
 * Shared hook to load priorities per process definition and expose getPriorityBadge.
 * Use in task-management, process-instances, etc. to show API-based priority labels/colors.
 */
export function useProcessPriorities(processKeys: string[]) {
  const priorityQueries = useQueries({
    queries: processKeys.map((processKey) => ({
      queryKey: ["process-priorities", processKey],
      queryFn: () => getProcessDefinitionPriorities(processKey),
      enabled: !!processKey,
    })),
  });

  const prioritiesByProcessKey = useMemo((): Record<
    string,
    Record<string, ApiPriorityInfo>
  > => {
    const map: Record<string, Record<string, ApiPriorityInfo>> = {};
    processKeys.forEach((processKey, i) => {
      const list = priorityQueries[i]?.data ?? [];
      map[processKey] = {};
      list.forEach((p) => {
        const value = String(p.code ?? "");
        if (value) {
          map[processKey][value] = {
            label: p.label ?? value,
            value,
            color: p.color,
          };
        }
      });
    });
    return map;
  }, [processKeys, priorityQueries]);

  const getPriorityBadge = useCallback(
    (processKey: string | undefined, priorityValue: string) => {
      const apiPriority = processKey
        ? prioritiesByProcessKey[processKey]?.[priorityValue]
        : undefined;
      return getPriorityBadgeFromApi(apiPriority, { priority: priorityValue });
    },
    [prioritiesByProcessKey],
  );

  return { getPriorityBadge };
}
