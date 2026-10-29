import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { debounceTime, finalize } from 'rxjs';
import { CatalogoService } from '../catalogo.service';
import { CategoriasService } from '../../admin/categorias/categorias.service';
import { MarcasService } from '../../admin/marcas/marcas.service';
import { Producto } from '../../../core/models/producto.model';
import { Categoria } from '../../../core/models/categoria.model';
import { Marca } from '../../../core/models/marca.model';
import { ProductoCard } from '../../../shared/components/producto-card/producto-card';
import { CarritoService } from '../../../core/services/carrito.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-catalogo',
  imports: [ButtonModule, SkeletonModule, SelectModule, InputTextModule, InputGroupModule,
    InputGroupAddonModule, ReactiveFormsModule, ProductoCard],
  templateUrl: './catalogo.html',
  styles: ``,
})
export class Catalogo {
  private fb = inject(FormBuilder);
  private catalogoService = inject(CatalogoService);
  private categoriasService = inject(CategoriasService);
  private marcasService = inject(MarcasService);
  private carritoService = inject(CarritoService);
  private toastService = inject(MessageService);

  protected productos = signal<Producto[]>([]);
  protected cargando = signal<boolean>(false);
  protected huboError = signal<boolean>(false);

  // Opciones de los select de filtros
  protected categorias = signal<Categoria[]>([]);
  protected subcategorias = signal<Categoria[]>([]);
  protected marcas = signal<Marca[]>([]);

  // En el celular los filtros se muestran solo si tocás el botón
  protected filtrosAbiertos = signal<boolean>(false);

  opcionesOrden = [
    { name: 'Precio: menor a mayor', id: 'precio_asc' },
    { name: 'Precio: mayor a menor', id: 'precio_desc' },
  ];

  formFiltros = this.fb.group({
    busqueda: [''],
    categoria: [null as number | null],
    subcategoria: [null as number | null],
    marca: [null as number | null],
    precio_min: [null as number | null],
    precio_max: [null as number | null],
    orden: [null as string | null],
  });

  ngOnInit() {
    this.obtenerProductos();
    this.obtenerCategorias();
    this.obtenerMarcas();

    // Cada vez que cambia un filtro vuelvo a pedir los productos.
    // debounceTime espera 400 ms sin cambios, así no hago un pedido por cada letra que se escribe
    this.formFiltros.valueChanges.pipe(debounceTime(400)).subscribe(() => {
      this.obtenerProductos();
    });

    // Al elegir una categoría muestro sus subcategorías
    this.formFiltros.get('categoria')?.valueChanges.subscribe(id => {
      const categoria = this.categorias().find(c => c.id == id);
      this.subcategorias.set(categoria?.subcategorias ?? []);
      this.formFiltros.patchValue({ subcategoria: null });
    });
  }

  obtenerProductos() {
    this.cargando.set(true);
    this.huboError.set(false);

    const filtros = this.formFiltros.value;

    this.catalogoService.obtenerProductos({
      q: filtros.busqueda,
      // Si eligió subcategoría filtro por esa, si no por la categoría (la API incluye sus subcategorías)
      categoria_id: filtros.subcategoria ?? filtros.categoria,
      marca_id: filtros.marca,
      precio_min: filtros.precio_min,
      precio_max: filtros.precio_max,
      orden: filtros.orden,
      // La tienda solo muestra productos activos y con stock (Notion)
      solo_disponibles: 1,
    }).pipe(
      finalize(() => { this.cargando.set(false) })
    ).subscribe({
      next: (data) => {
        this.productos.set(data);
      },
      error: () => {
        this.huboError.set(true);
      }
    });
  }

  obtenerCategorias() {
    this.categoriasService.obtenerCategorias().subscribe({
      next: (data: Categoria[]) => {
        // En el primer select van solo las categorías principales
        this.categorias.set(data.filter(c => c.categoria_padre_id == null));
      }
    });
  }

  obtenerMarcas() {
    this.marcasService.obtenerMarcas().subscribe({
      next: (data) => {
        this.marcas.set(data);
      }
    });
  }

  limpiarFiltros() {
    this.formFiltros.reset();
  }

  // true si hay algún filtro o búsqueda cargada (para elegir el mensaje cuando no hay resultados)
  hayFiltros(): boolean {
    return Object.values(this.formFiltros.value).some(valor => valor != null && valor !== '');
  }

  /**
   * Método que se ejecuta cuando el hijo (ProductoCard) emite el evento agregarCarrito
   * @param producto - El producto que el usuario quiere agregar al carrito
   */
  sumarAlCarrito(producto: Producto) {
    const error = this.carritoService.agregar(producto);

    if (error) {
      this.toastService.add({ severity: 'warn', summary: error, life: 3000 });
    } else {
      this.toastService.add({ severity: 'success', summary: 'Producto añadido', detail: producto.nombre, life: 3000 });
    }
  }
}
