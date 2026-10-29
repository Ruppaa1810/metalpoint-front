// interceptors/auth.interceptor.ts
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const router = inject(Router);
  const toastService = inject(MessageService);

  // Verificar si es una request a nuestra API
  const isApiRequest = req.url.startsWith(environment.apiURL);

  // URLs que no requieren token
  const publicEndpoints = [
    'login',
    'register',
  ];

  const isPublicEndpoint = publicEndpoints.some(endpoint =>
    req.url.endsWith(endpoint)
  );

  // Si no es request a la API o es endpoint público, continuar sin token
  if (!isApiRequest || isPublicEndpoint) {
    return next(req);
  }

  // Token que guardó el AuthService al iniciar sesión
  const token = localStorage.getItem('access_token');

  // Si hay token lo agrego en el header. Si no hay, el pedido sale igual:
  // los GET del catálogo son públicos, y si la ruta pide login la API responde 401
  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Token vencido o inválido
        handleUnauthorized(router);
        toastService.add({ severity: 'warn', summary: 'Tu sesión venció', detail: 'Volvé a iniciar sesión', life: 5000 });
      } else if (error.status === 403) {
        // Sin permisos
        toastService.add({ severity: 'error', summary: 'Acceso denegado', detail: 'No tenés permisos para hacer esto', life: 5000 });
      }
      return throwError(() => error);
    })
  );
};

// Función para manejar errores de autenticación
function handleUnauthorized(router: Router): void {
  // Limpiar localStorage
  localStorage.removeItem('access_token');
  localStorage.removeItem('user_data');
  localStorage.removeItem('role');

  // Redirigir al login
  router.navigate(['/login']);
}
