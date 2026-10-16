import { Component } from '@angular/core';
import { Button } from "primeng/button";
import { InputTextModule } from 'primeng/inputtext';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-form-marca',
  imports: [Button, InputTextModule, RouterLink],
  templateUrl: './form-marca.html',
  styles: ``,
})
export class FormMarca {

}