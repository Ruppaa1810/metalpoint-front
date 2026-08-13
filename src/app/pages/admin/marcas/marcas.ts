import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';

import { Marca } from '../../../models/marca';
import { MarcaService } from '../../../services/marca.service';
import { obtenerMensajeDeError } from '../../../utils/mensajes-error';
import { PageHeader } from '../../../components/page-header/page-header';

@Component({
  selector: 'app-marcas',
  imports: [
    TableModule, ButtonModule, CardModule, DialogModule, InputTextModule,
    ConfirmDialogModule, ReactiveFormsModule, PageHeader
  ],
  providers: [ConfirmationService],
  templateUrl: './marcas.html',
  styleUrl: './marcas.css',
})
export class Marcas implements OnInit {
  marcas = signal<Marca[]>([]);
  cargando = signal(false);
  huboError = signal(false);

  dialogVisible = signal(false);
  guardando = signal(false);
  editandoId: number | null = null;

  formulario!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private marcaService: MarcaService
  ) {}

  ngOnInit(): void {
    this.formulario = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(50)]]
    });

    this.cargarMarcas();
  }

  cargarMarcas() {
    this.cargando.set(true);
    this.huboError.set(false);

    this.marcaService.traerTodas().subscribe({
      next: (lista) => this.marcas.set(lista),
      error: (error) => {
        this.huboError.set(true);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: obtenerMensajeDeError(error) });
      },
      complete: () => this.cargando.set(false)
    });
  }

  abrirNueva() {
    this.editandoId = null;
    this.formulario.reset({ nombre: '' });
    this.dialogVisible.set(true);
  }

  abrirEdicion(marca: Marca) {
    this.editandoId = marca.id;
    this.formulario.patchValue({ nombre: marca.nombre });
    this.dialogVisible.set(true);
  }

  guardar() {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const datos = this.formulario.value;
    this.guardando.set(true);

    // Si hay una marca en edición, se actualiza; si no, se crea
    const operacion = this.editandoId
      ? this.marcaService.actualizar(this.editandoId, datos)
      : this.marcaService.crear(datos);

    operacion.subscribe({
      next: (respuesta) => {
        this.messageService.add({ severity: 'success', summary: 'Listo', detail: respuesta.message });
        this.dialogVisible.set(false);
        this.cargarMarcas();
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: obtenerMensajeDeError(error) });
        this.guardando.set(false);
      }
    });
  }

  confirmarEliminar(event: Event, marca: Marca) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `¿Eliminar la marca "${marca.nombre}"?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        // Las marcas que tienen productos no se pueden borrar del servidor
        if ((marca.productos_count ?? 0) > 0) {
          this.messageService.add({
            severity: 'info',
            summary: 'No se puede eliminar',
            detail: 'Esta marca tiene productos asociados.'
          });
          return;
        }

        this.marcaService.eliminar(marca.id).subscribe({
          next: (respuesta) => {
            this.messageService.add({ severity: 'success', summary: 'Listo', detail: respuesta.message });
            this.cargarMarcas();
          },
          error: (error) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: obtenerMensajeDeError(error) });
          }
        });
      }
    });
  }
}