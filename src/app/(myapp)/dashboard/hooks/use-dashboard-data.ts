import { useState, useEffect } from 'react';
import { DashboardData, DashboardStats, RecentItemsCardItem } from '../types';
import { getProcessInstances } from '../../external/client/services/process-instances.service';
import { getMyTasks, getTasks } from '../../external/client/services/task.service';
import { Task } from '@igrp/platform-process-management-types';

export function useDashboardData() {
  const [data, setData] = useState<DashboardData>({
    stats: {
      totalProcesses: 0,
      totalTasks: 0,
      myTasks: 0,
      availableTasks: 0,
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
    // Determine badge variant based on task priority or status
    let badgeVariant: 'success' | 'warning' | 'error' | 'info' = 'info';
    let badgeText =  'Pendente';

    switch (task.status?.toLowerCase()) {
      case 'completed':
        badgeVariant = 'success';
        badgeText = 'Concluída';
        break;
      case 'in_progress':
        badgeVariant = 'warning';
        badgeText = 'Em Andamento';
        break;
      case 'created':
        badgeVariant = 'info';
        badgeText = 'Nova';
        break;
      case 'suspended':
        badgeVariant = 'error';
        badgeText = 'Suspensa';
        break;
      default:
        badgeVariant = 'error';
        badgeText = 'Pendente';
        break;
    }

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

      // Load stats
      const stats: DashboardStats = {
        totalProcesses: processInstancesResponse.totalElements || 0,
        totalTasks: 0,
        myTasks: 0,
        availableTasks: 0,
      };

      // Try to get task statistics
      try {
        // Get total tasks count
        const totalTasksResponse = await getTasks(0, 1);
        stats.totalTasks = totalTasksResponse.totalElements || 0;

        // Get my tasks count
        const myTasksStatsResponse = await getMyTasks({ page: 0, size: 1 });
        stats.myTasks = myTasksStatsResponse.totalElements || 0;

        // Calculate available tasks (total - my tasks)
        stats.availableTasks = Math.max(0, stats.totalTasks - stats.myTasks);
      } catch (statsError) {
        console.warn('Could not load task statistics:', statsError);
        // Keep default values (0) for task stats
      }

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