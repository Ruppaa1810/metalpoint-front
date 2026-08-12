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
import { ConfirmationService } from 'primeng/api';
import { CATEGORIAS } from '../../../data/mock-data';
import { Categoria } from '../../../models/categoria';

@Component({
  selector: 'app-categorias',
  imports: [
    TableModule, ButtonModule, CardModule, DialogModule, InputTextModule, SelectModule,
    TagModule, ConfirmDialogModule, ReactiveFormsModule
  ],
  providers: [ConfirmationService],
  templateUrl: './categorias.html',
  styleUrl: './categorias.css',
})
export class Categorias implements OnInit {
  categorias = signal<Categoria[]>(CATEGORIAS);
  dialogVisible = signal(false);
  editandoId: number | null = null;

  formulario!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.formulario = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(50)]],
      categoria_padre_id: [null]
    });
  }

  get opcionesPadres() {
    return this.categorias()
      .filter((c) => c.categoria_padre_id === null)
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
    this.dialogVisible.set(false);
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
        this.categorias.update((lista) => lista.filter((c) => c.id !== categoria.id));
      }
    });
  }

  contarProductos(categoria: Categoria): number {
    return 0;
  }
}