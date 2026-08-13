import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { TagModule } from 'primeng/tag';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';

import { Producto } from '../../../models/producto';
import { Categoria } from '../../../models/categoria';
import { Marca } from '../../../models/marca';
import { ProductoService } from '../../../services/producto.service';
import { CategoriaService } from '../../../services/categoria.service';
import { MarcaService } from '../../../services/marca.service';
import { obtenerMensajeDeError } from '../../../utils/mensajes-error';
import { PageHeader } from '../../../components/page-header/page-header';

@Component({
  selector: 'app-productos',
  imports: [
    TableModule, ButtonModule, CardModule, DialogModule, InputTextModule, InputNumberModule,
    TextareaModule, SelectModule, MultiSelectModule, TagModule, ConfirmDialogModule,
    ReactiveFormsModule, FormsModule, PageHeader
  ],
  providers: [ConfirmationService],
  templateUrl: './productos.html',
  styleUrl: './productos.css',
})
export class Productos implements OnInit {
  productos = signal<Producto[]>([]);
  categorias = signal<Categoria[]>([]);
  marcas = signal<Marca[]>([]);
  cargando = signal(false);
  huboError = signal(false);

  // Estado del diálogo de alta/edición
  dialogVisible = signal(false);
  guardando = signal(false);
  editandoId: number | null = null;
  imagenFallida = signal(false);

  // Estado del diálogo de actualización masiva de precios
  preciosVisible = signal(false);
  idsSeleccionados = signal<number[]>([]);
  porcentaje = signal<number | null>(null);
  aplicandoPrecios = signal(false);

  formulario!: FormGroup;

  opcionesUnidad = [
    { label: 'Unidad', value: 'unidad' },
    { label: 'Metro', value: 'metro' },
    { label: 'Kilogramo', value: 'kg' },
    { label: 'Metro cuadrado', value: 'm2' }
  ];

  constructor(
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private productoService: ProductoService,
    private categoriaService: CategoriaService,
    private marcaService: MarcaService
  ) {}

  ngOnInit(): void {
    this.formulario = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(255)]],
      descripcion: [''],
      precio: [null, [Validators.required, Validators.min(0)]],
      stock: [null, [Validators.required, Validators.min(0)]],
      unidad_medida: ['unidad', Validators.required],
      categoria_id: [null, Validators.required],
      marca_id: [null, Validators.required],
      imagen_url: ['', [Validators.pattern(/^https?:\/\/.+$/)]]
    });

    this.cargarProductos();
    this.cargarCategorias();
    this.cargarMarcas();
  }

  cargarProductos() {
    this.cargando.set(true);
    this.huboError.set(false);

    this.productoService.traerTodos().subscribe({
      next: (lista) => this.productos.set(lista),
      error: (error) => {
        this.huboError.set(true);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: obtenerMensajeDeError(error) });
      },
      complete: () => this.cargando.set(false)
    });
  }

  // Las listas de categorías y marcas alimentan los selects del formulario
  cargarCategorias() {
    this.categoriaService.traerTodas().subscribe({
      next: (lista) => this.categorias.set(lista),
      error: (error) => this.messageService.add({ severity: 'error', summary: 'Error', detail: obtenerMensajeDeError(error) })
    });
  }

  cargarMarcas() {
    this.marcaService.traerTodas().subscribe({
      next: (lista) => this.marcas.set(lista),
      error: (error) => this.messageService.add({ severity: 'error', summary: 'Error', detail: obtenerMensajeDeError(error) })
    });
  }

  get opcionesCategoria() {
    return this.categorias().map((c) => ({ label: c.nombre, value: c.id }));
  }

  get opcionesMarca() {
    return this.marcas().map((m) => ({ label: m.nombre, value: m.id }));
  }

  get productosSeleccionables() {
    return this.productos().map((p) => ({ label: p.nombre, value: p.id }));
  }

  get imagenPreview(): string {
    return this.formulario.get('imagen_url')?.value ?? '';
  }

  abrirNueva() {
    this.editandoId = null;
    this.formulario.reset({ unidad_medida: 'unidad' });
    this.imagenFallida.set(false);
    this.dialogVisible.set(true);
  }

  abrirEdicion(producto: Producto) {
    this.editandoId = producto.id;
    this.formulario.patchValue({
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
      stock: producto.stock,
      unidad_medida: producto.unidad_medida,
      categoria_id: producto.categoria_id,
      marca_id: producto.marca_id,
      imagen_url: producto.imagen_url
    });
    this.imagenFallida.set(false);
    this.dialogVisible.set(true);
  }

  guardar() {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const datos = this.formulario.value;
    this.guardando.set(true);

    // Si hay un producto en edición, se actualiza; si no, se crea
    const operacion = this.editandoId
      ? this.productoService.actualizar(this.editandoId, datos)
      : this.productoService.crear(datos);

    operacion.subscribe({
      next: (respuesta) => {
        this.messageService.add({ severity: 'success', summary: 'Listo', detail: respuesta.message });
        this.dialogVisible.set(false);
        this.cargarProductos();
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: obtenerMensajeDeError(error) });
        this.guardando.set(false);
      }
    });
  }

  confirmarEliminar(event: Event, producto: Producto) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `¿Eliminar el producto "${producto.nombre}"?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.productoService.eliminar(producto.id).subscribe({
          next: (respuesta) => {
            this.messageService.add({ severity: 'success', summary: 'Listo', detail: respuesta.message });
            this.cargarProductos();
          },
          error: (error) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: obtenerMensajeDeError(error) });
          }
        });
      }
    });
  }

  // Si una imagen no se puede cargar, mostramos el ícono de placeholder
  marcarImagenFallida(id: number) {
    this.imagenesFallidas.update((set) => new Set(set).add(id));
  }

  imagenesFallidas = signal<Set<number>>(new Set());

  // Aplica el porcentaje a los productos seleccionados (ej: +10% = 10)
  aplicarPrecios() {
    const ids = this.idsSeleccionados();
    const valor = this.porcentaje();

    if (ids.length === 0 || valor === null) {
      this.messageService.add({ severity: 'warn', summary: 'Faltan datos', detail: 'Seleccioná productos y un porcentaje.' });
      return;
    }

    this.aplicandoPrecios.set(true);
    this.productoService.actualizarPreciosMasivo(ids, valor).subscribe({
      next: (respuesta) => {
        this.messageService.add({ severity: 'success', summary: 'Listo', detail: respuesta.message });
        this.preciosVisible.set(false);
        this.idsSeleccionados.set([]);
        this.porcentaje.set(null);
        this.cargarProductos();
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: obtenerMensajeDeError(error) });
        this.aplicandoPrecios.set(false);
      }
    });
  }

  // El nombre viene anidado desde la API; si no, se busca en la lista cargada
  nombreCategoria(producto: Producto): string {
    return producto.categoria?.nombre ?? this.categorias().find((c) => c.id === producto.categoria_id)?.nombre ?? '—';
  }

  nombreMarca(producto: Producto): string {
    return producto.marca?.nombre ?? this.marcas().find((m) => m.id === producto.marca_id)?.nombre ?? '—';
  }
}