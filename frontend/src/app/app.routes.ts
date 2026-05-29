import { Routes } from '@angular/router';

import { Login } from './features/auth/login/login';
import { RegisterCandidate } from './features/auth/register-candidate/register-candidate';
import { RegisterCompany } from './features/auth/register-company/register-company';

import { JobSearch } from './features/jobs/job-search/job-search';
import { JobDetail } from './features/jobs/job-detail/job-detail';

import { MyApplications } from './features/candidate/my-applications/my-applications';

import { VacancyList } from './features/company/vacancy-list/vacancy-list';
import { VacancyForm } from './features/company/vacancy-form/vacancy-form';
import { ApplicantsByVacancy } from './features/company/applicants-by-vacancy/applicants-by-vacancy';

import { AdminDashboard } from './features/admin/admin-dashboard/admin-dashboard';
import { AdminUsers } from './features/admin/admin-users/admin-users';
import { AdminCompanies } from './features/admin/admin-companies/admin-companies';

import { authGuard } from './core/guards/auth-guard';
import { roleGuard } from './core/guards/role-guard';

export const routes: Routes = [
  { path: '', component: JobSearch },

  // Auth
  { path: 'login', component: Login },
  { path: 'register-candidate', component: RegisterCandidate },
  { path: 'register-company', component: RegisterCompany },

  // Public
  { path: 'jobs', component: JobSearch },
  { path: 'jobs/:id', component: JobDetail },

  // Candidate
  {
    path: 'candidate/applications',
    component: MyApplications,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['candidate'] }
  },

  // Company
  {
    path: 'company/vacancies',
    component: VacancyList,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['company'] }
  },
  {
    path: 'company/vacancies/create',
    component: VacancyForm,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['company'] }
  },
  {
    path: 'company/vacancies/:id/edit',
    component: VacancyForm,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['company'] }
  },
  {
    path: 'company/vacancies/:id/applicants',
    component: ApplicantsByVacancy,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['company'] }
  },

  // Admin
  {
    path: 'admin/dashboard',
    component: AdminDashboard,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'admin/users',
    component: AdminUsers,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'admin/companies',
    component: AdminCompanies,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['admin'] }
  },

  { path: '**', redirectTo: '' }
];
