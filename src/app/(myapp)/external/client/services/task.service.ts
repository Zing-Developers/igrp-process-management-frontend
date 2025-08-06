import {
  Task,
} from '../../types/task';
import {
  PaginatedResponse,
  PostResponse
} from '../../types/response';
import { tasks } from '../dummy-data/tasks';
import { httpClient, post } from './http-client';
import { apiConfig } from '../config/api.config';
import { buildUrlWithParams } from '../utils/url-builder';
import { 
  shouldUseDummyData, 
  createPaginatedResponse, 
  createFilteredPaginatedResponse,
  logDummyDataError 
} from '../dummy-data/utils';

/**
 * Interface for task filter parameters used in multiple functions
 */
interface TaskFilterParams {
  processNumber: string;
  processKey: string;
  user: string;
  status: string;
  dateFrom: string;
  dateTo: string;
  page?: number;
  size?: number;
}

/**
 * Fetches a paginated list of tasks.
 * @param page The page number to fetch.
 * @param size The number of items per page.
 * @returns A promise that resolves to a paginated response of tasks.
 */
export const getTasks = async (
  page = 0,
  size = 10
): Promise<PaginatedResponse<Task>> => {
  try {
    const url = buildUrlWithParams(apiConfig.endpoints.tasks, { page, size });
    const response = await httpClient.get<PaginatedResponse<Task>>(url);
    return response;
  } catch (error) {
    if (shouldUseDummyData()) {
      logDummyDataError('fetch tasks', error);
      return createPaginatedResponse(tasks, page, size);
    }
    // Re-throw the error if dummy data is not allowed
    throw error;
  }
};

/**
 * Fetches a single task by its ID.
 * @param id The ID of the task to fetch.
 * @returns A promise that resolves to the task, or undefined if not found.
 */
export const getTaskById = async (id: string): Promise<Task | undefined> => {
  try {
    const response = await httpClient.get<Task>(`${apiConfig.endpoints.tasks}/${id}`);
    return response;
  } catch (error) {
    if (shouldUseDummyData()) {
      logDummyDataError(`fetch task with id ${id}`, error);
      return tasks.find((t) => t.id === id);
    }
    // Re-throw the error if dummy data is not allowed
    throw error;
  }
};

/**
 * Fetches all tasks assigned to the current user with pagination.
 * @param params The filter parameters for fetching tasks.
 * @returns A promise that resolves to a paginated response of tasks.
 */
export const getMyTasks = async (
  params: TaskFilterParams
): Promise<PaginatedResponse<Task>> => {
  const { page = 0, size = 10, ...filterParams } = params;
  
  try {
    const url = buildUrlWithParams(`${apiConfig.endpoints.tasks}/my`, {
      ...filterParams,
      page,
      size
    });
    const response = await httpClient.get<PaginatedResponse<Task>>(url);
    return response;
  } catch (error) {
    if (shouldUseDummyData()) {
      logDummyDataError('fetch my tasks', error);
      return createFilteredPaginatedResponse(
        tasks,
        (t) => t.assignee === 'current-user',
        page,
        size
      );
    }
    // Re-throw the error if dummy data is not allowed
    throw error;
  }
};

/**
 * Fetches all tasks assigned to a specific user.
 * @param userId The ID of the user.
 * @returns A promise that resolves to a list of tasks.
 */
export const getTasksByUser = async (userId: string): Promise<Task[]> => {
  try {
    const response = await httpClient.get<Task[]>(`${apiConfig.endpoints.tasks}/user/${userId}`);
    return response;
  } catch (error) {
    if (shouldUseDummyData()) {
      logDummyDataError(`fetch tasks for user ${userId}`, error);
      return tasks.filter((t) => t.assignee === userId);
    }
    // Re-throw the error if dummy data is not allowed
    throw error;
  }
};

/**
 * Fetches all available tasks for a user with pagination.
 * @param params The filter parameters for fetching tasks.
 * @returns A promise that resolves to a paginated response of tasks.
 */
export const getAvailableTasks = async (
  params: TaskFilterParams
): Promise<PaginatedResponse<Task>> => {
  const { page = 0, size = 10, ...filterParams } = params;
  
  try {
    const url = buildUrlWithParams(`${apiConfig.endpoints.tasks}`, {
      ...filterParams,
      page,
      size
    });
    const response = await httpClient.get<PaginatedResponse<Task>>(url);
    return response;
  } catch (error) {
    if (shouldUseDummyData()) {
      logDummyDataError('fetch available tasks', error);
      return createFilteredPaginatedResponse(
        tasks,
        (t) => !t.assignee && t.status === 'CREATED',
        page,
        size
      );
    }
    // Re-throw the error if dummy data is not allowed
    throw error;
  }
};

/**
 * Fetches all tasks for a specific process instance.
 * @param processInstanceId The ID of the process instance.
 * @returns A promise that resolves to a list of tasks.
 */
export const getTasksByProcessInstance = async (
  processInstanceId: string
): Promise<Task[]> => {
  try {
    const response = await httpClient.get<Task[]>(
      `${apiConfig.endpoints.tasks}/process/${processInstanceId}`
    );
    return response;
  } catch (error) {
    if (shouldUseDummyData()) {
      logDummyDataError(`fetch tasks for process instance ${processInstanceId}`, error);
      return tasks.filter((t) => t.processInstanceId === processInstanceId);
    }
    // Re-throw the error if dummy data is not allowed
    throw error;
  }
};

/**
 * Claims a task for a user.
 * @param taskId The ID of the task to claim.
 * @param userId The ID of the user claiming the task.
 * @returns A promise that resolves to a PostResponse.
 */
export const claimTask = (taskId: string, userId: string): Promise<PostResponse> =>
  post(apiConfig.endpoints.tasksClaim, { taskId, userId });

/**
 * Releases a claimed task.
 * @param taskId The ID of the task to release.
 * @returns A promise that resolves to a PostResponse.
 */
export const releaseTask = (taskId: string): Promise<PostResponse> =>
  post(apiConfig.endpoints.tasksRelease, { taskId });

/**
 * Completes a task.
 * @param taskId The ID of the task to complete.
 * @param variables Optional variables to pass to the task.
 * @returns A promise that resolves to a PostResponse.
 */
export const completeTask = (
  taskId: string,
  variables?: Record<string, any>
): Promise<PostResponse> => post(apiConfig.endpoints.tasksComplete, { taskId, variables });
