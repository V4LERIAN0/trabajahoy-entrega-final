export interface CompanySummary {
  id?: string;
  name?: string;
  industry?: string;
  logoUrl?: string | null;
}

export interface Vacancy {
  id: string;
  companyId?: string;
  company?: CompanySummary;
  title: string;
  description: string;
  requirements: string;
  benefitsText?: string;
  salaryMin?: number;
  salaryMax?: number;
  currency?: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship' | string;
  modality: 'onsite' | 'remote' | 'hybrid' | string;
  level: 'junior' | 'mid' | 'senior' | string;
  status: 'draft' | 'published' | 'closed' | 'archived' | string;
  country: string;
  city: string;
  locationText?: string;
  applicationDeadline?: string;
  openings?: number;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface VacancyFilters {
  q?: string;
  city?: string;
  modality?: string;
  type?: string;
  level?: string;
  page?: number;
  limit?: number;
}

export interface VacancyListResponse {
  items?: Vacancy[];
  data?: Vacancy[];
  total?: number;
  page?: number;
  limit?: number;
}