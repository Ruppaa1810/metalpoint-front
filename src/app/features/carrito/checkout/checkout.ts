import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DividerModule } from 'primeng/divider';
import { MessageService } from 'primeng/api';
import { finalize } from 'rxjs';
import { CarritoService } from '../../../core/services/carrito.service';
import { PedidosService } from '../../../core/services/pedidos.service';
import { Pedido } from '../../../core/models/pedido.model';

@Component({
  selector: 'app-checkout',
  imports: [RouterLink, ReactiveFormsModule, ButtonModule, InputTextModule, TextareaModule, RadioButtonModule, DividerModule],
  templateUrl: './checkout.html',
  styles: ``,
})
export class Checkout {
  private fb = inject(FormBuilder);
  protected carritoService = inject(CarritoService);
  private pedidosService = inject(PedidosService);
  private toastService = inject(MessageService);

  protected isLoading = signal(false);
  // Cuando la compra sale bien se guarda acá y se muestra la confirmación
  protected pedidoConfirmado = signal<Pedido | null>(null);

  // Métodos de pago simulados (Notion, RF-MP-001)
  metodos = [
    { id: 'Tarjeta', name: 'Tarjeta de Crédito/Débito' },
    { id: 'Transferencia', name: 'Transferencia Bancaria' },
    { id: 'Efectivo', name: 'Pago en Efectivo' },
  ];

  formCheckout = this.fb.group({
    direccion_envio: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(255)]],
    metodo_pago: ['Tarjeta', [Validators.required]],
    numero_tarjeta: [''],
    vencimiento: [''],
    cvv: [''],
  });

  ngOnInit() {
    this.validarTarjeta('Tarjeta');

    // Cuando cambia el método de pago, los datos de la tarjeta pasan a ser obligatorios o no
    this.formCheckout.get('metodo_pago')?.valueChanges.subscribe(metodo => {
      this.validarTarjeta(metodo);
    });
  }

  validarTarjeta(metodo: string | null) {
    const numero = this.formCheckout.get('numero_tarjeta');
    const vencimiento = this.formCheckout.get('vencimiento');
    const cvv = this.formCheckout.get('cvv');

    if (metodo === 'Tarjeta') {
      numero?.setValidators([Validators.required, Validators.pattern(/^\d{16}$/)]);
      vencimiento?.setValidators([Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]);
      cvv?.setValidators([Validators.required, Validators.pattern(/^\d{3}$/)]);
    } else {
      numero?.clearValidators();
      vencimiento?.clearValidators();
      cvv?.clearValidators();
    }

    numero?.updateValueAndValidity();
    vencimiento?.updateValueAndValidity();
    cvv?.updateValueAndValidity();
  }

  confirmarPedido() {
    if (this.formCheckout.invalid) {
      this.formCheckout.markAllAsTouched();
      return;
    }

    const datos = this.formCheckout.value;

    // Lo que espera la API: dirección, método, tarjeta (si corresponde) y los productos del carrito
    const pedido = {
      direccion_envio: datos.direccion_envio,
      metodo_pago: datos.metodo_pago,
      numero_tarjeta: datos.metodo_pago === 'Tarjeta' ? datos.numero_tarjeta : null,
      productos: this.carritoService.items().map(item => ({
        producto_id: item.producto.id,
        cantidad: item.cantidad,
      })),
    };

    this.isLoading.set(true);

    this.pedidosService.crearPedido(pedido).pipe(
      finalize(() => { this.isLoading.set(false) })
    ).subscribe({
      next: (data) => {
        this.pedidoConfirmado.set(data.data);
        this.carritoService.vaciar();
        this.toastService.add({ severity: 'success', summary: data.message, life: 5000 });
      },
      error: (e: HttpErrorResponse) => {
        // 402 = tarjeta rechazada, 422 = falta stock. El carrito queda igual para reintentar
        if (e.status === 402 || e.status === 422) {
          this.toastService.add({ severity: 'error', summary: 'No se pudo confirmar el pedido', detail: e.error?.message, life: 6000 });
        } else {
          this.toastService.add({ severity: 'error', summary: 'Error inesperado, intenta de nuevo', life: 5000 });
        }
      }
    });
  }
}
