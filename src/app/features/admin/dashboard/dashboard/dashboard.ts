import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { MessageService } from 'primeng/api';
import { DashboardService } from '../dashboard.service';
import { PageHeader } from '../../../../shared/components/page-header/page-header';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, CardModule, TableModule, TagModule, ButtonModule, SkeletonModule, PageHeader],
  templateUrl: './dashboard.html',
  styles: ``,
})
export class Dashboard {
  private dashboardService = inject(DashboardService);
  private router = inject(Router);
  private toastService = inject(MessageService);

  protected resumen = signal<any>(null);

  ngOnInit() {
    this.obtenerResumen();
  }

  obtenerResumen() {
    this.dashboardService.obtenerResumen().subscribe({
      next: (data) => {
        this.resumen.set(data);
      },
      error: () => {
        this.toastService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar el resumen' });
      }
    });
  }

  // Al tocar la tarjeta va a la lista de pedidos ya filtrada (Notion: CU-PA-A-001)
  verPedidosPendientes() {
    this.router.navigate(['/admin/lista-pedidos'], { queryParams: { estado: 'Pendiente' } });
  }
}
