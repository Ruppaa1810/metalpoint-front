import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { MARCAS } from '../../../data/mock-data';
import { Marca } from '../../../models/marca';

@Component({
  selector: 'app-marcas',
  imports: [TableModule, ButtonModule, CardModule, DialogModule, InputTextModule, ConfirmDialogModule, ReactiveFormsModule],
  providers: [ConfirmationService],
  templateUrl: './marcas.html',
  styleUrl: './marcas.css',
})
export class Marcas implements OnInit {
  marcas = signal<Marca[]>(MARCAS);
  dialogVisible = signal(false);
  editandoId: number | null = null;

  formulario!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.formulario = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(50)]]
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
    this.dialogVisible.set(false);
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
        this.marcas.update((lista) => lista.filter((m) => m.id !== marca.id));
      }
    });
  }
}