import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { SkeletonModule } from 'primeng/skeleton';
import { PRODUCTOS } from '../../data/mock-data';
import { Producto } from '../../models/producto';
import { CarritoService } from '../../services/carrito.service';

@Component({
  selector: 'app-producto-detalle',
  imports: [RouterLink, ButtonModule, TagModule, DividerModule, SkeletonModule],
  templateUrl: './producto-detalle.html',
  styleUrl: './producto-detalle.css',
})
export class ProductoDetalle {
  private route = inject(ActivatedRoute);
  private carrito = inject(CarritoService);

  id = signal<number>(0);
  cargando = signal(true);

  producto = computed<Producto | undefined>(() =>
    PRODUCTOS.find((p) => p.id === this.id())
  );

  constructor() {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.id.set(Number(idParam));
    setTimeout(() => this.cargando.set(false), 600);
  }

  agregarAlCarrito(): void {
    const producto = this.producto();
    if (producto) {
      this.carrito.agregar(producto);
    }
  }
}