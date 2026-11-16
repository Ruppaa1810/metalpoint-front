import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PedidosService {
  private httpClient = inject(HttpClient);

  private apiURL = `${environment.apiURL}`;

  // Confirmar la compra (checkout)
  crearPedido(pedido: any) {
    return this.httpClient.post<any>(`${this.apiURL}pedidos`, pedido);
  }

  // Historial del cliente logueado
  obtenerMisPedidos() {
    return this.httpClient.get<any>(`${this.apiURL}mis-pedidos`);
  }

  // Todos los pedidos (solo admin), con filtro por estado y búsqueda
  obtenerPedidos(filtros: any = {}) {
    let params = new HttpParams();

    // Solo mando los filtros que tienen algún valor (igual que en el catálogo)
    for (const clave in filtros) {
      if (filtros[clave] != null && filtros[clave] !== '') {
        params = params.set(clave, filtros[clave]);
      }
    }

    return this.httpClient.get<any>(`${this.apiURL}pedidos`, { params });
  }

  // Cambiar el estado de un pedido (solo admin)
  actualizarEstado(id: number, estado: string, reintegrarStock: boolean) {
    return this.httpClient.put<any>(`${this.apiURL}pedidos/${id}/estado`, {
      estado,
      reintegrar_stock: reintegrarStock,
    });
  }
}
