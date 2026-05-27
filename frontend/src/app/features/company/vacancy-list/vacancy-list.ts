import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { VacancyService } from '../../../core/services/vacancy';
import { Vacancy } from '../../../core/models/vacancy.model';

@Component({
  selector: 'app-vacancy-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './vacancy-list.html',
  styleUrl: './vacancy-list.css',
})
export class VacancyList implements OnInit {
  vacancies: Vacancy[] = [];
  filteredVacancies: Vacancy[] = [];

  selectedStatus = 'all';
  loading = false;
  actionLoadingId = '';
  errorMessage = '';
  successMessage = '';

  constructor(private vacancyService: VacancyService) {}

  confirmModal = {
    visible: false,
    title: '',
    message: '',
    confirmText: '',
    action: null as null | (() => void),
  };

  ngOnInit(): void {
    this.loadVacancies();
  }

  loadVacancies(): void {
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.vacancyService.getCompanyVacancies().subscribe({
      next: (vacancies) => {
        this.vacancies = vacancies;
        this.applyStatusFilter(this.selectedStatus);
        this.loading = false;
      },
      error: (error) => {
        console.error(error);
        this.errorMessage = 'No se pudieron cargar las vacantes de la empresa.';
        this.loading = false;
      },
    });
  }

  applyStatusFilter(status: string): void {
    this.selectedStatus = status;

    if (status === 'all') {
      this.filteredVacancies = this.vacancies.filter((vacancy) => vacancy.status !== 'archived');
      return;
    }

    this.filteredVacancies = this.vacancies.filter((vacancy) => vacancy.status === status);
  }

  countByStatus(status: string): number {
    return this.vacancies.filter((vacancy) => vacancy.status === status).length;
  }

  getTotalVacancies(): number {
    return this.vacancies.length;
  }

  closeVacancy(vacancy: Vacancy): void {
    this.openConfirmModal(
      'Cerrar vacante',
      `¿Seguro que deseas cerrar la vacante "${vacancy.title}"? Ya no estará disponible para nuevas aplicaciones.`,
      'Cerrar vacante',
      () => this.executeCloseVacancy(vacancy),
    );
  }

  executeCloseVacancy(vacancy: Vacancy): void {
    this.actionLoadingId = vacancy.id;
    this.successMessage = '';
    this.errorMessage = '';

    this.vacancyService.closeVacancy(vacancy.id).subscribe({
      next: () => {
        this.actionLoadingId = '';
        this.successMessage = 'Vacante cerrada correctamente.';
        this.loadVacancies();
      },
      error: (error) => {
        console.error(error);
        this.actionLoadingId = '';
        this.errorMessage = error?.error?.message || 'No se pudo cerrar la vacante.';
      },
    });
  }

  archiveVacancy(vacancy: Vacancy): void {
    this.openConfirmModal(
      'Archivar vacante',
      `¿Seguro que deseas archivar la vacante "${vacancy.title}"? Solo aparecerá en la vista de archivadas.`,
      'Archivar vacante',
      () => this.executeArchiveVacancy(vacancy),
    );
  }

  executeArchiveVacancy(vacancy: Vacancy): void {
    this.actionLoadingId = vacancy.id;
    this.successMessage = '';
    this.errorMessage = '';

    this.vacancyService.archiveVacancy(vacancy.id).subscribe({
      next: () => {
        this.actionLoadingId = '';
        this.successMessage = 'Vacante archivada correctamente.';
        this.loadVacancies();
      },
      error: (error) => {
        console.error(error);
        this.actionLoadingId = '';
        this.errorMessage = error?.error?.message || 'No se pudo archivar la vacante.';
      },
    });
  }

  deleteVacancy(vacancy: Vacancy): void {
    this.openConfirmModal(
      'Eliminar vacante',
      `¿Seguro que deseas eliminar la vacante "${vacancy.title}"? Esta acción no se puede deshacer.`,
      'Eliminar vacante',
      () => this.executeDeleteVacancy(vacancy),
    );
  }

  executeDeleteVacancy(vacancy: Vacancy): void {
    this.actionLoadingId = vacancy.id;
    this.successMessage = '';
    this.errorMessage = '';

    this.vacancyService.deleteVacancy(vacancy.id).subscribe({
      next: () => {
        this.actionLoadingId = '';
        this.successMessage = 'Vacante eliminada correctamente.';
        this.loadVacancies();
      },
      error: (error) => {
        console.error(error);
        this.actionLoadingId = '';
        this.errorMessage = error?.error?.message || 'No se pudo eliminar la vacante.';
      },
    });
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      draft: 'Borrador',
      published: 'Publicada',
      closed: 'Cerrada',
      archived: 'Archivada',
    };

    return labels[status] || status;
  }

  getStatusClass(status: string): string {
    const classes: Record<string, string> = {
      draft: 'status-draft',
      published: 'status-published',
      closed: 'status-closed',
      archived: 'status-archived',
    };

    return classes[status] || 'status-default';
  }

  getModalityLabel(modality: string): string {
    const labels: Record<string, string> = {
      onsite: 'Presencial',
      remote: 'Remoto',
      hybrid: 'Híbrido',
    };

    return labels[modality] || modality;
  }

  getTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      'full-time': 'Tiempo completo',
      'part-time': 'Medio tiempo',
      contract: 'Contrato',
      internship: 'Pasantía',
    };

    return labels[type] || type;
  }

  getSalary(vacancy: Vacancy): string {
    if (vacancy.salaryMin && vacancy.salaryMax) {
      return `${vacancy.currency || 'USD'} ${vacancy.salaryMin} - ${vacancy.salaryMax}`;
    }

    if (vacancy.salaryMin) {
      return `Desde ${vacancy.currency || 'USD'} ${vacancy.salaryMin}`;
    }

    if (vacancy.salaryMax) {
      return `Hasta ${vacancy.currency || 'USD'} ${vacancy.salaryMax}`;
    }

    return 'No especificado';
  }

  openConfirmModal(title: string, message: string, confirmText: string, action: () => void): void {
    this.confirmModal = {
      visible: true,
      title,
      message,
      confirmText,
      action,
    };
  }

  closeConfirmModal(): void {
    this.confirmModal = {
      visible: false,
      title: '',
      message: '',
      confirmText: '',
      action: null,
    };
  }

  confirmAction(): void {
    if (this.confirmModal.action) {
      this.confirmModal.action();
    }

    this.closeConfirmModal();
  }

  reopenVacancy(vacancy: Vacancy): void {
    this.openConfirmModal(
      'Reabrir vacante',
      `¿Seguro que deseas reabrir la vacante "${vacancy.title}"? Volverá a mostrarse a los candidatos.`,
      'Reabrir vacante',
      () => this.executeReopenVacancy(vacancy),
    );
  }

  executeReopenVacancy(vacancy: Vacancy): void {
    this.actionLoadingId = vacancy.id;
    this.successMessage = '';
    this.errorMessage = '';

    this.vacancyService.reopenVacancy(vacancy.id).subscribe({
      next: () => {
        this.actionLoadingId = '';
        this.successMessage = 'Vacante reabierta correctamente.';
        this.loadVacancies();
      },
      error: (error) => {
        console.error(error);
        this.actionLoadingId = '';
        this.errorMessage = error?.error?.message || 'No se pudo reabrir la vacante.';
      },
    });
  }
}
