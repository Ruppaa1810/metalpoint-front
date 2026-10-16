import { Component } from '@angular/core';
import { Button } from "primeng/button";
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { Select } from 'primeng/select';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-form-categoria',
  imports: [Button, InputTextModule, TextareaModule, Select, IconFieldModule, InputIconModule, RouterLink],
  templateUrl: './form-categoria.html',
  styles: ``,
})
export class FormCategoria {

}