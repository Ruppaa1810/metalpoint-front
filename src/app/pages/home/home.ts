import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { SkeletonModule } from 'primeng/skeleton';

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

  productos = signal<Producto[]>([]);
  categorias = signal<Categoria[]>([]);
  cargando = signal(true);
  huboError = signal(false);

  // Los primeros 4 productos cargados son los "destacados"
  destacados = computed(() => this.productos().slice(0, 4));
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
    this.carrito.agregar(producto);
  }

  quitarDelCarrito(producto: Producto): void {
    this.carrito.quitarUno(producto.id);
  }
}