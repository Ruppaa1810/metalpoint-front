import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MarcasService {
  private httpClient = inject(HttpClient);

  private apiURL = `${environment.apiURL}marcas`;

  obtenerMarcas() {
    return this.httpClient.get<any>(this.apiURL);
  }
}
