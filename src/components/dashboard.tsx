'use client';

/* THIS FILE WAS GENERATED AUTOMATICALLY BY iGRP STUDIO. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { use, useState, useEffect, useRef } from 'react';
import { cn, useIGRPMenuNavigation, useIGRPToast } from '@igrp/igrp-framework-react-design-system';
import ProcessStatsCards from '@/components/processstatscards';
import { RecentItemsCard } from '@/app/(myapp)/components/recent-items-card';
import { IGRPPageHeader } from '@igrp/igrp-framework-react-design-system';
import { useDashboard } from '@/app/(myapp)/dashboard/hooks/use-dashboard';

export default function Dashboard({}: {}) {
  const { igrpToast } = useIGRPToast();

  // Use the dashboard hook to get real data
  const { stats, processInstancesItems, taskItems, loading, error, refreshData } = useDashboard();

  // Show error toast if there's an error
  useEffect(() => {
    if (error) {
      igrpToast({
        type: 'error',
        title: 'Erro',
        description: error,
      });
    }
  }, [error, igrpToast]);

  return (
    <div className={cn('component')}>
      <div className={cn(' space-y-6')}>
        <IGRPPageHeader
          name={`pageHeader1`}
          title={`Dashboard`}
          description={`Visão geral do sistema de gestão de processos`}
          iconBackButton={`Search`}
          variant={`h3`}
          className={cn('')}
        >
          <div className="flex items-center gap-2"></div>
        </IGRPPageHeader>

        <ProcessStatsCards stats={stats} loading={loading}></ProcessStatsCards>
        <div className={cn('grid', 'grid-cols-1 ', 'md:grid-cols-2 ', 'lg:grid-cols-2 ', ' gap-4')}>
          <RecentItemsCard
            iconName={`Play`}
            title={`Processos Recentes`}
            emptyMessage={`Nenhum processo disponível`}
            items={processInstancesItems}
          ></RecentItemsCard>
          <RecentItemsCard
            title={`Tarefas Recentes`}
            iconName={`SquareCheckBig`}
            emptyMessage={`Nenhuma tarefa disponível`}
            items={taskItems}
          ></RecentItemsCard>
        </div>
      </div>
    </div>
  );
}
