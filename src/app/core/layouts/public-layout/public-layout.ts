import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { MessageService } from 'primeng/api';
import { CarritoService } from '../../services/carrito.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-public-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ButtonModule, BadgeModule],
  templateUrl: './public-layout.html',
  styles: ``,
})
export class PublicLayout {
  // Lo uso en el HTML para mostrar cuántos productos hay en el carrito
  protected carritoService = inject(CarritoService);
  private authService = inject(AuthService);
  private toastService = inject(MessageService);
  private router = inject(Router);

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

  cerrarSesion() {
    this.authService.logout().subscribe({
      next: () => this.sesionCerrada(),
      error: () => this.sesionCerrada()
    });
  }

  sesionCerrada() {
    this.nombreUsuario.set('');
    this.esAdmin.set(false);
    this.toastService.add({ severity: 'success', summary: 'Sesión cerrada correctamente', life: 3000 });
    this.router.navigate(['/catalogo']);
  }
}
