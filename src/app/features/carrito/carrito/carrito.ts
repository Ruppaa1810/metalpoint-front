import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { CarritoService } from '../../../core/services/carrito.service';
import { ItemCarrito } from '../../../core/models/item-carrito.model';

@Component({
  selector: 'app-carrito',
  imports: [RouterLink, ButtonModule, DividerModule],
  templateUrl: './carrito.html',
  styles: ``,
})
export class Carrito {
  protected carritoService = inject(CarritoService);
  private confirmationService = inject(ConfirmationService);
  private toastService = inject(MessageService);

  sumar(item: ItemCarrito) {
    this.carritoService.cambiarCantidad(item.producto.id!, item.cantidad + 1);
  }

  restar(item: ItemCarrito) {
    this.carritoService.cambiarCantidad(item.producto.id!, item.cantidad - 1);
  }

  subtotal(item: ItemCarrito): number {
    return item.producto.precio * item.cantidad;
  }

  eliminar(item: ItemCarrito) {
    this.confirmationService.confirm({
      message: `¿Querés sacar "${item.producto.nombre}" del carrito?`,
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.carritoService.eliminar(item.producto.id!);
        this.toastService.add({ severity: 'success', summary: 'Producto eliminado del carrito', life: 3000 });
      }
    });
  }

  vaciar() {
    this.confirmationService.confirm({
      message: '¿Estás seguro de vaciar el carrito?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.carritoService.vaciar();
        this.toastService.add({ severity: 'success', summary: 'Carrito vacío', life: 3000 });
      }
    });
  }
}
