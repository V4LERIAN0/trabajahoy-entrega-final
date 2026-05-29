import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApplicationService } from '../../../core/services/application';
import { VacancyService } from '../../../core/services/vacancy';
import {
  ApplicationComment,
  ApplicationHistoryItem,
  JobApplication,
} from '../../../core/models/application.model';
import { Vacancy } from '../../../core/models/vacancy.model';

@Component({
  selector: 'app-applicants-by-vacancy',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './applicants-by-vacancy.html',
  styleUrl: './applicants-by-vacancy.css',
})
export class ApplicantsByVacancy implements OnInit {
  vacancyId = '';
  vacancy: Vacancy | null = null;

  applications: JobApplication[] = [];
  filteredApplications: JobApplication[] = [];

  selectedStatus = 'all';
  loading = false;
  actionLoadingId = '';
  errorMessage = '';
  successMessage = '';

  selectedApplication: JobApplication | null = null;
  applicationHistory: ApplicationHistoryItem[] = [];
  applicationComments: ApplicationComment[] = [];
  detailLoading = false;
  commentLoading = false;
  newComment = '';

  statusModal = {
    visible: false,
    title: '',
    message: '',
    confirmText: '',
    application: null as JobApplication | null,
    toStatus: '',
    notes: '',
    interviewScheduledAt: '',
    interviewLocation: '',
  };

  constructor(
    private route: ActivatedRoute,
    private applicationService: ApplicationService,
    private vacancyService: VacancyService,
  ) {}

  ngOnInit(): void {
    this.vacancyId = this.route.snapshot.paramMap.get('id') || '';

    if (!this.vacancyId) {
      this.errorMessage = 'No se encontró la vacante solicitada.';
      return;
    }

    this.loadVacancy();
    this.loadApplicants();
  }

  loadVacancy(): void {
    this.vacancyService.getManagedVacancyById(this.vacancyId).subscribe({
      next: (vacancy) => {
        this.vacancy = vacancy;
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  loadApplicants(): void {
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.applicationService.getApplicantsByVacancy(this.vacancyId).subscribe({
      next: (applications) => {
        this.applications = applications;
        this.applyStatusFilter(this.selectedStatus);
        this.loading = false;
      },
      error: (error) => {
        console.error(error);
        this.errorMessage =
          error?.error?.message ||
          error?.error?.data?.message ||
          'No se pudieron cargar los aplicantes de esta vacante.';
        this.loading = false;
      },
    });
  }

  applyStatusFilter(status: string): void {
    this.selectedStatus = status;

    if (status === 'all') {
      this.filteredApplications = this.applications;
      return;
    }

    this.filteredApplications = this.applications.filter(
      (application) => application.status === status,
    );
  }

  countByStatus(status: string): number {
    return this.applications.filter((application) => application.status === status).length;
  }

  getTotalApplicants(): number {
    return this.applications.length;
  }

  openApplicationDetail(application: JobApplication): void {
    this.selectedApplication = application;
    this.applicationHistory = [];
    this.applicationComments = [];
    this.newComment = '';
    this.detailLoading = true;

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

        // Keep at least the row data visible if the detail endpoint fails.
        this.loadApplicationHistory(application.id);
        this.loadApplicationComments(application.id);
      },
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
      },
    });
  }

  loadApplicationComments(applicationId: string): void {
    this.applicationService.getApplicationComments(applicationId).subscribe({
      next: (comments) => {
        this.applicationComments = comments;
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  addComment(): void {
    if (!this.selectedApplication || !this.newComment.trim()) {
      return;
    }

    this.commentLoading = true;

    this.applicationService
      .addApplicationComment(this.selectedApplication.id, this.newComment.trim())
      .subscribe({
        next: () => {
          this.newComment = '';
          this.commentLoading = false;
          this.loadApplicationComments(this.selectedApplication!.id);
        },
        error: (error) => {
          console.error(error);
          this.commentLoading = false;
        },
      });
  }

  openStatusModal(application: JobApplication, toStatus: string): void {
    const label = this.getStatusLabel(toStatus);

    this.statusModal = {
      visible: true,
      title: `Cambiar estado a ${label}`,
      message: `Escribe el mensaje que recibirá o podrá consultar el candidato sobre esta actualización.`,
      confirmText: `Confirmar ${label}`,
      application,
      toStatus,
      notes: '',
      interviewScheduledAt: '',
      interviewLocation: '',
    };
  }

  closeStatusModal(): void {
    this.statusModal = {
      visible: false,
      title: '',
      message: '',
      confirmText: '',
      application: null,
      toStatus: '',
      notes: '',
      interviewScheduledAt: '',
      interviewLocation: '',
    };
  }

  confirmStatusChange(): void {
    if (!this.statusModal.application || !this.statusModal.toStatus) {
      return;
    }

    if (!this.statusModal.notes.trim()) {
      this.errorMessage = 'Debes escribir un mensaje para el candidato.';
      return;
    }

    if (this.statusModal.toStatus === 'interview') {
      this.scheduleInterviewFromModal();
      return;
    }

    if (this.statusModal.toStatus === 'accepted') {
      this.acceptApplicationWithMessage(
        this.statusModal.application,
        this.statusModal.notes.trim(),
      );
      this.closeStatusModal();
      return;
    }

    const application = this.statusModal.application;
    const toStatus = this.statusModal.toStatus;
    const notes = this.statusModal.notes.trim();

    this.closeStatusModal();
    this.changeStatus(application, toStatus, notes);
  }

  scheduleInterviewFromModal(): void {
    const application = this.statusModal.application;

    if (!application) {
      return;
    }

    if (!this.statusModal.interviewScheduledAt) {
      this.errorMessage = 'Debes indicar la fecha y hora de la entrevista.';
      return;
    }

    this.actionLoadingId = application.id;
    this.successMessage = '';
    this.errorMessage = '';

    this.applicationService
      .scheduleInterview(application.id, {
        scheduledAt: new Date(this.statusModal.interviewScheduledAt).toISOString(),
        location: this.statusModal.interviewLocation,
        notes: this.statusModal.notes.trim(),
      })
      .subscribe({
        next: () => {
          this.actionLoadingId = '';
          this.successMessage = 'Entrevista programada correctamente.';
          this.closeStatusModal();
          this.loadApplicants();

          if (this.selectedApplication?.id === application.id) {
            this.openApplicationDetail(application);
          }
        },
        error: (error) => {
          console.error(error);
          this.actionLoadingId = '';
          this.errorMessage =
            error?.error?.message ||
            error?.error?.data?.message ||
            'No se pudo programar la entrevista.';
        },
      });
  }

  changeStatus(application: JobApplication, toStatus: string, notes: string): void {
    this.actionLoadingId = application.id;
    this.successMessage = '';
    this.errorMessage = '';

    this.applicationService
      .changeApplicationStatus(application.id, {
        toStatus,
        notes,
      })
      .subscribe({
        next: () => {
          this.actionLoadingId = '';
          this.successMessage = 'Estado de aplicación actualizado correctamente.';
          this.loadApplicants();

          if (this.selectedApplication?.id === application.id) {
            this.openApplicationDetail(application);
          }
        },
        error: (error) => {
          console.error(error);
          this.actionLoadingId = '';
          this.errorMessage =
            error?.error?.message ||
            error?.error?.data?.message ||
            'No se pudo actualizar el estado de la aplicación.';
        },
      });
  }

  acceptApplicationWithMessage(application: JobApplication, notes: string): void {
    this.actionLoadingId = application.id;
    this.successMessage = '';
    this.errorMessage = '';

    if (application.status === 'interview') {
      this.changeStatus(application, 'accepted', notes);
      return;
    }

    this.applicationService
      .changeApplicationStatus(application.id, {
        toStatus: 'interview',
        notes: 'El candidato pasa a entrevista como paso previo a la aceptación.',
      })
      .subscribe({
        next: () => {
          this.applicationService
            .changeApplicationStatus(application.id, {
              toStatus: 'accepted',
              notes,
            })
            .subscribe({
              next: () => {
                this.actionLoadingId = '';
                this.successMessage = 'Aplicante aceptado correctamente.';
                this.loadApplicants();

                if (this.selectedApplication?.id === application.id) {
                  this.openApplicationDetail(application);
                }
              },
              error: (error) => {
                console.error(error);
                this.actionLoadingId = '';
                this.errorMessage =
                  error?.error?.message ||
                  error?.error?.data?.message ||
                  'No se pudo aceptar la aplicación.';
              },
            });
        },
        error: (error) => {
          console.error(error);
          this.actionLoadingId = '';
          this.errorMessage =
            error?.error?.message ||
            error?.error?.data?.message ||
            'No se pudo mover la aplicación a entrevista.';
        },
      });
  }

  moveToReviewed(application: JobApplication): void {
    this.openStatusModal(application, 'reviewed');
  }

  moveToInterview(application: JobApplication): void {
    this.openStatusModal(application, 'interview');
  }

  acceptApplication(application: JobApplication): void {
    this.openStatusModal(application, 'accepted');
  }

  rejectApplication(application: JobApplication): void {
    this.openStatusModal(application, 'rejected');
  }

  getCandidateName(application: JobApplication): string {
    const candidate = application.user || application.candidate;

    const firstName = candidate?.firstName || '';
    const lastName = candidate?.lastName || '';
    const fullName = `${firstName} ${lastName}`.trim();

    return fullName || candidate?.email || 'Candidato';
  }

  getCandidateEmail(application: JobApplication): string {
    const candidate = application.user || application.candidate;
    return candidate?.email || 'Correo no disponible';
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
      rejected: 'Denegada',
    };

    return labels[status] || status;
  }

  getStatusClass(status: string): string {
    const classes: Record<string, string> = {
      pending: 'status-pending',
      reviewed: 'status-reviewed',
      interview: 'status-interview',
      accepted: 'status-accepted',
      rejected: 'status-rejected',
    };

    return classes[status] || 'status-default';
  }
}
