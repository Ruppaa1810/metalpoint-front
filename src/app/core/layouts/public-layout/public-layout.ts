import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-public-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ButtonModule],
  templateUrl: './public-layout.html',
  styles: ``,
})
export class PublicLayout {
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
