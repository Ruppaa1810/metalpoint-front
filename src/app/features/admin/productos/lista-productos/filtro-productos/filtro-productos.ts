import { Component } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabel } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { Select } from 'primeng/select';
import { ButtonModule } from 'primeng/button';


@Component({
  selector: 'app-filtro-productos',
  imports: [InputTextModule, FloatLabel, IconFieldModule, InputIconModule, Select, ButtonModule],
  templateUrl: './filtro-productos.html',
  styles: ``,
})
export class FiltroProductos {
  protected categorias: any[] = [
    { id: '', name: 'Todas la categorías' },
    { id: 'perfiles', name: 'Perfiles y Hierros' },
    { id: 'abrasivos', name: 'Abrasivos y Corte' },
    { id: 'soldadura', name: 'Soldadura e Insumos' },
  ];

  protected estado: any[] = [
    { id: 'todo', name: 'Todos los estados' },
    { id: 'stock', name: 'En stock' },
    { id: 'stockBajo', name: 'Stock bajo' },
    { id: 'agotado', name: 'Agotado' },
  ];

}