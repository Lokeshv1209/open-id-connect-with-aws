/**
 * API related type definitions
 */

// Generic API Response
export interface ApiResponse<T = any> {
  code: string | number;
  message?: string;
  data: T;
}

// Pagination
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}

// API Error
export interface ApiError {
  code: string | number;
  message: string;
  errors?: Record<string, string[]>;
  stack?: string;
}

// Request Parameters
export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface FilterParams {
  status?: string;
  startDate?: string;
  endDate?: string;
  category?: string;
}
