import { PaginatedResponse } from '../../types/response';

/**
 * Check if dummy data should be used based on environment variable
 * @returns boolean indicating whether to use dummy data
 */
export const shouldUseDummyData = (): boolean => {
  try {
    return typeof process !== 'undefined' && 
           process.env.NEXT_PUBLIC_USE_DUMMY_DATA === 'true';
  } catch {
    return false;
  }
};

/**
 * Creates a paginated response from an array of items
 * @param items Array of items to paginate
 * @param page Current page number (0-based)
 * @param size Number of items per page
 * @returns Paginated response object
 */
export const createPaginatedResponse = <T>(
  items: T[],
  page: number = 0,
  size: number = 10
): PaginatedResponse<T> => {
  const startIndex = page * size;
  const endIndex = startIndex + size;
  const paginatedItems = items.slice(startIndex, endIndex);
  
  return {
    content: paginatedItems,
    pageNumber: page,
    pageSize: size,
    totalElements: items.length,
    totalPages: Math.ceil(items.length / size),
    first: page === 0,
    last: endIndex >= items.length,
    empty: items.length === 0,
  };
};

/**
 * Creates a paginated response for filtered items
 * @param allItems Array of all items
 * @param filterFn Function to filter items
 * @param page Current page number (0-based)
 * @param size Number of items per page
 * @returns Paginated response object
 */
export const createFilteredPaginatedResponse = <T>(
  allItems: T[],
  filterFn: (item: T) => boolean,
  page: number = 0,
  size: number = 10
): PaginatedResponse<T> => {
  const filteredItems = allItems.filter(filterFn);
  return createPaginatedResponse(filteredItems, page, size);
};

/**
 * Logs a warning message when using dummy data fallback
 * @param operation The operation that failed
 * @param error Optional error object
 * @param additionalInfo Optional additional information
 */
export const logDummyDataFallback = (
  operation: string,
  error?: any,
  additionalInfo?: string
): void => {
  const message = `API call failed for ${operation}, using fallback dummy data${additionalInfo ? `: ${additionalInfo}` : ''}`;
  console.warn(message, error);
};

/**
 * Logs an error message when using dummy data fallback
 * @param operation The operation that failed
 * @param error Optional error object
 * @param additionalInfo Optional additional information
 */
export const logDummyDataError = (
  operation: string,
  error?: any,
  additionalInfo?: string
): void => {
  const message = `Failed to ${operation}, returning dummy data${additionalInfo ? `: ${additionalInfo}` : ''}`;
  console.error(message, error);
};