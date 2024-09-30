import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Api } from '../models/api.interface';
import { Game } from '../models/game.interface';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private http = inject(HttpClient);
  private url = 'http://localhost:3000';

  get(filters: Partial<Game>): Observable<Api<any>> {
    return this.http.post<Api<any>>(`${this.url}/game`, filters);
  }

  startGame(): Observable<Api<any>> {
    return this.http.post<Api<any>>(`${this.url}/game/create`, {});
  }

  updateGame(id: number, game: Partial<Game>): Observable<Api<any>> {
    return this.http.put<Api<any>>(`${this.url}/game/${id}`, game);
  }
}
