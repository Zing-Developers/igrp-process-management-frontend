"use client";

import { useMemo } from "react";
import { useQuery, useQueries } from "@tanstack/react-query";
import { getProcessInstanceById } from "../../external/client/services/process-instances";
import {
  getActivityProgress,
  getActivityById,
} from "../../external/client/services/activity";
import { ActivityProgress } from "@igrp/platform-process-management-types";
import { formatDuration } from "../../utils/columns-template";
import { IGRPColorVariants } from "@igrp/igrp-framework-react-design-system";

export const useProcessDetails = (processInstanceId: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["process-details", processInstanceId],
    queryFn: async () => {
      const [processInstance, activityProgress] = await Promise.all([
        getProcessInstanceById(processInstanceId),
        getActivityProgress(processInstanceId, ""),
      ]);

      return {
        processInstance,
        activityProgress,
      };
    },
    enabled: !!processInstanceId,
  });

  const taskProgressTransformed = useMemo(() => {
    return data?.activityProgress?.map((task: ActivityProgress) => {
      // Duration will be calculated from activityDetails if available
      const created = new Date(data?.processInstance?.startedAt || Date.now());
      const now = new Date();
      const diff = Math.abs(now.getTime() - created.getTime());
      return {
        ...task,
        duration: diff,
      };
    });
  }, [data?.activityProgress]);

  const taskHistoryTransformed = useMemo(() => {
    return taskProgressTransformed?.filter(
      (activity: ActivityProgress) => activity.type === "USER_TASK",
    );
  }, [taskProgressTransformed]);

  // Fetch activity details for each task in taskHistory
  const taskHistory = taskHistoryTransformed || [];
  const activityDetailsQueries = useQueries({
    queries: taskHistory.map((activity: ActivityProgress) => {
      // Try to get activity ID from various possible fields
      const activityId = (activity as any).activityId;

      return {
        queryKey: ["activity-details", activityId],
        queryFn: () => getActivityById(activityId),
        enabled: !!activityId && !!taskHistoryTransformed,
        staleTime: 5 * 60 * 1000, // 5 minutes
      };
    }),
  });

  // Combine taskHistory with activity details
  const taskHistoryWithDetails = useMemo(() => {
    if (!taskHistoryTransformed?.length) return [];

    return taskHistoryTransformed?.map(
      (activity: ActivityProgress, index: number) => {
        const activityDetails = activityDetailsQueries[index]?.data;
        return {
          ...activity,
          activityDetails,
        };
      },
    );
  }, [taskHistoryTransformed, activityDetailsQueries]);

  const isLoadingActivityDetails = activityDetailsQueries.some(
    (query) => query.isLoading,
  );

  const transformedProcess = useMemo(() => {
    const created = new Date(data?.processInstance?.startedAt || Date.now());
    const now = new Date();
    const diff = Math.abs(now.getTime() - created.getTime());
    const status = data?.processInstance?.status;
    return {
      ...data?.processInstance,
      color:
        status === "COMPLETED" ? "success" : ("secondary" as IGRPColorVariants),
      duration: formatDuration(diff) as string,
    };
  }, [data?.processInstance]);

  const variables = taskHistoryWithDetails.flatMap(
    (task) => task.activityDetails?.variables || [],
  );

  return {
    process: transformedProcess,
    activityProgress: taskProgressTransformed || [],
    taskHistory: taskHistoryWithDetails,
    variables: variables,
    isLoading: isLoading || isLoadingActivityDetails,
    error: error || activityDetailsQueries.find((q) => q.error)?.error,
  };
};
