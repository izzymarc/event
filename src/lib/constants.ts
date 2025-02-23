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
  PROPOSALS: '/proposals',
  MESSAGES: '/messages',
  PAYMENTS: '/payments',
  PROFILE: '/profile',
  SETTINGS: '/settings',
} as const;

import { Home, Utensils, Mic, Camera, Palette, CalendarCheck, Users2, Headphones, Megaphone, Package } from 'lucide-react';

// Service Categories - Renamed and Updated
export const SERVICE_CATEGORIES = [
  { id: 'venue', name: 'Venue', icon: Home },
  { id: 'catering', name: 'Catering', icon: Utensils },
  { id: 'entertainment', name: 'Entertainment', icon: Mic },
  { id: 'photography', name: 'Photography & Videography', icon: Camera },
  { id: 'decor', name: 'Decor & Design', icon: Palette },
  { id: 'planning', name: 'Event Planning', icon: CalendarCheck },
  { id: 'staffing', name: 'Staffing & Support', icon: Users2 },
  { id: 'tech_av', name: 'Tech & AV', icon: Headphones },
  { id: 'marketing_pr', name: 'Marketing & PR', icon: Megaphone },
  { id: 'other_service', name: 'Other Services', icon: Package },
] as const;

// Event Types
export const EVENT_TYPES = [
    { id: 'wedding', name: 'Wedding' },
    { id: 'corporate', name: 'Corporate Event' },
    { id: 'conference', name: 'Conference' },
    { id: 'party', name: 'Party' },
    { id: 'festival', name: 'Festival' },
    { id: 'concert', name: 'Concert' },
    { id: 'seminar', name: 'Seminar' },
    { id: 'trade_show', name: 'Trade Show' },
    { id: 'virtual_event', name: 'Virtual Event' },
    { id: 'other_event', name: 'Other' },
] as const;
