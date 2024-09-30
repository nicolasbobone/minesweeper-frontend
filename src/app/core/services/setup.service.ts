import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Api } from '../models/api.interface';
import { Setup } from '../models/setup.interface';

@Injectable({
  providedIn: 'root',
})
export class SetupService {
  private http = inject(HttpClient);
  private url = 'http://localhost:3000';

  getSetup(): Observable<Api<Setup>> {
    return this.http.get<Api<Setup>>(`${this.url}/setup`);
  }

  update(setup: Setup): Observable<Api<Setup>> {
    return this.http.post<Api<Setup>>(`${this.url}/setup`, setup);
  }
}
