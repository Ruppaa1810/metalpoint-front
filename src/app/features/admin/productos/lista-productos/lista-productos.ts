import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';
import { Router } from '@angular/router';
import { FiltroProductos } from './filtro-productos/filtro-productos';
import { PageHeader } from '../../../../shared/components/page-header/page-header';

export interface Producto {
  Nombre: string;
  Imagen: string;
  Categoria: string;
  Marca: string;
  Stock: number;
  Precio: number;
  Status: string;
}

@Component({
  selector: 'app-lista-productos',
  imports: [ButtonModule, FiltroProductos, TableModule, SkeletonModule, TagModule, PageHeader],
  templateUrl: './lista-productos.html',
  styles: ``,
})
export class ListaProductos {
  private router = inject(Router);

  products: Producto[] =
    [
      {
        "Nombre": "Caño Estructural 40x40",
        "Imagen": "https://placehold.co/96x64?text=Producto",
        "Categoria": "Perfiles y Hierros",
        "Marca": "Acindar",
        "Stock": 12,
        "Precio": 32000,
        "Status": "En Stock"
      },
      {
        "Nombre": "Disco de Corte 4.5\"",
        "Imagen": "https://placehold.co/96x64?text=Producto",
        "Categoria": "Abrasivos y Corte",
        "Marca": "Sinpar",
        "Stock": 3,
        "Precio": 1800,
        "Status": "Stock Bajo"
      },
      {
        "Nombre": "Electrodo 6013 2.5mm",
        "Imagen": "https://placehold.co/96x64?text=Producto",
        "Categoria": "Soldadura e Insumos",
        "Marca": "Conarco",
        "Stock": 0,
        "Precio": 9500,
        "Status": "Agotado"
      },
      {
        "Nombre": "Hierro Ángulo 1\" x 1/8",
        "Imagen": "https://placehold.co/96x64?text=Producto",
        "Categoria": "Perfiles y Hierros",
        "Marca": "Acindar",
        "Stock": 25,
        "Precio": 15400,
        "Status": "En Stock"
      }
    ];

  getSeverity(status: string) {
    switch (status) {
      case 'En Stock':
        return 'success';
      case 'Stock Bajo':
        return 'warn';
      case 'Agotado':
        return 'danger';
      default:
        return 'success';
    }
  }

  nuevoProducto() {
    this.router.navigate(['/admin/form-producto']);
  }
}