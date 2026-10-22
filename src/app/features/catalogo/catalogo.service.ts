import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CatalogoService {
  private httpClient = inject(HttpClient);

  private apiURL = `${environment.apiURL}productos`;

  // Los filtros viajan en la URL, ej: productos?q=disco&marca_id=2&orden=precio_asc
  obtenerProductos(filtros: any = {}) {
    let params = new HttpParams();

    // Solo mando los filtros que tienen algún valor
    for (const clave in filtros) {
      if (filtros[clave] != null && filtros[clave] !== '') {
        params = params.set(clave, filtros[clave]);
      }
    }

    return this.httpClient.get<any>(this.apiURL, { params });
  }
}
