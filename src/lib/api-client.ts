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

    // Prepare headers - only include Authorization if token is available and not empty
    const headers: Record<string, string> = {};
    if (token && token.trim() !== '') {
      headers.Authorization = `Bearer ${token}`;
    }

    // Create new client instance with current token
    clientInstance = ProcessManagementClient.create({
      baseUrl,
      timeout,
      headers,
    });

    return clientInstance;
  } catch (error) {
    console.error('Error getting IGRP Process Client config:', error);
    
    // Fallback: create client with default configuration
    console.log('Creating fallback IGRP Process Client with default config');
    
    // Try to get token from environment or session if available
    const fallbackBaseUrl = process.env.API_GATEWAY || 'http://localhost:8086';
    const fallbackHeaders: Record<string, string> = {};
    
    // Check if we can get token from somewhere else (this is a temporary fallback)
    // In production, you might want to handle this differently
    console.log('Fallback client created without authentication token');
    
    clientInstance = ProcessManagementClient.create({
      baseUrl: fallbackBaseUrl,
      timeout: 45000,
      headers: fallbackHeaders,
    });

    return clientInstance;
  }
}

export function resetIGRPProcessClient() {
  clientInstance = null;
}
