import { Component, OnInit, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { SkeletonModule } from 'primeng/skeleton';
import { MessageService } from 'primeng/api';

import { Producto } from '../../../models/producto';
import { Categoria } from '../../../models/categoria';
import { Marca } from '../../../models/marca';
import { ProductoService } from '../../../services/producto.service';
import { CategoriaService } from '../../../services/categoria.service';
import { MarcaService } from '../../../services/marca.service';
import { obtenerMensajeDeError } from '../../../utils/mensajes-error';
import { PageHeader } from '../../../components/page-header/page-header';

@Component({
  selector: 'app-panel',
  imports: [RouterLink, CardModule, ButtonModule, TableModule, TagModule, SkeletonModule, PageHeader],
  templateUrl: './panel.html',
  styleUrl: './panel.css',
})
export class Panel implements OnInit {
  cargando = signal(true);
  huboError = signal(false);

  productos = signal<Producto[]>([]);
  categorias = signal<Categoria[]>([]);
  marcas = signal<Marca[]>([]);

  // Estadísticas calculadas a partir de los datos cargados
  totalProductos = computed(() => this.productos().length);
  totalCategorias = computed(() => this.categorias().length);
  totalMarcas = computed(() => this.marcas().length);
  stockTotal = computed(() => this.productos().reduce((acc, p) => acc + p.stock, 0));

  // Muestra los últimos productos cargados (los de más abajo de la lista)
  ultimosProductos = computed(() => [...this.productos()].reverse().slice(0, 5));

  constructor(
    private messageService: MessageService,
    private productoService: ProductoService,
    private categoriaService: CategoriaService,
    private marcaService: MarcaService
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos() {
    this.cargando.set(true);
    this.huboError.set(false);

    // Las tres consultas se hacen en paralelo y esperamos que terminen todas
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
      error: (error) => {
        this.huboError.set(true);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: obtenerMensajeDeError(error) });
      },
      complete: () => this.cargando.set(false)
    });
  }
}