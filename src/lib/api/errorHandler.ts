import { AuthError } from '@supabase/supabase-js';

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

export function handleApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  if (error instanceof AuthError) {
    return new ApiError(error.message, 401, error.status.toString());
  }

  if (error instanceof Error) {
    return new ApiError(error.message);
  }

  return new ApiError('An unexpected error occurred');
}

export function isAuthError(error: unknown): boolean {
  return error instanceof AuthError || 
    (error instanceof ApiError && error.statusCode === 401);
}
