import { ProcessManagementClient } from '@igrp/platform-process-management-client-ts';
import { getIGRPProcessClientConfig } from './api-config';
import { serverSession } from '@/actions/igrp/auth';

let clientInstance: ProcessManagementClient | null = null;

export async function getIGRPProcessClient(): Promise<ProcessManagementClient> {
  // Always create a fresh client instance to ensure we have the latest configuration
  clientInstance = null;
  // Always get fresh config to ensure we have the latest token
  const { baseUrl, timeout = 45000 } = getIGRPProcessClientConfig();

  const session =await serverSession();

  // Prepare headers with authentication
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: `Bearer ${session?.accessToken}`,
  };

  // Create new client instance with current token
  clientInstance = ProcessManagementClient.create({
    baseUrl,
    timeout,
    headers,
  });

  return clientInstance;
}

export function resetIGRPProcessClient() {
  clientInstance = null;
}
