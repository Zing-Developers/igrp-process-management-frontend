import { useState, useEffect } from 'react';
import {
  DashboardData,
  DashboardStats,
  RecentItemsCardItem,
  ProcessInstanceStats,
  TaskStats,
} from '../types';
import { getProcessInstances } from '../../external/client/services/process-instances.service';
import { getMyTasks, getTasks } from '../../external/client/services/task.service';
import { Task } from '@igrp/platform-process-management-types';
import { getTaskStatusLabel, getTaskStatusVariant, TaskStatus } from '../../utils/status-helpers';

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
        totalTasks: 0,
        totalTasksCompleted: 0,
        totalTasksRunning: 0,
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
  const loadProcessInstanceStats = async (): Promise<ProcessInstanceStats> => {
    const stats: ProcessInstanceStats = {
      totalInstances: 0,
      totalCompleted: 0,
      totalRunning: 0,
      totalCancelled: 0,
    };

    try {
      // Get total process instances
      const totalResponse = await getProcessInstances(0, 1);
      stats.totalInstances = totalResponse.totalElements || 0;

      // Get completed process instances
      const completedResponse = await getProcessInstances(0, 1, { status: 'COMPLETED' });
      stats.totalCompleted = completedResponse.totalElements || 0;

      // Get running process instances
      const runningResponse = await getProcessInstances(0, 1, { status: 'RUNNING' });
      stats.totalRunning = runningResponse.totalElements || 0;

      // Get cancelled process instances
      const cancelledResponse = await getProcessInstances(0, 1, { status: 'CANCELLED' });
      stats.totalCancelled = cancelledResponse.totalElements || 0;
    } catch (error) {
      console.warn('Could not load process instance statistics:', error);
    }

    return stats;
  };

  /**
   * Load task statistics
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
      // Get total tasks
      const totalTasksResponse = await getTasks(0, 1);
      stats.totalTasks = totalTasksResponse.totalElements || 0;

      // Get total completed tasks
      const completedTasksResponse = await getTasks(0, 1, { status: 'COMPLETED' });
      stats.totalTasksCompleted = completedTasksResponse.totalElements || 0;

      // Get total running tasks
      const runningTasksResponse = await getTasks(0, 1, { status: 'ASSIGNED' });
      stats.totalTasksAssigned = runningTasksResponse.totalElements || 0;

      // Get total suspended tasks
      const suspendedTasksResponse = await getTasks(0, 1, { status: 'SUSPENDED' });
      stats.totalTasksSuspended = suspendedTasksResponse.totalElements || 0;

      // Get total cancelled tasks
      const cancelledTasksResponse = await getTasks(0, 1, { status: 'CANCELLED' });
      stats.totalTasksCancelled = cancelledTasksResponse.totalElements || 0;

      // Get my tasks statistics
      try {
        const myTasksResponse = await getMyTasks({ page: 0, size: 1 });
        stats.totalMyTasks = myTasksResponse.totalElements || 0;

        // Get my completed tasks
        const myCompletedTasksResponse = await getMyTasks({
          page: 0,
          size: 1,
          status: 'COMPLETED',
        });
        stats.totalMyTasksCompleted = myCompletedTasksResponse.totalElements || 0;

        // Get my cancelled tasks
        const myCancelledTasksResponse = await getMyTasks({
          page: 0,
          size: 1,
          status: 'CANCELLED',
        });
        stats.totalMyTasksCancelled = myCancelledTasksResponse.totalElements || 0;
        console.log(myCancelledTasksResponse)
        // Calculate available tasks (total - my tasks)
        stats.totalTasksAvailable = Math.max(0, stats.totalTasks - stats.totalMyTasks);
      } catch (myTasksError) {
        console.warn('Could not load user-specific task statistics:', myTasksError);
        // Available tasks = total tasks when user tasks can't be loaded
        stats.totalTasksAvailable = stats.totalTasks;
      }
    } catch (error) {
      console.warn('Could not load task statistics:', error);
    }

    return stats;
  };

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(undefined);

      // Load recent process instances (first 5)
      const processInstancesResponse = await getProcessInstances(0, 5);

      // Load recent tasks assigned to current user (first 5)
      let recentTasks: RecentItemsCardItem[] = [];
      try {
        const myTasksResponse = await getMyTasks({ page: 0, size: 5 });
        recentTasks = myTasksResponse.content?.map(mapTaskToRecentItem) || [];
      } catch (taskError) {
        console.warn('Could not load user tasks, trying general tasks:', taskError);
        // Fallback to general tasks if user-specific tasks fail
        try {
          const generalTasksResponse = await getTasks(0, 5);
          recentTasks = generalTasksResponse.content?.map(mapTaskToRecentItem) || [];
        } catch (generalTaskError) {
          console.warn('Could not load general tasks either:', generalTaskError);
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
      console.error('Error loading dashboard data:', err);
      setError('Erro ao carregar dados do dashboard');
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
