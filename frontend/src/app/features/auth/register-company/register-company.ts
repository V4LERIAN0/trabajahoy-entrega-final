import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-register-company',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register-company.html',
  styleUrl: './register-company.css',
})
export class RegisterCompany {
  form = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    industry: '',
    companySize: '',
    website: '',
    companyDescription: ''
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

    if (
      !this.form.firstName ||
      !this.form.lastName ||
      !this.form.email ||
      !this.form.password ||
      !this.form.companyName
    ) {
      this.errorMessage = 'Completa los campos obligatorios.';
      return;
    }

    if (this.form.password !== this.form.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden.';
      return;
    }

    this.loading = true;

    this.auth.registerCompany({
      firstName: this.form.firstName,
      lastName: this.form.lastName,
      email: this.form.email,
      phone: this.form.phone,
      password: this.form.password,
      companyName: this.form.companyName,
      industry: this.form.industry,
      companySize: this.form.companySize,
      website: this.form.website,
      companyDescription: this.form.companyDescription
    }).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = 'Empresa registrada correctamente.';
        this.router.navigateByUrl(this.auth.getDefaultRedirect());
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage =
          error?.error?.message ||
          error?.error?.data?.message ||
          'No se pudo registrar la empresa. Intenta nuevamente.';
      }
    });
  }
}