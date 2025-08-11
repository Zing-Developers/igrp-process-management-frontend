import { useMemo } from 'react';
import { useDashboardData } from './use-dashboard-data';
import { RecentItemsCardItem } from '../types';
import { ProcessInstance } from '@igrp/platform-process-management-types';

export function useDashboard() {
  const { data, loading, error, refreshData } = useDashboardData();

  // Transform process instances to RecentItemsCardItem format
  const processInstancesItems = useMemo((): RecentItemsCardItem[] => {
    return data.recentProcessInstances.map((instance: ProcessInstance) => ({
      id: instance.id,
      title: instance.procReleaseKey || 'Processo',
      subtitle: `Iniciado por: ${instance.startedBy}`,
      badge: {
        text: instance.status,
        variant: getStatusVariant(instance.status),
      },
    }));
  }, [data.recentProcessInstances]);

  // Transform tasks to RecentItemsCardItem format
  const taskItems = useMemo((): RecentItemsCardItem[] => {
    return data.recentTasks.map((task) => ({
      id: task.id,
      title: task.title,
      subtitle: task.subtitle,
      badge: task.badge,
    }));
  }, [data.recentTasks]);

  return {
    // Stats
    stats: data.stats,
    
    // Items for cards
    processInstancesItems,
    taskItems,
    
    // State
    loading,
    error,
    
    // Actions
    refreshData,
  };
}

function getStatusVariant(status: string): 'success' | 'warning' | 'error' | 'info' {
  switch (status) {
    case 'COMPLETED':
      return 'success';
    case 'RUNNING':
      return 'info';
    case 'SUSPENDED':
      return 'warning';
    case 'TERMINATED':
      return 'error';
    default:
      return 'info';
  }
}