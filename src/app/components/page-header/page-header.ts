import { Component, input, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';

// Encabezado reutilizable para las pantallas del panel administrativo.
// Recibe el título y opciones por input() y avisa con output() cuando se tocan los botones.
@Component({
  selector: 'app-page-header',
  imports: [ButtonModule],
  templateUrl: './page-header.html',
})
export class PageHeader {
  titulo = input.required<string>();
  descripcion = input('');
  textoBoton = input('');
  iconoBoton = input('pi pi-plus');
  botonCargando = input(false);

  // Botón secundario opcional (lo usa la pantalla de Productos)
  textoBotonSecundario = input('');
  iconoBotonSecundario = input('pi pi-chart-line');

  botonPresionado = output<void>();
  botonSecundarioPresionado = output<void>();
}