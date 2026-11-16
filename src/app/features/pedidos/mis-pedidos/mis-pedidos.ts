import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { SkeletonModule } from 'primeng/skeleton';
import { finalize } from 'rxjs';
import { PedidosService } from '../../../core/services/pedidos.service';
import { Pedido } from '../../../core/models/pedido.model';
import { PedidoDetalle } from '../../../shared/components/pedido-detalle/pedido-detalle';

@Component({
  selector: 'app-mis-pedidos',
  imports: [DatePipe, RouterLink, ButtonModule, TagModule, SkeletonModule, PedidoDetalle],
  templateUrl: './mis-pedidos.html',
  styles: ``,
})
export class MisPedidos {
  private pedidosService = inject(PedidosService);

  protected pedidos = signal<Pedido[]>([]);
  protected cargando = signal<boolean>(false);
  protected huboError = signal<boolean>(false);

  // Número del pedido que tiene el detalle abierto (null = ninguno)
  protected pedidoAbierto = signal<number | null>(null);

  ngOnInit() {
    this.obtenerMisPedidos();
  }

  obtenerMisPedidos() {
    this.cargando.set(true);
    this.huboError.set(false);

    this.pedidosService.obtenerMisPedidos().pipe(
      finalize(() => { this.cargando.set(false) })
    ).subscribe({
      next: (data) => {
        this.pedidos.set(data.data);
      },
      error: () => {
        this.huboError.set(true);
      }
    });
  }

  // Abre el detalle de un pedido, o lo cierra si ya estaba abierto
  verDetalle(id: number) {
    this.pedidoAbierto.set(this.pedidoAbierto() === id ? null : id);
  }

  // Color del tag según el estado del pedido (como el getSeverity de la lista de productos)
  getSeverity(estado: string) {
    switch (estado) {
      case 'Entregado':
        return 'success';
      case 'Enviado':
      case 'Procesando':
        return 'info';
      case 'Cancelado':
        return 'danger';
      default:
        return 'warn';
    }
  }
}
