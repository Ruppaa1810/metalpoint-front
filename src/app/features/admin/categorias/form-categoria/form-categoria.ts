import { Component, inject, signal } from '@angular/core';
import { Button } from "primeng/button";
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { Select } from 'primeng/select';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { RouterLink } from "@angular/router";
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { CategoriasService } from '../categorias.service';
import { Categoria } from '../../../../core/models/categoria.model';

@Component({
  selector: 'app-form-categoria',
  imports: [Button, InputTextModule, TextareaModule, Select, IconFieldModule, InputIconModule, RouterLink,
    ReactiveFormsModule, JsonPipe
  ],
  templateUrl: './form-categoria.html',
  styles: ``,
})
export class FormCategoria {
  private fb = inject(FormBuilder);
  private categoriaService = inject(CategoriasService);

  protected categoriasPadre = signal<Categoria[]>([]);

  formCategoria = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
    categoria_padre_id: [null as number | null],
  });

  ngOnInit() {
    this.obtenerCategoriasPadre();
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
    if(!this.formCategoria.invalid) {
      const categoria: any = this.formCategoria.value;

      this.categoriaService.guardarCategoria(categoria).subscribe(
        (data)=> {
          alert(data.message);
          this.formCategoria.reset();
        }
      )
    }
  }
}