/**
 * Routing Module
 * Centralized route definitions and navigation utilities for the application
 */

/**
 * Route path constants
 * All route paths are defined here for type safety and easy maintenance
 */
export const ROUTES = {
  // Authentication routes
  LOGIN: '/login',
  SIGNUP: '/signup',
  MEMBER_LOGIN: '/member-login',
  MEMBER_SIGNUP: '/member-signup',
  FORGOT_PASSWORD: '/forgot-password',
  
  // Main app routes
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  REPORTS: '/reports',
  MODAL: '/modal',
  
  // Members routes
  MEMBERS: '/members',
  MEMBERS_INDEX: '/members',
  MEMBERS_ADD: '/members/add',
  MEMBERS_DETAIL: (id: string) => `/members/${id}`,
  
  // Collections routes
  COLLECTIONS: '/collections',
  COLLECTIONS_INDEX: '/collections',
  
  // Expenses routes
  EXPENSES: '/expenses',
  EXPENSES_INDEX: '/expenses',
  
  // Root route
  ROOT: '/',
  INDEX: '/',
} as const;

/**
 * Route names (matching Expo Router screen names)
 */
export const ROUTE_NAMES = {
  LOGIN: 'login',
  SIGNUP: 'signup',
  MEMBER_LOGIN: 'member-login',
  MEMBER_SIGNUP: 'member-signup',
  FORGOT_PASSWORD: 'forgot-password',
  DASHBOARD: 'dashboard',
  PROFILE: 'profile',
  SETTINGS: 'settings',
  REPORTS: 'reports',
  MODAL: 'modal',
  MEMBERS_INDEX: 'members/index',
  MEMBERS_ADD: 'members/add',
  MEMBERS_DETAIL: 'members/[id]',
  COLLECTIONS_INDEX: 'collections/index',
  EXPENSES_INDEX: 'expenses/index',
  INDEX: 'index',
} as const;

/**
 * Route configuration interface
 */
export interface RouteConfig {
  path: string;
  name: string;
  title: string;
  requiresAuth?: boolean;
  roles?: string[];
}

/**
 * Route configurations with metadata
 */
export const ROUTE_CONFIGS: Record<string, RouteConfig> = {
  LOGIN: {
    path: ROUTES.LOGIN,
    name: ROUTE_NAMES.LOGIN,
    title: 'Login',
    requiresAuth: false,
  },
  SIGNUP: {
    path: ROUTES.SIGNUP,
    name: ROUTE_NAMES.SIGNUP,
    title: 'Sign Up',
    requiresAuth: false,
  },
  MEMBER_LOGIN: {
    path: ROUTES.MEMBER_LOGIN,
    name: ROUTE_NAMES.MEMBER_LOGIN,
    title: 'Member Login',
    requiresAuth: false,
  },
  MEMBER_SIGNUP: {
    path: ROUTES.MEMBER_SIGNUP,
    name: ROUTE_NAMES.MEMBER_SIGNUP,
    title: 'Member Sign Up',
    requiresAuth: false,
  },
  FORGOT_PASSWORD: {
    path: ROUTES.FORGOT_PASSWORD,
    name: ROUTE_NAMES.FORGOT_PASSWORD,
    title: 'Forgot Password',
    requiresAuth: false,
  },
  DASHBOARD: {
    path: ROUTES.DASHBOARD,
    name: ROUTE_NAMES.DASHBOARD,
    title: 'Dashboard',
    requiresAuth: true,
  },
  PROFILE: {
    path: ROUTES.PROFILE,
    name: ROUTE_NAMES.PROFILE,
    title: 'Profile',
    requiresAuth: true,
  },
  SETTINGS: {
    path: ROUTES.SETTINGS,
    name: ROUTE_NAMES.SETTINGS,
    title: 'Settings',
    requiresAuth: true,
    roles: ['admin'],
  },
  REPORTS: {
    path: ROUTES.REPORTS,
    name: ROUTE_NAMES.REPORTS,
    title: 'Reports',
    requiresAuth: true,
  },
  MEMBERS: {
    path: ROUTES.MEMBERS,
    name: ROUTE_NAMES.MEMBERS_INDEX,
    title: 'Members',
    requiresAuth: true,
  },
  MEMBERS_ADD: {
    path: ROUTES.MEMBERS_ADD,
    name: ROUTE_NAMES.MEMBERS_ADD,
    title: 'Add Member',
    requiresAuth: true,
  },
  MEMBERS_DETAIL: {
    path: ROUTES.MEMBERS_DETAIL(''),
    name: ROUTE_NAMES.MEMBERS_DETAIL,
    title: 'Member Details',
    requiresAuth: true,
  },
  COLLECTIONS: {
    path: ROUTES.COLLECTIONS,
    name: ROUTE_NAMES.COLLECTIONS_INDEX,
    title: 'Collections',
    requiresAuth: true,
  },
  EXPENSES: {
    path: ROUTES.EXPENSES,
    name: ROUTE_NAMES.EXPENSES_INDEX,
    title: 'Expenses',
    requiresAuth: true,
  },
  MODAL: {
    path: ROUTES.MODAL,
    name: ROUTE_NAMES.MODAL,
    title: 'Modal',
    requiresAuth: false,
  },
};

/**
 * Navigation helper functions
 * These can be used with expo-router's useRouter hook
 */
export const navigationHelpers = {
  /**
   * Get route path by key
   */
  getRoute: (key: keyof typeof ROUTES): string => {
    const route = ROUTES[key];
    if (typeof route === 'function') {
      throw new Error(`Route ${key} requires parameters. Use the specific helper function instead.`);
    }
    return route;
  },
  
  /**
   * Get member detail route
   */
  getMemberDetailRoute: (id: string): string => {
    return ROUTES.MEMBERS_DETAIL(id);
  },
  
  /**
   * Check if route requires authentication
   */
  requiresAuth: (path: string): boolean => {
    const config = Object.values(ROUTE_CONFIGS).find(c => c.path === path);
    return config?.requiresAuth ?? false;
  },
  
  /**
   * Check if route is accessible by role
   */
  isAccessibleByRole: (path: string, role?: string): boolean => {
    const config = Object.values(ROUTE_CONFIGS).find(c => c.path === path);
    if (!config) return false;
    if (!config.roles || config.roles.length === 0) return true;
    return role ? config.roles.includes(role) : false;
  },
  
  /**
   * Get route title
   */
  getRouteTitle: (path: string): string => {
    const config = Object.values(ROUTE_CONFIGS).find(c => c.path === path);
    return config?.title ?? 'Unknown';
  },
};

/**
 * Type definitions for route paths
 */
export type RoutePath = typeof ROUTES[keyof typeof ROUTES];
export type RouteName = typeof ROUTE_NAMES[keyof typeof ROUTE_NAMES];

/**
 * Default export with all route utilities
 */
export default {
  ROUTES,
  ROUTE_NAMES,
  ROUTE_CONFIGS,
  navigationHelpers,
};

