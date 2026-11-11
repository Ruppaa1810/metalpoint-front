import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

// Solo deja entrar al panel (/admin) a un usuario logueado con rol Administrador
export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    router.navigate(['/login']);       // No inició sesión: al login
    return false;
  }

  if (authService.getRole() !== 'Administrador') {
    router.navigate(['/catalogo']);    // Inició sesión pero es Cliente: a la tienda
    return false;
  }

  return true;                         // Es Administrador: puede pasar
};
