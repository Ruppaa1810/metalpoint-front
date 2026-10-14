import { Component } from '@angular/core';
import { Sidebar } from '../../../shared/components/sidebar/sidebar';
import { RouterLink, RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-admin-layout',
  imports: [Sidebar, RouterOutlet, RouterLink],
  templateUrl: './admin-layout.html',
})
export class AdminLayout {

}