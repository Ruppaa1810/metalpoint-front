import { Component } from '@angular/core';
import { Button } from "primeng/button";
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { Select } from 'primeng/select';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-form-producto',
  imports: [Button, InputTextModule, TextareaModule, Select, IconFieldModule, InputIconModule, RouterLink],
  templateUrl: './form-producto.html',
  styles: ``,
})
export class FormProducto {
  protected categorias: any[] = [
    { id: 'perfiles', name: 'Perfiles y Hierros' },
    { id: 'abrasivos', name: 'Abrasivos y Corte' },
    { id: 'soldadura', name: 'Soldadura e Insumos' },
  ];

  protected marcas: any[] = [
    { id: 'acindar', name: 'Acindar' },
    { id: 'sinpar', name: 'Sinpar' },
    { id: 'conarco', name: 'Conarco' },
    { id: 'generico', name: 'Genérico' },
  ];

  protected unidades: any[] = [
    { id: 'unidad', name: 'Por unidad' },
    { id: 'metro', name: 'Por metro' },
    { id: 'kg', name: 'Por kg' },
    { id: 'm2', name: 'Por m²' },
  ];
}