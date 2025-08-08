import { httpClient } from './http-client';
import { Process, ProcessInstance } from '../../types/process';
import { PaginatedResponse } from '../../types/response';
import {
  getDummyProcessById,
  getDummyProcessesPaginated,
  createDummyProcessInstance,
} from '../dummy-data/processes';
import { apiConfig } from '../config/api.config';
import { buildUrlWithParams } from '../utils/url-builder';
import { shouldUseDummyData, logDummyDataFallback } from '../dummy-data/utils';

/**
 * Fetches a paginated list of processes.
 * @param page The page number to fetch.
 * @param size The number of items per page.
 * @returns A promise that resolves to a paginated response of processes.
 */
export const getProcesses = async (
  page = 0,
  size = 20
): Promise<PaginatedResponse<Process>> => {
  try {
    const url = buildUrlWithParams(apiConfig.endpoints.processes, { page, size });
    const response = await httpClient.get<PaginatedResponse<Process>>(url);
    return response;
  } catch (error) {
    if (shouldUseDummyData()) {
      logDummyDataFallback('getProcesses', error);
      return getDummyProcessesPaginated(page, size);
    }
    // Re-throw the error if dummy data is not allowed
    throw error;
  }
};

/**
 * Fetches a single process by its ID.
 * @param id The ID of the process to fetch.
 * @returns A promise that resolves to the process, or null if not found.
 */
export const getProcessById = async (
  id: string
): Promise<Process | null> => {
  try {
    return await httpClient.get<Process>(`${apiConfig.endpoints.processes}/${id}`);
  } catch (error) {
    if (shouldUseDummyData()) {
      logDummyDataFallback('getProcessById', error);
      return getDummyProcessById(id) || null;
    }
    // Re-throw the error if dummy data is not allowed
    throw error;
  }
};

/**
 * Starts a new process instance.
 * @param processDefinitionId The ID of the process definition to start.
 * @param processKey The process key.
 * @param businessKey Optional business key for the process instance.
 * @param applicationBase The application base.
 * @param variables Optional variables to pass to the process instance.
 * @returns A promise that resolves to the newly created process instance.
 */
export const startProcess = async (
  processDefinitionId: string,
  processKey: string,
  applicationBase: string,
  businessKey?: string,
  variables?: Array<{ name: string; value: string }>
): Promise<ProcessInstance> => {
  const endpoint = apiConfig.endpoints.processStart;
  const body = {
    processDefinitionId,
    processKey,
    businessKey,
    applicationBase: applicationBase || apiConfig.applicationBase,
    variables: variables || []
  };

  try {
    const response = await httpClient.post<ProcessInstance>(endpoint, body);
    return response;
  } catch (error) {
    if (shouldUseDummyData()) {
      logDummyDataFallback('startProcess', error);
      return createDummyProcessInstance(processDefinitionId, businessKey, variables);
    }
    // Re-throw the error if dummy data is not allowed
    throw error;
  }
};