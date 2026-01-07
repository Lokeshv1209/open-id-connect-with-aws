/**
 * Centralized route constants for the application
 * This ensures consistency across middleware, AuthGuard, and navigation
 */

export const ROUTES = {
  // Public routes
  HOME: "/",

  // Auth routes
  AUTH: {
    LOGIN: "/login",
    SIGNUP: "/signup",
    VERIFY: "/verify",
    WELCOME: "/welcome",
    FORGOT_PASSWORD: "/forgot-password",
  },

  // Dashboard routes
  DASHBOARD: {
    ROOT: "/dashboard",
    // Admin routes
    ADMIN: {
      FEEDS: "/feeds",
      USERS: "/users",
      QUESTIONNAIRES: "/questionnaires",
      SOLVED_QUIZ: "/solved-quiz",
    },
  },

  // Organization routes (planned)
  ORG: {
    ROOT: "/org",
  },

  // Error routes
  UNAUTHORIZED: "/unauthorized",

  // API routes
  API: {
    ROOT: "/api",
    TEST_MIDDLEWARE: "/api/test-middleware",
  },
} as const;

// Route groups for easier checking
export const PUBLIC_ROUTES = [
  ROUTES.HOME,
  ROUTES.AUTH.LOGIN,
  ROUTES.AUTH.SIGNUP,
  ROUTES.AUTH.VERIFY,
  ROUTES.AUTH.WELCOME,
  ROUTES.AUTH.FORGOT_PASSWORD,
] as const;

export const PROTECTED_ROUTES = [
  ROUTES.DASHBOARD.ROOT,
  ROUTES.DASHBOARD.ADMIN.FEEDS,
  ROUTES.DASHBOARD.ADMIN.USERS,
  ROUTES.DASHBOARD.ADMIN.QUESTIONNAIRES,
  ROUTES.DASHBOARD.ADMIN.SOLVED_QUIZ,
  ROUTES.ORG.ROOT,
] as const;

export const SUPER_ADMIN_ROUTES = [ROUTES.DASHBOARD.ROOT] as const;

export const ORG_ADMIN_ROUTES = [
  ROUTES.DASHBOARD.ADMIN.FEEDS,
  ROUTES.DASHBOARD.ADMIN.USERS,
  ROUTES.DASHBOARD.ADMIN.QUESTIONNAIRES,
  ROUTES.DASHBOARD.ADMIN.SOLVED_QUIZ,
] as const;

// Helper functions
export const isPublicRoute = (path: string): boolean => {
  return PUBLIC_ROUTES.some((route) => path.startsWith(route));
};

export const isProtectedRoute = (path: string): boolean => {
  return PROTECTED_ROUTES.some((route) => path.startsWith(route));
};

export const isSuperAdminRoute = (path: string): boolean => {
  return SUPER_ADMIN_ROUTES.some((route) => path.startsWith(route));
};

export const isOrgAdminRoute = (path: string): boolean => {
  return ORG_ADMIN_ROUTES.some((route) => path.startsWith(route));
};
