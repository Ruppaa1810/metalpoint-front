import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmationService, MessageService } from 'primeng/api';
import { debounceTime } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { PedidosService } from '../../../../core/services/pedidos.service';
import { Pedido } from '../../../../core/models/pedido.model';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { PedidoDetalle } from '../../../../shared/components/pedido-detalle/pedido-detalle';

@Component({
  selector: 'app-lista-pedidos',
  imports: [DatePipe, ReactiveFormsModule, TableModule, TagModule, ButtonModule, SelectModule, InputTextModule,
    DialogModule, CheckboxModule, PageHeader, PedidoDetalle],
  templateUrl: './lista-pedidos.html',
  styles: ``,
})
export class ListaPedidos {
  private fb = inject(FormBuilder);
  private pedidosService = inject(PedidosService);
  private toastService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  private route = inject(ActivatedRoute);

  protected pedidos = signal<Pedido[]>([]);

  // El pedido que se está viendo en el diálogo
  protected pedidoSeleccionado = signal<Pedido | null>(null);
  protected verDialogo = signal<boolean>(false);

  estados = ['Pendiente', 'Procesando', 'Enviado', 'Entregado', 'Cancelado'];

  formFiltros = this.fb.group({
    estado: [null as string | null],
    busqueda: [''],
  });

  formEstado = this.fb.group({
    estado: [null as string | null, [Validators.required]],
    reintegrar_stock: [true],
  });

  ngOnInit() {
    // Si viene del dashboard con ?estado=Pendiente, arranco con ese filtro puesto
    const estado = this.route.snapshot.queryParamMap.get('estado');
    if (estado) {
      this.formFiltros.patchValue({ estado: estado });
    }

    this.obtenerPedidos();

    // Cada vez que cambia un filtro vuelvo a pedir los pedidos (como en el catálogo)
    this.formFiltros.valueChanges.pipe(debounceTime(400)).subscribe(() => {
      this.obtenerPedidos();
    });
  }

  obtenerPedidos() {
    const filtros = this.formFiltros.value;

    this.pedidosService.obtenerPedidos({
      estado: filtros.estado,
      q: filtros.busqueda,
    }).subscribe({
      next: (data) => {
        this.pedidos.set(data);
      },
      error: () => {
        this.toastService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los pedidos' });
      }
    });
  }

  verPedido(pedido: Pedido) {
    this.pedidoSeleccionado.set(pedido);
    this.formEstado.reset({ estado: null, reintegrar_stock: true });
    this.verDialogo.set(true);
  }

  // A qué estados puede pasar el pedido: solo hacia adelante, o Cancelado (igual que valida la API)
  estadosSiguientes(pedido: Pedido): string[] {
    if (pedido.estado === 'Entregado' || pedido.estado === 'Cancelado') {
      return [];
    }
    const orden = ['Pendiente', 'Procesando', 'Enviado', 'Entregado'];
    return [...orden.slice(orden.indexOf(pedido.estado) + 1), 'Cancelado'];
  }

  guardarEstado() {
    if (this.formEstado.invalid) {
      this.formEstado.markAllAsTouched();
      return;
    }

    // Cancelar no se puede deshacer: pido confirmación como al eliminar
    if (this.formEstado.value.estado === 'Cancelado') {
      this.confirmationService.confirm({
        message: `¿Estás seguro de cancelar el pedido #${this.pedidoSeleccionado()?.id}?`,
        header: 'Confirmación',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.enviarEstado();
        }
      });
    } else {
      this.enviarEstado();
    }
  }

  enviarEstado() {
    const pedido = this.pedidoSeleccionado()!;

    this.pedidosService.actualizarEstado(
      pedido.id!,
      this.formEstado.value.estado!,
      this.formEstado.value.reintegrar_stock === true
    ).subscribe({
      next: (data) => {
        this.toastService.add({ severity: 'success', summary: data.message });
        this.verDialogo.set(false);
        this.obtenerPedidos();
      },
      error: (e: HttpErrorResponse) => {
        this.toastService.add({ severity: 'error', summary: 'Error', detail: e.error?.message ?? 'No se pudo actualizar el estado' });
      }
    });
  }

  // Color del tag según el estado (como el getSeverity de la lista de productos)
  getSeverity(estado: string) {
    switch (estado) {
      case 'Entregado':
        return 'success';
      case 'Enviado':
      case 'Procesando':
        return 'info';
      case 'Cancelado':
        return 'danger';
      default:
        return 'warn';
    }
  }
}
