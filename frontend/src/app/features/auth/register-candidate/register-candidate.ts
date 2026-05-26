import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-register-candidate',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register-candidate.html',
  styleUrl: './register-candidate.css',
})
export class RegisterCandidate {
  form = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  };

  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private auth: Auth,
    private router: Router
  ) {}

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.form.firstName || !this.form.lastName || !this.form.email || !this.form.password) {
      this.errorMessage = 'Completa los campos obligatorios.';
      return;
    }

    if (this.form.password !== this.form.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden.';
      return;
    }

    this.loading = true;

    this.auth.registerCandidate({
      firstName: this.form.firstName,
      lastName: this.form.lastName,
      email: this.form.email,
      phone: this.form.phone,
      password: this.form.password
    }).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = 'Cuenta creada correctamente.';
        this.router.navigateByUrl(this.auth.getDefaultRedirect());
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage =
          error?.error?.message ||
          error?.error?.data?.message ||
          'No se pudo crear la cuenta. Intenta nuevamente.';
      }
    });
  }
}