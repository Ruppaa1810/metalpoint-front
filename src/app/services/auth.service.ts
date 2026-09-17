import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Usuario {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface AuthRespuesta {
  success: boolean;
  message: string;
  data: {
    usuario: Usuario;
    token: string;
  };
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private urlBase = `${environment.apiUrl}`;
  private readonly CLAVE_TOKEN = 'metalpoint_token';
  private readonly CLAVE_USUARIO = 'metalpoint_usuario';

  usuario = signal<Usuario | null>(null);
  estaLogueado = signal<boolean>(false);
  esAdmin = signal<boolean>(false);
  sesionVerificada = signal<boolean>(false);

  login(email: string, password: string): Observable<AuthRespuesta> {
    return this.http.post<AuthRespuesta>(`${this.urlBase}/login`, { email, password }).pipe(
      tap((respuesta) => {
        this.guardarSesion(respuesta.data.token, respuesta.data.usuario);
      })
    );
  }

  register(datos: { name: string; email: string; password: string; password_confirmation: string }): Observable<AuthRespuesta> {
    return this.http.post<AuthRespuesta>(`${this.urlBase}/register`, datos).pipe(
      tap((respuesta) => {
        this.guardarSesion(respuesta.data.token, respuesta.data.usuario);
      })
    );
  }

  logout(): void {
    const token = this.obtenerToken();
    if (token) {
      this.http.post(`${this.urlBase}/logout`, {}).subscribe();
    }
    localStorage.removeItem(this.CLAVE_TOKEN);
    localStorage.removeItem(this.CLAVE_USUARIO);
    this.usuario.set(null);
    this.estaLogueado.set(false);
    this.esAdmin.set(false);
  }

  cargarUsuarioActual(): void {
    const token = this.obtenerToken();
    if (!token) {
      this.sesionVerificada.set(true);
      return;
    }

    this.http.get<{ success: boolean; data: Usuario }>(`${this.urlBase}/user`).subscribe({
      next: (respuesta) => {
        this.usuario.set(respuesta.data);
        this.estaLogueado.set(true);
        this.esAdmin.set(respuesta.data.role === 'admin');
        this.sesionVerificada.set(true);
        localStorage.setItem(this.CLAVE_USUARIO, JSON.stringify(respuesta.data));
      },
      error: () => {
        this.logout();
        this.sesionVerificada.set(true);
      },
    });
  }

  obtenerToken(): string | null {
    return localStorage.getItem(this.CLAVE_TOKEN);
  }

  private guardarSesion(token: string, usuario: Usuario): void {
    localStorage.setItem(this.CLAVE_TOKEN, token);
    localStorage.setItem(this.CLAVE_USUARIO, JSON.stringify(usuario));
    this.usuario.set(usuario);
    this.estaLogueado.set(true);
    this.esAdmin.set(usuario.role === 'admin');
  }

  private cargarUsuario(): Usuario | null {
    try {
      const raw = localStorage.getItem(this.CLAVE_USUARIO);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  private tieneToken(): boolean {
    return !!localStorage.getItem(this.CLAVE_TOKEN);
  }
}
