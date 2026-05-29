import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { VacancyService } from '../../../core/services/vacancy';
import { Vacancy } from '../../../core/models/vacancy.model';

@Component({
  selector: 'app-job-search',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './job-search.html',
  styleUrl: './job-search.css',
})
export class JobSearch implements OnInit {
  vacancies: Vacancy[] = [];

  filters = {
    q: '',
    city: '',
    modality: '',
    type: ''
  };

  loading = false;
  errorMessage = '';

  constructor(private vacancyService: VacancyService) {}

  ngOnInit(): void {
    this.loadVacancies();
  }

  loadVacancies(): void {
    this.loading = true;
    this.errorMessage = '';

    this.vacancyService.getPublicVacancies(this.filters).subscribe({
      next: (vacancies) => {
        this.vacancies = vacancies;
        this.loading = false;
      },
      error: (error) => {
        console.error(error);
        this.errorMessage = 'No se pudieron cargar las vacantes.';
        this.loading = false;
      }
    });
  }

  search(): void {
    this.loadVacancies();
  }

  clearFilters(): void {
    this.filters = {
      q: '',
      city: '',
      modality: '',
      type: ''
    };

    this.loadVacancies();
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

    return 'Salario no especificado';
  }

  getModalityLabel(modality: string): string {
    const labels: Record<string, string> = {
      onsite: 'Presencial',
      remote: 'Remoto',
      hybrid: 'Híbrido'
    };

    return labels[modality] || modality;
  }

  getTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      'full-time': 'Tiempo completo',
      'part-time': 'Medio tiempo',
      contract: 'Contrato',
      internship: 'Pasantía'
    };

    return labels[type] || type;
  }
}