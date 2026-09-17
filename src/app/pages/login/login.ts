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
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, ButtonModule, InputTextModule, PasswordModule, ToastModule],
  templateUrl: './login.html',
})
export class Login {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private messageService = inject(MessageService);

  formulario: FormGroup;
  cargando = signal(false);

  constructor() {
    this.formulario = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  enviar() {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.cargando.set(true);

    this.auth.login(this.formulario.value.email, this.formulario.value.password).subscribe({
      next: (respuesta) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Bienvenido',
          detail: `Hola, ${respuesta.usuario.name}`,
        });
        setTimeout(() => this.router.navigate(['/']), 1000);
      },
      error: (error) => {
        this.cargando.set(false);
        const mensaje = error.error?.message || 'Credenciales incorrectas.';
        this.messageService.add({ severity: 'error', summary: 'Error', detail: mensaje });
      },
    });
  }
}
