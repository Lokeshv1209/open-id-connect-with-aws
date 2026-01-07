/**
 * Organization related type definitions
 */

export interface OrganizationDomain {
  domainName: string;
  id?: string;
  verified?: boolean;
}

export interface Organization {
  organizationId: string;
  name: string;
  OrganizationDomains: OrganizationDomain[];
  description: string | null;
  status: "active" | "inactive" | string;
  totalUsers: number;
  activeUsers: string | number;
  inactiveUsers: string | number;
  logoUrl: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface OrganizationFormData {
  adminName: string;
  orgName: string;
  orgDomain: { value: string; edit: boolean }[];
  adminEmail: string;
  iconUrl?: string | File | null;
  status?: number;
}

export interface CreateOrganizationRequest {
  name: string;
  domains: string[];
  adminName: string;
  adminEmail: string;
  description?: string;
  logoUrl?: string;
}

export interface UpdateOrganizationRequest {
  name?: string;
  domains?: string[];
  description?: string;
  logoUrl?: string;
  status?: string;
}
