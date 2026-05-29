import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  AdminCompany,
  AdminService,
  AdminUser,
  CreateAdminCompanyRequest,
  UpdateAdminCompanyRequest,
} from '../../../core/services/admin';

type CompanyModalMode = 'create' | 'edit';

@Component({
  selector: 'app-admin-companies',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-companies.html',
  styleUrl: './admin-companies.css',
})
export class AdminCompanies implements OnInit {
  companies: AdminCompany[] = [];
  ownerOptions: AdminUser[] = [];

  loading = false;
  saving = false;
  deleting = false;

  errorMessage = '';
  successMessage = '';

  searchTerm = '';
  currentPage = 1;
  limit = 10;
  total = 0;
  totalPages = 1;

  showCompanyModal = false;
  modalMode: CompanyModalMode = 'create';
  selectedCompany: AdminCompany | null = null;

  showDeleteModal = false;
  companyToDelete: AdminCompany | null = null;

  companyForm = {
    ownerId: '',
    name: '',
    description: '',
    website: '',
    industry: '',
    size: '',
    email: '',
    phone: '',
    logoUrl: '',
    coverUrl: '',
    isVerified: false,
  };

  companySizes = ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'];

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadCompanies();
    this.loadOwnerOptions();
  }

  loadCompanies(): void {
    this.loading = true;
    this.errorMessage = '';

    this.adminService.getCompanies(this.currentPage, this.limit, this.searchTerm).subscribe({
      next: (response) => {
        this.companies = response.data;
        this.total = response.pagination.total;
        this.currentPage = response.pagination.page;
        this.limit = response.pagination.limit;
        this.totalPages = response.pagination.totalPages;
        this.loading = false;
      },
      error: (error) => {
        console.error(error);
        this.errorMessage = error?.error?.message || 'No se pudieron cargar las empresas.';
        this.loading = false;
      },
    });
  }

  loadOwnerOptions(): void {
    this.adminService.getUsers(1, 100).subscribe({
      next: (response) => {
        this.ownerOptions = response.data.filter((user) => user.isActive !== false);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  getAvailableOwnerOptions(): AdminUser[] {
    const usedOwnerIds = this.companies
      .filter((company) => {
        if (this.modalMode === 'edit' && this.selectedCompany?.id === company.id) {
          return false;
        }

        return !!company.ownerId;
      })
      .map((company) => company.ownerId);

    return this.ownerOptions.filter((user) => !usedOwnerIds.includes(user.id));
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadCompanies();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.currentPage = 1;
    this.loadCompanies();
  }

  previousPage(): void {
    if (this.currentPage <= 1) return;

    this.currentPage--;
    this.loadCompanies();
  }

  nextPage(): void {
    if (this.currentPage >= this.totalPages) return;

    this.currentPage++;
    this.loadCompanies();
  }

  openCreateModal(): void {
    this.modalMode = 'create';
    this.selectedCompany = null;
    this.resetForm();
    this.showCompanyModal = true;
    this.clearMessages();
  }

  openEditModal(company: AdminCompany): void {
    this.modalMode = 'edit';
    this.selectedCompany = company;

    this.companyForm = {
      ownerId: company.ownerId || '',
      name: company.name || '',
      description: company.description || '',
      website: company.website || '',
      industry: company.industry || '',
      size: company.size || '',
      email: company.email || '',
      phone: company.phone || '',
      logoUrl: company.logoUrl || '',
      coverUrl: company.coverUrl || '',
      isVerified: company.isVerified === true,
    };

    this.showCompanyModal = true;
    this.clearMessages();
  }

  closeCompanyModal(): void {
    if (this.saving) return;

    this.showCompanyModal = false;
    this.selectedCompany = null;
    this.resetForm();
  }

  saveCompany(): void {
    this.clearMessages();

    if (!this.companyForm.ownerId) {
      this.errorMessage = 'Selecciona un propietario para la empresa.';
      return;
    }

    if (!this.companyForm.name.trim()) {
      this.errorMessage = 'El nombre de la empresa es obligatorio.';
      return;
    }

    this.saving = true;

    if (this.modalMode === 'create') {
      const payload: CreateAdminCompanyRequest = {
        ownerId: this.companyForm.ownerId,
        name: this.companyForm.name.trim(),
        description: this.companyForm.description.trim(),
        website: this.companyForm.website.trim(),
        industry: this.companyForm.industry.trim(),
        size: this.companyForm.size.trim(),
        email: this.companyForm.email.trim(),
        phone: this.companyForm.phone.trim(),
        logoUrl: this.companyForm.logoUrl.trim(),
        coverUrl: this.companyForm.coverUrl.trim(),
        isVerified: this.companyForm.isVerified,
      };

      this.adminService.createCompany(payload).subscribe({
        next: () => {
          this.saving = false;
          this.showCompanyModal = false;
          this.successMessage = 'Empresa creada correctamente.';
          this.loadCompanies();
        },
        error: (error) => {
          console.error(error);

          if (error?.status === 409) {
            this.errorMessage =
              'Este usuario ya tiene una empresa asociada. Selecciona otro propietario.';
          } else {
            this.errorMessage = error?.error?.message || 'No se pudo crear la empresa.';
          }

          this.saving = false;
        },
      });

      return;
    }

    if (!this.selectedCompany) {
      this.saving = false;
      return;
    }

    const payload: UpdateAdminCompanyRequest = {
      ownerId: this.companyForm.ownerId,
      name: this.companyForm.name.trim(),
      description: this.companyForm.description.trim(),
      website: this.companyForm.website.trim(),
      industry: this.companyForm.industry.trim(),
      size: this.companyForm.size.trim(),
      email: this.companyForm.email.trim(),
      phone: this.companyForm.phone.trim(),
      logoUrl: this.companyForm.logoUrl.trim(),
      coverUrl: this.companyForm.coverUrl.trim(),
      isVerified: this.companyForm.isVerified,
    };

    this.adminService.updateCompany(this.selectedCompany.id, payload).subscribe({
      next: () => {
        this.saving = false;
        this.showCompanyModal = false;
        this.successMessage = 'Empresa actualizada correctamente.';
        this.loadCompanies();
      },
      error: (error) => {
        console.error(error);

        if (error?.status === 409) {
          this.errorMessage =
            'Este usuario ya tiene otra empresa asociada. Selecciona otro propietario.';
        } else {
          this.errorMessage = error?.error?.message || 'No se pudo actualizar la empresa.';
        }

        this.saving = false;
      },
    });
  }

  openDeleteModal(company: AdminCompany): void {
    this.companyToDelete = company;
    this.showDeleteModal = true;
    this.clearMessages();
  }

  closeDeleteModal(): void {
    if (this.deleting) return;

    this.companyToDelete = null;
    this.showDeleteModal = false;
  }

  confirmDeleteCompany(): void {
    if (!this.companyToDelete) return;

    this.deleting = true;
    this.clearMessages();

    this.adminService.deleteCompany(this.companyToDelete.id).subscribe({
      next: () => {
        this.deleting = false;
        this.showDeleteModal = false;
        this.successMessage = 'Empresa eliminada correctamente.';
        this.loadCompanies();
      },
      error: (error) => {
        console.error(error);

        if (error?.status === 409) {
          this.errorMessage =
            'No se puede eliminar esta empresa porque tiene vacantes asociadas. Cierra o archiva sus vacantes primero.';
        } else {
          this.errorMessage = error?.error?.message || 'No se pudo eliminar la empresa.';
        }

        this.deleting = false;
      },
    });
  }

  getOwnerName(company: AdminCompany): string {
    if (!company.owner) return company.ownerId || '—';

    const fullName = `${company.owner.firstName || ''} ${company.owner.lastName || ''}`.trim();
    return fullName || company.owner.email || '—';
  }

  getUserOptionLabel(user: AdminUser): string {
    const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
    return fullName ? `${fullName} · ${user.email}` : user.email;
  }

  getCompanyInitial(company: AdminCompany): string {
    return (company.name || '?').charAt(0).toUpperCase();
  }

  formatDate(date?: string): string {
    if (!date) return '—';

    return new Date(date).toLocaleDateString('es-SV', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    });
  }

  private resetForm(): void {
    this.companyForm = {
      ownerId: '',
      name: '',
      description: '',
      website: '',
      industry: '',
      size: '',
      email: '',
      phone: '',
      logoUrl: '',
      coverUrl: '',
      isVerified: false,
    };
  }

  private clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }
}
