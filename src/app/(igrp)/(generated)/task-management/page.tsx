'use client'

/* THIS FILE WAS GENERATED AUTOMATICALLY BY iGRP STUDIO. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { use, useState, useEffect, useRef } from 'react';
import { cn, useIGRPMenuNavigation, useIGRPToast } from '@igrp/igrp-framework-react-design-system';
import { AppliedFilter, AppliedFiltersSection, FiltersSection } from '@/app/(myapp)/components/filter-section'
import { FilterData } from '@/app/(myapp)/components/filter-data'
import { FilterState, useDropdownData } from '@/app/(myapp)/components/processtaksfilter/hooks/use-dropdown-data'
import { IRNDatePicker } from '@irn/irn-backoffice-design-system'
import { IGRPDataTableFacetedFilterFn , IGRPDataTableDateRangeFilterFn } from "@igrp/igrp-framework-react-design-system";
import { IGRPDataTableHeaderSortToggle, IGRPDataTableHeaderSortDropdown, IGRPDataTableHeaderRowsSelect } from "@igrp/igrp-framework-react-design-system";
import {LoadingPage} from '@/app/(myapp)/components/loading-page'
import CommonUserTaskModalForm from '@/components/commonusertaskmodalform'
import { 
	IGRPDataTable,
	IGRPDataTableCellBadge,
	IGRPDataTableRowAction,
	IGRPDataTableButtonLink,
  IGRPCombobox,
  IGRPInputText
} from "@igrp/igrp-framework-react-design-system";
import { useRouter } from 'next/navigation'
import { urlConfig } from '@/app/(myapp)/utils/url-config'
import {useDashboard} from '@/app/(myapp)/dashboard/hooks/use-dashboard'
import { useTaskManagement } from '@/app/(myapp)/task-management/hooks/use-task-management'
import {getTaskStatusColor} from '@/app/(myapp)/utils/status-badge'
import { PageHeader } from '@/app/(myapp)/components/PageHeader';


export default function PageTaskmanagementComponent() {


  
  type Table1 = {
    process: string;
    currentStep: string;
    assignedBy: string;
    startedAt: string;
    endedAt: string;
    duration: string;
    status: string;
    priority: string;
    updatedBy: string;
    taskId: string;
}

  const [statstatsCard1Value, setStatstatsCard1Value] = useState<string | number>(0);
  
  
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
  handleSearch,
  updateFilters,
  applyFilters,
  resetFilters,
  handleOpenAssignModal,
  handleCloseAssignModal,
  handleAssignTask,
  getPriorityBadge,
  filters
} = useTaskManagement();
const [draftFilters, setDraftFilters] = useState<FilterState>({
  areaId: '', subareaId: '', processType: '', processNumber: '', status: '',
  dateFrom: null, dateTo: null, organic: '', user: '', variables: [],
});
const { dropdownOptions } = useDropdownData(draftFilters);

// Transform data for the table
useEffect(() => {
  if (stats && !statsLoading) {
    setStatstatsCard1Value(stats.tasks.totalTasks);
  }
}, [stats, statsLoading]);

const handleSearchSubmit = (searchTerm: string) => {
  handleSearch(searchTerm);
};

useEffect(() => {
  setDraftFilters((currentFilters) => ({
    ...currentFilters,
    areaId: filters.areaId ?? '',
    subareaId: filters.subareaId ?? '',
    processType: filters.processType ?? '',
    processNumber: filters.processNumber ?? '',
    status: filters.status ?? '',
    dateFrom: filters.dateFrom ?? null,
    dateTo: filters.dateTo ?? null,
    organic: filters.organic ?? '',
    user: filters.user ?? '',
    variables: (filters.variables ?? []).map((filter, index) => ({
      ...filter,
      id: `existing-variable-${index}`,
    })),
  }));
}, [filters]);

const handleApplyFilters = () => {
  updateFilters({
    areaId: draftFilters.areaId,
    subareaId: draftFilters.subareaId,
    processType: draftFilters.processType,
    processNumber: draftFilters.processNumber,
    status: draftFilters.status,
    dateFrom: draftFilters.dateFrom ?? undefined,
    dateTo: draftFilters.dateTo ?? undefined,
    organic: draftFilters.organic,
    user: draftFilters.user,
    variables: draftFilters.variables.map(({ id, ...filter }) => filter),
  });
  applyFilters();
};

const handleResetFilters = () => {
  resetFilters();
  setDraftFilters((currentFilters) => ({
    ...currentFilters,
    areaId: '', subareaId: '', processType: '', processNumber: '', status: '',
    dateFrom: null, dateTo: null, organic: '', user: '', variables: [],
  }));
};

const toPickerDate = (value: string | null) => {
  if (!value) return undefined;
  const [day, month, year] = value.split('-');
  return `${year}-${month}-${day}`;
};

const fromPickerDate = (value: string) => {
  if (!value) return null;
  const [year, month, day] = value.split('-');
  return `${day}-${month}-${year}`;
};

const selectedValue = (value: string | string[]) => Array.isArray(value) ? value[0] : value;
const optionLabel = (options: { label: string; value: string }[], value: string) => options.find((option) => option.value === value)?.label ?? value;

const appliedFilters: AppliedFilter[] = [
   draftFilters.areaId && { key: 'areaId', label: `\u00c1rea: ${optionLabel(dropdownOptions.areas, draftFilters.areaId)}`, onRemove: () => updateFilters({ areaId: '', subareaId: '', processType: '' }) },
   draftFilters.subareaId && { key: 'subareaId', label: `Sub-\u00e1rea: ${optionLabel(dropdownOptions.subareas, draftFilters.subareaId)}`, onRemove: () => updateFilters({ subareaId: '', processType: '' }) },
   draftFilters.processType && { key: 'processType', label: `Tipo de processo: ${optionLabel(dropdownOptions.processTypes, draftFilters.processType)}`, onRemove: () => updateFilters({ processType: '' }) },
   draftFilters.processNumber && { key: 'processNumber', label: `N\u00famero do processo: ${draftFilters.processNumber}`, onRemove: () => updateFilters({ processNumber: '' }) },
   draftFilters.status && { key: 'status', label: `Estado: ${optionLabel(dropdownOptions.statuses, draftFilters.status)}`, onRemove: () => updateFilters({ status: '' }) },
   (draftFilters.dateFrom || draftFilters.dateTo) && { key: 'period', label: `Per\u00edodo: ${draftFilters.dateFrom ?? ''}${draftFilters.dateTo ? ` a ${draftFilters.dateTo}` : ''}`, onRemove: () => updateFilters({ dateFrom: undefined, dateTo: undefined }) },
   ...draftFilters.variables.filter((filter) => filter.value !== '').map((filter) => ({
    key: `variable-${filter.id}`,
    label: `${filter.name}: ${filter.value}`,
    onRemove: () => {
      const nextVariables = draftFilters.variables.filter((item) => item.id !== filter.id);
      setDraftFilters((currentFilters) => ({ ...currentFilters, variables: nextVariables }));
      updateFilters({ variables: nextVariables.map(({ id, ...item }) => item) });
    },
  })),
].filter((filter): filter is AppliedFilter => Boolean(filter));

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
const handleAssignTaskSave = async (formData: {
  user: string;
  note?: string;
  priority?: string;
  candidateGroups?: string;
  assigneTo?: string;
}) => {
  if (formData.assigneTo === "user" && formData.user === "") {
    igrpToast({
      type: "error",
      title: "Erro",
      description: "O utilizador é obrigatório",
    });
    return;
  }
  if (formData.assigneTo === "group" && formData.candidateGroups === "") {
    igrpToast({
      type: "error",
      title: "Erro",
      description: "O grupo é obrigatório",
    });
    return;
  }
  const result = await handleAssignTask(
    formData.user,
    formData.priority ?? "",
    formData.note ?? "",
    formData.candidateGroups ?? ""
  );

  if (igrpToast) {
    igrpToast({
      type: result?.success ? "success" : "error",
      title: result?.success ? "Sucesso" : "Erro",
      description: result?.message,
    });
  }
};

// Define modal subtitle with dynamic content
const modalSubtitle = `Indicar um utilizador para assumir a tarefa "${assignModalState.selectedTask?.currentStep}" do processo "${assignModalState.selectedTask?.processName}"`;

//-------------------reserved area end------------------------------


  return (
<div className={ cn('page','space-y-6',)}    >
  {/* Legacy header, cards, and filter UI retained for generated-page traceability.
      The replacement below uses the shared filter interaction pattern. */}
  {/*
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
title={ `Total disponíveis` }
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
title={ `Total cancelados` }
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
title={ `Total finalizados` }
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
onResetFilters={ handleResetFilters }
onFiltersChange={ handleApplyFilters } ></TaskProcessFilter></div>
<FilterActives  filters={ filters }  onFiltersChange={ handleApplyFilters } ></FilterActives>
  */}
  <PageHeader
    name={"Gest\u00e3o de Tarefas"}
    description="Visualize e gerencie todas as tarefas do sistema"
    badgeCount={parseInt(`${statstatsCard1Value}`)}
  />
  <FiltersSection hasAppliedFilters={appliedFilters.length > 0} onApply={handleApplyFilters} onClear={handleResetFilters}>
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <IGRPInputText id="processNumber" label={"N\u00famero do processo"} placeholder="Ex: CV-24509202511" value={draftFilters.processNumber} onChange={(event) => setDraftFilters((currentFilters) => ({ ...currentFilters, processNumber: event.target.value }))} />
      <IGRPCombobox id="status" label="Estado" variant="single" placeholder="Selecione um estado..." selectLabel={"Nenhuma op\u00e7\u00e3o encontrada"} showSearch={true} showIcon={false} options={dropdownOptions.statuses} value={draftFilters.status} onChange={(value) => setDraftFilters((currentFilters) => ({ ...currentFilters, status: selectedValue(value) }))} />
      <IGRPCombobox id="area" label={"\u00c1rea"} variant="single" placeholder={"Selecione uma \u00e1rea..."} selectLabel={"Nenhuma op\u00e7\u00e3o encontrada"} showSearch={true} showIcon={false} options={dropdownOptions.areas} value={draftFilters.areaId} onChange={(value) => setDraftFilters((currentFilters) => ({ ...currentFilters, areaId: selectedValue(value), subareaId: '', processType: '' }))} />
      <IGRPCombobox id="subarea" label={"Sub-\u00e1rea"} variant="single" placeholder={"Selecione uma sub-\u00e1rea..."} selectLabel={"Nenhuma op\u00e7\u00e3o encontrada"} showSearch={true} showIcon={false} options={dropdownOptions.subareas} value={draftFilters.subareaId} disabled={!draftFilters.areaId} onChange={(value) => setDraftFilters((currentFilters) => ({ ...currentFilters, subareaId: selectedValue(value), processType: '' }))} />
      <IGRPCombobox id="processType" label="Tipo de processo" variant="single" placeholder="Selecione um tipo de processo..." selectLabel={"Nenhuma op\u00e7\u00e3o encontrada"} showSearch={true} showIcon={false} options={dropdownOptions.processTypes} value={draftFilters.processType} disabled={!draftFilters.areaId} onChange={(value) => setDraftFilters((currentFilters) => ({ ...currentFilters, processType: selectedValue(value) }))} />
      <div className="space-y-2">
        <label className="text-sm font-medium">{"Per\u00edodo"}</label>
        <IRNDatePicker mode="range" value={toPickerDate(draftFilters.dateFrom)} endValue={toPickerDate(draftFilters.dateTo)} onChange={() => { }} onRangeChange={(startDate, endDate) => setDraftFilters((currentFilters) => ({ ...currentFilters, dateFrom: fromPickerDate(startDate), dateTo: fromPickerDate(endDate) }))} placeholder="Selecione a data ou o intervalo" align="center" triggerClassName="w-full justify-between font-normal" className="w-full [&>[role=dialog]]:!fixed [&>[role=dialog]]:!inset-auto [&>[role=dialog]]:!top-4 [&>[role=dialog]]:!left-1/2 [&>[role=dialog]]:!-translate-x-1/2 [&>[role=dialog]]:!mt-0 [&>[role=dialog]]:!max-h-[calc(100dvh-2rem)] [&>[role=dialog]]:!w-[min(362px,calc(100vw-2rem))] [&>[role=dialog]]:overflow-y-auto" />
      </div>
      <div className="md:col-span-2">
        <FilterData value={draftFilters.variables} onChange={(variables) => setDraftFilters((currentFilters) => ({ ...currentFilters, variables }))} />
      </div>
    </div>
  </FiltersSection>
  <AppliedFiltersSection filters={appliedFilters} />
{ !loading && (<IGRPDataTable<Table1, Table1>
  id={ `table1` }
  showFilter={ true }
  showPagination={ true }
  paginationClassName={ `px-3 pb-3` }
  className={ cn() }
  columns={
    [
        {
          header: ({ column }) => (<IGRPDataTableHeaderSortToggle column={column} title={ `Processo` } />)
,accessorKey: 'process',
          cell: ({ row }) => {
          return row.getValue("process")
          },
          filterFn: IGRPDataTableFacetedFilterFn
        },
        {
          header: ({ column }) => (<IGRPDataTableHeaderSortToggle column={column} title={ `Tarefa` } />)
,accessorKey: 'currentStep',
          cell: ({ row }) => {
          return row.getValue("currentStep")
          },
          filterFn: IGRPDataTableFacetedFilterFn
        },
        {
          header: ({ column }) => (<IGRPDataTableHeaderSortToggle column={column} title={ `Utilizador` } />)
,accessorKey: 'assignedBy',
          cell: ({ row }) => {
          return row.getValue("assignedBy")
          },
          filterFn: IGRPDataTableFacetedFilterFn
        },
        {
          header: ({ column }) => (<IGRPDataTableHeaderSortToggle column={column} title={ `Data Início` } />)
,accessorKey: 'startedAt',
          cell: ({ row }) => {
          return row.getValue("startedAt")
          },
          filterFn: IGRPDataTableFacetedFilterFn
        },
        {
          header: ({ column }) => (<IGRPDataTableHeaderSortToggle column={column} title={ `Data Fim` } />)
,accessorKey: 'endedAt',
          cell: ({ row }) => {
          return row.getValue("endedAt")
          },
          filterFn: IGRPDataTableFacetedFilterFn
        },
        {
          header: 'Duração'
,accessorKey: 'duration',
          cell: ({ row }) => {
          return row.getValue("duration")
          },
          filterFn: IGRPDataTableFacetedFilterFn
        },
        {
          header: ({ column }) => (<IGRPDataTableHeaderSortToggle column={column} title={ `Estado` } />)
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
          header: 'Prioridade'
,accessorKey: 'priority',
          cell: ({ row }) => {
          return row.getValue("priority")
          },
          filterFn: IGRPDataTableFacetedFilterFn
        },
        {
          header: ({ column }) => (<IGRPDataTableHeaderSortToggle column={column} title={ `Atualizado por` } />)
,accessorKey: 'updatedBy',
          cell: ({ row }) => {
          return row.getValue("updatedBy")
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
  labelTrigger={ `Detalhes da Tarefa` }
  href={ `/task-management/${row.original.taskId}` }
  variant={ `ghost` }
  icon={ `ClipboardList` }
  className={ cn() }
  action={ () => {} }
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
  
  data={ tableData }
/>)}
<LoadingPage  isLoading={ loading }   ></LoadingPage>
<CommonUserTaskModalForm  modalTitle={ `Atribuir Tarefa` } userRequired={ true } showPriority={ true } open={ assignModalState.isOpen } modalSubTitle={ modalSubtitle }  setOpen={ (open) => open? {} : handleCloseAssignModal() }
onSave={ handleAssignTaskSave } ></CommonUserTaskModalForm></div>
  );
}
