// Authentication
export const AUTH_ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Invalid email or password',
  USER_EXISTS: 'An account with this email already exists',
  WEAK_PASSWORD: 'Password must be at least 6 characters long',
  GENERIC_ERROR: 'An error occurred. Please try again',
} as const;

// Validation
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 6,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
} as const;

// API Routes
export const API_ROUTES = {
  AUTH: {
    SIGN_UP: '/auth/v1/signup',
    SIGN_IN: '/auth/v1/signin',
    SIGN_OUT: '/auth/v1/signout',
  },
  USERS: {
    PROFILE: '/users/profile',
    SETTINGS: '/users/settings',
  },
} as const;

// Navigation
export const ROUTES = {
  HOME: '/',
  SIGN_IN: '/signin',
  SIGN_UP: '/signup',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  DASHBOARD: '/dashboard',
  JOBS: '/jobs',
  CREATE_JOB: '/jobs/new',
  PROPOSALS: '/proposals',
  MESSAGES: '/messages',
  PAYMENTS: '/payments',
  PROFILE: '/profile',
  SETTINGS: '/settings',
} as const;

// Job Categories
export const JOB_CATEGORIES = [
  { id: 'design', name: 'Design' },
  { id: 'development', name: 'Development' },
  { id: 'marketing', name: 'Marketing' },
  { id: 'writing', name: 'Writing' },
] as const;

// User Roles
export const USER_ROLES = {
  CLIENT: 'client',
  VENDOR: 'vendor'
} as const;
