import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Producto } from '../../../core/models/producto.model';

@Injectable({
  providedIn: 'root',
})
export class ProductosService {
  private httpClient = inject(HttpClient);

  private apiURL = `${environment.apiURL}productos`;

  private _producto_editar = signal<Producto | null>(null);
  producto_editar = this._producto_editar.asReadonly();

  setProductoEditar(producto: Producto | null){
    this._producto_editar.set(producto);
  }

  obtenerProductos() {
    return this.httpClient.get<any>(this.apiURL);
  }

  guardarProducto(producto: Producto){
    return this.httpClient.post<any>(this.apiURL, producto);
  }

  actualizarProducto(producto: Producto, id_producto: number){
    return this.httpClient.put<any>(`${this.apiURL}/${id_producto}`, producto);
  }

  eliminarProducto(id_producto: number){
    return this.httpClient.delete<any>(`${this.apiURL}/${id_producto}`);
  }
}
