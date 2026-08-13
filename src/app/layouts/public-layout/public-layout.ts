import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { ToastModule } from 'primeng/toast';
import { MenuItem } from 'primeng/api';
import { CarritoService } from '../../services/carrito.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-public-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, BadgeModule, ButtonModule, MenuModule, ToastModule],
  templateUrl: './public-layout.html',
  styleUrl: './public-layout.css',
})
export class PublicLayout {
  private carrito = inject(CarritoService);
  private auth = inject(AuthService);

  totalCarrito = this.carrito.totalItems;
  usuario = this.auth.usuario;

  nombreUsuario = computed(() => (this.usuario() === 'administrador' ? 'Administrador' : 'Invitado'));

  menuItems = computed<MenuItem[]>(() => {
    const usuario = this.usuario();
    if (usuario === null) {
      return [
        {
          label: 'Entrar como Invitado',
          icon: 'pi pi-user',
          command: () => this.auth.iniciarSesion('invitado')
        },
        {
          label: 'Entrar como Administrador',
          icon: 'pi pi-user-edit',
          command: () => this.auth.iniciarSesion('administrador')
        }
      ];
    }

    return [
      ...(usuario === 'administrador'
        ? [{ label: 'Mi Perfil', icon: 'pi pi-id-card', routerLink: '/perfil' } as MenuItem]
        : [{ label: 'Acceso Limitado', icon: 'pi pi-exclamation-triangle', disabled: true } as MenuItem]),
      { separator: true },
      {
        label: 'Cerrar Sesión',
        icon: 'pi pi-sign-out',
        command: () => this.auth.cerrarSesion()
      }
    ];
  });
}