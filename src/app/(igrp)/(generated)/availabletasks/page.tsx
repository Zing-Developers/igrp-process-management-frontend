'use client'

/* THIS FILE WAS GENERATED AUTOMATICALLY BY iGRP STUDIO. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { use, useState, useEffect, useRef } from 'react';
import { cn, useIGRPMenuNavigation, useIGRPToast } from '@igrp/igrp-framework-react-design-system';
import { IGRPOptionsProps } from "@igrp/igrp-framework-react-design-system";
import { IGRPDataTableFacetedFilterFn , IGRPDataTableDateRangeFilterFn } from "@igrp/igrp-framework-react-design-system";
import { IGRPDataTableHeaderSortToggle, IGRPDataTableHeaderSortDropdown, IGRPDataTableHeaderRowsSelect } from "@igrp/igrp-framework-react-design-system";
import { 
  IGRPPageHeader,
	IGRPInputSearch,
	IGRPButton,
	IGRPSeparator,
	IGRPCombobox,
	IGRPInputText,
	IGRPSelect,
	IGRPDatePicker,
	IGRPDataTable,
	IGRPDataTableCellBadge,
	IGRPDataTableRowAction,
	IGRPDataTableButtonModal,
	IGRPDataTableButtonLink 
} from "@igrp/igrp-framework-react-design-system";
import {useAvailableTasks} from '@/app/(myapp)/availabletasks/hooks/use-available-tasks'


export default function PageAvailabletasksComponent() {


  
  type Table1 = {
    processInfo: string;
    createBy: string;
    taskName: string;
    status: string;
    daysWaiting: string;
}

  const [selectAreaOptions, setSelectAreaOptions] = useState<IGRPOptionsProps[]>([]);
  const [selectSubareaOptions, setSelectSubareaOptions] = useState<IGRPOptionsProps[]>([]);
  const [selectProcesstypeOptions, setSelectProcesstypeOptions] = useState<IGRPOptionsProps[]>([]);
  const [selectStatusOptions, setSelectStatusOptions] = useState<IGRPOptionsProps[]>([]);
  const [selectOrganicOptions, setSelectOrganicOptions] = useState<IGRPOptionsProps[]>([]);
  const [selectUserOptions, setSelectUserOptions] = useState<IGRPOptionsProps[]>([]);
  const [contentTabletasks, setContentTabletasks] = useState<Table1[]>([]);
  
  
const [showFilter, setShowFilter] = useState<boolean>(false);

const { igrpToast } = useIGRPToast()

//------------------------------------Reserved Area-------------------------
  // Integration with useAvailableTasks hook
  const [searchTerm, setSearchTerm] = useState<string>('');
  const {
    // Data
    tableData,
    loading,
    error,
    totalElements,
    totalPages,
    currentPage,

    // Dropdown options
    selectAreaOptions: hookAreaOptions,
    selectSubareaOptions: hookSubareaOptions,
    selectProcesstypeOptions: hookProcesstypeOptions,
    selectStatusOptions: hookStatusOptions,
    selectOrganicOptions: hookOrganicOptions,
    selectUserOptions: hookUserOptions,

    // Filter values
    filters,

    // Actions
    handleAreaChange,
    handleSubareaChange,
    handleProcessTypeChange,
    handleStatusChange,
    handleOrganicChange,
    handleUserChange,
    handleProcessNumberChange,
    handleDateChange,
    handleSearch,
    handlePageChange,
    applyFilters,
    resetFilters,
    getStatusVariant,
  } = useAvailableTasks();

  // Update dropdown options from hook
  useEffect(() => {
    setSelectAreaOptions(hookAreaOptions);
  }, [hookAreaOptions]);

  useEffect(() => {
    setSelectSubareaOptions(hookSubareaOptions);
  }, [hookSubareaOptions]);

  useEffect(() => {
    setSelectProcesstypeOptions(hookProcesstypeOptions);
  }, [hookProcesstypeOptions]);

  useEffect(() => {
    setSelectStatusOptions(hookStatusOptions);
  }, [hookStatusOptions]);

  useEffect(() => {
    setSelectOrganicOptions(hookOrganicOptions);
  }, [hookOrganicOptions]);

  useEffect(() => {
    setSelectUserOptions(hookUserOptions);
  }, [hookUserOptions]);

  // Update table data when tableData changes
  useEffect(() => {
    const transformedData = tableData.map((task) => ({
      processInfo: task.processInfo,
      createBy: task.createBy,
      taskName: task.taskName,
      status: task.status,
      daysWaiting: task.daysWaiting,
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

  // Handle search
  const handleSearchSubmit = () => {
    handleSearch(searchTerm);
  };

  // Handle filter application
  const handleApplyFilters = () => {
    applyFilters();
  };

  // Handle filter reset
  const handleResetFilters = () => {
    resetFilters();
    setSearchTerm('');
  };

  //------------------------------------Reserved Area-------------------------


  return (
<div className={ cn('page','space-y-6',)}    >
	<IGRPPageHeader
  name={ `pageHeader1` }
  title={ `Tarefas Disponíveis` }
  description={ `Visualize e atribua tarefas disponíveis para você` }
  iconBackButton={ `Search` }
  variant={ `h3` }
  className={ cn() }
  
>
  <div className="flex items-center gap-2">
</div>
</IGRPPageHeader>

<div className={ cn(' border rounded-sm',)}    >
	<div className={ cn('flex flex-row flex-wrap items-center justify-between gap-2',' px-4 pt-2 space-y-3',)}    >
	<div className={ cn('block',' flex-1 min-w-[240px] ',)}    >
	<IGRPInputSearch
  name={ `inputSearch1` }
  label={ undefined }
showStartIcon={ true }
startIcon={ `Search` }
submitIcon={ `ArrowRight` }
required={ false }



submitButtonLabel={ `Pesquisar` }
  className={ cn('py-1',) }
  setValueChange={ (value) => setSearchTerm(value) }
onSearch={ handleSearchSubmit }
  value={ searchTerm }
>
</IGRPInputSearch></div>
<div className={ cn('flex','block',)}    >
	<IGRPButton
  name={ `button1` }
  
variant={ `outline` }
size={ `default` }
showIcon={ true }
iconName={ `Settings2` }

  className={ cn() }
  onClick={ () => {setShowFilter(!showFilter)
} }
  
>
  Filtros
</IGRPButton></div></div>
{ showFilter && (<IGRPSeparator
  name={ `separator1` }
  orientation={ `horizontal` }


  className={ cn('my-3',) }
  
  
>
</IGRPSeparator>)}
{ showFilter && (<div className={ cn('grid','grid-cols-1 ','md:grid-cols-2 ','lg:grid-cols-4 ',' gap-4 px-4 pt-2 space-y-3',)}    >
	<IGRPCombobox
  name={ `Area` }
  label={ `Área` }
variant={ `single` }
placeholder={ `Selecione uma área...` }
selectLabel={ `No option found` }
showSearch={ true }
showIcon={ false }
iconName={ `CornerDownRight` }



  className={ cn('col-span-1',) }
  onChange={ () => handleAreaChange }
  options={ selectAreaOptions }
value={ filters.areaId }
>
</IGRPCombobox>
<IGRPCombobox
  name={ `Subarea` }
  label={ `Sub-área` }
variant={ `single` }
placeholder={ `Selecione uma sub-área...` }
selectLabel={ `No option found` }
showSearch={ true }
showIcon={ false }
iconName={ `CornerDownRight` }



  className={ cn('col-span-1',) }
  onChange={ () => handleSubareaChange }
  options={ selectSubareaOptions }
value={ filters.subareaId }
disabled={ !filters.areaId }
>
</IGRPCombobox>
<IGRPCombobox
  name={ `Processtype` }
  label={ `Tipo Processo` }
variant={ `single` }
placeholder={ `Selecione um tipo...` }
selectLabel={ `No option found` }
showSearch={ true }
showIcon={ false }
iconName={ `CornerDownRight` }



  className={ cn('col-span-1',) }
  onChange={ () => handleProcessTypeChange }
  options={ selectProcesstypeOptions }
value={ filters.processType }
>
</IGRPCombobox>
<IGRPInputText
  name={ `Processnumber` }
  label={ `Número do processo` }
showIcon={ false }
required={ false }


  className={ cn('col-span-1',) }
  onChange={ (e) => handleProcessNumberChange(e.target.value) }
  value={ filters.processNumber }
>
</IGRPInputText>
<IGRPSelect
  name={ `Status` }
  label={ `Estado` }
placeholder={ `Selecione um estado...` }
gridSize={ `full` }



  className={ cn('col-span-1',) }
  onValueChange={ handleStatusChange }
  options={ selectStatusOptions }
value={ filters.status }
>
</IGRPSelect>
<IGRPDatePicker
  placeholder={ `Please select a date...` }
  name={ `ProcessDate` }
  id={ `ProcessDate` }
  label={ `Data` }
  startDate={ new Date(`1900-01-01`) }
  endDate={ new Date(`2099-12-31`) }
  gridSize={ `full` }
  dateFormat={ `dd/MM/yyyy` }
  today={ new Date(`2025-01-01`) }
  defaultMonth={ new Date(`2025-01-01`) }
  startMonth={ new Date(`2025-01-01`) }
  month={ new Date(`2025-01-01`) }
  endMonth={ new Date(`2025-12-31`) }
  numberOfMonths={ 1 }
  captionLayout={ `label` }
  className={ cn('col-span-1',) }
  
/>
<IGRPSelect
  name={ `Organic` }
  label={ `Orgânica` }
placeholder={ `Select an option...` }
gridSize={ `full` }



  className={ cn('col-span-1',) }
  onValueChange={ handleOrganicChange }
  options={ selectOrganicOptions }
value={ filters.organic }
>
</IGRPSelect>
<IGRPSelect
  name={ `User` }
  label={ `Utilizador` }
placeholder={ `Select an option...` }
gridSize={ `full` }



  className={ cn('col-span-1',) }
  onValueChange={ handleUserChange }
  options={ selectUserOptions }
value={ filters.user }
>
</IGRPSelect></div>)}
{ showFilter && (<div className={ cn('flex','justify-end','flex flex-row flex-nowrap items-stretch justify-end gap-2',' px-4 pt-2 space-y-3',)}    >
	<IGRPButton
  name={ `button2` }
  
variant={ `outline` }
size={ `sm` }
showIcon={ true }
iconName={ `ChevronsDown` }

  className={ cn() }
  onClick={ handleApplyFilters }
  
>
  Aplicar Filtros
</IGRPButton>
<IGRPButton
  name={ `button3` }
  
variant={ `secondary` }
size={ `sm` }
showIcon={ true }
iconName={ `CircleX` }

  className={ cn() }
  onClick={ handleResetFilters }
  
>
  Limpar
</IGRPButton></div>)}
<IGRPDataTable<Table1, Table1>
  showFilter={ true }
  showPagination={ true }
  tableClassName={ `rounded-none` }
  paginationClassName={ `px-3 pb-3` }
  className={ cn('',) }
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
          header: 'Actions Column'
,accessorKey: 'tableActionListCell1',
          enableHiding: false,cell: ({ row }) => {
          const rowData = row.original;

return (
<IGRPDataTableRowAction>
  <IGRPDataTableButtonModal
  labelTrigger={ `Detalhes` }
  variant={ `default` }
  icon={ `Eye` }
  variantCancel={ `default` }
  variantConfirm={ `default` }
  labelCancel={ `Cancel` }
  labelConfirm={ `Confirm` }
  showCancel={ true }
  showConfirm={ true }
  modalTitle={ `New Modal` }
  className={ cn() }
  onClickConfirm={ (e) => {} }
>
</IGRPDataTableButtonModal>
  <IGRPDataTableButtonLink
  labelTrigger={ `Assumir` }
  href={ `/availabletasks` }
  variant={ `default` }
  icon={ `UserRoundPlus` }
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
  
  data={ contentTabletasks }
/></div></div>
  );
}
