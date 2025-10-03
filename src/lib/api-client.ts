import { ProcessManagementClient } from '@igrp/platform-process-management-client-ts';
import { getIGRPProcessClientConfig } from './api-config';

let clientInstance: ProcessManagementClient | null = null;

export async function getIGRPProcessClient(): Promise<ProcessManagementClient> {
  // Always get fresh config to ensure we have the latest token
  const { baseUrl, token, timeout = 45000 } = getIGRPProcessClientConfig();

  // Create new client instance with current token
  clientInstance = ProcessManagementClient.create({
    baseUrl,
    timeout,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return clientInstance;
}

export function resetIGRPProcessClient() {
  clientInstance = null;
}
