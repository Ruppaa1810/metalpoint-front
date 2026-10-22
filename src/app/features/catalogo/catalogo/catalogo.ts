import { Component, inject, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { finalize } from 'rxjs';
import { CatalogoService } from '../catalogo.service';
import { Producto } from '../../../core/models/producto.model';
import { ProductoCard } from '../../../shared/components/producto-card/producto-card';

@Component({
  selector: 'app-catalogo',
  imports: [ButtonModule, SkeletonModule, ProductoCard],
  templateUrl: './catalogo.html',
  styles: ``,
})
export class Catalogo {
  private catalogoService = inject(CatalogoService);

  protected productos = signal<Producto[]>([]);
  protected cargando = signal<boolean>(false);
  protected huboError = signal<boolean>(false);

  ngOnInit() {
    this.obtenerProductos();
  }

  obtenerProductos() {
    this.cargando.set(true);
    this.huboError.set(false);

    this.catalogoService.obtenerProductos().pipe(
      finalize(() => { this.cargando.set(false) })
    ).subscribe({
      next: (data) => {
        this.productos.set(data);
      },
      error: () => {
        this.huboError.set(true);
      }
    });
  }
}
