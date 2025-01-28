import { AuthError } from '@supabase/supabase-js';

// Custom error class for API errors
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Function to handle API errors
export function handleApiError(error: unknown): ApiError {
  // If error is already an ApiError, return it
  if (error instanceof ApiError) {
    return error;
  }

  // If error is an AuthError, create a new ApiError with 401 status
  if (error instanceof AuthError) {
    return new ApiError(error.message, 401, error.status.toString());
  }

  // If error is a generic Error, create a new ApiError with the message
  if (error instanceof Error) {
    return new ApiError(error.message);
  }

  // If error is unknown, create a generic ApiError
  return new ApiError('An unexpected error occurred');
}

// Function to check if an error is an authentication error
export function isAuthError(error: unknown): boolean {
  return error instanceof AuthError || 
    (error instanceof ApiError && error.statusCode === 401);
}
