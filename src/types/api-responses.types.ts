/**
 * API Response Types
 * Standardized response structures for all API endpoints
 */

// Base response structure
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Auth API responses
export interface LoginRequest {
  email?: string;
  mobile?: string;
  password: string;
}

export interface LoginResponse {
  user: {
    userId: string;
    email: string;
    name: string;
    role: string;
  };
  organization?: {
    organizationId: string;
    name: string;
    domain: string;
    logoUrl?: string;
    description?: string;
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface ActivateRequest {
  password: string;
  token: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

// User API responses
export interface User {
  userId: string;
  name: string;
  email: string;
  mobile?: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GetUsersRequest {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
}

export interface GetSolvedUsersRequest {
  quizId: string;
  page?: number;
  limit?: number;
}

// Organization API responses
export interface Organization {
  organizationId: string;
  name: string;
  domain: string;
  logoUrl?: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrgRequest {
  name: string;
  domain: string;
  logoUrl?: string;
  description?: string;
}

export interface UpdateOrgRequest extends Partial<CreateOrgRequest> {
  organizationId: string;
}

export interface GetOrgsRequest {
  page?: number;
  limit?: number;
  search?: string;
}

// Category API responses
export interface Category {
  categoryId: string;
  name: string;
  description?: string;
  imageUrl?: string;
  organizationId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
  imageUrl?: string;
  organizationId: string;
}

export interface UpdateCategoryRequest extends Partial<CreateCategoryRequest> {
  categoryId: string;
}

export interface GetCategoriesRequest {
  organizationId?: string;
  page?: number;
  limit?: number;
  search?: string;
}

// Quiz API responses
export interface QuizOption {
  value: string;
  isCorrect?: boolean;
}

export interface QuizQuestion {
  questionId?: string;
  question: string;
  options: QuizOption[];
  correctAnswer?: string;
  explanation?: string;
}

export interface Quiz {
  quizId: string;
  title: string;
  description?: string;
  categoryId: string;
  questions: QuizQuestion[];
  timeLimit?: number;
  passingScore?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateQuizRequest {
  title: string;
  description?: string;
  categoryId: string;
  questions: QuizQuestion[];
  timeLimit?: number;
  passingScore?: number;
}

export interface GetQuizCategoriesRequest {
  page?: number;
  limit?: number;
  search?: string;
}

export interface QuizResponse {
  responseId: string;
  quizId: string;
  userId: string;
  answers: {
    questionId: string;
    selectedOption: string;
    isCorrect: boolean;
  }[];
  score: number;
  completedAt: string;
}

export interface GetQuizResponsesRequest {
  quizId?: string;
  userId?: string;
  page?: number;
  limit?: number;
}

// Error response
export interface ApiError {
  code: number;
  message: string;
  details?: any;
}
