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
import {
  IGRPDataTable,
  IGRPDataTableRowAction,
  IGRPDataTableButtonLink,
  IGRPCombobox,
  IGRPInputText
} from "@igrp/igrp-framework-react-design-system";
import { useRouter } from "next/navigation"
import { urlConfig } from '@/app/(myapp)/utils/url-config'
import { useDashboard } from '@/app/(myapp)/dashboard/hooks/use-dashboard'
import { useProcessInstances } from '@/app/(myapp)/process-instances/hooks/use-process-instances'
import { PageHeader } from '@/app/(myapp)/components/PageHeader';

export default function PageProcessinstancesComponent() {

  type Table1 = {
    processInfo: string;
    businessKey: string;
    startedBy: string;
    version: string;
    progress: string;
    startedAt: string;
    daysWaiting: string;
    status: string;
    priority: string;
    updatedBy: string;
    processInstanceId: string;
  }

  const [statstatsCard1Value, setStatstatsCard1Value] = useState<string | number>(0);
  const { igrpToast } = useIGRPToast()

  async function goToProcessRuntime(row: any): Promise<void | undefined> {

    const taskUrl = await urlConfig.buildTaskExecutionUrl(
      row.procReleaseKey,
      row.processInstanceId,
      row.taskKey,
      row.taskId,
      row.applicationBase
    );
    router.push(taskUrl as any);

  }

  async function consultarProcess(row: any): Promise<void> {

    // Navigate to task execution page using centralized URL config
    const taskUrl = await urlConfig.buildProcessInstanceUrl(
      row.processInstanceId,
      row.applicationBase,
      row.procReleaseKey
    );
    router.push(taskUrl as any);

  }

  //-------------------reserved area start----------------------------
  const { stats, loading: statsLoading } = useDashboard();
  const router = useRouter()
  const {
    tableData,
    loading,
    error,
    handleSearch,
    updateFilters,
    applyFilters,
    resetFilters,
    filters
  } = useProcessInstances();
  const [draftFilters, setDraftFilters] = useState(filters);
  const { dropdownOptions } = useDropdownData(draftFilters, true);

  // Update table data when process instances change
  useEffect(() => {
    if (stats && !statsLoading) {
      setStatstatsCard1Value(stats.processInstances.totalInstances);
    }
  }, [stats]);

  useEffect(() => {
    setDraftFilters(filters);
  }, [filters]);

  const handleApplyFilters = () => {
    updateFilters(draftFilters);
    applyFilters();
  };

  // Handle filter reset
  const handleResetFilters = () => {
    resetFilters();
    setDraftFilters((currentFilters) => ({
      ...currentFilters,
      areaId: '', subareaId: '', processType: '', processNumber: '', status: '',
      dateFrom: null, dateTo: null, organic: '', user: '', variables: [],
    }));
  };

  // Handle search
  const handleSearchSubmit = (searchTerm: string) => {
    handleSearch(searchTerm);
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

  const optionLabel = (options: { label: string; value: string }[], value: string) =>
    options.find((option) => option.value === value)?.label ?? value;

  const appliedFilters: AppliedFilter[] = [
    filters.areaId && { key: 'areaId', label: `\u00c1rea: ${optionLabel(dropdownOptions.areas, filters.areaId)}`, onRemove: () => updateFilters({ areaId: '', subareaId: '', processType: '' }) },
    filters.subareaId && { key: 'subareaId', label: `Sub-\u00e1rea: ${optionLabel(dropdownOptions.subareas, filters.subareaId)}`, onRemove: () => updateFilters({ subareaId: '', processType: '' }) },
    filters.processType && { key: 'processType', label: `Tipo de processo: ${optionLabel(dropdownOptions.processTypes, filters.processType)}`, onRemove: () => updateFilters({ processType: '' }) },
    filters.processNumber && { key: 'processNumber', label: `N\u00famero do processo: ${filters.processNumber}`, onRemove: () => updateFilters({ processNumber: '' }) },
    filters.status && { key: 'status', label: `Estado: ${optionLabel(dropdownOptions.statuses, filters.status)}`, onRemove: () => updateFilters({ status: '' }) },
    (filters.dateFrom || filters.dateTo) && { key: 'period', label: `Per\u00edodo: ${filters.dateFrom ?? ''}${filters.dateTo ? ` a ${filters.dateTo}` : ''}`, onRemove: () => updateFilters({ dateFrom: null, dateTo: null }) },
    ...filters.variables.filter((filter) => filter.value !== '').map((filter) => ({
      key: `variable-${filter.id}`,
      label: `${filter.name}: ${filter.value}`,
      onRemove: () => {
        const nextVariables = filters.variables.filter((item) => item.id !== filter.id);
        setDraftFilters((currentFilters) => ({ ...currentFilters, variables: nextVariables }));
        updateFilters({ variables: nextVariables });
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

  //-------------------reserved area end------------------------------


  return (
    <div className={cn('page', 'space-y-6',)}    >
      {/* Legacy header, cards, and filter UI retained for generated-page traceability.
          The replacement below uses the shared filter interaction pattern. */}
      {/*
      <IGRPPageHeader
        id={`pageHeader1`}
        title={`Histórico de Processo`}
        description={`Consultar e auditar instâncias históricas de processos`}
        iconBackButton={`ArrowLeft`}
        urlBackButton={`/dashboard`}
        variant={`h3`}
        className={cn()}

      >
        <div className="flex items-center gap-2">
        </div>
      </IGRPPageHeader>

      <div className={cn('grid', 'md:grid-cols-2 ', 'lg:grid-cols-4 ', ' gap-4',)}    >
        <IGRPStatsCard
          id={`statsCard1`}
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
          className={cn('col-span-1',)}
          onClick={() => { }}
          value={statstatsCard2Value}
        >
        </IGRPStatsCard>
        <IGRPStatsCard
          id={`statsCard4`}
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
        </IGRPStatsCard></div>
      <div className={cn(' border rounded-sm',)}    >
        <TaskProcessFilter isProcess={true} onSearch={handleSearchSubmit}
          onApplyFilters={handleApplyFilters}
          onResetFilters={handleResetFilters}
          onFiltersChange={handleApplyFilters} ></TaskProcessFilter></div>
      <FilterActives filters={filters} onFiltersChange={handleApplyFilters} ></FilterActives>
      */}
      <PageHeader
        name={"Hist\u00f3rico de Processo"}
        description={"Consultar e auditar inst\u00e2ncias hist\u00f3ricas de processos"}
        badgeCount={parseInt(`${statstatsCard1Value}`)}
      />
      <FiltersSection
        hasAppliedFilters={appliedFilters.length > 0}
        onApply={handleApplyFilters}
        onClear={handleResetFilters}
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <IGRPInputText
            id="processNumber"
            label={"N\u00famero do processo"}
            placeholder="Ex: CV-24509202511"
            value={draftFilters.processNumber}
            onChange={(event) => setDraftFilters((currentFilters) => ({ ...currentFilters, processNumber: event.target.value }))}
          />
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
      {!loading && (<IGRPDataTable<Table1, Table1>
        id={`processes`}
        showFilter={true}
        showPagination={true}
        paginationClassName={`px-3 pb-3`}
        className={cn('', 'border-0 border-solid border-[#000000]',)}
        columns={
          [
            {
              header: ({ column }) => (<IGRPDataTableHeaderSortToggle column={column} title={`Processo`} />)
              , accessorKey: 'processInfo',
              cell: ({ row }) => {
                return row.getValue("processInfo")
              },
              filterFn: IGRPDataTableFacetedFilterFn
            },
            {
              header: ({ column }) => (<IGRPDataTableHeaderSortToggle column={column} title={`Business Key`} />)
              , accessorKey: 'businessKey',
              cell: ({ row }) => {
                return row.getValue("businessKey")
              },
              filterFn: IGRPDataTableFacetedFilterFn
            },
            {
              header: ({ column }) => (<IGRPDataTableHeaderSortToggle column={column} title={`Iniciado por`} />)
              , accessorKey: 'startedBy',
              cell: ({ row }) => {
                return row.getValue("startedBy")
              },
              filterFn: IGRPDataTableFacetedFilterFn
            },
            {
              header: ({ column }) => (<IGRPDataTableHeaderSortToggle column={column} title={`Ver.`} />)
              , accessorKey: 'version',
              cell: ({ row }) => {
                return row.getValue("version")
              },
              filterFn: IGRPDataTableFacetedFilterFn
            },
            {
              header: 'Progresso'
              , accessorKey: 'progress',
              cell: ({ row }) => {
                return row.getValue("progress")
              },
              filterFn: IGRPDataTableFacetedFilterFn
            },
            {
              header: ({ column }) => (<IGRPDataTableHeaderSortToggle column={column} title={`Iniciado`} />)
              , accessorKey: 'startedAt',
              cell: ({ row }) => {
                return row.getValue("startedAt")
              },
              filterFn: IGRPDataTableFacetedFilterFn
            },
            {
              header: ({ column }) => (<IGRPDataTableHeaderSortToggle column={column} title={`Duraçāo`} />)
              , accessorKey: 'daysWaiting',
              cell: ({ row }) => {
                return row.getValue("daysWaiting")
              },
              filterFn: IGRPDataTableFacetedFilterFn
            },
            {
              header: ({ column }) => (<IGRPDataTableHeaderSortToggle column={column} title={`Estado`} />)
              , accessorKey: 'status',
              cell: ({ row }) => {
                return row.getValue("status")
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
              header: ({ column }) => (<IGRPDataTableHeaderSortToggle column={column} title={`Atualizado por`} />)
              , accessorKey: 'updatedBy',
              cell: ({ row }) => {
                return row.getValue("updatedBy")
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
                      labelTrigger={`Detalhes do Processo`}
                      href={`/process-instances/${row.original.processInstanceId}`}
                      variant={`ghost`}
                      icon={`Info`}
                      className={cn()}
                      action={() => { goToProcessRuntime(rowData) }}
                    >
                    </IGRPDataTableButtonLink>
                    <IGRPDataTableButtonLink
                      labelTrigger={`Consuta Processo`}
                      variant={`ghost`}
                      icon={`FileSpreadsheet`}
                      className={cn()}
                      action={() => { consultarProcess(rowData); }}
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
      <LoadingPage isLoading={loading}   ></LoadingPage></div>
  );
}
