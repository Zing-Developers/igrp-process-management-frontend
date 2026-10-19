/**
 * Centralized URL configuration for process management
 */

export function formatSlug(slug: string): string {
  if (/^https?:\/\//.test(slug)) {
    return slug.replace(/\/$/, "");
  }

  return (slug.startsWith("/apps/") ? slug : `/apps/${slug}`).replace(
    /\/$/,
    "",
  );
}

function runtimeBase(applicationBase: string): string {
  const configuredBase = process.env.NEXT_PUBLIC_APP_BASE_RUNTIME_URL;
  return configuredBase
    ? configuredBase.replace(/\/$/, "")
    : applicationBase
      ? formatSlug(applicationBase)
      : "";
}

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
  buildProcessInstanceUrl: async (
    processInstanceId: string,
    applicationBase: string,
    processKey: string,
  ): Promise<string> => {
    return `${runtimeBase(applicationBase)}/process/view/${processKey}/${processInstanceId}`;
  },

  /**
   * Build URL for task execution
   * @param procReleaseKey - Process release key
   * @param processInstanceId - Process instance ID
   * @param taskKey - Task key
   * @param taskId - Task ID
   * @returns Complete URL for task execution
   */
  buildTaskExecutionUrl: async (
    procReleaseKey: string,
    processInstanceId: string,
    taskKey: string,
    taskId: string,
    applicationBase: string,
  ): Promise<string> => {
    return `${runtimeBase(applicationBase)}/process/${procReleaseKey}/${processInstanceId}/${taskKey}/${taskId}`;
  },

  /**
   * Build URL for process runtime (generic)
   * @param segments - Array of URL segments
   * @returns Complete URL with provided segments
   */
  buildProcessUrl: (...segments: string[]): string => {
    const BASE_RUNTIME_URL = process.env.NEXT_PUBLIC_APP_BASE_RUNTIME_URL ?? "";

    return `${BASE_RUNTIME_URL}/process/${segments.join("/")}`;
  },
} as const;

/**
 * URL patterns for reference
 */
export const urlPatterns = {
  PROCESS_INSTANCE: "/process/{procReleaseKey}/{processInstanceId}",
  TASK_EXECUTION:
    "/process/{procReleaseKey}/{processInstanceId}/{taskKey}/{taskId}",
} as const;

export default urlConfig;
