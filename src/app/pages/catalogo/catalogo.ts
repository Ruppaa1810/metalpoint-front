import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { CheckboxModule } from 'primeng/checkbox';
import { SliderModule } from 'primeng/slider';
import { ProductoCard } from '../../components/producto-card/producto-card';
import { PRODUCTOS, CATEGORIAS, MARCAS } from '../../data/mock-data';
import { Producto } from '../../models/producto';
import { CarritoService } from '../../services/carrito.service';

@Component({
  selector: 'app-catalogo',
  imports: [
    FormsModule, InputTextModule, ButtonModule, SelectModule, InputGroupModule, InputGroupAddonModule,
    CheckboxModule, SliderModule, ProductoCard
  ],
  templateUrl: './catalogo.html',
  styleUrl: './catalogo.css',
})
export class Catalogo {
  private carrito = inject(CarritoService);

  productos = PRODUCTOS;
  categorias = CATEGORIAS;
  marcas = MARCAS;

  busqueda = signal('');
  categoriaSeleccionada = signal<number | null>(null);
  marcaSeleccionada = signal<number | null>(null);
  ordenSeleccionado = signal<string | null>(null);
  precioMin = signal(0);
  precioMax = signal(50000);

  get filtradas() {
    let lista = this.productos;

    const q = this.busqueda().trim().toLowerCase();
    if (q) {
      lista = lista.filter((p) => p.nombre.toLowerCase().includes(q));
    }

    if (this.categoriaSeleccionada()) {
      const hijoIds = this.categorias
        .filter((c) => c.categoria_padre_id === this.categoriaSeleccionada())
        .map((c) => c.id);
      lista = lista.filter(
        (p) => p.categoria_id === this.categoriaSeleccionada() || hijoIds.includes(p.categoria_id)
      );
    }

    if (this.marcaSeleccionada()) {
      lista = lista.filter((p) => p.marca_id === this.marcaSeleccionada());
    }

    lista = lista.filter((p) => p.precio >= this.precioMin() && p.precio <= this.precioMax());

    const orden = this.ordenSeleccionado();
    if (orden === 'precio_asc') {
      lista = [...lista].sort((a, b) => a.precio - b.precio);
    } else if (orden === 'precio_desc') {
      lista = [...lista].sort((a, b) => b.precio - a.precio);
    }

    return lista;
  }

  opcionesCategoria = CATEGORIAS.map((c) => ({ label: c.nombre, value: c.id }));
  opcionesMarca = MARCAS.map((m) => ({ label: m.nombre, value: m.id }));
  opcionesOrden = [
    { label: 'Precio: menor a mayor', value: 'precio_asc' },
    { label: 'Precio: mayor a menor', value: 'precio_desc' }
  ];

  limpiarFiltros() {
    this.busqueda.set('');
    this.categoriaSeleccionada.set(null);
    this.marcaSeleccionada.set(null);
    this.ordenSeleccionado.set(null);
    this.precioMin.set(0);
    this.precioMax.set(50000);
  }

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