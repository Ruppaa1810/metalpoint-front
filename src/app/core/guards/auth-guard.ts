import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

// Solo deja pasar si hay una sesión iniciada (como el ejemplo del Dossier, sección 5.3)
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;                       // Permite el acceso
  } else {
    router.navigate(['/login']);       // Redirige a la página de login
    return false;                      // Bloquea el acceso
  }
};
