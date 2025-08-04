export type PostResponse = {
  code: string;
  message: string;
};

export interface PaginatedResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  empty?: boolean; // Make this optional since the API doesn't always include it
}
