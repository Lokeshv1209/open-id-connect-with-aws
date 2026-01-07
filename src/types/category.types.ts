/**
 * Category type definitions
 */

export interface Category {
  categoryId: string;
  categoryName: string;
  description?: string;
  iconUrl?: string;
  color?: string;
  postCount?: number;
  quizCount?: number;
  status: "active" | "inactive";
  createdAt?: string;
  updatedAt?: string;
}

export interface TopCategory {
  categoryId: string;
  categoryName: string;
  postCount: number;
  percentage?: number;
}

export interface CategoryFormData {
  categoryName: string;
  description?: string;
  iconUrl?: string | File;
  color?: string;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
  iconUrl?: string;
  color?: string;
}

export interface UpdateCategoryRequest {
  name?: string;
  description?: string;
  iconUrl?: string;
  color?: string;
  status?: string;
}
