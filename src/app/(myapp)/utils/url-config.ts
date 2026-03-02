/**
 * Centralized URL configuration for process management
 */

import { getApplication } from "../access-management/applications";

export function formatSlug(slug: string): string {
  let baseUrl = "";
  if (slug.startsWith("/apps")) {
    baseUrl = slug;
  } else {
    baseUrl = `/apps/${slug}`;
  }

  // Check if baseUrl is already a full URL
  if (baseUrl.startsWith("http://") || baseUrl.startsWith("https://")) {
    return baseUrl;
  }

  // If it's a relative path, construct a full URL using the current origin
  // In browser context, use window.location.origin; otherwise return as relative path
  if (typeof window !== "undefined" && window.location) {
    return `${window.location.origin}${baseUrl}`;
  }

  // Server-side or fallback: return relative path (will work with Next.js router)
  return baseUrl;
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
  ): Promise<string> => {
    if (process.env.NEXT_PUBLIC_APP_BASE_RUNTIME_URL) {
      return `${process.env.NEXT_PUBLIC_APP_BASE_RUNTIME_URL}/process/view/${processInstanceId}`;
    }
    const application = await getApplication(applicationBase);
    const { slug, url } = application;

    const href = process.env.NEXT_PUBLIC_APP_BASE_RUNTIME_URL
      ? process.env.NEXT_PUBLIC_APP_BASE_RUNTIME_URL
      : slug
        ? formatSlug(slug)
        : (url ?? "");

    return `${href}/process/view/${processInstanceId}`;
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
    if (process.env.NEXT_PUBLIC_APP_BASE_RUNTIME_URL) {
      return `${process.env.NEXT_PUBLIC_APP_BASE_RUNTIME_URL}/process/${procReleaseKey}/${processInstanceId}/${taskKey}/${taskId}`;
    }
    const application = await getApplication(applicationBase);
    const { slug, url } = application;

    const href = process.env.NEXT_PUBLIC_APP_BASE_RUNTIME_URL
      ? process.env.NEXT_PUBLIC_APP_BASE_RUNTIME_URL
      : slug
        ? formatSlug(slug)
        : (url ?? "");

    return `${href}/process/${procReleaseKey}/${processInstanceId}/${taskKey}/${taskId}`;
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
