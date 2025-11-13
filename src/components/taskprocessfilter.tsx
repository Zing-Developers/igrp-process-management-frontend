'use client';

/* THIS FILE WAS GENERATED AUTOMATICALLY BY iGRP STUDIO. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { use, useState, useEffect, useRef } from 'react';
import { cn, useIGRPMenuNavigation, useIGRPToast } from '@igrp/igrp-framework-react-design-system';
import { IGRPOptionsProps } from '@igrp/igrp-framework-react-design-system';
import {
  IGRPInputSearch,
  IGRPButton,
  IGRPSeparator,
  IGRPCombobox,
  IGRPInputText,
  IGRPDatePicker,
} from '@igrp/igrp-framework-react-design-system';
import { useProcessTasksFilter } from '@/app/(myapp)/components/processtaksfilter/hooks/use-process-tasks-filter';

export default function Taskprocessfilter({
  onSearch,
  onApplyFilters,
  onResetFilters,
}: {
  onSearch: (searchTerm: string) => void;
  onApplyFilters: (filters?: any) => void;
  onResetFilters: () => void;
}) {
  const [selectAreaOptions, setSelectAreaOptions] = useState<IGRPOptionsProps[]>([]);
  const [selectSubareaOptions, setSelectSubareaOptions] = useState<IGRPOptionsProps[]>([]);
  const [selectProcesstypeOptions, setSelectProcesstypeOptions] = useState<IGRPOptionsProps[]>([]);
  const [selectStatusOptions, setSelectStatusOptions] = useState<IGRPOptionsProps[]>([]);
  const [selectOrganicOptions, setSelectOrganicOptions] = useState<IGRPOptionsProps[]>([]);
  const [selectUserOptions, setSelectUserOptions] = useState<IGRPOptionsProps[]>([]);

  const { igrpToast } = useIGRPToast();

  //---------------------Reserved Area begin-----------------------------------
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const {
    filters,
    handleAreaChange,
    handleSubareaChange,
    handleProcessTypeChange,
    handleStatusChange,
    handleOrganicChange,
    handleUserChange,
    handleProcessNumberChange,
    handleDateChange,
  } = useProcessTasksFilter(
    setSelectAreaOptions,
    setSelectSubareaOptions,
    setSelectProcesstypeOptions,
    setSelectStatusOptions,
    setSelectOrganicOptions,
    setSelectUserOptions,
  );

  // Handle search
  const handleSearchSubmit = () => {
    onSearch(searchTerm);
  };

  // Handle filter application
  const handleApplyFilters = () => {
    onApplyFilters(filters);
  };

  // Handle filter reset
  const handleResetFilters = () => {
    onResetFilters();
    setSearchTerm('');
  };

  //---------------------Reserved Area end-----------------------------------

  return (
    <div className={cn('component')}>
      <div
        className={cn('flex flex-row flex-wrap items-center justify-between gap-2', ' px-4 pt-2')}
      >
        <div className={cn(' flex-1 min-w-[240px]')}>
          <IGRPInputSearch
            name={`inputSearch1`}
            label={undefined}
            showStartIcon={true}
            startIcon={`Search`}
            submitIcon={`ArrowRight`}
            required={false}
            submitButtonLabel={`Pesquisar`}
            placeholder={`Pesquise por...`}
            className={cn('py-1')}
            setValueChange={(value) => setSearchTerm(value)}
            onSearch={handleSearchSubmit}
            value={searchTerm}
          ></IGRPInputSearch>
        </div>
        <div className={cn('flex', 'block')}>
          <IGRPButton
            name={`button3`}
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
            ' gap-4 px-4 pt-2',
          )}
        >
          <IGRPCombobox
            name={`Area`}
            label={`Área`}
            variant={`single`}
            placeholder={`Selecione uma área...`}
            selectLabel={`No option found`}
            showSearch={true}
            showIcon={false}
            iconName={`CornerDownRight`}
            className={cn('col-span-1')}
            onChange={(selected) =>
              handleAreaChange(Array.isArray(selected) ? selected[0] : selected)
            }
            options={selectAreaOptions}
            value={filters.areaId}
          ></IGRPCombobox>
          <IGRPCombobox
            name={`Subarea`}
            label={`Sub-área`}
            variant={`single`}
            placeholder={`Select an option...`}
            selectLabel={`No option found`}
            showSearch={true}
            showIcon={false}
            iconName={`CornerDownRight`}
            className={cn('col-span-1')}
            onChange={(selected) =>
              handleSubareaChange(Array.isArray(selected) ? selected[0] : selected)
            }
            options={selectSubareaOptions}
            value={filters.subareaId}
            disabled={!filters.areaId}
          ></IGRPCombobox>
          <IGRPCombobox
            name={`Processtype`}
            label={`Tipo Processo`}
            variant={`single`}
            placeholder={`Select an option...`}
            selectLabel={`No option found`}
            showSearch={true}
            showIcon={false}
            iconName={`CornerDownRight`}
            className={cn('col-span-1')}
            onChange={(selected) =>
              handleProcessTypeChange(Array.isArray(selected) ? selected[0] : selected)
            }
            options={selectProcesstypeOptions}
            value={filters.processType}
            disabled={!filters.areaId && !filters.subareaId}
          ></IGRPCombobox>
          <IGRPInputText
            name={`Processnumber`}
            label={`Número do processo`}
            showIcon={false}
            required={false}
            className={cn('col-span-1')}
            onChange={(e) => handleProcessNumberChange(e.target.value)}
            value={filters.processNumber}
          ></IGRPInputText>
          <IGRPCombobox
            name={`Status`}
            label={`Estado`}
            variant={`single`}
            placeholder={`Selecione um estado...`}
            selectLabel={`No option found`}
            showSearch={true}
            showIcon={false}
            iconName={`CornerDownRight`}
            className={cn('col-span-1')}
            onChange={(selected) =>
              handleStatusChange(Array.isArray(selected) ? selected[0] : selected)
            }
            options={selectStatusOptions}
            value={filters.status}
          ></IGRPCombobox>
          <IGRPDatePicker
            placeholder={`Please select a date...`}
            name={`ProcessDate`}
            id={`ProcessDate`}
            label={`Data`}
            startDate={new Date(`1900-01-01`)}
            endDate={new Date(`2099-12-31`)}
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
          <IGRPCombobox
            name={`Organic`}
            label={`Orgânica`}
            variant={`single`}
            placeholder={`Selecione uma organica...`}
            selectLabel={`No option found`}
            showSearch={true}
            showIcon={false}
            iconName={`CornerDownRight`}
            className={cn('col-span-1')}
            onChange={handleOrganicChange}
            options={selectOrganicOptions}
            value={filters.organic}
          ></IGRPCombobox>
          <IGRPCombobox
            name={`User`}
            label={`Utilizador`}
            variant={`single`}
            placeholder={`Selecione um utilizador...`}
            selectLabel={`No option found`}
            showSearch={true}
            showIcon={false}
            iconName={`CornerDownRight`}
            className={cn('col-span-1')}
            onChange={(selected) =>
              handleUserChange(Array.isArray(selected) ? selected[0] : selected)
            }
            options={selectUserOptions}
            value={filters.user}
          ></IGRPCombobox>
        </div>
      )}
      {showFilter && (
        <IGRPSeparator
          name={`separator2`}
          orientation={`horizontal`}
          className={cn('my-3')}
        ></IGRPSeparator>
      )}
      {showFilter && (
        <div
          className={cn(
            'flex',
            'flex flex-row flex-nowrap items-stretch justify-end gap-2',
            ' px-4 pt-2 space-y-3',
          )}
        >
          <IGRPButton
            name={`button2`}
            variant={`outline`}
            size={`default`}
            showIcon={true}
            iconName={`ListFilter`}
            className={cn()}
            onClick={handleApplyFilters}
          >
            Aplicar Filtros
          </IGRPButton>
          <IGRPButton
            name={`button1`}
            variant={`outline`}
            size={`default`}
            showIcon={true}
            iconName={`Eraser`}
            className={cn()}
            onClick={handleResetFilters}
          >
            Limpar Filtros
          </IGRPButton>
        </div>
      )}
    </div>
  );
}
