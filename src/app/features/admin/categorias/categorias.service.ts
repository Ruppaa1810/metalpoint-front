import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Categoria } from '../../../core/models/categoria.model';

@Injectable({
  providedIn: 'root',
})
export class CategoriasService {
  private httpClient = inject(HttpClient);

  private apiURL = `${environment.apiURL}categorias`;

  obtenerCategorias() {
    return this.httpClient.get<any>(this.apiURL);
  }

  guardarCategoria(categoria: Categoria){
    return this.httpClient.post<any>(this.apiURL, categoria);
  }
}