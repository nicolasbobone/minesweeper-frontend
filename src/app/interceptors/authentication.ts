import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../core/services/auth.service';
import { ToastService } from '../core/services/toast.service';

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {
  authService = inject(AuthService);
  toastService = inject(ToastService);
  baseUrl = 'http://localhost:3000/auth';
  publicRequest = [
    `${this.baseUrl}/login`,
    `${this.baseUrl}/refresh-token`,
    `${this.baseUrl}/logout`,
    `${this.baseUrl}/register`,
  ];

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.publicRequest.includes(req.url)) {
      const publicReq = req.clone({ withCredentials: true });
      return next.handle(publicReq).pipe(
        catchError((err) => {
          this.toastService.setToast({ type: 'ERROR', message: err.error.message });
          return throwError(() => err);
        }),
      );
    }

    return this.authService.getToken().pipe(
      switchMap((token) => {
        if (!token) {
          return next.handle(req);
        }

        const clonedReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        });

        return next.handle(clonedReq);
      }),
      catchError((err) => {
        this.toastService.setToast({ type: 'ERROR', message: err.error.message });
        return throwError(() => err);
      }),
    );
  }
}
