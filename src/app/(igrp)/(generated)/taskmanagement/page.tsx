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
import CommonUserTaskModalForm from '@/components/commonusertaskmodalform'
import { 
  IGRPPageHeader,
	IGRPStatsCard,
	IGRPDataTable,
	IGRPDataTableCellBadge,
	IGRPDataTableRowAction,
	IGRPDataTableButtonLink 
} from "@igrp/igrp-framework-react-design-system";
import { useTaskManagement } from '@/app/(myapp)/taskmanagement/hooks/use-task-management'
import { useRouter } from 'next/navigation'
import { urlConfig } from '@/app/(myapp)/utils/url-config'
import {useDashboard} from '@/app/(myapp)/dashboard/hooks/use-dashboard'
import {getPriorityColor} from '@/app/(myapp)/utils/status-badge'
import {getTaskStatusColor} from '@/app/(myapp)/utils/status-badge'


export default function PageTaskmanagementComponent() {


  
  type Table1 = {
    currentStep: string;
    process: string;
    assignedBy: string;
    priority: string;
    startedAt: string;
    endAt: string;
    waitingDays: string;
    status: string;
    taskId: string;
    taskKey: string;
    processKey: string;
    processInstanceId: string;
    processName: string;
}

  const [statstatsCard1Value, setStatstatsCard1Value] = useState<string | number>(0);
  const [statstatsCard5Value, setStatstatsCard5Value] = useState<string | number>(0);
  const [statstatsCard2Value, setStatstatsCard2Value] = useState<string | number>(0);
  const [statstatsCard4Value, setStatstatsCard4Value] = useState<string | number>(0);
  const [statstatsCard3Value, setStatstatsCard3Value] = useState<string | number>(0);
  const [contentTabletable1, setContentTabletable1] = useState<Table1[]>([]);
  
  
const { igrpToast } = useIGRPToast()

async function executeTask (row: any): Promise<void  | undefined> {

  // Navigate to task execution page using centralized URL config
const taskUrl = await urlConfig.buildTaskExecutionUrl(
  row.processKey,
  row.processInstanceId,
  row.taskKey,
  row.taskId,
  row.applicationBase
);
router.push(taskUrl as any);

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
    handleAssignTask,
    handleOpenAssignModal,
    handleCloseAssignModal,
  } = useTaskManagement();

  // Transform data for the table
  useEffect(() => {
    if (tableData) setContentTabletable1(tableData);
    if (stats) {
      setStatstatsCard1Value(stats.tasks.totalTasks);
      setStatstatsCard5Value(stats.tasks.totalTasksAvailable);
      setStatstatsCard2Value(stats.tasks.totalTasksAssigned);
      setStatstatsCard3Value(stats.tasks.totalTasksCancelled);
      setStatstatsCard4Value(stats.tasks.totalTasksCompleted);
    }
  }, [tableData, stats]);

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
    const result = await handleAssignTask(formData.user,  formData.note ?? '');

    if (igrpToast) {
      igrpToast({
        type: result?.success ? 'success' : 'error',
        title: result?.success ? 'Sucesso' : 'Erro',
        description: result?.message,
      });
    }
  };

  // Define modal subtitle with dynamic content
  const modalSubtitle = `Indicar um utilizador para assumir a tarefa "${assignModalState.selectedTask?.currentStep}" do processo "${assignModalState.selectedTask?.processName}"`;

  //-------------------reserved area end------------------------------


  return (
<div className={ cn('page','space-y-6',)}    >
	<IGRPPageHeader
  id={ `pageHeader1` }
  title={ `Gestão de Tarefas` }
  description={ `Visualize e gerencie todas as tarefas do sistema` }
  iconBackButton={ `ChartLine` }
  urlBackButton={ `/dashboard` }
  variant={ `h3` }
  className={ cn() }
  
>
  <div className="flex items-center gap-2">
</div>
</IGRPPageHeader>

<div className={ cn('grid','md:grid-cols-5 ','lg:grid-cols-5 ','xl:grid-cols-5 ',' gap-4',)}    >
	<IGRPStatsCard
  id={ `statsCard1` }
  cardBorderPosition={ `top` }
cardBorder={ `rounded-lg` }
cardVariant={ `info` }
iconBackground={ `square` }
title={ `Total Tarefas` }
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
</IGRPStatsCard>
<IGRPStatsCard
  id={ `statsCard5` }
  cardBorderPosition={ `top` }
cardBorder={ `rounded-lg` }
cardVariant={ `indigo` }
iconBackground={ `square` }
title={ `Total Disponiveis` }
titleSize={ `sm` }
valueSize={ `2xl` }
showIcon={ true }
iconName={ `FolderOpen` }
iconSize={ `md` }
iconVariant={ `indigo` }
iconPlacement={ `end` }
itemPlacement={ `start` }
showIconBackground={ true }
  className={ cn('col-span-1',) }
  onClick={ () => {} }
  value={ statstatsCard5Value }
>
</IGRPStatsCard>
<IGRPStatsCard
  id={ `statsCard2` }
  cardBorderPosition={ `top` }
cardBorder={ `rounded-lg` }
cardVariant={ `warning` }
iconBackground={ `square` }
title={ `Total Atribuibos` }
titleSize={ `sm` }
valueSize={ `2xl` }
showIcon={ true }
iconName={ `UserCheck` }
iconSize={ `md` }
iconVariant={ `warning` }
iconPlacement={ `end` }
itemPlacement={ `start` }
showIconBackground={ true }
showIconBorder={ false }
  className={ cn('col-span-1',) }
  onClick={ () => {} }
  value={ statstatsCard2Value }
>
</IGRPStatsCard>
<IGRPStatsCard
  id={ `statsCard4` }
  cardBorderPosition={ `top` }
cardBorder={ `rounded-lg` }
cardVariant={ `destructive` }
iconBackground={ `square` }
title={ `Total Cancelados` }
titleSize={ `sm` }
valueSize={ `2xl` }
showIcon={ true }
iconName={ `CalendarX2` }
iconSize={ `md` }
iconVariant={ `destructive` }
iconPlacement={ `end` }
itemPlacement={ `start` }
showIconBackground={ true }
  className={ cn('col-span-1',) }
  onClick={ () => {} }
  value={ statstatsCard4Value }
>
</IGRPStatsCard>
<IGRPStatsCard
  id={ `statsCard3` }
  cardBorderPosition={ `top` }
cardBorder={ `rounded-lg` }
cardVariant={ `success` }
iconBackground={ `square` }
title={ `Total Finalizados` }
titleSize={ `sm` }
valueSize={ `2xl` }
showIcon={ true }
iconName={ `CheckCheck` }
iconSize={ `md` }
iconVariant={ `success` }
iconPlacement={ `end` }
itemPlacement={ `start` }
showIconBackground={ true }
showIconBorder={ false }
  className={ cn('col-span-1',) }
  onClick={ () => {} }
  value={ statstatsCard3Value }
>
</IGRPStatsCard></div>
<div className={ cn(' border rounded-sm',)}    >
	<TaskProcessFilter   onSearch={ handleSearchSubmit }
onApplyFilters={ handleApplyFilters }
onResetFilters={ handleResetFilters } ></TaskProcessFilter></div>
<IGRPDataTable<Table1, Table1>
  id={ `table1` }
  showFilter={ true }
  showPagination={ true }
  paginationClassName={ `px-3 pb-3` }
  className={ cn() }
  columns={
    [
        {
          header: 'Tarefa'
,accessorKey: 'currentStep',
          cell: ({ row }) => {
          return row.getValue("currentStep")
          },
          filterFn: IGRPDataTableFacetedFilterFn
        },
        {
          header: 'Processo'
,accessorKey: 'process',
          cell: ({ row }) => {
          return row.getValue("process")
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
          header: 'Data Início'
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
  labelTrigger={ `Atribuir Tarefa` }
  variant={ `ghost` }
  icon={ `UserCheck` }
  className={ cn() }
  action={ () => {handleOpenAssignModal(rowData);} }
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
<CommonUserTaskModalForm  modalTitle={ `Atribuir Tarefa` } userRequired={ true } showPriority={ true } open={ assignModalState.isOpen } modalSubTitle={ modalSubtitle }  setOpen={ (open) => open? {} : handleCloseAssignModal() }
onSave={ handleAssignTaskSave } ></CommonUserTaskModalForm></div>
  );
}
