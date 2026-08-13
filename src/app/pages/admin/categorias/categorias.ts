import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';

import { Categoria } from '../../../models/categoria';
import { CategoriaService } from '../../../services/categoria.service';
import { obtenerMensajeDeError } from '../../../utils/mensajes-error';
import { PageHeader } from '../../../components/page-header/page-header';

@Component({
  selector: 'app-categorias',
  imports: [
    TableModule, ButtonModule, CardModule, DialogModule, InputTextModule, SelectModule,
    TagModule, ConfirmDialogModule, ReactiveFormsModule, PageHeader
  ],
  providers: [ConfirmationService],
  templateUrl: './categorias.html',
  styleUrl: './categorias.css',
})
export class Categorias implements OnInit {
  // Lista de categorías y estado de la carga
  categorias = signal<Categoria[]>([]);
  cargando = signal(false);
  huboError = signal(false);

  // Estado del diálogo de alta/edición
  dialogVisible = signal(false);
  guardando = signal(false);
  editandoId: number | null = null;

  formulario!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private categoriaService: CategoriaService
  ) {}

  ngOnInit(): void {
    this.formulario = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(50)]],
      categoria_padre_id: [null]
    });

    this.cargarCategorias();
  }

  cargarCategorias() {
    this.cargando.set(true);
    this.huboError.set(false);

    this.categoriaService.traerTodas().subscribe({
      next: (lista) => this.categorias.set(lista),
      error: (error) => {
        this.huboError.set(true);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: obtenerMensajeDeError(error) });
      },
      complete: () => this.cargando.set(false)
    });
  }

  // Solo las categorías principales pueden ser "padre" (y no ella misma al editar)
  get opcionesPadres() {
    return this.categorias()
      .filter((c) => c.categoria_padre_id === null && c.id !== this.editandoId)
      .map((c) => ({ label: c.nombre, value: c.id }));
  }

  abrirNueva() {
    this.editandoId = null;
    this.formulario.reset({ nombre: '', categoria_padre_id: null });
    this.dialogVisible.set(true);
  }

  abrirEdicion(categoria: Categoria) {
    this.editandoId = categoria.id;
    this.formulario.patchValue({
      nombre: categoria.nombre,
      categoria_padre_id: categoria.categoria_padre_id ?? null
    });
    this.dialogVisible.set(true);
  }

  guardar() {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const datos = this.formulario.value;
    this.guardando.set(true);

    // Si hay una categoría en edición, se actualiza; si no, se crea
    const operacion = this.editandoId
      ? this.categoriaService.actualizar(this.editandoId, datos)
      : this.categoriaService.crear(datos);

    operacion.subscribe({
      next: (respuesta) => {
        this.messageService.add({ severity: 'success', summary: 'Listo', detail: respuesta.message });
        this.dialogVisible.set(false);
        this.cargarCategorias();
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: obtenerMensajeDeError(error) });
        this.guardando.set(false);
      }
    });
  }

  confirmarEliminar(event: Event, categoria: Categoria) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `¿Eliminar la categoría "${categoria.nombre}"?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        // No se puede borrar si tiene subcategorías o productos asociados
        const tieneSubcategorias = (categoria.subcategorias?.length ?? 0) > 0;
        const tieneProductos = (categoria.productos_count ?? 0) > 0;

        if (tieneSubcategorias || tieneProductos) {
          this.messageService.add({
            severity: 'info',
            summary: 'No se puede eliminar',
            detail: 'Esta categoría tiene subcategorías o productos asociados.'
          });
          return;
        }

        this.categoriaService.eliminar(categoria.id).subscribe({
          next: (respuesta) => {
            this.messageService.add({ severity: 'success', summary: 'Listo', detail: respuesta.message });
            this.cargarCategorias();
          },
          error: (error) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: obtenerMensajeDeError(error) });
          }
        });
      }
    });
  }
}