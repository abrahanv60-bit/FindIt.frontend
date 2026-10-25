import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // Evitar acceder a sessionStorage desde el servidor
  if (!isPlatformBrowser(platformId)) return true;

  const token = sessionStorage.getItem('token');

  return token ? true : router.createUrlTree(['/login']);
};
