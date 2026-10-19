import { Component, inject, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';
import { Router } from '@angular/router';
import { FiltroProductos } from './filtro-productos/filtro-productos';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { ProductosService } from '../productos.service';
import { Producto } from '../../../../core/models/producto.model';

@Component({
  selector: 'app-lista-productos',
  imports: [ButtonModule, FiltroProductos, TableModule, SkeletonModule, TagModule, PageHeader],
  templateUrl: './lista-productos.html',
  styles: ``,
})
export class ListaProductos {
  private productosService = inject(ProductosService);
  private router = inject(Router);

  protected products = signal<Producto[]>([]);

  ngOnInit() {
    this.obtenerProductos();
  }

  obtenerProductos() {
    this.productosService.obtenerProductos().subscribe(
      (data) => {
        this.products.set(data);
      }
    )
  }

  // El estado se calcula según el stock
  getStatus(stock: number) {
    if (stock == 0) {
      return 'Agotado';
    } else if (stock <= 5) {
      return 'Stock Bajo';
    } else {
      return 'En Stock';
    }
  }

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

  editarProducto(producto: Producto) {
    this.productosService.setProductoEditar(producto);
    this.router.navigate(['/admin/form-producto']);
  }

  nuevoProducto() {
    this.productosService.setProductoEditar(null);
    this.router.navigate(['/admin/form-producto']);
  }
}
