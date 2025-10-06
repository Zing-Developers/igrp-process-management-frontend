'use server';

import { getIGRPProcessClient } from '@/lib/api-client';
import { PaginatedResponse, ProcessInstance } from '@igrp/platform-process-management-types';

// Define the StatusOption interface locally since it's not exported from the types package
interface StatusOption {
  value: string;
  label: string;
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
  filters?: {
    processKey?: string;
    number?: string;
    status?: string;
    businessKey?: string;
    startDateFrom?: string;
    startDateTo?: string;
    endDateFrom?: string;
    endDateTo?: string;
  },
): Promise<PaginatedResponse<ProcessInstance>> => {
  const allowedStatuses = [
    'CREATED',
    'RUNNING',
    'SUSPENDED',
    'COMPLETED',
    'TERMINATED',
    'CANCELED',
  ] as const;
  type ClientStatus = typeof allowedStatuses[number];

  const mappedStatus = ((): ClientStatus | undefined => {
    const raw = filters?.status?.toUpperCase();
    return allowedStatuses.includes(raw as ClientStatus) ? (raw as ClientStatus) : undefined;
  })();

  try {
    const processManagementClient = await getIGRPProcessClient();
    const response = await processManagementClient.processes.getProcessInstances({
      page,
      size,
      number: filters?.number,
      procReleaseKey: filters?.processKey,
      status: mappedStatus,
      // searchTerms, applicationBase, procReleaseId not mapped here
    });
    return response.data as PaginatedResponse<ProcessInstance>;
  } catch (error: unknown) {
    console.error('Error fetching process instances:', error);
    
    // Handle authentication errors specifically
    if (
      (error && typeof error === 'object' && 'status' in error && error.status === 401) ||
      (error && typeof error === 'object' && 'message' in error && 
       typeof error.message === 'string' && 
       (error.message.includes('401') || error.message.includes('Unauthorized')))
    ) {
      throw new Error('Authentication failed. Please log in again to continue.');
    }
    
    // Handle other errors
    if (
      error && 
      typeof error === 'object' && 
      'message' in error && 
      typeof error.message === 'string' && 
      error.message.includes('Authentication required')
    ) {
      throw new Error('Authentication required. Please log in to access this feature.');
    }
    
    // Re-throw other errors
    throw error;
  }
};

/**
 * Fetches a single process instance by its ID.
 * @param id The ID of the process instance to fetch.
 * @returns A promise that resolves to the process instance, or null if not found.
 */
export const getProcessInstanceById = async (id: string): Promise<ProcessInstance | null> => {
  const processManagementClient = await getIGRPProcessClient();
  return (await processManagementClient.processes.getProcessInstanceById(id)).data as ProcessInstance;
};

/**
 * Gets running process instances for a specific application base.
 * @param applicationBase The application base.
 * @returns A promise that resolves to an array of running process instances.
 */
export const getRunningProcessInstances = async (applicationBase: string): Promise<ProcessInstance[]> => {
  const processManagementClient = await getIGRPProcessClient();
  // No direct API in client; use getProcessInstances with filters
  const response = await processManagementClient.processes.getProcessInstances({
    applicationBase,
    status: 'RUNNING',
    page: 0,
    size: 1000,
  });
  return (response.data?.content ?? []) as ProcessInstance[];
};

/**
 * Fetches available status options for process instances.
 * @returns A promise that resolves to an array of status options.
 */
export const getProcessInstancesStatus = async (): Promise<StatusOption[]> => {
  const processManagementClient = await getIGRPProcessClient();
  return (await processManagementClient.processes.getProcessInstancesStatus()).data as StatusOption[];
};
