import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
    ReactiveFormsModule, PageHeader
  ],
  providers: [ConfirmationService],
  templateUrl: './productos.html',
})
export class Productos implements OnInit {
  productos = signal<Producto[]>([]);
  categorias = signal<Categoria[]>([]);
  marcas = signal<Marca[]>([]);
  cargando = signal(false);
  huboError = signal(false);

  dialogVisible = signal(false);
  guardando = signal(false);
  editandoId: number | null = null;
  imagenFallida = signal(false);
  subiendoImagen = signal(false);

  preciosVisible = signal(false);
  aplicandoPrecios = signal(false);
  formularioPrecios!: FormGroup;

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

    this.formularioPrecios = this.fb.group({
      ids: [[], Validators.required],
      porcentaje: [null, [Validators.required, Validators.min(-100), Validators.max(100)]]
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
    const categorias = this.categorias();
    const nombreDe = (id: number) => categorias.find((c) => c.id === id)?.nombre;
    return categorias
      .map((c) => ({
        label: c.categoria_padre_id ? `${nombreDe(c.categoria_padre_id)} › ${c.nombre}` : c.nombre,
        value: c.id
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
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

  async subirImagen(evento: Event) {
    const selector = evento.target as HTMLInputElement;
    const archivo = selector.files?.[0];
    selector.value = '';
    if (!archivo) {
      return;
    }
    if (!archivo.type.startsWith('image/')) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'El archivo tiene que ser una imagen.' });
      return;
    }

    this.subiendoImagen.set(true);
    try {
      const imagen = await this.achicarImagen(archivo);
      this.productoService.subirImagen(imagen).subscribe({
        next: (respuesta) => {
          this.formulario.patchValue({ imagen_url: respuesta.data.url });
          this.formulario.get('imagen_url')?.markAsDirty();
          this.imagenFallida.set(false);
          this.subiendoImagen.set(false);
        },
        error: (error) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: obtenerMensajeDeError(error) });
          this.subiendoImagen.set(false);
        }
      });
    } catch {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo leer la imagen.' });
      this.subiendoImagen.set(false);
    }
  }

  quitarImagen() {
    this.formulario.patchValue({ imagen_url: '' });
    this.imagenFallida.set(false);
  }

  private async achicarImagen(archivo: File): Promise<Blob> {
    const original = await createImageBitmap(archivo);
    const escala = Math.min(1, 1200 / Math.max(original.width, original.height));
    const lienzo = document.createElement('canvas');
    lienzo.width = Math.round(original.width * escala);
    lienzo.height = Math.round(original.height * escala);
    const contexto = lienzo.getContext('2d')!;
    contexto.fillStyle = '#ffffff';
    contexto.fillRect(0, 0, lienzo.width, lienzo.height);
    contexto.drawImage(original, 0, 0, lienzo.width, lienzo.height);
    return new Promise((resolver, rechazar) =>
      lienzo.toBlob((blob) => (blob ? resolver(blob) : rechazar()), 'image/jpeg', 0.85)
    );
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

    const operacion = this.editandoId
      ? this.productoService.actualizar(this.editandoId, datos)
      : this.productoService.crear(datos);

    operacion.subscribe({
      next: (respuesta) => {
        this.messageService.add({ severity: 'success', summary: 'Listo', detail: respuesta.message });
        this.guardando.set(false);
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

  marcarImagenFallida(id: number) {
    this.imagenesFallidas.update((set) => new Set(set).add(id));
  }

  imagenesFallidas = signal<Set<number>>(new Set());

  abrirPrecios() {
    this.formularioPrecios.reset({ ids: [], porcentaje: null });
    this.preciosVisible.set(true);
  }

  aplicarPrecios() {
    if (this.formularioPrecios.invalid) {
      this.formularioPrecios.markAllAsTouched();
      return;
    }

    const ids = this.formularioPrecios.value.ids;
    const porcentaje = this.formularioPrecios.value.porcentaje;

    this.aplicandoPrecios.set(true);
    this.productoService.actualizarPreciosMasivo(ids, porcentaje).subscribe({
      next: (respuesta) => {
        this.messageService.add({ severity: 'success', summary: 'Listo', detail: respuesta.message });
        this.aplicandoPrecios.set(false);
        this.preciosVisible.set(false);
        this.formularioPrecios.reset({ ids: [], porcentaje: null });
        this.cargarProductos();
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: obtenerMensajeDeError(error) });
        this.aplicandoPrecios.set(false);
      }
    });
  }

  nombreCategoria(producto: Producto): string {
    return producto.categoria?.nombre ?? this.categorias().find((c) => c.id === producto.categoria_id)?.nombre ?? '—';
  }

  nombreMarca(producto: Producto): string {
    return producto.marca?.nombre ?? this.marcas().find((m) => m.id === producto.marca_id)?.nombre ?? '—';
  }
}
