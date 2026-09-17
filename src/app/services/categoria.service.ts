import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Categoria } from '../models/categoria';
import { RespuestaServidor } from '../models/respuesta-servidor';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CategoriaService {
  private http = inject(HttpClient);
  private urlBase = `${environment.apiUrl}/categorias`;

  traerTodas(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.urlBase);
  }

  crear(datos: Partial<Categoria>): Observable<RespuestaServidor> {
    return this.http.post<RespuestaServidor>(this.urlBase, datos);
  }

  actualizar(id: number, datos: Partial<Categoria>): Observable<RespuestaServidor> {
    return this.http.put<RespuestaServidor>(`${this.urlBase}/${id}`, datos);
  }

  eliminar(id: number): Observable<RespuestaServidor> {
    return this.http.delete<RespuestaServidor>(`${this.urlBase}/${id}`);
  }
}
