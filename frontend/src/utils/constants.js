// utils/constants.js

// User Roles
export const USER_ROLES = {
  PATIENT: 'patient',
  DOCTOR: 'doctor', 
  ADMIN: 'admin',
  SUPER_ADMIN: 'superadmin'
};

// Role Hierarchy (higher number = more permissions)
export const ROLE_HIERARCHY = {
  [USER_ROLES.PATIENT]: 0,
  [USER_ROLES.DOCTOR]: 1,
  [USER_ROLES.ADMIN]: 2,
  [USER_ROLES.SUPER_ADMIN]: 3
};

// Dashboard Routes
export const DASHBOARD_ROUTES = {
  [USER_ROLES.PATIENT]: '/dashboard/patient',
  [USER_ROLES.DOCTOR]: '/dashboard/doctor',
  [USER_ROLES.ADMIN]: '/dashboard/admin',
  [USER_ROLES.SUPER_ADMIN]: '/dashboard/super-admin'
};

// API Endpoints
export const API_ENDPOINTS = {
  LOGIN: '/login',
  REFRESH: '/refresh',
  LOGOUT: '/logout',
  SIGNUP: '/patient/signup',
  PROFILE: '/user/profile',
  DOCTORS: '/doctors',
  HOSPITALS: '/hospitals',
  CHAT: '/chat',
  RECORDS: '/records'
};

// Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'wehelp_token',
  REFRESH_TOKEN: 'wehelp_refresh_token',
  USER: 'wehelp_user'
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  INVALID_CREDENTIALS: 'Invalid credentials. Please try again.',
  TOKEN_EXPIRED: 'Your session has expired. Please login again.',
  UNAUTHORIZED: 'You are not authorized to access this resource.',
  SERVER_ERROR: 'Something went wrong. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.'
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logout successful',
  PROFILE_UPDATED: 'Profile updated successfully',
  PASSWORD_CHANGED: 'Password changed successfully'
};

// Form Validation Rules
export const VALIDATION_RULES = {
  EMAIL: {
    REQUIRED: 'Email is required',
    INVALID: 'Please enter a valid email address',
    REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  PASSWORD: {
    REQUIRED: 'Password is required',
    MIN_LENGTH: 'Password must be at least 8 characters',
    WEAK: 'Password should contain uppercase, lowercase, number and special character'
  },
  NAME: {
    REQUIRED: 'Name is required',
    MIN_LENGTH: 'Name must be at least 2 characters',
    MAX_LENGTH: 'Name cannot exceed 50 characters'
  },
  PHONE: {
    REQUIRED: 'Phone number is required',
    INVALID: 'Please enter a valid phone number'
  }
};

// Navigation Menu Items by Role
export const NAVIGATION_MENU = {
  [USER_ROLES.PATIENT]: [
    { name: 'Dashboard', path: '/dashboard/patient', icon: 'home' },
    { name: 'Chat', path: '/chat', icon: 'message-square' },
    { name: 'Records', path: '/records', icon: 'file-text' },
    { name: 'Settings', path: '/settings', icon: 'settings' }
  ],
  [USER_ROLES.DOCTOR]: [
    { name: 'Dashboard', path: '/dashboard/doctor', icon: 'home' },
    { name: 'Chat', path: '/chat', icon: 'message-square' },
    { name: 'Patients', path: '/patients', icon: 'users' },
    { name: 'Settings', path: '/settings', icon: 'settings' }
  ],
  [USER_ROLES.ADMIN]: [
    { name: 'Dashboard', path: '/dashboard/admin', icon: 'home' },
    { name: 'Doctors', path: '/doctors', icon: 'user-check' },
    { name: 'Patients', path: '/patients', icon: 'users' },
    { name: 'Reports', path: '/reports', icon: 'bar-chart' },
    { name: 'Settings', path: '/settings', icon: 'settings' }
  ],
  [USER_ROLES.SUPER_ADMIN]: [
    { name: 'Dashboard', path: '/dashboard/super-admin', icon: 'home' },
    { name: 'Hospitals', path: '/hospitals', icon: 'building' },
    { name: 'Admins', path: '/admins', icon: 'shield' },
    { name: 'Analytics', path: '/analytics', icon: 'trending-up' },
    { name: 'Settings', path: '/settings', icon: 'settings' }
  ]
};

// Theme Colors
export const THEME_COLORS = {
  PRIMARY: '#0f766e', // teal-700
  SECONDARY: '#14b8a6', // teal-500
  SUCCESS: '#10b981', // emerald-500
  ERROR: '#ef4444', // red-500
  WARNING: '#f59e0b', // amber-500
  INFO: '#3b82f6' // blue-500
};