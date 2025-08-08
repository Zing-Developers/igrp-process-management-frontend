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
	IGRPDataTable,
	IGRPDataTableCellBadge,
	IGRPDataTableRowAction,
	IGRPDataTableButtonLink 
} from "@igrp/igrp-framework-react-design-system";
import {useProcessInstances} from '@/app/(myapp)/processinstances/hooks/use-process-instances'


export default function PageProcessinstancesComponent() {


  
  type Table1 = {
    process: string;
    createBy: string;
    currentStep: string;
    waintingDays: string;
    status: string;
}

  const [contentTableprocesses, setContentTableprocesses] = useState<Table1[]>([]);
  
  
const { igrpToast } = useIGRPToast()

//-------------------reserved area start----------------------------

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
    const transformedData = tableData.map((row, index) => ({
      process: row.processInfo,
      createBy: row.createBy,
      currentStep: row.currentStep,
      waintingDays: row.daysWaiting,
      status: row.status,
    }));

    setContentTableprocesses(transformedData);
  }, [tableData]);

  // Handle filter application with process instance filters
  const handleApplyFilters = (filters?: any) => {
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
<div className={ cn('page','space-y-6',)}    >
	<IGRPPageHeader
  name={ `pageHeader1` }
  title={ `Processos` }
  description={ `Visualize processos em curso por área e subárea` }
  iconBackButton={ `ArrowLeft` }
  showBackButton={ true }
  urlBackButton={ `/dashboard` }
  variant={ `h3` }
  className={ cn() }
  
>
  <div className="flex items-center gap-2">
</div>
</IGRPPageHeader>

<div className={ cn(' border rounded-sm',)}    >
	<TaskProcessFilter   onSearch={ handleSearchSubmit }
onApplyFilters={ handleApplyFilters }
onResetFilters={ handleResetFilters } ></TaskProcessFilter>
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
,accessorKey: 'process',
          cell: ({ row }) => {
          return row.getValue("process")
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
          header: 'Etapa Atual'
,accessorKey: 'currentStep',
          cell: ({ row }) => {
          return row.getValue("currentStep")
          },
          filterFn: IGRPDataTableFacetedFilterFn
        },
        {
          header: 'Dias em espera'
,accessorKey: 'waintingDays',
          cell: ({ row }) => {
          return row.getValue("waintingDays")
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
          header: 'Actions Column'
,accessorKey: 'tableActionListCell1',
          enableHiding: false,cell: ({ row }) => {
          const rowData = row.original;

return (
<IGRPDataTableRowAction>
  <IGRPDataTableButtonLink
  labelTrigger={ `Processo` }
  href={ `https://www.igrp.cv/` }
  variant={ `default` }
  icon={ `Play` }
  className={ cn() }
  action={ (e) => {} }
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
  
  data={ contentTableprocesses }
/></div></div>
  );
}
