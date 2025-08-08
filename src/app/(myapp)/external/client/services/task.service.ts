import { PaginatedResponse, Task } from '@igrp/platform-process-management-types';
import { tasks } from '../dummy-data/tasks';
import {
  shouldUseDummyData,
  createPaginatedResponse,
  createFilteredPaginatedResponse,
  logDummyDataError,
} from '../dummy-data/utils';
import { ProcessManagementClient } from '@igrp/platform-process-management-client-ts';
import { PostResponse } from '@igrp/platform-process-management-types/dist/response';

const httpClient = ProcessManagementClient.create({
  baseUrl: 'http://localhost:8080',
  timeout: 30000, // optional, defaults to 30000 (30 seconds)
  headers: {
    // optional
    //Authorization: 'Bearer your-token-here',
  },
});

/**
 * Interface for task filter parameters used in multiple functions
 */
interface TaskFilterParams {
  processNumber?: string;
  processKey?: string;
  user?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  applicationBase?: string;
  page?: number;
  size?: number;
}

/**
 * Fetches a paginated list of tasks.
 * @param page The page number to fetch.
 * @param size The number of items per page.
 * @returns A promise that resolves to a paginated response of tasks.
 */
export const getTasks = async (page = 0, size = 10): Promise<PaginatedResponse<Task>> => {
  try {
    const response = await httpClient.tasks.getTasks({ page, size });
    return response.data as PaginatedResponse<Task>;
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
    const response = await httpClient.tasks.getTaskById(id);
    return response.data as Task;
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
export const getMyTasks = async (params: TaskFilterParams): Promise<PaginatedResponse<Task>> => {
  const { page = 0, size = 10, ...filterParams } = params;

  try {
    const response = await httpClient.tasks.getMyTasks({
      ...filterParams,
      page,
      size,
    });
    return response.data as PaginatedResponse<Task>;
  } catch (error) {
    if (shouldUseDummyData()) {
      logDummyDataError('fetch my tasks', error);
      return createFilteredPaginatedResponse(
        tasks,
        (t) => t.assignee === 'current-user',
        page,
        size,
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
export const getTasksByUser = async (userId: string): Promise<PaginatedResponse<Task>> => {
  try {
    const response = await httpClient.tasks.getTasksByUser(userId);
    return response.data as PaginatedResponse<Task>;
  } catch (error) {
    if (shouldUseDummyData()) {
      logDummyDataError(`fetch tasks for user ${userId}`, error);
      return createFilteredPaginatedResponse(tasks, (t) => t.assignee === userId, 0, 10);
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
  params: TaskFilterParams,
): Promise<PaginatedResponse<Task>> => {
  const { page = 0, size = 10, ...filterParams } = params;

  try {
    const response = await httpClient.tasks.getAvailableTasks({
      ...filterParams,
      page,
      size,
    });
    return response.data;
  } catch (error) {
    if (shouldUseDummyData()) {
      logDummyDataError('fetch available tasks', error);
      return createFilteredPaginatedResponse(
        tasks,
        (t) => !t.assignee && t.status === 'CREATED',
        page,
        size,
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
  processInstanceId: string,
): Promise<PaginatedResponse<Task>> => {
  try {
    const response = await httpClient.tasks.getTasksByProcessInstance(processInstanceId);
    return response.data;
  } catch (error) {
    if (shouldUseDummyData()) {
      logDummyDataError(`fetch tasks for process instance ${processInstanceId}`, error);
      return createFilteredPaginatedResponse(
        tasks,
        (t) => t.processInstanceId === processInstanceId,
        0,
        10,
      );
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
export const claimTask = async (
  taskId: string,
  user: string,
  note?: string,
): Promise<PostResponse> => (await httpClient.tasks.claimTask(taskId, { user, note })).data;

/**
 * Unassigns a task from a user.
 * @param taskId The ID of the task to unassign.
 * @param userId The ID of the user to unassign the task from.
 * @returns A promise that resolves to a PostResponse.
 */
export const unassignTask = async (
  taskId: string,
  user: string,
  note?: string,
): Promise<PostResponse> => (await httpClient.tasks.unassignTask(taskId, { user, note })).data;

/**
 * Releases a claimed task.
 * @param taskId The ID of the task to release.
 * @returns A promise that resolves to a PostResponse.
 */
export const releaseTask = async (
  taskId: string,
  user: string,
  note?: string,
): Promise<PostResponse> => (await httpClient.tasks.unclaimTask(taskId, { user, note })).data;

/**
 * Completes a task.
 * @param taskId The ID of the task to complete.
 * @param variables Optional variables to pass to the task.
 * @returns A promise that resolves to a PostResponse.
 */
export const completeTask = async (
  taskId: string,
  variables?: Array<{
    name: string;
    value: string;
  }>,
): Promise<PostResponse> => (await httpClient.tasks.completeTask(taskId, variables)).data;
