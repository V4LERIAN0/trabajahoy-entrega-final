export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatarUrl?: string | null;
  isActive?: boolean;
  isVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponseData {
  user: User;
  roles: string[];
  accessToken: string;
  refreshToken: string;
  company?: {
    id: string;
    name: string;
    [key: string]: any;
  };
}

export interface ApiResponse<T> {
  status: string;
  data: T;
  timestamp?: string;
  message?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterCandidateRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface RegisterCompanyRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  companyName: string;
  industry?: string;
  companySize?: string;
  website?: string;
  companyDescription?: string;
}