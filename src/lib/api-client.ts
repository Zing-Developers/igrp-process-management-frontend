import { ProcessManagementClient } from '@igrp/platform-process-management-client-ts';
import { getIGRPProcessClientConfig } from './api-config';

let clientInstance: ProcessManagementClient | null = null;

export async function getIGRPProcessClient(): Promise<ProcessManagementClient> {
  // console.log({ clientInstance });

  if (clientInstance) return clientInstance;

  const { baseUrl, token, timeout = 45000 } = getIGRPProcessClientConfig();

  clientInstance = ProcessManagementClient.create({
    baseUrl,
    timeout,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return clientInstance;
}
