import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { PRODUCTOS, CATEGORIAS, MARCAS } from '../../../data/mock-data';

@Component({
  selector: 'app-panel',
  imports: [RouterLink, CardModule, ButtonModule, TableModule, TagModule],
  templateUrl: './panel.html',
  styleUrl: './panel.css',
})
export class Panel {
  totalProductos = PRODUCTOS.length;
  totalCategorias = CATEGORIAS.length;
  totalMarcas = MARCAS.length;
  stockTotal = PRODUCTOS.reduce((acc, p) => acc + p.stock, 0);
  productos = PRODUCTOS;
}