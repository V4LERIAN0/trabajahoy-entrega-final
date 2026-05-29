import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/auth.model';
import { Vacancy as VacancyModel, VacancyFilters } from '../models/vacancy.model';

@Injectable({
  providedIn: 'root'
})
export class VacancyService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getPublicVacancies(filters: VacancyFilters = {}): Observable<VacancyModel[]> {
    let params = new HttpParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, String(value));
      }
    });

    return this.http
      .get<ApiResponse<any>>(`${this.apiUrl}/vacancies`, { params })
      .pipe(map((response) => this.extractVacancyArray(response.data)));
  }

  getVacancyById(id: string): Observable<VacancyModel> {
    return this.http
      .get<ApiResponse<VacancyModel>>(`${this.apiUrl}/vacancies/${id}`)
      .pipe(map((response) => response.data));
  }

  getCompanyVacancies(): Observable<VacancyModel[]> {
    return this.http
      .get<ApiResponse<any>>(`${this.apiUrl}/vacancies/manage/all`)
      .pipe(map((response) => this.extractVacancyArray(response.data)));
  }

  getManagedVacancyById(id: string): Observable<VacancyModel> {
    return this.http
      .get<ApiResponse<VacancyModel>>(`${this.apiUrl}/vacancies/manage/${id}`)
      .pipe(map((response) => response.data));
  }

  createVacancy(data: Partial<VacancyModel>): Observable<VacancyModel> {
    return this.http
      .post<ApiResponse<VacancyModel>>(`${this.apiUrl}/vacancies`, data)
      .pipe(map((response) => response.data));
  }

  updateVacancy(id: string, data: Partial<VacancyModel>): Observable<VacancyModel> {
    return this.http
      .patch<ApiResponse<VacancyModel>>(`${this.apiUrl}/vacancies/${id}`, data)
      .pipe(map((response) => response.data));
  }

  closeVacancy(id: string): Observable<VacancyModel> {
    return this.http
      .patch<ApiResponse<VacancyModel>>(`${this.apiUrl}/vacancies/${id}/close`, {})
      .pipe(map((response) => response.data));
  }

  archiveVacancy(id: string): Observable<VacancyModel> {
    return this.http
      .patch<ApiResponse<VacancyModel>>(`${this.apiUrl}/vacancies/${id}/archive`, {})
      .pipe(map((response) => response.data));
  }

  deleteVacancy(id: string): Observable<void> {
    return this.http
      .delete<ApiResponse<void>>(`${this.apiUrl}/vacancies/${id}`)
      .pipe(map(() => undefined));
  }

  private extractVacancyArray(data: any): VacancyModel[] {
    if (Array.isArray(data)) {
      return data as VacancyModel[];
    }

    if (Array.isArray(data?.items)) {
      return data.items as VacancyModel[];
    }

    if (Array.isArray(data?.data)) {
      return data.data as VacancyModel[];
    }

    if (Array.isArray(data?.vacancies)) {
      return data.vacancies as VacancyModel[];
    }

    return [];
  }

  reopenVacancy(id: string): Observable<VacancyModel> {
  return this.http
    .patch<ApiResponse<VacancyModel>>(`${this.apiUrl}/vacancies/${id}`, {
      status: 'published'
    })
    .pipe(map((response) => response.data));
}
}