import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/auth.model';
import {
  ApplicationComment,
  ApplicationHistoryItem,
  ApplyJobRequest,
  ChangeApplicationStatusRequest,
  JobApplication,
  ScheduleInterviewRequest
} from '../models/application.model';

@Injectable({
  providedIn: 'root',
})
export class ApplicationService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  applyToJob(data: ApplyJobRequest): Observable<JobApplication> {
    return this.http
      .post<ApiResponse<JobApplication>>(`${this.apiUrl}/applications`, data)
      .pipe(map((response) => response.data));
  }

  getMyApplications(): Observable<JobApplication[]> {
    return this.http
      .get<ApiResponse<any>>(`${this.apiUrl}/applications`)
      .pipe(map((response) => this.extractApplicationArray(response.data)));
  }

  getApplicationById(applicationId: string): Observable<JobApplication> {
    return this.http
      .get<ApiResponse<JobApplication>>(`${this.apiUrl}/applications/${applicationId}`)
      .pipe(map((response) => response.data));
  }

  getApplicantsByVacancy(vacancyId: string): Observable<JobApplication[]> {
    return this.http
      .get<ApiResponse<any>>(`${this.apiUrl}/applications/vacancies/${vacancyId}/applicants`)
      .pipe(map((response) => this.extractApplicationArray(response.data)));
  }

  changeApplicationStatus(
    applicationId: string,
    data: ChangeApplicationStatusRequest,
  ): Observable<JobApplication> {
    return this.http
      .post<
        ApiResponse<JobApplication>
      >(`${this.apiUrl}/applications/${applicationId}/status`, data)
      .pipe(map((response) => response.data));
  }

  scheduleInterview(
    applicationId: string,
    data: ScheduleInterviewRequest,
  ): Observable<JobApplication> {
    return this.http
      .post<
        ApiResponse<JobApplication>
      >(`${this.apiUrl}/applications/${applicationId}/interview`, data)
      .pipe(map((response) => response.data));
  }

  getApplicationHistory(applicationId: string): Observable<ApplicationHistoryItem[]> {
    return this.http
      .get<ApiResponse<any>>(`${this.apiUrl}/applications/${applicationId}/history`)
      .pipe(map((response) => this.extractHistoryArray(response.data)));
  }

  getApplicationComments(applicationId: string): Observable<ApplicationComment[]> {
    return this.http
      .get<ApiResponse<any>>(`${this.apiUrl}/applications/${applicationId}/comments`)
      .pipe(map((response) => this.extractCommentArray(response.data)));
  }

  addApplicationComment(applicationId: string, content: string): Observable<ApplicationComment> {
    return this.http
      .post<ApiResponse<ApplicationComment>>(
        `${this.apiUrl}/applications/${applicationId}/comments`,
        {
          content,
        },
      )
      .pipe(map((response) => response.data));
  }

  private extractApplicationArray(data: any): JobApplication[] {
    if (Array.isArray(data)) return data as JobApplication[];
    if (Array.isArray(data?.items)) return data.items as JobApplication[];
    if (Array.isArray(data?.data)) return data.data as JobApplication[];
    if (Array.isArray(data?.applications)) return data.applications as JobApplication[];
    if (Array.isArray(data?.applicants)) return data.applicants as JobApplication[];

    return [];
  }

  private extractHistoryArray(data: any): ApplicationHistoryItem[] {
    if (Array.isArray(data)) return data as ApplicationHistoryItem[];
    if (Array.isArray(data?.items)) return data.items as ApplicationHistoryItem[];
    if (Array.isArray(data?.data)) return data.data as ApplicationHistoryItem[];
    if (Array.isArray(data?.history)) return data.history as ApplicationHistoryItem[];

    return [];
  }

  private extractCommentArray(data: any): ApplicationComment[] {
    if (Array.isArray(data)) return data as ApplicationComment[];
    if (Array.isArray(data?.items)) return data.items as ApplicationComment[];
    if (Array.isArray(data?.data)) return data.data as ApplicationComment[];
    if (Array.isArray(data?.comments)) return data.comments as ApplicationComment[];

    return [];
  }
}