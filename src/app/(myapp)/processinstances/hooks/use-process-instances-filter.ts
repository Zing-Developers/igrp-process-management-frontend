import { useMemo, useEffect } from 'react';
import { useFilterData } from '../../components/processtaksfilter/hooks/use-filter-data';
import { IGRPOptionsProps } from '@igrp/igrp-framework-react-design-system';

export function useProcessInstancesFilter(
  setSelectAreaOptions: (options: IGRPOptionsProps[]) => void,
  setSelectSubareaOptions: (options: IGRPOptionsProps[]) => void,
  setSelectProcesstypeOptions: (options: IGRPOptionsProps[]) => void,
  setSelectStatusOptions: (options: IGRPOptionsProps[]) => void,
  setSelectOrganicOptions: (options: IGRPOptionsProps[]) => void,
  setSelectUserOptions: (options: IGRPOptionsProps[]) => void
) {
  const {
    filters,
    dropdownOptions,
    updateFilters,
  } = useFilterData();

  // Transform dropdown options to IGRP format
  const transformedAreaOptions = useMemo((): IGRPOptionsProps[] => {
    return dropdownOptions.areas.map(option => ({
      label: option.label,
      value: option.value,
    }));
  }, [dropdownOptions.areas]);

  const transformedSubareaOptions = useMemo((): IGRPOptionsProps[] => {
    return dropdownOptions.subareas.map(option => ({
      label: option.label,
      value: option.value,
    }));
  }, [dropdownOptions.subareas]);

  const transformedProcesstypeOptions = useMemo((): IGRPOptionsProps[] => {
    return dropdownOptions.processTypes.map(option => ({
      label: option.label,
      value: option.value,
    }));
  }, [dropdownOptions.processTypes]);

  const transformedStatusOptions = useMemo((): IGRPOptionsProps[] => {
    return dropdownOptions.statuses.map(option => ({
      label: option.label,
      value: option.value,
    }));
  }, [dropdownOptions.statuses]);

  const transformedOrganicOptions = useMemo((): IGRPOptionsProps[] => {
    return dropdownOptions.organics.map(option => ({
      label: option.label,
      value: option.value,
    }));
  }, [dropdownOptions.organics]);

  const transformedUserOptions = useMemo((): IGRPOptionsProps[] => {
    return dropdownOptions.users.map(option => ({
      label: option.label,
      value: option.value,
    }));
  }, [dropdownOptions.users]);

  // Update the IGRPStudio generated state variables when dropdown options change
  useEffect(() => {
    setSelectAreaOptions(transformedAreaOptions);
  }, [transformedAreaOptions, setSelectAreaOptions]);

  useEffect(() => {
    setSelectSubareaOptions(transformedSubareaOptions);
  }, [transformedSubareaOptions, setSelectSubareaOptions]);

  useEffect(() => {
    setSelectProcesstypeOptions(transformedProcesstypeOptions);
  }, [transformedProcesstypeOptions, setSelectProcesstypeOptions]);

  useEffect(() => {
    setSelectStatusOptions(transformedStatusOptions);
  }, [transformedStatusOptions, setSelectStatusOptions]);

  useEffect(() => {
    setSelectOrganicOptions(transformedOrganicOptions);
  }, [transformedOrganicOptions, setSelectOrganicOptions]);

  useEffect(() => {
    setSelectUserOptions(transformedUserOptions);
  }, [transformedUserOptions, setSelectUserOptions]);

  // Handle filter changes
  const handleAreaChange = (value: string) => {
    const newFilters = { areaId: value, subareaId: '', processType: '' };
    updateFilters(newFilters);
  };

  const handleSubareaChange = (value: string) => {
    const newFilters = { subareaId: value, processType: '' };
    updateFilters(newFilters);
  };

  const handleProcessTypeChange = (value: string) => {
    const newFilters = { processType: value };
    updateFilters(newFilters);
  };

  const handleStatusChange = (value: string) => {
    const newFilters = { status: value };
    updateFilters(newFilters);
  };

  const handleOrganicChange = (value: string) => {
    const newFilters = { organic: value };
    updateFilters(newFilters);
  };

  const handleUserChange = (value: string) => {
    const newFilters = { user: value };
    updateFilters(newFilters);
  };

  const handleProcessNumberChange = (value: string) => {
    const newFilters = { processNumber: value };
    updateFilters(newFilters);
  };

  const handleDateChange = (dateFrom: string, dateTo?: string) => {
    const newFilters = { dateFrom, dateTo: dateTo || '' };
    updateFilters(newFilters);
  };

  return {
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
  };
}