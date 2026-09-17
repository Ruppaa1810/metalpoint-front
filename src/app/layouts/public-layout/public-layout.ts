import { Component, computed, inject, OnInit } from '@angular/core';
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
})
export class PublicLayout implements OnInit {
  private carrito = inject(CarritoService);
  private auth = inject(AuthService);

  totalCarrito = this.carrito.totalItems;
  usuario = this.auth.usuario;
  estaLogueado = this.auth.estaLogueado;
  esAdmin = this.auth.esAdmin;

  nombreUsuario = computed(() => this.usuario()?.name ?? 'Invitado');

  menuItems = computed<MenuItem[]>(() => {
    if (!this.estaLogueado()) {
      return [
        { label: 'Iniciar Sesión', icon: 'pi pi-sign-in', routerLink: '/login' },
        { label: 'Crear Cuenta', icon: 'pi pi-user-plus', routerLink: '/registro' },
      ];
    }

    const items: MenuItem[] = [
      { label: 'Mi Perfil', icon: 'pi pi-id-card', routerLink: '/perfil' },
    ];

    if (this.esAdmin()) {
      items.push({ label: 'Panel Admin', icon: 'pi pi-cog', routerLink: '/admin' });
    }

    items.push({ separator: true });
    items.push({
      label: 'Cerrar Sesión',
      icon: 'pi pi-sign-out',
      command: () => this.auth.logout(),
    });

    return items;
  });

  ngOnInit(): void {
    this.auth.cargarUsuarioActual();
  }
}
