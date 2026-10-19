import { Component, inject, signal } from '@angular/core';
import { Button } from "primeng/button";
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { Select } from 'primeng/select';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { Router, RouterLink } from "@angular/router";
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { ProductosService } from '../productos.service';
import { CategoriasService } from '../../categorias/categorias.service';
import { MarcasService } from '../../marcas/marcas.service';
import { Producto } from '../../../../core/models/producto.model';
import { Categoria } from '../../../../core/models/categoria.model';
import { Marca } from '../../../../core/models/marca.model';

@Component({
  selector: 'app-form-producto',
  imports: [Button, InputTextModule, TextareaModule, Select, IconFieldModule, InputIconModule, RouterLink,
    ReactiveFormsModule, JsonPipe
  ],
  templateUrl: './form-producto.html',
  styles: ``,
})
export class FormProducto {
  private fb = inject(FormBuilder);
  private productoService = inject(ProductosService);
  private categoriaService = inject(CategoriasService);
  private marcaService = inject(MarcasService);
  private router = inject(Router);
  private toastService = inject(MessageService);

  protected categorias = signal<Categoria[]>([]);
  protected marcas = signal<Marca[]>([]);

  // Las unidades que acepta la API
  protected unidades: any[] = [
    { id: 'unidad', name: 'Por unidad' },
    { id: 'metro', name: 'Por metro' },
    { id: 'kg', name: 'Por kg' },
    { id: 'm2', name: 'Por m²' },
  ];

  formProducto = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
    marca_id: [null as number | null, [Validators.required]],
    categoria_id: [null as number | null, [Validators.required]],
    imagen_url: [''],
    descripcion: [''],
    precio: [null as number | null, [Validators.required, Validators.min(0)]],
    unidad_medida: ['unidad', [Validators.required]],
    stock: [null as number | null, [Validators.required, Validators.min(0)]],
  });

  ngOnInit() {
    this.obtenerCategorias();
    this.obtenerMarcas();

    if (this.productoService.producto_editar() != null) {
      const producto = this.productoService.producto_editar();
      this.formProducto.patchValue({
        nombre: producto?.nombre,
        marca_id: producto?.marca_id,
        categoria_id: producto?.categoria_id,
        imagen_url: producto?.imagen_url,
        descripcion: producto?.descripcion,
        precio: producto?.precio,
        unidad_medida: producto?.unidad_medida,
        stock: producto?.stock
      })
    } else {
      this.formProducto.reset({ unidad_medida: 'unidad' });
    }
  }

  obtenerCategorias() {
    this.categoriaService.obtenerCategorias().subscribe(
      (data) => {
        this.categorias.set(data);
      }
    )
  }

  obtenerMarcas() {
    this.marcaService.obtenerMarcas().subscribe(
      (data) => {
        this.marcas.set(data);
      }
    )
  }

  guardarProducto() {
    if (this.formProducto.invalid) {
      // Marca los campos como tocados para que se vean los mensajes de error
      this.formProducto.markAllAsTouched();
      return;
    }

    let producto: Producto = {
      nombre: this.formProducto.value.nombre!,
      marca_id: Number(this.formProducto.value.marca_id),
      categoria_id: Number(this.formProducto.value.categoria_id),
      imagen_url: this.formProducto.value.imagen_url || null,
      descripcion: this.formProducto.value.descripcion || null,
      precio: Number(this.formProducto.value.precio),
      unidad_medida: this.formProducto.value.unidad_medida!,
      stock: Number(this.formProducto.value.stock)
    }

    if (this.productoService.producto_editar() == null) {
      this.productoService.guardarProducto(producto).subscribe({
        next: (data) => {
          this.toastService.add({ severity: 'success', summary: data.message });
          this.finalizarGuardado();
        },
        error: (e) => this.mostrarError(e)
      })
    } else {
      this.productoService.actualizarProducto(producto, this.productoService.producto_editar()?.id!).subscribe({
        next: (data) => {
          this.toastService.add({ severity: 'success', summary: data.message });
          this.finalizarGuardado();
        },
        error: (e) => this.mostrarError(e)
      })
    }
  }

  mostrarError(e: HttpErrorResponse) {
    let mensaje = 'Ocurrió un error al guardar el producto';

    if (e.status === 0) {
      mensaje = 'No se pudo conectar con el servidor';
    } else if (e.status === 422 && e.error?.errors?.imagen_url) {
      mensaje = 'La imagen tiene que ser una URL válida';
    } else if (e.status === 422) {
      mensaje = 'Los datos enviados no son válidos';
    }

    this.toastService.add({ severity: 'error', summary: 'Error', detail: mensaje });
  }

  finalizarGuardado() {
    this.formProducto.reset({ unidad_medida: 'unidad' });
    this.router.navigate(['/admin/lista-productos']);
  }
}
