import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';

export interface Marca {
  Nombre: string;
  Productos: number;
}

@Component({
  selector: 'app-lista-marcas',
  imports: [ButtonModule, TableModule, SkeletonModule, TagModule, RouterLink],
  templateUrl: './lista-marcas.html',
  styles: ``,
})
export class ListaMarcas {
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
}