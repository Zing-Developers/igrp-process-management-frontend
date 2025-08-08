'use server';
import { shouldUseDummyData, logDummyDataFallback } from '../dummy-data/utils';
import { ProcessManagementClient } from '@igrp/platform-process-management-client-ts';
import { PaginatedResponse, ProcessInstance } from '@igrp/platform-process-management-types';

const applicationBase = process.env.IGRP_APPLICATION_BASE || 'igrp-app';
const baseUrl = process.env.PROCESS_MANAGEMENT_CLIENT_BASE_URL || 'http://localhost:8080';

const httpClient = ProcessManagementClient.create({
  baseUrl: baseUrl,
  timeout: 30000, // optional, defaults to 30000 (30 seconds)
  headers: {
    // optional
    //Authorization: 'Bearer your-token-here',
  },
});

export interface ProcessInstanceFilters {
  procReleaseKey?: string;
  procReleaseId?: string;
  status?: 'CREATED' | 'RUNNING' | 'SUSPENDED' | 'CANCELLED' | 'COMPLETED' | 'TERMINATED';
  applicationBase?: string;
  businessKey?: string;
  startedBy?: string;
}

export interface StatusOption {
  label: string;
  value: string;
}

/**
 * Fetches a paginated list of process instances with optional filters.
 * @param page The page number to fetch.
 * @param size The number of items per page.
 * @param filters Optional filters to apply to the search.
 * @returns A promise that resolves to a paginated response of process instances.
 */
export const getProcessInstances = async (
  page = 0,
  size = 20,
  filters: ProcessInstanceFilters = {},
): Promise<PaginatedResponse<ProcessInstance>> => {
  try {
    const response = await httpClient.processes.getProcessInstances({
      page,
      size,
      applicationBase: applicationBase,
      ...filters,
    });
    return response.data as PaginatedResponse<ProcessInstance>;
  } catch (error) {
    if (shouldUseDummyData()) {
      logDummyDataFallback('getProcessInstances', error);
      // Return dummy data if needed
      return {
        content: [],
        pageNumber: page,
        pageSize: size,
        totalElements: 0,
        totalPages: 0,
        first: true,
        last: true,
      };
    }
    // Re-throw the error if dummy data is not allowed
    throw error;
  }
};

/**
 * Fetches a single process instance by its ID.
 * @param id The ID of the process instance to fetch.
 * @returns A promise that resolves to the process instance, or null if not found.
 */
export const getProcessInstanceById = async (id: string): Promise<ProcessInstance | null> => {
  try {
    return (await httpClient.processes.getProcessInstanceById(id)).data as ProcessInstance;
  } catch (error) {
    if (shouldUseDummyData()) {
      logDummyDataFallback('getProcessInstanceById', error);
      return null;
    }
    // Re-throw the error if dummy data is not allowed
    throw error;
  }
};

/**
 * Gets process instances by process release key.
 * @param procReleaseKey The process release key.
 * @param page The page number to fetch.
 * @param size The number of items per page.
 * @param status Optional status filter.
 * @returns A promise that resolves to a paginated response of process instances.
 */
export const getProcessInstancesByReleaseKey = async (
  procReleaseKey: string,
  page = 0,
  size = 20,
  status?: ProcessInstance['status'],
): Promise<PaginatedResponse<ProcessInstance>> => {
  return getProcessInstances(page, size, { procReleaseKey, status });
};

/**
 * Gets running process instances for a specific application base.
 * @param applicationBase The application base.
 * @param page The page number to fetch.
 * @param size The number of items per page.
 * @returns A promise that resolves to a paginated response of running process instances.
 */
export const getRunningProcessInstances = async (
  page = 0,
  size = 5,
): Promise<PaginatedResponse<ProcessInstance>> => {
  return getProcessInstances(page, size, { applicationBase, status: 'RUNNING' });
};

/**
 * Fetches available status options for process instances.
 * @returns A promise that resolves to an array of status options.
 */
export const getProcessInstancesStatus = async (): Promise<StatusOption[]> => {
  try {
    return (await httpClient.processes.getProcessInstancesStatus()).data as StatusOption[];
  } catch (error) {
    if (shouldUseDummyData()) {
      logDummyDataFallback('getProcessInstancesStatus', error);
      // Return dummy status options
      return [
        { label: 'Ativo', value: 'ACTIVE' },
        { label: 'Pendente', value: 'PENDING' },
        { label: 'Concluído', value: 'COMPLETED' },
        { label: 'Cancelado', value: 'CANCELLED' },
        { label: 'Suspenso', value: 'SUSPENDED' },
        { label: 'Terminado', value: 'TERMINATED' },
        { label: 'Em execução', value: 'RUNNING' },
      ];
    }
    // Re-throw the error if dummy data is not allowed
    throw error;
  }
};
