import { HttpErrorResponse } from '@angular/common/http';

// Convierte cualquier error de la API en un mensaje que se pueda mostrar al usuario
export function obtenerMensajeDeError(error: unknown): string {
  if (error instanceof HttpErrorResponse) {
    // Los errores 422 de Laravel traen los detalles en "errors"
    if (error.status === 422 && error.error?.errors) {
      const detalles: string[] = Object.values(error.error.errors).flat() as string[];
      return detalles.join('. ');
    }

    // Si Laravel envió un mensaje propio, lo usamos
    if (error.error?.message) {
      return error.error.message;
    }

    // status 0 significa que no se llegó a conectar (API apagada)
    if (error.status === 0) {
      return 'No se pudo conectar con el servidor. Verificá que la API esté corriendo.';
    }

    return `Ocurrió un error inesperado (código ${error.status}).`;
  }

  return 'Ocurrió un error inesperado.';
}