import { httpClient } from './http-client';
import { ProcessInstance } from '../../types/process';
import { PaginatedResponse } from '../../types/response';
import { apiConfig } from '../config/api.config';
import { buildUrlWithParams } from '../utils/url-builder';
import { shouldUseDummyData, logDummyDataFallback } from '../dummy-data/utils';

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
  filters: ProcessInstanceFilters = {}
): Promise<PaginatedResponse<ProcessInstance>> => {
  try {
    const params = {
      page,
      size,
      ...filters,
    };
    
    const url = buildUrlWithParams(apiConfig.endpoints.processInstances, params);
    const response = await httpClient.get<PaginatedResponse<ProcessInstance>>(url);
    return response;
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
export const getProcessInstanceById = async (
  id: string
): Promise<ProcessInstance | null> => {
  try {
    return await httpClient.get<ProcessInstance>(`${apiConfig.endpoints.processInstances}/${id}`);
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
 * Terminates a process instance.
 * @param id The ID of the process instance to terminate.
 * @param reason Optional reason for termination.
 * @returns A promise that resolves when the instance is terminated.
 */
export const terminateProcessInstance = async (
  id: string,
  reason?: string
): Promise<void> => {
  try {
    const body = reason ? { reason } : {};
    await httpClient.post(`${apiConfig.endpoints.processInstances}/${id}/terminate`, body);
  } catch (error) {
    if (shouldUseDummyData()) {
      logDummyDataFallback('terminateProcessInstance', error);
      return;
    }
    // Re-throw the error if dummy data is not allowed
    throw error;
  }
};

/**
 * Suspends a process instance.
 * @param id The ID of the process instance to suspend.
 * @returns A promise that resolves when the instance is suspended.
 */
export const suspendProcessInstance = async (id: string): Promise<void> => {
  try {
    await httpClient.post(`${apiConfig.endpoints.processInstances}/${id}/suspend`, {});
  } catch (error) {
    if (shouldUseDummyData()) {
      logDummyDataFallback('suspendProcessInstance', error);
      return;
    }
    // Re-throw the error if dummy data is not allowed
    throw error;
  }
};

/**
 * Resumes a suspended process instance.
 * @param id The ID of the process instance to resume.
 * @returns A promise that resolves when the instance is resumed.
 */
export const resumeProcessInstance = async (id: string): Promise<void> => {
  try {
    await httpClient.post(`${apiConfig.endpoints.processInstances}/${id}/resume`, {});
  } catch (error) {
    if (shouldUseDummyData()) {
      logDummyDataFallback('resumeProcessInstance', error);
      return;
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
  status?: ProcessInstance['status']
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
  applicationBase: string,
  page = 0,
  size = 5
): Promise<PaginatedResponse<ProcessInstance>> => {
  return getProcessInstances(page, size, { applicationBase, status: 'RUNNING' });
};

/**
 * Fetches available status options for process instances.
 * @returns A promise that resolves to an array of status options.
 */
export const getProcessInstancesStatus = async (): Promise<StatusOption[]> => {
  try {
    const response = await httpClient.get<StatusOption[]>(apiConfig.endpoints.processInstancesStatus);
    return response;
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