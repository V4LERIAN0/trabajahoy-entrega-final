import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdminDashboardStats, AdminService } from '../../../core/services/admin';

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard implements OnInit {
  stats: AdminDashboardStats = {
  totalUsers: 0,
  totalCompanies: 0,
  totalVacancies: 0,
  totalApplications: 0,
  activeUsers: 0,
  verifiedCompanies: 0,
  publishedVacancies: 0,
  pendingApplications: 0,
};
  loading = false;
  errorMessage = '';

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.loading = true;
    this.errorMessage = '';

    this.adminService.getDashboard().subscribe({
      next: (stats) => {
        this.stats = stats;
        this.loading = false;
      },
      error: (error) => {
        console.error(error);
        this.errorMessage = error?.error?.message || 'No se pudo cargar el panel administrativo.';
        this.loading = false;
      }
    });
  }

  getValue(...keys: string[]): number {
    for (const key of keys) {
      const value = this.stats?.[key];

      if (typeof value === 'number') {
        return value;
      }

      if (!Number.isNaN(Number(value)) && value !== undefined && value !== null) {
        return Number(value);
      }
    }

    return 0;
  }
}