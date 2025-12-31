import { useMemo, useEffect } from "react";
import { useFilterData } from "./use-filter-data";
import {
  DateRange,
  IGRPOptionsProps,
} from "@igrp/igrp-framework-react-design-system";
import { VariableFilter } from "../../filter-data";
import { format } from "date-fns";

export function useProcessTasksFilter(
  setSelectAreaOptions: (options: IGRPOptionsProps[]) => void,
  setSelectSubareaOptions: (options: IGRPOptionsProps[]) => void,
  setSelectProcesstypeOptions: (options: IGRPOptionsProps[]) => void,
  setSelectStatusOptions: (options: IGRPOptionsProps[]) => void,
  setSelectOrganicOptions: (options: IGRPOptionsProps[]) => void,
  setSelectUserOptions: (options: IGRPOptionsProps[]) => void,
) {
  const { filters, dropdownOptions, updateFilters } = useFilterData();

  // Transform dropdown options to IGRP format
  const transformedAreaOptions = useMemo((): IGRPOptionsProps[] => {
    return dropdownOptions.areas.map((option) => ({
      label: option.label,
      value: option.value,
    }));
  }, [dropdownOptions.areas]);

  const transformedSubareaOptions = useMemo((): IGRPOptionsProps[] => {
    return dropdownOptions.subareas.map((option) => ({
      label: option.label,
      value: option.value,
    }));
  }, [dropdownOptions.subareas]);

  const transformedProcesstypeOptions = useMemo((): IGRPOptionsProps[] => {
    return dropdownOptions.processTypes.map((option) => ({
      label: option.label,
      value: option.value,
    }));
  }, [dropdownOptions.processTypes]);

  const transformedStatusOptions = useMemo((): IGRPOptionsProps[] => {
    return dropdownOptions.statuses.map((option) => ({
      label: option.label,
      value: option.value,
    }));
  }, [dropdownOptions.statuses]);

  const transformedOrganicOptions = useMemo((): IGRPOptionsProps[] => {
    return dropdownOptions.organics.map((option) => ({
      label: option.label,
      value: option.value,
    }));
  }, [dropdownOptions.organics]);

  const transformedUserOptions = useMemo((): IGRPOptionsProps[] => {
    return dropdownOptions.users.map((option) => ({
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
  const handleAreaChange = (selected: string | string[]) => {
    const value = Array.isArray(selected) ? selected[0] : selected;
    const newFilters = { areaId: value, subareaId: "", processType: "" };
    updateFilters(newFilters);
    // Don't apply filters immediately for area/subarea changes as they affect dropdown options
  };

  const handleSubareaChange = (selected: string | string[]) => {
    const value = Array.isArray(selected) ? selected[0] : selected;
    const newFilters = { subareaId: value, processType: "" };
    updateFilters(newFilters);
    // Don't apply filters immediately for area/subarea changes as they affect dropdown options
  };

  const handleProcessTypeChange = (selected: string | string[]) => {
    const value = Array.isArray(selected) ? selected[0] : selected;
    const newFilters = { processType: value };
    updateFilters(newFilters);
  };

  const handleStatusChange = (selected: string | string[]) => {
    const value = Array.isArray(selected) ? selected[0] : selected;
    const newFilters = { status: value };
    updateFilters(newFilters);
  };

  const handleOrganicChange = (selected: string | string[]) => {
    const value = Array.isArray(selected) ? selected[0] : selected;
    const newFilters = { organic: value };
    updateFilters(newFilters);
  };

  const handleUserChange = (selected: string | string[]) => {
    const value = Array.isArray(selected) ? selected[0] : selected;
    const newFilters = { user: value };
    updateFilters(newFilters);
  };

  const handleProcessNumberChange = (value: string) => {
    const newFilters = { processNumber: value };
    updateFilters(newFilters);
  };

  const handleDateChange = (date: DateRange | null) => {
    const dateFrom = date?.from ? format(date.from, "dd-MM-yyyy") : null;
    const dateTo = date?.to ? format(date.to, "dd-MM-yyyy") : null;
    updateFilters({ dateFrom, dateTo });
  };

  const handleFiltersChange = (variables: VariableFilter[]) => {
    updateFilters({ variables });
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
    handleFiltersChange,
  };
}
