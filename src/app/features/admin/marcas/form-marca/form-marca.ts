import { Component, inject } from '@angular/core';
import { Button } from "primeng/button";
import { InputTextModule } from 'primeng/inputtext';
import { Router, RouterLink } from "@angular/router";
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { MarcasService } from '../marcas.service';
import { Marca } from '../../../../core/models/marca.model';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-form-marca',
  imports: [Button, InputTextModule, RouterLink, ReactiveFormsModule, JsonPipe],
  templateUrl: './form-marca.html',
  styles: ``,
})
export class FormMarca {
  private fb = inject(FormBuilder);
  private marcaService = inject(MarcasService);
  private router = inject(Router);
  private toastService = inject(MessageService);

  formMarca = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
  });

  ngOnInit() {
    if (this.marcaService.marca_editar() != null) {
      this.formMarca.patchValue({
        nombre: this.marcaService.marca_editar()?.nombre
      })
    } else {
      this.formMarca.reset();
    }
  }

  guardarMarca() {
    if (this.formMarca.invalid) {
      // Marca los campos como tocados para que se vean los mensajes de error
      this.formMarca.markAllAsTouched();
      return;
    }

    let marca: Marca = {
      nombre: this.formMarca.value.nombre!
    }

    if (this.marcaService.marca_editar() == null) {
      this.marcaService.guardarMarca(marca).subscribe({
        next: (data) => {
          this.toastService.add({ severity: 'success', summary: data.message });
          this.finalizarGuardado();
        },
        error: (e) => this.mostrarError(e)
      })
    } else {
      this.marcaService.actualizarMarca(marca, this.marcaService.marca_editar()?.id!).subscribe({
        next: (data) => {
          this.toastService.add({ severity: 'success', summary: data.message });
          this.finalizarGuardado();
        },
        error: (e) => this.mostrarError(e)
      })
    }
  }

  mostrarError(e: HttpErrorResponse) {
    let mensaje = 'Ocurrió un error al guardar la marca';

    if (e.status === 0) {
      mensaje = 'No se pudo conectar con el servidor';
    } else if (e.status === 422 && e.error?.errors?.nombre?.[0] === 'validation.unique') {
      mensaje = 'Ya existe una marca con ese nombre';
    } else if (e.status === 422) {
      mensaje = 'Los datos enviados no son válidos';
    }

    this.toastService.add({ severity: 'error', summary: 'Error', detail: mensaje });
  }

  finalizarGuardado() {
    this.formMarca.reset();
    this.router.navigate(['/admin/lista-marcas']);
  }
}
