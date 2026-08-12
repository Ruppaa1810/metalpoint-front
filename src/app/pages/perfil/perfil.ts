import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-perfil',
  imports: [ButtonModule, TagModule, DividerModule],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css',
})
export class Perfil {
  usuario = {
    nombre: 'Santiago Rupani',
    email: 'santiagorupani1810@gmail.com',
    rol: 'Administrador'
  };
}