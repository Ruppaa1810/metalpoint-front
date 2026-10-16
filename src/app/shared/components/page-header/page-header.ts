import { Component, input, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-page-header',
  imports: [ButtonModule],
  templateUrl: './page-header.html',
  styles: ``,
})
export class PageHeader {
  // ========== INPUTS: Recibe datos del padre ==========
  // El padre los pasa como atributos: titulo="Categorias"
  titulo = input.required<string>();
  descripcion = input<string>('');
  textoBoton = input<string>('');

  // ========== OUTPUT: Emite eventos al padre ==========
  // El padre escucha con (botonPresionado)="metodoDelPadre()"
  botonPresionado = output<void>();

  presionarBoton(): void {
    this.botonPresionado.emit();
  }
}