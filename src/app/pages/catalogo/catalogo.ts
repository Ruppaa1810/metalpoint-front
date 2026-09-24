import { Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { catchError, debounceTime, distinctUntilChanged, forkJoin, of, switchMap, tap } from 'rxjs';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { SliderModule } from 'primeng/slider';
import { SkeletonModule } from 'primeng/skeleton';
import { MessageService } from 'primeng/api';

import { ProductoCard } from '../../components/producto-card/producto-card';
import { FiltrosProducto, Producto } from '../../models/producto';
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
    SliderModule, SkeletonModule, ProductoCard
  ],
  templateUrl: './catalogo.html',
})
export class Catalogo {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private carrito = inject(CarritoService);
  private productoService = inject(ProductoService);
  private categoriaService = inject(CategoriaService);
  private marcaService = inject(MarcaService);
  private messageService = inject(MessageService);

  productos = signal<Producto[]>([]);
  categorias = signal<Categoria[]>([]);
  marcas = signal<Marca[]>([]);
  cargando = signal(true);
  huboError = signal(false);
  filtrosAbiertos = signal(false);

  busqueda = signal('');
  categoriaSeleccionada = signal<number | null>(null);
  subcategoriaSeleccionada = signal<number | null>(null);
  marcaSeleccionada = signal<number | null>(null);
  ordenSeleccionado = signal<string | null>(null);
  rangoPrecio = signal<number[]>([0, 0]);
  topePrecio = signal(0);
  private intentos = signal(0);

  opcionesCategoria = computed(() =>
    this.categorias()
      .filter((c) => !c.categoria_padre_id)
      .map((c) => ({ label: c.nombre, value: c.id }))
  );

  opcionesSubcategoria = computed(() =>
    this.categorias()
      .filter((c) => c.categoria_padre_id && c.categoria_padre_id === this.categoriaSeleccionada())
      .map((c) => ({ label: c.nombre, value: c.id }))
  );

  opcionesMarca = computed(() => this.marcas().map((m) => ({ label: m.nombre, value: m.id })));

  opcionesOrden = [
    { label: 'Precio: menor a mayor', value: 'precio_asc' },
    { label: 'Precio: mayor a menor', value: 'precio_desc' }
  ];

  filtros = computed<FiltrosProducto>(() => {
    const [minimo, maximo] = this.rangoPrecio();
    const tope = this.topePrecio();
    return {
      q: this.busqueda().trim(),
      categoria_id: this.subcategoriaSeleccionada() ?? this.categoriaSeleccionada(),
      marca_id: this.marcaSeleccionada(),
      precio_min: minimo > 0 ? minimo : null,
      precio_max: tope && maximo < tope ? maximo : null,
      orden: this.ordenSeleccionado()
    };
  });

  cantidadFiltrosActivos = computed(() => {
    const f = this.filtros();
    return [f.q, f.categoria_id, f.marca_id, f.precio_min ?? f.precio_max].filter((v) => v !== null && v !== '').length;
  });

  constructor() {
    const params = this.route.snapshot.queryParamMap;
    this.busqueda.set(params.get('q') ?? '');
    this.categoriaSeleccionada.set(this.aNumero(params.get('categoria')));
    this.subcategoriaSeleccionada.set(this.aNumero(params.get('subcategoria')));
    this.marcaSeleccionada.set(this.aNumero(params.get('marca')));
    this.ordenSeleccionado.set(params.get('orden'));

    this.cargarOpciones();

    toObservable(computed(() => ({ filtros: this.filtros(), intento: this.intentos() })))
      .pipe(
        debounceTime(300),
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
        tap(() => {
          this.cargando.set(true);
          this.huboError.set(false);
          this.guardarEnUrl();
        }),
        switchMap(({ filtros }) =>
          this.productoService.traerTodos(filtros).pipe(
            catchError(() => {
              this.huboError.set(true);
              return of([]);
            })
          )
        ),
        takeUntilDestroyed()
      )
      .subscribe((lista) => {
        this.productos.set(lista);
        this.cargando.set(false);
      });
  }

  private cargarOpciones() {
    forkJoin({
      categorias: this.categoriaService.traerTodas(),
      marcas: this.marcaService.traerTodas(),
      todos: this.productoService.traerTodos()
    }).subscribe({
      next: ({ categorias, marcas, todos }) => {
        this.categorias.set(categorias);
        this.marcas.set(marcas);
        const tope = Math.ceil(Math.max(0, ...todos.map((p) => p.precio)));
        this.topePrecio.set(tope);
        this.rangoPrecio.set([0, tope]);
      },
      error: () => this.huboError.set(true)
    });
  }

  private guardarEnUrl() {
    this.router.navigate([], {
      queryParams: {
        q: this.busqueda().trim() || null,
        categoria: this.categoriaSeleccionada(),
        subcategoria: this.subcategoriaSeleccionada(),
        marca: this.marcaSeleccionada(),
        orden: this.ordenSeleccionado()
      },
      replaceUrl: true
    });
  }

  private aNumero(valor: string | null): number | null {
    return valor ? Number(valor) : null;
  }

  cambiarCategoria(id: number | null) {
    this.categoriaSeleccionada.set(id);
    this.subcategoriaSeleccionada.set(null);
  }

  reintentar() {
    if (!this.topePrecio()) {
      this.cargarOpciones();
    }
    this.intentos.update((n) => n + 1);
  }

  limpiarFiltros() {
    this.busqueda.set('');
    this.cambiarCategoria(null);
    this.marcaSeleccionada.set(null);
    this.ordenSeleccionado.set(null);
    this.rangoPrecio.set([0, this.topePrecio()]);
  }

  enCarrito(producto: Producto): boolean {
    return this.carrito.estaEnCarrito(producto.id);
  }

  cantidadEnCarrito(producto: Producto): number {
    return this.carrito.cantidadDe(producto.id);
  }

  agregarAlCarrito(producto: Producto): void {
    this.carrito.agregar(producto);
    this.messageService.add({
      severity: 'success',
      summary: 'Agregado al carrito',
      detail: producto.nombre,
      life: 2000
    });
  }

  quitarDelCarrito(producto: Producto): void {
    this.carrito.quitarUno(producto.id);
  }
}
