import { Component, input } from '@angular/core';
import { Pedido } from '../../../core/models/pedido.model';

@Component({
  selector: 'app-pedido-detalle',
  imports: [],
  templateUrl: './pedido-detalle.html',
  styles: ``,
})
export class PedidoDetalle {
  // INPUT: el componente padre (Mis pedidos o el panel admin) le pasa el pedido a mostrar
  pedido = input.required<Pedido>();
}
