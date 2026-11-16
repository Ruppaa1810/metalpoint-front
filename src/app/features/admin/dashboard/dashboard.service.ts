import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private httpClient = inject(HttpClient);

  private apiURL = `${environment.apiURL}dashboard`;

  obtenerResumen() {
    return this.httpClient.get<any>(this.apiURL);
  }
}
