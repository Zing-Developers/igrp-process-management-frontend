// http-client.ts
import { PostResponse } from '../../types/response';
import { apiConfig } from '../config/api.config';
import { joinUrl } from '../utils/url-builder';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

// Check if we should use dummy data based ONLY on the explicit environment variable
// Safe way to check environment variables in both Node.js and browser environments
const shouldUseDummyData = (() => {
  try {
    // Only use dummy data if explicitly set to 'true'
    return typeof process !== 'undefined' && process.env.NEXT_PUBLIC_USE_DUMMY_DATA === 'true';
  } catch {
    // Fallback for pure browser environments
    return false;
  }
})();

const USE_DUMMY_DATA_ONLY = shouldUseDummyData;

async function request<T>(
  endpoint: string,
  method: HttpMethod,
  body?: any,
  retries = 1, // Always allow retries unless dummy data is forced
  delay = 100, // Standard delay
): Promise<T> {
  // Only use dummy data if explicitly configured to do so
  if (USE_DUMMY_DATA_ONLY) {
    throw new Error('Dummy data mode: using dummy data only');
  }

  const url = joinUrl(apiConfig.baseUrl, endpoint);

  console.log('request url', url);
  console.log('request body', body);
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // Check if response has content before trying to parse JSON
    const contentLength = response.headers.get('content-length');
    const contentType = response.headers.get('content-type');
    
    // If content-length is 0 or response is 204 No Content, return empty object
    if (contentLength === '0' || response.status === 204) {
      return {} as T;
    }
    
    // Check if response is actually JSON
    if (contentType && contentType.includes('application/json')) {
      const text = await response.text();
      // If text is empty, return empty object
      if (!text.trim()) {
        return {} as T;
      }
      return JSON.parse(text);
    }
    
    // For non-JSON responses, try to parse as JSON but handle empty responses
    const text = await response.text();
    if (!text.trim()) {
      return {} as T;
    }
    
    return JSON.parse(text);
  } catch (error) {
    if (retries > 0) {
      await new Promise((res) => setTimeout(res, delay));
      return request<T>(endpoint, method, body, retries - 1, delay * 1.5);
    }
    throw error;
  }
}

export const httpClient = {
  get: <T>(endpoint: string) => request<T>(endpoint, 'GET'),
  post: <T>(endpoint: string, body: any) => request<T>(endpoint, 'POST', body),
  put: <T>(endpoint: string, body: any) => request<T>(endpoint, 'PUT', body),
  delete: <T>(endpoint: string) => request<T>(endpoint, 'DELETE'),
};

export const post = async (endpoint: string, body: any): Promise<PostResponse> => {
  try {
    const response = await httpClient.post<PostResponse>(endpoint, body);
    return response;
  } catch (error: any) {
    console.error(`Error posting to ${endpoint}:`, error);
    // Re-throw the error instead of returning a generic error response
    // This ensures the calling services can handle the actual error
    throw error;
  }
};
