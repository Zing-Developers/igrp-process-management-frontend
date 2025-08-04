'use client';

/* THIS FILE WAS GENERATED AUTOMATICALLY BY iGRP STUDIO. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { use, useState, useEffect, useRef } from 'react';
import { cn, useIGRPMenuNavigation, useIGRPToast } from '@igrp/igrp-framework-react-design-system';
import { RecentItemsCard } from '@/app/(myapp)/components/recent-items-card';
import { IGRPPageHeader, IGRPStatsCard } from '@igrp/igrp-framework-react-design-system';
import { useRouter } from 'next/navigation';
import { useDashboard } from '@/app/(myapp)/dashboard/hooks/use-dashboard';

export default function PageDashboardComponent() {
  const [statstatsCard1Value, setStatstatsCard1Value] = useState<string | number>(0);
  const [statstatsCard2Value, setStatstatsCard2Value] = useState<string | number>(0);
  const [statstatsCard3Value, setStatstatsCard3Value] = useState<string | number>(0);
  const [statstatsCard4Value, setStatstatsCard4Value] = useState<string | number>(0);

  const { igrpToast } = useIGRPToast();

  const router = useRouter();
  
  // Use the dashboard hook to get real data
  const {
    stats,
    processInstancesItems,
    taskItems,
    loading,
    error,
    refreshData,
  } = useDashboard();

  // Update stats values when data changes
  useEffect(() => {
    if (!loading) {
      setStatstatsCard1Value(stats.totalProcesses);
      setStatstatsCard2Value(stats.totalTasks);
      setStatstatsCard3Value(stats.myTasks);
      setStatstatsCard4Value(stats.availableTasks);
    } else {
      // Show loading state
      setStatstatsCard1Value('...');
      setStatstatsCard2Value('...');
      setStatstatsCard3Value('...');
      setStatstatsCard4Value('...');
    }
  }, [stats, loading]);

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

  function goToprocessMap(row?: any): void {
    router.push(`/processmap`);
  }

  function goToinstances(row?: any): void {
    router.push(`/instances`);
  }

  function goTomyTasks(row?: any): void {
    router.push(`/mytasks`);
  }

  function goTotaskManagement(row?: any): void {
    router.push(`/taskmanagement`);
  }

  return (
    <div className={cn('page', 'space-y-6')}>
      <IGRPPageHeader
        name={`pageHeader1`}
        title={`Dashboard`}
        description={`Visão geral do sistema de gestão de processos`}
        iconBackButton={`Search`}
        variant={`h3`}
        className={cn()}
      >
        <div className="flex items-center gap-2"></div>
      </IGRPPageHeader>

      <div className={cn('grid', 'grid-cols-1 ', 'md:grid-cols-2 ', 'lg:grid-cols-4 ', ' gap-4')}>
        <IGRPStatsCard
          name={`statsCard1`}
          cardBorderPosition={`none`}
          cardBorder={`rounded-md`}
          cardVariant={`success`}
          iconBackground={`square`}
          title={`Total de Processos`}
          titleSize={`sm`}
          valueSize={`2xl`}
          showIcon={true}
          iconName={`ListChecks`}
          iconSize={undefined}
          iconVariant={`info`}
          iconPlacement={`end`}
          itemPlacement={`start`}
          showIconBackground={true}
          showIconBorder={false}
          className={cn('', 'col-span-1')}
          onClick={() => goToprocessMap()}
          value={statstatsCard1Value}
        ></IGRPStatsCard>
        <IGRPStatsCard
          name={`statsCard2`}
          cardBorderPosition={`none`}
          cardBorder={`rounded-md`}
          cardVariant={`warning`}
          iconBackground={`square`}
          title={`Total de Tarefas`}
          titleSize={`sm`}
          valueSize={`2xl`}
          showIcon={true}
          iconName={`TimerReset`}
          iconSize={undefined}
          iconVariant={`success`}
          iconPlacement={`end`}
          itemPlacement={`start`}
          showIconBackground={true}
          className={cn('col-span-1')}
          onClick={() => goToinstances()}
          value={statstatsCard2Value}
        ></IGRPStatsCard>
        <IGRPStatsCard
          name={`statsCard3`}
          cardBorderPosition={`none`}
          cardBorder={`rounded-lg`}
          cardVariant={`info`}
          iconBackground={`square`}
          title={`Minhas Tarefas`}
          titleSize={`sm`}
          valueSize={`2xl`}
          showIcon={true}
          iconName={`ClipboardList`}
          iconSize={`md`}
          iconVariant={`warning`}
          iconPlacement={`end`}
          itemPlacement={`start`}
          showIconBackground={true}
          className={cn('', 'col-span-1')}
          onClick={() => goTomyTasks()}
          value={statstatsCard3Value}
        ></IGRPStatsCard>
        <IGRPStatsCard
          name={`statsCard4`}
          cardBorderPosition={`none`}
          cardBorder={`rounded-lg`}
          cardVariant={`info`}
          iconBackground={`square`}
          title={`Tarefas Disponíveis`}
          titleSize={`sm`}
          valueSize={`2xl`}
          showIcon={true}
          iconName={`Settings`}
          iconSize={`md`}
          iconVariant={`indigo`}
          iconPlacement={`end`}
          itemPlacement={`start`}
          showIconBackground={true}
          className={cn('', 'col-span-1')}
          onClick={() => goTotaskManagement()}
          value={statstatsCard4Value}
        ></IGRPStatsCard>
      </div>
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
  );
}
