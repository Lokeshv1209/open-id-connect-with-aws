/**
 * Custom hook for authentication management
 * Provides centralized auth logic and utilities
 */

import { useRouter } from "next/navigation";
import { useCallback } from "react";

import { clearGlobalSearch } from "@/store/slice/GlobalSearchSlice";
import { clearInfo } from "@/store/slice/userDetails";
import type { UserRole } from "@/types/auth.types";

import { useAppDispatch, useAppSelector } from "./reduxHook";

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { userInfo, token, orgInfo } = useAppSelector((state) => state.userDetails);

  // Authentication status
  const isAuthenticated = !!token.accessToken;
  const isSuperAdmin = userInfo?.role === "super_admin";
  const isOrgAdmin = userInfo?.role === "org_admin";

  // Get default route based on role
  const getDefaultRoute = useCallback((role?: UserRole | string) => {
    switch (role) {
      case "super_admin":
        return "/dashboard";
      case "org_admin":
        return "/questionnaires";
      default:
        return "/login";
    }
  }, []);

  // Navigate based on user role
  const navigateBasedOnRole = useCallback(() => {
    const route = getDefaultRoute(userInfo?.role);
    router.push(route);
  }, [userInfo?.role, router, getDefaultRoute]);

  // Logout function
  const logout = useCallback(() => {
    dispatch(clearInfo());
    dispatch(clearGlobalSearch());
    localStorage.removeItem("persist:root");
    router.push("/login");
  }, [dispatch, router]);

  // Check if user has access to a specific route
  const hasAccessToRoute = useCallback(
    (path: string) => {
      if (!isAuthenticated) return false;

      const superAdminRoutes = ["/dashboard"];
      const orgAdminRoutes = ["/feeds", "/users", "/questionnaires", "/solved-quiz"];

      if (isSuperAdmin) {
        return superAdminRoutes.some((route) => path.startsWith(route));
      }

      if (isOrgAdmin) {
        return orgAdminRoutes.some((route) => path.startsWith(route));
      }

      return false;
    },
    [isAuthenticated, isSuperAdmin, isOrgAdmin]
  );

  return {
    // User data
    userInfo,
    token,
    orgInfo,

    // Auth status
    isAuthenticated,
    isSuperAdmin,
    isOrgAdmin,

    // Functions
    navigateBasedOnRole,
    getDefaultRoute,
    logout,
    hasAccessToRoute,
  };
};

export default useAuth;
