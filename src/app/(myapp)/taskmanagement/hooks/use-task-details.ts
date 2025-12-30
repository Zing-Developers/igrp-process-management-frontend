import { useQuery } from "@tanstack/react-query";
import { getTaskById } from "../../external/client/services/task";
import {
  getPriorityLabel,
  getPriorityVariant,
} from "../../utils/status-helpers";
import { IGRPColorRole } from "@igrp/igrp-framework-react-design-system";
import { useMemo } from "react";

export const useTaskDetails = (taskId: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["task-details", taskId],
    queryFn: () => getTaskById(taskId),
    enabled: !!taskId,
    retry: true,
    retryDelay: 1000
  });

  const transformTask = useMemo(() => {
    if (!data) return null;
    return {
      ...data,
      priorityLabel: getPriorityLabel(data.priority || 0),
      priorityVariant: getPriorityVariant(data.priority || 0) as IGRPColorRole,
    };
  }, [data]);

  return {
    task: transformTask,
    isLoading,
    error,
  };
};
