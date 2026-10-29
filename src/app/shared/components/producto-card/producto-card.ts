import { Component, input, output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { Producto } from '../../../core/models/producto.model';

@Component({
  selector: 'app-producto-card',
  imports: [TagModule, ButtonModule, RouterLink],
  templateUrl: './producto-card.html',
  styles: ``,
})
export class ProductoCard {
  // INPUT: el catálogo (componente padre) le pasa el producto con [producto]="producto"
  producto = input.required<Producto>();

  // OUTPUT: avisa al padre que tocaron "Agregar". El padre escucha con (agregarCarrito)="sumarAlCarrito($event)"
  agregarCarrito = output<Producto>();

  // Si la imagen no carga, muestro un ícono en su lugar
  protected imagenFallida = signal<boolean>(false);

  agregarAlCarrito(): void {
    // Emito el producto completo al padre
    this.agregarCarrito.emit(this.producto());
  }
}
