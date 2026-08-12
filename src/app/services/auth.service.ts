import { Injectable, signal } from '@angular/core';

export type TipoUsuario = 'invitado' | 'administrador' | null;

@Injectable({ providedIn: 'root' })
export class AuthService {
  usuario = signal<TipoUsuario>(null);

  iniciarSesion(tipo: Exclude<TipoUsuario, null>): void {
    this.usuario.set(tipo);
  }

  cerrarSesion(): void {
    this.usuario.set(null);
  }
}