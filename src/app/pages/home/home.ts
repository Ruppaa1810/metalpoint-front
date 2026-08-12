import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { PRODUCTOS, CATEGORIAS } from '../../data/mock-data';
import { Producto } from '../../models/producto';
import { ProductoCard } from '../../components/producto-card/producto-card';
import { CarritoService } from '../../services/carrito.service';

@Component({
  selector: 'app-home',
  imports: [RouterLink, ButtonModule, CardModule, TagModule, ProductoCard],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  private carrito = inject(CarritoService);

  destacados: Producto[] = PRODUCTOS.slice(0, 4);
  categorias = CATEGORIAS.filter((c) => c.categoria_padre_id === null);

  enCarrito(producto: Producto): boolean {
    return this.carrito.estaEnCarrito(producto.id);
  }

  cantidadEnCarrito(producto: Producto): number {
    return this.carrito.cantidadDe(producto.id);
  }

  agregarAlCarrito(producto: Producto): void {
    this.carrito.agregar(producto);
  }

  quitarDelCarrito(producto: Producto): void {
    this.carrito.quitarUno(producto.id);
  }
}