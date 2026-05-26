import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { VacancyService } from '../../../core/services/vacancy';
import { CompanyService } from '../../../core/services/company';
import { Auth } from '../../../core/services/auth';
import { Vacancy } from '../../../core/models/vacancy.model';

@Component({
  selector: 'app-vacancy-form',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './vacancy-form.html',
  styleUrl: './vacancy-form.css',
})
export class VacancyForm implements OnInit {
  isEditMode = false;
  vacancyId = '';

  loading = false;
  saving = false;
  errorMessage = '';
  successMessage = '';

  form = {
    companyId: '',
    title: '',
    description: '',
    requirements: '',
    benefitsText: '',
    salaryMin: null as number | null,
    salaryMax: null as number | null,
    currency: 'USD',
    type: 'full-time',
    modality: 'hybrid',
    level: 'junior',
    status: 'draft',
    country: 'El Salvador',
    city: '',
    locationText: '',
    applicationDeadline: '',
    openings: 1
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private vacancyService: VacancyService,
    private companyService: CompanyService,
    private auth: Auth
  ) {}

  ngOnInit(): void {
    this.vacancyId = this.route.snapshot.paramMap.get('id') || '';
    this.isEditMode = !!this.vacancyId;

    this.initializeCompany();

    if (this.isEditMode) {
      this.loadVacancy();
    }
  }

  initializeCompany(): void {
    const storedCompany = this.companyService.getStoredCompany() || this.auth.getCompany();

    if (storedCompany?.id) {
      this.form.companyId = storedCompany.id;
      return;
    }

    this.companyService.getMyCompany().subscribe({
      next: (company) => {
        this.form.companyId = company.id;
      },
      error: (error) => {
        console.error(error);
        this.errorMessage = 'No se pudo obtener la empresa asociada al usuario.';
      }
    });
  }

  loadVacancy(): void {
    this.loading = true;
    this.errorMessage = '';

    this.vacancyService.getManagedVacancyById(this.vacancyId).subscribe({
      next: (vacancy) => {
        this.patchForm(vacancy);
        this.loading = false;
      },
      error: (error) => {
        console.error(error);
        this.errorMessage = 'No se pudo cargar la vacante para edición.';
        this.loading = false;
      }
    });
  }

  patchForm(vacancy: Vacancy): void {
    this.form = {
      companyId: vacancy.companyId || vacancy.company?.id || this.form.companyId || '',
      title: vacancy.title || '',
      description: vacancy.description || '',
      requirements: vacancy.requirements || '',
      benefitsText: vacancy.benefitsText || '',
      salaryMin: vacancy.salaryMin !== undefined && vacancy.salaryMin !== null ? Number(vacancy.salaryMin) : null,
      salaryMax: vacancy.salaryMax !== undefined && vacancy.salaryMax !== null ? Number(vacancy.salaryMax) : null,
      currency: vacancy.currency || 'USD',
      type: vacancy.type || 'full-time',
      modality: vacancy.modality || 'hybrid',
      level: vacancy.level || 'junior',
      status: vacancy.status || 'draft',
      country: vacancy.country || 'El Salvador',
      city: vacancy.city || '',
      locationText: vacancy.locationText || '',
      applicationDeadline: vacancy.applicationDeadline
        ? String(vacancy.applicationDeadline).substring(0, 10)
        : '',
      openings: vacancy.openings || 1
    };
  }

  saveAsDraft(): void {
    this.saveVacancy('draft', !this.isEditMode);
  }

  publishVacancy(): void {
    const shouldSendStatus = !this.isEditMode || this.form.status !== 'published';
    this.saveVacancy('published', shouldSendStatus);
  }

  saveChanges(): void {
    this.saveVacancy(this.form.status, false);
  }

  saveVacancy(status: string, includeStatus = true): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.validateForm()) {
      return;
    }

    this.saving = true;

    const payload = this.buildPayload(includeStatus ? status : undefined);

    const request = this.isEditMode
      ? this.vacancyService.updateVacancy(this.vacancyId, payload)
      : this.vacancyService.createVacancy(payload);

    request.subscribe({
      next: () => {
        this.saving = false;

        if (status === 'draft') {
          this.successMessage = 'Vacante guardada como borrador.';
        } else if (status === 'published') {
          this.successMessage = 'Vacante publicada correctamente.';
        } else {
          this.successMessage = 'Vacante guardada correctamente.';
        }

        setTimeout(() => {
          this.router.navigateByUrl('/company/vacancies');
        }, 650);
      },
      error: (error) => {
        console.error(error);
        this.saving = false;

        const backendDetails = error?.error?.errors;

        if (Array.isArray(backendDetails) && backendDetails.length > 0) {
          this.errorMessage = backendDetails
            .map((item: any) => `${item.field}: ${item.message}`)
            .join(' | ');
          return;
        }

        this.errorMessage =
          error?.error?.message ||
          error?.error?.data?.message ||
          'No se pudo guardar la vacante.';
      }
    });
  }

  validateForm(): boolean {
    if (!this.form.companyId) {
      this.errorMessage = 'No se encontró la empresa asociada al usuario.';
      return false;
    }

    if (!this.form.title.trim()) {
      this.errorMessage = 'El título de la vacante es obligatorio.';
      return false;
    }

    if (!this.form.description.trim()) {
      this.errorMessage = 'La descripción de la vacante es obligatoria.';
      return false;
    }

    if (!this.form.requirements.trim()) {
      this.errorMessage = 'Los requisitos de la vacante son obligatorios.';
      return false;
    }

    if (!this.form.city.trim()) {
      this.errorMessage = 'La ciudad es obligatoria.';
      return false;
    }

    if (!this.form.country.trim()) {
      this.errorMessage = 'El país es obligatorio.';
      return false;
    }

    if (!this.form.openings || Number(this.form.openings) < 1) {
      this.errorMessage = 'La vacante debe tener al menos una plaza disponible.';
      return false;
    }

    const salaryMin = this.toNumberOrUndefined(this.form.salaryMin);
    const salaryMax = this.toNumberOrUndefined(this.form.salaryMax);

    if (
      salaryMin !== undefined &&
      salaryMax !== undefined &&
      salaryMin > salaryMax
    ) {
      this.errorMessage = 'El salario mínimo no puede ser mayor que el salario máximo.';
      return false;
    }

    return true;
  }

  buildPayload(status?: string): Partial<Vacancy> {
    const payload: Partial<Vacancy> = {
      title: this.form.title.trim(),
      description: this.form.description.trim(),
      requirements: this.form.requirements.trim(),
      currency: this.form.currency,
      type: this.form.type,
      modality: this.form.modality,
      level: this.form.level,
      country: this.form.country.trim(),
      city: this.form.city.trim(),
      openings: Number(this.form.openings) || 1
    };

    if (!this.isEditMode) {
      payload.companyId = this.form.companyId;
    }

    const benefitsText = this.form.benefitsText?.trim();
    if (benefitsText) {
      payload.benefitsText = benefitsText;
    }

    const salaryMin = this.toNumberOrUndefined(this.form.salaryMin);
    if (salaryMin !== undefined) {
      payload.salaryMin = salaryMin;
    }

    const salaryMax = this.toNumberOrUndefined(this.form.salaryMax);
    if (salaryMax !== undefined) {
      payload.salaryMax = salaryMax;
    }

    const locationText = this.form.locationText?.trim();
    if (locationText) {
      payload.locationText = locationText;
    }

    if (this.form.applicationDeadline) {
      payload.applicationDeadline = this.form.applicationDeadline;
    }

    if (status) {
      payload.status = status;
    }

    return payload;
  }

  toNumberOrUndefined(value: number | string | null | undefined): number | undefined {
    if (value === null || value === undefined || value === '') {
      return undefined;
    }

    const numericValue = Number(value);

    return Number.isNaN(numericValue) ? undefined : numericValue;
  }

  getPageTitle(): string {
    if (!this.isEditMode) {
      return 'Crear nueva vacante';
    }

    if (this.form.status === 'draft') {
      return 'Editar borrador';
    }

    return 'Editar vacante';
  }

  getPageDescription(): string {
    if (!this.isEditMode) {
      return 'Define los detalles del puesto y decide si deseas guardarlo como borrador o publicarlo.';
    }

    if (this.form.status === 'draft') {
      return 'Actualiza la información del borrador y publícalo cuando esté listo.';
    }

    return 'Actualiza la información visible para los candidatos.';
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      draft: 'Borrador',
      published: 'Publicada',
      closed: 'Cerrada',
      archived: 'Archivada'
    };

    return labels[status] || status;
  }
}