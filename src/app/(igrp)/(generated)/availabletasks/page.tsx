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
import { 
  IGRPPageHeader,
	IGRPDataTable,
	IGRPDataTableCellBadge,
	IGRPDataTableRowAction,
	IGRPDataTableDropdownMenu,
	IGRPDataTableDropdownMenuLink 
} from "@igrp/igrp-framework-react-design-system";
import {useAvailableTasks} from '@/app/(myapp)/availabletasks/hooks/use-available-tasks'
import {useDashboard} from '@/app/(myapp)/dashboard/hooks/use-dashboard'


export default function PageAvailabletasksComponent() {


  
  type Table1 = {
    processInfo: string;
    createBy: string;
    taskName: string;
    status: string;
    daysWaiting: string;
    taskId: string;
}

  const [contentTabletasks, setContentTabletasks] = useState<Table1[]>([]);
  
  
const [showFilter, setShowFilter] = useState<boolean>(false);

const { igrpToast } = useIGRPToast()

//------------------------------------Reserved Area-------------------------
  const {stats, loading: statsLoading } = useDashboard();
  // Integration with useAvailableTasks hook
  const {
    tableData,
    loading,
    error,
    totalElements,
    totalPages,
    currentPage,
    filters,
    handleSearch,
    handlePageChange,
    applyFilters,
    resetFilters,
    getStatusVariant,
    handleClaimTask,
  } = useAvailableTasks();

  // Update table data when tableData changes
  useEffect(() => {
    const transformedData = tableData.map((task) => ({
      processInfo: task.processInfo,
      createBy: task.createBy,
      taskName: task.taskName,
      status: task.status,
      daysWaiting: task.daysWaiting,
      taskId: task.taskId, // Include taskId
    }));
    setContentTabletasks(transformedData);
  }, [tableData]);

  // Show error toast if there's an error
  useEffect(() => {
    if (error) {
      igrpToast({
        title: 'Erro',
        description: error,
      });
    }
  }, [error, igrpToast]);

  // Handle claim task action
  const onClaimTask = async (taskId: string) => {
    const result = await handleClaimTask(taskId, 'current-user'); // You might want to get the actual user from context/session
    
    if (result.success) {
      igrpToast({
        type: 'success',
        title: 'Sucesso',
        description: 'Tarefa assumida com sucesso!',
      });
    } else {
      igrpToast({
        type: 'error',
        title: 'Erro',
        description: result.error || 'Erro ao assumir tarefa',
      });
    }
  };

  //------------------------------------Reserved Area-------------------------


  return (
<div className={ cn('page','space-y-6',)}    >
	<IGRPPageHeader
  name={ `pageHeader1` }
  title={ `Tarefas Disponíveis` }
  description={ `Visualize e atribua tarefas disponíveis para você` }
  iconBackButton={ `ArrowLeft` }
  urlBackButton={ `/dashboard` }
  variant={ `h3` }
  className={ cn() }
  
>
  <div className="flex items-center gap-2">
</div>
</IGRPPageHeader>

<ProcessStatsCards  stats={ stats } loading={ statsLoading }   ></ProcessStatsCards>
<div className={ cn(' border rounded-sm',)}    >
	<TaskProcessFilter   onSearch={ handleSearch }
onApplyFilters={ applyFilters }
onResetFilters={ resetFilters } ></TaskProcessFilter></div>
<IGRPDataTable<Table1, Table1>
  showFilter={ true }
  showPagination={ true }
  tableClassName={ `rounded-none` }
  paginationClassName={ `px-3 pb-3` }
  className={ cn('','border-0 border-solid border-[#000000]',) }
  columns={
    [
        {
          header: 'Processo'
,accessorKey: 'processInfo',
          cell: ({ row }) => {
          return row.getValue("processInfo")
          },
          filterFn: IGRPDataTableFacetedFilterFn
        },
        {
          header: 'Criado por'
,accessorKey: 'createBy',
          cell: ({ row }) => {
          return row.getValue("createBy")
          },
          filterFn: IGRPDataTableFacetedFilterFn
        },
        {
          header: 'Etapa atual'
,accessorKey: 'taskName',
          cell: ({ row }) => {
          return row.getValue("taskName")
          },
          filterFn: IGRPDataTableFacetedFilterFn
        },
        {
          header: 'Estado'
,accessorKey: 'status',
          cell: ({ row }) => {
          const rowData = row.original;


return <IGRPDataTableCellBadge
  label={ row.original.status }
  variant={ `soft` }
badgeClassName={ `` }
>

</IGRPDataTableCellBadge>
          },
          filterFn: IGRPDataTableFacetedFilterFn
        },
        {
          header: 'Dias em espera'
,accessorKey: 'daysWaiting',
          cell: ({ row }) => {
          return row.getValue("daysWaiting")
          },
          filterFn: IGRPDataTableFacetedFilterFn
        },
        {
          id: 'tableActionListCell1',
          enableHiding: false,cell: ({ row }) => {
          const rowData = row.original;

return (
<IGRPDataTableRowAction>
  <IGRPDataTableDropdownMenu
  items={
    [
      {
        component: IGRPDataTableDropdownMenuLink,
        props: {
          labelTrigger: `Assumir Tarefa`,icon: `CheckCheck`,          showIcon: true,          action: () => { onClaimTask(rowData.taskId); },
}
      },
]
  }
>
</IGRPDataTableDropdownMenu>
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
  
  data={ contentTabletasks }
/></div>
  );
}
