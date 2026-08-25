'use client'

/* THIS FILE WAS GENERATED AUTOMATICALLY BY iGRP STUDIO. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { use, useState, useEffect, useRef } from 'react';
import { cn, useIGRPMenuNavigation, useIGRPToast } from '@igrp/igrp-framework-react-design-system';
import { AppliedFilter, AppliedFiltersSection, FiltersSection } from '@/app/(myapp)/components/filter-section'
import { FilterData } from '@/app/(myapp)/components/filter-data'
import { useDropdownData } from '@/app/(myapp)/components/processtaksfilter/hooks/use-dropdown-data'
import { IRNDatePicker } from '@irn/irn-backoffice-design-system'
import { IGRPDataTableFacetedFilterFn, IGRPDataTableDateRangeFilterFn } from "@igrp/igrp-framework-react-design-system";
import { IGRPDataTableHeaderSortToggle, IGRPDataTableHeaderSortDropdown, IGRPDataTableHeaderRowsSelect } from "@igrp/igrp-framework-react-design-system";
import { LoadingPage } from '@/app/(myapp)/components/loading-page'
import CommonUserTaskModalForm from '@/components/commonusertaskmodalform'
import {
  IGRPPageHeader,
  IGRPStatsCard,
  IGRPDataTable,
  IGRPDataTableRowAction,
  IGRPDataTableButtonLink,
  IGRPCombobox,
  IGRPInputText
} from "@igrp/igrp-framework-react-design-system";
import { useRouter } from 'next/navigation'
import { urlConfig } from '@/app/(myapp)/utils/url-config'
import { useDashboard } from '@/app/(myapp)/dashboard/hooks/use-dashboard'
import { useMyTasks } from '@/app/(myapp)/my-tasks/hooks/use-my-tasks'
import { PageHeader } from '@/app/(myapp)/components/PageHeader';


export default function PageMytasksComponent() {



  type Table1 = {
    process: string;
    currentStep: string;
    startedAt: string;
    duration: string;
    priority: string;
    taskId: string;
    processName: string;
  }

  const [statstatsCard1Value, setStatstatsCard1Value] = useState<string | number>(0);
  const [statstatsCard2Value, setStatstatsCard2Value] = useState<string | number>(0);
  const [statstatsCard5Value, setStatstatsCard5Value] = useState<string | number>(0);
  const [statstatsCard4Value, setStatstatsCard4Value] = useState<string | number>(0);
  const [statstatsCard3Value, setStatstatsCard3Value] = useState<string | number>(0);


  const { igrpToast } = useIGRPToast()

  async function executeTask(row: any): Promise<void | undefined> {

    // Navigate to task execution page using centralized URL config
    const taskUrl = await urlConfig.buildTaskExecutionUrl(
      row.processKey,
      row.processInstanceId,
      row.taskKey,
      row.taskId,
      row.applicationBase,
    );
    router.push(taskUrl as any);

  }

  //-------------------reserved area start----------------------------
  const router = useRouter();

  const { stats, loading: statsLoading } = useDashboard();
  const {
    tableData,
    loading,
    filters,
    unclaimModalState,
    fetchMyTasks,
    applyFilters,
    resetFilters,
    updateFilters,
    handleUnclaimTask,
    handleOpenUnclaimModal,
    handleCloseUnclaimModal
  } = useMyTasks();
  const [draftFilters, setDraftFilters] = useState(filters);
  const { dropdownOptions } = useDropdownData(draftFilters);

  // Transform data for the table
  useEffect(() => {
    setStatstatsCard1Value(stats.tasks.totalMyTasks);
    setStatstatsCard2Value(stats.tasks.totalTasksAvailable);
    setStatstatsCard5Value(stats.tasks.totalMyTasksSuspended);
    setStatstatsCard4Value(stats.tasks.totalMyTasksCancelled);
    setStatstatsCard3Value(stats.tasks.totalMyTasksCompleted);
  }, [stats]);

  useEffect(() => {
    setDraftFilters(filters);
  }, [filters]);

  const handleResetFilters = () => {
    resetFilters();
    setDraftFilters((currentFilters) => ({
      ...currentFilters,
      areaId: '',
      subareaId: '',
      processType: '',
      processNumber: '',
      status: '',
      dateFrom: null,
      dateTo: null,
      organic: '',
      user: '',
      variables: [],
    }));
  };

  const handleApplyFilters = () => {
    updateFilters(draftFilters);
    applyFilters();
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

  const selectedValue = (value: string | string[]) =>
    Array.isArray(value) ? value[0] : value;

  const appliedFilters: AppliedFilter[] = [
    filters.processNumber && {
      key: 'processNumber',
      label: `Número do processo: ${filters.processNumber}`,
      onRemove: () => updateFilters({ processNumber: '' }),
    },
    filters.status && {
      key: 'status',
      label: `Estado: ${filters.status}`,
      onRemove: () => updateFilters({ status: '' }),
    },
    (filters.dateFrom || filters.dateTo) && {
      key: 'period',
      label: `Período: ${filters.dateFrom ?? ''}${filters.dateTo ? ` a ${filters.dateTo}` : ''}`,
      onRemove: () => updateFilters({ dateFrom: null, dateTo: null }),
    },
    ...filters.variables
      .filter((filter) => filter.value !== '')
      .map((filter) => ({
        key: `variable-${filter.id}`,
        label: `${filter.name}: ${filter.value}`,
        onRemove: () => {
          const nextVariables = filters.variables.filter(
            (item) => item.id !== filter.id,
          );
          setDraftFilters((currentFilters) => ({
            ...currentFilters,
            variables: nextVariables,
          }));
          updateFilters({ variables: nextVariables });
        },
      })),
  ].filter((filter): filter is AppliedFilter => Boolean(filter));
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
  const modalSubtitle = `Libertar a tarefa "${unclaimModalState.selectedTask?.currentStep}" do processo "${unclaimModalState.selectedTask?.processName}"`;

  //-------------------reserved area end------------------------------


  return (
    <div className={cn('page', 'space-y-6',)}    >

      <PageHeader
        name={`Minhas Tarefas`}
        description={`Tarefas atribuídas a você`}
        badgeCount={parseInt(`${statstatsCard1Value}`)}
      ></PageHeader>
      
      {/* HIDDING */}
      {/* 
      <div className={cn('grid', 'md:grid-cols-2 ', 'lg:grid-cols-4 ', 'xl:grid-cols-5 ', ' gap-4',)}    >
        <IGRPStatsCard
          id={`statsCard1`}
          cardBorderPosition={`top`}
          cardBorder={`rounded-lg`}
          cardVariant={`info`}
          iconBackground={`square`}
          title={`Total de tarefas`}
          titleSize={`sm`}
          valueSize={`2xl`}
          showIcon={true}
          iconName={`ListChecks`}
          iconSize={`md`}
          iconVariant={`info`}
          iconPlacement={`end`}
          itemPlacement={`start`}
          showIconBorder={false}
          showIconBackground={true}
          className={cn('col-span-1',)}
          onClick={() => { }}
          value={statstatsCard1Value}
        >
        </IGRPStatsCard>
        <IGRPStatsCard
          id={`statsCard2`}
          cardBorderPosition={`top`}
          cardBorder={`rounded-lg`}
          cardVariant={`warning`}
          iconBackground={`square`}
          title={`Total disponíveis`}
          titleSize={`sm`}
          valueSize={`2xl`}
          showIcon={true}
          iconName={`CircleAlert`}
          iconSize={`md`}
          iconVariant={`warning`}
          iconPlacement={`end`}
          itemPlacement={`start`}
          showIconBackground={true}
          showIconBorder={false}
          className={cn('col-span-1',)}
          onClick={() => { }}
          value={statstatsCard2Value}
        >
        </IGRPStatsCard>
        <IGRPStatsCard
          id={`statsCard5`}
          cardBorderPosition={`top`}
          cardBorder={`rounded-lg`}
          cardVariant={`primary`}
          iconBackground={`square`}
          title={`Total suspensos`}
          titleSize={`sm`}
          valueSize={`2xl`}
          showIcon={true}
          iconName={`Pause`}
          iconSize={`md`}
          iconVariant={`primary`}
          iconPlacement={`end`}
          itemPlacement={`start`}
          showIconBackground={true}
          className={cn('col-span-1',)}
          onClick={() => { }}
          value={statstatsCard5Value}
        >
        </IGRPStatsCard>
        <IGRPStatsCard
          id={`statsCard4`}
          cardBorderPosition={`top`}
          cardBorder={`rounded-lg`}
          cardVariant={`destructive`}
          iconBackground={`square`}
          title={`Total cancelados`}
          titleSize={`sm`}
          valueSize={`2xl`}
          showIcon={true}
          iconName={`CalendarX2`}
          iconSize={`md`}
          iconVariant={`destructive`}
          iconPlacement={`end`}
          itemPlacement={`start`}
          showIconBackground={true}
          className={cn('col-span-1',)}
          onClick={() => { }}
          value={statstatsCard4Value}
        >
        </IGRPStatsCard>
        <IGRPStatsCard
          id={`statsCard3`}
          cardBorderPosition={`top`}
          cardBorder={`rounded-lg`}
          cardVariant={`success`}
          iconBackground={`square`}
          title={`Total finalizados`}
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
          className={cn('col-span-1',)}
          onClick={() => { }}
          value={statstatsCard3Value}
        >
        </IGRPStatsCard></div> */}
      <FiltersSection
        hasAppliedFilters={appliedFilters.length > 0}
        onApply={handleApplyFilters}
        onClear={handleResetFilters}
      >
        <div className={cn('grid grid-cols-1 gap-4 md:grid-cols-2')}>
          <IGRPInputText
            id="processNumber"
            label="Número do processo"
            placeholder="Ex: CV-24509202511"
            value={draftFilters.processNumber}
            onChange={(event) =>
              setDraftFilters((currentFilters) => ({
                ...currentFilters,
                processNumber: event.target.value,
              }))
            }
          />
          <IGRPCombobox
            id="status"
            label="Estado"
            variant="single"
            placeholder="Selecione um estado..."
            selectLabel="Nenhuma opção encontrada"
            showSearch={true}
            showIcon={false}
            options={dropdownOptions.statuses}
            value={draftFilters.status}
            onChange={(value) =>
              setDraftFilters((currentFilters) => ({
                ...currentFilters,
                status: selectedValue(value),
              }))
            }
          />
          <div className="space-y-2">
            <label className="text-sm font-medium">Período</label>
            <IRNDatePicker
              mode="range"
              value={toPickerDate(draftFilters.dateFrom)}
              endValue={toPickerDate(draftFilters.dateTo)}
              onChange={() => { }}
              onRangeChange={(startDate, endDate) =>
                setDraftFilters((currentFilters) => ({
                  ...currentFilters,
                  dateFrom: fromPickerDate(startDate),
                  dateTo: fromPickerDate(endDate),
                }))
              }
              placeholder="Selecione a data ou o intervalo"
              align="center"
              triggerClassName="w-full justify-between font-normal"
              className="w-full [&>[role=dialog]]:!fixed [&>[role=dialog]]:!inset-auto [&>[role=dialog]]:!top-4 [&>[role=dialog]]:!left-1/2 [&>[role=dialog]]:!-translate-x-1/2 [&>[role=dialog]]:!mt-0 [&>[role=dialog]]:!max-h-[calc(100dvh-2rem)] [&>[role=dialog]]:!w-[min(362px,calc(100vw-2rem))] [&>[role=dialog]]:overflow-y-auto"
            />
          </div>
          <div className="md:col-span-2">
            <FilterData
              value={draftFilters.variables}
              onChange={(variables) =>
                setDraftFilters((currentFilters) => ({
                  ...currentFilters,
                  variables,
                }))
              }
            />
          </div>
        </div>
      </FiltersSection>
      <AppliedFiltersSection filters={appliedFilters} />
      {!loading && (<IGRPDataTable<Table1, Table1>
        id={`table1`}
        showFilter={true}
        showPagination={true}
        paginationClassName={`px-3 pb-3`}
        className={cn()}
        columns={
          [
            {
              header: ({ column }) => (<IGRPDataTableHeaderSortToggle column={column} title={`Processo`} />)
              , accessorKey: 'process',
              cell: ({ row }) => {
                return row.getValue("process")
              },
              filterFn: IGRPDataTableFacetedFilterFn
            },
            {
              header: ({ column }) => (<IGRPDataTableHeaderSortToggle column={column} title={`Tarefa`} />)
              , accessorKey: 'currentStep',
              cell: ({ row }) => {
                return row.getValue("currentStep")
              },
              filterFn: IGRPDataTableFacetedFilterFn
            },
            {
              header: ({ column }) => (<IGRPDataTableHeaderSortToggle column={column} title={`Data Início`} />)
              , accessorKey: 'startedAt',
              cell: ({ row }) => {
                return row.getValue("startedAt")
              },
              filterFn: IGRPDataTableFacetedFilterFn
            },
            {
              header: ({ column }) => (<IGRPDataTableHeaderSortToggle column={column} title={`Duraçāo`} />)
              , accessorKey: 'duration',
              cell: ({ row }) => {
                return row.getValue("duration")
              },
              filterFn: IGRPDataTableFacetedFilterFn
            },
            {
              header: 'Prioridade'
              , accessorKey: 'priority',
              cell: ({ row }) => {
                return row.getValue("priority")
              },
              filterFn: IGRPDataTableFacetedFilterFn
            },
            {
              id: 'tableActionListCell1',
              enableHiding: false, cell: ({ row }) => {
                const rowData = row.original;

                return (
                  <IGRPDataTableRowAction>
                    <IGRPDataTableButtonLink
                      labelTrigger={`Executar Tarefa`}
                      variant={`ghost`}
                      icon={`Play`}
                      className={cn()}
                      action={() => { executeTask(rowData) }}
                    >
                    </IGRPDataTableButtonLink>
                    <IGRPDataTableButtonLink
                      labelTrigger={`Libertar Tarefa`}
                      variant={`ghost`}
                      icon={`UserX`}
                      className={cn()}
                      action={() => { handleOpenUnclaimModal(rowData); }}
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

        data={tableData}
      />)}
      <LoadingPage isLoading={loading}   ></LoadingPage>
      <CommonUserTaskModalForm modalTitle={`Libertar Tarefa`} modalSubTitle={modalSubtitle} open={unclaimModalState.isOpen} setOpen={(open) => (open ? {} : handleCloseUnclaimModal())}
        onSave={handleUnclaimTaskSave} ></CommonUserTaskModalForm></div>
  );
}
