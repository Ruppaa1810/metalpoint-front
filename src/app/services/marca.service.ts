import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Marca } from '../models/marca';
import { RespuestaServidor } from './categoria.service';

@Injectable({ providedIn: 'root' })
export class MarcaService {
  private http = inject(HttpClient);
  private urlBase = '/api/marcas';

  // Trae todas las marcas (con el conteo de productos de cada una)
  traerTodas(): Observable<Marca[]> {
    return this.http.get<Marca[]>(this.urlBase);
  }

  crear(datos: Partial<Marca>): Observable<RespuestaServidor> {
    return this.http.post<RespuestaServidor>(this.urlBase, datos);
  }

  actualizar(id: number, datos: Partial<Marca>): Observable<RespuestaServidor> {
    return this.http.put<RespuestaServidor>(`${this.urlBase}/${id}`, datos);
  }

  eliminar(id: number): Observable<RespuestaServidor> {
    return this.http.delete<RespuestaServidor>(`${this.urlBase}/${id}`);
  }
}