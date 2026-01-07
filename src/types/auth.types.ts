/**
 * Authentication related type definitions
 */

export type UserRole = "super_admin" | "org_admin";

export interface User {
  email: string;
  name: string;
  role: UserRole;
  userId?: string;
  mobile?: string;
  profileImage?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Organization {
  organizationId: string;
  name: string;
  domain: string;
  logoUrl: string;
  description: string;
  totalUsers?: number;
  activeUsers?: number;
  inactiveUsers?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthState {
  userInfo: User | null;
  orgInfo: Organization | null;
  token: AuthTokens;
}

export interface LoginRequest {
  email?: string;
  mobile?: string;
  password: string;
}

export interface LoginResponse {
  code: string;
  message?: string;
  data: {
    accessToken: string;
    refreshToken: string;
    userInfo: User;
    orgInfo?: Organization;
  };
}

export interface RefreshTokenResponse {
  code: number;
  data: AuthTokens;
}
