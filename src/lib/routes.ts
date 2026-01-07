/**
 * Application route constants and utilities
 */

import type { UserRole } from "@/types/auth.types";

// Public routes (no authentication required)
export const PUBLIC_ROUTES = [
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/verify",
  "/welcome",
] as const;

// Protected routes by role
export const ROLE_ROUTES = {
  super_admin: {
    default: "/dashboard",
    allowed: ["/dashboard", "/settings", "/admin"],
  },
  org_admin: {
    default: "/questionnaires",
    allowed: ["/questionnaires", "/solved-quiz", "/users", "/feeds"],
  },
} as const;

// API routes (excluded from middleware)
export const API_ROUTES = ["/api", "/_next", "/favicon.ico"] as const;

/**
 * Get default route for a user role
 */
export const getDefaultRouteForRole = (role?: UserRole | string | null): string => {
  if (!role) return "/login";

  switch (role) {
    case "super_admin":
      return ROLE_ROUTES.super_admin.default;
    case "org_admin":
      return ROLE_ROUTES.org_admin.default;
    default:
      return "/login";
  }
};

/**
 * Check if a route is public
 */
export const isPublicRoute = (path: string): boolean => {
  return PUBLIC_ROUTES.some((route) => path.startsWith(route));
};

/**
 * Check if a route is protected
 */
export const isProtectedRoute = (path: string): boolean => {
  return !isPublicRoute(path) && !isApiRoute(path);
};

/**
 * Check if a route is an API route
 */
export const isApiRoute = (path: string): boolean => {
  return API_ROUTES.some((route) => path.startsWith(route));
};

/**
 * Check if a user role has access to a route
 */
export const hasRoleAccess = (role: UserRole | string, path: string): boolean => {
  if (!role) return false;

  const roleConfig = ROLE_ROUTES[role as keyof typeof ROLE_ROUTES];
  if (!roleConfig) return false;

  return roleConfig.allowed.some((route) => path.startsWith(route));
};

/**
 * Get redirect URL for unauthorized access
 */
export const getUnauthorizedRedirect = (role?: UserRole | string | null): string => {
  if (!role) return "/login";
  return "/unauthorized";
};

/**
 * Build absolute URL
 */
export const buildUrl = (path: string, baseUrl?: string): string => {
  const base = baseUrl || (typeof window !== "undefined" ? window.location.origin : "");
  return `${base}${path}`;
};
