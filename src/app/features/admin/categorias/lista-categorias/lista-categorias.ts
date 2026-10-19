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

@Component({
  selector: 'app-lista-categorias',
  imports: [ButtonModule, TableModule, SkeletonModule, TagModule, FiltroCategorias, PageHeader],
  templateUrl: './lista-categorias.html',
  styles: ``,
})
export class ListaCategorias {
  private categoriasService = inject(CategoriasService);
  private router = inject(Router);

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
}