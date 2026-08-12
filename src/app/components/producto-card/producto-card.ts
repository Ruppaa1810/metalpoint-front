import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { Producto } from '../../models/producto';

@Component({
  selector: 'app-producto-card',
  imports: [RouterLink, ButtonModule, TagModule],
  templateUrl: './producto-card.html',
  styleUrl: './producto-card.css',
})
export class ProductoCard {
  @Input({ required: true }) producto!: Producto;
  @Input() enCarrito = false;
  @Input() cantidadEnCarrito = 0;

  @Output() agregar = new EventEmitter<Producto>();
  @Output() quitar = new EventEmitter<Producto>();

  onAgregar(): void {
    this.agregar.emit(this.producto);
  }

  onQuitar(): void {
    this.quitar.emit(this.producto);
  }

  get precioFormateado(): string {
    return '$ ' + this.producto.precio.toLocaleString('es-AR');
  }
}