import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { PageHeader } from '../../../../shared/components/page-header/page-header';

export interface Marca {
  Nombre: string;
  Productos: number;
}

@Component({
  selector: 'app-lista-marcas',
  imports: [ButtonModule, TableModule, SkeletonModule, TagModule, PageHeader],
  templateUrl: './lista-marcas.html',
  styles: ``,
})
export class ListaMarcas {
  private router = inject(Router);

  marcas: Marca[] =
    [
      {
        "Nombre": "Acindar",
        "Productos": 10,
      },
      {
        "Nombre": "Sinpar",
        "Productos": 6,
      },
      {
        "Nombre": "Conarco",
        "Productos": 4,
      },
      {
        "Nombre": "Genérico",
        "Productos": 3,
      },

    ];

  nuevaMarca() {
    this.router.navigate(['/admin/form-marca']);
  }
}