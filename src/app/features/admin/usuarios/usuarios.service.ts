import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  private httpClient = inject(HttpClient);

  private apiURL = `${environment.apiURL}usuarios`;

  obtenerUsuarios(busqueda: string = '') {
    let params = new HttpParams();

    // Solo mando la búsqueda si escribieron algo
    if (busqueda) {
      params = params.set('q', busqueda);
    }

    return this.httpClient.get<any>(this.apiURL, { params });
  }
}
