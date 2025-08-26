'use client';

/* THIS FILE WAS GENERATED AUTOMATICALLY BY iGRP STUDIO. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { use, useState, useEffect, useRef } from 'react';
import { cn, useIGRPMenuNavigation, useIGRPToast } from '@igrp/igrp-framework-react-design-system';
import ProcessStatsCards from '@/components/processstatscards';
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
import CommonUserTaskModalForm from '@/components/commonusertaskmodalform';
import {
  IGRPPageHeader,
  IGRPDataTable,
  IGRPDataTableCellBadge,
  IGRPDataTableRowAction,
  IGRPDataTableButtonLink,
} from '@igrp/igrp-framework-react-design-system';
import { useTaskManagement } from '@/app/(myapp)/taskmanagement/hooks/use-task-management';
import { useRouter } from 'next/navigation';
import { urlConfig } from '@/app/(myapp)/utils/url-config';
import { useDashboard } from '@/app/(myapp)/dashboard/hooks/use-dashboard';

export default function PageTaskmanagementComponent() {
  type Table1 = {
    process: string;
    createBy: string;
    currentStep: string;
    waitingDays: string;
    status: string;
    taskId: string;
    taskKey: string;
    processKey: string;
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
  const { stats, loading: statsLoading } = useDashboard();
  const {
    assignModalState,
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
    handleAssignTask,
    handleOpenAssignModal,
    handleCloseAssignModal,
  } = useTaskManagement();

  // Transform data for the table
  useEffect(() => {
    if (tableData) setContentTabletable1(tableData);
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

  // Handle assign task save
  const handleAssignTaskSave = async (formData: { user: string; note?: string }) => {
    const result = await handleAssignTask(formData.user, formData.note);

    if (igrpToast) {
      igrpToast({
        type: result?.success ? 'success' : 'error',
        title: result?.success ? 'Sucesso' : 'Erro',
        description: result?.message,
      });
    }
  };

  // Define modal subtitle with dynamic content
  const modalSubtitle = `Indicar um utilizador para assumir a tarefa "${assignModalState.selectedTask?.currentStep}" do processo "${assignModalState.selectedTask?.process}"`;

  //-------------------reserved area end------------------------------

  return (
    <div className={cn('page', 'space-y-6')}>
      <IGRPPageHeader
        name={`pageHeader1`}
        title={`Gestão de Tarefas`}
        description={`Visualize e gerencie todas as tarefas do sistema`}
        iconBackButton={`ChartLine`}
        urlBackButton={`/dashboard`}
        variant={`h3`}
        className={cn()}
      >
        <div className="flex items-center gap-2"></div>
      </IGRPPageHeader>

      <ProcessStatsCards stats={stats} loading={statsLoading}></ProcessStatsCards>
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
                  <IGRPDataTableButtonLink
                    labelTrigger={`Executar Tarefa`}
                    variant={`ghost`}
                    icon={`Play`}
                    className={cn()}
                    action={() => {
                      executeTask(rowData);
                    }}
                  ></IGRPDataTableButtonLink>
                  <IGRPDataTableButtonLink
                    labelTrigger={`Atribuir Tarefa`}
                    variant={`ghost`}
                    icon={`UserCheck`}
                    className={cn()}
                    action={() => {
                      handleOpenAssignModal(rowData);
                    }}
                  ></IGRPDataTableButtonLink>
                </IGRPDataTableRowAction>
              );
            },
            filterFn: IGRPDataTableFacetedFilterFn,
          },
        ]}
        clientFilters={[]}
        data={contentTabletable1}
      />
      <CommonUserTaskModalForm
        modalTitle={`Atribuir Tarefa`}
        userRequired={true}
        open={assignModalState.isOpen}
        modalSubTitle={modalSubtitle}
        setOpen={(open) => (open ? {} : handleCloseAssignModal())}
        onSave={handleAssignTaskSave}
      ></CommonUserTaskModalForm>
    </div>
  );
}
