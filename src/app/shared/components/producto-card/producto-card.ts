import { Component, input, signal } from '@angular/core';
import { TagModule } from 'primeng/tag';
import { Producto } from '../../../core/models/producto.model';

@Component({
  selector: 'app-producto-card',
  imports: [TagModule],
  templateUrl: './producto-card.html',
  styles: ``,
})
export class ProductoCard {
  // El catálogo (componente padre) le pasa el producto con [producto]="producto"
  producto = input.required<Producto>();

  // Si la imagen no carga, muestro un ícono en su lugar
  protected imagenFallida = signal<boolean>(false);
}
