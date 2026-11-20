import type { Role } from '@prisma/client';
import type { Request } from 'express';

// Authenticated user payload attached to requests
export interface AuthPayload {
  userId: string;
  email: string;
  role: Role;
}

// Extend Express Request to include auth payload
export interface AuthenticatedRequest extends Request {
  user?: AuthPayload;
}

// Standard API response envelope
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}

// Pagination query parameters
export interface PaginationQuery {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Paginated response wrapper
export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

// Credential data returned to the client (password decrypted)
export interface CredentialResponse {
  id: string;
  title: string;
  username: string;
  password: string; // decrypted
  url: string | null;
  notes: string | null;
  categoryId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Encryption result from AES-256-GCM
export interface EncryptionResult {
  encrypted: string;
  iv: string;
  authTag: string;
}

// Token pair returned on login/refresh
export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}
