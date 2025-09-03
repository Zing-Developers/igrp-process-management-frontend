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
import {useMyTasks} from '@/app/(myapp)/mytasks/hooks/use-my-tasks'
import { useRouter } from 'next/navigation'
import { urlConfig } from '@/app/(myapp)/utils/url-config'
import {useDashboard} from '@/app/(myapp)/dashboard/hooks/use-dashboard'
import {getPriorityColor} from '@/app/(myapp)/utils/status-badge'


export default function PageMytasksComponent() {


  
  type Table1 = {
    processName: string;
    currentStep: string;
    process: string;
    startedAt: string;
    endAt: string;
    waitingDays: string;
    priority: string;
    processKey: string;
    processInstanceId: string;
    taskKey: string;
    taskId: string;
}

  const [statstatsCard1Value, setStatstatsCard1Value] = useState<string | number>(0);
  const [statstatsCard2Value, setStatstatsCard2Value] = useState<string | number>(0);
  const [statstatsCard5Value, setStatstatsCard5Value] = useState<string | number>(0);
  const [statstatsCard4Value, setStatstatsCard4Value] = useState<string | number>(0);
  const [statstatsCard3Value, setStatstatsCard3Value] = useState<string | number>(0);
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
    unclaimModalState,
    fetchMyTasks,
    applyFilters,
    resetFilters,
    handleSearch,
    handleUnclaimTask,
    handleOpenUnclaimModal,
    handleCloseUnclaimModal
  } = useMyTasks();

  // Transform data for the table
  useEffect(() => {
    if (tableData) 
      setContentTabletable1(tableData);
    setStatstatsCard1Value(stats.tasks.totalMyTasks);    
    setStatstatsCard2Value(stats.tasks.totalTasksAvailable);
    setStatstatsCard5Value(stats.tasks.totalMyTasksSuspended);
    setStatstatsCard4Value(stats.tasks.totalMyTasksCancelled);
    setStatstatsCard3Value(stats.tasks.totalMyTasksCompleted);
  }, [tableData, stats]);

  // Load initial data
  useEffect(() => {
    fetchMyTasks(0, 50);
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

<div className={ cn('grid','grid-cols-1 ','md:grid-cols-2 ','lg:grid-cols-3 ','xl:grid-cols-5 ',' gap-4',)}    >
	<IGRPStatsCard
  name={ `statsCard1` }
  cardBorderPosition={ `top` }
cardBorder={ `rounded-lg` }
cardVariant={ `info` }
iconBackground={ `square` }
title={ `Total de Tarefas` }
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
  name={ `statsCard2` }
  cardBorderPosition={ `top` }
cardBorder={ `rounded-lg` }
cardVariant={ `warning` }
iconBackground={ `square` }
title={ `Total Disponiveis` }
titleSize={ `sm` }
valueSize={ `2xl` }
showIcon={ true }
iconName={ `CircleAlert` }
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
  name={ `statsCard5` }
  cardBorderPosition={ `top` }
cardBorder={ `rounded-lg` }
cardVariant={ `primary` }
iconBackground={ `square` }
title={ `Total Suspensos` }
titleSize={ `sm` }
valueSize={ `2xl` }
showIcon={ true }
iconName={ `Pause` }
iconSize={ `md` }
iconVariant={ `primary` }
iconPlacement={ `end` }
itemPlacement={ `start` }

showIconBackground={ true }
  className={ cn('col-span-1',) }
  onClick={ () => {} }
  value={ statstatsCard5Value }
>
</IGRPStatsCard>
<IGRPStatsCard
  name={ `statsCard4` }
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
  name={ `statsCard3` }
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
