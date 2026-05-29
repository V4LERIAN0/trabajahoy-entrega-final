import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { VacancyService } from '../../../core/services/vacancy';
import { ApplicationService } from '../../../core/services/application';
import { Auth } from '../../../core/services/auth';
import { Vacancy } from '../../../core/models/vacancy.model';
import { JobApplication } from '../../../core/models/application.model';

@Component({
  selector: 'app-job-detail',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './job-detail.html',
  styleUrl: './job-detail.css',
})
export class JobDetail implements OnInit {
  vacancy: Vacancy | null = null;
  existingApplication: JobApplication | null = null;
  checkingApplication = false;

  applicationForm = {
    coverLetter: '',
    resumeUrl: '',
  };

  loading = false;
  applying = false;
  showApplyForm = false;

  errorMessage = '';
  successMessage = '';
  applyErrorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private vacancyService: VacancyService,
    private applicationService: ApplicationService,
    public auth: Auth,
  ) {}

  ngOnInit(): void {
    this.loadVacancy();
  }

  loadVacancy(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.errorMessage = 'No se encontró la vacante solicitada.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.vacancyService.getVacancyById(id).subscribe({
      next: (vacancy) => {
        this.vacancy = vacancy;
        this.loading = false;

        if (this.auth.isLoggedIn() && this.auth.isCandidate()) {
          this.checkExistingApplication();
        }
      },
      error: (error) => {
        console.error(error);
        this.errorMessage = 'No se pudo cargar el detalle de la vacante.';
        this.loading = false;
      },
    });
  }

  openApplyForm(): void {
    this.successMessage = '';
    this.applyErrorMessage = '';

    if (!this.auth.isLoggedIn()) {
      this.applyErrorMessage = 'Debes iniciar sesión como candidato para aplicar a esta vacante.';
      return;
    }

    if (!this.auth.isCandidate()) {
      this.applyErrorMessage = 'Solo los usuarios candidatos pueden aplicar a vacantes.';
      return;
    }

    if (this.hasAlreadyApplied()) {
      this.applyErrorMessage = 'Ya aplicaste a esta vacante.';
      return;
    }

    this.showApplyForm = true;

    this.showApplyForm = true;
  }

  cancelApply(): void {
    this.showApplyForm = false;
    this.applyErrorMessage = '';
    this.successMessage = '';
  }

  apply(): void {
    if (!this.vacancy) {
      return;
    }

    this.applyErrorMessage = '';
    this.successMessage = '';

    if (!this.applicationForm.coverLetter.trim()) {
      this.applyErrorMessage = 'Escribe una breve carta de presentación.';
      return;
    }

    this.applying = true;

    this.applicationService
      .applyToJob({
        vacancyId: this.vacancy.id,
        coverLetter: this.applicationForm.coverLetter,
        resumeUrl: this.applicationForm.resumeUrl,
      })
      .subscribe({
        next: (application) => {
          this.applying = false;
          this.showApplyForm = false;
          this.successMessage = 'Aplicación enviada correctamente.';
          this.existingApplication = application;
          this.applicationForm = {
            coverLetter: '',
            resumeUrl: '',
          };
        },
        error: (error) => {
          console.error(error);
          this.applying = false;
          this.applyErrorMessage =
            error?.error?.message ||
            error?.error?.data?.message ||
            'No se pudo enviar la aplicación.';
        },
      });
  }

  getSalary(): string {
    if (!this.vacancy) {
      return 'Salario no especificado';
    }

    if (this.vacancy.salaryMin && this.vacancy.salaryMax) {
      return `${this.vacancy.currency || 'USD'} ${this.vacancy.salaryMin} - ${this.vacancy.salaryMax}`;
    }

    if (this.vacancy.salaryMin) {
      return `Desde ${this.vacancy.currency || 'USD'} ${this.vacancy.salaryMin}`;
    }

    if (this.vacancy.salaryMax) {
      return `Hasta ${this.vacancy.currency || 'USD'} ${this.vacancy.salaryMax}`;
    }

    return 'Salario no especificado';
  }

  getModalityLabel(modality?: string): string {
    const labels: Record<string, string> = {
      onsite: 'Presencial',
      remote: 'Remoto',
      hybrid: 'Híbrido',
    };

    return modality ? labels[modality] || modality : 'No especificada';
  }

  getTypeLabel(type?: string): string {
    const labels: Record<string, string> = {
      'full-time': 'Tiempo completo',
      'part-time': 'Medio tiempo',
      contract: 'Contrato',
      internship: 'Pasantía',
    };

    return type ? labels[type] || type : 'No especificado';
  }

  getLevelLabel(level?: string): string {
    const labels: Record<string, string> = {
      junior: 'Junior',
      mid: 'Intermedio',
      senior: 'Senior',
    };

    return level ? labels[level] || level : 'No especificado';
  }

  checkExistingApplication(): void {
    if (!this.vacancy) {
      return;
    }

    this.checkingApplication = true;

    this.applicationService.getMyApplications().subscribe({
      next: (applications) => {
        this.existingApplication =
          applications.find((application) => {
            const directVacancyId = application.vacancyId;
            const nestedVacancyId = application.vacancy?.id;

            return directVacancyId === this.vacancy?.id || nestedVacancyId === this.vacancy?.id;
          }) || null;

        this.checkingApplication = false;
      },
      error: (error) => {
        console.error(error);
        this.checkingApplication = false;
      },
    });
  }

  hasAlreadyApplied(): boolean {
    return !!this.existingApplication;
  }

  getApplicationStatusLabel(status?: string): string {
    const labels: Record<string, string> = {
      pending: 'Pendiente',
      reviewed: 'Revisada',
      interview: 'En entrevista',
      accepted: 'Aceptada',
      rejected: 'Denegada',
    };

    return status ? labels[status] || status : 'No disponible';
  }

  getApplicationStatusClass(status?: string): string {
    const classes: Record<string, string> = {
      pending: 'status-pending',
      reviewed: 'status-reviewed',
      interview: 'status-interview',
      accepted: 'status-accepted',
      rejected: 'status-rejected',
    };

    return status ? classes[status] || 'status-default' : 'status-default';
  }
}
