import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/auth.model';
import { Company } from '../models/company.model';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getMyCompany(): Observable<Company> {
    return this.http
      .get<ApiResponse<Company>>(`${this.apiUrl}/companies/me`)
      .pipe(
        map((response) => response.data),
        tap((company) => {
          if (company?.id) {
            localStorage.setItem('company', JSON.stringify(company));
          }
        })
      );
  }

  getStoredCompany(): Company | null {
    const company = localStorage.getItem('company');
    return company ? JSON.parse(company) : null;
  }
}