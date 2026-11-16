import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { debounceTime } from 'rxjs';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { UsuariosService } from '../usuarios.service';

@Component({
  selector: 'app-lista-usuarios',
  imports: [DatePipe, ReactiveFormsModule, TableModule, TagModule, InputTextModule, PageHeader],
  templateUrl: './lista-usuarios.html',
  styles: ``,
})
export class ListaUsuarios {
  private fb = inject(FormBuilder);
  private usuariosService = inject(UsuariosService);
  private toastService = inject(MessageService);

  protected usuarios = signal<any[]>([]);

  formFiltros = this.fb.group({
    busqueda: [''],
  });

  ngOnInit() {
    this.obtenerUsuarios();

    // Cada vez que escriben en el buscador vuelvo a pedir los usuarios (como en Pedidos)
    this.formFiltros.valueChanges.pipe(debounceTime(400)).subscribe(() => {
      this.obtenerUsuarios();
    });
  }

  obtenerUsuarios() {
    this.usuariosService.obtenerUsuarios(this.formFiltros.value.busqueda ?? '').subscribe({
      next: (data) => {
        this.usuarios.set(data);
      },
      error: () => {
        this.toastService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los usuarios' });
      }
    });
  }
}
