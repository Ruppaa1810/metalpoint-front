import { Component, computed, input, output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { Producto } from '../../models/producto';

@Component({
  selector: 'app-producto-card',
  imports: [RouterLink, ButtonModule, TagModule],
  templateUrl: './producto-card.html',
})
export class ProductoCard {
  producto = input.required<Producto>();
  enCarrito = input(false);
  cantidadEnCarrito = input(0);

  agregar = output<Producto>();
  quitar = output<Producto>();

  imagenFallida = signal(false);

  precioFormateado = computed(() => '$ ' + this.producto().precio.toLocaleString('es-AR'));

  sinStock = computed(() => this.producto().stock <= 0);

  pocoStock = computed(() => this.producto().stock > 0 && this.producto().stock <= 5);

  etiquetaUnidad = computed(() => {
    switch (this.producto().unidad_medida) {
      case 'unidad':
        return 'por unidad';
      case 'metro':
        return 'por metro';
      case 'kg':
        return 'por kg';
      case 'm2':
        return 'por m²';
    }
  });
}
