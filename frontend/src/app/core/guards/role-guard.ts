import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';

export const roleGuard: CanActivateFn = (route) => {
  const auth = inject(Auth);
  const router = inject(Router);

  const allowedRoles = route.data?.['roles'] as string[] | undefined;

  if (!allowedRoles || allowedRoles.length === 0) {
    return true;
  }

  const userRoles = auth.currentRoles();

  const hasAllowedRole = allowedRoles.some((role) => {
    if (role === 'company') {
      return userRoles.includes('recruiter') || userRoles.includes('company_admin');
    }

    return userRoles.includes(role);
  });

  if (hasAllowedRole) {
    return true;
  }

  router.navigateByUrl(auth.getDefaultRedirect());
  return false;
};