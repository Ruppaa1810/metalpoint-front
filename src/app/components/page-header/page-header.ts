import { Component, input, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';

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

  textoBotonSecundario = input('');
  iconoBotonSecundario = input('pi pi-chart-line');

  botonPresionado = output<void>();
  botonSecundarioPresionado = output<void>();
}