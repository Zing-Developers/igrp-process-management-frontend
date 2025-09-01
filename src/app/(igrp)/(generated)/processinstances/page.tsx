'use client';

/* THIS FILE WAS GENERATED AUTOMATICALLY BY iGRP STUDIO. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { use, useState, useEffect, useRef } from 'react';
import { cn, useIGRPMenuNavigation, useIGRPToast } from '@igrp/igrp-framework-react-design-system';
import TaskProcessFilter from '@/components/taskprocessfilter';
import {
  IGRPDataTableFacetedFilterFn,
  IGRPDataTableDateRangeFilterFn,
} from '@igrp/igrp-framework-react-design-system';
import {
  IGRPDataTableHeaderSortToggle,
  IGRPDataTableHeaderSortDropdown,
  IGRPDataTableHeaderRowsSelect,
} from '@igrp/igrp-framework-react-design-system';
import {
  IGRPPageHeader,
  IGRPStatsCard,
  IGRPDataTable,
  IGRPDataTableCellBadge,
  IGRPDataTableRowAction,
  IGRPDataTableButtonLink,
} from '@igrp/igrp-framework-react-design-system';
import { useProcessConfiguration } from '@/app/(myapp)/processconfiguration/hooks/use-process-configuration';
import { useProcessInstances } from '@/app/(myapp)/processinstances/hooks/use-process-instances';
import { useRouter } from 'next/navigation';
import { urlConfig } from '@/app/(myapp)/utils/url-config';
import { useDashboard } from '@/app/(myapp)/dashboard/hooks/use-dashboard';
import { getTaskStatusColor } from '@/app/(myapp)/utils/status-badge';
import { getProcessInstanceStatusColor } from '@/app/(myapp)/utils/status-badge';

export default function PageProcessinstancesComponent() {
  type Table1 = {
    processInfo: string;
    createBy: string;
    daysWaiting: string;
    version: string;
    startedAt: string;
    endedAt: string;
    progress: string;
    status: string;
    processInstanceId: string;
    procReleaseKey: string;
  };

  const [statstatsCard1Value, setStatstatsCard1Value] = useState<string | number>(0);
  const [statstatsCard2Value, setStatstatsCard2Value] = useState<string | number>(0);
  const [statstatsCard4Value, setStatstatsCard4Value] = useState<string | number>(0);
  const [statstatsCard3Value, setStatstatsCard3Value] = useState<string | number>(0);
  const [contentTableprocesses, setContentTableprocesses] = useState<Table1[]>([]);

  const { igrpToast } = useIGRPToast();

  function goToProcessRuntime(row: any): void | undefined {
    console.log(row);
    const taskUrl = urlConfig.buildProcessInstanceUrl(row.procReleaseKey, row.processInstanceId);
    router.push(taskUrl);
  }

  //-------------------reserved area start----------------------------
  const { stats, loading: statsLoading } = useDashboard();
  const router = useRouter();
  const {
    tableData,
    loading,
    error,
    totalElements,
    totalPages,
    currentPage,
    handleSearch,
    applyFilters,
    resetFilters,
  } = useProcessInstances();

  // Update table data when process instances change
  useEffect(() => {
    setContentTableprocesses(tableData);
    setStatstatsCard1Value(stats.processInstances.totalInstances);
    setStatstatsCard2Value(stats.processInstances.totalRunning);
    setStatstatsCard3Value(stats.processInstances.totalCompleted);
    setStatstatsCard4Value(stats.processInstances.totalCancelled);
  }, [tableData, stats]);

  // Handle filter application with process instance filters
  const handleApplyFilters = (filters?: any) => {
    if (filters) {
      console.log('Applying process instance filters:', filters);
      applyFilters(filters);
    } else {
      applyFilters();
    }
  };

  // Handle filter reset
  const handleResetFilters = () => {
    resetFilters();
  };

  // Handle search
  const handleSearchSubmit = (searchTerm: string) => {
    handleSearch(searchTerm);
  };

  // Show error toast if there's an error
  useEffect(() => {
    if (error) {
      igrpToast({
        title: 'Erro',
        description: error,
      });
    }
  }, [error, igrpToast]);

  //-------------------reserved area end------------------------------

  return (
    <div className={cn('page', 'space-y-6')}>
      <IGRPPageHeader
        name={`pageHeader1`}
        title={`Processos`}
        description={`Visualize processos em curso por área e subárea`}
        iconBackButton={`ArrowLeft`}
        urlBackButton={`/dashboard`}
        variant={`h3`}
        className={cn()}
      >
        <div className="flex items-center gap-2"></div>
      </IGRPPageHeader>

      <div className={cn('grid', 'grid-cols-1 ', 'md:grid-cols-2 ', 'lg:grid-cols-4 ', ' gap-4')}>
        <IGRPStatsCard
          name={`statsCard1`}
          cardBorderPosition={`top`}
          cardBorder={`rounded-lg`}
          cardVariant={`info`}
          iconBackground={`square`}
          title={`Total de Processos`}
          titleSize={`sm`}
          valueSize={`2xl`}
          showIcon={true}
          iconName={`Settings`}
          iconSize={`md`}
          iconVariant={`info`}
          iconPlacement={`end`}
          itemPlacement={`start`}
          showIconBorder={false}
          showIconBackground={true}
          onClick={() => {}}
          value={statstatsCard1Value}
        ></IGRPStatsCard>
        <IGRPStatsCard
          name={`statsCard2`}
          cardBorderPosition={`top`}
          cardBorder={`rounded-lg`}
          cardVariant={`warning`}
          iconBackground={`square`}
          title={`Total em Execução`}
          titleSize={`sm`}
          valueSize={`2xl`}
          showIcon={true}
          iconName={`Play`}
          iconSize={`md`}
          iconVariant={`warning`}
          iconPlacement={`end`}
          itemPlacement={`start`}
          showIconBackground={true}
          showIconBorder={false}
          onClick={() => {}}
          value={statstatsCard2Value}
        ></IGRPStatsCard>
        <IGRPStatsCard
          name={`statsCard4`}
          cardBorderPosition={`top`}
          cardBorder={`rounded-lg`}
          cardVariant={`destructive`}
          iconBackground={`square`}
          title={`Total Cancelados`}
          titleSize={`sm`}
          valueSize={`2xl`}
          showIcon={true}
          iconName={`CircleCheck`}
          iconSize={`md`}
          iconVariant={`destructive`}
          iconPlacement={`end`}
          itemPlacement={`start`}
          showIconBackground={true}
          onClick={() => {}}
          value={statstatsCard4Value}
        ></IGRPStatsCard>
        <IGRPStatsCard
          name={`statsCard3`}
          cardBorderPosition={`top`}
          cardBorder={`rounded-lg`}
          cardVariant={`success`}
          iconBackground={`square`}
          title={`Total Finalizados`}
          titleSize={`sm`}
          valueSize={`2xl`}
          showIcon={true}
          iconName={`CheckCheck`}
          iconSize={`md`}
          iconVariant={`success`}
          iconPlacement={`end`}
          itemPlacement={`start`}
          showIconBackground={true}
          showIconBorder={false}
          onClick={() => {}}
          value={statstatsCard3Value}
        ></IGRPStatsCard>
      </div>
      <div className={cn(' border rounded-sm')}>
        <TaskProcessFilter
          onSearch={handleSearchSubmit}
          onApplyFilters={handleApplyFilters}
          onResetFilters={handleResetFilters}
        ></TaskProcessFilter>
      </div>
      <IGRPDataTable<Table1, Table1>
        showFilter={true}
        showPagination={true}
        paginationClassName={`px-3 pb-3`}
        className={cn('', 'border-0 border-solid border-[#000000]')}
        columns={[
          {
            header: 'Processo',
            accessorKey: 'processInfo',
            cell: ({ row }) => {
              return row.getValue('processInfo');
            },
            filterFn: IGRPDataTableFacetedFilterFn,
          },
          {
            header: 'Versāo',
            accessorKey: 'version',
            cell: ({ row }) => {
              const rowData = row.original;

              return (
                <IGRPDataTableCellBadge
                  label={row.original.version}
                  variant={`soft`}
                  badgeClassName={``}
                ></IGRPDataTableCellBadge>
              );
            },
            filterFn: IGRPDataTableFacetedFilterFn,
          },
          {
            header: 'Criado por',
            accessorKey: 'createBy',
            cell: ({ row }) => {
              return row.getValue('createBy');
            },
            filterFn: IGRPDataTableFacetedFilterFn,
          },
          {
            header: 'Dias em espera',
            accessorKey: 'daysWaiting',
            cell: ({ row }) => {
              return row.getValue('daysWaiting');
            },
            filterFn: IGRPDataTableFacetedFilterFn,
          },
          {
            header: 'Data Inicio',
            accessorKey: 'startedAt',
            cell: ({ row }) => {
              return row.getValue('startedAt');
            },
            filterFn: IGRPDataTableFacetedFilterFn,
          },
          {
            header: 'Data Fim',
            accessorKey: 'endedAt',
            cell: ({ row }) => {
              return row.getValue('endedAt');
            },
            filterFn: IGRPDataTableFacetedFilterFn,
          },
          {
            header: 'Progresso',
            accessorKey: 'progress',
            cell: ({ row }) => {
              return row.getValue('progress');
            },
            filterFn: IGRPDataTableFacetedFilterFn,
          },
          {
            header: 'Estado',
            accessorKey: 'status',
            cell: ({ row }) => {
              const rowData = row.original;

              const { iconName, bgClass, textClass, label, className } =
                getProcessInstanceStatusColor(rowData);

              return (
                <IGRPDataTableCellBadge
                  label={label ?? row.original.status}
                  variant={`soft`}
                  badgeClassName={`${bgClass} ${textClass} ${className}`}
                ></IGRPDataTableCellBadge>
              );
            },
            filterFn: IGRPDataTableFacetedFilterFn,
          },
          {
            id: 'tableActionListCell1',
            enableHiding: false,
            cell: ({ row }) => {
              const rowData = row.original;

              return (
                <IGRPDataTableRowAction>
                  <IGRPDataTableButtonLink
                    labelTrigger={`Consultar Processo`}
                    variant={`ghost`}
                    icon={`FileSearch`}
                    className={cn()}
                    action={() => {
                      goToProcessRuntime(rowData);
                    }}
                  ></IGRPDataTableButtonLink>
                </IGRPDataTableRowAction>
              );
            },
            filterFn: IGRPDataTableFacetedFilterFn,
          },
        ]}
        clientFilters={[]}
        data={contentTableprocesses}
      />
    </div>
  );
}
