import { useState, useEffect } from "react";
import {
  DashboardData,
  DashboardStats,
  RecentItemsCardItem,
  ProcessInstanceStats,
  TaskStats,
} from "../types";
import { getProcessInstances } from "../../external/client/services/process-instances";
import {
  getMyTasks,
  getTasks,
  getTaskStats,
  getMyTaskStats,
} from "../../external/client/services/task";
import { Task } from "@igrp/platform-process-management-types";
import {
  getTaskStatusLabel,
  getTaskStatusVariant,
  TaskStatus,
} from "../../utils/status-helpers";
import { getProcessStats } from "../../external/client/services/process";

export function useDashboardData() {
  const [data, setData] = useState<DashboardData>({
    stats: {
      processInstances: {
        totalInstances: 0,
        totalCompleted: 0,
        totalRunning: 0,
        totalCancelled: 0,
      },
      tasks: {
        totalMyTasks: 0,
        totalMyTasksCompleted: 0,
        totalMyTasksCancelled: 0,
        totalMyTasksSuspended: 0,
        totalTasksAssigned: 0,
        totalTasks: 0,
        totalTasksCompleted: 0,
        totalTasksSuspended: 0,
        totalTasksCancelled: 0,
        totalTasksAvailable: 0,
      },
    },
    recentProcessInstances: [],
    recentTasks: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  /**
   * Maps a Task to RecentItemsCardItem format
   */
  const mapTaskToRecentItem = (task: Task): RecentItemsCardItem => {
    // Use centralized status helpers
    const taskStatus = task.status?.toUpperCase() as TaskStatus;
    const badgeText = getTaskStatusLabel(taskStatus);
    const badgeVariant = getTaskStatusVariant(taskStatus);

    return {
      id: task.id,
      title: task.name || `Tarefa ${task.id}`,
      subtitle: task.businessKey || `Processo ${task.processNumber}`,
      badge: {
        text: badgeText,
        variant: badgeVariant,
      },
    };
  };

  /**
   * Load process instance statistics
   */
  /**
   * Load process instance statistics
   */
  const loadProcessInstanceStats = async (): Promise<ProcessInstanceStats> => {
    const stats: ProcessInstanceStats = {
      totalInstances: 0,
      totalCompleted: 0,
      totalRunning: 0,
      totalCancelled: 0,
    };

    try {
      // Use the getProcessStats service to get all stats in a single call
      const processStats = await getProcessStats();

      stats.totalInstances = processStats.totalProcessInstances || 0;
      stats.totalCompleted = processStats.totalCompletedProcess || 0;
      stats.totalRunning = processStats.totalRunningProcess || 0;
      stats.totalCancelled = processStats.totalCanceledProcess || 0;
    } catch (error) {
      console.warn("Could not load process instance statistics:", error);
    }

    return stats;
  };

  /**
   * Load task statistics using dedicated service endpoints
   */
  const loadTaskStats = async (): Promise<TaskStats> => {
    const stats: TaskStats = {
      totalMyTasks: 0,
      totalMyTasksCompleted: 0,
      totalMyTasksSuspended: 0,
      totalMyTasksCancelled: 0,
      totalTasks: 0,
      totalTasksCompleted: 0,
      totalTasksAssigned: 0,
      totalTasksCancelled: 0,
      totalTasksSuspended: 0,
      totalTasksAvailable: 0,
    };

    try {
      // Use dedicated service to get general task statistics
      const generalTaskStats = await getTaskStats();

      // Map from platform TaskStats to our TaskStats interface
      stats.totalTasks = generalTaskStats.totalTaskInstances;
      stats.totalTasksAvailable = generalTaskStats.totalAvailableTasks;
      stats.totalTasksAssigned = generalTaskStats.totalAssignedTasks;
      stats.totalTasksSuspended = generalTaskStats.totalSuspendedTasks;
      stats.totalTasksCompleted = generalTaskStats.totalCompletedTasks;
      stats.totalTasksCancelled = generalTaskStats.totalCanceledTasks;

      // Use dedicated service to get user-specific task statistics
      try {
        const myTaskStats = await getMyTaskStats();

        // Map from platform TaskStats to our TaskStats interface for user tasks
        stats.totalMyTasks = myTaskStats.totalAssignedTasks; // My assigned tasks
        stats.totalMyTasksCompleted = myTaskStats.totalCompletedTasks;
        stats.totalMyTasksSuspended = myTaskStats.totalSuspendedTasks;
        stats.totalMyTasksCancelled = myTaskStats.totalCanceledTasks;
      } catch (myTasksError) {
        console.warn(
          "Could not load user-specific task statistics:",
          myTasksError,
        );
        // Keep user task stats as 0 when user tasks can't be loaded
      }
    } catch (error) {
      console.warn("Could not load task statistics:", error);
    }

    return stats;
  };

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(undefined);

      // Load recent process instances (first 5)
      const processInstancesResponse = await getProcessInstances();

      // Load recent tasks assigned to current user (first 5)
      let recentTasks: RecentItemsCardItem[] = [];
      try {
        const myTasksResponse = await getMyTasks();
        recentTasks = myTasksResponse.content?.map(mapTaskToRecentItem) || [];
      } catch (taskError) {
        console.warn(
          "Could not load user tasks, trying general tasks:",
          taskError,
        );
        // Fallback to general tasks if user-specific tasks fail
        try {
          const generalTasksResponse = await getTasks();
          recentTasks =
            generalTasksResponse.content?.map(mapTaskToRecentItem) || [];
        } catch (generalTaskError) {
          console.warn(
            "Could not load general tasks either:",
            generalTaskError,
          );
          // Keep recentTasks as empty array
        }
      }

      // Load statistics in parallel
      const [processInstanceStats, taskStats] = await Promise.all([
        loadProcessInstanceStats(),
        loadTaskStats(),
      ]);

      const stats: DashboardStats = {
        processInstances: processInstanceStats,
        tasks: taskStats,
      };

      setData({
        stats,
        recentProcessInstances: processInstancesResponse.content || [],
        recentTasks,
      });
    } catch (err) {
      console.error("Error loading dashboard data:", err);
      setError("Erro ao carregar dados do dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const refreshData = () => {
    loadDashboardData();
  };

  return {
    data,
    loading,
    error,
    refreshData,
  };
}
