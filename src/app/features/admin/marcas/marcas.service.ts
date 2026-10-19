import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Marca } from '../../../core/models/marca.model';

@Injectable({
  providedIn: 'root',
})
export class MarcasService {
  private httpClient = inject(HttpClient);

  private apiURL = `${environment.apiURL}marcas`;

  private _marca_editar = signal<Marca | null>(null);
  marca_editar = this._marca_editar.asReadonly();

  setMarcaEditar(marca: Marca | null){
    this._marca_editar.set(marca);
  }

  obtenerMarcas() {
    return this.httpClient.get<any>(this.apiURL);
  }

  guardarMarca(marca: Marca){
    return this.httpClient.post<any>(this.apiURL, marca);
  }

  actualizarMarca(marca: Marca, id_marca: number){
    return this.httpClient.put<any>(`${this.apiURL}/${id_marca}`, marca);
  }

  eliminarMarca(id_marca: number){
    return this.httpClient.delete<any>(`${this.apiURL}/${id_marca}`);
  }
}
