import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { FiltrosProducto, Producto } from '../models/producto';
import { RespuestaServidor } from '../models/respuesta-servidor';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProductoService {
  private http = inject(HttpClient);
  private urlBase = `${environment.apiUrl}/productos`;
  private urlAdmin = `${environment.apiUrl}/admin/productos`;

  traerTodos(filtros: FiltrosProducto = {}): Observable<Producto[]> {
    let params = new HttpParams();
    for (const [clave, valor] of Object.entries(filtros)) {
      if (valor !== null && valor !== undefined && valor !== '') {
        params = params.set(clave, String(valor));
      }
    }
    return this.http.get<Producto[]>(this.urlBase, { params });
  }

  traerUno(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.urlBase}/${id}`);
  }

  crear(datos: Partial<Producto>): Observable<RespuestaServidor> {
    return this.http.post<RespuestaServidor>(this.urlAdmin, datos);
  }

  actualizar(id: number, datos: Partial<Producto>): Observable<RespuestaServidor> {
    return this.http.put<RespuestaServidor>(`${this.urlAdmin}/${id}`, datos);
  }

  eliminar(id: number): Observable<RespuestaServidor> {
    return this.http.delete<RespuestaServidor>(`${this.urlAdmin}/${id}`);
  }

  subirImagen(imagen: Blob): Observable<RespuestaServidor & { data: { url: string } }> {
    const datos = new FormData();
    datos.append('imagen', imagen, 'imagen.jpg');
    return this.http.post<RespuestaServidor & { data: { url: string } }>(`${environment.apiUrl}/admin/imagenes`, datos);
  }

  actualizarPreciosMasivo(ids: number[], porcentaje: number): Observable<RespuestaServidor> {
    return this.http.post<RespuestaServidor>(`${this.urlAdmin}/actualizar-precios`, {
      ids,
      porcentaje
    });
  }
}
