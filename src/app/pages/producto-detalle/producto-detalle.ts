import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { SkeletonModule } from 'primeng/skeleton';

import { Producto } from '../../models/producto';
import { ProductoService } from '../../services/producto.service';
import { CarritoService } from '../../services/carrito.service';

@Component({
  selector: 'app-producto-detalle',
  imports: [RouterLink, ButtonModule, TagModule, DividerModule, SkeletonModule],
  templateUrl: './producto-detalle.html',
  styleUrl: './producto-detalle.css',
})
export class ProductoDetalle implements OnInit {
  private route = inject(ActivatedRoute);
  private carrito = inject(CarritoService);
  private productoService = inject(ProductoService);

  producto = signal<Producto | null>(null);
  cargando = signal(true);
  huboError = signal(false);
  noEncontrado = signal(false);
  imagenFallida = signal(false);

  private id = 0;

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.id = Number(idParam);
    this.cargarProducto();
  }

  cargarProducto() {
    this.cargando.set(true);
    this.huboError.set(false);
    this.noEncontrado.set(false);
    this.imagenFallida.set(false);

    this.productoService.traerUno(this.id).subscribe({
      next: (producto) => this.producto.set(producto),
      error: (error) => {
        // Si la API responde 404 es porque el producto no existe
        if (error instanceof HttpErrorResponse && error.status === 404) {
          this.noEncontrado.set(true);
        } else {
          this.huboError.set(true);
        }
      },
      complete: () => this.cargando.set(false)
    });
  }

  agregarAlCarrito(): void {
    const producto = this.producto();
    if (producto) {
      this.carrito.agregar(producto);
    }
  }
}