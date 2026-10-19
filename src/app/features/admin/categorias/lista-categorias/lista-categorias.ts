import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { FiltroCategorias } from './filtro-categorias/filtro-categorias';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { CategoriasService } from '../categorias.service';
import { Categoria } from '../../../../core/models/categoria.model';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-lista-categorias',
  imports: [ButtonModule, TableModule, SkeletonModule, TagModule, FiltroCategorias, PageHeader],
  templateUrl: './lista-categorias.html',
  styles: ``,
})
export class ListaCategorias {
  private categoriasService = inject(CategoriasService);
  private router = inject(Router);

  private confirmationService = inject(ConfirmationService);
  private toastService = inject(MessageService);

  protected categorias = signal<Categoria[]>([]);

  ngOnInit() {
    this.obtenerCategorias();
  }

  obtenerCategorias() {
    this.categoriasService.obtenerCategorias().subscribe(
      (data) => {
        this.categorias.set(data);
      }
    )
  }

  editarCategoria(categoria: Categoria) {
    this.categoriasService.setCategoriaEditar(categoria);
    this.router.navigate(['/admin/form-categoria']);
  }

  nuevaCategoria() {
    this.categoriasService.setCategoriaEditar(null);
    this.router.navigate(['/admin/form-categoria']);
  }

  eliminarCategoria(categoria_id: number) {
    this.confirmationService.confirm({
      message: '¿Estás seguro de eliminar la categoria?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.categoriasService.eliminarCategoria(categoria_id).subscribe(
          (data) => {
            this.obtenerCategorias();
            this.toastService.add({ severity: 'success', summary: 'Categoria eliminada' });
          }
        )
      }
    });
  }
}