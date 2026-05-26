import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ApiResponse,
  AuthResponseData,
  LoginRequest,
  RegisterCandidateRequest,
  RegisterCompanyRequest,
  User
} from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private readonly apiUrl = environment.apiUrl;

  currentUser = signal<User | null>(this.getStoredUser());
  currentRoles = signal<string[]>(this.getStoredRoles());

  constructor(private http: HttpClient) {}

  login(data: LoginRequest): Observable<ApiResponse<AuthResponseData>> {
    return this.http
      .post<ApiResponse<AuthResponseData>>(`${this.apiUrl}/auth/login`, data)
      .pipe(tap((response) => this.saveSession(response.data)));
  }

  registerCandidate(data: RegisterCandidateRequest): Observable<ApiResponse<AuthResponseData>> {
    return this.http
      .post<ApiResponse<AuthResponseData>>(`${this.apiUrl}/auth/register`, data)
      .pipe(tap((response) => this.saveSession(response.data)));
  }

  registerCompany(data: RegisterCompanyRequest): Observable<ApiResponse<AuthResponseData>> {
    return this.http
      .post<ApiResponse<AuthResponseData>>(`${this.apiUrl}/auth/register-company`, data)
      .pipe(tap((response) => this.saveSession(response.data)));
  }

  me(): Observable<ApiResponse<{ user: User; roles: string[] }>> {
    return this.http.get<ApiResponse<{ user: User; roles: string[] }>>(`${this.apiUrl}/auth/me`);
  }

  saveSession(data: AuthResponseData): void {
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('currentUser', JSON.stringify(data.user));
    localStorage.setItem('roles', JSON.stringify(data.roles));

    if (data.company) {
      localStorage.setItem('company', JSON.stringify(data.company));
    }

    this.currentUser.set(data.user);
    this.currentRoles.set(data.roles);
  }

  logout(): void {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('currentUser');
  localStorage.removeItem('roles');
  localStorage.removeItem('company');
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('current_user');

  this.currentUser.set(null);
  this.currentRoles.set([]);
}

  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  getStoredUser(): User | null {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }

  getStoredRoles(): string[] {
    const roles = localStorage.getItem('roles');
    return roles ? JSON.parse(roles) : [];
  }

  getCompany(): any | null {
    const company = localStorage.getItem('company');
    return company ? JSON.parse(company) : null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  hasRole(role: string): boolean {
    return this.currentRoles().includes(role);
  }

  isCandidate(): boolean {
    return this.currentRoles().includes('candidate');
  }

  isCompanyUser(): boolean {
    const roles = this.currentRoles();
    return roles.includes('recruiter') || roles.includes('company_admin');
  }

  isAdmin(): boolean {
    return this.currentRoles().includes('admin');
  }

  getDefaultRedirect(): string {
    if (this.isAdmin()) {
      return '/admin/dashboard';
    }

    if (this.isCompanyUser()) {
      return '/company/vacancies';
    }

    if (this.isCandidate()) {
      return '/jobs';
    }

    return '/jobs';
  }
}