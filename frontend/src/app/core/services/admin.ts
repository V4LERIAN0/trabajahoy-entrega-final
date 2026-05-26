import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, forkJoin, map, of, catchError } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AdminDashboardStats {
  totalUsers: number;
  totalCompanies: number;
  totalVacancies: number;
  totalApplications: number;
  activeUsers: number;
  verifiedCompanies: number;
  publishedVacancies: number;
  pendingApplications: number;
  [key: string]: any;
}

export interface AdminRole {
  id: string;
  name: string;
  description?: string;
  userCount?: number;
  createdAt?: string;
}

export interface AdminUser {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  isActive?: boolean;
  isVerified?: boolean;
  roles?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateAdminUserRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  isActive?: boolean;
  isVerified?: boolean;
  roles?: string[];
}

export interface UpdateAdminUserRequest {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  isActive?: boolean;
  isVerified?: boolean;
  roles?: string[];
}

export interface AdminCompany {
  id: string;
  ownerId: string;
  name: string;
  description?: string | null;
  website?: string | null;
  industry?: string | null;
  size?: string | null;
  logoUrl?: string | null;
  coverUrl?: string | null;
  email?: string | null;
  phone?: string | null;
  isVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
  owner?: {
    id: string;
    email: string;
    firstName?: string | null;
    lastName?: string | null;
    phone?: string | null;
  } | null;
  members?: any[];
}

export interface CreateAdminCompanyRequest {
  ownerId: string;
  name: string;
  description?: string;
  website?: string;
  industry?: string;
  size?: string;
  logoUrl?: string;
  coverUrl?: string;
  email?: string;
  phone?: string;
  isVerified?: boolean;
}

export interface UpdateAdminCompanyRequest {
  ownerId?: string;
  name?: string;
  description?: string;
  website?: string;
  industry?: string;
  size?: string;
  logoUrl?: string;
  coverUrl?: string;
  email?: string;
  phone?: string;
  isVerified?: boolean;
}

export interface AdminPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AdminListResponse<T> {
  data: T[];
  pagination: AdminPagination;
}

interface ApiResponse<T> {
  data: T;
  pagination?: AdminPagination;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getDashboard(): Observable<AdminDashboardStats> {
    return forkJoin({
      dashboard: this.http
        .get<ApiResponse<any>>(`${this.apiUrl}/admin/dashboard`)
        .pipe(
          map((response) => response.data || {}),
          catchError(() => of({}))
        ),

      users: this.getUsers(1, 100).pipe(
        map((response) => response.data),
        catchError(() => of([]))
      ),

      companies: this.getCompanies(1, 100).pipe(
        map((response) => response.data),
        catchError(() => of([]))
      ),
    }).pipe(
      map(({ dashboard, users, companies }) => {
        const dashboardStats = this.normalizeDashboardStats(dashboard);

        return {
          totalUsers: dashboardStats.totalUsers || users.length,
          totalCompanies: dashboardStats.totalCompanies || companies.length,
          totalVacancies: dashboardStats.totalVacancies || 0,
          totalApplications: dashboardStats.totalApplications || 0,

          activeUsers:
            dashboardStats.activeUsers ||
            users.filter((user) => user.isActive !== false).length,

          verifiedCompanies:
            dashboardStats.verifiedCompanies ||
            companies.filter((company) => company.isVerified === true).length,

          publishedVacancies: dashboardStats.publishedVacancies || 0,
          pendingApplications: dashboardStats.pendingApplications || 0,
        };
      })
    );
  }

  getRoles(): Observable<AdminRole[]> {
    return this.http
      .get<ApiResponse<AdminRole[]>>(`${this.apiUrl}/admin/roles`)
      .pipe(map((response) => response.data || []));
  }

  getUsers(page = 1, limit = 10, search = ''): Observable<AdminListResponse<AdminUser>> {
    let params = new HttpParams()
      .set('page', page)
      .set('limit', limit);

    if (search.trim()) {
      params = params.set('search', search.trim());
    }

    return this.http
      .get<ApiResponse<AdminUser[]>>(`${this.apiUrl}/admin/users`, { params })
      .pipe(
        map((response) => ({
          data: response.data || [],
          pagination: this.normalizePagination(response.pagination, page, limit, response.data?.length || 0),
        }))
      );
  }

  createUser(payload: CreateAdminUserRequest): Observable<AdminUser> {
    return this.http
      .post<ApiResponse<AdminUser>>(`${this.apiUrl}/admin/users`, payload)
      .pipe(map((response) => response.data));
  }

  updateUser(userId: string, payload: UpdateAdminUserRequest): Observable<AdminUser> {
    return this.http
      .patch<ApiResponse<AdminUser>>(`${this.apiUrl}/admin/users/${userId}`, payload)
      .pipe(map((response) => response.data));
  }

  deleteUser(userId: string): Observable<AdminUser> {
    return this.http
      .delete<ApiResponse<AdminUser>>(`${this.apiUrl}/admin/users/${userId}`)
      .pipe(map((response) => response.data));
  }

  getCompanies(page = 1, limit = 10, search = '', industry = ''): Observable<AdminListResponse<AdminCompany>> {
    let params = new HttpParams()
      .set('page', page)
      .set('limit', limit);

    if (search.trim()) {
      params = params.set('search', search.trim());
    }

    if (industry.trim()) {
      params = params.set('industry', industry.trim());
    }

    return this.http
      .get<ApiResponse<AdminCompany[]>>(`${this.apiUrl}/admin/companies`, { params })
      .pipe(
        map((response) => ({
          data: response.data || [],
          pagination: this.normalizePagination(response.pagination, page, limit, response.data?.length || 0),
        }))
      );
  }

  createCompany(payload: CreateAdminCompanyRequest): Observable<AdminCompany> {
    return this.http
      .post<ApiResponse<AdminCompany>>(`${this.apiUrl}/admin/companies`, payload)
      .pipe(map((response) => response.data));
  }

  updateCompany(companyId: string, payload: UpdateAdminCompanyRequest): Observable<AdminCompany> {
    return this.http
      .patch<ApiResponse<AdminCompany>>(`${this.apiUrl}/admin/companies/${companyId}`, payload)
      .pipe(map((response) => response.data));
  }

  deleteCompany(companyId: string): Observable<{ id: string; deleted: boolean }> {
    return this.http
      .delete<ApiResponse<{ id: string; deleted: boolean }>>(`${this.apiUrl}/admin/companies/${companyId}`)
      .pipe(map((response) => response.data));
  }

  private normalizeDashboardStats(data: any): Partial<AdminDashboardStats> {
    const source = data?.stats || data?.dashboard || data || {};

    return {
      totalUsers: this.toNumber(
        source.totalUsers,
        source.users,
        source.userCount,
        source.total_users
      ),
      totalCompanies: this.toNumber(
        source.totalCompanies,
        source.companies,
        source.companyCount,
        source.total_companies
      ),
      totalVacancies: this.toNumber(
        source.totalVacancies,
        source.vacancies,
        source.vacancyCount,
        source.total_vacancies
      ),
      totalApplications: this.toNumber(
        source.totalApplications,
        source.applications,
        source.applicationCount,
        source.total_applications
      ),
      activeUsers: this.toNumber(
        source.activeUsers,
        source.active_users
      ),
      verifiedCompanies: this.toNumber(
        source.verifiedCompanies,
        source.verified_companies
      ),
      publishedVacancies: this.toNumber(
        source.publishedVacancies,
        source.published_vacancies
      ),
      pendingApplications: this.toNumber(
        source.pendingApplications,
        source.pending_applications
      ),
    };
  }

  private normalizePagination(
    pagination: AdminPagination | undefined,
    page: number,
    limit: number,
    fallbackTotal: number
  ): AdminPagination {
    return {
      total: pagination?.total ?? fallbackTotal,
      page: pagination?.page ?? page,
      limit: pagination?.limit ?? limit,
      totalPages: pagination?.totalPages ?? Math.max(1, Math.ceil(fallbackTotal / limit)),
    };
  }

  private toNumber(...values: any[]): number {
    for (const value of values) {
      if (value !== undefined && value !== null && value !== '') {
        const numberValue = Number(value);

        if (!Number.isNaN(numberValue)) {
          return numberValue;
        }
      }
    }

    return 0;
  }
}