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
import { useProcessConfiguration } from '@/app/(myapp)/processconfiguration/hooks/use-process-configuration';
import { useProcessInstances } from '@/app/(myapp)/processinstances/hooks/use-process-instances';
import { useRouter } from 'next/navigation';
import { urlConfig } from '@/app/(myapp)/utils/url-config';
import { getProcessInstanceStatusColor } from '@/app/(myapp)/utils/status-badge';

export default function PageProcessinstancesComponent() {
  type Table1 = {
    processInfo: string;
    createBy: string;
    daysWaiting: string;
    version: string;
    status: string;
    procReleaseKey: string;
    processInstanceId: string;
  };

  const [contentTableprocesses, setContentTableprocesses] = useState<Table1[]>([]);

  const { igrpToast } = useIGRPToast();

  function goToProcessRuntime(row: any): void | undefined {
    console.log(row);
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
  } = useProcessInstances();

  // Update table data when process instances change
  useEffect(() => {
    setContentTableprocesses(tableData);
  }, [tableData]);

  // Handle filter application with process instance filters
  const handleApplyFilters = (filters?: any) => {
    console.log('handleApplyFilters', filters);
    if (filters) {
      console.log('Applying process instance filters:', filters);
      applyFilters(filters);
    } else {
      applyFilters();
    }
  };

  // Handle filter reset
  const handleResetFilters = () => {
    resetFilters();
  };

  // Handle search
  const handleSearchSubmit = (searchTerm: string) => {
    handleSearch(searchTerm);
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
        title={`Processos`}
        description={`Visualize processos em curso por área e subárea`}
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
        className={cn('', 'border-0 border-solid border-[#000000]')}
        columns={[
          {
            header: 'Processo',
            accessorKey: 'processInfo',
            cell: ({ row }) => {
              return row.getValue('processInfo');
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
            header: 'Dias em espera',
            accessorKey: 'daysWaiting',
            cell: ({ row }) => {
              return row.getValue('daysWaiting');
            },
            filterFn: IGRPDataTableFacetedFilterFn,
          },
          {
            header: 'Versāo',
            accessorKey: 'version',
            cell: ({ row }) => {
              const rowData = row.original;

              return (
                <IGRPDataTableCellBadge
                  label={row.original.version}
                  variant={`soft`}
                  badgeClassName={``}
                ></IGRPDataTableCellBadge>
              );
            },
            filterFn: IGRPDataTableFacetedFilterFn,
          },
          {
            header: 'Estado',
            accessorKey: 'status',
            cell: ({ row }) => {
              const rowData = row.original;

              const { iconName, bgClass, textClass, label, className } =
                getProcessInstanceStatusColor(rowData);

              return (
                <IGRPDataTableCellBadge
                  label={label ?? row.original.status}
                  variant={`soft`}
                  badgeClassName={`${bgClass} ${textClass} ${className}`}
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
                          labelTrigger: `Executar Task`,
                          icon: `ArrowRight`,
                          showIcon: true,
                          action: () => {
                            goToProcessRuntime(rowData);
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
        data={contentTableprocesses}
      />
    </div>
  );
}
