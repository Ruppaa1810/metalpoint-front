import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Producto } from '../models/producto';
import { RespuestaServidor } from './categoria.service';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProductoService {
  private http = inject(HttpClient);
  private urlBase = `${environment.apiUrl}/productos`;

  // Trae todos los productos (con su categoría y marca anidadas)
  traerTodos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.urlBase);
  }

  traerUno(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.urlBase}/${id}`);
  }

  crear(datos: Partial<Producto>): Observable<RespuestaServidor> {
    return this.http.post<RespuestaServidor>(this.urlBase, datos);
  }

  actualizar(id: number, datos: Partial<Producto>): Observable<RespuestaServidor> {
    return this.http.put<RespuestaServidor>(`${this.urlBase}/${id}`, datos);
  }

  eliminar(id: number): Observable<RespuestaServidor> {
    return this.http.delete<RespuestaServidor>(`${this.urlBase}/${id}`);
  }

  // Actualiza el precio de varios productos a la vez (porcentaje: 10 = +10%)
  actualizarPreciosMasivo(ids: number[], porcentaje: number): Observable<RespuestaServidor> {
    return this.http.post<RespuestaServidor>(`${this.urlBase}/actualizar-precios`, {
      ids,
      porcentaje
    });
  }
}