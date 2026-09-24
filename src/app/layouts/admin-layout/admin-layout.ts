import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ToastModule],
  templateUrl: './admin-layout.html',
})
export class AdminLayout implements OnInit {
  private auth = inject(AuthService);

  menuAbierto = signal(false);

  ngOnInit(): void {
    this.auth.cargarUsuarioActual();
  }

  cerrarSesion() {
    this.auth.logout();
  }
}
