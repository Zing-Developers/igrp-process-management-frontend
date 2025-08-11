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
  IGRPDataTable,
  IGRPDataTableCellBadge,
  IGRPDataTableRowAction,
  IGRPDataTableDropdownMenu,
  IGRPDataTableDropdownMenuCustom,
} from '@igrp/igrp-framework-react-design-system';
import { useTaskManagement } from '@/app/(myapp)/taskmanagement/hooks/use-task-management';
import { useRouter } from 'next/navigation';
import { urlConfig } from '@/app/(myapp)/utils/url-config';

export default function PageTaskmanagementComponent() {
  type Table1 = {
    process: string;
    createBy: string;
    currentStep: string;
    waitingDays: string;
    status: string;
    taskId: string;
    taskKey: string;
    procReleaseKey: string;
    processInstanceId: string;
  };

  const [contentTabletable1, setContentTabletable1] = useState<Table1[]>([]);

  const { igrpToast } = useIGRPToast();

  function executeTask(row: any): void | undefined {
    console.log('Executing task:', row);
    // Navigate to task execution page using centralized URL config
    const taskUrl = urlConfig.buildTaskExecutionUrl(
      row.procReleaseKey,
      row.processInstanceId,
      row.taskKey,
      row.taskId,
    );
    router.push(taskUrl);
  }

  //-------------------reserved area start----------------------------
  const router = useRouter();
  const {
    tableData,
    loading,
    error,
    totalElements,
    totalPages,
    currentPage,
    handleSearch,
    handlePageChange,
    applyFilters,
    resetFilters,
    getStatusVariant,
  } = useTaskManagement();

  // Transform data for the table
  useEffect(() => {
    if (tableData) {
      const transformedData = tableData.map((row) => ({
        process: row.process,
        createBy: row.createBy,
        currentStep: row.currentStep,
        waitingDays: row.waitingDays,
        status: row.status,
        taskId: row.taskId,
        taskKey: row.taskKey,
      }));
      setContentTabletable1(transformedData as Table1[]);
    }
  }, [tableData]);

  const handleSearchSubmit = (searchTerm: string) => {
    handleSearch(searchTerm);
  };

  const handleApplyFilters = (filters?: any) => {
    if (filters) {
      console.log('Applying task management filters:', filters);
      applyFilters(filters);
    } else {
      applyFilters();
    }
  };

  const handleResetFilters = () => {
    resetFilters();
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
        title={`Gestão de Tarefas`}
        description={`Visualize e gerencie todas as tarefas do sistema`}
        iconBackButton={`ArrowLeft`}
        showBackButton={true}
        urlBackButton={`/dashboard`}
        variant={`h3`}
        className={cn()}
      >
        <div className="flex items-center gap-2"></div>
      </IGRPPageHeader>

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
        className={cn()}
        columns={[
          {
            header: 'Processo',
            accessorKey: 'process',
            cell: ({ row }) => {
              return row.getValue('process');
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
            header: 'Etapa Atual',
            accessorKey: 'currentStep',
            cell: ({ row }) => {
              return row.getValue('currentStep');
            },
            filterFn: IGRPDataTableFacetedFilterFn,
          },
          {
            header: 'Dias em espera',
            accessorKey: 'waitingDays',
            cell: ({ row }) => {
              return row.getValue('waitingDays');
            },
            filterFn: IGRPDataTableFacetedFilterFn,
          },
          {
            header: 'Estado',
            accessorKey: 'status',
            cell: ({ row }) => {
              const rowData = row.original;

              return (
                <IGRPDataTableCellBadge
                  label={row.original.status}
                  variant={`soft`}
                  badgeClassName={``}
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
                  <IGRPDataTableDropdownMenu
                    items={[
                      {
                        component: IGRPDataTableDropdownMenuCustom,
                        props: {
                          labelTrigger: `Executar Tarefa`,
                          icon: `ArrowRight`,
                          showIcon: true,
                          action: () => {
                            executeTask(rowData);
                          },
                        },
                      },
                    ]}
                  ></IGRPDataTableDropdownMenu>
                </IGRPDataTableRowAction>
              );
            },
            filterFn: IGRPDataTableFacetedFilterFn,
          },
        ]}
        clientFilters={[]}
        data={contentTabletable1}
      />
    </div>
  );
}
