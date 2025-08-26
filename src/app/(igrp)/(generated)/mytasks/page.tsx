'use client'

/* THIS FILE WAS GENERATED AUTOMATICALLY BY iGRP STUDIO. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { use, useState, useEffect, useRef } from 'react';
import { cn, useIGRPMenuNavigation, useIGRPToast } from '@igrp/igrp-framework-react-design-system';
import ProcessStatsCards from '@/components/processstatscards'
import TaskProcessFilter from '@/components/taskprocessfilter'
import { IGRPDataTableFacetedFilterFn , IGRPDataTableDateRangeFilterFn } from "@igrp/igrp-framework-react-design-system";
import { IGRPDataTableHeaderSortToggle, IGRPDataTableHeaderSortDropdown, IGRPDataTableHeaderRowsSelect } from "@igrp/igrp-framework-react-design-system";
import CommonUserTaskModalForm from '@/components/commonusertaskmodalform'
import { 
  IGRPPageHeader,
	IGRPDataTable,
	IGRPDataTableCellBadge,
	IGRPDataTableRowAction,
	IGRPDataTableButtonLink 
} from "@igrp/igrp-framework-react-design-system";
import {useMyTasks} from '@/app/(myapp)/mytasks/hooks/use-my-tasks'
import { useRouter } from 'next/navigation'
import { urlConfig } from '@/app/(myapp)/utils/url-config'
import {useDashboard} from '@/app/(myapp)/dashboard/hooks/use-dashboard'
import {getTaskStatusColor} from '@/app/(myapp)/utils/status-badge'


export default function PageMytasksComponent() {


  
  type Table1 = {
    process: string;
    processNumber: string;
    assignedBy: string;
    currentStep: string;
    waitingDays: string;
    status: string;
    processKey: string;
    processInstanceId: string;
    taskKey: string;
    taskId: string;
}

  const [contentTabletable1, setContentTabletable1] = useState<Table1[]>([]);
  
  
const { igrpToast } = useIGRPToast()

function executeTask (row: any): void  | undefined {

  console.log('Executing task:', row);
    // Navigate to task execution page using centralized URL config
    const taskUrl = urlConfig.buildTaskExecutionUrl(
      row.processKey,
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
    tableData,
    myTasksState,
    unclaimModalState,
    fetchMyTasks,
    applyFilters,
    resetFilters,
    handleSearch,
    handlePageChange,
    handleUnclaimTask,
    handleOpenUnclaimModal,
    handleCloseUnclaimModal,
    loading,
    error,
  } = useMyTasks();

  // Transform data for the table
  useEffect(() => {
    if (tableData) 
      setContentTabletable1(tableData);
  }, [tableData]);

  // Load initial data
  useEffect(() => {
    fetchMyTasks();
  }, []);

  const handleSearchSubmit = (searchTerm: string) => {
    handleSearch(searchTerm);
  };

  const handleApplyFilters = () => {
    applyFilters();
  };

  const handleResetFilters = () => {
    resetFilters();
  };
  // Handle unclaim task save
  const handleUnclaimTaskSave = async (formData: { note?: string }) => {
    const result = await handleUnclaimTask(formData.note);

    if (igrpToast) {
      igrpToast({
        type: result?.success ? 'success' : 'error',
        title: result?.success ? 'Sucesso' : 'Erro',
        description: result?.message,
      });
    }
  };

  // Define modal subtitle with dynamic content
  const modalSubtitle = `Libertar a tarefa "${unclaimModalState.selectedTask?.currentStep}" do processo "${unclaimModalState.selectedTask?.process}"`;

  //-------------------reserved area end------------------------------


  return (
<div className={ cn('page','space-y-6',)}    >
	<IGRPPageHeader
  name={ `pageHeader1` }
  title={ `Minhas Tarefas` }
  description={ `Tarefas atribuídas a você` }
  iconBackButton={ `ArrowLeft` }
  urlBackButton={ `/dashboard` }
  variant={ `h3` }
  className={ cn() }
  
>
  <div className="flex items-center gap-2">
</div>
</IGRPPageHeader>

<ProcessStatsCards  stats={ stats } loading={ statsLoading }   ></ProcessStatsCards>
<div className={ cn(' border rounded-lg',)}    >
	<TaskProcessFilter   onSearch={ handleSearchSubmit }
onApplyFilters={ handleApplyFilters }
onResetFilters={ handleResetFilters } ></TaskProcessFilter></div>
<IGRPDataTable<Table1, Table1>
  showFilter={ true }
  showPagination={ true }
  paginationClassName={ `px-3 pb-3` }
  className={ cn() }
  columns={
    [
        {
          header: 'Processo'
,accessorKey: 'process',
          cell: ({ row }) => {
          return row.getValue("process")
          },
          filterFn: IGRPDataTableFacetedFilterFn
        },
        {
          header: 'Número'
,accessorKey: 'processNumber',
          cell: ({ row }) => {
          return row.getValue("processNumber")
          },
          filterFn: IGRPDataTableFacetedFilterFn
        },
        {
          header: 'Utilizador'
,accessorKey: 'assignedBy',
          cell: ({ row }) => {
          return row.getValue("assignedBy")
          },
          filterFn: IGRPDataTableFacetedFilterFn
        },
        {
          header: 'Etapa Atual	'
,accessorKey: 'currentStep',
          cell: ({ row }) => {
          return row.getValue("currentStep")
          },
          filterFn: IGRPDataTableFacetedFilterFn
        },
        {
          header: 'Dias em espera'
,accessorKey: 'waitingDays',
          cell: ({ row }) => {
          return row.getValue("waitingDays")
          },
          filterFn: IGRPDataTableFacetedFilterFn
        },
        {
          header: 'Estado'
,accessorKey: 'status',
          cell: ({ row }) => {
          const rowData = row.original;

const { iconName, bgClass, textClass, label, className } = getTaskStatusColor(rowData);

return <IGRPDataTableCellBadge
  label={ label ?? row.original.status }
  variant={ `soft` }
badgeClassName={ `${bgClass} ${textClass} ${className}` }
>

</IGRPDataTableCellBadge>
          },
          filterFn: IGRPDataTableFacetedFilterFn
        },
        {
          id: 'tableActionListCell1',
          enableHiding: false,cell: ({ row }) => {
          const rowData = row.original;

return (
<IGRPDataTableRowAction>
  <IGRPDataTableButtonLink
  labelTrigger={ `Executar Tarefa` }
  variant={ `ghost` }
  icon={ `Play` }
  className={ cn() }
  action={ () => {executeTask(rowData)} }
>
</IGRPDataTableButtonLink>
  <IGRPDataTableButtonLink
  labelTrigger={ `Libertar Tarefa` }
  variant={ `ghost` }
  icon={ `UserX` }
  className={ cn() }
  action={ () => { handleOpenUnclaimModal(rowData); } }
>
</IGRPDataTableButtonLink>
</IGRPDataTableRowAction>
);
          },
          filterFn: IGRPDataTableFacetedFilterFn
        },
]
  }
  clientFilters={
    [
    ]
  }
  
  data={ contentTabletable1 }
/>
<CommonUserTaskModalForm  modalTitle={ `Libertar Tarefa` } modalSubTitle={ modalSubtitle } open={ unclaimModalState.isOpen }  setOpen={ (open) => (open ? {} : handleCloseUnclaimModal()) }
onSave={ handleUnclaimTaskSave } ></CommonUserTaskModalForm></div>
  );
}
