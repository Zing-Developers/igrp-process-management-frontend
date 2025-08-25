'use server';
import { PaginatedResponse, Task } from '@igrp/platform-process-management-types';
import { getHttpClient } from '../config/client.config';
import { PostResponse } from '@igrp/platform-process-management-types/dist/response';

const httpClient = getHttpClient();

/**
 * Interface for task filter parameters used in multiple functions
 */
interface TaskFilterParams {
  processInstanceId?: string;
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
 * Fetches a paginated list of tasks with optional filters.
 * @param page The page number to fetch.
 * @param size The number of items per page.
 * @param filters Optional filter parameters.
 * @returns A promise that resolves to a paginated response of tasks.
 */
export const getTasks = async (
  page = 0, 
  size = 10, 
  filters?: Omit<TaskFilterParams, 'page' | 'size'>
): Promise<PaginatedResponse<Task>> => {
  const params = {
    page,
    size,
    ...filters
  };
  const response = await httpClient.tasks.getTasks(params);
  return response.data as PaginatedResponse<Task>;
};

/**
 * Fetches a single task by its ID.
 * @param id The ID of the task to fetch.
 * @returns A promise that resolves to the task, or undefined if not found.
 */
export const getTaskById = async (id: string): Promise<Task | undefined> => {
  const response = await httpClient.tasks.getTaskById(id);
  return response.data as Task;
};

/**
 * Fetches all tasks assigned to the current user with pagination.
 * @param params The filter parameters for fetching tasks.
 * @returns A promise that resolves to a paginated response of tasks.
 */
export const getMyTasks = async (params: TaskFilterParams): Promise<PaginatedResponse<Task>> => {
  const { page = 0, size = 10, ...filterParams } = params;

  const response = await httpClient.tasks.getMyTasks({
    ...filterParams,
    status: 'ASSIGNED',
    page,
    size,
  });
  return response.data as PaginatedResponse<Task>;
};

/**
 * Fetches all tasks assigned to a specific user.
 * @param userId The ID of the user.
 * @returns A promise that resolves to a list of tasks.
 */
export const getTasksByUser = async (userId: string): Promise<PaginatedResponse<Task>> => {
  const response = await httpClient.tasks.getTasksByUser(userId);
  return response.data as PaginatedResponse<Task>;
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

  const response = await httpClient.tasks.getAvailableTasks({
    ...filterParams,
    status: 'CREATED',
    page,
    size,
  });
  return response.data;
};

/**
 * Fetches all tasks for a specific process instance.
 * @param processInstanceId The ID of the process instance.
 * @returns A promise that resolves to a list of tasks.
 */
export const getTasksByProcessInstance = async (
  processInstanceId: string,
): Promise<PaginatedResponse<Task>> => {
  const response = await httpClient.tasks.getTasksByProcessInstance(processInstanceId);
  return response.data;
};

/**
 * Claims a task for a user.
 * @param taskId The ID of the task to claim.
 * @param user The user claiming the task.
 * @param note Optional note for the claim action.
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
 * @param user The user to unassign the task from.
 * @param note Optional note for the unassign action.
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
 * @param user The user releasing the task.
 * @param note Optional note for the release action.
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
