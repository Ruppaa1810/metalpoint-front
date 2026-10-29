import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { tap } from 'rxjs';

type Role = 'Administrador' | 'Cliente';

export interface LoginResponse {
  message: string;
  access_token: string;
  token_type: string;
  user: {
    id: number;
    email: string;
    name: string;
  };
  role: Role;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private httpClient = inject(HttpClient);

  private apiURL = `${environment.apiURL}`;

  login(email: string, password: string) {
    return this.httpClient.post<LoginResponse>(`${this.apiURL}login`, {
      email,
      password,
    }).pipe(tap(response => {
      // Guardo el token, el usuario y el rol para usarlos después
      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('user_data', JSON.stringify(response.user));
      localStorage.setItem('role', response.role);
    }));
  }

  register(name: string, email: string, password: string) {
    // La API le asigna el rol Cliente al usuario nuevo
    return this.httpClient.post<any>(`${this.apiURL}register`, {
      name,
      email,
      password,
    });
  }

  logout() {
    return this.httpClient.post<any>(`${this.apiURL}logout`, {});
  }
}
