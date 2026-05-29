import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email = '';
  password = '';

  loading = false;
  errorMessage = '';

  constructor(
    private auth: Auth,
    private router: Router
  ) {}

  onSubmit(): void {
    this.errorMessage = '';

    if (!this.email || !this.password) {
      this.errorMessage = 'Ingresa tu correo y contraseña.';
      return;
    }

    this.loading = true;

    this.auth.login({
      email: this.email,
      password: this.password
    }).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigateByUrl(this.auth.getDefaultRedirect());
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage =
          error?.error?.message ||
          error?.error?.data?.message ||
          'No se pudo iniciar sesión. Revisa tus credenciales.';
      }
    });
  }
}