import { Component, signal } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { BadgeModule } from 'primeng/badge';
import { RippleModule } from 'primeng/ripple';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { RouterLinkActive, RouterModule } from '@angular/router';


@Component({
  selector: 'app-sidebar',
  imports: [MenuModule, BadgeModule, RippleModule, AvatarModule, RouterModule, ButtonModule],
  standalone: true,
  templateUrl: './sidebar.html',
  styles: ``,
})
export class Sidebar {
  menuItems: MenuItem[] | undefined;

  modoOscuro = signal<boolean>(false);

  ngOnInit() {
    this.menuItems = [
      { label: 'Categorías', icon: 'pi pi-folder', routerLink: '/admin/lista-categorias' },
      { label: 'Marcas', icon: 'pi pi-tag', routerLink: '/admin/lista-marcas' },
      { label: 'Productos', icon: 'pi pi-box', routerLink: '/admin/lista-productos' }
    ];

    // Si la última vez quedó en modo oscuro, lo vuelvo a activar
    if (localStorage.getItem('modoOscuro') == 'si') {
      this.cambiarModo();
    }
  }

  // Agrega o saca la clase app-dark del <html> (así lo explica la documentación de PrimeNG)
  cambiarModo() {
    const html = document.querySelector('html');
    html?.classList.toggle('app-dark');

    this.modoOscuro.set(html?.classList.contains('app-dark') ?? false);
    localStorage.setItem('modoOscuro', this.modoOscuro() ? 'si' : 'no');
  }
}
