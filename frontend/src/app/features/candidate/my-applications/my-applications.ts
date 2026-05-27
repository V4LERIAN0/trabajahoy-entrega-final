import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApplicationService } from '../../../core/services/application';
import {
  ApplicationComment,
  ApplicationHistoryItem,
  JobApplication
} from '../../../core/models/application.model';

@Component({
  selector: 'app-my-applications',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './my-applications.html',
  styleUrl: './my-applications.css',
})
export class MyApplications implements OnInit {
  applications: JobApplication[] = [];
  filteredApplications: JobApplication[] = [];

  selectedStatus = 'all';
  loading = false;
  errorMessage = '';
  successMessage = '';

  selectedApplication: JobApplication | null = null;
  applicationHistory: ApplicationHistoryItem[] = [];
  applicationComments: ApplicationComment[] = [];
  detailLoading = false;
  commentLoading = false;
  newComment = '';

  constructor(private applicationService: ApplicationService) {}

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications(): void {
    this.loading = true;
    this.errorMessage = '';

    this.applicationService.getMyApplications().subscribe({
      next: (applications) => {
        this.applications = applications;
        this.applyStatusFilter(this.selectedStatus);
        this.loading = false;
      },
      error: (error) => {
        console.error(error);
        this.errorMessage = 'No se pudieron cargar tus aplicaciones.';
        this.loading = false;
      }
    });
  }

  applyStatusFilter(status: string): void {
    this.selectedStatus = status;

    if (status === 'all') {
      this.filteredApplications = this.applications;
      return;
    }

    this.filteredApplications = this.applications.filter(
      (application) => application.status === status
    );
  }

  openApplicationDetail(application: JobApplication): void {
    this.selectedApplication = application;
    this.applicationHistory = [];
    this.applicationComments = [];
    this.newComment = '';
    this.detailLoading = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.applicationService.getApplicationById(application.id).subscribe({
      next: (detail) => {
        this.selectedApplication = detail;
        this.loadApplicationHistory(application.id);
        this.loadApplicationComments(application.id);
        this.detailLoading = false;
      },
      error: (error) => {
        console.error(error);
        this.detailLoading = false;

        // Keep basic card data if detail endpoint fails.
        this.loadApplicationHistory(application.id);
        this.loadApplicationComments(application.id);
      }
    });
  }

  closeApplicationDetail(): void {
    this.selectedApplication = null;
    this.applicationHistory = [];
    this.applicationComments = [];
    this.newComment = '';
  }

  loadApplicationHistory(applicationId: string): void {
    this.applicationService.getApplicationHistory(applicationId).subscribe({
      next: (history) => {
        this.applicationHistory = history;
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  loadApplicationComments(applicationId: string): void {
    this.applicationService.getApplicationComments(applicationId).subscribe({
      next: (comments) => {
        this.applicationComments = comments;
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  addComment(): void {
    if (!this.selectedApplication || !this.newComment.trim()) {
      return;
    }

    this.commentLoading = true;

    this.applicationService.addApplicationComment(
      this.selectedApplication.id,
      this.newComment.trim()
    ).subscribe({
      next: () => {
        this.newComment = '';
        this.commentLoading = false;
        this.loadApplicationComments(this.selectedApplication!.id);
      },
      error: (error) => {
        console.error(error);
        this.commentLoading = false;
        this.errorMessage =
          error?.error?.message ||
          error?.error?.data?.message ||
          'No se pudo agregar el mensaje.';
      }
    });
  }

  countByStatus(status: string): number {
    return this.applications.filter((application) => application.status === status).length;
  }

  getTotalApplications(): number {
    return this.applications.length;
  }

  getVacancyTitle(application: JobApplication | null): string {
    return application?.vacancy?.title || 'Vacante';
  }

  getCompanyName(application: JobApplication | null): string {
    return application?.vacancy?.company?.name || 'Empresa registrada';
  }

  getLocation(application: JobApplication): string {
    const city = application.vacancy?.city;
    const country = application.vacancy?.country;

    if (city && country) {
      return `${city}, ${country}`;
    }

    return 'Ubicación no especificada';
  }

  getApplicationDate(application: JobApplication): string | undefined {
    return application.appliedAt || application.createdAt;
  }

  getResumeUrl(application: JobApplication | null): string {
    return application?.resumeUrl || application?.cvFileUrl || '';
  }

  getCommentText(comment: ApplicationComment): string {
    return comment.comment || comment.message || comment.content || '';
  }

  getHistoryStatus(history: ApplicationHistoryItem): string {
    return history.toStatus || history.status || 'Actualización';
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      pending: 'Pendiente',
      reviewed: 'Revisada',
      interview: 'En entrevista',
      accepted: 'Aceptada',
      rejected: 'Denegada'
    };

    return labels[status] || status;
  }

  getStatusClass(status: string): string {
    const classes: Record<string, string> = {
      pending: 'status-pending',
      reviewed: 'status-reviewed',
      interview: 'status-interview',
      accepted: 'status-accepted',
      rejected: 'status-rejected'
    };

    return classes[status] || 'status-default';
  }
}