import { ProcessManagementClient } from '@igrp/platform-process-management-client-ts';
import { getIGRPProcessClientConfig } from './api-config';

let clientInstance: ProcessManagementClient | null = null;

export async function getIGRPProcessClient(): Promise<ProcessManagementClient> {
  try {
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
  } catch (error) {
    console.error('Error getting IGRP Process Client config:', error);
    
    // Fallback: create client with default configuration
    console.log('Creating fallback IGRP Process Client with default config');
    clientInstance = ProcessManagementClient.create({
      baseUrl: process.env.API_GATEWAY || 'http://localhost:8086',
      timeout: 45000,
      headers: {
        // No authorization header if no token available
      },
    });

    return clientInstance;
  }
}

export function resetIGRPProcessClient() {
  clientInstance = null;
}
