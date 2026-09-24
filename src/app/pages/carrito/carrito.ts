import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CarritoService } from '../../services/carrito.service';
import { ProductoService } from '../../services/producto.service';
import { CarritoItem } from '../../models/carrito';

@Component({
  selector: 'app-carrito',
  imports: [RouterLink, ButtonModule, DividerModule, ConfirmDialogModule],
  providers: [ConfirmationService],
  templateUrl: './carrito.html',
})
export class Carrito {
  private carrito = inject(CarritoService);
  private productoService = inject(ProductoService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);

  items = this.carrito.items;
  totalItems = this.carrito.totalItems;
  totalPrecio = this.carrito.totalPrecio;
  actualizando = signal(false);
  imagenesFallidas = signal<number[]>([]);

  constructor() {
    if (this.items().length > 0) {
      this.actualizarConLaApi();
    }
  }

  private actualizarConLaApi(): void {
    this.actualizando.set(true);
    this.productoService.traerTodos().subscribe({
      next: (productos) => {
        const cambios = this.carrito.sincronizar(productos);
        if (cambios.length > 0) {
          this.messageService.add({
            severity: 'warn',
            summary: 'Actualizamos tu carrito',
            detail: cambios.join('. '),
            life: 6000
          });
        }
        this.actualizando.set(false);
      },
      error: () => this.actualizando.set(false)
    });
  }

  sumar(item: CarritoItem): void {
    this.carrito.agregar(item.producto);
  }

  restar(item: CarritoItem): void {
    this.carrito.quitarUno(item.producto.id);
  }

  eliminar(item: CarritoItem): void {
    this.carrito.quitarItem(item.producto.id);
    this.messageService.add({ severity: 'info', summary: 'Producto eliminado', detail: item.producto.nombre, life: 2000 });
  }

  vaciar(evento: Event): void {
    this.confirmationService.confirm({
      target: evento.target as EventTarget,
      header: 'Vaciar carrito',
      message: '¿Seguro que querés sacar todos los productos del carrito?',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Vaciar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary p-button-text',
      accept: () => this.carrito.limpiar()
    });
  }

  subtotal(item: CarritoItem): number {
    return item.producto.precio * item.cantidad;
  }

  marcarImagenFallida(id: number): void {
    this.imagenesFallidas.update((ids) => [...ids, id]);
  }
}
