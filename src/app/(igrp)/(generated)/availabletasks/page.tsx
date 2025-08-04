'use client';

/* THIS FILE WAS GENERATED AUTOMATICALLY BY iGRP STUDIO. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { use, useState, useEffect, useRef } from 'react';
import { cn, useIGRPMenuNavigation, useIGRPToast } from '@igrp/igrp-framework-react-design-system';
import { IGRPOptionsProps } from '@igrp/igrp-framework-react-design-system';
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
  IGRPInputSearch,
  IGRPButton,
  IGRPSeparator,
  IGRPSelect,
  IGRPInputText,
  IGRPDatePicker,
  IGRPDataTable,
  IGRPDataTableCellBadge,
  IGRPDataTableRowAction,
  IGRPDataTableButtonModal,
  IGRPDataTableButtonLink,
} from '@igrp/igrp-framework-react-design-system';

export default function PageAvailabletasksComponent() {
  type Table1 = {
    tableTextCell1: string;
    tableTextCell2: string;
    tableTextCell3: string;
    tableBadgeCell1: string;
    tableTextCell4: string;
  };

  const [selectareaOptions, setSelectareaOptions] = useState<IGRPOptionsProps[]>([]);
  const [selectsubareaOptions, setSelectsubareaOptions] = useState<IGRPOptionsProps[]>([]);
  const [selectprocesstypeOptions, setSelectprocesstypeOptions] = useState<IGRPOptionsProps[]>([]);
  const [selectstatusOptions, setSelectstatusOptions] = useState<IGRPOptionsProps[]>([]);
  const [selectorganicOptions, setSelectorganicOptions] = useState<IGRPOptionsProps[]>([]);
  const [selectuserOptions, setSelectuserOptions] = useState<IGRPOptionsProps[]>([]);
  const [contentTabletable1, setContentTabletable1] = useState<Table1[]>([]);

  const [showFilter, setShowFilter] = useState<boolean>(false);

  const { igrpToast } = useIGRPToast();

  useEffect(() => {
    setContentTabletable1([
      {
        tableTextCell1: 'Processo 1',
        tableTextCell2: 'Usuário 1',
        tableTextCell3: 'Etapa 1',
        tableBadgeCell1: 'success',
        tableTextCell4: '10',
      },
      {
        tableTextCell1: 'Processo 2',
        tableTextCell2: 'Usuário 2',
        tableTextCell3: 'Etapa 2',
        tableBadgeCell1: 'info',
        tableTextCell4: '20',
      },
    ]);
  }, []);

  return (
    <div className={cn('page', 'space-y-6')}>
      <IGRPPageHeader
        name={`pageHeader1`}
        title={`Tarefas Disponíveis`}
        description={`Visualize e atribua tarefas disponíveis para você`}
        iconBackButton={`Search`}
        variant={`h3`}
        className={cn()}
      >
        <div className="flex items-center gap-2"></div>
      </IGRPPageHeader>

      <div className={cn('block', 'border border-solid border-[#000000]', ' border rounded-sm')}>
        <div
          className={cn(
            'flex flex-row flex-wrap items-center justify-between gap-2',
            ' px-4 pt-2 space-y-3',
          )}
        >
          <div className={cn('block', ' flex-1 min-w-[240px] ')}>
            <IGRPInputSearch
              name={`inputSearch1`}
              label={undefined}
              showStartIcon={true}
              startIcon={`Search`}
              submitIcon={`ArrowRight`}
              required={false}
              submitButtonLabel={`Pesquisar`}
              className={cn('py-1')}
              setValueChange={(value) => ''}
            ></IGRPInputSearch>
          </div>
          <div className={cn('flex', 'flex flex-row flex-wrap items-stretch justify-end gap-2')}>
            <IGRPButton
              name={`button1`}
              variant={`outline`}
              size={`default`}
              showIcon={true}
              iconName={`Settings2`}
              className={cn()}
              onClick={() => {
                setShowFilter(!showFilter);
              }}
            >
              Filtros
            </IGRPButton>
          </div>
        </div>
        {showFilter && (
          <IGRPSeparator
            name={`separator1`}
            orientation={`horizontal`}
            className={cn('my-3')}
          ></IGRPSeparator>
        )}
        {showFilter && (
          <div
            className={cn(
              'grid',
              'grid-cols-1 ',
              'md:grid-cols-2 ',
              'lg:grid-cols-4 ',
              ' gap-4 px-4 pt-2 space-y-3',
            )}
          >
            <IGRPSelect
              name={`area`}
              label={`Área`}
              placeholder={`Select an option...`}
              gridSize={`full`}
              className={cn('col-span-1')}
              onValueChange={() => {}}
              options={selectareaOptions}
            ></IGRPSelect>
            <IGRPSelect
              name={`subarea`}
              label={`Sub-Área`}
              placeholder={`Select an option...`}
              gridSize={`full`}
              className={cn('col-span-1')}
              onValueChange={() => {}}
              options={selectsubareaOptions}
            ></IGRPSelect>
            <IGRPSelect
              name={`processtype`}
              label={`Tipo Processo`}
              placeholder={`Select an option...`}
              gridSize={`full`}
              className={cn('col-span-1')}
              onValueChange={() => {}}
              options={selectprocesstypeOptions}
            ></IGRPSelect>
            <IGRPInputText
              name={`processnumber`}
              label={`Número do processo`}
              showIcon={false}
              required={false}
              className={cn('col-span-1')}
            ></IGRPInputText>
            <IGRPSelect
              name={`status`}
              label={`Estado`}
              placeholder={`Select an option...`}
              gridSize={`full`}
              className={cn('col-span-1')}
              onValueChange={() => {}}
              options={selectstatusOptions}
            ></IGRPSelect>
            <IGRPDatePicker
              placeholder={`Please select a date...`}
              name={`date`}
              id={`date`}
              label={`Data`}
              startDate={new Date(`1900-01-01`)}
              endDate={new Date(`2099-12-31`)}
              gridSize={`full`}
              dateFormat={`dd/MM/yyyy`}
              today={new Date(`2025-01-01`)}
              defaultMonth={new Date(`2025-01-01`)}
              startMonth={new Date(`2025-01-01`)}
              month={new Date(`2025-01-01`)}
              endMonth={new Date(`2025-12-31`)}
              numberOfMonths={1}
              captionLayout={`label`}
              className={cn('col-span-1')}
            />
            <IGRPSelect
              name={`organic`}
              label={`Orgânica`}
              placeholder={`Select an option...`}
              gridSize={`full`}
              className={cn('col-span-1')}
              onValueChange={() => {}}
              options={selectorganicOptions}
            ></IGRPSelect>
            <IGRPSelect
              name={`user`}
              label={`Utilizador`}
              placeholder={`Select an option...`}
              gridSize={`full`}
              className={cn('col-span-1')}
              onValueChange={() => {}}
              options={selectuserOptions}
            ></IGRPSelect>
          </div>
        )}
        <IGRPDataTable<Table1, Table1>
          showFilter={true}
          showPagination={true}
          tableClassName={`rounded-none`}
          paginationClassName={`px-3 pb-3`}
          className={cn('')}
          columns={[
            {
              header: 'Processo',
              accessorKey: 'tableTextCell1',
              cell: ({ row }) => {
                return row.getValue('tableTextCell1');
              },
              filterFn: IGRPDataTableFacetedFilterFn,
            },
            {
              header: 'Criado por',
              accessorKey: 'tableTextCell2',
              cell: ({ row }) => {
                return row.getValue('tableTextCell2');
              },
              filterFn: IGRPDataTableFacetedFilterFn,
            },
            {
              header: 'Etapa atual',
              accessorKey: 'tableTextCell3',
              cell: ({ row }) => {
                return row.getValue('tableTextCell3');
              },
              filterFn: IGRPDataTableFacetedFilterFn,
            },
            {
              header: 'Estado',
              accessorKey: 'tableBadgeCell1',
              cell: ({ row }) => {
                const rowData = row.original;

                return (
                  <IGRPDataTableCellBadge
                    label={row.original.tableBadgeCell1}
                    variant={`soft`}
                    badgeClassName={``}
                  ></IGRPDataTableCellBadge>
                );
              },
              filterFn: IGRPDataTableFacetedFilterFn,
            },
            {
              header: 'Dias em espera',
              accessorKey: 'tableTextCell4',
              cell: ({ row }) => {
                return row.getValue('tableTextCell4');
              },
              filterFn: IGRPDataTableFacetedFilterFn,
            },
            {
              header: 'Actions Column',
              accessorKey: 'tableActionListCell1',
              enableHiding: false,
              cell: ({ row }) => {
                const rowData = row.original;

                return (
                  <IGRPDataTableRowAction>
                    <IGRPDataTableButtonModal
                      labelTrigger={`Detalhes`}
                      variant={`default`}
                      icon={`Eye`}
                      variantCancel={`default`}
                      variantConfirm={`default`}
                      labelCancel={`Cancel`}
                      labelConfirm={`Confirm`}
                      showCancel={true}
                      showConfirm={true}
                      modalTitle={`New Modal`}
                      className={cn()}
                      onClickConfirm={(e) => {}}
                    ></IGRPDataTableButtonModal>
                    <IGRPDataTableButtonLink
                      labelTrigger={`Assumir`}
                      href={`/availabletasks`}
                      variant={`default`}
                      icon={`UserRoundPlus`}
                      className={cn()}
                      action={(e) => {}}
                    ></IGRPDataTableButtonLink>
                  </IGRPDataTableRowAction>
                );
              },
              filterFn: IGRPDataTableFacetedFilterFn,
            },
          ]}
          clientFilters={[]}
          data={contentTabletable1}
        />
      </div>
    </div>
  );
}
