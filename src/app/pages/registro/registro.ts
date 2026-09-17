import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-registro',
  imports: [ReactiveFormsModule, RouterLink, ButtonModule, InputTextModule, PasswordModule, ToastModule],
  templateUrl: './registro.html',
})
export class Registro {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private messageService = inject(MessageService);

  formulario: FormGroup;
  cargando = signal(false);

  constructor() {
    this.formulario = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(255)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      password_confirmation: ['', [Validators.required]],
    });
  }

  enviar() {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.cargando.set(true);

    this.auth.register(this.formulario.value).subscribe({
      next: (respuesta) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Cuenta creada',
          detail: 'Tu cuenta se creó correctamente.',
        });
        setTimeout(() => this.router.navigate(['/']), 1000);
      },
      error: (error) => {
        this.cargando.set(false);
        const mensaje = error.error?.message || 'Error al crear la cuenta.';
        this.messageService.add({ severity: 'error', summary: 'Error', detail: mensaje });
      },
    });
  }
}
