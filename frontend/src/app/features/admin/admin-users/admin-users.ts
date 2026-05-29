import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  AdminRole,
  AdminService,
  AdminUser,
  CreateAdminUserRequest,
  UpdateAdminUserRequest
} from '../../../core/services/admin';

type UserModalMode = 'create' | 'edit';

@Component({
  selector: 'app-admin-users',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-users.html',
  styleUrl: './admin-users.css',
})
export class AdminUsers implements OnInit {
  users: AdminUser[] = [];
  roles: AdminRole[] = [];

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

  showUserModal = false;
  modalMode: UserModalMode = 'create';
  selectedUser: AdminUser | null = null;

  showDeleteModal = false;
  userToDelete: AdminUser | null = null;

  userForm = {
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  phone: '',
  isActive: true,
  role: 'candidate',
};

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadRoles();
    this.loadUsers();
  }

  loadRoles(): void {
    this.adminService.getRoles().subscribe({
      next: (roles) => {
        this.roles = roles;
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  loadUsers(): void {
    this.loading = true;
    this.errorMessage = '';

    this.adminService.getUsers(this.currentPage, this.limit, this.searchTerm).subscribe({
      next: (response) => {
        this.users = response.data;
        this.total = response.pagination.total;
        this.currentPage = response.pagination.page;
        this.limit = response.pagination.limit;
        this.totalPages = response.pagination.totalPages;
        this.loading = false;
      },
      error: (error) => {
        console.error(error);
        this.errorMessage = error?.error?.message || 'No se pudieron cargar los usuarios.';
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadUsers();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.currentPage = 1;
    this.loadUsers();
  }

  previousPage(): void {
    if (this.currentPage <= 1) return;

    this.currentPage--;
    this.loadUsers();
  }

  nextPage(): void {
    if (this.currentPage >= this.totalPages) return;

    this.currentPage++;
    this.loadUsers();
  }

  openCreateModal(): void {
    this.modalMode = 'create';
    this.selectedUser = null;
    this.resetForm();
    this.showUserModal = true;
    this.clearMessages();
  }

  openEditModal(user: AdminUser): void {
    this.modalMode = 'edit';
    this.selectedUser = user;

    this.userForm = {
  email: user.email || '',
  password: '',
  firstName: user.firstName || '',
  lastName: user.lastName || '',
  phone: user.phone || '',
  isActive: user.isActive !== false,
  role: user.roles?.[0] || 'candidate',
};

    this.showUserModal = true;
    this.clearMessages();
  }

  closeUserModal(): void {
    if (this.saving) return;

    this.showUserModal = false;
    this.selectedUser = null;
    this.resetForm();
  }

  saveUser(): void {
    this.clearMessages();

    if (!this.userForm.email.trim()) {
      this.errorMessage = 'El correo electrónico es obligatorio.';
      return;
    }

    if (this.modalMode === 'create' && !this.userForm.password.trim()) {
      this.errorMessage = 'La contraseña es obligatoria para crear un usuario.';
      return;
    }

    if (!this.userForm.role) {
  this.errorMessage = 'Selecciona un rol para el usuario.';
  return;
}

    this.saving = true;

    if (this.modalMode === 'create') {
      const payload: CreateAdminUserRequest = {
  email: this.userForm.email.trim(),
  password: this.userForm.password.trim(),
  firstName: this.userForm.firstName.trim(),
  lastName: this.userForm.lastName.trim(),
  phone: this.userForm.phone.trim(),
  isActive: this.userForm.isActive,
  isVerified: true,
  roles: [this.userForm.role],
};

      this.adminService.createUser(payload).subscribe({
        next: () => {
          this.saving = false;
          this.showUserModal = false;
          this.successMessage = 'Usuario creado correctamente.';
          this.loadUsers();
        },
        error: (error) => {
          console.error(error);
          this.errorMessage = error?.error?.message || 'No se pudo crear el usuario.';
          this.saving = false;
        }
      });

      return;
    }

    if (!this.selectedUser) {
      this.saving = false;
      return;
    }

    const payload: UpdateAdminUserRequest = {
  email: this.userForm.email.trim(),
  firstName: this.userForm.firstName.trim(),
  lastName: this.userForm.lastName.trim(),
  phone: this.userForm.phone.trim(),
  isActive: this.userForm.isActive,
  roles: [this.userForm.role],
};

    if (this.userForm.password.trim()) {
      payload.password = this.userForm.password.trim();
    }

    this.adminService.updateUser(this.selectedUser.id, payload).subscribe({
      next: () => {
        this.saving = false;
        this.showUserModal = false;
        this.successMessage = 'Usuario actualizado correctamente.';
        this.loadUsers();
      },
      error: (error) => {
        console.error(error);
        this.errorMessage = error?.error?.message || 'No se pudo actualizar el usuario.';
        this.saving = false;
      }
    });
  }

  openDeleteModal(user: AdminUser): void {
    this.userToDelete = user;
    this.showDeleteModal = true;
    this.clearMessages();
  }

  closeDeleteModal(): void {
    if (this.deleting) return;

    this.userToDelete = null;
    this.showDeleteModal = false;
  }

  confirmDeleteUser(): void {
    if (!this.userToDelete) return;

    this.deleting = true;
    this.clearMessages();

    this.adminService.deleteUser(this.userToDelete.id).subscribe({
      next: () => {
        this.deleting = false;
        this.showDeleteModal = false;
        this.successMessage = 'Usuario desactivado correctamente.';
        this.loadUsers();
      },
      error: (error) => {
        console.error(error);
        this.errorMessage = error?.error?.message || 'No se pudo desactivar el usuario.';
        this.deleting = false;
      }
    });
  }

  getUserFullName(user: AdminUser): string {
    const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
    return fullName || 'Sin nombre';
  }

  getRoleLabel(role: string): string {
    const labels: Record<string, string> = {
      admin: 'Administrador',
      candidate: 'Candidato',
      recruiter: 'Empresa',
      company_admin: 'Empresa',
    };

    return labels[role] || role;
  }

  getRoleBadgeClass(role: string): string {
    if (role === 'admin') return 'role-admin';
    if (role === 'candidate') return 'role-candidate';
    return 'role-company';
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
  this.userForm = {
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    isActive: true,
    role: 'candidate',
  };
}
  private clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }
}