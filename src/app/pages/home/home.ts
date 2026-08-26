import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { SkeletonModule } from 'primeng/skeleton';
import { MessageService } from 'primeng/api';

import { Producto } from '../../models/producto';
import { Categoria } from '../../models/categoria';
import { ProductoService } from '../../services/producto.service';
import { CategoriaService } from '../../services/categoria.service';
import { ProductoCard } from '../../components/producto-card/producto-card';
import { CarritoService } from '../../services/carrito.service';

@Component({
  selector: 'app-home',
  imports: [RouterLink, ButtonModule, CardModule, TagModule, SkeletonModule, ProductoCard],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  private carrito = inject(CarritoService);
  private productoService = inject(ProductoService);
  private categoriaService = inject(CategoriaService);
  private messageService = inject(MessageService);

  productos = signal<Producto[]>([]);
  categorias = signal<Categoria[]>([]);
  cargando = signal(true);
  huboError = signal(false);

  // Muestra los últimos 4 productos agregados al catálogo
  destacados = computed(() => [...this.productos()].reverse().slice(0, 4));
  categoriasPrincipales = computed(() => this.categorias().filter((c) => c.categoria_padre_id === null));

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos() {
    this.cargando.set(true);
    this.huboError.set(false);

    forkJoin({
      productos: this.productoService.traerTodos(),
      categorias: this.categoriaService.traerTodas()
    }).subscribe({
      next: (resultados) => {
        this.productos.set(resultados.productos);
        this.categorias.set(resultados.categorias);
      },
      error: () => this.huboError.set(true),
      complete: () => this.cargando.set(false)
    });
  }

  enCarrito(producto: Producto): boolean {
    return this.carrito.estaEnCarrito(producto.id);
  }

  cantidadEnCarrito(producto: Producto): number {
    return this.carrito.cantidadDe(producto.id);
  }

  agregarAlCarrito(producto: Producto): void {
    // Suma una unidad más (el servicio respeta el stock disponible)
    this.carrito.agregar(producto);
    this.messageService.add({
      severity: 'success',
      summary: 'Agregado al carrito',
      detail: `1× ${producto.nombre}`
    });
  }

  quitarDelCarrito(producto: Producto): void {
    this.carrito.quitarUno(producto.id);
  }
}