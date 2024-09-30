import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { AuthService } from '../core/services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.getUserAuth().pipe(
    map((userAuth) => {
      if (userAuth.isAuthenticated) {
        return true;
      } else {
        router.navigate(['/auth/login']);
        return false;
      }
    }),
  );
};
