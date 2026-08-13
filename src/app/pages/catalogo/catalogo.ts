import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { CheckboxModule } from 'primeng/checkbox';
import { SliderModule } from 'primeng/slider';
import { SkeletonModule } from 'primeng/skeleton';

import { ProductoCard } from '../../components/producto-card/producto-card';
import { Producto } from '../../models/producto';
import { Categoria } from '../../models/categoria';
import { Marca } from '../../models/marca';
import { ProductoService } from '../../services/producto.service';
import { CategoriaService } from '../../services/categoria.service';
import { MarcaService } from '../../services/marca.service';
import { CarritoService } from '../../services/carrito.service';

@Component({
  selector: 'app-catalogo',
  imports: [
    FormsModule, InputTextModule, ButtonModule, SelectModule, InputGroupModule, InputGroupAddonModule,
    CheckboxModule, SliderModule, SkeletonModule, ProductoCard
  ],
  templateUrl: './catalogo.html',
  styleUrl: './catalogo.css',
})
export class Catalogo implements OnInit {
  private carrito = inject(CarritoService);
  private productoService = inject(ProductoService);
  private categoriaService = inject(CategoriaService);
  private marcaService = inject(MarcaService);

  // Datos traídos desde la API
  productos = signal<Producto[]>([]);
  categorias = signal<Categoria[]>([]);
  marcas = signal<Marca[]>([]);
  cargando = signal(true);
  huboError = signal(false);

  // Filtros elegidos por el usuario
  busqueda = signal('');
  categoriaSeleccionada = signal<number | null>(null);
  marcaSeleccionada = signal<number | null>(null);
  ordenSeleccionado = signal<string | null>(null);
  precioMin = signal(0);
  precioMax = signal(50000);

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos() {
    this.cargando.set(true);
    this.huboError.set(false);

    // Las tres consultas se hacen en paralelo
    forkJoin({
      productos: this.productoService.traerTodos(),
      categorias: this.categoriaService.traerTodas(),
      marcas: this.marcaService.traerTodas()
    }).subscribe({
      next: (resultados) => {
        this.productos.set(resultados.productos);
        this.categorias.set(resultados.categorias);
        this.marcas.set(resultados.marcas);
      },
      error: () => this.huboError.set(true),
      complete: () => this.cargando.set(false)
    });
  }

  // Aplica todos los filtros a la lista de productos
  get filtradas() {
    let lista = this.productos();

    const q = this.busqueda().trim().toLowerCase();
    if (q) {
      lista = lista.filter((p) => p.nombre.toLowerCase().includes(q));
    }

    if (this.categoriaSeleccionada()) {
      // Si la categoría elegida tiene subcategorías, también se muestran sus productos
      const hijoIds = this.categorias()
        .filter((c) => c.categoria_padre_id === this.categoriaSeleccionada())
        .map((c) => c.id);
      lista = lista.filter(
        (p) => p.categoria_id === this.categoriaSeleccionada() || hijoIds.includes(p.categoria_id)
      );
    }

    if (this.marcaSeleccionada()) {
      lista = lista.filter((p) => p.marca_id === this.marcaSeleccionada());
    }

    lista = lista.filter((p) => p.precio >= this.precioMin() && p.precio <= this.precioMax());

    const orden = this.ordenSeleccionado();
    if (orden === 'precio_asc') {
      lista = [...lista].sort((a, b) => a.precio - b.precio);
    } else if (orden === 'precio_desc') {
      lista = [...lista].sort((a, b) => b.precio - a.precio);
    }

    return lista;
  }

  get opcionesCategoria() {
    return this.categorias().map((c) => ({ label: c.nombre, value: c.id }));
  }

  get opcionesMarca() {
    return this.marcas().map((m) => ({ label: m.nombre, value: m.id }));
  }

  opcionesOrden = [
    { label: 'Precio: menor a mayor', value: 'precio_asc' },
    { label: 'Precio: mayor a menor', value: 'precio_desc' }
  ];

  limpiarFiltros() {
    this.busqueda.set('');
    this.categoriaSeleccionada.set(null);
    this.marcaSeleccionada.set(null);
    this.ordenSeleccionado.set(null);
    this.precioMin.set(0);
    this.precioMax.set(50000);
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