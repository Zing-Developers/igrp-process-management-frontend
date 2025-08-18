import { useMemo } from 'react';
import { useDashboardData } from './use-dashboard-data';
import { RecentItemsCardItem } from '../types';
import { ProcessInstance } from '@igrp/platform-process-management-types';
import { getProcessInstanceStatusLabel, getProcessInstanceStatusVariant, ProcessInstanceStatus } from '../../utils/status-helpers';

export function useDashboard() {
  const { data, loading, error, refreshData } = useDashboardData();

  // Transform process instances to RecentItemsCardItem format
  const processInstancesItems = useMemo((): RecentItemsCardItem[] => {
    return data.recentProcessInstances.map((instance: ProcessInstance) => ({
      id: instance.id,
      title: instance.procReleaseKey || 'Processo',
      subtitle: `Iniciado por: ${instance.startedBy}`,
      badge: {
        text: getProcessInstanceStatusLabel(instance.status as ProcessInstanceStatus),
        variant: getProcessInstanceStatusVariant(instance.status as ProcessInstanceStatus),
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