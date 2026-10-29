import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { finalize } from 'rxjs';
import { MessageService } from 'primeng/api';
import { CatalogoService } from '../catalogo.service';
import { CarritoService } from '../../../core/services/carrito.service';
import { Producto } from '../../../core/models/producto.model';

@Component({
  selector: 'app-producto-detalle',
  imports: [RouterLink, ButtonModule, SkeletonModule, TagModule, DividerModule],
  templateUrl: './producto-detalle.html',
  styles: ``,
})
export class ProductoDetalle {
  private route = inject(ActivatedRoute);
  private catalogoService = inject(CatalogoService);
  protected carritoService = inject(CarritoService);
  private toastService = inject(MessageService);

  protected producto = signal<Producto | null>(null);
  // Cantidad elegida para agregar al carrito
  protected cantidad = signal<number>(1);
  protected cargando = signal<boolean>(false);
  protected huboError = signal<boolean>(false);
  protected imagenFallida = signal<boolean>(false);

  ngOnInit() {
    this.obtenerProducto();
  }

  obtenerProducto() {
    // El id viene en la URL: /producto/5 → id = 5
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.cargando.set(true);
    this.huboError.set(false);

    this.catalogoService.obtenerProducto(id).pipe(
      finalize(() => { this.cargando.set(false) })
    ).subscribe({
      next: (data) => {
        this.producto.set(data);
      },
      error: (e: HttpErrorResponse) => {
        // 404 = el producto no existe, se muestra "Producto no encontrado"
        if (e.status !== 404) {
          this.huboError.set(true);
        }
      }
    });
  }

  // Cuántas unidades se pueden agregar todavía (stock menos lo que ya está en el carrito)
  disponible(p: Producto): number {
    return p.stock - this.carritoService.cantidadDe(p.id!);
  }

  sumarCantidad() {
    this.cantidad.update(valor => valor + 1);
  }

  restarCantidad() {
    this.cantidad.update(valor => valor - 1);
  }

  agregarAlCarrito(p: Producto) {
    const error = this.carritoService.agregar(p, this.cantidad());

    if (error) {
      this.toastService.add({ severity: 'warn', summary: error, life: 3000 });
    } else {
      this.toastService.add({ severity: 'success', summary: 'Producto añadido', detail: p.nombre, life: 3000 });
      this.cantidad.set(1);
    }
  }
}
