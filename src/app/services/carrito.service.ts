import { Injectable, computed, effect, signal } from '@angular/core';
import { Producto } from '../models/producto';
import { CarritoItem } from '../models/carrito';

const CLAVE_STORAGE = 'metalpoint_carrito';

@Injectable({ providedIn: 'root' })
export class CarritoService {
  readonly items = signal<CarritoItem[]>(this.cargar());

  totalItems = computed(() => this.items().reduce((acc, item) => acc + item.cantidad, 0));

  totalPrecio = computed(() =>
    this.items().reduce((acc, item) => acc + item.producto.precio * item.cantidad, 0)
  );

  constructor() {
    effect(() => {
      localStorage.setItem(CLAVE_STORAGE, JSON.stringify(this.items()));
    });
  }

  agregar(producto: Producto, cantidad = 1): void {
    this.items.update((lista) => {
      const existente = lista.find((item) => item.producto.id === producto.id);
      const yaEnCarrito = existente?.cantidad ?? 0;
      const nuevaCantidad = Math.min(yaEnCarrito + cantidad, producto.stock);

      if (nuevaCantidad <= 0) {
        return lista;
      }

      if (existente) {
        return lista.map((item) =>
          item.producto.id === producto.id
            ? { ...item, cantidad: nuevaCantidad }
            : item
        );
      }

      return [...lista, { producto, cantidad: nuevaCantidad }];
    });
  }

  quitarUno(productoId: number): void {
    this.items.update((lista) =>
      lista
        .map((item) =>
          item.producto.id === productoId
            ? { ...item, cantidad: item.cantidad - 1 }
            : item
        )
        .filter((item) => item.cantidad > 0)
    );
  }

  quitarItem(productoId: number): void {
    this.items.update((lista) => lista.filter((item) => item.producto.id !== productoId));
  }

  limpiar(): void {
    this.items.set([]);
  }

  cantidadDe(productoId: number): number {
    return this.items().find((item) => item.producto.id === productoId)?.cantidad ?? 0;
  }

  estaEnCarrito(productoId: number): boolean {
    return this.cantidadDe(productoId) > 0;
  }

  private cargar(): CarritoItem[] {
    try {
      const raw = localStorage.getItem(CLAVE_STORAGE);
      return raw ? (JSON.parse(raw) as CarritoItem[]) : [];
    } catch {
      return [];
    }
  }
}
