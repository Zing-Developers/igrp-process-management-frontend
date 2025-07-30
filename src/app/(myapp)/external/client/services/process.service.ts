import { httpClient } from './http-client';
import { Process, ProcessInstance } from '../../types/process';
import { PaginatedResponse } from '../../types/response';
import {
  getDummyProcessById,
  getDummyProcessesPaginated,
  createDummyProcessInstance,
} from '../dummy-data/processes';
import { apiConfig } from '../config/api.config';

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
    const response = await httpClient.get<PaginatedResponse<Process>>(
      `${apiConfig.endpoints.processes}?page=${page}&size=${size}`
    );
    return response;
  } catch (error) {
    console.warn('API call failed, using fallback data for getProcesses');
    return getDummyProcessesPaginated(page, size);
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
    console.warn('API call failed, using fallback data for getProcessById');
    return getDummyProcessById(id) || null;
  }
};

/**
 * Starts a new process instance.
 * @param processDefinitionId The ID of the process definition to start.
 * @param businessKey Optional business key for the process instance.
 * @param variables Optional variables to pass to the process instance.
 * @returns A promise that resolves to the newly created process instance.
 */
export const startProcess = async (
  processDefinitionId: string,
  businessKey?: string,
  variables?: Record<string, any>
): Promise<ProcessInstance> => {
  const endpoint = apiConfig.endpoints.processStart;
  const body = { processDefinitionId, businessKey, variables };

  try {
    const response = await httpClient.post<ProcessInstance>(endpoint, body);
    return response;
  } catch (error) {
    console.warn('API call failed, using fallback data for startProcess');
    return createDummyProcessInstance(processDefinitionId, businessKey, variables);
  }
};
