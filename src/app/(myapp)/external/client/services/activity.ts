"use server";
import { getIGRPProcessClient } from "@/lib/api-client";
import {
  ActivityEvent,
  ActivityProgress,
} from "@igrp/platform-process-management-types";

/**
 * Fetches the progress of an activity by its ID.
 * @param processInstanceId The ID of the process instance to fetch.
 * @param type The type of the activity to fetch.
 * @returns A promise that resolves to the activity progress, or null if not found.
 */
export const getActivityProgress = async (
  processInstanceId: string,
  type?: string,
): Promise<ActivityProgress[] | null> => {
  const processManagementClient = await getIGRPProcessClient();
  return (
    await processManagementClient.activities.getActivityProgress(
      processInstanceId,
      type,
    )
  ).data;
};

/**
 * Fetches the instances of an activity by its ID.
 * @param processInstanceId The ID of the process instance to fetch.
 * @param type The type of the activity to fetch.
 * @returns A promise that resolves to the activity instances, or null if not found.
 */
export const getActivityInstances = async (
  processInstanceId: string,
  type?: string,
): Promise<ActivityEvent[]> => {
  const processManagementClient = await getIGRPProcessClient();
  return (
    await processManagementClient.activities.getActivityInstances(
      processInstanceId,
      type,
    )
  ).data;
};

/**
 * Fetches the activity by its ID.
 * @param id The ID of the activity to fetch.
 * @returns A promise that resolves to the activity, or null if not found.
 */
export const getActivityById = async (
  id: string,
): Promise<ActivityEvent | null> => {
  const processManagementClient = await getIGRPProcessClient();
  return (await processManagementClient.activities.getActivityById(id)).data;
};
