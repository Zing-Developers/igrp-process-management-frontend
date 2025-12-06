'use client'

/* THIS FILE WAS GENERATED AUTOMATICALLY BY iGRP STUDIO. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { use, useState, useEffect, useRef } from 'react';
import { cn, useIGRPMenuNavigation, useIGRPToast } from '@igrp/igrp-framework-react-design-system';
import TaskProcessFilter from '@/components/taskprocessfilter'
import { IGRPDataTableFacetedFilterFn , IGRPDataTableDateRangeFilterFn } from "@igrp/igrp-framework-react-design-system";
import { IGRPDataTableHeaderSortToggle, IGRPDataTableHeaderSortDropdown, IGRPDataTableHeaderRowsSelect } from "@igrp/igrp-framework-react-design-system";
import { 
  IGRPPageHeader,
	IGRPStatsCard,
	IGRPDataTable,
	IGRPDataTableCellBadge,
	IGRPDataTableRowAction,
	IGRPDataTableButtonLink 
} from "@igrp/igrp-framework-react-design-system";
import {useAvailableTasks} from '@/app/(myapp)/availabletasks/hooks/use-available-tasks'
import {useDashboard} from '@/app/(myapp)/dashboard/hooks/use-dashboard'
import {getPriorityColor} from '@/app/(myapp)/utils/status-badge'
import {getTaskStatusColor} from '@/app/(myapp)/utils/status-badge'


export default function PageAvailabletasksComponent() {


  
  type Table1 = {
    taskName: string;
    processInfo: string;
    startedAt: string;
    endAt: string;
    priority: string;
    daysWaiting: string;
    status: string;
    taskId: string;
}

  const [statstatsCard1Value, setStatstatsCard1Value] = useState<string | number>(0);
  const [contentTabletasks, setContentTabletasks] = useState<Table1[]>([]);
  
  
const [showFilter, setShowFilter] = useState<boolean>(false);

const { igrpToast } = useIGRPToast()

//------------------------------------Reserved Area-------------------------
  const { stats, loading: statsLoading } = useDashboard();

  const {
    tableData,
    error,
    totalElements,
    totalPages,
    currentPage,
    filters,
    handleSearch,
    applyFilters,
    resetFilters,
    handleClaimTask,
  } = useAvailableTasks();

  // Update table data when tableData changes
  useEffect(() => {
    if (tableData) setContentTabletasks(tableData);
    setStatstatsCard1Value(stats.tasks.totalTasksAvailable);
  }, [tableData, stats]);

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
    // const result = await handleClaimTask(taskId, 'current-user');
    const result = await handleClaimTask(taskId); 

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
  id={ `pageHeader1` }
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

<div className={ cn('grid','md:grid-cols-2 ','lg:grid-cols-3 ',' gap-4',)}    >
	<IGRPStatsCard
  id={ `statsCard1` }
  cardBorderPosition={ `top` }
cardBorder={ `rounded-lg` }
cardVariant={ `info` }
iconBackground={ `square` }
title={ undefined }
titleSize={ `sm` }
valueSize={ `2xl` }
showIcon={ true }
iconName={ `ListChecks` }
iconSize={ `md` }
iconVariant={ `info` }
iconPlacement={ `end` }
itemPlacement={ `start` }
showIconBorder={ false }
showIconBackground={ true }
  className={ cn('col-span-1',) }
  onClick={ () => {} }
  value={ statstatsCard1Value }
>
</IGRPStatsCard></div>
<div className={ cn(' border rounded-sm',)}    >
	<TaskProcessFilter   onSearch={ handleSearch }
onApplyFilters={ applyFilters }
onResetFilters={ resetFilters } ></TaskProcessFilter></div>
<IGRPDataTable<Table1, Table1>
  id={ `tasks` }
  showFilter={ true }
  showPagination={ true }
  paginationClassName={ `px-3 pb-3` }
  className={ cn('','border-0 border-solid border-[#000000]',) }
  columns={
    [
        {
          header: 'Tarefa'
,accessorKey: 'taskName',
          cell: ({ row }) => {
          return row.getValue("taskName")
          },
          filterFn: IGRPDataTableFacetedFilterFn
        },
        {
          header: 'Processo'
,accessorKey: 'processInfo',
          cell: ({ row }) => {
          return row.getValue("processInfo")
          },
          filterFn: IGRPDataTableFacetedFilterFn
        },
        {
          header: 'Data Inicio'
,accessorKey: 'startedAt',
          cell: ({ row }) => {
          return row.getValue("startedAt")
          },
          filterFn: IGRPDataTableFacetedFilterFn
        },
        {
          header: 'Data Fim'
,accessorKey: 'endAt',
          cell: ({ row }) => {
          return row.getValue("endAt")
          },
          filterFn: IGRPDataTableFacetedFilterFn
        },
        {
          header: 'Prioridade'
,accessorKey: 'priority',
          cell: ({ row }) => {
          const rowData = row.original;

const { iconName, bgClass, textClass, label, className } = getPriorityColor(rowData);

return <IGRPDataTableCellBadge
  label={ label ?? row.original.priority }
  variant={ `soft` }
badgeClassName={ `${bgClass} ${textClass} ${className}` }
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
  labelTrigger={ `Assumir Tarefa` }
  variant={ `ghost` }
  icon={ `CheckCheck` }
  className={ cn() }
  action={ ()=> { onClaimTask(rowData.taskId); }
 }
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
  
  data={ contentTabletasks }
/></div>
  );
}
