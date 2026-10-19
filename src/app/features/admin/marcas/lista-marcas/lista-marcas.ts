import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { MarcasService } from '../marcas.service';
import { Marca } from '../../../../core/models/marca.model';

@Component({
  selector: 'app-lista-marcas',
  imports: [ButtonModule, TableModule, SkeletonModule, TagModule, PageHeader],
  templateUrl: './lista-marcas.html',
  styles: ``,
})
export class ListaMarcas {
  private marcasService = inject(MarcasService);
  private router = inject(Router);

  protected marcas = signal<Marca[]>([]);

  ngOnInit() {
    this.obtenerMarcas();
  }

  obtenerMarcas() {
    this.marcasService.obtenerMarcas().subscribe(
      (data) => {
        this.marcas.set(data);
      }
    )
  }

  editarMarca(marca: Marca) {
    this.marcasService.setMarcaEditar(marca);
    this.router.navigate(['/admin/form-marca']);
  }

  nuevaMarca() {
    this.marcasService.setMarcaEditar(null);
    this.router.navigate(['/admin/form-marca']);
  }
}
