import { createSelector } from "@reduxjs/toolkit";

import type { RootState } from "../store";

// User Details Selectors
export const selectUserDetails = (state: RootState) => state.userDetails;
export const selectUserInfo = (state: RootState) => state.userDetails.userInfo;
export const selectOrgInfo = (state: RootState) => state.userDetails.orgInfo;
export const selectTokenInfo = (state: RootState) => state.userDetails.token;

// Memoized selector for user authentication status
export const selectIsAuthenticated = createSelector([selectTokenInfo], (token) =>
  Boolean(token.accessToken && token.refreshToken)
);

// Memoized selector for user role
export const selectUserRole = createSelector([selectUserInfo], (userInfo) => userInfo.role);

// Memoized selector for checking if user is super admin
export const selectIsSuperAdmin = createSelector(
  [selectUserRole],
  (role) => role === "super_admin"
);

// Memoized selector for checking if user is org admin
export const selectIsOrgAdmin = createSelector([selectUserRole], (role) => role === "org_admin");

// Memoized selector for user display name
export const selectUserDisplayName = createSelector(
  [selectUserInfo],
  (userInfo) => userInfo.name || userInfo.email || "User"
);

// Global Search Selectors
export const selectGlobalSearch = (state: RootState) => state.GlobalSearch;
export const selectNavBarSearch = (state: RootState) => state.GlobalSearch.NavBarSearch;

// Memoized selector for search results (can be extended with actual search logic)
export const selectSearchResults = createSelector([selectNavBarSearch], (searchTerm) => {
  // This is a placeholder - implement actual search logic based on your needs
  if (!searchTerm) return [];
  return [];
});

// Combined selectors for common use cases
export const selectAuthState = createSelector(
  [selectIsAuthenticated, selectUserInfo, selectOrgInfo],
  (isAuthenticated, userInfo, orgInfo) => ({
    isAuthenticated,
    userInfo,
    orgInfo,
  })
);

// Memoized selector for user permissions
export const selectUserPermissions = createSelector(
  [selectUserRole, selectOrgInfo],
  (role, orgInfo) => ({
    canAccessDashboard: role === "super_admin",
    canManageUsers: role === "org_admin" || role === "super_admin",
    canManageOrganization: role === "super_admin",
    canManageQuizzes: role === "org_admin" || role === "super_admin",
    canViewReports: role === "org_admin" || role === "super_admin",
    organizationId: orgInfo.organizationId,
  })
);

// Export all selectors as a namespace for easier imports
export const selectors = {
  // User selectors
  selectUserDetails,
  selectUserInfo,
  selectOrgInfo,
  selectTokenInfo,
  selectIsAuthenticated,
  selectUserRole,
  selectIsSuperAdmin,
  selectIsOrgAdmin,
  selectUserDisplayName,
  selectAuthState,
  selectUserPermissions,

  // Search selectors
  selectGlobalSearch,
  selectNavBarSearch,
  selectSearchResults,
};
