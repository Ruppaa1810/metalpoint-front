import { Component, inject, signal } from '@angular/core';
import { Button } from "primeng/button";
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { Select } from 'primeng/select';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { Router, RouterLink } from "@angular/router";
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { CategoriasService } from '../categorias.service';
import { Categoria } from '../../../../core/models/categoria.model';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-form-categoria',
  imports: [Button, InputTextModule, TextareaModule, Select, IconFieldModule, InputIconModule, RouterLink,
    ReactiveFormsModule
  ],
  templateUrl: './form-categoria.html',
  styles: ``,
})
export class FormCategoria {
  private fb = inject(FormBuilder);
  private categoriaService = inject(CategoriasService);
  private router = inject(Router);
  private toastService = inject(MessageService);

  protected categoriasPadre = signal<Categoria[]>([]);

  // true si se está editando, false si se está creando
  protected editando = signal<boolean>(false);

  formCategoria = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
    categoria_padre_id: [null as number | null],
  });

  ngOnInit() {
    this.editando.set(this.categoriaService.categoria_editar() != null);

    this.obtenerCategoriasPadre();

    if (this.categoriaService.categoria_editar() != null) {
      this.formCategoria.patchValue({
        nombre: this.categoriaService.categoria_editar()?.nombre,
        categoria_padre_id: this.categoriaService.categoria_editar()?.categoria_padre_id
      })
    } else {
      this.formCategoria.reset();
    }
  }

  obtenerCategoriasPadre() {
    this.categoriaService.obtenerCategorias().subscribe(
      (data) => {
        // Solo las categorías principales (sin padre) pueden ser padre de otra
        this.categoriasPadre.set(data.filter((c: Categoria) => c.categoria_padre_id == null));
      }
    )
  }

  guardarCategoria() {
    if (this.formCategoria.invalid) {
      // Marca los campos como tocados para que se vean los mensajes de error
      this.formCategoria.markAllAsTouched();
      return;
    }

    let categoria: Categoria = {
      nombre: this.formCategoria.value.nombre!,
      categoria_padre_id: this.formCategoria.value.categoria_padre_id ? Number(this.formCategoria.value.categoria_padre_id) : null
    }

    if (this.categoriaService.categoria_editar() == null) {
      this.categoriaService.guardarCategoria(categoria).subscribe({
        next: (data) => {
          this.toastService.add({ severity: 'success', summary: data.message });
          this.finalizarGuardado();
        },
        error: (e) => this.mostrarError(e)
      })
    } else {
      this.categoriaService.actualizarCategoria(categoria, this.categoriaService.categoria_editar()?.id!).subscribe({
        next: (data) => {
          this.toastService.add({ severity: 'success', summary: data.message });
          this.finalizarGuardado();
        },
        error: (e) => this.mostrarError(e)
      })
    }
  }

  mostrarError(e: HttpErrorResponse) {
    let mensaje = 'Ocurrió un error al guardar la categoría';

    if (e.status === 0) {
      mensaje = 'No se pudo conectar con el servidor';
    } else if (e.status === 422 && e.error?.errors?.nombre?.[0] === 'validation.unique') {
      mensaje = 'Ya existe una categoría con ese nombre';
    } else if (e.status === 422) {
      mensaje = 'Los datos enviados no son válidos';
    }

    this.toastService.add({ severity: 'error', summary: 'Error', detail: mensaje });
  }

  finalizarGuardado() {
    this.formCategoria.reset();
    this.router.navigate(['/admin/lista-categorias']);
  }
}