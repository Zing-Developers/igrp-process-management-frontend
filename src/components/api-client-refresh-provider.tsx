'use client';

import { useApiClientRefresh } from '@/hooks/use-api-client-refresh';

interface ApiClientRefreshProviderProps {
  children: React.ReactNode;
}

/**
 * Provider component that ensures the API client is refreshed when the session changes
 */
export function ApiClientRefreshProvider({ children }: ApiClientRefreshProviderProps) {
  useApiClientRefresh();
  
  return <>{children}</>;
}
