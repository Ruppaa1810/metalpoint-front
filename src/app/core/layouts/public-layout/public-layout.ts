import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { CarritoService } from '../../services/carrito.service';

@Component({
  selector: 'app-public-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ButtonModule, BadgeModule],
  templateUrl: './public-layout.html',
  styles: ``,
})
export class PublicLayout {
  // Lo uso en el HTML para mostrar cuántos productos hay en el carrito
  protected carritoService = inject(CarritoService);

  // Datos que guarda el AuthService en el localStorage cuando alguien inicia sesión
  protected nombreUsuario = signal<string>('');
  protected esAdmin = signal<boolean>(false);

  ngOnInit() {
    const usuario = localStorage.getItem('user_data');
    if (usuario != null) {
      this.nombreUsuario.set(JSON.parse(usuario).name);
    }

    this.esAdmin.set(localStorage.getItem('role') == 'Administrador');
  }
}
