'use server';

import { getServerSession } from '@igrp/framework-next-auth';
import { authOptions } from '@/lib/auth-options';
import { setIGRPProcessClientConfig } from '@/lib/api-config';

/**
 * Utility function to ensure API client is properly configured with current session
 * This should be called at the beginning of each server action that needs authentication
 */
export async function ensureAuthenticatedApiClient(): Promise<void> {
  // Get the current session to ensure we have the latest token
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) {
    throw new Error('Authentication required. Please log in to access this feature.');
  }

  // Set the API client configuration with the current session token
  setIGRPProcessClientConfig({
    token: session.accessToken,
    baseUrl: process.env.API_GATEWAY ?? '',
    timeout: 30000,
  });
}
