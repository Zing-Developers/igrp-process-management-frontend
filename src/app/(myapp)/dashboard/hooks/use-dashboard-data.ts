import { useState, useEffect } from 'react';
import { DashboardData, DashboardStats } from '../types';
import { getProcessInstances } from '../../external/client/services/process-instances.service';

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

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(undefined);

      // Load recent process instances (first 5)
      const processInstancesResponse = await getProcessInstances(0, 5);
      
      // For now, we'll use dummy stats until we have proper endpoints
      // TODO: Replace with actual API calls when available
      const stats: DashboardStats = {
        totalProcesses: processInstancesResponse.totalElements || 0,
        totalTasks: 0, // TODO: Get from tasks API
        myTasks: 0, // TODO: Get from user tasks API
        availableTasks: 0, // TODO: Get from available tasks API
      };

      // TODO: Load recent tasks when tasks API is available
      const recentTasks: any[] = [
        {
          id: '1',
          title: 'Tarefa 1',
          subtitle: 'Descrição da Tarefa 1',
          badge: {
            text: 'Alta',
            variant: 'error' as const,
          },
        },
        {
          id: '2',
          title: 'Tarefa 2',
          subtitle: 'Descrição da Tarefa 2',
          badge: {
            text: 'Média',
            variant: 'warning' as const,
          },
        },
      ];

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