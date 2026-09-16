import { HttpErrorResponse } from '@angular/common/http';

export function obtenerMensajeDeError(error: unknown): string {
  if (error instanceof HttpErrorResponse) {
    if (error.status === 422 && error.error?.errors) {
      const detalles: string[] = Object.values(error.error.errors).flat() as string[];
      return detalles.join('. ');
    }

    if (error.error?.message) {
      return error.error.message;
    }

    if (error.status === 0) {
      return 'No se pudo conectar con el servidor. Verificá que la API esté corriendo.';
    }

    return `Ocurrió un error inesperado (código ${error.status}).`;
  }

  return 'Ocurrió un error inesperado.';
}
