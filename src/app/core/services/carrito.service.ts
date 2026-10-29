import { computed, effect, Injectable, signal } from '@angular/core';
import { ItemCarrito } from '../models/item-carrito.model';
import { Producto } from '../models/producto.model';

@Injectable({
  providedIn: 'root',
})
export class CarritoService {
  // Arranca con lo que haya quedado guardado en el localStorage
  private _items = signal<ItemCarrito[]>(this.leerCarrito());
  items = this._items.asReadonly();

  // computed: se recalculan solos cada vez que cambian los items
  cantidadTotal = computed(() =>
    this._items().reduce((suma, item) => suma + item.cantidad, 0)
  );

  total = computed(() =>
    this._items().reduce((suma, item) => suma + item.producto.precio * item.cantidad, 0)
  );

  constructor() {
    // effect: cada vez que cambian los items los guardo en el localStorage,
    // así el carrito sigue ahí aunque se recargue la página
    effect(() => {
      localStorage.setItem('carrito', JSON.stringify(this._items()));
    });
  }

  // Devuelve un mensaje de error si no se puede agregar, o null si salió bien
  agregar(producto: Producto, cantidad: number = 1): string | null {
    const enCarrito = this.cantidadDe(producto.id!);

    if (enCarrito + cantidad > producto.stock) {
      return `Solo quedan ${producto.stock} unidades en stock`;
    }

    if (enCarrito > 0) {
      // Si ya está en el carrito le sumo la cantidad
      this._items.update(items =>
        items.map(item =>
          item.producto.id === producto.id
            ? { ...item, cantidad: item.cantidad + cantidad }
            : item
        )
      );
    } else {
      this._items.update(items => [...items, { producto, cantidad }]);
    }

    return null;
  }

  cantidadDe(id: number): number {
    return this._items().find(item => item.producto.id === id)?.cantidad ?? 0;
  }

  private leerCarrito(): ItemCarrito[] {
    const guardado = localStorage.getItem('carrito');
    return guardado ? JSON.parse(guardado) : [];
  }
}
