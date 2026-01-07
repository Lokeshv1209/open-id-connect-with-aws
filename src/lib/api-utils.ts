/**
 * API utility functions
 */

import type { ApiResponse } from "@/types/api.types";

/**
 * Check if a response is successful
 */
export const isApiSuccess = (response: ApiResponse): boolean => {
  return response.code === "200" || response.code === 200;
};

/**
 * Extract error message from API error
 */
export const getErrorMessage = (error: any): string => {
  if (typeof error === "string") return error;

  if (error?.data?.message) return error.data.message;
  if (error?.message) return error.message;
  if (error?.error) return error.error;

  return "An unexpected error occurred";
};

/**
 * Handle API error with toast notification
 */
export const handleApiError = (error: any, defaultMessage = "Operation failed"): string => {
  const message = getErrorMessage(error) || defaultMessage;
  return message;
};

/**
 * Format API request with proper headers
 */
export const formatRequest = (data: any, isFormData = false) => {
  if (isFormData) {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (data[key] !== undefined && data[key] !== null) {
        if (data[key] instanceof File) {
          formData.append(key, data[key]);
        } else if (typeof data[key] === "object") {
          formData.append(key, JSON.stringify(data[key]));
        } else {
          formData.append(key, data[key]);
        }
      }
    });
    return formData;
  }
  return data;
};

/**
 * Build query string from params object
 */
export const buildQueryString = (params: Record<string, any>): string => {
  const queryParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      queryParams.append(key, String(value));
    }
  });

  const queryString = queryParams.toString();
  return queryString ? `?${queryString}` : "";
};

/**
 * Debounce function for search inputs
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * Retry failed API calls
 */
export const retryApiCall = async <T>(
  apiCall: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> => {
  let lastError: any;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await apiCall();
    } catch (error) {
      lastError = error;
      if (i < maxRetries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay * (i + 1)));
      }
    }
  }

  throw lastError;
};
