import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, of, switchMap, tap } from 'rxjs';
import { Api } from '../models/api.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private url = 'http://localhost:3000';
  private token: null | string = null;
  private user: null | any = null;
  private expiresAt: number | null = null;
  private userAuthSubject = new BehaviorSubject<any>(null);

  constructor() {
    const user = this.getUserFromSession();
    this.userAuthSubject.next({ isAuthenticated: user ? true : false, user });
  }

  login(credentials: any): Observable<Api<any>> {
    return this.http.post<Api<any>>(`${this.url}/auth/login`, credentials).pipe(
      tap((response: any) => {
        if (!response.error) {
          this.setToken(response.data.token, response.expiresIn);
        }
      }),
    );
  }

  register(user: any): Observable<Api<any>> {
    return this.http.post<Api<any>>(`${this.url}/auth/register`, user);
  }

  refreshToken(): Observable<Api<any>> {
    return this.http.get<Api<any>>(`${this.url}/auth/refresh-token`).pipe(
      tap((response: any) => {
        if (!response.error) {
          this.setToken(response.data.token, response.expiresIn);
        } else {
          this.setToken(null, null);
        }
      }),
    );
  }

  private setToken(token: string | null, expiresIn: number | null): void {
    this.token = token;
    this.expiresAt = expiresIn;
    this.setUserAuth();
  }

  private isTokenExpired(): boolean {
    return this.expiresAt ? Date.now() > this.expiresAt : true;
  }

  getToken(): Observable<string | null> {
    if (this.token && !this.isTokenExpired()) {
      return of(this.token);
    }
    return this.refreshToken().pipe(
      switchMap(() => of(this.token)),
      catchError((error) => {
        this.setToken(null, null);
        return of(null);
      }),
    );
  }

  setUserAuth(): any {
    if (!this.token) return null;
    const payload = this.token.split('.')[1];
    const decoded = atob(payload);
    this.user = JSON.parse(decoded);
    sessionStorage.setItem('user', JSON.stringify(this.user));
    this.userAuthSubject.next({ isAuthenticated: true, user: this.getUserFromSession() });
  }

  private getUserFromSession(): any {
    const user = sessionStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  getUserAuth(): Observable<any> {
    return this.userAuthSubject.asObservable();
  }

  logout(): Observable<Api<any>> {
    sessionStorage.removeItem('user');
    this.user = null;
    this.userAuthSubject.next({ isAuthenticated: false, user: null });
    return this.http.get<Api<any>>(`${this.url}/auth/logout`);
  }
}
