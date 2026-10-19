import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Categoria } from '../../../core/models/categoria.model';

@Injectable({
  providedIn: 'root',
})
export class CategoriasService {
  private httpClient = inject(HttpClient);

  private apiURL = `${environment.apiURL}categorias`;

  private _categoria_editar = signal<Categoria | null>(null);
  categoria_editar = this._categoria_editar.asReadonly();

  setCategoriaEditar(categoria: Categoria | null){
    this._categoria_editar.set(categoria);
  }

  obtenerCategorias() {
    return this.httpClient.get<any>(this.apiURL);
  }

  guardarCategoria(categoria: Categoria){
    return this.httpClient.post<any>(this.apiURL, categoria);
  }

  actualizarCategoria(categoria: Categoria, id_categoria: number){
    return this.httpClient.put<any>(`${this.apiURL}/${id_categoria}`, categoria);
  }
}