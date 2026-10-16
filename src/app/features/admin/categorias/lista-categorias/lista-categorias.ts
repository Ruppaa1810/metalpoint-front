import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { FiltroCategorias } from './filtro-categorias/filtro-categorias';
import { PageHeader } from '../../../../shared/components/page-header/page-header';

export interface Categoria {
  Nombre: string;
  Padre: string;
  Productos: number;
}

@Component({
  selector: 'app-lista-categorias',
  imports: [ButtonModule, TableModule, SkeletonModule, TagModule, FiltroCategorias, PageHeader],
  templateUrl: './lista-categorias.html',
  styles: ``,
})
export class ListaCategorias {
  private router = inject(Router);

  categorias: Categoria[] =
    [
      {
        "Nombre": "Perfiles y Hierros",
        "Padre": "-",
        "Productos": 12,
      },
      {
        "Nombre": "Caños Estructurales",
        "Padre": "Perfiles y Hierros",
        "Productos": 5,
      },
      {
        "Nombre": "Abrasivos y Corte",
        "Padre": "-",
        "Productos": 8,
      },
      {
        "Nombre": "Soldadura e Insumos",
        "Padre": "-",
        "Productos": 15,
      },

    ];

  nuevaCategoria() {
    this.router.navigate(['/admin/form-categoria']);
  }
}