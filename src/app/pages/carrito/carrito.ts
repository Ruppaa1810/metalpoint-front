import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { CarritoService } from '../../services/carrito.service';

@Component({
  selector: 'app-carrito',
  imports: [RouterLink, ButtonModule, TagModule, DividerModule],
  templateUrl: './carrito.html',
  styleUrl: './carrito.css',
})
export class Carrito {
  private carrito = inject(CarritoService);

  items = this.carrito.items;
  totalItems = this.carrito.totalItems;
  totalPrecio = this.carrito.totalPrecio;

  sumar(productoId: number): void {
    const item = this.items().find((i) => i.producto.id === productoId);
    if (item) {
      this.carrito.agregar(item.producto);
    }
  }

  restar(productoId: number): void {
    this.carrito.quitarUno(productoId);
  }

  eliminar(productoId: number): void {
    this.carrito.quitarItem(productoId);
  }

  vaciar(): void {
    this.carrito.limpiar();
  }

  subtotal(item: { producto: { precio: number }; cantidad: number }): number {
    return item.producto.precio * item.cantidad;
  }
}