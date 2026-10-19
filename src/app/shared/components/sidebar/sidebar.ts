import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { BadgeModule } from 'primeng/badge';
import { RippleModule } from 'primeng/ripple';
import { AvatarModule } from 'primeng/avatar';
import { RouterLinkActive, RouterModule } from '@angular/router';


@Component({
  selector: 'app-sidebar',
  imports: [MenuModule, BadgeModule, RippleModule, AvatarModule, RouterModule],
  standalone: true,
  templateUrl: './sidebar.html',
  styles: ``,
})
export class Sidebar {
  menuItems: MenuItem[] | undefined;

  ngOnInit() {
    this.menuItems = [
      { label: 'Categorías', icon: 'pi pi-folder', routerLink: '/admin/lista-categorias' },
      { label: 'Marcas', icon: 'pi pi-tag', routerLink: '/admin/lista-marcas' },
      { label: 'Productos', icon: 'pi pi-box', routerLink: '/admin/lista-productos' }
    ];
  }
}