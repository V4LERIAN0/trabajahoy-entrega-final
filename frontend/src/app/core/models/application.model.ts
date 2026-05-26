import { Vacancy } from './vacancy.model';
import { User } from './auth.model';

export interface JobApplication {
  id: string;
  userId?: string;
  vacancyId?: string;
  vacancy?: Vacancy;
  user?: User;
  candidate?: User;
  status: 'pending' | 'reviewed' | 'interview' | 'accepted' | 'rejected' | string;
  coverLetter?: string;
  resumeUrl?: string;
  cvFileUrl?: string;
  interviewScheduledAt?: string;
  interviewLocation?: string;
  interviewNotes?: string;
  appliedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApplyJobRequest {
  vacancyId: string;
  coverLetter?: string;
  resumeUrl?: string;
}

export interface ChangeApplicationStatusRequest {
  toStatus: 'pending' | 'reviewed' | 'interview' | 'accepted' | 'rejected' | string;
  notes?: string;
}

export interface ScheduleInterviewRequest {
  scheduledAt: string;
  location?: string;
  notes?: string;
}

export interface ApplicationHistoryItem {
  id: string;
  applicationId?: string;
  fromStatus?: string | null;
  toStatus?: string;
  status?: string;
  notes?: string;
  changedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApplicationComment {
  id: string;
  applicationId?: string;
  userId?: string;
  user?: User;
  comment?: string;
  message?: string;
  content?: string;
  isInternal?: boolean;
  createdAt?: string;
  updatedAt?: string;
}