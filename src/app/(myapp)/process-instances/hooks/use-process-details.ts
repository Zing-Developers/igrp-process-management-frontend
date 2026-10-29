"use client";

import type { IGRPColorVariants } from "@igrp/igrp-framework-react-design-system";
import type { ActivityProgress } from "@irn/platform-process-management-types";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { getActivityProgress } from "../../client/activity";
import { getFailedJobs } from "../../client/failed-jobs";
import { getProcessInstanceById } from "../../client/process-instances";
import { formatDuration } from "../../utils/columns-template";

const compareTreeNumbers = (a: string, b: string): number => {
  if (!a && !b) return 0;
  if (!a) return 1;
  if (!b) return -1;

  const partsA = a.split(".").map((part) => parseInt(part, 10) || 0);
  const partsB = b.split(".").map((part) => parseInt(part, 10) || 0);
  const maxLength = Math.max(partsA.length, partsB.length);

  for (let i = 0; i < maxLength; i++) {
    const partA = partsA[i] || 0;
    const partB = partsB[i] || 0;

    if (partA < partB) return -1;
    if (partA > partB) return 1;
  }

  return 0;
};

export const useProcessDetails = (processInstanceId: string) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["process-details", processInstanceId],
    queryFn: async () => {
      const [processInstance, activityProgress, failedJobsPage] =
        await Promise.all([
          getProcessInstanceById(processInstanceId),
          getActivityProgress(processInstanceId, ""),
          getFailedJobs(processInstanceId),
        ]);

      return {
        processInstance,
        activityProgress,
        failedJobs: failedJobsPage.content ?? [],
      };
    },
    enabled: !!processInstanceId,
  });

  //reorder activityProgress by treeNumber (e.g., "1", "1.1", "1.1.1", "1.1.1.1.2")
  const sortedActivityData = useMemo(() => {
    if (!data?.activityProgress) return { activities: [], rawActivities: [] };

    // Map and add duration
    const mapped = data.activityProgress.map((task: ActivityProgress) => {
      const assignee = task.userProfileAssignee?.fullName || task.assignee;
      // Duration will be calculated from activityDetails if available
      const created = new Date(data?.processInstance?.startedAt || Date.now());
      const now = data?.processInstance?.endedAt
        ? new Date(data?.processInstance?.endedAt)
        : new Date();
      const diff = Math.abs(now.getTime() - created.getTime());
      return {
        raw: task,
        display: { ...task, duration: diff, assignee },
      };
    });

    // Sort by treeNumber hierarchically
    mapped.sort((a, b) => {
      const treeNumberA = a.raw.treeNumber || "";
      const treeNumberB = b.raw.treeNumber || "";
      return compareTreeNumbers(treeNumberA, treeNumberB);
    });

    return {
      activities: mapped.map(({ display }) => display),
      rawActivities: mapped.map(({ raw }) => raw),
    };
  }, [
    data?.activityProgress,
    data?.processInstance?.startedAt,
    data?.processInstance?.endedAt,
  ]);

  const transformedProcess = useMemo(() => {
    const startedBy =
      data?.processInstance?.userProfileStartedBy?.fullName ||
      data?.processInstance?.startedBy;
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
      startedBy,
    };
  }, [data?.processInstance]);

  const taskHistoryTransformed = useMemo(() => {
    return sortedActivityData.activities
      .filter((activity: ActivityProgress) => activity.type === "USER_TASK")
      .map((activity: ActivityProgress) => {
        return {
          ...activity,
          variables: [
            ...(activity.variables || []),
            ...(activity?.forms && activity?.forms.length > 0
              ? [{ name: "Form", value: activity?.forms }]
              : []),
          ],
        };
      });
  }, [sortedActivityData.activities]);

  return {
    process: transformedProcess,
    activityProgress: sortedActivityData.activities,
    rawActivityProgress: sortedActivityData.rawActivities,
    failedJobs: data?.failedJobs ?? [],
    taskHistory: taskHistoryTransformed || [],
    variables: transformedProcess?.variables || [],
    isLoading: isLoading,
    error: error,
    refetch,
  };
};
