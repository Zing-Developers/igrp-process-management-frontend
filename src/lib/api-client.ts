import { ProcessManagementClient } from '@igrp/platform-process-management-client-ts';
import { getIGRPProcessClientConfig } from './api-config';

let clientInstance: ProcessManagementClient | null = null;

export async function getIGRPProcessClient(): Promise<ProcessManagementClient> {
  // Always create a fresh client instance to ensure we have the latest configuration
  clientInstance = null;
  try {
    // Always get fresh config to ensure we have the latest token
    const { baseUrl, token, timeout = 45000 } = getIGRPProcessClientConfig();

    console.log('Creating IGRP Process Client with config:', {
      baseUrl,
      hasToken: !!token,
      tokenPreview: token ? `${token.substring(0, 20)}...` : 'No token'
    });

    // Validate that we have a token before creating the client
    if (!token || token.trim() === '') {
      throw new Error('No authentication token available. Please ensure you are logged in.');
    }

    // Prepare headers with authentication
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    };

    // Create new client instance with current token
    clientInstance = ProcessManagementClient.create({
      baseUrl,
      timeout,
      headers,
    });

    return clientInstance;
  } catch (error) {
    console.error('Error getting IGRP Process Client config:', error);
    
    // Don't create a fallback client without authentication
    // This will force the user to log in again
    throw new Error('Authentication required. Please log in to access this feature.');
  }
}

export function resetIGRPProcessClient() {
  clientInstance = null;
}
