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
import { ConfirmationService } from 'primeng/api';
import { PRODUCTOS, CATEGORIAS, MARCAS } from '../../../data/mock-data';
import { Producto } from '../../../models/producto';

@Component({
  selector: 'app-productos',
  imports: [
    TableModule, ButtonModule, CardModule, DialogModule, InputTextModule, InputNumberModule,
    TextareaModule, SelectModule, MultiSelectModule, TagModule, ConfirmDialogModule, ReactiveFormsModule
  ],
  providers: [ConfirmationService],
  templateUrl: './productos.html',
  styleUrl: './productos.css',
})
export class Productos implements OnInit {
  productos = signal<Producto[]>(PRODUCTOS);
  dialogVisible = signal(false);
  preciosVisible = signal(false);
  editandoId: number | null = null;

  formulario!: FormGroup;

  opcionesCategoria = CATEGORIAS.map((c) => ({ label: c.nombre, value: c.id }));
  opcionesMarca = MARCAS.map((m) => ({ label: m.nombre, value: m.id }));
  opcionesUnidad = [
    { label: 'Unidad', value: 'unidad' },
    { label: 'Metro', value: 'metro' },
    { label: 'Kilogramo', value: 'kg' },
    { label: 'Metro cuadrado', value: 'm2' }
  ];

  constructor(
    private fb: FormBuilder,
    private confirmationService: ConfirmationService
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
  }

  abrirNueva() {
    this.editandoId = null;
    this.formulario.reset({ unidad_medida: 'unidad' });
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
    this.dialogVisible.set(true);
  }

  get productosSeleccionables() {
    return this.productos().map((p) => ({ label: p.nombre, value: p.id }));
  }

  get imagenPreview(): string {
    return this.formulario.get('imagen_url')?.value ?? '';
  }

  guardar() {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    this.dialogVisible.set(false);
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
        this.productos.update((lista) => lista.filter((p) => p.id !== producto.id));
      }
    });
  }

  nombreCategoria(id: number): string {
    return CATEGORIAS.find((c) => c.id === id)?.nombre ?? '—';
  }

  nombreMarca(id: number): string {
    return MARCAS.find((m) => m.id === id)?.nombre ?? '—';
  }
}