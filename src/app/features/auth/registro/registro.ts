import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { finalize } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-registro',
  imports: [RouterLink, ReactiveFormsModule, InputTextModule, PasswordModule, ButtonModule],
  templateUrl: './registro.html',
  styles: ``,
})
export class Registro {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private toastService = inject(MessageService);
  private router = inject(Router);

  protected isLoading = signal(false);

  // Validador personalizado para verificar que las contraseñas coincidan
  // Va en el formulario entero (no en un campo) porque compara dos campos
  private passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password');
    const confirmPassword = control.get('password_confirmation');

    if (!password || !confirmPassword) {
      return null;
    }

    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  };

  formRegistro = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    password_confirmation: ['', [Validators.required]],
  }, { validators: this.passwordMatchValidator });

  registrar() {
    if (this.formRegistro.invalid) {
      this.formRegistro.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);

    this.authService.register(
      this.formRegistro.value.name!,
      this.formRegistro.value.email!,
      this.formRegistro.value.password!
    ).pipe(
      finalize(() => { this.isLoading.set(false) })
    ).subscribe({
      next: (data) => {
        this.toastService.add({ severity: 'success', summary: data.message, detail: 'Ya podés iniciar sesión', life: 5000 });
        this.router.navigate(['/login']);
      },
      error: (e: HttpErrorResponse) => {
        let mensaje = 'Error inesperado, intenta de nuevo';

        // La API devuelve 400 con los errores de validación
        if (e.status === 400 && e.error?.email) {
          mensaje = 'Ya existe una cuenta con ese email';
        } else if (e.status === 400) {
          mensaje = 'Los datos enviados no son válidos';
        }

        this.toastService.add({ severity: 'error', summary: 'Error', detail: mensaje, life: 5000 });
      }
    });
  }
}
