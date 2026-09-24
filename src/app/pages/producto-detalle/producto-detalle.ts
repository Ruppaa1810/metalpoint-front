import { Component, computed, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, of, switchMap, tap } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { SkeletonModule } from 'primeng/skeleton';
import { MessageService } from 'primeng/api';

import { Producto } from '../../models/producto';
import { ProductoService } from '../../services/producto.service';
import { CarritoService } from '../../services/carrito.service';
import { ProductoCard } from '../../components/producto-card/producto-card';

@Component({
  selector: 'app-producto-detalle',
  imports: [RouterLink, ButtonModule, TagModule, DividerModule, SkeletonModule, ProductoCard],
  templateUrl: './producto-detalle.html',
})
export class ProductoDetalle {
  private carrito = inject(CarritoService);
  private productoService = inject(ProductoService);
  private messageService = inject(MessageService);
  private titulo = inject(Title);

  id = input.required<string>();

  producto = signal<Producto | null>(null);
  relacionados = signal<Producto[]>([]);
  cargando = signal(true);
  huboError = signal(false);
  noEncontrado = signal(false);
  imagenFallida = signal(false);
  cantidad = signal(1);
  private intentos = signal(0);

  enCarrito = computed(() => {
    const p = this.producto();
    return p ? this.carrito.cantidadDe(p.id) : 0;
  });

  disponible = computed(() => (this.producto()?.stock ?? 0) - this.enCarrito());

  constructor() {
    toObservable(computed(() => ({ id: Number(this.id()), intento: this.intentos() })))
      .pipe(
        tap(() => {
          this.cargando.set(true);
          this.huboError.set(false);
          this.noEncontrado.set(false);
          this.imagenFallida.set(false);
          this.relacionados.set([]);
          this.cantidad.set(1);
        }),
        switchMap(({ id }) =>
          this.productoService.traerUno(id).pipe(
            catchError((error) => {
              if (error instanceof HttpErrorResponse && error.status === 404) {
                this.noEncontrado.set(true);
              } else {
                this.huboError.set(true);
              }
              return of(null);
            })
          )
        ),
        takeUntilDestroyed()
      )
      .subscribe((producto) => {
        this.producto.set(producto);
        this.cargando.set(false);
        if (producto) {
          this.titulo.setTitle(`${producto.nombre} | MetalPoint`);
          this.cargarRelacionados(producto);
        }
      });
  }

  private cargarRelacionados(producto: Producto) {
    this.productoService.traerTodos({ categoria_id: producto.categoria_id }).subscribe({
      next: (lista) => this.relacionados.set(lista.filter((p) => p.id !== producto.id).slice(0, 4)),
      error: () => this.relacionados.set([])
    });
  }

  reintentar(): void {
    this.intentos.update((n) => n + 1);
  }

  sumarCantidad(): void {
    this.cantidad.update((c) => Math.min(c + 1, this.disponible()));
  }

  restarCantidad(): void {
    this.cantidad.update((c) => Math.max(c - 1, 1));
  }

  agregarAlCarrito(): void {
    const producto = this.producto();
    if (!producto) {
      return;
    }
    const cantidad = Math.min(this.cantidad(), this.disponible());
    this.carrito.agregar(producto, cantidad);
    this.cantidad.set(1);
    this.messageService.add({
      severity: 'success',
      summary: 'Agregado al carrito',
      detail: `${cantidad} × ${producto.nombre}`,
      life: 2000
    });
  }

  enCarritoDe(producto: Producto): boolean {
    return this.carrito.estaEnCarrito(producto.id);
  }

  cantidadEnCarritoDe(producto: Producto): number {
    return this.carrito.cantidadDe(producto.id);
  }

  agregarRelacionado(producto: Producto): void {
    this.carrito.agregar(producto);
    this.messageService.add({ severity: 'success', summary: 'Agregado al carrito', detail: producto.nombre, life: 2000 });
  }

  quitarRelacionado(producto: Producto): void {
    this.carrito.quitarUno(producto.id);
  }
}
