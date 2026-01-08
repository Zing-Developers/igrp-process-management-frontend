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

  //reorder activityProgress by startTime: "2026-01-05T10:49:36.267"
  const taskProgressTransformed = useMemo(() => {
    if (!data?.activityProgress) return undefined;

    // Map and add duration
    const mapped = data.activityProgress.map((task: ActivityProgress) => {
      // Duration will be calculated from activityDetails if available
      const created = new Date(data?.processInstance?.startedAt || Date.now());
      const now = data?.processInstance?.endedAt
        ? new Date(data?.processInstance?.endedAt)
        : new Date();
      const diff = Math.abs(now.getTime() - created.getTime());
      return {
        ...task,
        duration: diff,
      };
    });

    // Sort by startTime (descending - newest first)
    // startTime format: "2026-01-05T10:49:36.267"
    // It can be directly on the task object or in activityDetails
    return mapped.sort((a, b) => {
      const taskA = a as any;
      const taskB = b as any;

      // Try to get startTime from various possible locations
      const startTimeA =
        taskA.startTime || taskA.activityDetails?.startTime || taskA.startedAt;
      const startTimeB =
        taskB.startTime || taskB.activityDetails?.startTime || taskB.startedAt;

      // If both have startTime, compare them
      if (startTimeA && startTimeB) {
        const dateA = new Date(startTimeA).getTime();
        const dateB = new Date(startTimeB).getTime();
        // Handle invalid dates
        if (isNaN(dateA) || isNaN(dateB)) {
          // If one is invalid, put valid one first
          if (isNaN(dateA) && !isNaN(dateB)) return 1;
          if (!isNaN(dateA) && isNaN(dateB)) return -1;
          return 0; // Both invalid, maintain order
        }
        return dateB - dateA; // Descending order (newest first)
      }

      // If only one has startTime, put it first
      if (startTimeA && !startTimeB) return -1;
      if (!startTimeA && startTimeB) return 1;

      // If neither has startTime, maintain original order
      return 0;
    });
  }, [
    data?.activityProgress,
    data?.processInstance?.startedAt,
    data?.processInstance?.endedAt,
  ]);

  const taskHistoryTransformed = useMemo(() => {
    return taskProgressTransformed?.filter(
      (activity: ActivityProgress) => activity.type === "USER_TASK"
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
    if (!taskHistory?.length) return [];

    return taskHistory?.map((activity: ActivityProgress, index: number) => {
      const activityDetails = activityDetailsQueries[index]?.data;
      return {
        ...activity,
        activityDetails,
        // variables:  [...(activity?.variables || []), ...(activity.forms || [])]
      };
    });
  }, [taskHistoryTransformed, activityDetailsQueries]);

  const isLoadingActivityDetails = activityDetailsQueries.some(
    (query) => query.isLoading
  );

  const transformedProcess = useMemo(() => {
    const created = new Date(data?.processInstance?.startedAt || Date.now());
    const now = data?.processInstance?.endedAt
      ? new Date(data?.processInstance?.endedAt)
      : new Date();
    const diff = Math.abs(now.getTime() - created.getTime());
    const status = data?.processInstance?.status;
    return {
      ...data?.processInstance,
      color:
        status === "COMPLETED" ? "success" : ("secondary" as IGRPColorVariants),
      duration: formatDuration(diff) as string,
    };
  }, [data?.processInstance]);

  const variables = [
    ...taskHistoryWithDetails.flatMap(
      (task) => task.activityDetails?.variables || []
    ),
    ...(transformedProcess?.variables || []),
  ];

  return {
    process: transformedProcess,
    activityProgress: taskProgressTransformed || [],
    taskHistory: taskHistoryWithDetails,
    variables: variables,
    isLoading: isLoading || isLoadingActivityDetails,
    error: error || activityDetailsQueries.find((q) => q.error)?.error,
  };
};
