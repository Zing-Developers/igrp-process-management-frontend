/**
 * Centralized URL configuration for process management
 */

const BASE_RUNTIME_URL = process.env.IGRP_APP_BASE_RUNTIME_URL ?? '';

/**
 * URL builders for process management
 */
export const urlConfig = {
  /**
   * Build URL for process instance execution
   * @param procReleaseKey - Process release key
   * @param processInstanceId - Process instance ID
   * @returns Complete URL for process instance
   */
  buildProcessInstanceUrl: (procReleaseKey: string, processInstanceId: string): string => {
    return `${BASE_RUNTIME_URL}/process/${procReleaseKey}/${processInstanceId}`;
  },

  /**
   * Build URL for task execution
   * @param procReleaseKey - Process release key
   * @param processInstanceId - Process instance ID
   * @param taskKey - Task key
   * @param taskId - Task ID
   * @returns Complete URL for task execution
   */
  buildTaskExecutionUrl: (
    procReleaseKey: string,
    processInstanceId: string,
    taskKey: string,
    taskId: string,
  ): string => {
    return `${BASE_RUNTIME_URL}/process/${procReleaseKey}/${processInstanceId}/${taskKey}/${taskId}`;
  },

  /**
   * Build URL for process runtime (generic)
   * @param segments - Array of URL segments
   * @returns Complete URL with provided segments
   */
  buildProcessUrl: (...segments: string[]): string => {
    return `${BASE_RUNTIME_URL}/process/${segments.join('/')}`;
  },
} as const;

/**
 * URL patterns for reference
 */
export const urlPatterns = {
  PROCESS_INSTANCE: '/process/{procReleaseKey}/{processInstanceId}',
  TASK_EXECUTION: '/process/{procReleaseKey}/{processInstanceId}/{taskKey}/{taskId}',
} as const;

export default urlConfig;
