import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { MarcasService } from '../marcas.service';
import { Marca } from '../../../../core/models/marca.model';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-lista-marcas',
  imports: [ButtonModule, TableModule, SkeletonModule, TagModule, PageHeader],
  templateUrl: './lista-marcas.html',
  styles: ``,
})
export class ListaMarcas {
  private marcasService = inject(MarcasService);
  private router = inject(Router);

  private confirmationService = inject(ConfirmationService);
  private toastService = inject(MessageService);

  protected marcas = signal<Marca[]>([]);

  ngOnInit() {
    this.obtenerMarcas();
  }

  obtenerMarcas() {
    this.marcasService.obtenerMarcas().subscribe({
      next: (data) => {
        this.marcas.set(data);
      },
      error: () => {
        this.toastService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar las marcas' });
      }
    })
  }

  editarMarca(marca: Marca) {
    this.marcasService.setMarcaEditar(marca);
    this.router.navigate(['/admin/form-marca']);
  }

  nuevaMarca() {
    this.marcasService.setMarcaEditar(null);
    this.router.navigate(['/admin/form-marca']);
  }

  eliminarMarca(marca_id: number) {
    this.confirmationService.confirm({
      message: '¿Estás seguro de eliminar la marca?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.marcasService.eliminarMarca(marca_id).subscribe({
          next: () => {
            this.obtenerMarcas();
            this.toastService.add({ severity: 'success', summary: 'Marca eliminada' });
          },
          error: () => {
            this.toastService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar la marca' });
          }
        })
      }
    });
  }
}
