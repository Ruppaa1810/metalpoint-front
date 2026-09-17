import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-perfil',
  imports: [ButtonModule, TagModule, DividerModule],
  templateUrl: './perfil.html',
})
export class Perfil {
  private auth = inject(AuthService);

  usuario = this.auth.usuario;
}
