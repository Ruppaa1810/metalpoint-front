import { Component, inject, signal } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [InputTextModule, PasswordModule, ButtonModule, CardModule,
    ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styles: ``,
})
export class Login {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private toastService = inject(MessageService);
  private router = inject(Router);

  protected isLoading = signal(false);

  formLogin = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  login() {
    if (this.formLogin.invalid) {
      this.formLogin.markAllAsTouched();
      this.toastService.add({ severity: 'warn', summary: 'Por favor, rellena todos los campos', life: 5000 });
      return;
    }

    this.isLoading.set(true);

    let email = this.formLogin.get('email')?.value;
    let password = this.formLogin.get('password')?.value;

    this.authService.login(email!, password!).pipe(
      finalize(() => { this.isLoading.set(false) })
    ).subscribe({
      next: (response) => {
        this.toastService.add({
          severity: 'success', summary: response.message,
          detail: `Se ha iniciado sesión como ${response.role}`, life: 5000
        });
        this.router.navigate(['/admin/lista-categorias']);
      },
      error: (error: HttpErrorResponse) => {
        switch (error.status) {
          case 401:
            this.toastService.add({ severity: 'warn', summary: error.error.message, life: 5000 });
            break;
          case 429:
            this.toastService.add({ severity: 'warn', summary: 'Demasiados intentos, espera un minuto', life: 5000 });
            break;
          default:
            this.toastService.add({ severity: 'error', summary: 'Error inesperado, intenta de nuevo', life: 5000 });
            break;
        }
      }
    });
  }

}
