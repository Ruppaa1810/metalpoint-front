import { Injectable, computed, effect, signal } from '@angular/core';
import { Producto } from '../models/producto';
import { CarritoItem } from '../models/carrito';

const STORAGE_KEY = 'metalpoint_carrito';

@Injectable({ providedIn: 'root' })
export class CarritoService {
  readonly items = signal<CarritoItem[]>(this.cargarDelStorage());

  totalItems = computed(() => this.items().reduce((acc, item) => acc + item.cantidad, 0));

  totalPrecio = computed(() =>
    this.items().reduce((acc, item) => acc + item.producto.precio * item.cantidad, 0)
  );

  constructor() {
    effect(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items()));
    });
  }

  agregar(producto: Producto): void {
    this.items.update((lista) => {
      const existente = lista.find((item) => item.producto.id === producto.id);
      if (existente) {
        return lista.map((item) =>
          item.producto.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }
      return [...lista, { producto, cantidad: 1 }];
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

  private cargarDelStorage(): CarritoItem[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as CarritoItem[]) : [];
    } catch {
      return [];
    }
  }
}