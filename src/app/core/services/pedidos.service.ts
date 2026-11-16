import { HttpClient } from '@angular/common/http';
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
}
