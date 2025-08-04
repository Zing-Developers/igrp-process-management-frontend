import React from 'react';
import { Play, CheckSquare } from 'lucide-react';
import { RecentItemsCard } from './recent-items-card';
import { RecentProcess, RecentTask } from './types';

interface DashboardExampleProps {
  recentProcesses: RecentProcess[];
  recentTasks: RecentTask[];
}

export function DashboardExample({ recentProcesses, recentTasks }: DashboardExampleProps) {
  // Transform processes to RecentItem format
  const processItems = recentProcesses.map((process) => ({
    id: process.processDefinitionId,
    title: process.title,
    subtitle: process.category,
    badge: {
      text: `v${process.version}`,
      variant: 'success' as const,
    },
  }));

  // Transform tasks to RecentItem format
  const taskItems = recentTasks.map((task) => ({
    id: task.id,
    title: task.name,
    subtitle: task.description,
    badge: {
      text: task.priority,
      variant: (task.priority === 'HIGH' 
        ? 'error' 
        : task.priority === 'MEDIUM' 
        ? 'warning' 
        : 'success') as const,
    },
  }));

  const handleProcessClick = (item: any) => {
    console.log('Process clicked:', item);
    // Handle process click logic
  };

  const handleTaskClick = (item: any) => {
    console.log('Task clicked:', item);
    // Handle task click logic
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <RecentItemsCard
        title="Processos Recentes"
        icon={Play}
        items={processItems}
        emptyMessage="Nenhum processo disponível"
        onItemClick={handleProcessClick}
      />
      
      <RecentItemsCard
        title="Tarefas Recentes"
        icon={CheckSquare}
        items={taskItems}
        emptyMessage="Nenhuma tarefa disponível"
        onItemClick={handleTaskClick}
      />
    </div>
  );
}